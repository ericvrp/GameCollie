const settings   = require('./settings.json')
// console.log(JSON.stringify(settings, null, 2))

const fs         = require('fs')
const xmldoc     = require('xmldoc') // https://github.com/nfarina/xmldoc
const thegamesdb = require('thegamesdb') // https://github.com/nauzethc/thegamesdb-api && http://wiki.thegamesdb.net/index.php/API_Introduction

// returns list of subdirectories
const lsdir = p => fs.readdirSync(p).filter(f => fs.statSync(p+'/'+f).isDirectory())

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

const getDstPlatform = (srcPlatform) => {
  for (const dstPlatform in settings.platformAliases) {
    const s = srcPlatform.toLowerCase()
    if (s === dstPlatform || settings.platformAliases[dstPlatform].includes(s)) {
      return dstPlatform
    }
  }
  return '<unknown platform>'
}

// main
const platformChoices = []
const skippedPlatforms = [] // no gamelist.xml
const srcPlatforms = lsdir(settings.gameCollection.src)
for (const srcPlatform of srcPlatforms) {
  const gamelistXml = settings.gameCollection.src + '/' + srcPlatform + '/gamelist.xml'
  const hasGameListXml = fs.existsSync(gamelistXml)

  const dstPlatform = getDstPlatform(srcPlatform)
  if (!hasGameListXml) {
    skippedPlatforms.push(dstPlatform)
    continue
  }

  const nNewChoices = settings.platformWeight[dstPlatform]
  for (let n = 0;n < nNewChoices;n++) {
    platformChoices.push(dstPlatform)
  }

  console.log(srcPlatform, '=>', dstPlatform)

  // logPlatform(gamelistXml)
}

// console.log('Platform choices:', platformChoices.join(' '))
console.warn('Skipped platforms without gamelist.xml:', skippedPlatforms)

if (settings.limit.maxDstPercentage) {
  console.error('Not supported: settings.limit.maxDstPercentage =', settings.limit.maxDstPercentage)
}

for (let n = 0;n < settings.limit.maxGames;n++) {
  var choice = platformChoices[Math.floor(Math.random() * platformChoices.length)]
  console.log('Pick game', n+1, 'from', choice)
}
