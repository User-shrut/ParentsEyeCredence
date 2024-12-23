import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CRow,
  CFormLabel,
} from '@coreui/react'

import Loader from '../../../components/Loader/Loader'
import '../style/remove-gutter.css'
import HistoryMap from './HistoryMap'
import './HistoryReport.css'

const HistoryReport = () => {
  const { deviceId: urlDeviceId } = useParams() // Retrieve deviceId from URL
  const { category: category } = useParams() // Retrieve deviceId from URL
  const { name: name } = useParams() // Retrieve deviceId from URL
  const [fromDateTime, setFromDateTime] = useState('')
  const [toDateTime, setToDateTime] = useState('')
  const [deviceId, setDeviceId] = useState(urlDeviceId || '')
  const [fetch, setFetch] = useState(false)
  const [historyOn, setHistoryOn] = useState(false)

  const formatDate = (date) => {
    return date.toLocaleDateString('en-CA') // This formats as YYYY-MM-DD
  }

  const validateDateRange = (fromDate, toDate) => {
    const fromDateObj = new Date(fromDate)
    const toDateObj = new Date(toDate)
    const today = new Date()
    const diffInDays = (toDateObj - fromDateObj) / (1000 * 60 * 60 * 24)

    if (toDateObj > today) {
      alert('You cannot select a future date.')
      return false
    }

    if (diffInDays > 7) {
      alert('You cannot select a date range exceeding 7 days.')
      return false
    }

    return true
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('submit')
    if (fromDateTime === '' || toDateTime === '' || deviceId === '') {
      alert('Please fill all fields')
    } else if (validateDateRange(fromDateTime, toDateTime)) {
      setHistoryOn(true)
      setFetch(true)
    }
  }

  return (
    <>
      {!historyOn && (
        <CRow className="pt-3 gutter-0">
          <CCol xs={12} md={12} className="px-4">
            <CCard className="mb-4 p-0 shadow-lg rounded">
              <CCardHeader className="d-flex justify-content-between align-items-center bg-secondary text-white">
                <strong>History Report</strong>
              </CCardHeader>
              <CCardBody>
                <CForm style={{ display: 'flex', gap: '4rem' }} onSubmit={(e) => handleSubmit(e)}>
                  <div>
                    <CFormLabel htmlFor="fromDateTime">From Date-Time</CFormLabel>
                    <CFormInput
                      type="datetime-local"
                      id="fromDateTime"
                      value={fromDateTime}
                      onChange={(e) => setFromDateTime(e.target.value)}
                    />
                  </div>

                  <div>
                    <CFormLabel htmlFor="toDateTime">To Date-Time</CFormLabel>
                    <CFormInput
                      type="datetime-local"
                      id="toDateTime"
                      value={toDateTime}
                      onChange={(e) => setToDateTime(e.target.value)}
                    />
                  </div>

                  {/* <div>
                    <CFormLabel htmlFor="deviceId">Device ID</CFormLabel>
                    <CFormInput
                      type="text"
                      id="deviceId"
                      value={deviceId}
                      onChange={(e) => setDeviceId(e.target.value)}
                    />
                  </div> */}

                  <CButton
                    color="primary"
                    type="submit"
                    style={{ height: '3rem', width: '8rem', marginTop: '1rem' }}
                  >
                    Show
                  </CButton>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      )}

      <CRow className="justify-content-center gutter-0">
        <CCol xs={12} className="px-4">
          <CCard className="p-0 mb-4 shadow-sm">
            <CCardBody>
              <HistoryMap
                fromDateTime={fromDateTime}
                toDateTime={toDateTime}
                deviceId={deviceId}
                fetch={fetch}
                setFetch={setFetch}
                historyOn={historyOn}
                setHistoryOn={setHistoryOn}
                category={category}
                name={name}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default HistoryReport
