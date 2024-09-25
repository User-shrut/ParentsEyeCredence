import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

import { AppSidebarNav } from './AppSidebarNav'

import logo from 'src/assets/brand/logo.png'
import { sygnet } from 'src/assets/brand/sygnet'

// sidebar nav config
import navigation from '../_nav'
// auth purpose
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";



const getUserRole = () => {
  const token = Cookies.get('authToken');
  let role;
  
  if (token) {
    const decodedToken = jwtDecode(token);
    if(decodedToken.superadmin == true){
      role ='superadmin';
    }else{
      role = "user";
    }
  }

  return role; // Default role if no token
};

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebar.sidebarShow)
  let navigate;
  const role = getUserRole();
  const [decodedToken, setDecodedToken] = useState();


  if(decodedToken){
    navigate = navigation(role , decodedToken);

  }

  console.log("this is navs")
  console.log(navigate)

  useEffect(() => {
    const token = Cookies.get('authToken');

    setDecodedToken(jwtDecode(token));

  }, [])


  return (
    <CSidebar
      className="border-end"
      colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand to="/dashboard">
          <img src={logo} alt="Logo" className="sidebar-brand-full" height={45} width={200} />
          <CIcon customClassName="sidebar-brand-narrow" icon={sygnet} height={32} />
        </CSidebarBrand>
        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        />
      </CSidebarHeader>
      <AppSidebarNav items={navigate} />
      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
        />
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
