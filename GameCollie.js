const settings   = require('./settings.json')
// console.log(JSON.stringify(settings, null, 2))
if (settings.limit.maxDstPercentage) {
  console.error('Not supported: settings.limit.maxDstPercentage =', settings.limit.maxDstPercentage)
}
debug = false

const fs     = require('fs')
const mkdirp = require('mkdirp') // https://github.com/substack/node-mkdirp
const Games  = require('./Games')



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


// determine game ratings and platforms we will select games for
const genres           = {}
const platformGames    = {}
let   platformChoices  = []
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

  platformGames[dstPlatform] = Games.Xml2JSON(gamelistXml, srcPlatform, dstPlatform)
  platformGames[dstPlatform].forEach(game => genres[game.genre] = true)

  Games.AdjustRating(platformGames[dstPlatform], settings.ratingAdjustments)
  Games.SortByRating(platformGames[dstPlatform])

  const nNewChoices = settings.platformWeight[dstPlatform]
  for (let n = 0;n < nNewChoices;n++) {
    platformChoices.push(dstPlatform)
  }

  debug && console.log(srcPlatform, '=>', dstPlatform, 'with', Games.WithID(platformGames[dstPlatform]), 'out of', platformGames[dstPlatform].length, 'games found')
}

// debug && console.log('Genres:' + Object.keys(genres).join(' '))
// debug && console.log('Platform choices:', platformChoices.join(' '))
debug && console.warn('Skipped platforms (without gamelist.xml):', skippedPlatforms.join(' '))
debug && console.log('')


// pick the games
for (let n = 0;n < settings.limit.maxGames && platformChoices.length > 0;n++) {
  const choice = platformChoices[Math.floor(Math.random() * platformChoices.length)]
  // debug && console.log(choice, platformGames[choice].length)
  const game   = platformGames[choice].pop()
  // debug && console.log(game)
  // debug && console.log((n+1) + '.', choice, ':', game.name, ': rating', game.rating)
  let dstPath = settings.gameCollection.dst + '/' + game.platform
  let folders = game.path.split('/')
  folders.pop() // remove filename
  if (folders.length) dstPath += '/' + folders.join('/')

  // console.log(`mkdir -p "${dstPath}"`)
  mkdirp.sync(dstPath)
  console.log(`cp "${settings.gameCollection.src}/${game.srcPlatform}/${game.path}" "${settings.gameCollection.dst}/${game.platform}/${game.path}"`)

  if (platformGames[choice].length === 0) {
    platformChoices = platformChoices.filter(v => v !== choice)
  }
}
