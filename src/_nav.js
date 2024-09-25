import React, { useState } from 'react'
import { IoLocationOutline } from 'react-icons/io5'
import { BsWindowFullscreen } from 'react-icons/bs'
import { BsChatDots } from 'react-icons/bs'
import { FaRegEdit } from 'react-icons/fa'
import { LiaFileInvoiceDollarSolid } from 'react-icons/lia'
import { TbReport } from 'react-icons/tb'
import { LuHelpCircle } from 'react-icons/lu'
import { BiLogOutCircle } from 'react-icons/bi'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'


const _nav = (role) => {
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
    {
      component: CNavItem,
      name: 'Live Tracking',
      to: '/livetrack',
      icon: (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <IoLocationOutline style={{ marginLeft: '0px', marginRight: '15px', fontSize: '23px' }} />
        </div>
      ),
    },
    ...(role == "superadmin" ? [
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
          { component: CNavItem, name: 'Devices', to: '/devices' },
          { component: CNavItem, name: 'Users', to: '/users' },
          { component: CNavItem, name: 'Group', to: '/group' },
          { component: CNavItem, name: 'Geofences', to: '/geofences' },
          { component: CNavItem, name: 'Driver', to: '/driver' },
          { component: CNavItem, name: 'Notifications', to: '/notifications' },
          { component: CNavItem, name: 'Maintenance', to: '/maintenance' },
          { component: CNavItem, name: 'Preferences', to: '/preferences' },
          { component: CNavItem, name: 'Category', to: '/category' },
          { component: CNavItem, name: 'Model', to: '/model' },
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
          { component: CNavItem, name: 'Combine Reports', to: '/combinereports' },
          { component: CNavItem, name: 'Custom Reports', to: '/customreports' },
          { component: CNavItem, name: 'History', to: '/history' },
          { component: CNavItem, name: 'Stops', to: '/stops' },
          { component: CNavItem, name: 'Trips', to: '/trips' },
          { component: CNavItem, name: 'Statistics', to: '/statistics' },
          { component: CNavItem, name: 'Schedules Reports', to: '/schedules-reports' },
          { component: CNavItem, name: 'Alerts/Events', to: '/alerts-events' },
          { component: CNavItem, name: 'Summary', to: '/summary' },
          { component: CNavItem, name: 'Custom Chart', to: '/customchart', optional: true },
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
    ] : [
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
          { component: CNavItem, name: 'Devices', to: '/devices' },
          { component: CNavItem, name: 'Users', to: '/users' },
          { component: CNavItem, name: 'Group', to: '/group' },
          { component: CNavItem, name: 'Geofences', to: '/geofences' },
          { component: CNavItem, name: 'Driver', to: '/driver' },
          { component: CNavItem, name: 'Notifications', to: '/notifications' },
          { component: CNavItem, name: 'Maintenance', to: '/maintenance' },
          { component: CNavItem, name: 'Preferences', to: '/preferences' },
          { component: CNavItem, name: 'Category', to: '/category' },
          { component: CNavItem, name: 'Model', to: '/model' },
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
          { component: CNavItem, name: 'Combine Reports', to: '/combinereports' },
          { component: CNavItem, name: 'Custom Reports', to: '/customreports' },
          { component: CNavItem, name: 'History', to: '/history' },
          { component: CNavItem, name: 'Stops', to: '/stops' },
          { component: CNavItem, name: 'Trips', to: '/trips' },
          { component: CNavItem, name: 'Statistics', to: '/statistics' },
          { component: CNavItem, name: 'Schedules Reports', to: '/schedules-reports' },
          { component: CNavItem, name: 'Alerts/Events', to: '/alerts-events' },
          { component: CNavItem, name: 'Summary', to: '/summary' },
          { component: CNavItem, name: 'Custom Chart', to: '/customchart', optional: true },
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
    ]),
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
    {
      component: CNavItem,
      name: 'LogOut',
      to: '/login',
      icon: (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <BiLogOutCircle style={{ marginRight: '15px', fontSize: '23px' }} />
        </div>
      ),
    },
  ];
};


export default _nav