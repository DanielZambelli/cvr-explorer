if(require.resolve('dotenv'))
  require('dotenv').config()

const fetch = require('node-fetch')
const fs = require('fs')
const uuid = require('uuid').v4
const elasticSearchQuery = require('./elasticSearchQuery')
const mapCvrV20200115 = require('./mappers/mapCvrV20200115')
const URL_REQUEST_WITH_SCROLL = 'http://distribution.virk.dk/cvr-permanent/_search?scroll=2m'
const URL_REQUEST_SCROLL_RESULT = 'http://distribution.virk.dk/_search/scroll'
const URL_REQUEST_FINANCES = 'http://distribution.virk.dk/offentliggoerelser/_search'

class CvrExplorer{

  constructor(secret = process.env.CVR_AUTHENTICATION){
    if(!secret || typeof secret !== 'string')
      throw new Error('secret is reqiured and must be a string')
    this.secret = secret
  }

  REGIONS = {
    CAPITAL: 'capital',
    ZELAND: 'zealand',
    MIDDLE: 'middle',
    NORTH: 'north',
    SOUTH: 'south',
  }

  TYPES = {
    AS: 'a/s',
    APS: 'aps',
    ENK: 'enk',
    IVS: 'ivs',
    IS: 'is'
  }

  EMPLOYEES = {
    I_0_0: 'ANTAL_0_0',
    I_1_1: 'ANTAL_1_1',
    I_2_4: 'ANTAL_2_4',
    I_5_9: 'ANTAL_5_9',
    I_10_19: 'ANTAL_10_19',
    I_20_49: 'ANTAL_20_49',
    I_50_99: 'ANTAL_50_99',
    I_100_199: 'ANTAL_100_199',
    I_200_499: 'ANTAL_200_499',
    I_500_999: 'ANTAL_500_999',
    I_1000_999999: 'ANTAL_1000_999999',
  }

  _auth(){
    return {
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + Buffer.from(this.secret).toString('base64')
    }
  }

  _map(res, raw = false) {
    const total = res.hits.total
    let hits = res.hits.hits
    if(!raw){
      hits = hits.map(rec => {
        switch(rec._index){
          case 'cvr-v-20200115':
            return mapCvrV20200115(rec)
          default:
            return { raw: rec, error: 'missing mapper for index: ' + rec._index, index: rec._index }
        }
      })
    }
    const payload = { hits, total }
    if(res.hits.hits.length > 0)
      payload.nextPageId = res._scroll_id
    return payload
  }

  _deplay(ms = 15){
    return new Promise(res => setTimeout(res, ms))
  }

  /**
   * fetch businesses that match the options. Ideal for small lookups but not for larger export jobs.
   * @param options see README
   * @returns Promise
   */
  async fetchBusinesses({ limit=500, ...options } = {}){
    options.limit = limit
    const page = await this._fetchPage(options)

    while(page.nextPageId && page.hits.length < limit){
      await this._deplay()
      const nextPage = await this._fetchNextPage(page.nextPageId, options)
      page.hits = page.hits.concat(nextPage.hits)
      page.nextPageId = nextPage.nextPageId
    }
    delete page.nextPageId
    return page
  }

  /**
   * fetch businesses that match the options. Results are streamed to file. Ideal for larger export jobs.
   * @param options dir, delimiter, see README
   */
  async fetchBusinessesToFile({ limit=50000, dir=__dirname, delimiter='^^', ...options } = {}){

    const writableStream = fs.createWriteStream(`${dir}/${uuid()}.txt`)
    const write = (data, delimiter) => new Promise((res) =>
      writableStream.write(delimiter + JSON.stringify(data), res)
    )

    options.limit = limit
    let page = await this._fetchPage(options)
    await write(page.hits, '')
    let count = page.hits.length

    while(page.nextPageId && count < limit){
      await this._deplay()
      page = await this._fetchNextPage(page.nextPageId, options)
      await write(page.hits, delimiter)
      count += page.hits.length
    }
    await new Promise(res => writableStream.end(res))

    return { path: writableStream.path, delimiter }
  }

  _fetchPage(options){
    return fetch(URL_REQUEST_WITH_SCROLL, {
      method: 'POST',
      headers: this._auth(),
      body: JSON.stringify(elasticSearchQuery(options))
    })
      .then(res => res.json())
      .then(res => this._map(res, options.raw))
  }

  _fetchNextPage(nextPageId, options){
    return fetch(URL_REQUEST_SCROLL_RESULT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scroll_id: nextPageId, scroll: '2m' })
    })
    .then(res => res.json())
    .then(res => this._map(res, options.raw))
  }

  /**
   * fetch annual reports
   * @param cvr
   */
  fetchAnnualReports(cvr){
    return fetch(URL_REQUEST_FINANCES, {
      method: 'POST',
      headers: this._auth(),
      body: JSON.stringify({
        from: 0,
        size: 100,
        query: {
          bool: {
            must: [
              { term: { 'dokumenter.dokumentMimeType': 'application' } },
              { term: { 'dokumenter.dokumentMimeType': 'xml' } },
              { term: { 'cvrNummer': cvr } },
            ],
          }
        }
      })
    })
      .then(res => res.json())
      .then(res => res.hits.hits.map(rec => ({
        cvr: rec._source.cvrNummer,
        startDate: rec._source.regnskab.regnskabsperiode.startDato,
        endDate: rec._source.regnskab.regnskabsperiode.slutDato,
        ...rec._source.dokumenter.reduce((map, rec) => {
          if(rec.dokumentType === 'AARSRAPPORT'){
            const match = rec.dokumentMimeType.match(/(pdf|xml)$/i)
            if(match && match[0]) map[match[0] + 'Url'] = rec.dokumentUrl
          }
          return map
        }, {})
      })))
      .then(res =>  res.filter(rec => rec.xmlUrl || rec.pdfUrl))
      .then(res => res.sort(({startDate:a},{startDate:b}) => a > b ? 1 : a < b ? -1 : 0))
  }
}

module.exports = CvrExplorer
