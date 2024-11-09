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

const AppHeader = () => {
  const headerRef = useRef()
  const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')

  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebar.sidebarShow)
  const { filteredVehicles } = useSelector((state) => state.liveFeatures)
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

  // #########################################################

  return (
    <CHeader position="sticky" className=" p-0" ref={headerRef}>
      <CContainer className="border-bottom px-4" fluid>
        <CHeaderToggler
          onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
          style={{ marginInlineStart: '-14px' }}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
        <CHeaderNav className="d-none d-md-flex">
          <CNavItem>
            <CNavLink id='header-dashboard' to="/dashboard" as={NavLink}>
              Dashboard
            </CNavLink>
          </CNavItem>
        </CHeaderNav>

        {isDashboard && (
          <CHeaderNav className="ms-auto">
            <select
              className="form-select header-inputs"
              aria-label="Default select example"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option selected>Status</option>
              <option value="all">All</option>
              <option value="running">Running</option>
              <option value="idle">Idle</option>
              <option value="stopped">Stop</option>
              <option value="overspeed">OverSpeed</option>
              <option value="inactive">Inactive</option>
            </select>
          </CHeaderNav>
        )}

        {isDashboard && (
          <CHeaderNav className="ms-auto">
            <select
              className="form-select header-inputs"
              aria-label="Default select example"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option selected>Select By Category</option>

              <option value="car">Car</option>
              <option value="bus">Bus</option>
              <option value="motorcycle">Bike</option>
              <option value="truck">Truck</option>
              <option value="tractor">Tracktor</option>
              <option value="crean">Crean</option>
              <option value="jcb">JCB</option>
            </select>
          </CHeaderNav>
        )}

        {/* <CHeaderNav className="d-none d-md-flex">
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

        {isDashboard && (
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
        )}

        {isDashboard && (
          <CHeaderNav className="ms-auto">
            {/* table cols filter  */}
            <TableColumnVisibility />
          </CHeaderNav>
        )}

        <CHeaderNav className="ms-auto">
          {/* <CNavItem>
            <CNavLink href="#">
              <CIcon icon={cilBell} size="lg" />
            </CNavLink>
          </CNavItem> */}

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
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('light')}
              >
                <CIcon className="me-2" icon={cilSun} size="lg" /> Light
              </CDropdownItem>
              <CDropdownItem
                active={colorMode === 'dark'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('dark')}
              >
                <CIcon className="me-2" icon={cilMoon} size="lg" /> Dark
              </CDropdownItem>
              <CDropdownItem
                active={colorMode === 'auto'}
                className="d-flex align-items-center"
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