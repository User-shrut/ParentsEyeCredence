import React from 'react'
const DashBoard = React.lazy(() => import('./views/theme/dashboard/DashBoard'))
const LiveTrack = React.lazy(() => import('./views/theme/livetrack/LiveTrack'))

// master
const Devices = React.lazy(() => import('./views/devices/Devices'))
const Users = React.lazy(() => import('./views/users/Users'))
const Group = React.lazy(() => import('./views/group/Group'))
const Geofences = React.lazy(() => import('./views/geofences/Geofences'))
const Driver = React.lazy(() => import('./views/driver/Driver'))
const Notifications = React.lazy(() => import('./views/notifications/Notifications'))
const Maintenance = React.lazy(() => import('./views/maintenance/Maintenance'))
const Preferences = React.lazy(() => import('./views/preferences/Preferences'))

// reports
const Combine = React.lazy(() => import('./views/combinereports/Combine'))
const Custom = React.lazy(() => import('./views/customreports/Custom'))
const History = React.lazy(() => import('./views/history/History'))
const Stops = React.lazy(() => import('./views/stops/Stops'))
const Trips = React.lazy(() => import('./views/trips/Trips'))
const Statistics = React.lazy(() => import('./views/statistics/Statistics'))
const Schedules = React.lazy(() => import('./views/schedules-reports/Schedules'))
const Alerts = React.lazy(() => import('./views/alerts-events/Alerts'))
const Summary = React.lazy(() => import('./views/summary/Summary'))
const Customchart = React.lazy(() => import('./views/customchart/Customchart'))

// expense management
const InvoiceForm = React.lazy(() => import('./views/ManageOrder/Invoice'))
const Po = React.lazy(() => import('./views/ManageOrder/PO'))
const InventoryManagment = React.lazy(() => import('./views/ManageOrder/InventoryManage'))

// additional
const ChatBot = React.lazy(() => import('./views/theme/chatbot/ChatBot'))
const HelpSupp = React.lazy(() => import('./views/forms/help-support/HelpSupp'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'DashBoard', element: DashBoard },
  { path: '/livetrack', name: 'LiveTrack', element: LiveTrack },
  { path: '/notifications', name: 'Notifications', element: Notifications},
  { path: '/devices', name: 'Devices', element: Devices},
  { path: '/geofences', name: 'Geofence',element: Geofences},
  { path: '/group', name: 'Group', element: Group },
  { path: '/maintenance', name: 'Maintenance', element: Maintenance },
  { path: '/driver', name: 'Driver', element: Driver },
  { path: '/users', name: 'Users', element: Users },
  { path: '/preferences', name: 'Preferences', element: Preferences},
  { path: '/combinereports', name: 'Combine', element:Combine },
  { path: '/customreports', name: 'Custom', element: Custom},
  { path: '/history', name: 'History', element: History },
  { path: '/stops', name: 'Stops', element: Stops },
  { path: '/trips', name: 'Trips', element: Trips },
  { path: '/statistics', name: 'Statistics', element: Statistics },
  { path: '/schedules-reports', name: 'Schedule', element: Schedules },
  { path: '/alerts-events', name: 'Alerts', element: Alerts },
  { path: '/summary', name: 'Summary', element: Summary },
  { path: '/customchart', name: 'CustomChart', element: Customchart},
  { path: '/invoice', name: 'Invoice', element: InvoiceForm },
  { path: '/po', name: 'PO', element: Po },
  { path: '/inventory-management', name: 'Inventory Management', element: InventoryManagment },
  { path: '/chatbot', name: 'ChatBot', element: ChatBot },
  { path: '/h&s', name: 'Help & Support', element: HelpSupp },
]
export default routes