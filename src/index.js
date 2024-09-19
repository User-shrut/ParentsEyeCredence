import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import 'core-js'

import App from './App'
import store from './store'
import GlobalState from './Context/Context'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <GlobalState>
      <App />
    </GlobalState>
  </Provider>,
)
