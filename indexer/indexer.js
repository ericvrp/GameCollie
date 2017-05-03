
// ls -lrt -d -1 $PWD/*
// const lsdir = p => fs.readdirSync(p).filter(f => fs.statSync(p+'/'+f).isDirectory())

// desired output:
//  filename, sha256:..., md5:..., crc:....


var fs = require('fs');
var path = require('path');
var CryptoJS = require("crypto-js"); // https://github.com/brix/crypto-js
var crc32 = require('buffer-crc32'); // https://github.com/brianloveswords/buffer-crc32


function arrayBufferToWordArray(ab) {
  var i8a = new Uint8Array(ab);
  var a = [];
  for (var i = 0; i < i8a.length; i += 4) {
    a.push(i8a[i] << 24 | i8a[i + 1] << 16 | i8a[i + 2] << 8 | i8a[i + 3]);
  }
  return CryptoJS.lib.WordArray.create(a, i8a.length);
}

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
      const aw      = arrayBufferToWordArray(content)
      const sha256  = String(CryptoJS.SHA256(aw)).toUpperCase()
      const md5     = String(CryptoJS.MD5(aw)).toUpperCase()
      const crc32_  = crc32.unsigned(content).toString(16).toUpperCase()
      console.log(`  \{"path":"${d}", "sha256":"0x${sha256}", "md5":"0x${md5}", "crc32":"0x${crc32_}"\},`)
    }
  })
}

console.log('const itemHashes = [')
walk('.')
console.log(']')
console.log('export default itemHashes')
