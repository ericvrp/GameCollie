const fs     = require('fs')
const xmldoc = require('xmldoc') // https://github.com/nfarina/xmldoc


// const thegamesdb = require('thegamesdb') // https://github.com/nauzethc/thegamesdb-api && http://wiki.thegamesdb.net/index.php/API_Introduction
//
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

const Xml2JSON = (filename, srcPlatform, dstPlatform) => {
  // console.log('GamelistXml2JSON', filename)

  const xml      = fs.readFileSync(filename, 'utf8')
  const gameList = new xmldoc.XmlDocument(xml)

  const games    = []
  for (const g of gameList.childrenNamed('game')) {
    const game = {id: g.attr.id, source: g.attr.source}
    g.eachChild(child => game[child.name] = child.val)
    // preprocess to make live it easier later on (sorting...)
    game.srcPlatform = srcPlatform
    game.platform    = dstPlatform
    game.path        = game.path.startsWith('./') ? game.path.slice(2) : game.path
    game.players     = game.players || 1
    game.genre       = game.genre.toLowerCase()
    game.rating      = game.rating ? parseFloat(game.rating) : -0.5 // prefer identifyable games
    // TODO: find playability on my platform 
    games.push(game)
  }

  return games
}

const AdjustRating = (games, ratingAdjustments) => {
  games.forEach(game => {
    // console.log(game)
    for (const ratingAdjustment of ratingAdjustments) {
      // console.log(ratingAdjustment)
      if (game[ratingAdjustment.field].toString().toLowerCase().includes(ratingAdjustment.contains.toLowerCase())) {
        game.rating += ratingAdjustment.adjustment
      }
    }
  })
}

const SortByRating = (games) => {
  games.sort((a, b) => parseFloat(a.rating) - parseFloat(b.rating))
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
  AdjustRating,
  SortByRating,
  WithID
}
