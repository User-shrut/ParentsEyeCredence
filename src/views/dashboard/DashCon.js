import React, { useContext, useState } from 'react'
import classNames from 'classnames'

import {
  CAvatar,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CProgress,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import './DashCon.css'
import {
  cibCcAmex,
  cibCcApplePay,
  cibCcMastercard,
  cibCcPaypal,
  cibCcStripe,
  cibCcVisa,
  cibGoogle,
  cibFacebook,
  cibLinkedin,
  cifBr,
  cifEs,
  cifFr,
  cifIn,
  cifPl,
  cifUs,
  cibTwitter,
  cilCloudDownload,
  cilPeople,
  cilUser,
  cilUserFemale,
} from '@coreui/icons'

import avatar1 from 'src/assets/images/avatars/1.jpg'
import avatar2 from 'src/assets/images/avatars/2.jpg'
import avatar3 from 'src/assets/images/avatars/3.jpg'
import avatar4 from 'src/assets/images/avatars/4.jpg'
import avatar5 from 'src/assets/images/avatars/5.jpg'
import avatar6 from 'src/assets/images/avatars/6.jpg'

import WidgetsBrand from '../widgets/WidgetsBrand'
import WidgetsDropdown from '../widgets/WidgetsDropdown'
import MainMap from '../Map/MapComponent'
import { GlobalContext } from '../../Context/Context'
import { PiEngineFill } from 'react-icons/pi'
import { MdGpsFixed } from "react-icons/md";
import { IoMdBatteryCharging } from "react-icons/io";


// ================================CAR==================================
import carGreen from "../../assets/vehicleList/Car/carGreen.svg";
import carRed from "../../assets/vehicleList/Car/carRed.svg";
import carYellow from "../../assets/vehicleList/Car/carYellow.svg";
import carOrange from "../../assets/vehicleList/Car/carOrange.svg";
import carGray from "../../assets/vehicleList/Car/carGray.svg";

//==============================BIKE========================================
import bikeGreen from "../../assets/vehicleList/Bike/bikeGreen.svg";
import bikeRed from "../../assets/vehicleList/Bike/bikeRed.svg";
import bikeYellow from "../../assets/vehicleList/Bike/bikeYellow.svg";
import bikeOrange from "../../assets/vehicleList/Bike/bikeOrange.svg";
import bikeGray from "../../assets/vehicleList/Bike/bikeGray.svg";


import busGreen from "../../assets/vehicleList/Bus/busGreen.svg";
import busRed from "../../assets/vehicleList/Bus/busRed.svg";
import busOrange from "../../assets/vehicleList/Bus/busOrange.svg";
import busYellow from "../../assets/vehicleList/Bus/busYellow.svg";
import busGray from "../../assets/vehicleList/Bus/busGray.svg";

//==============================TRUCK========================================
import truckGreen from "../../assets/vehicleList/Truck/truckGreen.svg";
import truckRed from "../../assets/vehicleList/Truck/truckRed.svg";
import truckYellow from "../../assets/vehicleList/Truck/truckYellow.svg";
import truckOrange from "../../assets/vehicleList/Truck/truckOrange.svg";
import truckGray from "../../assets/vehicleList/Truck/truckGray.svg";

//==============================CRANE========================================
import craneGreen from "../../assets/vehicleList/Crane/craneGreen.svg";
import craneRed from "../../assets/vehicleList/Crane/craneRed.svg";
import craneYellow from "../../assets/vehicleList/Crane/craneYellow.svg";
import craneOrange from "../../assets/vehicleList/Crane/craneOrange.svg";
import craneGray from "../../assets/vehicleList/Crane/craneGray.svg";

//==============================JCB========================================
import jcbGreen from "../../assets/vehicleList/JCB/jcbGreen.svg";
import jcbRed from "../../assets/vehicleList/JCB/jcbRed.svg";
import jcbYellow from "../../assets/vehicleList/JCB/jcbYellow.svg";
import jcbOrange from "../../assets/vehicleList/JCB/jcbOrange.svg";
import jcbGray from "../../assets/vehicleList/JCB/jcbGray.svg";

//==============================AUTO========================================
import autoGreen from "../../assets/vehicleList/Auto/autoGreen.svg";
import autoRed from "../../assets/vehicleList/Auto/autoRed.svg";
import autoYellow from "../../assets/vehicleList/Auto/autoYellow.svg";
import autoOrange from "../../assets/vehicleList/Auto/autoOrange.svg";
import autoGray from "../../assets/vehicleList/Auto/autoGray.svg";

import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
dayjs.extend(duration)


const Dashboard = () => {
  const { salesManList, salesman } = useContext(GlobalContext)
  const [expandedRow, setExpandedRow] = useState(null)

  const handleRowClick = (index) => {
    setExpandedRow(expandedRow === index ? null : index)
  }

  const getCategory = (category) => {
    switch (category) {
      case "car":
        return "car";
      case "bus":
        return "bus";
      case "truck":
        return "truck";
      case "motorcycle":
        return "bike"; // Adjusted to match the imageMap key
      case "auto":
        return "auto";
      case "tractor":
        return "crane";
      case "jcb":
        return "jcb";
      default:
        return "car"; // Default case
    }
  };
  const selectImage = (category, item) => {
    const cate = getCategory(category);
    let image;

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
    };

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
  };


  const progressExample = [
    { title: 'Visits', value: '29.703 Users', percent: 40, color: 'success' },
    { title: 'Unique', value: '24.093 Users', percent: 20, color: 'info' },
    { title: 'Pageviews', value: '78.706 Views', percent: 60, color: 'warning' },
    { title: 'New Users', value: '22.123 Users', percent: 80, color: 'danger' },
    { title: 'Bounce Rate', value: 'Average Rate', percent: 40.15, color: 'primary' },
  ]

  const progressGroupExample1 = [
    { title: 'Monday', value1: 34, value2: 78 },
    { title: 'Tuesday', value1: 56, value2: 94 },
    { title: 'Wednesday', value1: 12, value2: 67 },
    { title: 'Thursday', value1: 43, value2: 91 },
    { title: 'Friday', value1: 22, value2: 73 },
    { title: 'Saturday', value1: 53, value2: 82 },
    { title: 'Sunday', value1: 9, value2: 69 },
  ]

  const progressGroupExample2 = [
    { title: 'Male', icon: cilUser, value: 53 },
    { title: 'Female', icon: cilUserFemale, value: 43 },
  ]

  const progressGroupExample3 = [
    { title: 'Organic Search', icon: cibGoogle, percent: 56, value: '191,235' },
    { title: 'Facebook', icon: cibFacebook, percent: 15, value: '51,223' },
    { title: 'Twitter', icon: cibTwitter, percent: 11, value: '37,564' },
    { title: 'LinkedIn', icon: cibLinkedin, percent: 8, value: '27,319' },
  ]

  const tableExample = [
    {
      avatar: { src: avatar1, status: 'success' },
      user: {
        name: 'Yiorgos Avraamu',
        new: true,
        registered: 'Jan 1, 2023',
      },
      country: { name: 'USA', flag: cifUs },
      usage: {
        value: 50,
        period: 'Jun 11, 2023 - Jul 10, 2023',
        color: 'success',
      },
      payment: { name: 'Mastercard', icon: cibCcMastercard },
      activity: '10 sec ago',
    },
    {
      avatar: { src: avatar2, status: 'danger' },
      user: {
        name: 'Avram Tarasios',
        new: false,
        registered: 'Jan 1, 2023',
      },
      country: { name: 'Brazil', flag: cifBr },
      usage: {
        value: 22,
        period: 'Jun 11, 2023 - Jul 10, 2023',
        color: 'info',
      },
      payment: { name: 'Visa', icon: cibCcVisa },
      activity: '5 minutes ago',
    },
    {
      avatar: { src: avatar3, status: 'warning' },
      user: { name: 'Quintin Ed', new: true, registered: 'Jan 1, 2023' },
      country: { name: 'India', flag: cifIn },
      usage: {
        value: 74,
        period: 'Jun 11, 2023 - Jul 10, 2023',
        color: 'warning',
      },
      payment: { name: 'Stripe', icon: cibCcStripe },
      activity: '1 hour ago',
    },
    {
      avatar: { src: avatar4, status: 'secondary' },
      user: { name: 'Enéas Kwadwo', new: true, registered: 'Jan 1, 2023' },
      country: { name: 'France', flag: cifFr },
      usage: {
        value: 98,
        period: 'Jun 11, 2023 - Jul 10, 2023',
        color: 'danger',
      },
      payment: { name: 'PayPal', icon: cibCcPaypal },
      activity: 'Last month',
    },
    {
      avatar: { src: avatar5, status: 'success' },
      user: {
        name: 'Agapetus Tadeáš',
        new: true,
        registered: 'Jan 1, 2023',
      },
      country: { name: 'Spain', flag: cifEs },
      usage: {
        value: 22,
        period: 'Jun 11, 2023 - Jul 10, 2023',
        color: 'primary',
      },
      payment: { name: 'Google Wallet', icon: cibCcApplePay },
      activity: 'Last week',
    },
    {
      avatar: { src: avatar6, status: 'danger' },
      user: {
        name: 'Friderik Dávid',
        new: true,
        registered: 'Jan 1, 2023',
      },
      country: { name: 'Poland', flag: cifPl },
      usage: {
        value: 43,
        period: 'Jun 11, 2023 - Jul 10, 2023',
        color: 'success',
      },
      payment: { name: 'Amex', icon: cibCcAmex },
      activity: 'Last week',
    },
  ]

  return (
    <>
      <WidgetsDropdown className="mb-4" />
      <CCard className="mb-4">
        <CCardBody>
          <CRow>
            <CCol sm={7} className="d-none d-md-block"></CCol>
          </CRow>
          <MainMap />
        </CCardBody>
        <CCardFooter>
          <CRow
            xs={{ cols: 1, gutter: 4 }}
            sm={{ cols: 2 }}
            lg={{ cols: 4 }}
            xl={{ cols: 5 }}
            className="mb-2 text-center"
          >
            {progressExample.map((item, index, items) => (
              <CCol
                className={classNames({
                  'd-none d-xl-block': index + 1 === items.length,
                })}
                key={index}
              >
                <div className="text-body-secondary">{item.title}</div>
                <div className="fw-semibold text-truncate">
                  {item.value} ({item.percent}%)
                </div>
                <CProgress thin className="mt-2" color={item.color} value={item.percent} />
              </CCol>
            ))}
          </CRow>
        </CCardFooter>
      </CCard>
      <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader>Vehicle's{' & '}Devices Info</CCardHeader>
            <CCardBody>
              <CRow className="justify-content-center">
                <CCol xs={12} md={2} xl={2}>
                  <div className="border-start border-start-4 border-start-success py-1 px-3">
                    <div className="text-body-secondary text-truncate small">Running</div>
                    <div className="fs-5 fw-semibold">9,123</div>
                  </div>
                </CCol>

                <CCol xs={12} md={2} xl={2}>
                  <div className="border-start border-start-4 border-start py-1 px-3 mb-3 countldel">
                    <div className="text-body-secondary text-truncate small">Idle</div>
                    <div className="fs-5 fw-semibold">22,643</div>
                  </div>
                </CCol>

                <CCol xs={12} md={2} xl={2}>
                  <div className="border-start border-start-4 border-start-danger py-1 px-3 mb-3">
                    <div className="text-body-secondary text-truncate small">Stopped</div>
                    <div className="fs-5 fw-semibold">78,623</div>
                  </div>
                </CCol>

                <CCol xs={12} md={2} xl={2}>
                  <div className="border-start border-start-4 border-start countOverSpeed py-1 px-3 mb-3">
                    <div className="text-body-secondary text-truncate small">Overspeed</div>
                    <div className="fs-5 fw-semibold">49,123</div>
                  </div>
                </CCol>

                <CCol xs={12} md={2} xl={2}>
                  <div className="border-start border-start-4 border-start-error countInactive py-1 px-3 mb-3">
                    <div className="text-body-secondary text-truncate small">Inactive</div>
                    <div className="fs-5 fw-semibold">49,123</div>
                  </div>
                </CCol>
              </CRow>
              <hr className="mt-0" />

              <div className="mb-5"></div>

              <br />
              <div className="table-container" style={{ height: '53rem', overflowY: 'auto' }}>
                <CTable className="my-3 border vehiclesTable" hover responsive>
  <CTableHead
    className="text-nowrap"
    style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#f8f9fa' }}
  >
    <CTableRow>
      <CTableHeaderCell className="bg-body-tertiary text-center sr-no table-cell" style={{ position: 'sticky', top: 0 }}>
        Sr No.
      </CTableHeaderCell>

      <CTableHeaderCell className="bg-body-tertiary text-center vehicle table-cell" style={{ position: 'sticky', top: 0 }}>
        Vehicle
      </CTableHeaderCell>

      <CTableHeaderCell className="bg-body-tertiary text-center device-name table-cell" style={{ position: 'sticky', top: 0 }}>
        Device Name
      </CTableHeaderCell>

      <CTableHeaderCell
        className="bg-body-tertiary text-center address table-cell"
        style={{ position: 'sticky', top: 0, width: '25%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
      >
        Address
      </CTableHeaderCell>

      <CTableHeaderCell
        className="bg-body-tertiary text-center last-update table-cell"
        style={{ position: 'sticky', top: 0, width: '25%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
      >
        Last Update
      </CTableHeaderCell>

      <CTableHeaderCell className="bg-body-tertiary text-center current-delay table-cell" style={{ position: 'sticky', top: 0 }}>
        Current Delay
      </CTableHeaderCell>

      <CTableHeaderCell className="bg-body-tertiary text-center speed table-cell" style={{ position: 'sticky', top: 0 }}>
        Speed
      </CTableHeaderCell>

      <CTableHeaderCell className="bg-body-tertiary text-center distance table-cell" style={{ position: 'sticky', top: 0 }}>
        Distance
      </CTableHeaderCell>

      <CTableHeaderCell className="bg-body-tertiary text-center total-distance table-cell" style={{ position: 'sticky', top: 0 }}>
        Total Distance
      </CTableHeaderCell>

      <CTableHeaderCell className="bg-body-tertiary text-center satelite table-cell" style={{ position: 'sticky', top: 0 }}>
        Satelite
      </CTableHeaderCell>

      <CTableHeaderCell className="bg-body-tertiary text-center ignition table-cell" style={{ position: 'sticky', top: 0 }}>
        Ignition
      </CTableHeaderCell>

      <CTableHeaderCell className="bg-body-tertiary text-center gps table-cell" style={{ position: 'sticky', top: 0 }}>
        GPS
      </CTableHeaderCell>

      <CTableHeaderCell className="bg-body-tertiary text-center power table-cell" style={{ position: 'sticky', top: 0 }}>
        Power
      </CTableHeaderCell>

      <CTableHeaderCell className="bg-body-tertiary text-center status table-cell" style={{ position: 'sticky', top: 0, width: '15%' }}>
        Track
      </CTableHeaderCell>
    </CTableRow>
  </CTableHead>

  <CTableBody>
    {salesManList?.map((item, index) => (
      <CTableRow
        key={index}
        onClick={() => handleRowClick(index)}
        className={`table-row ${expandedRow === index ? 'expanded' : 'collapsed'} trans`}
      >
        {/* Sr No. */}
        <CTableDataCell className="text-center sr-no table-cell">
          {index + 1}
        </CTableDataCell>

        {/* Vehicle */}
        <CTableDataCell className="text-center vehicle table-cell">
          <div>
            {(() => {
              const device = salesman.find((device) => device.id === item.deviceId);
              return (
                <img src={selectImage(device.category, item)} className="dashimg upperdata" alt="vehicle" />
              );
            })()}
          </div>
          {expandedRow === index && (
            <>
              <hr />
              {(() => {
                const device = salesman.find((device) => device.id === item.deviceId);
                return (
                  <div className="upperdata">
                    {device ? device.category : 'Currently Not Available'}
                  </div>
                );
              })()}
            </>
          )}
        </CTableDataCell>

        {/* Device Name */}
        <CTableDataCell className="device-name table-cell">
          {(() => {
            const device = salesman.find((device) => device.id === item.deviceId);
            return (
              <>
                <div className="upperdata">{device ? device.name : 'Unknown'}</div>
                {expandedRow === index && (
                  <>
                    <hr />
                    <div>
                      <PiEngineFill />
                    </div>
                  </>
                )}
              </>
            );
          })()}
        </CTableDataCell>

        {/* Address */}
        <CTableDataCell className="text-center address table-cell" style={{ width: '20rem' }}>
          <div className="upperdata" style={{ fontSize: '1rem' }}>
            shiv kailasa, mihan, khapri, nagpur, maharshtra 111111
          </div>
        </CTableDataCell>

        {/* Last Update */}
        <CTableDataCell className="text-center last-update table-cell">
          {(() => {
            const device = salesman.find((device) => device.id === item.deviceId);
            const lastUpdate = device ? dayjs(device.lastUpdate).format('YYYY-MM-DD HH:mm:ss') : 'N/A';
            return (
              <div className="upperdata">
                {lastUpdate}
              </div>
            );
          })()}
        </CTableDataCell>

        {/* Current Delay */}
        <CTableDataCell className="text-center current-delay table-cell">
          {(() => {
            const device = salesman.find((device) => device.id === item.deviceId);
            if (device && device.lastUpdate) {
              const now = dayjs();
              const lastUpdate = dayjs(device.lastUpdate);
              const duration = dayjs.duration(now.diff(lastUpdate));

              const days = duration.days();
              const hours = duration.hours();
              const minutes = duration.minutes();
              const seconds = duration.seconds();

              // Conditional formatting based on duration values
              if (days > 0) {
                return `${days}d ${hours}h ${minutes}m`;
              } else if (hours > 0) {
                return `${hours}h ${minutes}m`;
              } else if (minutes > 0) {
                return `${minutes}m`;
              } else {
                return `${seconds}s`; // Display seconds if all else is zero
              }
            }
            return '0s'; // Default if no device or lastUpdate
          })()}
        </CTableDataCell>

        {/* Speed */}
        <CTableDataCell className="text-center speed table-cell">
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

        {/* Distance */}
        <CTableDataCell className="text-center distance table-cell">
          {`${Math.round(item.attributes.distance)} km`}
        </CTableDataCell>

        {/* Total Distance */}
        <CTableDataCell className="text-center total-distance table-cell">
          {`${Math.round(item.attributes.totalDistance)} km`}
        </CTableDataCell>

        {/* Satelite */}
        <CTableDataCell className="text-center satelite table-cell">
          {item.attributes.sat}
        </CTableDataCell>

        {/* Ignition */}
        <CTableDataCell className="text-center ignition table-cell">
          {(() => {
            const { ignition } = item.attributes;

            let iconColor = 'gray'; // Default color
            let iconText = 'N/A'; // Default text

            if (ignition) {
              iconColor = 'green';
              iconText = 'On';
            } else if (ignition === false) {
              iconColor = 'red';
              iconText = 'Off';
            }

            return (
              <div style={{ color: iconColor }}>
                <PiEngineFill />
              </div>
            );
          })()}
        </CTableDataCell>

        {/* GPS */}
        <CTableDataCell className="text-center gps table-cell">
          {(() => {
            const { valid } = item;

            let iconColor = 'gray'; // Default color
            let iconText = 'N/A'; // Default text

            if (valid) {
              iconColor = 'green';
              iconText = 'On';
            } else if (valid === false) {
              iconColor = 'red';
              iconText = 'Off';
            }

            return (
              <div style={{ color: iconColor }}>
                <PiEngineFill />
              </div>
            );
          })()}
        </CTableDataCell>

        {/* Power */}
        <CTableDataCell className="text-center power table-cell">
          {(() => {
            const power = item.attributes.battery;

            let iconColor = 'gray'; // Default color
            let iconText = 'N/A'; // Default text

            if (power) {
              iconColor = 'green';
              iconText = 'On';
            } else if (power === false) {
              iconColor = 'red';
              iconText = 'Off';
            }

            return (
              <div style={{ color: iconColor, fontSize: "1.2rem" }}>
                <IoMdBatteryCharging />
              </div>
            );
          })()}
        </CTableDataCell>

        {/* Track */}
        <CTableDataCell className="text-center status table-cell">
                        <button className="btn btn-primary" onClick={() => handleClick(item)}>
                          Live Track
                        </button>
                      </CTableDataCell>
      </CTableRow>
    ))}
  </CTableBody>
</CTable>

              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <WidgetsBrand className="mb-4" withCharts />
    </>
  )
}

export default Dashboard
