import React, { useContext, useState, useEffect } from 'react'
import classNames from 'classnames'
import { FixedSizeList as List } from 'react-window'

import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import './DashCon.css'

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
} from '../../features/LivetrackingDataSlice.js'
import { setNewAddress } from '../../features/addressSlice.js'

import MainMap from '../Map/MapComponent'
import { PiEngineFill } from 'react-icons/pi'
import { MdGpsFixed, MdGpsNotFixed } from 'react-icons/md'
import { IoIosArrowDown, IoMdBatteryCharging } from 'react-icons/io'

// ================================CAR==================================
import carGreen from '../../assets/vehicleList/Car/carGreen.svg'
import carRed from '../../assets/vehicleList/Car/carRed.svg'
import carYellow from '../../assets/vehicleList/Car/carYellow.svg'
import carOrange from '../../assets/vehicleList/Car/carOrange.svg'
import carGray from '../../assets/vehicleList/Car/carGray.svg'

//==============================BIKE========================================
import bikeGreen from '../../assets/vehicleList/Bike/bikeGreen.svg'
import bikeRed from '../../assets/vehicleList/Bike/bikeRed.svg'
import bikeYellow from '../../assets/vehicleList/Bike/bikeYellow.svg'
import bikeOrange from '../../assets/vehicleList/Bike/bikeOrange.svg'
import bikeGray from '../../assets/vehicleList/Bike/bikeGray.svg'

import busGreen from '../../assets/vehicleList/Bus/busGreen.svg'
import busRed from '../../assets/vehicleList/Bus/busRed.svg'
import busOrange from '../../assets/vehicleList/Bus/busOrange.svg'
import busYellow from '../../assets/vehicleList/Bus/busYellow.svg'
import busGray from '../../assets/vehicleList/Bus/busGray.svg'

//==============================TRUCK========================================
import truckGreen from '../../assets/vehicleList/Truck/truckGreen.svg'
import truckRed from '../../assets/vehicleList/Truck/truckRed.svg'
import truckYellow from '../../assets/vehicleList/Truck/truckYellow.svg'
import truckOrange from '../../assets/vehicleList/Truck/truckOrange.svg'
import truckGray from '../../assets/vehicleList/Truck/truckGray.svg'

//==============================CRANE========================================
import craneGreen from '../../assets/vehicleList/Crane/craneGreen.svg'
import craneRed from '../../assets/vehicleList/Crane/craneRed.svg'
import craneYellow from '../../assets/vehicleList/Crane/craneYellow.svg'
import craneOrange from '../../assets/vehicleList/Crane/craneOrange.svg'
import craneGray from '../../assets/vehicleList/Crane/craneGray.svg'

//==============================JCB========================================
import jcbGreen from '../../assets/vehicleList/JCB/jcbGreen.svg'
import jcbRed from '../../assets/vehicleList/JCB/jcbRed.svg'
import jcbYellow from '../../assets/vehicleList/JCB/jcbYellow.svg'
import jcbOrange from '../../assets/vehicleList/JCB/jcbOrange.svg'
import jcbGray from '../../assets/vehicleList/JCB/jcbGray.svg'

//==============================AUTO========================================
import autoGreen from '../../assets/vehicleList/Auto/autoGreen.svg'
import autoRed from '../../assets/vehicleList/Auto/autoRed.svg'
import autoYellow from '../../assets/vehicleList/Auto/autoYellow.svg'
import autoOrange from '../../assets/vehicleList/Auto/autoOrange.svg'
import autoGray from '../../assets/vehicleList/Auto/autoGray.svg'

import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { useNavigate } from 'react-router-dom'
import { io } from 'socket.io-client'
dayjs.extend(duration)
import Cookies from 'js-cookie'
import ReactPaginate from 'react-paginate'
import axios from 'axios'

const Dashboard = () => {
  const dispatch = useDispatch()
  const credentials = Cookies.get('crdntl')
  const { filteredVehicles } = useSelector((state) => state.liveFeatures)
  const { newAddress } = useSelector((state) => state.address)
  const [filter, setFilter] = useState('all')
  const [address, setAddress] = useState({});





  // pagination code
  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 10
  const pageCount = Math.ceil(filteredVehicles.length / itemsPerPage)

  const currentVehicles = filteredVehicles.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage,
  )

  const handlePageClick = (event) => {
    setCurrentPage(event.selected)
  }

  // Fetch live vehicles when the component mounts
  useEffect(() => {
    console.log('before initialize socket')
    console.log('credentials: ', credentials)
    dispatch(initializeSocket(credentials))

    console.log('after initialize socket')

    return () => {
      socket.off('all device data')
    }
  }, [])


  const stoppedVehiclesCount = useSelector(
    (state) =>
      state.liveFeatures.vehicles.filter(
        (vehicle) => vehicle.attributes.ignition === false && vehicle.speed < 1,
      ).length,
  )
  const runningVehiclesCount = useSelector(
    (state) =>
      state.liveFeatures.vehicles.filter(
        (vehicle) =>
          vehicle.attributes.ignition === true && vehicle.speed > 2 && vehicle.speed < 60,
      ).length,
  )
  const inactiveVehiclesCount = useSelector(
    (state) =>
      state.liveFeatures.vehicles.filter((vehicle) => {
        const lastUpdate = dayjs(vehicle.lastUpdate)
        const now = dayjs()
        const duration = dayjs.duration(now.diff(lastUpdate))
        return (
          duration.asHours() > 24 || !(vehicle.status == "online")
        )
      }).length,
  )

  const allVehiclesCount =
    useSelector((state) => state.liveFeatures.vehicles.length) + inactiveVehiclesCount

  const idleVehiclesCount = useSelector(
    (state) =>
      state.liveFeatures.vehicles.filter(
        (vehicle) => vehicle.attributes.ignition === true && vehicle.speed < 2,
      ).length,
  )
  const overspeedVehiclesCount = useSelector(
    (state) =>
      state.liveFeatures.vehicles.filter(
        (vehicle) => vehicle.attributes.ignition === true && vehicle.speed > 60,
      ).length,
  )

  const [expandedRow, setExpandedRow] = useState(null)

  const getCategory = (category) => {
    switch (category) {
      case 'car':
        return 'car'
      case 'bus':
        return 'bus'
      case 'truck':
        return 'truck'
      case 'motorcycle':
        return 'bike' // Adjusted to match the imageMap key
      case 'auto':
        return 'auto'
      case 'tractor':
        return 'crane'
      case 'jcb':
        return 'jcb'
      default:
        return 'car' // Default case
    }
  }
  const selectImage = (category, item) => {
    const cate = getCategory(category)
    let image

    const imageMap = {
      car: {
        red: carRed,
        green: carGreen,
        yellow: carYellow,
        orange: carOrange,
        gray: carGray,
      },
      bike: {
        red: bikeRed,
        green: bikeGreen,
        yellow: bikeYellow,
        orange: bikeOrange,
        gray: bikeGray,
      },
      truck: {
        red: truckRed,
        green: truckGreen,
        yellow: truckYellow,
        orange: truckOrange,
        gray: truckGray,
      },
      auto: {
        red: autoRed,
        green: autoGreen,
        yellow: autoYellow,
        orange: autoOrange,
        gray: autoGray,
      },
      jcb: {
        red: jcbRed,
        green: jcbGreen,
        yellow: jcbYellow,
        orange: jcbOrange,
        gray: jcbGray,
      },
      crane: {
        red: craneRed,
        green: craneGreen,
        yellow: craneYellow,
        orange: craneOrange,
        gray: craneGray,
      },
      tractor: {
        red: craneRed,
        green: craneGreen,
        yellow: craneYellow,
        orange: craneOrange,
        gray: craneGray,
      },
      bus: {
        red: busRed,
        green: busGreen,
        yellow: busYellow,
        orange: busOrange,
        gray: busGray,
      },
    }

    // Safely handle undefined position or attributes
    if (!item || !item.attributes) {
      // Handle the case where position or attributes are undefined
      return imageMap[cate]?.gray || car // Return a gray or default image
    }

    const ignition = item.attributes.ignition
    const speed = item.speed || 0

    if (!ignition && speed < 1) {
      image = imageMap[cate].red
    } else if (ignition && speed > 2 && speed < 60) {
      image = imageMap[cate].green
    } else if (ignition && speed < 2) {
      image = imageMap[cate].yellow
    } else if (ignition && speed > 60) {
      image = imageMap[cate].orange
    } else {
      image = imageMap[cate].gray
    }

    return image || car // Return a default image if no match found
  }
  const navigate = useNavigate()
  const handleClickOnTrack = (vehicle) => {
    console.log('trcak clicked')
    navigate(`/salesman/${vehicle.deviceId}/${vehicle.category}/${vehicle.name}`)
  }

  const visibleColumns = useSelector((state) => state.columnVisibility)

  const fetchAddress = async (vehicleId, longitude, latitude) => {
    try {
      const apiKey = 'DG2zGt0KduHmgSi2kifd'; // Replace with your actual MapTiler API key
      const response = await axios.get(
        `https://api.maptiler.com/geocoding/${longitude},${latitude}.json?key=${apiKey}`
      );
      // console.log(response)
      const address = response.data.features.length <= 5
        ? response.data.features[0].place_name_en
        : response.data.features[1].place_name_en;

      setAddress(prevAddresses => ({
        ...prevAddresses,
        [vehicleId]: address, // Update the specific vehicle's address
      }));
    } catch (error) {
      console.error('Error fetching the address:', error);
      setAddress(prevAddresses => ({
        ...prevAddresses,
        [vehicleId]: 'Error fetching address',
      }));
    }
  };

  const setNewAddressForRedux = (address) => {
    if (address) {
      dispatch(setNewAddress(address));
    }
  };

  useEffect(() => {
    setNewAddressForRedux(address);
  }, [address])

  useEffect(() => {
    console.log("filtered vehicle", filteredVehicles);
    filteredVehicles.forEach(vehicle => {
      if (vehicle?.deviceId && vehicle.longitude && vehicle.latitude && !address[vehicle.id]) {
        // Fetch address only if it's not already fetched for this vehicle
        fetchAddress(vehicle.deviceId, vehicle.longitude, vehicle.latitude);
      }
    });
    // console.log(address)
  }, [filteredVehicles])

  return (
    <>
      {/* <WidgetsDropdown className="mb-4" /> */}
      <CRow className="gutter-0">
        <CCol xs>
          <CCard style={{ borderRadius: '0px' }}>
            {/* <CCardHeader>Vehicle's{' & '}Devices Info</CCardHeader> */}
            <CCardBody className="content mt-4">
              {/* <hr className="mt-0 mb-0" /> */}

              {/* <CRow>
            <CCol sm={7} className="d-none d-md-block"></CCol>
          </CRow> */}
              <MainMap filteredVehicles={filteredVehicles} />

              {/* <div className="mb-5"></div> */}

              <br />
              <CRow className="justify-content-space-around">
                <CCol xs={12} md={2} xl={2} className="count-col countallCol">
                  <div
                    className="border-start border-start-4 border-start-error countAll py-1 px-3"
                    onClick={() => {
                      dispatch(filterAllVehicles())
                    }}
                  >
                    <div className="text-body-secondary text-truncate small ">All</div>
                    <div className="fs-5 fw-semibold allData">{allVehiclesCount}</div>
                  </div>
                </CCol>

                <CCol xs={12} md={2} xl={2} className="count-col">
                  <div className="border-start border-start-4 border-start-success countRun py-1 px-3">
                    <div className="text-body-secondary text-truncate small ">Running</div>
                    <div className="fs-5 fw-semibold runningData">{runningVehiclesCount}</div>
                  </div>

                  <div
                    className="img"
                    onClick={() => {
                      dispatch(filterRunningVehicles())
                    }}
                  >
                    <img style={{ width: '3.5rem' }} src={carGreen} alt="" />
                  </div>
                </CCol>

                <CCol xs={12} md={2} xl={2} className="count-col">
                  <div className="border-start border-start-4 border-start-danger countStop py-1 px-3">
                    <div className="text-body-secondary text-truncate small ">Stopped</div>
                    <div className="fs-5 fw-semibold stopData">{stoppedVehiclesCount}</div>
                  </div>

                  <div
                    className="img"
                    onClick={() => {
                      dispatch(filterStoppedVehicles())
                    }}
                  >
                    <img style={{ width: '3.5rem' }} src={carRed} alt="" />
                  </div>
                </CCol>

                <CCol xs={12} md={2} xl={2} className="count-col">
                  <div className="border-start border-start-4 border-start py-1 px-3 countldel">
                    <div className="text-body-secondary text-truncate small ">Idle</div>
                    <div className="fs-5 fw-semibold idleData">{idleVehiclesCount}</div>
                  </div>

                  <div
                    className="img"
                    onClick={() => {
                      dispatch(filterIdleVehicles())
                    }}
                  >
                    <img style={{ width: '3.5rem' }} src={carYellow} alt="" />
                  </div>
                </CCol>

                <CCol xs={12} md={2} xl={2} className="count-col">
                  <div className="border-start border-start-4 border-start countOverSpeed py-1 px-3">
                    <div className="text-body-secondary text-truncate small ">Overspeed</div>
                    <div className="fs-5 fw-semibold overspeedData">{overspeedVehiclesCount}</div>
                  </div>

                  <div
                    className="img"
                    onClick={() => {
                      dispatch(filterOverspeedVehicles())
                    }}
                  >
                    <img style={{ width: '3.5rem' }} src={carOrange} alt="" />
                  </div>
                </CCol>

                <CCol xs={12} md={2} xl={2} className="count-col">
                  <div className="border-start border-start-4 border-start-error countInactive py-1 px-3">
                    <div className="text-body-secondary text-truncate small ">Inactive</div>
                    <div className="fs-5 fw-semibold inactiveData">{inactiveVehiclesCount}</div>
                  </div>

                  <div
                    className="img"
                    onClick={() => {
                      dispatch(filterInactiveVehicles())
                    }}
                  >
                    <img style={{ width: '3.5rem' }} src={carGray} alt="" />
                  </div>
                </CCol>
              </CRow>
              <hr />
              <br />

              <div className="table-container" style={{ overflowY: 'auto' }}>
                <CTable className="my-3 border vehiclesTable mt-0" hover responsive>
                  <CTableHead
                    className="text-nowrap"
                    style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#f8f9fa' }}
                  >
                    <CTableRow>
                      {visibleColumns.srNo && (
                        <CTableHeaderCell
                          className="bg-body-tertiary text-center sr-no table-cell"
                          style={{ position: 'sticky', top: 0 }}
                        >
                          Sr No.
                        </CTableHeaderCell>
                      )}
                      {visibleColumns.vehicle && (
                        <CTableHeaderCell
                          className="bg-body-tertiary text-center vehicle table-cell"
                          style={{ position: 'sticky', top: 0 }}
                        >
                          Vehicle
                        </CTableHeaderCell>
                      )}
                      {visibleColumns.deviceName && (
                        <CTableHeaderCell
                          className="bg-body-tertiary text-center device-name table-cell"
                          style={{ position: 'sticky', top: 0 }}
                        >
                          Device Name
                        </CTableHeaderCell>
                      )}
                      {visibleColumns.address && (
                        <CTableHeaderCell
                          className="bg-body-tertiary text-center address table-cell"
                          style={{
                            position: 'sticky',
                            top: 0,
                            width: '25%',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          Address
                        </CTableHeaderCell>
                      )}
                      {visibleColumns.lastUpdate && (
                        <CTableHeaderCell
                          className="bg-body-tertiary text-center last-update table-cell"
                          style={{
                            position: 'sticky',
                            top: 0,
                            width: '25%',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          Last Update
                        </CTableHeaderCell>
                      )}
                      {visibleColumns.cd && (
                        <CTableHeaderCell
                          className="bg-body-tertiary text-center current-delay table-cell"
                          style={{ position: 'sticky', top: 0 }}
                        >
                          &nbsp;&nbsp; C/D &nbsp;&nbsp;
                        </CTableHeaderCell>
                      )}
                      {visibleColumns.sp && (
                        <CTableHeaderCell
                          className="bg-body-tertiary text-center speed table-cell"
                          style={{ position: 'sticky', top: 0 }}
                        >
                          Sp
                        </CTableHeaderCell>
                      )}
                      {visibleColumns.distance && (
                        <CTableHeaderCell
                          className="bg-body-tertiary text-center distance table-cell"
                          style={{ position: 'sticky', top: 0 }}
                        >
                          Distance
                        </CTableHeaderCell>
                      )}
                      {visibleColumns.td && (
                        <CTableHeaderCell
                          className="bg-body-tertiary text-center total-distance table-cell"
                          style={{ position: 'sticky', top: 0 }}
                        >
                          T/D
                        </CTableHeaderCell>
                      )}
                      {visibleColumns.sat && (
                        <CTableHeaderCell
                          className="bg-body-tertiary text-center satellite table-cell"
                          style={{ position: 'sticky', top: 0 }}
                        >
                          GPS
                        </CTableHeaderCell>
                      )}
                      {visibleColumns.ig && (
                        <CTableHeaderCell
                          className="bg-body-tertiary text-center ignition table-cell"
                          style={{ position: 'sticky', top: 0 }}
                        >
                          Ig
                        </CTableHeaderCell>
                      )}
                      {visibleColumns.gps && (
                        <CTableHeaderCell
                          className="bg-body-tertiary text-center gps table-cell"
                          style={{ position: 'sticky', top: 0 }}
                        >
                          GSM
                        </CTableHeaderCell>
                      )}
                      {visibleColumns.power && (
                        <CTableHeaderCell
                          className="bg-body-tertiary text-center power table-cell"
                          style={{ position: 'sticky', top: 0 }}
                        >
                          Power
                        </CTableHeaderCell>
                      )}
                      <CTableHeaderCell
                        className="bg-body-tertiary text-center status table-cell"
                        style={{ position: 'sticky', top: 0, width: '15%' }}
                      >
                        Track
                      </CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>

                  <CTableBody>
                    {filteredVehicles.length > 0 ? (
                      currentVehicles.map((item, index) => (
                        <CTableRow key={index} className={`table-row collapsed trans`}>
                          {/* Sr No. */}
                          {visibleColumns.srNo && (
                            <CTableDataCell className="text-center sr-no table-cell">
                              {currentPage * itemsPerPage + index + 1}
                            </CTableDataCell>
                          )}
                          {visibleColumns.vehicle && (
                            <CTableDataCell className="text-center vehicle table-cell">
                              <div>
                                {(() => {
                                  // const device = salesman.find((device) => device.id === item.deviceId)
                                  return (
                                    <img
                                      src={item && selectImage(item.category, item)}
                                      className="dashimg upperdata"
                                      alt="vehicle"
                                    />
                                  )
                                })()}
                              </div>
                              {expandedRow === index && (
                                <>
                                  <hr />
                                  {(() => {
                                    // const device = salesman.find(
                                    //   (device) => device.id === item.deviceId,
                                    // )
                                    return (
                                      <div className="upperdata">
                                        {item ? item.category : 'Currently Not Available'}
                                      </div>
                                    )
                                  })()}
                                </>
                              )}
                            </CTableDataCell>
                          )}
                          {visibleColumns.deviceName && (
                            <CTableDataCell className="device-name table-cell n text-center">
                              {(() => {
                                // const device = salesman.find((device) => device.id === item.deviceId)
                                if (item && item.name) {
                                  const nameParts = item.name.split(' ')
                                  const firstWord = nameParts[0]
                                  const remainingWords = nameParts.slice(1).join(' ') // Join remaining words

                                  return (
                                    <>
                                      <div className="upperdata">
                                        <div>{firstWord}</div> {/* First word on the first line */}
                                        {remainingWords && <div>{remainingWords}</div>}{' '}
                                        {/* Remaining words on the second line if present */}
                                      </div>
                                      {expandedRow === index && (
                                        <>
                                          <hr />
                                          <div>
                                            <PiEngineFill />
                                          </div>
                                        </>
                                      )}
                                    </>
                                  )
                                }
                                return <div className="upperdata">Unknown</div>
                              })()}
                            </CTableDataCell>
                          )}
                          {visibleColumns.address && (
                            <CTableDataCell
                              className="text-center address table-cell"
                              style={{ minWidth: '500px' }}
                            >
                              <span className="upperdata" style={{ fontSize: '1rem', textWrap: 'auto' }}>
                                {newAddress[item.deviceId] || 'Loading...'}
                              </span>
                            </CTableDataCell>
                          )}
                          {visibleColumns.lastUpdate && (
                            <CTableDataCell className="text-center last-update table-cell">
                              {(() => {
                                // const device = salesman.find((device) => device.id === item.deviceId)
                                if (item && item.lastUpdate) {
                                  const date = dayjs(item.lastUpdate).format('YYYY-MM-DD') // Format date
                                  const time = dayjs(item.lastUpdate).format('HH:mm:ss') // Format time
                                  return (
                                    <div className="upperdata ld">
                                      <div>{date}</div> {/* Date on one line */}
                                      <div>{time}</div> {/* Time on the next line */}
                                    </div>
                                  )
                                }
                                return <div>N/A</div>
                              })()}
                            </CTableDataCell>
                          )}
                          {visibleColumns.cd && (
                            <CTableDataCell className="text-center cd current-delay table-cell">
                              {(() => {
                                // const device = salesman.find((device) => device.id === item.deviceId)
                                if (item && item.lastUpdate) {
                                  const now = dayjs()
                                  const lastUpdate = dayjs(item.lastUpdate)
                                  const duration = dayjs.duration(now.diff(lastUpdate))

                                  const days = duration.days()
                                  const hours = duration.hours()
                                  const minutes = duration.minutes()
                                  const seconds = duration.seconds()

                                  // Conditional formatting based on duration values
                                  if (days > 0) {
                                    return `${days}d ${hours}h ${minutes}m`
                                  } else if (hours > 0) {
                                    return `${hours}h ${minutes}m`
                                  } else if (minutes > 0) {
                                    return `${minutes}m`
                                  } else {
                                    return `${seconds}s` // Display seconds if all else is zero
                                  }
                                }
                                return '0s' // Default if no device or lastUpdate
                              })()}
                            </CTableDataCell>
                          )}
                          {visibleColumns.sp && (
                            <CTableDataCell className="text-center sp speed table-cell">
                              <div className="upperdata">{`${Math.round(item.speed)} kmph`}</div>
                              {expandedRow === index && (
                                <>
                                  <hr />
                                  <div>
                                    <PiEngineFill />
                                  </div>
                                </>
                              )}
                            </CTableDataCell>
                          )}
                          {visibleColumns.distance && (
                            <CTableDataCell className="text-center d distance table-cell">
                              {`${Math.round(item.attributes.distance)} km`}
                            </CTableDataCell>
                          )}
                          {visibleColumns.td && (
                            <CTableDataCell className="text-center td total-distance table-cell">
                              {`${Math.round(item.attributes.totalDistance)} km`}
                            </CTableDataCell>
                          )}
                          {visibleColumns.sat && (
                            <CTableDataCell className="text-center satelite table-cell">
                              <div style={{ position: 'relative', display: 'inline-block' }}>
                                <MdGpsNotFixed style={{ fontSize: '1.6rem' }} />{' '}
                                {/* Adjust icon size as needed */}
                                <span
                                  style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '49%',
                                    transform: 'translate(-50%, -50%)',
                                    fontSize: '0.8rem', // Adjust text size
                                    color: 'black',
                                    fontWeight: 'bold',
                                  }}
                                >
                                  {item.attributes.sat}
                                </span>
                              </div>
                            </CTableDataCell>
                          )}
                          {visibleColumns.ig && (
                            <CTableDataCell className="text-center ignition table-cell">
                              {(() => {
                                const { ignition } = item.attributes

                                let iconColor = 'gray' // Default color
                                let iconText = 'N/A' // Default text

                                if (ignition) {
                                  iconColor = 'green'
                                  iconText = 'On'
                                } else if (ignition === false) {
                                  iconColor = 'red'
                                  iconText = 'Off'
                                }

                                return (
                                  <div style={{ color: iconColor, fontSize: '1.1rem' }}>
                                    <PiEngineFill />
                                  </div>
                                )
                              })()}
                            </CTableDataCell>
                          )}
                          {visibleColumns.gps && (
                            <CTableDataCell className="text-center gps table-cell">
                              {(() => {
                                const { valid } = item

                                let iconColor = 'gray' // Default color
                                let iconText = 'N/A' // Default text

                                if (valid) {
                                  iconColor = 'green'
                                  iconText = 'On'
                                } else if (valid === false) {
                                  iconColor = 'red'
                                  iconText = 'Off'
                                }

                                return (
                                  <div style={{ color: iconColor, fontSize: '1.1rem' }}>
                                    <MdGpsFixed />
                                  </div>
                                )
                              })()}
                            </CTableDataCell>
                          )}
                          {visibleColumns.power && (
                            <CTableDataCell className="text-center power table-cell">
                              {(() => {
                                const power = item.attributes.battery

                                let iconColor = 'gray' // Default color
                                let iconText = 'N/A' // Default text

                                if (power) {
                                  iconColor = 'green'
                                  iconText = 'On'
                                } else if (power === false) {
                                  iconColor = 'red'
                                  iconText = 'Off'
                                }

                                return (
                                  <div style={{ color: iconColor, fontSize: '1.2rem' }}>
                                    <IoMdBatteryCharging />
                                  </div>
                                )
                              })()}
                            </CTableDataCell>
                          )}
                          <CTableDataCell className="text-center status table-cell">
                            <button
                              className="btn shadow-sm"
                              style={{ backgroundColor: '#000000', fontSize: '1rem', color: 'white' }}
                              onClick={() => handleClickOnTrack(item)}
                            >
                              Live Track
                            </button>
                          </CTableDataCell>
                        </CTableRow>
                      ))
                    ) : (
                      <CTableRow>
                        <CTableDataCell colSpan="15" className="text-center">
                          <div className="text-nowrap mb-2 text-center w-">
                            <p className="card-text placeholder-glow">
                              <span className="placeholder col-12" />
                            </p>
                            <p className="card-text placeholder-glow">
                              <span className="placeholder col-12" />
                            </p>
                            <p className="card-text placeholder-glow">
                              <span className="placeholder col-12" />
                            </p>
                            <p className="card-text placeholder-glow">
                              <span className="placeholder col-12" />
                            </p>
                          </div>
                        </CTableDataCell>
                      </CTableRow>
                    )}
                  </CTableBody>
                </CTable>
                <div className="mt-3">
                  {' '}
                  {/* Adds margin to the right of pagination */}
                  <ReactPaginate
                    breakLabel="..."
                    nextLabel="next >"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={5}
                    pageCount={pageCount} // Total number of pages
                    previousLabel="< previous"
                    renderOnZeroPageCount={null}
                    marginPagesDisplayed={2}
                    containerClassName="pagination justify-content-center"
                    pageClassName="page-item"
                    pageLinkClassName="page-link"
                    previousClassName="page-item"
                    previousLinkClassName="page-link"
                    nextClassName="page-item"
                    nextLinkClassName="page-link"
                    activeClassName="active"
                  />
                </div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      {/* <WidgetsBrand className="mb-4" withCharts /> */}
    </>
  )
}

export default Dashboard
