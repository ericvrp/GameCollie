
// ls -lrt -d -1 $PWD/*
// const lsdir = p => fs.readdirSync(p).filter(f => fs.statSync(p+'/'+f).isDirectory())

// desired output:
//  filename, sha256:..., md5:..., crc:....


var fs = require('fs');
var path = require('path');
var CryptoJS = require("crypto-js"); // https://github.com/brix/crypto-js
var md5 = require("md5") // https://github.com/pvorb/node-md5
var crc32 = require('buffer-crc32'); // https://github.com/brianloveswords/buffer-crc32

skipPrefixes   = ['.']
skipExtensions = ['.xml', '.jpg', '.png']

var walk = function(directoryName) {

  const files = fs.readdirSync(directoryName)

  files.forEach(function(file) {
    const d = directoryName + path.sep + file
    const f = fs.statSync(d)

    for (const pre of skipPrefixes) {
      if (file.startsWith(pre)) {
        // console.log('Skipping (prefix):', d)
        return
      }
    }

    for (const ext of skipExtensions) {
      if (file.endsWith(ext)) {
        // console.log('Skipping (ext):', d)
        return
      }
    }

    if (f.isDirectory()) {
      walk(d)
    } else {
      const content = fs.readFileSync(d)
      const _sha256  = String(CryptoJS.SHA256(content)).toUpperCase()
      const _md5     = String(md5(content)).toUpperCase()
      const _crc32   = crc32.unsigned(content).toString(16).toUpperCase()
      console.log(`  \{"path":"${d}", "sha256":"0x${_sha256}", "md5":"0x${_md5}", "crc32":"0x${_crc32}"\},`)
    }
  })
}

console.log('const itemHashes = [')
walk('.')
console.log(']')
console.log('export default itemHashes')
