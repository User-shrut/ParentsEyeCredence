import { cilBell } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  CBadge,
  CDropdown,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'

const NotificationDropdown = ({ notifications }) => {
  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0 fs-5 pe-0" caret={false}>
        <CIcon icon={cilBell} size="lg" />
        {notifications?.length > 0 && (
          <CBadge
            color="danger"
            shape="pill"
            className=" position-absolute top-0 start-100 translate-middle"
            style={{ fontSize: '10px' }}
          >
            {notifications?.length}
          </CBadge>
        )}
      </CDropdownToggle>
      <CDropdownMenu className="pt-2" placement="bottom-end" style={{ height:'200px', width: '300px' }}>
        {notifications.map((notification, index) => (
          <CDropdownItem key={index} style={{ fontSize: "12px" , width:'10px'}}>{notification.message}</CDropdownItem>
        ))}
      </CDropdownMenu>
    </CDropdown>
  )
}

export default NotificationDropdown