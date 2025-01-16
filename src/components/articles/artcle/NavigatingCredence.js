/* eslint-disable prettier/prettier */
import React from 'react'
import { CCard, CCardBody, CCardLink, CCardSubtitle, CCardText, CCardTitle } from '@coreui/react'
import { useNavigate } from 'react-router-dom'

function NavigatingCredence() {
  const navigate = useNavigate()

  const handleGettingStarted = () => {
    navigate('/HelpSupp/Getting-started')
  }

  return (
    <div className="d-flex flex-column align-items-center">
      <div>
        <div className="text-start">
          <p
            onClick={handleGettingStarted}
            className="btn border-0 text-hover"
            style={{ fontWeight: '600', opacity: '0.8' }}
          >
            Getting Started
          </p>
        </div>
        <div>
          <CCard className="shadow border-0 rounded-3" style={{ width: '100%' }}>
            <CCardBody>
              <CCardTitle>
                Navigating Credence Tracker: Standard Menus, Buttons, Icons and Pages
              </CCardTitle>
              <hr className="my-3" />
              <CCardText>
                When you start using Credence Tracker, you&apos;ll see many common UI elements
                throughout the system. Getting to know the basic navigation, menus, buttons, icons,
                and pages will help you learn how to use Credence Tracker faster.
              </CCardText>
            </CCardBody>
          </CCard>
        </div>
      </div>
    </div>
  )
}
export default NavigatingCredence
