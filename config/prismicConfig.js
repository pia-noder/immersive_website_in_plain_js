import 'dotenv/config'
// node-fetch is used to make network requests to the Prismic Rest API. 
// In Node.js Prismic projects, you must provide a fetch method to the
// Prismic client.
import fetch from 'node-fetch'
import * as prismic from '@prismicio/client'

const accessToken = process.env.PRISMIC_ACCESS_TOKEN // If your repo is private, add an access token.
const endpoint = process.env.PRISMIC_ENDPOINT // Format your endpoint.

// The `routes` property is your Route Resolver. It defines how you will 
// structure URLs in your project. Update the types to match the Custom 
// Types in your project, and edit the paths to match the routing in your 
// project.
const routes = [
  {
    type: 'home',
    path: '/',
  },
  {
    type: 'about',
    path:'/about',
  },
  {
    type: 'product',
    path: '/product/:uid',
  },
  {
    type: 'collection',
    path: '/collection',
  },
]


export const client = prismic.createClient(endpoint, { 
  fetch, 
  accessToken,
 routes,
})
