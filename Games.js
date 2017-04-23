const fs     = require('fs')
const xmldoc = require('xmldoc') // https://github.com/nfarina/xmldoc


// const logPlatform = (gamelistXml) => {
//   // console.log(gamelistXml) // const gamelistXml = settings.gameCollection.src + '/psx/gamelist.xml'
//
//   const xml = fs.readFileSync(gamelistXml, 'utf8')
//   const gameList = new xmldoc.XmlDocument(xml)
//   const games = gameList.childrenNamed('game')
//
//   for (const game of games) {
//     if (!game.attr.id) continue
//     // note: we could cash the platform of all games so we don't have to access thegamedb
//     // console.log(game.attr)
//     thegamesdb.getGame({id: game.attr.id}).then(result => {
//       console.log(gamelistXml, '=', result.platform)
//     }).catch(reason => console.error(reason))
//     break
//   }
// }

const Xml2JSON = (filename) => {
  // console.log('GamelistXml2JSON', filename)

  const xml      = fs.readFileSync(filename, 'utf8')
  const gameList = new xmldoc.XmlDocument(xml)

  const games    = []
  for (const g of gameList.childrenNamed('game')) {
    const game = {id: g.attr.id, source: g.attr.source}
    g.eachChild(child => game[child.name] = child.val)
    games.push(game)
  }

  return games
}

const WithID = (games) => {
  let n = 0
  for (const game of games) {
    if (game.id)  n++
  }
  return n
}

module.exports = {
  Xml2JSON,
  WithID
}
