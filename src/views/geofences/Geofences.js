import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import axios from 'axios'
import {
  TableContainer,
  Paper,
  IconButton,
  Dialog,
  DialogContent,
  Typography,
  Button,
  InputBase,
  Modal,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
import { RiEdit2Fill } from 'react-icons/ri'
import { AiFillDelete } from 'react-icons/ai'
import ReactPaginate from 'react-paginate'
import { MapContainer, TileLayer } from 'react-leaflet'
import Gmap from '../Googlemap/Gmap'
import CloseIcon from '@mui/icons-material/Close'

const Geofences = () => {
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [limit, setLimit] = useState(5)
  const [pageCount, setPageCount] = useState()

  const handleEditModalClose = () => setEditModalOpen(false)
  const handleAddModalClose = () => setAddModalOpen(false)


  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    color: 'black',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  }

  // ######################### get geofences ##############################################
  const fetchGeofenceData = async (page = 1) => {
    const accessToken = Cookies.get('authToken')
    const url = `${import.meta.env.VITE_API_URL}/geofence?page=${page}&limit=${limit}`

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      })

      if (response.data.geofences) {
        setData(response.data.geofences)
        setPageCount(response.data.pagination.totalPages)
        console.log(response.data.geofences)
        console.log(response.data.pagination.totalPages)
        setLoading(false)
      }
    } catch (error) {
      setLoading(false)
      console.error('Error fetching data:', error)
      throw error // Re-throw the error for further handling if needed
    }
  }

  useEffect(() => {
    fetchGeofenceData()
  }, [])

  const handlePageClick = (e) => {
    console.log(e.selected + 1)
    let page = e.selected + 1
    setLoading(true)
    fetchGeofenceData(page)
  }


  // ################ add geofence #########################################

  const handleAddGeofence = (e) => {
    e.preventDefault();
    console.log(e);
  }

  return (
    <div className="m-3">
      <div className="d-flex justify-content-between mb-2">
        <div>
          <h2>Geofence</h2>
        </div>

        <div className="d-flex">
          <div className="me-3 d-none d-md-block">
            <input
              type="search"
              className="form-control"
              placeholder="search here..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div>
            <button
              onClick={() => setAddModalOpen(true)}
              variant="contained"
              className="btn btn-success text-white"
            >
              Add Geofence
            </button>
          </div>
        </div>
      </div>
      <div className="d-md-none mb-2">
        <input
          type="search"
          className="form-control"
          placeholder="search here..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="row">
        <div className="col-12 col-md-6">
          <TableContainer component={Paper} style={{ maxHeight: '800px', marginBottom: '10px' }}>
            {loading ? (
              <>
                <div className="text-nowrap mb-2" style={{ width: '240px' }}>
                  <p className="card-text placeholder-glow">
                    <span className="placeholder col-7" />
                    <span className="placeholder col-4" />
                    <span className="placeholder col-4" />
                    <span className="placeholder col-6" />
                    <span className="placeholder col-8" />
                  </p>
                  <p className="card-text placeholder-glow">
                    <span className="placeholder col-7" />
                    <span className="placeholder col-4" />
                    <span className="placeholder col-4" />
                    <span className="placeholder col-6" />
                    <span className="placeholder col-8" />
                  </p>
                </div>
              </>
            ) : (
              <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead className="text-nowrap">
                  <CTableRow>
                    <CTableHeaderCell
                      className="bg-body-tertiary text-center"
                      style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#fff' }}
                    >
                      Geofence Name
                    </CTableHeaderCell>
                    <CTableHeaderCell
                      className="bg-body-tertiary text-center"
                      style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#fff' }}
                    >
                      Type
                    </CTableHeaderCell>
                    <CTableHeaderCell
                      className="bg-body-tertiary text-center"
                      style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#fff' }}
                    >
                      Assign To
                    </CTableHeaderCell>

                    <CTableHeaderCell
                      className="bg-body-tertiary text-center"
                      style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#fff' }}
                    >
                      Actions
                    </CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {data?.map((item, index) => (
                    <CTableRow key={index}>
                      <CTableDataCell className="text-center">{item.name}</CTableDataCell>
                      <CTableDataCell className="text-center">{item.type}</CTableDataCell>
                      <CTableDataCell className="text-center">{item.assignType}</CTableDataCell>
                      <CTableDataCell
                        className="text-center d-flex"
                        style={{ justifyContent: 'center', alignItems: 'center' }}
                      >
                        <IconButton aria-label="edit" onClick={() => handleEditGroup(item)}>
                          <RiEdit2Fill
                            style={{ fontSize: '25px', color: 'lightBlue', margin: '5.3px' }}
                          />
                        </IconButton>
                        <IconButton aria-label="delete" onClick={() => deleteGroupSubmit(item)}>
                          <AiFillDelete
                            style={{ fontSize: '25px', color: 'red', margin: '5.3px' }}
                          />
                        </IconButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            )}
          </TableContainer>
          {pageCount > 1 && (
            <ReactPaginate
              breakLabel="..."
              nextLabel="next >"
              onPageChange={handlePageClick}
              pageRangeDisplayed={5}
              pageCount={pageCount} // Set based on the total pages from the API
              previousLabel="< previous"
              renderOnZeroPageCount={null}
              marginPagesDisplayed={2}
              containerClassName="pagination justify-content-center"
              pageClassName="page-item"
              pageLinkClassName="page-link"
              previousClassName="page-item"
              previousLinkClassName="page-link"
              nextClassName="page-item"
              nextLinkClassName="page-link"
              activeClassName="active"
            />
          )}
        </div>
        <div className="col-12 col-md-6">
          <div style={{ flex: 1 }}>{data.length > 0 && <Gmap data={data} />}</div>
        </div>
      </div>
      <Modal
        open={addModalOpen}
        onClose={handleAddModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="d-flex justify-content-between">
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Add New Geofence
            </Typography>
            <IconButton
              // style={{ marginLeft: 'auto', marginTop: '-40px', color: '#aaa' }}
              onClick={handleAddModalClose}
            >
              <CloseIcon />
            </IconButton>
          </div>
          <DialogContent>
            <form onSubmit={handleAddGeofence}>
              <TextField
                label="Geofence Name"
                name="name"
                value={formData.name !== undefined ? formData.name : ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Placetype</InputLabel>
                <Select
                  name="placetypeId"
                  value={formData.placetypeId !== undefined ? formData.placetypeId : ''}
                  onChange={(e) => setFormData({ ...formData, placetypeId: e.target.value })}
                  fullWidth
                >
                  <MenuItem>School</MenuItem>
                  <MenuItem>Factory</MenuItem>
                  <MenuItem>Office</MenuItem>
                  <MenuItem>Garden</MenuItem>
                  <MenuItem>Village</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Assign To"
                name="assign"
                value={formData.assign !== undefined ? formData.assign : ''}
                onChange={(e) => setFormData({ ...formData, assign: e.target.value })}
                required
              />
             
              <Button
                variant="contained"
                color="primary"
                type="submit"
                style={{ marginTop: '20px' }}
              >
                Submit
              </Button>
            </form>
          </DialogContent>
        </Box>
      </Modal>
    </div>
  )
}

export default Geofences
