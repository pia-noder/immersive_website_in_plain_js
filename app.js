import 'dotenv/config'

process.env.PRISMIC_ENDPOINT
//express server => backend (toutes les vues/views seront construite dans le back)
import express from 'express'
const app = express()

import path from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const port = 3000

// Add a middleware function that runs on every route. It will inject 
// the prismic context to the locals so that we can access these in 
// our templates.
import UAParser from 'ua-parser-js'
import * as prismicH from '@prismicio/helpers'
import  PrismicDOM  from 'prismic-dom'
import { client} from './config/prismicConfig.js'
app.use((req, res, next) => {
  res.locals.ctx = {
    prismicH,
  }
  next()
})

const handleLinkResolver = doc => {
  if (doc.type === 'product') {
    return `/detail/${doc.uid}`
  }

  if (doc.type === 'collections') {
    return '/collections'
  }

  if (doc.type === 'about') {
    return '/about'
  }

  return '/'
}

app.use((req, res, next) => {
  const ua = UAParser(req.headers['user-agent'])

  res.locals.isDesktop = ua.device.type === undefined
  res.locals.isPhone = ua.device.type === 'mobile'
  res.locals.isTablet = ua.device.type === 'tablet'

  res.locals.Link = handleLinkResolver

  res.locals.Numbers = index => {
    return index == 0 ? 'One' : index == 1 ? 'Two' : index == 2 ? 'Three' : index == 3 ? 'Four' : '';
  }

  res.locals.PrismicDOM = PrismicDOM

  next()
})

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.get('/', async (req, res) => {
  const document = await client.getSingle('home')
  res.render('pages/home',  { document }) 
})

app.get('/about', async (req, res) => {
  const document = await client.getSingle('about')
  console.log(document.data.body[1].primary.description)
  res.render('pages/about',  { document }) 
})

app.get('/collections', async (req, res) => {
  const document = await client.getSingle('collection')
  res.render('pages/collections',{ document } ) 
})
app.get('/product/:uid', async (req, res) => {
  const document = await client.getSingle('product')
  res.render('pages/product', { document }) 
})

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})