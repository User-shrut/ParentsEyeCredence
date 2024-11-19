import React, { useEffect, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  CContainer,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
  useColorModes,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilContrast,
  cilEnvelopeOpen,
  cilList,
  cilMenu,
  cilMoon,
  cilSun,
} from '@coreui/icons'

import Typography from '@mui/material/Typography'

import {
  filterAllVehicles,
  filterStoppedVehicles,
  filterIdleVehicles,
  filterRunningVehicles,
  filterOverspeedVehicles,
  filterInactiveVehicles,
  filterByCategory,
  filterByGroup,
  filterByGeofence,
  filterBySingleVehicle,
  selectDeviceNames,
  searchVehiclesByName,
} from '../features/LivetrackingDataSlice.js'
// import { AppBreadcrumb } from './index'
import { AppHeaderDropdown } from './header/index'
import 'bootstrap/dist/css/bootstrap.min.css'
import './AppHeader.css'
import TableColumnVisibility from './TableColumnVisibility.js'
import NotificationDropdown from './header/NotificationDropdown.js'
import { io } from 'socket.io-client';
import notificationSound from '../../src/Google_Event.mp3';
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";
import logo from 'src/assets/brand/logo.png'
import { setToggleSidebar } from '../features/navSlice.js'
import { FaAddressCard, FaChartBar, FaCog, FaHome } from 'react-icons/fa'
import { TbReportSearch } from 'react-icons/tb'
import { MdOutlineSupportAgent } from 'react-icons/md'

const AppHeader = () => {
  const headerRef = useRef()
  const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')

  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebar.sidebarShow)
  const { filteredVehicles } = useSelector((state) => state.liveFeatures)
  const toggle = useSelector((state) => state.navbar)
  console.log(toggle, "nave baajdasjdjasdkjashd");
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    document.addEventListener('scroll', () => {
      headerRef.current &&
        headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0)
    })
  }, [])

  useEffect(() => {
    switch (filter) {
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
  }, [filter, dispatch])

  useEffect(() => {
    dispatch(searchVehiclesByName(searchTerm)) // Dispatch the search action
  }, [searchTerm, dispatch])

  const deviceNames = useSelector(selectDeviceNames)
  const location = useLocation()

  // Check if the current page is the dashboard
  const isDashboard = location.pathname === '/dashboard'




  // ################### notification code is here ##########

  const token = Cookies.get('authToken')
  const decodedToken = token ? jwtDecode(token) : null;
  const socket = io(`${import.meta.env.VITE_API_URL}`);
  const userId = decodedToken && decodedToken.id;
  const [notifications, setNotifications] = useState([]);

  const notificationSocket = () => {
    const audio = new Audio(notificationSound);
    console.log("this is notification function and i am waiting for notification")
    socket.emit('registerUser', userId);
    socket.on("alert", (data) => {
      console.log("Alert", data);
      audio.play();
      setNotifications((prevNotifications) => [...prevNotifications, data])
    });
  }

  useEffect(() => {
    console.log("this is notification socket code");
    notificationSocket();

  }, [])

  // Reducer of side bar nav open

  const handleHome = () => {
    dispatch({ type: 'set', sidebarShow: true })
    dispatch(setToggleSidebar({ home: true, master: false, reports: false, expense: false, support: false }))
  }
  const handleMaster = () => {
    dispatch({ type: 'set', sidebarShow: true })
    dispatch(setToggleSidebar({ home: false, master: true, reports: false, expense: false, support: false }))
  }
  const handleReports = () => {
    dispatch({ type: 'set', sidebarShow: true })
    dispatch(setToggleSidebar({ home: false, master: false, reports: true, expense: false, support: false }))
  }

  const handleExpense = () => {
    dispatch({ type: 'set', sidebarShow: true })
    dispatch(setToggleSidebar({ home: false, master: false, reports: false, expense: true, support: false }))
  }
  const handleSupports = () => {
    dispatch({ type: 'set', sidebarShow: true })
    dispatch(setToggleSidebar({ home: false, master: false, reports: false, expense: false, support: true }))
  }

  // #########################################################

  return (
    <CHeader position="sticky" className=" p-0" ref={headerRef}>
      <CContainer className="border-bottom px-4" fluid>
        <CHeaderToggler
          onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
          style={{ marginInlineStart: '-30px' }}
        >
          {/* <CIcon icon={cilMenu} size="lg" /> */}
        </CHeaderToggler>
        <CHeaderNav className="d-none d-md-flex">
          <CNavItem>
            <CNavLink id='header-dashboard' to="/dashboard" as={NavLink}>
              <img src={logo} alt="Logo" className="sidebar-brand-full" height={50} width={200} style={{ marginInlineStart: '-30px' }} />
            </CNavLink>
          </CNavItem>
        </CHeaderNav>


        <CHeaderNav className="ms-auto">
          <button className="nav-btn" onClick={() => handleHome()}>
            <FaHome className="nav-icon" /> Home
          </button>
        </CHeaderNav>

        <CHeaderNav className="ms-auto">
          <button className="nav-btn" onClick={() => handleMaster()}>
            <FaAddressCard className="nav-icon" /> Master
          </button>
        </CHeaderNav>

        <CHeaderNav className="ms-auto">
          <button className="nav-btn" onClick={() => handleReports()}>
            <FaChartBar className="nav-icon" /> Reports
          </button>
        </CHeaderNav>

        <CHeaderNav className="ms-auto">
          <button className="nav-btn" onClick={() => handleExpense()}>
            <TbReportSearch className="nav-icon" /> Expense Management
          </button>
        </CHeaderNav>

        {/* <CHeaderNav className="ms-auto">
          <button className="nav-btn" onClick={() => handleSupports()}>
            <MdOutlineSupportAgent className="nav-icon" /> Supports
          </button>
        </CHeaderNav> */}

        <style jsx>{`
  .nav-btn {
    padding: 10px 20px; /* Padding for the button */
    margin: 0 10px; /* Margin between buttons */
    background-color: white; /* Light white background color */
    color: #343a40; /* Dark gray text color */
    border: none; /* Light border color */
    border-radius: 5px; /* Rounded corners */
    font-size: 16px; /* Font size */
    cursor: pointer; /* Pointer cursor on hover */
    transition: background-color 0.3s ease, transform 0.2s ease, border-color 0.3s ease; /* Smooth transition */
    display: flex;
    align-items: center; /* Align icon and text */
    justify-content: center; /* Center the content */
  }

  .nav-btn .nav-icon {
    margin-right: 20px; /* Space between icon and text */
    font-size: 18px; /* Icon size */
  }

  .nav-btn:hover {
    background-color: #e2e6ea; /* Light gray background on hover */
    border-color: #ccc; /* Darker border color on hover */
    transform: scale(1.05); /* Slight scaling effect on hover */
  }

  .nav-btn:focus {
    outline: none; /* Remove focus outline */
  }

  .nav-btn:active {
    transform: scale(0.98); /* Slight shrink effect when active */
  }
`}</style>    

        <CHeaderNav className="ms-auto">
          

          <NotificationDropdown notifications={notifications} />
        </CHeaderNav>
        <CHeaderNav>
          <li className="nav-item py-1">
            <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
          </li>
          <CDropdown variant="nav-item" placement="bottom-end">
            <CDropdownToggle caret={false}>
              {colorMode === 'dark' ? (
                <CIcon icon={cilMoon} size="lg" />
              ) : colorMode === 'auto' ? (
                <CIcon icon={cilContrast} size="lg" />
              ) : (
                <CIcon icon={cilSun} size="lg" />
              )}
            </CDropdownToggle>
            <CDropdownMenu>
              <CDropdownItem
                active={colorMode === 'light'}
                className="d-flex align-items-center custom-dropdown-item"
                as="button"
                type="button"
                onClick={() => setColorMode('light')}
              >
                <CIcon className="me-2" icon={cilSun} size="lg" /> Light
              </CDropdownItem>
              <CDropdownItem
                active={colorMode === 'dark'}
                className="d-flex align-items-center custom-dropdown-item"
                as="button"
                type="button"
                onClick={() => setColorMode('dark')}
              >
                <CIcon className="me-2" icon={cilMoon} size="lg" /> Dark
              </CDropdownItem>
              <CDropdownItem
                active={colorMode === 'auto'}
                className="d-flex align-items-center custom-dropdown-item"
                as="button"
                type="button"
                onClick={() => setColorMode('auto')}
              >
                <CIcon className="me-2" icon={cilContrast} size="lg" /> Auto
              </CDropdownItem>
            </CDropdownMenu>
          </CDropdown>


          <li className="nav-item py-1">
            <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
          </li>
          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>
    </CHeader>
  )
}

export default AppHeader


  {/* this is comment perment         
        <CHeaderNav className="d-none d-md-flex">
          <select class="form-select" aria-label="Default select example">
            <option selected>Select by Name</option>
            {deviceNames.map((name) => (
              <option key={name} value={name}>
                {' '}
                {name}{' '}
              </option>
            ))}
          </select>
        </CHeaderNav> */}

        {/* {isDashboard && (
          <CHeaderNav className="ms-auto">
            <form className="d-flex" role="search">
              <input
                className="form-control me-2"
                type="text"
                placeholder="Search vehicles by name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search"
              />
            </form>
          </CHeaderNav>
        )} */}

        {/* {isDashboard && (
          <CHeaderNav className="ms-auto">
        
            <TableColumnVisibility />
          </CHeaderNav>
        )} */}

        {/* <CNavItem>
            <CNavLink href="#">
              <CIcon icon={cilBell} size="lg" />
            </CNavLink>
          </CNavItem> */}