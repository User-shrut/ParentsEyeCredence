import React, { useEffect, useState, createRef } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { CRow, CCol, CCard, CCardHeader, CCardBody } from '@coreui/react'
import { rgbToHex } from '@coreui/utils'
import { DocsLink } from 'src/components'
import { AppHeader } from '../../../components'

import DashCon from '../../dashboard/DashCon'

const DashBoard = () => {
  return (
    <>
      <DashCon />
    </>
  )
}

export default DashBoard
