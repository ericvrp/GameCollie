import PlatformAliases from '../../api/platformaliases/platformaliases'

const platformAliases = require('./platformaliasesDefaults/platformaliases.json')

const upsertPublicProfile = (name, profile) => {
  PlatformAliases.upsert(
    {owner: '<public>', name: name},
    {$set: {owner: '<public>', name: name, profile: JSON.stringify(profile)}}
  )
}

upsertPublicProfile('AllAliases', platformAliases)
