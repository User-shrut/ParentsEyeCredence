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

const CustomStyles = ({ formData, handleInputChange, handleSubmit, devices, columns, selectedColumns, setSelectedColumns }) => {
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

  const handleCheckboxChange = (column) => {
    const newSelectedColumns = selectedColumns.includes(column)
      ? selectedColumns.filter((item) => item !== column)
      : [...selectedColumns, column];

    setSelectedColumns(newSelectedColumns);
    handleInputChange('Columns', newSelectedColumns);
  };

  return (
    <CForm
      className="row g-3 needs-validation"
      noValidate
      validated={validated}
      onSubmit={handleFormSubmit}
    >
      <CCol md={4}>
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

      {/* <CCol md={6}>
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
      </CCol> */}

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

      {/* <CCol md={4}>
        <CFormLabel htmlFor="type">Type</CFormLabel>
        <CFormSelect
          id="type"
          required
          value={formData.Type}
          onChange={(e) => handleInputChange('Type', e.target.value)}
        >
          <option value="">Choose a type...</option>
          <option value="Summary">Summary</option>
          <option value="Daily Summary">Daily Summary</option>
        </CFormSelect>
        <CFormFeedback invalid>Please select a valid type.</CFormFeedback>
      </CCol> */}

      {/* <CCol md={4}>
        <CFormLabel htmlFor="columns">Columns</CFormLabel>
        <div id="columns">
          {columns.map((column, index) => (
            <div key={index} className="form-check">
              
              <input
                type="checkbox"
                className="form-check-input"
                id={`column-${index}`}
                checked={selectedColumns.includes(column)}
                onChange={() => handleCheckboxChange(column)}
              />
              
              <label className="form-check-label" htmlFor={`column-${index}`}>
                {column}
              </label>
            </div>
            
          ))}
        </div>
        <CFormFeedback invalid>Please select at least one column.</CFormFeedback>
      </CCol> */}

      
<CCol
  md={4}
  style={{
    padding: '10px', // Decreased from 20px to 10px
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    backgroundColor: '#ffffff',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  }}
>
  <CFormLabel
    htmlFor="columns"
    style={{
      fontWeight: 'bold',
      marginBottom: '10px', // Decreased from 15px to 10px
      color: '#333',
      display: 'block',
    }}
  >
    <h5 style={{ margin: 0 }}>Columns</h5>
  </CFormLabel>
  <div
    id="columns"
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '10px', // Decreased from 15px to 10px
    }}
  >
    {columns.map((column, index) => (
      <div
        key={index}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '4px 8px', // Decreased from 8px 12px to 4px 8px
          borderRadius: '5px',
          backgroundColor: selectedColumns.includes(column) ? '#e0f7fa' : 'transparent',
          transition: 'background-color 0.3s ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f1f1')}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = selectedColumns.includes(column) ? '#e0f7fa' : 'transparent')}
      >
        <input
          type="checkbox"
          className="form-check-input"
          id={`column-${index}`}
          checked={selectedColumns.includes(column)}
          onChange={() => handleCheckboxChange(column)}
          style={{
            marginRight: '10px',
            accentColor: '#007bff',
          }}
        />
        <label
          className="form-check-label"
          htmlFor={`column-${index}`}
          style={{
            color: '#555',
            transition: 'color 0.3s ease',
            cursor: 'pointer',
          }}
        >
          {column}
        </label>
      </div>
    ))}
  </div>
  <CFormFeedback invalid>Please select at least one column.</CFormFeedback>
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

const CustomStyles1 = ({ rows, selectedColumns }) => {
  return (
    <CTable borderless className="custom-table">
      <CTableHead>
        <CTableRow>
          <CTableHeaderCell>Sr.No</CTableHeaderCell>
          <CTableHeaderCell>Devices</CTableHeaderCell>
          <CTableHeaderCell>Details</CTableHeaderCell>
          {selectedColumns.map((col, index) => (
            <CTableHeaderCell key={index}>{col}</CTableHeaderCell>
          ))}
        </CTableRow>
      </CTableHead>
      <CTableBody>
        {rows.map((row) => (
          <CTableRow key={row.id} className="custom-row">
            <CTableDataCell>{row.id}</CTableDataCell>
            <CTableDataCell>{row.Devices}</CTableDataCell>
            <CTableDataCell>{row.Details}</CTableDataCell>
            {selectedColumns.map((col, index) => (
              <CTableDataCell key={index}>{row[col]}</CTableDataCell>
            ))}
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
    { id: 1, Devices: 'MH43BB1234', Details: 'Nagpur' },
    { id: 2, Devices: 'MH43BC1234', Details: 'Akola' },
  ]);
  const [formData, setFormData] = useState({ Devices: '', Details: '', Periods: '', FromDate: '', ToDate: '', Columns: [] });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [devices, setDevices] = useState([]);
  // const [groups, setGroups] = useState([]);
  const [columns] = useState(['Start Date', 'Distance', 'Odometer Start', 'Odometer End', 'Average Speed', 'Maximum Speed', 'Engine Hours', 'Spent Fuel']);

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
          throw new Error('Failed to fetch devices');
        }

        const data = await response.json();
        setDevices(data);
      } catch (error) {
        console.error(error);
      }
    };

    // const fetchGroups = async () => {
    //   try {
    //     const response = await fetch('https://rocketsalestracker.com/api/groups', {
    //       method: 'GET',
    //       headers: {
    //         'Authorization': 'Basic ' + btoa(`${username}:${password}`),
    //         'Content-Type': 'application/json',
    //       },
    //     });

    //     if (!response.ok) {
    //       throw new Error('Failed to fetch groups');
    //     }

    //     const data = await response.json();
    //     setGroups(data);
    //   } catch (error) {
    //     console.error(error);
    //   }
    // };

    fetchDevices();
    // fetchGroups();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    // Logic for handling form submission
    console.log('Form submitted:', formData);
    // You can also handle any additional logic here if needed
  };

  return (
    <>
      <CRow>
        <h3>Custom Reports</h3>
        <CCol xs={12} className='mb-4'>
          <CCard className='p-0'>
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
                // groups={groups}
                columns={columns}
                selectedColumns={selectedColumns}
                setSelectedColumns={setSelectedColumns}
              />

            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow>
        <CCol xs={12}>
          <CCard className="p-0 mb-4">
            <CCardHeader>
              <strong>All Status List :</strong>
            </CCardHeader>
            <CCardBody>
              <CustomStyles1 rows={rows} selectedColumns={selectedColumns} />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  );
};

export default Validation;