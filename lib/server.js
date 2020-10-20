const express = require('express')
const app = express()

app.use(require('cors')())
app.use(require('./expressRoute'))
app.listen(80, () => console.log('server running'))
