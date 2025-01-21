/* eslint-disable prettier/prettier */
import React from 'react'
import { CCard, CCardBody, CCardLink, CCardSubtitle, CCardText, CCardTitle } from '@coreui/react'
import { Lightbulb, WalletCards, MessageCircleQuestion, Ticket } from 'lucide-react'
import '../views/forms/help-support/index.css'
import { useNavigate } from 'react-router-dom'

function ArticleCard() {
  const navigate = useNavigate()

  const handleSupport = () => {
    navigate('/HelpSupp/Raise-Ticket')
  }
  return (
    <div className="d-flex justify-content-center">
      <CCard
        className="shadow rounded-3"
        style={{ width: '18rem', marginLeft: '70px', marginRight: '70px', border: 'none' }}
      >
        <CCardBody className="text-center">
          <div>
            <Ticket
              className="text-warning"
              style={{
                fontSize: '2rem',
                cursor: 'pointer',
                marginTop: '20px',
                marginBottom: '10px',
              }}
            />
          </div>
          <CCardTitle className="hover-title">
            {' '}
            <strong>Raise a Ticket</strong>
          </CCardTitle>
          <CCardText style={{ fontSize: '15px', fontWeight: '600', opacity: '0.8' }}>
            Contact us for further assistance.
          </CCardText>
          <div
            style={{
              fontSize: '13px',
              marginTop: '20px',
              paddingRight: '20px',
              paddingLeft: '20px',
              paddingBottom: '20px',
              lineHeight: '1.6',
            }}
          >
            <div className="text-center">
              <p>Submit a support ticket and our team will respond within 24 hours.</p>
              <button
                onClick={handleSupport}
                className="btn bg-primary text-white"
                style={{ fontWeight: 'bold' }}
              >
                Raise Ticket
              </button>
            </div>
          </div>
        </CCardBody>
      </CCard>
    </div>
  )
}
export default ArticleCard
