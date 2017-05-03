#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var Promise = require('bluebird')
var hash_file = require('hash_file')
var crc32 = require('buffer-crc32'); // https://github.com/brianloveswords/buffer-crc32


// creating filelist...
const isSkippedFile = (filename) => {
  const skipPrefixes   = ['.']
  const skipExtensions = ['.xml', '.jpg', '.png', '.log', '.nfo', '.url', '.txt', '.doc', '.docx', '.dll', '.conf', '.xdb', '.dtd', '.exe', '.bat', '.msg', '.manifest', '.mo', '.po', '.pot', '.def']

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

  return false
}

var walk = function(directoryName, filelist=[]) {
  const files = fs.readdirSync(directoryName)

  files.forEach(function(file) {
    if (isSkippedFile(file))  return

    const d = directoryName + path.sep + file
    const f = fs.statSync(d)

    if (f.isDirectory()) {
      walk(d, filelist)
    }
    else {
      filelist.push(d)
    }
  })

  return filelist
}


// hashing...
const hashFile = Promise.promisify(hash_file)

const hashFilelist = (filelist, maxIndex, index = 0) => {
  const filename = filelist[index]
  // console.log(index, '/', maxIndex, filename)

  let content = undefined
  try {
    content = fs.readFileSync(filename)
  } catch(e) {
    throw new Error(e)
  }

  if (!content) {
    if (index < maxIndex-1) return hashFilelist(filelist, maxIndex, index+1)
  }

  const crc32_ = crc32.unsigned(content).toString(16)

  // or content instead of filename?
  Promise.join(hashFile(filename, 'md5'), hashFile(filename, 'sha256'), (md5_, sha256_) => {
    console.log(`  \{"path":"${filename}", "sha256":"0x${sha256_.toUpperCase()}", "md5":"0x${md5_.toUpperCase()}", "crc32":"0x${crc32_.toUpperCase()}"\},`)
    if (index < maxIndex-1) hashFilelist(filelist, maxIndex, index+1)
  })
}


// main...
const filelist = walk('.')
// filelist.splice(10) // keep only first 10 elements
// console.log('filelist.length', filelist.length)

const maxBatchSize = 10000
for (let index = 0;index < filelist.length;index += maxBatchSize) {
  const maxIndex = Math.min(filelist.length, index + maxBatchSize)
  // console.log('maxIndex', maxIndex)
  hashFilelist(filelist, maxIndex, index)
}
