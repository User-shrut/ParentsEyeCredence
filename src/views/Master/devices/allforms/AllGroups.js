import React, { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import axios from "axios";
import GroupIcon from '@mui/icons-material/Group';
import toast, { Toaster } from 'react-hot-toast'

import {
  Button,
  TextField,
  FormControl,
  InputAdornment
} from '@mui/material'

function GroupForm({ handleNextStep, handleSkip }) {
  const [formData, setFormData] = useState({})
  const handleSaveAndNext = async (e) => {
    e.preventDefault()
    try {
      const accessToken = Cookies.get('authToken')
      console.log("access token", accessToken);

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/group`, formData
        , {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      })
      console.log("response", response);


      if (response.status === 201) {
        toast.success('group is created successfully')
        console.log("Group(s) created successfully");
        handleNextStep();
      }
    } catch (error) {
      toast.error('An error occured',error.response.data)
      console.error("Error creating group:", error);
    }
  };

  

  return (
    <form >
              <FormControl style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <TextField
                  label="Group Name"
                  name="name"
                  value={formData.name !== undefined ? formData.name : ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <GroupIcon
                          sx={{ borderRadius: "50%", backgroundColor: "rgba(0, 0, 0, 0.54)", color: "white", padding: "5px", fontSize: "28px" }}
                        />
                      </InputAdornment>
                    ),
                  }}
                />
              </FormControl>
              
              <div style={{position:"absolute",bottom:"1.5rem",right:"1.5rem"}}>
              {/* <Button variant="contained"  type="button" onClick={handleSkip}>
      Skip
    </Button> */}
    {/* <Button variant="contained" className='btn btn-secondary' type="button" onClick={handleSaveAndNext} style={{marginLeft:'1rem'}}>
      Save and Next
    </Button> */}
    {/* <div className="me-3 d-none d-md-block" > */}
              <button
                
                onClick={handleSkip}
                variant="contained"
                className="btn btn-secondary"
              >
                Skip
              </button>
              <button
                
                onClick={handleSaveAndNext}
                variant="contained"
                className="btn btn-secondary"
                style={{marginLeft:'1rem'}}
              >
                Save and Next
              </button>
            {/* </div> */}
    </div>
            </form>
  );
}

export default GroupForm;
