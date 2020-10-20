const map = require('./mapCvrV20200115')
const fs = require('fs')

describe(map, () => {
  it('maps', () => {
    const records = JSON.parse(fs.readFileSync(`${__dirname}/fixture-1.txt`).toString())
    const res = records.map(map)
    expect(res).toMatchSnapshot()
  })

  it('maps', () => {
    const records = JSON.parse(fs.readFileSync(`${__dirname}/fixture-2.txt`).toString())
    const res = records.map(map)
    expect(res).toMatchSnapshot()
  })
})
