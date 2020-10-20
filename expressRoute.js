const express = require('express')
const router = express.Router()
const CvrEx = require('./main')

router.post('/organisations', express.json(), async (req, res) => {
  res.json( await CvrEx.fetchBusinesses(req.body) )
})

router.get('/annual-reports/:cvr', async (req, res) => {
  res.json( await CvrEx.fetchAnnualReports(req.params.cvr) )
})

module.exports = router
