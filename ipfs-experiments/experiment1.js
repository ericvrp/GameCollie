const IPFS = require('ipfs')
const ipfs = new IPFS()

// const contentHash = 'QmcphKLuUeJJJM3HrSmi3tBGb1n1LSFC2ZpRE7u72NNLJv' // hallo eric
const contentHash = 'QmTsKnJDnS9i74j1W383FCCWUZAtjJY4TCxgSbpVXeN19g' // dit is een file

ipfs.once('ready', () => ipfs.id((err, info) => {
  if (err) throw err
  console.log('IPFS node ready with address', info.id)
}))

let nPeers
setInterval(() => {
  ipfs.swarm.peers((err, peers) => {
    if (peers.length === nPeers) return
    nPeers = peers.length
    console.log('peers: ' + nPeers)
  })
}, 1000)

setInterval(() => {
  ipfs.files.cat(contentHash, function (err, stream) {
    // console.log('got content of ' + contentHash)
    // console.log(stream)
    stream.on('data', function(chunk) {
      console.log(contentHash, chunk.toString().trim())
    });
  })
}, 1000)
