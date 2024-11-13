import React, { useContext, useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import Draggable from 'react-draggable'
import { CCard, CCardBody } from '@coreui/react'

const HistoryMap = () => {
  return (
    <div className="individualMap position-relative border border-5 ">
      <MapContainer
        center={[21.1458, 79.0882]} 
        zoom={10}
        scrollWheelZoom={true}
        style={{ height: '550px', width: '100%', borderRadius: '15px', border: '2px solid gray' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; Credence Tracker, HB Gadget Solutions Nagpur"
        />
        <Draggable bounds="parent">
          <CCard className="mb-4 parametersContainer shadow" style={{ zIndex: '555', width: '300px' }}>
            <CCardBody>
              <div className="row">
                <div className="col-7 mt-3">
                  <h6 className="fw-bold text-decoration-underline">User Name</h6>
                </div>
              </div>
            </CCardBody>
          </CCard>
        </Draggable>
      </MapContainer>
    </div>
  )
}

export default HistoryMap
