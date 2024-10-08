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
import { useNavigate } from 'react-router-dom'



// const getUserRole = () => {
//   const navigate = useNavigate()
//   const token = Cookies.get('authToken');
//   let role;

//   if (token) {
//     console.log("token hai yaha")
//     const decodedToken = jwtDecode(token);
//     if(decodedToken.superadmin == true){
//       role ='superadmin';
//     }else{
//       role = "user";
//     }
//   }else{
//     navigate('/login');
//   }

//   return role; // Default role if no token
// };

const getUserRole = (token) => {
  if (token) {
    const decodedToken = jwtDecode(token);
    return decodedToken.superadmin ? 'superadmin' : 'user';
  }
  return null; // No token means no role
};

const AppSidebar = () => {
  const dispatch = useDispatch();
  const unfoldable = useSelector((state) => state.sidebarUnfoldable);
  const sidebarShow = useSelector((state) => state.sidebar.sidebarShow);
  const navigate = useNavigate();

  const [decodedToken, setDecodedToken] = useState(null);
  const [navigatingNav, setNavigatingNav] = useState(null);
  const token = Cookies.get('authToken');

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      const decoded = jwtDecode(token);
      setDecodedToken(decoded);

      const role = getUserRole(token);
      if (role) {
        setNavigatingNav(navigation(role, decoded));
      }
    }
  }, [token, navigate]);

  return (
    <CSidebar
      className="border-end xl"
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
      <AppSidebarNav items={navigatingNav} />
      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
        />
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
