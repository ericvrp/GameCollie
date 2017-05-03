#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var Promise = require('bluebird')
var hash_file = require('hash_file')
var crc32 = require('buffer-crc32'); // https://github.com/brianloveswords/buffer-crc32


const hashFile = Promise.promisify(hash_file)

const isSkippedFile = (filename) => {
  const skipPrefixes   = ['.']
  const skipExtensions = ['.xml', '.jpg', '.png', '.zip']

  for (const pre of skipPrefixes) {
    if (filename.startsWith(pre)) {
      // console.log('Skipping (prefix):', filename)
      return true
    }
  }

  for (const ext of skipExtensions) {
    if (filename.endsWith(ext)) {
      // console.log('Skipping (ext):', filename)
      return true
    }
  }

  return false
}

var walk = function(directoryName) {
  const files = fs.readdirSync(directoryName)

  files.forEach(function(file) {
    if (isSkippedFile(file))  return

    const d = directoryName + path.sep + file
    const f = fs.statSync(d)

    if (f.isDirectory()) {
      walk(d)
    } else {
      // console.log(d)
      const crc32_ = crc32.unsigned(fs.readFileSync(d)).toString(16)
      Promise.join(hashFile(d, 'md5'), hashFile(d, 'sha256'), (md5_, sha256_) => {
        console.log(`  \{"path":"${d}", "sha256":"0x${sha256_.toUpperCase()}", "md5":"0x${md5_.toUpperCase()}", "crc32":"0x${crc32_.toUpperCase()}"\},`)
      })
    }
  })
}

walk('.')
