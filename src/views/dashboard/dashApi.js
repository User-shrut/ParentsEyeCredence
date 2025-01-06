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

export const Selector = ({ setFilteredData, filteredData }) => {
  const [selectedOptions, setSelectedOptions] = useState([])
  const [tempSelectedOptions, setTempSelectedOptions] = useState([])

  // Initialize deviceOptions with the filteredData
  const deviceOptions = filteredData.map((device) => ({
    label: device.name,
    value: device.deviceId,
  }))

  // Handle changes in the temporary selection
  const handleChange = (selected) => {
    setTempSelectedOptions(selected)
  }

  // Apply the selected filters
  const handleApply = () => {
    setSelectedOptions(tempSelectedOptions)
    if (tempSelectedOptions.length > 0) {
      const selectedDeviceIds = tempSelectedOptions.map((option) => option.value)
      const filtered = filteredData.filter((device) => selectedDeviceIds.includes(device.deviceId))
      setFilteredData(filtered)
    } else {
      setFilteredData(filteredData)
    }
  }

  // Custom MenuList to include the "Apply" button
  const CustomMenuList = (props) => {
    return (
      <components.MenuList {...props}>
        {props.children}
        <div
          style={{
            padding: '10px',
            borderTop: '1px solid #ccc',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <button
            onClick={handleApply}
            style={{
              padding: '8px 12px',
              backgroundColor: '#6a1b9a',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Apply
          </button>
        </div>
      </components.MenuList>
    )
  }

  return (
    <div>
      <Select
        options={deviceOptions} // Always uses the original filteredData for options
        isMulti
        value={tempSelectedOptions}
        onChange={handleChange}
        placeholder="Select devices"
        components={{ MenuList: CustomMenuList }}
        styles={{
          control: (base) => ({
            ...base,
            border: '1px solid #6a1b9a',
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
