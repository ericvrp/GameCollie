const fs     = require('fs')
const mkdirp = require('mkdirp') // https://github.com/substack/node-mkdirp
const Games  = require('./Games')

let debug = false
let nBytesUsed = 0


// returns list of subdirectories
const lsdir = p => fs.readdirSync(p).filter(f => fs.statSync(p+'/'+f).isDirectory())

const getDstPlatform = (exportProfile, srcPlatform) => {
  const s = srcPlatform.toLowerCase()
  for (const dstPlatform in exportProfile.platformAliases) {
    const alias = dstPlatform.toLowerCase()
    if (s === alias || exportProfile.platformAliases[alias].includes(s)) {
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
const copyGamelistsAndCreateImagesFolder = (from, to, exportProfile, srcPlatforms, skippedPlatforms) => {
  for (const srcPlatform of srcPlatforms) {
    const dstPlatform = getDstPlatform(exportProfile, srcPlatform)
    if (skippedPlatforms.includes(dstPlatform)) continue

    const srcDir = `${from}/${srcPlatform}`
    const dstDir = `${to}/${dstPlatform}`
    mkdirp.sync(`${dstDir}/images`)

    // const srcGamelistXml = `${srcDir}/gamelist.xml`
    // const dstGamelistXml = `${dstDir}/gamelist.xml`
    // const copyAlways     = true
    // // console.log(srcGamelistXml, '=>', dstGamelistXml)
    // copyFile(srcGamelistXml, dstGamelistXml, copyAlways)
  }
}


//
//
//
const run = (from, to, exportProfile, exportLimit) => {
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

    const dstPlatform = getDstPlatform(exportProfile, srcPlatform)
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

    const c = exportProfile.platformWeight[dstPlatform]
    const nNewChoices = typeof c !== 'undefined' ? c : exportProfile.platformWeight['default']
    for (let n = 0;n < nNewChoices;n++) {
      platformChoices.push(dstPlatform)
    }

    debug && console.log(srcPlatform, '=>', dstPlatform, 'with', Games.NumberOfGamesWithID(platformGames[dstPlatform]), 'out of', platformGames[dstPlatform].length, 'games found')
  }

  copyGamelistsAndCreateImagesFolder(from, to, exportProfile, srcPlatforms, skippedPlatforms) // TODO: do this later when first game for a given platform is copied.

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


    // P.S. TODO'S
    //    - often it's the cue files that have a rating. So we have to make this work the other way around to!
    //    - cue files contain contain the .bin filename. This does not work when we rename the .bin file.
    //      so either we do not rename psx .bin files or we patch the associated .cue file.
    //    - when the original gamelist.xml contained.cue files then we need to add this 'game' to our newly generated gamelist.xml also.

    // note: also copy dependent files
    const fileExtension = '.' + getFileExtension(srcFilename).toLowerCase()
    for (const dependency of exportProfile.dependencies) {
      if (fileExtension !== dependency.ext) continue

      const srcFilename2 = srcFilename.replace(fileExtension, dependency.dependencyExt)
      if (!fs.existsSync(srcFilename2)) continue

      const dstFilename2 = dstFilename.replace(fileExtension, dependency.dependencyExt)
      // console.log(srcFilename2, dstFilename2)
      copyFile(srcFilename2, dstFilename2) // this often gives NodeJS write errors. Is this a Samba problem? I don't understand.
    }

    // if possible add a thumbnail to the images folder
    if (game.image) {
      const srcImageFilename = `${from}/${game.srcPlatform}/${game.image}`
      const dstImageFilename = `${to}/${game.platform}/${game.image}`
      copyFile(srcImageFilename, dstImageFilename)
    }
  } // next game, until a limit is reached


  // Output gamelist.xml per platform
  for (const srcPlatform of srcPlatforms) {
    const dstPlatform = getDstPlatform(exportProfile, srcPlatform)
    if (skippedPlatforms.includes(dstPlatform)) continue

    Games.JSON2Xml(`${to}/${dstPlatform}/gamelist.xml`, platformGamesCopied[dstPlatform])
  } // next srcPlatform

} // end of run(from, to, exportProfile, exportLimit)


export default run
