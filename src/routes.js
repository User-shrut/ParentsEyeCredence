import React from 'react'

const DashBoard = React.lazy(() => import('./views/theme/dashboard/DashBoard'))
const LiveTrack = React.lazy(() => import('./views/theme/livetrack/LiveTrack'))
const IndividualTrack = React.lazy(() => import('./views/theme/livetrack/IndividualTrack'))
const ChatBot = React.lazy(() => import('./views/theme/chatbot/ChatBot'))

const Attendance = React.lazy(() => import('./views/base/ManageAttend/Attendance'))
const LeaveApplication = React.lazy(() => import('./views/base/ManageAttend/LeaveApplication'))
const Manual = React.lazy(() => import('./views/base/ManageAttend/Manual'))
const VisitShop = React.lazy(() => import('./views/base/ManageAttend/VistShop'))

const InventoryManagment = React.lazy(() => import('./views/base/ManageOrder/InventoryManage'))
const InvoiceForm = React.lazy(() => import('./views/base/ManageOrder/Invoice'))
const Po = React.lazy(() => import('./views/base/ManageOrder/PO'))

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
  { path: '/dashboard', name: 'DashBoard', element: DashBoard },
  { path: '/chatbot', name: 'ChatBot', element: ChatBot },
  { path: '/livetrack', name: 'LiveTrack', element: LiveTrack },
  { path: '/salesman', name: 'IndividualTrack', element: IndividualTrack },
  {
    path: '/salesman/:deviceId/:category/:name',
    name: 'IndividualTrack',
    element: IndividualTrack,
  },

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
