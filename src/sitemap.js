const { createWriteStream } = require('fs')
const { SitemapStream } = require('sitemap')

const hostname = 'https://www.librarymap.co.uk'

const urls = [
  { url: '/', changefreq: 'daily', priority: 1 },
  { url: '/#/map', changefreq: 'daily', priority: 1 },
  { url: '/#/accessibility', changefreq: 'monthly', priority: 0.7 },
  { url: '/#/data', changefreq: 'monthly', priority: 0.5 },
  { url: '/#/privacy', changefreq: 'monthly', priority: 0.6 }
]

// Creates a sitemap object given the input configuration with URLs
const sitemap = new SitemapStream({ hostname })

const writeStream = createWriteStream('./public/sitemap.xml')
sitemap.pipe(writeStream)

urls.forEach(item => sitemap.write(item))

sitemap.end()
