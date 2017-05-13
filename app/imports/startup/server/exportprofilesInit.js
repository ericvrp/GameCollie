import ExportProfiles from '../../api/exportprofiles/exportprofiles'

const casualGamer         = require('./exportprofilesDefaults/casualGamer.json')
const hardcoreActionGamer = require('./exportprofilesDefaults/hardcoreActionGamer.json')

const upsertPublicProfile = (name, profile) => {
  ExportProfiles.upsert(
    {owner: '<public>', name: name},
    {$set: {owner: '<public>', name: name, profile: JSON.stringify(profile)}}
  )
}

upsertPublicProfile('Casual gamer'         , casualGamer        )
upsertPublicProfile('Hardcore action gamer', hardcoreActionGamer)
