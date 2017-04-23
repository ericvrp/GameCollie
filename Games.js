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
    // preprocess to make live it easier later on (sorting...)
    game.ranking = game.ranking || 0
    game.genre   = game.genre.toLowerCase()
    games.push(game)
  }

  return games
}

const AdjustRanking = (games, phrases, adjustment) => {
  games.forEach(game => {
    const name = game.name.toLowerCase()
    for (const phrase of phrases) {
      if (name.includes(phrase.toLowerCase())) {
        game.ranking += adjustment
        // console.log(game.ranking, name)
      }
    }
  })
}

const SortByRanking = (games) => {
  games.sort((a, b) => parseFloat(a.ranking) - parseFloat(b.ranking))
  // games.reverse()
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
  AdjustRanking,
  SortByRanking,
  WithID
}
