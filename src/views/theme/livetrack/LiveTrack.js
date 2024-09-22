import React, { useContext, useEffect, useState } from 'react'
import {
  CAvatar,
  CCardHeader,
  CNavLink,
  CProgress,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import MainMap from '../../Map/MapComponent'
import CIcon from '@coreui/icons-react'
import axios from 'axios'
import { Navigate, useNavigate } from 'react-router-dom'
import Loader from '../../../components/Loader/Loader'
import { GlobalContext } from '../../../Context/Context'

const LiveTrack = () => {
  const [loading, setLoading] = useState(true)
  const { setSelectedSalesMan, salesman } = useContext(GlobalContext)
  const navigate = useNavigate()

  const handleClick = (item) => {
    setSelectedSalesMan(item)
    navigate('/salesman')
  }

  useEffect(() => {
    if (salesman) {
      setLoading(false)
    }
  }, [salesman])

  return (
    <>
      <CCardHeader className="h3 my-3">Live Tracking</CCardHeader>
      {loading ? (
        <Loader />
      ) : (
        <>
          <MainMap />
          <CTable align="middle" className="my-3 border" hover responsive>
            <CTableHead className="text-nowrap">
              <CTableRow>
                <CTableHeaderCell className="bg-body-tertiary text-center">Id</CTableHeaderCell>
                <CTableHeaderCell className="bg-body-tertiary">SalesMan</CTableHeaderCell>
                <CTableHeaderCell className="bg-body-tertiary text-center">
                  Phone No.
                </CTableHeaderCell>
                <CTableHeaderCell className="bg-body-tertiary">Model</CTableHeaderCell>
                <CTableHeaderCell className="bg-body-tertiary text-center">
                  Category
                </CTableHeaderCell>
                <CTableHeaderCell className="bg-body-tertiary">Status</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {salesman?.map((item, index) => (
                <CTableRow v-for="item in tableItems" key={index} to="/dashboard">
                  <CTableDataCell className="text-center">{item.id}</CTableDataCell>
                  <CTableDataCell className="">{item.name}</CTableDataCell>
                  <CTableDataCell className="text-center">{item.phone}</CTableDataCell>
                  <CTableDataCell className="text-center">{item.model}</CTableDataCell>
                  <CTableDataCell className="text-center">{item.category}</CTableDataCell>
                  <CTableDataCell className="text-center">
                    <button className="btn btn-primary" onClick={() => handleClick(item)}>
                      View Status
                    </button>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </>
      )}
    </>
  )
}

export default LiveTrack
