
// ls -lrt -d -1 $PWD/*
// const lsdir = p => fs.readdirSync(p).filter(f => fs.statSync(p+'/'+f).isDirectory())

// desired output:
//  filename, sha256:..., md5:..., crc:....


var fs = require('fs');
var path = require('path');
var SHA256 = require("crypto-js/sha256"); // https://github.com/brix/crypto-js
var MD5 = require("crypto-js/md5"); // https://github.com/brix/crypto-js

skipPrefixes   = ['.']
skipExtensions = ['.xml', '.jpg', '.png']

var walk = function(directoryName) {

  fs.readdir(directoryName, function(e, files) {
    files.forEach(function(file) {
      fs.stat(directoryName + path.sep + file, function(e, f) {
        const d = directoryName + path.sep + file

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
          content = fs.readFileSync(d, {encoding: 'utf8'})
          console.log(`${d}, sha256:${SHA256(content)}, md5:${MD5(content)}`)
        }
      })
    })
  })
}

walk('.')
