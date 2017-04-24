const settings   = require('./settings.json')
// console.log(JSON.stringify(settings, null, 2))

const fs         = require('fs')
// const xmldoc     = require('xmldoc') // https://github.com/nfarina/xmldoc
// const thegamesdb = require('thegamesdb') // https://github.com/nauzethc/thegamesdb-api && http://wiki.thegamesdb.net/index.php/API_Introduction

const Games = require('./Games')

// returns list of subdirectories
const lsdir = p => fs.readdirSync(p).filter(f => fs.statSync(p+'/'+f).isDirectory())

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
const genres           = {}
const platformGames    = {}
const platformChoices  = []
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

  platformGames[dstPlatform] = Games.Xml2JSON(gamelistXml, dstPlatform)
  platformGames[dstPlatform].forEach(game => genres[game.genre] = true)

  // TODO: use genreWeight
  Games.AdjustRanking(platformGames[dstPlatform], settings.rankingAdjustments)
  Games.SortByRanking(platformGames[dstPlatform])

  const nNewChoices = settings.platformWeight[dstPlatform]
  for (let n = 0;n < nNewChoices;n++) {
    platformChoices.push(dstPlatform)
  }

  console.log(srcPlatform, '=>', dstPlatform, 'with', Games.WithID(platformGames[dstPlatform]), 'out of', platformGames[dstPlatform].length, 'games found')
}

// console.log('Platform choices:', platformChoices.join(' '))
console.warn('Skipped platforms (without gamelist.xml):', skippedPlatforms.join(' '))

if (settings.limit.maxDstPercentage) {
  console.error('Not supported: settings.limit.maxDstPercentage =', settings.limit.maxDstPercentage)
}

for (let n = 0;n < settings.limit.maxGames;n++) {
  var choice = platformChoices[Math.floor(Math.random() * platformChoices.length)]
  console.log('Pick game', n+1, 'from', choice)
}

// console.log('Genres:' + Object.keys(genres).join(' '))
