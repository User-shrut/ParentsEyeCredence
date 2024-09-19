import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
} from '@coreui/icons'
import { IoLocationOutline } from 'react-icons/io5'
import { BsWindowFullscreen } from 'react-icons/bs'
import { BsChatDots } from 'react-icons/bs'
import { FiList } from 'react-icons/fi'
import { FaRegEdit } from 'react-icons/fa'
import { PiListStarLight } from 'react-icons/pi'
import { LiaFileInvoiceDollarSolid } from 'react-icons/lia'
import { TbReport } from 'react-icons/tb'
import { TbSettings } from 'react-icons/tb'
import { LuHelpCircle } from 'react-icons/lu'
import { BiLogOutCircle } from 'react-icons/bi'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavTitle,
    name: 'Admin Menu',
  },
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
    component: CNavTitle,
    name: 'Manage',
  },
  {
    component: CNavGroup,
    name: 'Manage Attendance',
    // to: '/attendance',
    icon: (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <FiList style={{ marginRight: '15px', fontSize: '20px' }} />
      </div>
    ),
    items: [
      {
        component: CNavItem,
        name: 'Attendance',
        to: '/attendance',
      },
      {
        component: CNavItem,
        name: 'Manual Attendance',
        to: '/manual-attendance',
      },
      {
        component: CNavItem,
        name: 'Leave Application',
        to: '/leave-application',
      },
      {
        component: CNavItem,
        name: 'Visit Shop',
        to: '/visit-shop',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Manage Order',
    // to: '/invoice',
    icon: (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <FaRegEdit style={{ marginRight: '15px', fontSize: '20px' }} />
      </div>
    ),
    items: [
      {
        component: CNavItem,
        name: 'Invoice',
        to: '/invoice',
      },
      {
        component: CNavItem,
        name: 'PO',
        to: '/po',
      },
      {
        component: CNavItem,
        name: 'Inventory Management',
        to: '/inventory-management',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Management',
    icon: (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <PiListStarLight style={{ marginRight: '15px', fontSize: '25px' }} />
      </div>
    ),
    items: [
      {
        component: CNavItem,
        name: 'Task Management',
        to: '/task-management',
      },
      {
        component: CNavItem,
        name: 'User Management',
        to: '/user-management',
      },
    ],
  },

  {
    component: CNavGroup,
    name: 'Expense Management',
    icon: (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <LiaFileInvoiceDollarSolid style={{ marginRight: '15px', fontSize: '22px' }} />
      </div>
    ),
    items: [
      {
        component: CNavItem,
        name: 'Expense Details',
        to: '/expense-details',
        badge: {
          color: 'success',
        },
      },
      {
        component: CNavItem,
        name: 'Manual Expense',
        to: '/manual-expense',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Report Management',
    icon: (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <TbReport style={{ marginRight: '15px', fontSize: '22px' }} />
      </div>
    ),
    items: [
      {
        component: CNavItem,
        name: 'Inventory',
        to: '/inventory',
      },
      {
        component: CNavItem,
        name: 'Employee Details',
        to: '/employee-details',
      },
    ],
  },

  {
    component: CNavItem,
    name: 'Settings',
    to: '/setting',
    icon: (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <TbSettings style={{ marginRight: '15px', fontSize: '23px' }} />
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
    to: '/forms/logout',
    icon: (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <BiLogOutCircle style={{ marginRight: '15px', fontSize: '23px' }} />
      </div>
    ),
  },
]

export default _nav
