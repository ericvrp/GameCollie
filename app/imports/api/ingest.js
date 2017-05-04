import { ValidatedMethod } from 'meteor/mdg:validated-method';
import SimpleSchema from 'simpl-schema';
import Files from './files/files';


export const ingestFile = new ValidatedMethod({
  name: 'files.ingest',
  validate: new SimpleSchema({
    path: { type: String, optional: false },
    sha256: { type: String, optional: true },
    md5: { type: String, optional: true },
    crc32: { type: String, optional: true },

  }).validator(),
  run(info) {
    var data = {
      path:info.path, 
      hash_sha256:info.sha256, 
      hash_md5:info.md5, 
      hash_crc32:info.crc32
    };

    $existing = Files.findOne({hash_sha256: info.sha256})
    if(!$existing) {
      // console.log(`ingest - added new file [${data.path}] with hash ${data.hash_sha256}`);
      var id = Files.upsert({ _id: data._id }, { $set: data });
      return id;
    } else {
      // console.log(`ingest - ignored existing file [${data.path}] with hash ${data.hash_sha256}`);
      return $existing._id;
    }
  },
});

export const ingestHashFile = new ValidatedMethod({
  name: 'files.ingesthashfile',
  validate: null,
  run() {
    Files.remove({})

    console.log('start ingest hash file')

    filename = fsrp.realpathSync("assets/app/hash_index/hashed.json");
    const json = fs.readFileSync(filename, 'utf8');

    var itemHashes = JSON.parse(json);

    // const itemHashes = [
    //   {"path":"./gba/0001 - F-Zero for GameBoy Advance (J)(Mr. Lee)/0001 - F-Zero for GameBoy Advance (J)(Mr. Lee).gba", "sha256":"0x86C5E12E6C9C946A2E3FDA7BDDAC25455C2CF0C6E78D4AF9108714A5BBADEE4E", "md5":"0x0915AC62D58A160028EB47141657013F", "crc32":"0x25E3FC9A"},
    //   {"path":"./n64/Banjo-Tooie (U) [!].v64", "sha256":"0x9EC37FBA6890362EBA86FB855697A9CFF1519275531B172083A1A6A045483583", "md5":"0x40E98FAA24AC3EBE1D25CB5E5DDF49E4", "crc32":"0xBAB803EF"},
    //   {"path":"./n64/Banjo-Tooie (U) [!].z64", "sha256":"0x9EC37FBA6890362EBA86FB855697A9CFF1519275531B172083A1A6A045483583", "md5":"0x40E98FAA24AC3EBE1D25CB5E5DDF49E4", "crc32":"0xBAB803EF"},
    //   {"path":"./n64/Donkey Kong 64 (U) [!].v64", "sha256":"0x5778C9EF72EF269CDCC52333710A79961A343B1F01D12189D1DBE94DF3CBABED", "md5":"0xB71A88BA73E141FA2D355A6A72F46F6C", "crc32":"0x96972D67"},
    //   {"path":"./n64/Donkey Kong 64 (U) [!].z64", "sha256":"0xB6347D9F1F75D38A88D829B4F80B1ACF0D93344170A5FBE9546C484DAE416CE3", "md5":"0x9EC41ABF2519FC386CADD0731F6E868C", "crc32":"0xD44B4FC6"},
    //   {"path":"./n64/Dr. Mario 64 (U) [!].v64", "sha256":"0x613778B244784492A881C0D72D6017F82C39026706A406BD7EF95C6F33E53B89", "md5":"0x30EC4F3E1C435ED8B1D1FD3788B6A407", "crc32":"0xF7C44B5B"},
    //   {"path":"./psx/Crash Bandicoot 2/Crash 2.bin", "sha256":"0xA2E2AB37CD6E0D5180876BF7786AC699B3B691208EFE8DE66AFE7779BF4D1605", "md5":"0x3C31B5E038F025098A2FDFA70C8213F2", "crc32":"0x395C0916"},
    //   {"path":"./psx/Crash Bandicoot 2/Crash 2.cue", "sha256":"0xBE5587C93CB4180FE6156DCB931EFC81F2DBBFE491018E5E8F7C9F81DC15A93B", "md5":"0xCAFB479A95A1F2880C1C61B4796A665C", "crc32":"0xA0BE515F"},    
    //   ];

    console.log('start processing items ' + itemHashes.length)

    nseen=0;
    for(i=0;i<itemHashes.length;i++) {
      if(itemHashes[i].path.toLowerCase().indexOf('nintendo - gba')>=0) {
        Meteor.call('files.ingest', itemHashes[i]);
      }
    }

    console.log('done ingest hash file')

    return true;
  },
});

export const scrapeFile = new ValidatedMethod({
  name: 'files.scrapefile',
  validate: new SimpleSchema({
    _id: { type: String },
  }).validator(),
  run({ _id }) {
    info = Files.findOne({id: _id}).fetch();
    console.log(info);
  },
});

export const scrapeNewFiles = new ValidatedMethod({
  name: 'files.scrapenewfiles',
  validate: null,
  run() {
    files = Files.find().fetch();
    files.map((file)=>localScrape(file));
  },
});

const  localScrape = function(file) {
  console.log('=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+')
  console.log('Scraping ' + file.path);
  localScrapeGBA(file);
};

const fs     = require('fs')
const fsrp = require('fs.realpath')

const xpath = require('xpath')
const dom = require('xmldom').DOMParser
var xml2json = require('xml-js');
var sprintf = require("sprintf-js").sprintf

const localScrapeGBA = function(file) {
  // Try dat file from advanscene
  filename = fsrp.realpathSync("assets/app/advanscene_dat_files/ADVANsCEne_GBA_Col.xml");
  const xml      = fs.readFileSync(filename, 'utf8')
  const gameListGBA = new dom().parseFromString(xml)

  var hash = file.hash_crc32.toUpperCase()
  hash = hash.slice(2) // remove 0x

  console.log(hash)
  try {
    var info = false;

    var pred = './dat/games/game[files/romCRC/text()=\''+ hash +'\']'
    var anode = xpath.select1(pred, gameListGBA)

    console.log(anode.toString()); 
    if(anode) {
      var item = JSON.parse(xml2json.xml2json(anode.toString(), {compact: true, spaces: 4}))
      console.log(item); 
      if(item) {
        title = item.game.title._text;
        image = sprintf('http://www.advanscene.com/html/Releases/boxart/%04d-3.jpg', item.game.imageNumber._text)
        description = "";

        info = {
            title: title,
            image: image,
            type: 'games/gba',
            datasources: [ 
              { name: 'advanscene_gba', 
                id: item.game.comment._text, 
                data: { imagenumber: item.game.imageNumber._text,
                        releasenumber: item.game.releaseNumber._text, 
                      }
                 }
            ]
        }

        console.log(info);
      }
    }

    return info;
  } catch(err) {
    console.log(JSON.stringify(err, 0,2))
  }

  return true;
};

const localScrapeNDS = function(info) {
  // 
};

const localScrapePSP = function(info) {
  // 
};
