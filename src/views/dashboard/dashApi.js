// api.js
import Cookies from 'js-cookie'
import axios from 'axios'

const accessToken = Cookies.get('authToken') // Replace with your token

export const getUsers = async () => {
  const response = await axios.get(`http://63.142.251.13:9000/user`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  console.log('serssss', response.data.users)
  return response.data.users
}

export const getGroups = async (userId) => {
  const response = await axios.get(`http://63.142.251.13:9000/group/${userId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return response.data.groupsAssigned || response.data.groups
}

export const getDevices = async (groupId) => {
  const response = await axios.get(`http://63.142.251.13:9000/device/getDeviceByGroup/${groupId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  console.log(
    'response.data===================================================================',
    response.data,
  )
  return response.data.data
}
