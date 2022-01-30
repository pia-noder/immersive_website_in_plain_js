//express server => backend (toutes les vues/views seront construite dans le back)
const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.render('') 
})

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})