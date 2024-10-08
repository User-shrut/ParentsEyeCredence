import { CTableBody, CTableDataCell, CTableRow } from '@coreui/react'
import React from 'react'
import { IoIosArrowDown, IoMdBatteryCharging } from 'react-icons/io'
import { MdGpsFixed, MdGpsNotFixed } from 'react-icons/md'
import { PiEngineFill } from 'react-icons/pi'

const DashboardTableBody = () => {
  return (
    <>
      <CTableBody>
        {filteredVehicles.map((item, index) => (
          <CTableRow key={index} className={`table-row collapsed trans`}>
            {/* Sr No. */}
            {visibleColumns.srNo && (
              <CTableDataCell className="text-center sr-no table-cell">
                <IoIosArrowDown /> &nbsp; {index + 1}
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
              <CTableDataCell className="text-center address table-cell" style={{ width: '20rem' }}>
                <div className="upperdata" style={{ fontSize: '1rem' }}>
                  shiv kailasa, mihan, khapri, nagpur, maharshtra 111111
                </div>
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
              <button className="btn btn-primary" onClick={() => handleClickOnTrack(item)}>
                Live Track
              </button>
            </CTableDataCell>
          </CTableRow>
        ))}
      </CTableBody>
    </>
  )
}

export default DashboardTableBody
