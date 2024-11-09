import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    newAddress: {}
}

const addressSlice = createSlice({
    name: 'address',
    initialState,
    reducers: {
        setNewAddress: (state, action) => {
            state.newAddress = action.payload
        },
    },
})

export const { setNewAddress } = addressSlice.actions
export default addressSlice.reducer
