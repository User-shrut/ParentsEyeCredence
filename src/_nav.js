import React, { useEffect, useState } from 'react'
import { IoLocationOutline } from 'react-icons/io5'
import { BsFillSignStopFill, BsWindowFullscreen } from 'react-icons/bs'
import { BsChatDots } from 'react-icons/bs'
import { FaCar, FaHistory, FaRegEdit, FaStopwatch, FaUserAlt } from 'react-icons/fa'
import { LiaFileInvoiceDollarSolid } from 'react-icons/lia'
import { TbReport } from 'react-icons/tb'
import { LuHelpCircle } from 'react-icons/lu'
import { BiLogOutCircle } from 'react-icons/bi'
import { FaCarOn, FaUserGroup } from 'react-icons/fa6'
import { GrHostMaintenance, GrUserWorker } from 'react-icons/gr'
import { IoMdNotifications } from 'react-icons/io'
import { MdEventNote, MdOutlineCategory, MdSensors } from 'react-icons/md'
import { TbCategory } from 'react-icons/tb';
import { GiPathDistance } from "react-icons/gi";
import { TbReportAnalytics } from "react-icons/tb";
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'
import { RiPinDistanceFill } from 'react-icons/ri'
import { PiMapPinAreaFill } from "react-icons/pi";

const _nav = (role, decodedToken) => {
  let devices,
    users,
    driver,
    groups,
    geofence,
    notification,
    maintenance,
    category,
    model,
    status,
    distance,
    history,
    stop,
    travel,
    idle,
    sensor,
    alerts,
    vehicle,
    geofenceReport
  console.log(decodedToken)

  if (role != 'superadmin') {
    ;({
      devices,
      users,
      driver,
      groups,
      geofence,
      notification,
      maintenance,
      category,
      model,
      status,
      distance,
      history,
      stop,
      travel,
      idle,
      sensor,
      alerts,
      vehicle,
      geofenceReport,
    } = decodedToken.user)
  }

  return [
    {
      component: CNavItem,
      name: 'Dashboard',
      to: '/dashboard',
      icon: (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <BsWindowFullscreen style={{ marginRight: '15px', fontSize: '19px' }} />
        </div>
      ),
    },
    ...(role == 'superadmin'
      ? [
          {
            component: CNavTitle,
            name: 'Manage',
          },
          {
            component: CNavGroup,
            name: 'Master',
            icon: (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <LiaFileInvoiceDollarSolid style={{ marginRight: '15px', fontSize: '22px' }} />
              </div>
            ),
            items: [
              {
                component: CNavItem,
                name: 'Devices',
                to: '/devices',
                icon: (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <FaCar style={{ marginRight: '15px', fontSize: '20px' }} />
                  </div>
                ),
              },
              {
                component: CNavItem,
                name: 'Users',
                to: '/users',
                icon: (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <FaUserAlt style={{ marginRight: '15px', fontSize: '20px' }} />
                  </div>
                ),
              },
              {
                component: CNavItem,
                name: 'Group',
                to: '/group',
                icon: (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <FaUserGroup style={{ marginRight: '15px', fontSize: '20px' }} />
                  </div>
                ),
              },
              {
                component: CNavItem,
                name: 'Geofences',
                to: '/geofences',
                icon: (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <PiMapPinAreaFill style={{ marginRight: '15px', fontSize: '20px' }} />
                  </div>
                ),
              },
              {
                component: CNavItem,
                name: 'Driver',
                to: '/driver',
                icon: (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <GrUserWorker style={{ marginRight: '15px', fontSize: '20px' }} />
                  </div>
                ),
              },
              {
                component: CNavItem,
                name: 'Notifications',
                to: '/notifications',
                icon: (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <IoMdNotifications style={{ marginRight: '15px', fontSize: '20px' }} />
                  </div>
                ),
              },
              {
                component: CNavItem,
                name: 'Maintenance',
                to: '/maintenance',
                icon: (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <GrHostMaintenance style={{ marginRight: '15px', fontSize: '20px' }} />
                  </div>
                ),
              },
              {
                component: CNavItem,
                name: 'Category',
                to: '/category',
                icon: (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <MdOutlineCategory style={{ marginRight: '15px', fontSize: '20px' }} />
                  </div>
                ),
              },
              {
                component: CNavItem,
                name: 'Model',
                to: '/model',
                icon: (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <TbCategory style={{ marginRight: '15px', fontSize: '20px' }} />
                  </div>
                ),
              },
            ],
          },
          {
            component: CNavGroup,
            name: 'Report',
            icon: (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <TbReport style={{ marginRight: '15px', fontSize: '22px' }} />
              </div>
            ),
            items: [
              {
                component: CNavItem,
                name: 'Status Reports',
                to: '/statusreports',
                icon: (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <TbReportAnalytics style={{ marginRight: '15px', fontSize: '20px' }} />
                  </div>
                ),
              },
              {
                component: CNavItem,
                name: 'Distance Reports',
                to: '/distancereports',
                icon: (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <GiPathDistance  style={{ marginRight: '15px', fontSize: '20px' }} />
                  </div>
                ),
              },
              {
                component: CNavItem,
                name: 'History',
                to: '/history',
                icon: (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <FaHistory style={{ marginRight: '15px', fontSize: '20px' }} />
                  </div>
                ),
              },
              {
                component: CNavItem,
                name: 'Stops',
                to: '/stops',
                icon: (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <BsFillSignStopFill style={{ marginRight: '15px', fontSize: '20px' }} />
                  </div>
                ),
              },
              {
                component: CNavItem,
                name: 'Travels Report',
                to: '/travelsreport',
                icon: (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <RiPinDistanceFill style={{ marginRight: '15px', fontSize: '20px' }} />
                  </div>
                ),
              },
              {
                component: CNavItem,
                name: 'Idle Report',
                to: '/idlereport',
                icon: (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <FaStopwatch style={{ marginRight: '15px', fontSize: '20px' }} />
                  </div>
                ),
              },
              {
                component: CNavItem,
                name: 'Sensor Reports',
                to: '/sensorreports',
                icon: (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <MdSensors style={{ marginRight: '15px', fontSize: '20px' }} />
                  </div>
                ),
              },
              {
                component: CNavItem,
                name: 'Alerts/Events',
                to: '/alerts-events',
                icon: (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <MdEventNote style={{ marginRight: '15px', fontSize: '20px' }} />
                  </div>
                ),
              },
              {
                component: CNavItem,
                name: 'Vehicle Reports',
                to: '/vehiclereport',
                icon: (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <FaCarOn style={{ marginRight: '15px', fontSize: '20px' }} />
                  </div>
                ),
              },
              {
                component: CNavItem,
                name: 'Geofence Report',
                to: '/geofencereport',
                icon: (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <PiMapPinAreaFill style={{ marginRight: '15px', fontSize: '20px' }} />
                  </div>
                ),
              },
            ],
          },
          {
            component: CNavGroup,
            name: 'Expense Management',
            icon: (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <FaRegEdit style={{ marginRight: '15px', fontSize: '20px' }} />
              </div>
            ),
            items: [
              { component: CNavItem, name: 'Invoice', to: '/invoice' },
              { component: CNavItem, name: 'PO', to: '/po' },
              { component: CNavItem, name: 'Inventory', to: '/inventory-management' },
            ],
          },
        ]
      : [
          {
            component: CNavTitle,
            name: 'Manage',
          },
          (devices || users || groups || geofence || driver || notification || maintenance) && {
            component: CNavGroup,
            name: 'Master',
            icon: (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <LiaFileInvoiceDollarSolid style={{ marginRight: '15px', fontSize: '22px' }} />
              </div>
            ),
            items: [
              devices && { component: CNavItem, name: 'Devices', to: '/devices', icon: (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <FaCar style={{ marginRight: '15px', fontSize: '20px' }} />
                </div>
              ), },
              users && { component: CNavItem, name: 'Users', to: '/users', icon: (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <FaUserAlt style={{ marginRight: '15px', fontSize: '20px' }} />
                </div>
              ), },
              groups && { component: CNavItem, name: 'Group', to: '/group', icon: (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <FaUserGroup style={{ marginRight: '15px', fontSize: '20px' }} />
                </div>
              ), },
              geofence && { component: CNavItem, name: 'Geofences', to: '/geofences', icon: (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <PiMapPinAreaFill style={{ marginRight: '15px', fontSize: '20px' }} />
                </div>
              ), },
              driver && { component: CNavItem, name: 'Driver', to: '/driver', icon: (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <GrUserWorker style={{ marginRight: '15px', fontSize: '20px' }} />
                </div>
              ), },
              notification && { component: CNavItem, name: 'Notifications', to: '/notifications', icon: (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <IoMdNotifications style={{ marginRight: '15px', fontSize: '20px' }} />
                </div>
              ), },
              maintenance && { component: CNavItem, name: 'Maintenance', to: '/maintenance', icon: (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <GrHostMaintenance style={{ marginRight: '15px', fontSize: '20px' }} />
                </div>
              ), },
            ].filter(Boolean),
          },
          (status ||
            distance ||
            history ||
            stop ||
            travel ||
            idle ||
            sensor ||
            alerts ||
            dayreport ||
            vehicle ||
            geofenceReport) && {
            component: CNavGroup,
            name: 'Report',
            icon: (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <TbReport style={{ marginRight: '15px', fontSize: '22px' }} />
              </div>
            ),
            items: [
              status && {
                component: CNavItem,
                name: 'Status Reports',
                to: '/statusreports',
                icon: (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <TbReportAnalytics style={{ marginRight: '15px', fontSize: '20px' }} />
                  </div>
                ),
              },
              distance && {
                component: CNavItem,
                name: 'Distance Reports',
                to: '/distancereports',
                icon: (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <GiPathDistance  style={{ marginRight: '15px', fontSize: '20px' }} />
                  </div>
                ),
              },
              history && { component: CNavItem, name: 'History', to: '/history', icon: (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <FaHistory style={{ marginRight: '15px', fontSize: '20px' }} />
                </div>
              ), },
              stop && { component: CNavItem, name: 'Stops', to: '/stops', icon: (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <BsFillSignStopFill style={{ marginRight: '15px', fontSize: '20px' }} />
                </div>
              ),  },
              travel && { component: CNavItem, name: 'Travels Report', to: '/travelsreport', icon: (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <RiPinDistanceFill style={{ marginRight: '15px', fontSize: '20px' }} />
                </div>
              ), },
              idle && { component: CNavItem, name: 'Idle Report', to: '/idlereport', icon: (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <FaStopwatch style={{ marginRight: '15px', fontSize: '20px' }} />
                </div>
              ), },
              sensor && {
                component: CNavItem,
                name: 'Sensor Reports',
                to: '/sensorreports',
                icon: (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <MdSensors style={{ marginRight: '15px', fontSize: '20px' }} />
                  </div>
                ),
              },
              alerts && { component: CNavItem, name: 'Alerts/Events', to: '/alerts-events', icon: (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <MdEventNote style={{ marginRight: '15px', fontSize: '20px' }} />
                </div>
              ), },
              vehicle && { component: CNavItem, name: 'Vehicle Reports', to: '/vehiclereport', icon: (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <FaCarOn style={{ marginRight: '15px', fontSize: '20px' }} />
                </div>
              ), },
              geofenceReport && {
                component: CNavItem,
                name: 'Geofence Report',
                to: '/geofencereport',
                icon: (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <PiMapPinAreaFill style={{ marginRight: '15px', fontSize: '20px' }} />
                  </div>
                ),
              },
            ].filter(Boolean),
          },
          {
            component: CNavGroup,
            name: 'Expense Management',
            icon: (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <FaRegEdit style={{ marginRight: '15px', fontSize: '20px' }} />
              </div>
            ),
            items: [
              { component: CNavItem, name: 'Invoice', to: '/invoice' },
              { component: CNavItem, name: 'PO', to: '/po' },
              { component: CNavItem, name: 'Inventory', to: '/inventory-management' },
            ],
          },
        ].filter(Boolean)),
    {
      component: CNavItem,
      name: 'Chat Bot',
      to: '/chatbot',
      icon: (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <BsChatDots style={{ marginRight: '15px', fontSize: '20px' }} />
        </div>
      ),
    },
    {
      component: CNavItem,
      name: 'Help & Support',
      to: '/h&s',
      icon: (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <LuHelpCircle style={{ marginRight: '15px', fontSize: '23px' }} />
        </div>
      ),
    },
  ]
}

export default _nav
