const fs     = require('fs')
const mkdirp = require('mkdirp') // https://github.com/substack/node-mkdirp
const Games  = require('./Games')

let debug = false
let nBytesUsed = 0

// returns list of subdirectories
const lsdir = p => fs.readdirSync(p).filter(f => fs.statSync(p+'/'+f).isDirectory())

const getDstPlatform = (exportProfile, platformAliases, srcPlatform) => {
  const s = srcPlatform.toLowerCase()
  for (const dstPlatform in platformAliases) {
    const alias = dstPlatform.toLowerCase()
    if (s === alias || platformAliases[alias].includes(s)) {
      return alias
    }
  }
  return s // '<unknown platform>'
}

const getFilename = (path) => { // this is not very elegant
  const t = path.split('/')
  return t[t.length - 1]
}

const getFileExtension = (path) => { // this is not very elegant
  const t = path.split('.')
  return t[t.length - 1]
}

const getWithoutFileExtension = (path) => { // this is not very elegant
  const t = path.split('.')
  t.pop()
  return t.join('.')
}

const copyFile = (srcFilename, dstFilename, copyAlways = false) => {
  if (!copyAlways && fs.existsSync(dstFilename)) {
    const stats = fs.statSync(dstFilename)
    // console.log('dstFilename is', stats.size, 'bytes.', dstFilename, 'nBytesUsed', nBytesUsed)
    nBytesUsed += stats.size
    return stats.size
  }

  let srcFile = undefined
  try {
    srcFile = fs.readFileSync(srcFilename)
  } catch (err) {
    console.warn('Read error on', srcFilename, '. Is file too big for this filesystem (>=2.0G on Fat32)?')
  }

  if (!srcFile) {
    return 0 // copied 0 bytes with read error
  }

  if (getFileExtension(srcFilename) === 'cue') {
    srcFile = srcFile.toString().split('\n')
    srcFile[0] = `FILE "${getFilename(getWithoutFileExtension(dstFilename))}.bin" BINARY`
    srcFile = srcFile.join('\n')
    // console.log(srcFile)
  } // else not a .cue file

  // note: an optimization would be to queue a (max) number of writes which would works well when we read from and write to different physical devices.

  // console.log('srcFilename is ', srcFile.length, 'bytes.', srcFilename, 'nBytesUsed', nBytesUsed, 'dstFilename', dstFilename)
  fs.writeFileSync(dstFilename, srcFile)
  nBytesUsed += srcFile.length
  return srcFile.length
}

// seedable random function
var seed = 1  // KISS
const random = () => {
    var x = Math.sin(seed++) * 10000
    return x - Math.floor(x)
}


// copy the gamelist.xml files and images
const copyGamelistsAndCreateImagesFolder = (from, to, exportProfile, platformAliases, srcPlatforms, skippedPlatforms) => {
  for (const srcPlatform of srcPlatforms) {
    const dstPlatform = getDstPlatform(exportProfile, platformAliases, srcPlatform)
    if (skippedPlatforms.includes(dstPlatform)) continue

    const srcDir = `${from}/${srcPlatform}`
    const dstDir = `${to}/${dstPlatform}`
    mkdirp.sync(`${dstDir}/images`)
  }
}


//
//
//
const run = (from, to, exportProfile, exportLimit, deviceProfile, platformAliases) => {
  nBytesUsed = 0

  // determine game ratings and platforms we will select games for
  // const genres        = {} // per platform
  const platformGames    = {} // per destination platform (psx/psp/n64/...)
  const platformGamesCopied = {} // per destination platform (psx/psp/n64/...)
  const platformGamesCopiedInfo = {} // extra info to prevend duplicate exports
  let   platformChoices  = [] // psx psx psx psp psp n64
  const skippedPlatforms = [] // per destinatin platform (no gamelist.xml)
  const srcPlatforms = lsdir(from)
  for (const srcPlatform of srcPlatforms) {
    const gamelistXml = from + '/' + srcPlatform + '/gamelist.xml'
    const hasGameListXml = fs.existsSync(gamelistXml)

    const dstPlatform = getDstPlatform(exportProfile, platformAliases, srcPlatform)
    platformGamesCopied[dstPlatform] = []
    if (!hasGameListXml) {
      skippedPlatforms.push(dstPlatform)
      continue
    }

    platformGamesCopiedInfo[dstPlatform] = {}
    platformGames[dstPlatform] = Games.Xml2JSON(gamelistXml, srcPlatform, dstPlatform)
    // platformGames[dstPlatform].forEach(game => genres[game.genre] = true)

    Games.AdjustRating(platformGames[dstPlatform], exportProfile.ratingAdjustments)
    Games.SortByRating(platformGames[dstPlatform])

    const c = deviceProfile.platformWeight[dstPlatform]
    const nNewChoices = typeof c !== 'undefined' ? c : deviceProfile.platformWeight['default']
    for (let n = 0;n < nNewChoices;n++) {
      platformChoices.push(dstPlatform)
    }

    debug && console.log(srcPlatform, '=>', dstPlatform, 'with', Games.NumberOfGamesWithID(platformGames[dstPlatform]), 'out of', platformGames[dstPlatform].length, 'games found')
  }

  copyGamelistsAndCreateImagesFolder(from, to, exportProfile, platformAliases, srcPlatforms, skippedPlatforms) // TODO: do this later when first game for a given platform is copied.

  // debug && console.log('Genres:' + Object.keys(genres).join(' '))
  // debug && console.log('Platform choices:', platformChoices.join(' '))
  for (const skippedPlatform of skippedPlatforms) {
    // TODO: pretend all unknown games have the same rating (or determined by exportProfile?)
    console.warn('Skipped platforms (without gamelist.xml):', skippedPlatform)
  }


  // pick and copy the games
  for (let n = 0;n < exportLimit.maxGames && platformChoices.length > 0 && nBytesUsed < exportLimit.maxGB * 1024 * 1024 * 1024;n++) {
    const choice = platformChoices[Math.floor(random() * platformChoices.length)]
    const game   = platformGames[choice].pop()

    if (platformGames[choice].length === 0) {
      platformChoices = platformChoices.filter(v => v !== choice)
    }

    const srcFilename = `${from}/${game.srcPlatform}/${game.path}`
  /*  if (game.platform === 'psx') {
      game.path = `./${getFileName(game.path)}` // move file to this platform's root but don't rename (because it will be referenced by name in the associated .cue file!)
    } else*/ {
      game.path = `./${game.name}.${getFileExtension(game.path)}` // move file to this platform's root
    }
    const dstFilename = `${to}/${game.platform}/${game.path}`

    if (!fs.existsSync(srcFilename) || game.rating < exportLimit.minRating || platformGamesCopiedInfo[game.platform][game.name] || platformGamesCopiedInfo[game.platform][getWithoutFileExtension(game.path)]) {
      // console.info('Not found or rating too low or already copied', choice, ':', game.name)
      n-- // try another one
      continue
    }

    console.log(`${n+1}/${(nBytesUsed / 1024 / 1024 / 1024).toFixed(2)}GB. ${choice}: ${game.name}: rating ${game.rating.toFixed(1)}`)

    platformGamesCopied[game.platform].push(game)
    platformGamesCopiedInfo[game.platform][game.name] = true
    platformGamesCopiedInfo[game.platform][getWithoutFileExtension(game.path)] = true
    mkdirp.sync(`${to}/${game.platform}`)
    copyFile(srcFilename, dstFilename)

    // if .bin file then also copy dependent (.cue) files.
    const fileExtension = getFileExtension(srcFilename).toLowerCase()
    if (fileExtension === 'bin') {
      const srcFilename2 = srcFilename.replace('.bin', '.cue')
      if (fs.existsSync(srcFilename2)) {
        const dstFilename2 = dstFilename.replace('.bin', '.cue')
        // console.log(srcFilename2, dstFilename2)
        // always create a fresh .cue because the name of the .bin might have changed
        copyFile(srcFilename2, dstFilename2, true) // this often gives NodeJS write errors. Is this a Samba problem? I don't understand.
      }
    } // else not .bin file

    // if possible add a thumbnail to the images folder
    if (game.image) {
      const srcImageFilename = `${from}/${game.srcPlatform}/${game.image}`
      const dstImageFilename = `${to}/${game.platform}/${game.image}`
      copyFile(srcImageFilename, dstImageFilename)
    }
  } // next game, until a limit is reached


  // Output gamelist.xml per platform
  for (const srcPlatform of srcPlatforms) {
    const dstPlatform = getDstPlatform(exportProfile, platformAliases, srcPlatform)
    if (skippedPlatforms.includes(dstPlatform)) continue

    Games.JSON2Xml(`${to}/${dstPlatform}/gamelist.xml`, platformGamesCopied[dstPlatform])
  } // next srcPlatform

} // end of run(from, to, exportProfile, exportLimit)


export default run
