import React, { useEffect } from 'react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'
import { useDispatch } from 'react-redux'
import { fetchDeviceData } from '../features/devicesSlice';

const DefaultLayout = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch device data when the app loads
    dispatch(fetchDeviceData());
  }, [dispatch]);
  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1">
          <AppContent />
        </div>
        {/* <AppFooter /> */}
      </div>
    </div>
  )
}

export default DefaultLayout
