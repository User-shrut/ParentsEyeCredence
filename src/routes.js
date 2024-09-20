/* eslint-disable prettier/prettier */
import React from 'react'
const Admin = React.lazy(() => import('./views/admin/admin'))
const DashBoard = React.lazy(() => import('./views/theme/dashboard/DashBoard'))
const LiveTrack = React.lazy(() => import('./views/theme/livetrack/LiveTrack'))
const Notifications = React.lazy(() => import('./views/notifications/Notifications'))
const Devices = React.lazy(() => import('./views/devices/Devices'))
const Geofences = React.lazy(() => import('./views/geofences/Geofences'))
const Group = React.lazy(() => import('./views/group/Group'))
const Maintenance = React.lazy(() => import('./views/maintenance/Maintenance'))
const Driver = React.lazy(() => import('./views/driver/Driver'))
const Users = React.lazy(() => import('./views/users/Users'))
const Preferences = React.lazy(() => import('./views/preferences/Preferences'))
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
const IndividualTrack = React.lazy(() => import('./views/theme/livetrack/IndividualTrack'))
const ChatBot = React.lazy(() => import('./views/theme/chatbot/ChatBot'))

const Attendance = React.lazy(() => import('./views/base/ManageAttend/Attendance'))
const LeaveApplication = React.lazy(() => import('./views/base/ManageAttend/LeaveApplication'))
const Manual = React.lazy(() => import('./views/base/ManageAttend/Manual'))
const VisitShop = React.lazy(() => import('./views/base/ManageAttend/VistShop'))

const InventoryManagment = React.lazy(() => import('./views/ManageOrder/InventoryManage'))
const InvoiceForm = React.lazy(() => import('./views/ManageOrder/Invoice'))
const Po = React.lazy(() => import('./views/ManageOrder/PO'))

const TaskManagment = React.lazy(() => import('./views/base/Management/TaskMange'))
const UserDetailsForm = React.lazy(() => import('./views/base/Management/UserMange'))

const ExpenseDetails = React.lazy(() => import('./views/base/ExpenseMange/ExpenseDet'))
const ManualExpense = React.lazy(() => import('./views/base/ExpenseMange/ManualExpense'))

const ReportInventory = React.lazy(() => import('./views/base/ReportMange/Inventory'))
const EmployeeDetails = React.lazy(() => import('./views/base/ReportMange/EmployeeDetail'))

const Settings = React.lazy(() => import('./views/forms/settings/Settings'))
const HelpSupp = React.lazy(() => import('./views/forms/help-support/HelpSupp'))

const routes = [
  { path: '/', exact: true, name: 'Home' },

  // { path: '/theme', name: 'Theme', element: Colors, exact: true },
  { path: '/admin', name: 'Admin', element: Admin },
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

  { path: '/chatbot', name: 'ChatBot', element: ChatBot },
  
  { path: '/salesman', name: 'IndividualTrack', element: IndividualTrack },

  { path: '/attendance', name: 'Attendance', element: Attendance },
  { path: '/manual-attendance', name: 'Manual Attendance', element: Manual },
  { path: '/leave-application', name: 'Leave Application', element: LeaveApplication },
  { path: '/visit-shop', name: 'Visit Shop', element: VisitShop },

  { path: '/invoice', name: 'Invoice', element: InvoiceForm },
  { path: '/po', name: 'PO', element: Po },
  { path: '/inventory-management', name: 'Inventory Management', element: InventoryManagment },
  { path: '/task-management', name: 'Task Management', element: TaskManagment },
  { path: '/user-management', name: 'User Management', element: UserDetailsForm },
  { path: '/expense-details', name: 'Expense Details', element: ExpenseDetails },
  { path: '/manual-expense', name: 'Manual Expense', element: ManualExpense },
  { path: '/inventory', name: 'Inventory', element: ReportInventory },
  { path: '/employee-details', name: 'Employee Details', element: EmployeeDetails },
  { path: '/setting', name: 'Setting', element: Settings },
  { path: '/h&s', name: 'Help & Support', element: HelpSupp },
]

export default routes
