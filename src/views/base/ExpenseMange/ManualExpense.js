import React, { useState } from 'react'

const ManualExpense = () => {
  const [formData, setFormData] = useState({
    employeeId: '',
    fullName: '',
    expensetype: '',
    expensedescription: '',
    amount: '',
    date: '',
  })

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Logic to handle form submission
    console.log(formData)
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        backgroundColor: '#212631',

        padding: '20px',
        borderRadius: '10px',
        maxWidth: '700px',
        margin: 'auto',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      <h2 style={{ textAlign: 'center', color: 'wheat' }}>Manual Expense</h2>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', color: 'wheat' }}>Employee ID</label>
        <input
          type="text"
          name="employeeId"
          value={formData.employeeId}
          onChange={handleChange}
          placeholder="Enter Employee ID"
          style={{
            color: '#fff',
            width: '100%',
            padding: '8px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            backgroundColor: '#ECF0F1',
          }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', color: 'wheat' }}>Full Name</label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Enter Full Name"
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            backgroundColor: '#ECF0F1',
          }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', color: 'wheat' }}>
          Expense Type
        </label>
        <input
          type="text"
          name="expensetype"
          value={formData.expensetype}
          onChange={handleChange}
          placeholder="Expense Type"
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            backgroundColor: '#ECF0F1',
          }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', color: 'wheat' }}>
          Expense Description
        </label>
        <input
          type="text"
          name="expensedescription"
          value={formData.expensedescription}
          onChange={handleChange}
          placeholder="Expense Description"
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            backgroundColor: '#ECF0F1',
          }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', color: 'wheat' }}>Amount</label>
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          placeholder="Enter Amount"
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            backgroundColor: '#ECF0F1',
          }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', color: 'wheat' }}>Calendar</label>
        <input
          type="calendar"
          name="calendar"
          onChange={handleChange}
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            backgroundColor: '#ECF0F1',
          }}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button
          type="submit"
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            padding: '10px 15px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Submit
        </button>
        <button
          type="reset"
          onClick={() => setFormData({})}
          style={{
            backgroundColor: '#6c757d',
            color: 'white',
            padding: '10px 15px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Reset
        </button>
      </div>
    </form>
  )
}

export default ManualExpense
