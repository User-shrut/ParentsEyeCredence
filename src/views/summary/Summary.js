import React, { useEffect, useState } from 'react';
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormSelect,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CRow,
  CFormLabel,
  CFormFeedback,
} from '@coreui/react';

const CustomStyles = ({ formData, handleInputChange, handleSubmit, devices, groups }) => {
  const [validated, setValidated] = useState(false);
  const [showDateInputs, setShowDateInputs] = useState(false);

  const handleFormSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      event.preventDefault();
      handleSubmit();
    }
    setValidated(true);
  };

  const handlePeriodChange = (value) => {
    handleInputChange('Periods', value);
    setShowDateInputs(value === 'Custom');
  };

  return (
    <CForm
      className="row g-3 needs-validation"
      noValidate
      validated={validated}
      onSubmit={handleFormSubmit}
    >
      <CCol md={6}>
        <CFormLabel htmlFor="devices">Devices</CFormLabel>
        
        <CFormSelect
          id="devices"
          required
          value={formData.Devices}
          onChange={(e) => handleInputChange('Devices', e.target.value)}
        >
          <option value="">Choose a device...</option>
          {devices.length > 0 ? (
            devices.map((device) => (
              <option key={device.id} value={device.id}>{device.name}</option>
            ))
          ) : (
            <option disabled>Loading devices...</option>
          )}
        </CFormSelect>
      
        <CFormFeedback invalid>Please provide a valid device.</CFormFeedback>
      </CCol>

      <CCol md={6}>
        <CFormLabel htmlFor="details">Groups</CFormLabel>
        <CFormSelect
          id="details"
          required
          value={formData.Details}
          onChange={(e) => handleInputChange('Details', e.target.value)}
        >
          <option value="">Choose a group...</option>
          {groups.length > 0 ? (
            groups.map((group) => (
              <option key={group.id} value={group.id}>{group.name}</option>
            ))
          ) : (
            <option disabled>Loading groups...</option>
          )}
        </CFormSelect>
        <CFormFeedback invalid>Please provide valid details.</CFormFeedback>
      </CCol>

      <CCol md={4}>
        <CFormLabel htmlFor="periods">Periods</CFormLabel>
        <CFormSelect
          id="periods"
          required
          value={formData.Periods}
          onChange={(e) => handlePeriodChange(e.target.value)}
        >
          <option value="">Choose a period...</option>
          <option value="Today">Today</option>
          <option value="Yesterday">Yesterday</option>
          <option value="This Week">This Week</option>
          <option value="Previous Week">Previous Week</option>
          <option value="This Month">This Month</option>
          <option value="Previous Month">Previous Month</option>
          <option value="Custom">Custom</option>
        </CFormSelect>
        <CFormFeedback invalid>Please select a valid period.</CFormFeedback>
      </CCol>

      <CCol md={4}>
        <CFormLabel htmlFor="periods">Type</CFormLabel>
        <CFormSelect
          id="periods"
          required
          value={formData.Periods}
          onChange={(e) => handlePeriodChange(e.target.value)}
        >
          <option value="">Choose a period...</option>
          <option value="Summary">Summary</option>
          <option value="Summary">Daily Summary</option>
        </CFormSelect>
        <CFormFeedback invalid>Please select a valid period.</CFormFeedback>
      </CCol>

      {showDateInputs && (
        <>
          <CCol md={4}>
            <CFormLabel htmlFor="fromDate">From Date</CFormLabel>
            <CFormInput
              type="date"
              id="fromDate"
              value={formData.FromDate}
              onChange={(e) => handleInputChange('FromDate', e.target.value)}
              required
            />
            <CFormFeedback invalid>Please provide a valid from date.</CFormFeedback>
          </CCol>
          <CCol md={4}>
            <CFormLabel htmlFor="toDate">To Date</CFormLabel>
            <CFormInput
              type="date"
              id="toDate"
              value={formData.ToDate}
              onChange={(e) => handleInputChange('ToDate', e.target.value)}
              required
            />
            <CFormFeedback invalid>Please provide a valid to date.</CFormFeedback>
          </CCol>
        </>
      )}

      <CCol xs={12}>
        <div className="d-flex justify-content-end">
          <CButton color="primary" type="submit">
            SHOW NOW
          </CButton>
        </div>
      </CCol>
    </CForm>
  );
};

const CustomStyles1 = ({ rows, handleEditClick, handleSaveClick, handleDeleteClick, handleInputChange }) => {
  return (
    <CTable borderless className="custom-table">
      <CTableHead>
        <CTableRow>
          <CTableHeaderCell>Sr.No</CTableHeaderCell>
          <CTableHeaderCell>Devices</CTableHeaderCell>
          <CTableHeaderCell>Fix Time</CTableHeaderCell>
          <CTableHeaderCell>Type</CTableHeaderCell>
        </CTableRow>
      </CTableHead>
      <CTableBody>
        {rows.map((row) => (
          <CTableRow key={row.id} className="custom-row">
            <CTableDataCell>{row.id}</CTableDataCell>
            <CTableDataCell>
              {row.isEditing ? (
                <CFormInput
                  value={row.Devices}
                  onChange={(e) => handleInputChange(row.id, 'Devices', e.target.value)}
                />
              ) : (
                row.Devices
              )}
            </CTableDataCell>
            <CTableDataCell>
              {row.isEditing ? (
                <CFormInput
                  value={row.Details}
                  onChange={(e) => handleInputChange(row.id, 'Details', e.target.value)}
                />
              ) : (
                row.Details
              )}
            </CTableDataCell>
            <CTableDataCell>
              {row.isEditing ? (
                <CFormInput
                  value={row.Type}
                  onChange={(e) => handleInputChange(row.id, 'Type', e.target.value)}
                />
              ) : (
                row.Type
              )}
            </CTableDataCell>
          </CTableRow>
        ))}
      </CTableBody>
    </CTable>
  );
};

const Validation = () => {
  const username = 'school';
  const password = '123456';
  const [rows, setRows] = useState([
    { id: 1, Devices: 'MH43BB1234', Details: 'Nagpur', Type: 'Active', isEditing: false },
    { id: 2, Devices: 'MH43BC1234', Details: 'Akola', Type: 'Active', isEditing: false },
  ]);
  const [formData, setFormData] = useState({ Devices: '', Details: '', Periods: '', FromDate: '', ToDate: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [devices, setDevices] = useState([]);
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await fetch('https://rocketsalestracker.com/api/devices', {
          method: 'GET',
          headers: {
            'Authorization': 'Basic ' + btoa(`${username}:${password}`),
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        setDevices(data); // Adjust if the structure of the response is different
      } catch (error) {
        console.error('Error fetching devices:', error);
      }
    };

    const fetchGroups = async () => {
      try {
        const response = await fetch('https://rocketsalestracker.com/api/groups', {
          method: 'GET',
          headers: {
            'Authorization': 'Basic ' + btoa(`${username}:${password}`),
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        setGroups(data); // Adjust if the structure of the response is different
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    };

    fetchDevices();
    fetchGroups();
  }, []);

  const handleInputChange = (id, field, value) => {
    if (id) {
      setRows((prevRows) =>
        prevRows.map((row) => (row.id === id ? { ...row, [field]: value } : row))
      );
    } else {
      setFormData({ ...formData, [field]: value });
    }
  };

  const handleSubmit = () => {
    const newRow = {
      id: rows.length + 1,
      Devices: formData.Devices,
      Details: formData.Details,
      Type: formData.Periods,
      isEditing: false,
    };
    setRows([...rows, newRow]);
    setFormData({ Devices: '', Details: '', Periods: '', FromDate: '', ToDate: '' });
  };

  const filteredRows = rows.filter(row =>
    row.Devices.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <CRow>
      <CCol xs={12} className="mb-4">
        <CCard className="p-0">
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <strong>Status Reports</strong>
            <CFormInput
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '250px' }}
            />
          </CCardHeader>
          <CCardBody>
            <CustomStyles
              formData={formData}
              handleInputChange={handleInputChange}
              handleSubmit={handleSubmit}
              devices={devices}
              groups={groups}
            />
          </CCardBody>
        </CCard>
      </CCol>

      <CCol xs={12}>
        <CCard className="p-0 mb-4">
          <CCardHeader>
            <strong>All Status List :</strong>
          </CCardHeader>
          <CCardBody>
            <CustomStyles1
              rows={filteredRows}
              handleEditClick={() => {}}
              handleSaveClick={() => {}}
              handleDeleteClick={() => {}}
              handleInputChange={handleInputChange}
            />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default Validation;
