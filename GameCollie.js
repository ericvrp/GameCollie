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
  const s = srcPlatform.toLowerCase()
  for (const dstPlatform in settings.platformAliases) {
    const alias = dstPlatform.toLowerCase()
    if (s === alias || settings.platformAliases[alias].includes(s)) {
      return alias
    }
  }
  return s // '<unknown platform>'
}

const getFileExtension = (path) => { // this is not very elegant
  const t = path.split('.')
  return t[t.length - 1]
}

const copyFile = (srcFilename, dstFilename) => {
  if (fs.existsSync(dstFilename)) return

  let srcFile = undefined
  try {
    srcFile = fs.readFileSync(srcFilename)
  } catch (err) {
    console.warn('Read error on', srcFilename, '. Is file too big for this filesystem (>=2.0G on Fat32)?')
  }

  if (!srcFile) {
    fs.writeFileSync(dstFilename, srcFile)
  }
}

// copy the gamelist.xml files and images
const copyGamelistsAndCreateImagesFolder = (srcPlatforms, skippedPlatforms) => {
  for (const srcPlatform of srcPlatforms) {
    const dstPlatform = getDstPlatform(srcPlatform)
    if (skippedPlatforms.includes(dstPlatform)) continue

    const srcDir = `${settings.gameCollection.src}/${srcPlatform}`
    const dstDir = `${settings.gameCollection.dst}/${dstPlatform}`
    mkdirp.sync(`${dstDir}/images`)

    const srcGamelistXml = `${srcDir}/gamelist.xml`
    const dstGamelistXml = `${dstDir}/gamelist.xml`
    // console.log(srcGamelistXml, '=>', dstGamelistXml)
    copyFile(srcGamelistXml, dstGamelistXml)
  }
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

  const nNewChoices = settings.platformWeight[dstPlatform] || settings.platformWeight['default']
  for (let n = 0;n < nNewChoices;n++) {
    platformChoices.push(dstPlatform)
  }

  debug && console.log(srcPlatform, '=>', dstPlatform, 'with', Games.WithID(platformGames[dstPlatform]), 'out of', platformGames[dstPlatform].length, 'games found')
}

copyGamelistsAndCreateImagesFolder(srcPlatforms, skippedPlatforms)

// debug && console.log('Genres:' + Object.keys(genres).join(' '))
// debug && console.log('Platform choices:', platformChoices.join(' '))
for (const skippedPlatform of skippedPlatforms) {
  console.warn('Skipped platforms (without gamelist.xml):', skippedPlatform)
}


// pick and copy the games
for (let n = 0;n < settings.limit.maxGames && platformChoices.length > 0;n++) {
  // TODO: skip games that differ only by file extension or game.id

  const choice = platformChoices[Math.floor(Math.random() * platformChoices.length)]
  const game   = platformGames[choice].pop()

  let dstPath = settings.gameCollection.dst + '/' + game.platform
  let folders = game.path.split('/')
  folders.pop() // remove filename
  if (folders.length) dstPath += '/' + folders.join('/')

  const srcFilename = `${settings.gameCollection.src}/${game.srcPlatform}/${game.path}`
  // const dstFilename = `${dstPath}/${game.name}.${getFileExtension(game.path)}` // rename game file. For this to work we need to change game.path in gamelist.xml
  const dstFilename = `${settings.gameCollection.dst}/${game.platform}/${game.path}`

  if (!fs.existsSync(srcFilename)) {
    // console.info('Not found.', choice, ':', game.name)
    n-- // try another one
    continue
  }

  console.log((n+1) + '.', choice, ':', game.name, ': rating', game.rating)

  mkdirp.sync(dstPath)

  copyFile(srcFilename, dstFilename)

  if (game.image) {
    const srcImageFilename = `${settings.gameCollection.src}/${game.srcPlatform}/${game.image}`
    const dstImageFilename = `${settings.gameCollection.dst}/${game.platform}/${game.image}`
    copyFile(srcImageFilename, dstImageFilename)
  }

  if (platformGames[choice].length === 0) {
    platformChoices = platformChoices.filter(v => v !== choice)
  }
}
