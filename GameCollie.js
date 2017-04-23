const settings   = require('./settings.json')
console.log(JSON.stringify(settings, null, 2))

const fs         = require('fs')
const xmldoc     = require('xmldoc') // https://github.com/nfarina/xmldoc
const thegamesdb = require('thegamesdb') // https://github.com/nauzethc/thegamesdb-api && http://wiki.thegamesdb.net/index.php/API_Introduction


const filename = process.argv[2] || 'testgamelists/psx/gamelist.xml'
const xml = fs.readFileSync(filename, 'utf8')
const gameList = new xmldoc.XmlDocument(xml)
const games = gameList.childrenNamed('game')
for (const game of games) {
  if (!game.attr.id) continue
  thegamesdb.getGame({id: game.attr.id}).then(result => {
    console.log(filename, 'is for', result.platform)
  })
  break
}
