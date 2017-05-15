import React from 'react';
import PropTypes from 'prop-types';
import DeviceProfiles from '../../api/deviceprofiles/deviceprofiles';

const DeviceProfilesSelect = ({ name }) => (
  <select name={name || 'deviceProfileName'}>
    {DeviceProfiles.find().fetch().map(({_id, owner, name, profile}) => (
      <option key={_id}>{name}</option>
    ))}
  </select>
)

DeviceProfilesSelect.propTypes = {
  name: PropTypes.string,
}

export default DeviceProfilesSelect
