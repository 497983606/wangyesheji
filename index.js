// AUTHOR TAIWU@GMAIL.COM
// THIS A EASY OF STATIC WEBSITE GENERATE 

// IMPORT PROJECTION CONFIG FROM "PACKAGE.JSON"

const path = require("path");
const fs = require("fs");
const express = require('express')

const app = express()
const Generate = require('./_utils/generate')
const { config } = require('./package.json')

// GAIN NODE PARAMS
const args = process.argv.slice(2);


// ALL DIR PATH
const _tmplPath = path.join(__dirname, "_tmpl"),
      _postPath = path.join(__dirname, "_post"),
      _htmlPath = path.join(__dirname, "docs")
// GENERATE FILL FUNCTION
// IT'S FLOW AS 
const generate = () => {
  const tmpls = fs.readdirSync(_tmplPath)
  const markdowns = fs.readdirSync(_postPath)
        try{
          Generate(tmpls, markdowns)
          console.log('Generate all file success 😊 !!' )
        }catch(err){
          
        }
        
}

const startServe = () => {
  app.use('/', express.static(_htmlPath))
  const port = config.port
  app.listen(port, () => {
    console.log(`app listening on port ${port}`)
  })

}

const newPost = (title, type) => {
  let date = new Date().getTime()
  let str = `<!-- ${date} -->\n<!-- ${title} -->\n<!-- ${title} 的前言 -->\n<!-- ${title} 的缩略图url -->\n<!-- ${ type || config.website.defCategory} -->`
  let error = fs.writeFileSync(_postPath + '/' + title+'.md', str, 'utf8')
  if(!error) console.log('Docment:'+title+'.md crtated--'+date)
}

if(args[0] == 'gen') generate()
else if(args[0] == 'serve') startServe()
else if(args[0] == 'new') newPost(args[1], args[2])