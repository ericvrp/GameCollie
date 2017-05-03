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

const hashFiles = (filelist, algo) => {

  // const _hashFile = (filename) => {
  //
  //     console.log(filename)
  //     const crc32_ = crc32.unsigned(fs.readFileSync(filename)).toString(16)
  //     Promise.join(hashFile(filename, 'md5'), hashFile(filename, 'sha256'), (md5_, sha256_) => {
  //       console.log(`  \{"path":"${filename}", "sha256":"0x${sha256_.toUpperCase()}", "md5":"0x${md5_.toUpperCase()}", "crc32":"0x${crc32_.toUpperCase()}"\},`)
  //     })
  //
  // }

  var queued = [], parallel = 3;
  var hashPromises = filelist.map(function(filename) {
    // How many items must download before fetching the next?
    // The queued, minus those running in parallel, plus one of
    // the parallel slots.
    var mustComplete = Math.max(0, queued.length - parallel + 1);
    console.log('queued.length', queued.length, 'mustComplete', mustComplete, 'parallel', parallel, 'filename', filename)
    // when enough items are complete, queue another request for an item
    return Promise.some(queued, mustComplete)
      .then(function() {
          // var download = _hashFile(id);
          var hf = hashFile(filename, algo)
          queued.push(hf);
          return hf;
      }).then(function(hash) {
          console.log(hash)
          // after that new download completes, get the hash.
          return hash;
      });
  });

  Promise.all(hashPromises).then(function(hashes) {
      console.log('All', algo, 'done. names.length', hashes.length)
  });
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

const filelist = walk('.')
console.log('filelist.length', filelist.length)
hashFiles(filelist, 'md5')
// hashFiles(filelist, 'sha256')
