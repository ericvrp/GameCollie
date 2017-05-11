// #!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var Promise = require('bluebird')
var hash_file = require('hash_file')
var crc32 = require('buffer-crc32'); // https://github.com/brianloveswords/buffer-crc32

// var hashed = require('./hashed.json')
var hashedPaths = {}
// for (const hash of hashed)  hashedPaths[hash.path] = true
// console.log(typeof hashedPaths, hashedPaths.length, hashedPaths[0], hashedPaths[1])


// creating filelist...
const isSkippedFile = (filename, fullpath) => {
  const skipPrefixes   = ['.']
  const skipExtensions = ['.xml', '.jpg', '.png', '.gif', '.bmp', '.log', '.nfo', '.url', '.txt', '.doc', '.docx', '.pdf', '.dll', '.conf', '.xdb', '.dtd', '.exe', '.bat', '.msg', '.manifest', '.mo', '.po', '.pot', '.def']

  // XXX skip when file has no extension?

  const filenameLowercase = filename.toLowerCase()
  for (const pre of skipPrefixes) {
    if (filenameLowercase.startsWith(pre)) {
      // console.log('Skipping (prefix):', filenameLowercase)
      return true
    }
  }

  for (const ext of skipExtensions) {
    if (filenameLowercase.endsWith(ext)) {
      // console.log('Skipping (ext):', filenameLowercase)
      return true
    }
  }

  if (hashedPaths[fullpath]) {
    // console.log('Skipping (path):', fullpath)
    return true
  }

  return false
}

var walk = function(directoryName, filelist=[]) {
  const files = fs.readdirSync(directoryName)

  files.forEach(filename => {
    const fullpath = directoryName + path.sep + filename
    if (isSkippedFile(filename, fullpath))  return

    const f = fs.statSync(fullpath) // TODO: catch errors

    if (f.isDirectory()) {
      walk(fullpath, filelist)
    }
    else {
      filelist.push(fullpath)
    }
  })

  return filelist
}


// hashing...
const hashFile = Promise.promisify(hash_file)

const hashFilelist = (filelist, maxIndex, index, hashResults) => {
  const filename = filelist[index]
  console.log(`${index+1}/${maxIndex} ${filename}`)

  let content = undefined
  try {
    content = fs.readFileSync(filename)
  } catch(e) {
    // skip erroring file by not setting content variable (often the reason is that files are larger then 2Gb on a Fat32 partition)
    // XXX should we mark the file so we will not try to read it again?
  }

  if (!content) {
    if (index < maxIndex-1) hashFilelist(filelist, maxIndex, index+1, hashResults)
    return
  }

  const crc32_ = crc32.unsigned(content).toString(16)

  // or content instead of filename?
  Promise.join(hashFile(filename, 'md5'), hashFile(filename, 'sha256'), (md5_, sha256_) => {
    const newHashResult = {path: filename, sha256 : '0x'+sha256_.toUpperCase(), md5: '0x' + md5_.toUpperCase(), crc32: '0x' + crc32_.toUpperCase()}
    hashResults.push(newHashResult)
    // console.log(newHashResult)
    if (index < maxIndex-1) hashFilelist(filelist, maxIndex, index+1, hashResults)
  })
}


const run = (dirname, hashResults) => {
  // console.log('run sucker run!', dirname)
  const filelist = walk(dirname)

  const maxBatchSize = 10000
  for (let index = 0;index < filelist.length;index += maxBatchSize) {
    const maxIndex = Math.min(filelist.length, index + maxBatchSize)
    // console.log('maxIndex', maxIndex)
    hashFilelist(filelist, maxIndex, index, hashResults)
  }
}

export default run
