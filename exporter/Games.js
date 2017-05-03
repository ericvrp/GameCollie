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

const GetRegion = (game) => { // P.S. I'm on good with regular expression. Can you tell?
  const s = (game.name || game.path).toLowerCase()
  // console.log(s)
  const startIndex = s.indexOf('(')
  const endIndex   = s.lastIndexOf(')')
  if (startIndex === -1 || endIndex === -1) return 'unknown'

  const region = s.substring(startIndex+1, endIndex).replace(' ', '')
  // console.log('region', region, 'game', s)
  return region
}

const GetCleanName = (game) => { // P.S. I'm on good with regular expression. Can you tell?
  let { name } = game

  let i = name.indexOf('(')
  if (i >= 0) name = name.slice(0, i)

  i = name.indexOf('[')
  if (i >= 0) name = name.slice(0, i)

  name = name.replace('/', '-')
  name = name.replace(':', '-')
  name = name.replace('_', ' ')
  return name.trim()
}

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
    // game.path        = game.path.startsWith('./')  ? game.path.slice(2)  : game.path
    // game.image       = game.image && game.image.startsWith('./') ? game.image.slice(2) : game.image
    game.players     = game.players || 1
    game.genre       = game.genre.toLowerCase()
    game.rating      = game.rating ? parseFloat(game.rating) : -0.5 // prefer identifyable games
    game.region      = GetRegion(game)
    game.name        = GetCleanName(game)

    // TODO: find playability on my platform

    games.push(game)
  }

  return games
}

const JSON2Xml = (filename, games) => {
  // console.log(filename, games)
  const file = fs.createWriteStream(filename)
  file.write('<?xml version="1.0" encoding="UTF-8"?>\n')
  file.write('  <gameList>\n')
  for (const game of games) {
    file.write(`    <game id="${game.id}" source="${game.source}">\n`)
    for (const key of Object.keys(game)) {
      if (key === 'id' || key === 'source') continue

      let value = game[key]
      // if (key.indexOf('psx') >= 0) and value.indexOf('.bin') >= 0) {
      //   // XXX this is a little hack because RetroPie's emulationstation doesn't show pictures when we use the .bin extension
      //   value = s.replace('.bin', '.cue')
      // }

      file.write(`      <${key}>${value}</${key}>\n`)
    }
    file.write('    </game>\n')
  }
  file.write('  </gameList>\n')
}

const AdjustRating = (games, ratingAdjustments) => {
  games.forEach(game => {
    // console.log(game)
    for (const ratingAdjustment of ratingAdjustments) {
      // console.log(ratingAdjustment)
      const field = game[ratingAdjustment.field]
      if (field && field.toString().toLowerCase().includes(ratingAdjustment.contains.toLowerCase())) {
        game.rating += ratingAdjustment.adjustment

        if (game.platform === 'psx' && game.name.toLowerCase().includes('oddworld')) {
          console.log('YES', ratingAdjustment)
        }
      } else         if (game.platform === 'psx' && game.name.toLowerCase().includes('oddworld')) {
                console.log('NO ', ratingAdjustment)
              }

    }
    if (game.platform === 'psx' && game.name.toLowerCase().includes('oddworld')) {
              console.log(game)
            }
  })

}

const SortByRating = (games) => {
  games.sort((a, b) => parseFloat(a.rating) - parseFloat(b.rating))
  // games.reverse()
}

const GroupBy = (groupBy) => {
  console.log('TODO: GroupBy', groupBy)
}

const NumberOfGamesWithID = (games) => {
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
  GroupBy,
  NumberOfGamesWithID,
  JSON2Xml,
}
