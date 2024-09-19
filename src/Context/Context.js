import axios from 'axios'
import { createContext, useEffect, useState } from 'react'

export const GlobalContext = createContext(null)

export default function GlobalState({ children }) {
  const [salesManList, setSalesManList] = useState([])
  const [salesman, setSalesman] = useState([]);

  const [salesManPosition, setSalesmanPosition] = useState([
    {
      lat: 21.1458,
      lng: 79.0882,
    },
  ])

  const [selectedSalesMan, setSelectedSalesMan] = useState()

  useEffect(() => {
    const getSalesmanPosition = async () => {
      try {
        const username = 'harshal'
        const password = '123456'
        const token = btoa(`${username}:${password}`)
        const response = await axios.get('https://rocketsalestracker.com/api/positions', {
          headers: {
            Authorization: `Basic ${token}`,
          },
        })

        if (response.status === 200) {
          console.log(response.data)

          if (response.data && response.data.length > 0) {
            setSalesManList(response.data);

            const newMarkers = response.data.map((item) => ({
              lat: item.latitude,
              lng: item.longitude,
            }))
            setSalesmanPosition(newMarkers)
          }
        }
      } catch (error) {
        console.log('Error:', error)
      }
    }
    const getSalesman = async () => {
      try {
        const username = 'harshal'
        const password = '123456'
        const token = btoa(`${username}:${password}`)
        const response = await axios.get('https://rocketsalestracker.com/api/devices', {
          headers: {
            Authorization: `Basic ${token}`,
          },
        })

        if (response.status === 200) {
          setSalesman(response.data)
          console.log(response.data)
        }
      } catch (error) {
        console.log('Error:', error)
      }
    }

    getSalesman()

    getSalesmanPosition()
  }, [])

  return (
    <GlobalContext.Provider value={{ salesManPosition,salesman, salesManList, selectedSalesMan, setSelectedSalesMan }}>
      {children}
    </GlobalContext.Provider>
  )
}
