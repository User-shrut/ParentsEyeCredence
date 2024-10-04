import { configureStore, combineReducers } from '@reduxjs/toolkit'
import liveFeaturesReducer from './features/LivetrackingDataSlice.js'
import vehicleReducer from './features/vehicleSlice.js'
import columnVisibilityReducer from './features/columnVisibilitySlice.js'
import deviceReducer from './features/devicesSlice.js';
// Initial state and reducer for sidebar and theme
const initialState = {
  sidebarShow: true,
  theme: 'light',
}

const changeState = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case 'set':
      return { ...state, ...rest }
    default:
      return state
  }
}

// Combine reducers
const rootReducer = combineReducers({
  liveFeatures: liveFeaturesReducer,
  sidebar: changeState, // Add your sidebar/theme reducer here
  vehicle: vehicleReducer,
  columnVisibility: columnVisibilityReducer,
  device: deviceReducer,
})

// Create the Redux store
const store = configureStore({
  reducer: rootReducer,
})

export default store
