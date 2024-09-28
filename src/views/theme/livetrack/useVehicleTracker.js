import { useState, useEffect } from 'react'
import axios from 'axios'

const useVehicleTracker = (deviceId) => {
  const [vehicleData, setVehicleData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let intervalId

    const fetchVehicleData = async () => {
      try {
        setLoading(true) // Set loading state to true before fetching
        const positionsAPI = `http://104.251.212.84/api/positions?deviceId=${deviceId}`
        const auth = {
          username: 'hbtrack',
          password: '123456@',
        }
        const response = await axios.get(positionsAPI, { auth })
        console.log('Length of positions API: ' + response.data[0])

        if (response.data) {
          setVehicleData(response.data) // Update state with fetched data
        } else {
          // setError('No vehicle data found') // Handle case where no data is returned
        }
      } catch (err) {
        // setError('Error fetching vehicle data: ' + err.message) // Set error state
      } finally {
        setLoading(false) // Set loading state to false after fetching
      }
    }

    // Fetch data immediately
    fetchVehicleData()

    // Set up interval to fetch data every few seconds (e.g., 10 seconds)
    intervalId = setInterval(fetchVehicleData, 3000)

    // Clear the interval on component unmount
    return () => clearInterval(intervalId)
  }, [deviceId]) // Depend on deviceId to refetch when it changes

  return { vehicleData, loading, error } // Return the data and states
}

export default useVehicleTracker
