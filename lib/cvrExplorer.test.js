jest.setTimeout(20000)
const fs = require('fs')
const CvrExplorer = require('./cvrExplorer')
const CvrEx = new CvrExplorer()

describe('CvrEx', () => {

  it('cvrs', async () => {
    const res = await CvrEx.fetchBusinesses({ limit: 1, cvrs: ['32685552'] })
    expect(res?.hits[0]?.name).toEqual('DKWEBHOST')
  })

  it('cvrs', async () => {
    const res = await CvrEx.fetchBusinesses({ limit: 5, cvrs: ['32685552','32345794'] })
    expect(res.total).toEqual(2)
    expect(res?.hits.map(obj => obj.name).sort()).toEqual(['DKWEBHOST','MAERSK A/S'].sort())
  })

  it('names', async () => {
    const res = await CvrEx.fetchBusinesses({ limit: 3, names: ['dkwebhost'] })
    expect(res.hits[0].name).toEqual('DKWEBHOST')
  })

  it('names', async () => {
    const res = await CvrEx.fetchBusinesses({ limit: 3, names: ['MAERSK A/S'] })
    expect(res.hits.length > 0).toBeTruthy()
    expect(res.hits.find(i => i.name.match(/MAERSK|MÆRSK/i))).toBeDefined()
  })

  it('names, types, branchCodes', async () => {
    const res = await CvrEx.fetchBusinesses({
      limit: 3,
      names: ['dkwebhost','mærsk as'],
      types: [ CvrEx.TYPES.ENK, CvrEx.TYPES.AS, ],
      branchCodes: [ 502000, 582900 ]
    })
    expect(res.total < 25).toBeTruthy()
    expect(res.hits.find(i => i.cvr === 32685552)).toBeDefined()
    expect(res.hits.find(i => i.cvr === 32345794)).toBeDefined()
  })

  it('names, active false', async () => {
    const res = await CvrEx.fetchBusinesses({ limit: 3, names: ['dkwebhost'], active: false })
    expect(res.hits.length).toEqual(0)
  })

  it('cvrs, active false', async () => {
    const res = await CvrEx.fetchBusinesses({
      limit: 3,
      // kp transport, dkwebhost
      cvrs: [40704809, 32685552],
      active: false
    })
    expect(res.hits.length).toEqual(1)
    expect(res.hits[0].name).toEqual('KP Trans')
  })

  it('regions capital', async () => {
    const res = await CvrEx.fetchBusinesses({ limit: 3, cvrs: [ 32685552, 32345794 ], regions: [ CvrEx.REGIONS.CAPITAL ] })
    expect(res.total).toEqual(2)
  })

  it('regions south', async () => {
    const res = await CvrEx.fetchBusinesses({ limit: 3, cvrs: [ 32685552, 32345794 ], regions: [ CvrEx.REGIONS.SOUTH ] })
    expect(res.total).toEqual(0)
  })

  it('raw', async () => {
    const res = await CvrEx.fetchBusinesses({ limit: 3, names: ['dkwebhost'], raw: true })
    expect(res.total > 0).toBeTruthy()
    expect(!!res.hits[0]._source).toBeTruthy()
  })

  it('fetchBusinessesToFile', async () => {
    const { path } = await CvrEx.fetchBusinessesToFile({
      dir: __dirname, limit: 5000, active: true
    })
    const is = fs.existsSync(path)
    fs.unlinkSync(path)
    expect(is).toBeTruthy()
  })

  it('fetchAnnualReports', async () => {
    const res = await CvrEx.fetchAnnualReports(22756214)
    expect(res.length > 0).toBeTruthy()
  })

})
