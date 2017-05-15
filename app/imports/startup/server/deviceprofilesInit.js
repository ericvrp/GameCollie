import DeviceProfiles from '../../api/deviceprofiles/deviceprofiles'

const retropieProfile = require('./deviceprofilesDefaults/retropie.json')
const pspProfile      = require('./deviceprofilesDefaults/psp.json')

const upsertPublicProfile = (name, profile) => {
  DeviceProfiles.upsert(
    {owner: '<public>', name: name},
    {$set: {owner: '<public>', name: name, profile: JSON.stringify(profile)}}
  )
}

upsertPublicProfile('Retropie', retropieProfile)
upsertPublicProfile('PSP'     , pspProfile     )
