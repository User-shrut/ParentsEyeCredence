import React, { useState } from 'react'

const InvoiceForm = () => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerAddress: '',
    companyName: '',
    companyAddress: '',
    date: '',
    itemName: '',
    quantity: 0,
    gst: 0,
    hsnCode: '',
    discount: 0,
    unitPrice: 0,
    subtotal: 0,
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const calculateSubtotal = () => {
    const subtotal =
      formData.quantity *
      formData.unitPrice *
      (1 - formData.discount / 100) *
      (1 + formData.gst / 100)
    setFormData({
      ...formData,
      subtotal,
    })
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Invoice form</h2>

      <div>
        <h3 style={styles.sectionHeader}>From :</h3>
        <div style={styles.fieldContainer}>
          <label style={styles.label}>Customer Name:</label>
          <input
            type="text"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            style={styles.input}
            placeholder="Customer Name"
          />
        </div>
        <div style={styles.fieldContainer}>
          <label style={styles.label}>Customer Address:</label>
          <input
            type="text"
            name="customerAddress"
            value={formData.customerAddress}
            onChange={handleChange}
            style={styles.input}
            placeholder="Customer Address"
          />
        </div>
      </div>

      <div>
        <h3 style={styles.sectionHeader}>To :</h3>
        <div style={styles.fieldContainer}>
          <label style={styles.label}>Company Name:</label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            style={styles.input}
            placeholder="Company Name"
          />
        </div>
        <div style={styles.fieldContainer}>
          <label style={styles.label}>Company Address:</label>
          <input
            type="text"
            name="companyAddress"
            value={formData.companyAddress}
            onChange={handleChange}
            style={styles.input}
            placeholder="Company Address"
          />
        </div>
      </div>

      <div>
        <h3 style={styles.sectionHeader}>Items Details :</h3>
        <div style={styles.fieldContainer}>
          <label style={styles.label}>Date:</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            style={styles.input}
          />
        </div>
        <div style={styles.fieldContainer}>
          <label style={styles.label}>Item Name:</label>
          <input
            type="text"
            name="itemName"
            value={formData.itemName}
            onChange={handleChange}
            style={styles.input}
            placeholder="Item Name"
          />
        </div>
        <div style={styles.fieldContainer}>
          <label style={styles.label}>Quantity:</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            style={styles.input}
            placeholder="Quantity"
          />
        </div>
        <div style={styles.fieldContainer}>
          <label style={styles.label}>GST (%):</label>
          <input
            type="number"
            name="gst"
            value={formData.gst}
            onChange={handleChange}
            style={styles.input}
            placeholder="GST"
          />
        </div>
        <div style={styles.fieldContainer}>
          <label style={styles.label}>HSN Code:</label>
          <input
            type="text"
            name="hsnCode"
            value={formData.hsnCode}
            onChange={handleChange}
            style={styles.input}
            placeholder="HSN Code"
          />
        </div>
        <div style={styles.fieldContainer}>
          <label style={styles.label}>Discount (%):</label>
          <input
            type="number"
            name="discount"
            value={formData.discount}
            onChange={handleChange}
            style={styles.input}
            placeholder="Discount"
          />
        </div>
        <div style={styles.fieldContainer}>
          <label style={styles.label}>Unit Price:</label>
          <input
            type="number"
            name="unitPrice"
            value={formData.unitPrice}
            onChange={handleChange}
            style={styles.input}
            placeholder="Unit Price"
          />
        </div>
      </div>

      <div style={styles.subtotalContainer}>
        <h3 style={styles.subtotal}>Subtotal: ₹ {formData.subtotal.toFixed(3)}</h3>
      </div>

      <button onClick={calculateSubtotal} style={styles.button}>
        Calculate Subtotal
      </button>
    </div>
  )
}

const styles = {
  container: {
    padding: '20px',
    maxWidth: '800px',
    margin: 'auto',
    border: '2px solid lightgray',
    backgroundColor: '#d2d3d5',
    borderRadius: '10px',

    color: '#2c3e50',
  },
  header: {
    textAlign: 'center',
    fontSize: '24px',
    marginBottom: '20px',
    color: '#34495e',
  },
  sectionHeader: {
    fontSize: '18px',
    marginBottom: '10px',
    color: '#8e44ad',
  },
  fieldContainer: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontSize: '14px',
    color: '#2c3e50',
  },
  input: {
    width: '100%',
    padding: '8px',
    fontSize: '14px',
    border: '1px solid #bdc3c7',
    borderRadius: '4px',
    color: 'black',
    backgroundColor: '#ecf0f1',
  },
  subtotalContainer: {
    textAlign: 'center',
    margin: '20px 0',
  },
  subtotal: {
    fontSize: '20px',
    color: '#27ae60',
  },
  button: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#2980b9',
    color: 'white',
    fontSize: '16px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
}

export default InvoiceForm
