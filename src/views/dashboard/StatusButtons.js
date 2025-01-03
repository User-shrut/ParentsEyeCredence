import React, { useEffect, useState } from 'react'
import './StatusButtons.css' // Make sure the CSS is imported
import { useDispatch, useSelector } from 'react-redux'
import {
  filterAllVehicles,
  filterIdleVehicles,
  filterInactiveVehicles,
  filterOverspeedVehicles,
  filterRunningVehicles,
  filterStoppedVehicles,
  initializeSocket,
  socket,
  selectDeviceNames,
  searchVehiclesByName,
  filterBySingleVehicle,
  filterByCategory,
  filterByDevices,
  setVehicles,
} from '../../features/LivetrackingDataSlice.js'
const StatusButtons = () => {
  const [filter1, setFilter1] = useState('all')
  const dispatch = useDispatch()
  useEffect(() => {
    switch (filter1) {
      case 'stopped':
        dispatch(filterStoppedVehicles())
        break
      case 'idle':
        dispatch(filterIdleVehicles())
        break
      case 'running':
        dispatch(filterRunningVehicles())
        break
      case 'overspeed':
        dispatch(filterOverspeedVehicles())
        break
      case 'inactive':
        dispatch(filterInactiveVehicles())
        break
      case 'car':
        dispatch(filterByCategory('car'))
        break
      case 'bus':
        dispatch(filterByCategory('bus'))
        break
      case 'truck':
        dispatch(filterByCategory('truck'))
        break
      case 'tracktor':
        dispatch(filterByCategory('tracktor'))
      case 'jcb':
        dispatch(filterByCategory('jcb'))
        break
      case 'crean':
        dispatch(filterByCategory('crean'))
        break
      case 'motorcycle':
        dispatch(filterByCategory('motorcycle'))
        break
      case 'geofence_1':
        dispatch(filterByGeofence(1))
        break
      case 'group_1':
        dispatch(filterByGroup(1))
        break
      case 'vehicle_MH31FC7099':
        dispatch(filterBySingleVehicle('MH31FC7099'))
        break
      default:
        dispatch(filterAllVehicles())
        break
    }
  }, [filter1, dispatch])

  return (
    <div className="d-flex flex-row gap-3 align-items-center">
      <button
        className="btn btn-outline-red"
        onClick={(e) => {
          e.preventDefault()
          setFilter1('stopped')
        }}
      >
        Stopped
      </button>
      <button
        className="btn btn-outline-yellow"
        onClick={(e) => {
          e.preventDefault()
          setFilter1('idle')
        }}
      >
        Idle
      </button>
      <button
        className="btn btn-outline-green"
        onClick={(e) => {
          e.preventDefault()
          setFilter1('running')
        }}
      >
        Running
      </button>
      <button
        className="btn btn-outline-orange"
        onClick={(e) => {
          e.preventDefault()
          setFilter1('overspeed')
        }}
      >
        Over-Speed
      </button>
      <button
        className="btn btn-outline-gray"
        onClick={(e) => {
          e.preventDefault()
          setFilter1('inactive')
        }}
      >
        Inactive
      </button>
    </div>
  )
}

export default StatusButtons
