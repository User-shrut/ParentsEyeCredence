// import { cilBell } from '@coreui/icons'
// import CIcon from '@coreui/icons-react'
// import {
//   CBadge,
//   CDropdown,
//   CDropdownHeader,
//   CDropdownItem,
//   CDropdownMenu,
//   CDropdownToggle,
// } from '@coreui/react'

// const NotificationDropdown = ({ notifications }) => {
//   return (
//     <CDropdown variant="nav-item">
//       <CDropdownToggle placement="bottom-end" className="py-0 fs-5 pe-0" caret={false}>
//         <CIcon icon={cilBell} size="lg" />
//         {notifications?.length > 0 && (
//           <CBadge
//             color="danger"
//             shape="pill"
//             className=" position-absolute top-0 start-100 translate-middle"
//             style={{ fontSize: '10px' }}
//           >
//             {notifications?.length}
//           </CBadge>
//         )}
//       </CDropdownToggle>
//       <CDropdownMenu className="pt-2" placement="bottom-end" style={{ height:'200px', width: '300px' }}>
//         {notifications.map((notification, index) => (
//           <CDropdownItem key={index} style={{ fontSize: "12px" , width:'16px', paddingInlineStart:'1px'}}>{notification.message}</CDropdownItem>
//         ))}
//       </CDropdownMenu>
//     </CDropdown>
//   )
// }

// export default NotificationDropdown

// ############################################### New Code ############################################## //
import React from 'react'
import { cilBell } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CBadge, CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle } from '@coreui/react'
import { Bell } from 'lucide-react'

const NotificationDropdown = ({ notifications }) => {
  return (
    <>
      <style>
        {`
          .custom-hover:hover {
            background-color: #f8f9fa; /* Light gray background on hover */
            color: #333; /* Darker text color on hover */
            transition: background-color 0.3s ease, color 0.3s ease; /* Smooth transition effect */
          }
        `}
      </style>
      <CDropdown variant="nav-item">
        <CDropdownToggle placement="bottom-end" className="py-0 fs-5 pe-0" caret={false}>
          <Bell color="black" className="mx-0" />
          {notifications?.length > 0 && (
            <CBadge
              color="danger"
              shape="pill"
              className="position-absolute top-0 start-100 translate-middle"
              style={{ fontSize: '10px' }}
            >
              {notifications?.length}
            </CBadge>
          )}
        </CDropdownToggle>
        <CDropdownMenu className="pt-2" placement="bottom-end" style={{ width: '400px' }}>
          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <CDropdownItem
                key={index}
                className="custom-hover"
                style={{
                  fontSize: '12px',
                  width: '100',
                  paddingInlineStart: '5px',
                  cursor: 'pointer',
                }}
              >
                {notification.message}
              </CDropdownItem>
            ))
          ) : (
            <CDropdownItem style={{ textAlign: 'center', fontSize: '12px' }}>
              No Notification
            </CDropdownItem>
          )}
        </CDropdownMenu>
      </CDropdown>
    </>
  )
}

export default NotificationDropdown
