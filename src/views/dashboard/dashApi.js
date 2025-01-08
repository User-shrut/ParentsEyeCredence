import { useState, useEffect, useMemo } from 'react'
import Select, { components } from 'react-select'
import Cookies from 'js-cookie'
import axios from 'axios'

const accessToken = Cookies.get('authToken') // Replace with your token

export const getUsers = async () => {
  const response = await axios.get(`${import.meta.env.VITE_API_URL}/user`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  console.log('serssss', response.data.users)
  return response.data.users
}

export const getGroups = async (userId) => {
  const response = await axios.get(`${import.meta.env.VITE_API_URL}/group/${userId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return response.data.groupsAssigned || response.data.groups
}

export const getDevices = async (groupId) => {
  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/device/getDeviceByGroup/${groupId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  )
  console.log(
    'response.data===================================================================',
    response.data,
  )
  return response.data.data
}

export const Selector = ({ setFilteredData, filteredData, fillDevices }) => {
  const [selectedOptions, setSelectedOptions] = useState([])

  // Initialize deviceOptions with the filteredData
  const deviceOptions = fillDevices.map((device) => ({
    label: device.name,
    value: device.deviceId,
  }))

  // Handle changes in selection and apply the filter automatically
  const handleChange = (selected) => {
    setSelectedOptions(selected)

    if (selected && selected.length > 0) {
      const selectedDeviceIds = selected.map((option) => option.value)
      const filtered = fillDevices.filter((device) => selectedDeviceIds.includes(device.deviceId))
      setFilteredData(filtered)
    } else {
      // If no selection, show all data
      setFilteredData(filteredData)
    }
  }

  return (
    <div>
      <Select
        className="particularFilter"
        options={deviceOptions} // Always uses the original filteredData for options
        isMulti
        value={selectedOptions}
        onChange={handleChange}
        placeholder="Select devices"
        styles={{
          control: (base) => ({
            ...base,
            borderRadius: '4px',
          }),
          option: (base, state) => ({
            ...base,
            color: state.isSelected ? 'white' : 'black',
            backgroundColor: state.isSelected ? '#6a1b9a' : 'white',
          }),
        }}
      />
    </div>
  )
}
