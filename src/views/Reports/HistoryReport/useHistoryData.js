import { useState, useEffect } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'

const useHistoryData = (url, { from, to, deviceId }, fetch) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)


  useEffect(() => {
    const fetchData = async () => {
      console.log("fetching start at his data")
      if (fetch) {
        setLoading(true)
        setError(null)

        try {
          // Retrieve the token from cookies
          const accessToken = Cookies.get('authToken')
          if (!accessToken) {
            throw new Error('Authentication token not found')
          }

          // Set up the query parameters
          const convertToUTCWithOffset = (date) => {
            if (!date) return null // Handle null or undefined dates
            const utcString = new Date(date).toISOString() // Convert to ISO string in UTC
            return utcString.replace('Z', '+00:00') // Replace 'Z' with '+00:00' for the desired format
          }

          const params = {
            from: convertToUTCWithOffset(from), // Convert `from` to UTC with offset
            to: convertToUTCWithOffset(to), // Convert `to` to UTC with offset
            deviceId,
          }

          // Make the GET request with query parameter
          const response = await axios.get(url, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            params,
          })

      console.log("fetching stop at his data")

          if (response.status === 200) {
            setData(response.data)
            console.log(response.data)
          } else {
            throw new Error(`Error: ${response.status}`)
          }
        } catch (err) {
          setError(err.message)
        } finally {
          setLoading(false)
        }
      }
    }

    fetchData()

  }, [url, from, to, deviceId, fetch])

  return { data, loading, error }
}

export default useHistoryData
