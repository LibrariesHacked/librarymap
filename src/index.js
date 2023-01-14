import React from 'react'
import ReactDOM from 'react-dom'

import App from './App'

import * as serviceWorker from './serviceWorker'

import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

import 'maplibre-gl/dist/maplibre-gl.css'

ReactDOM.render(<App />, document.getElementById('root'))

serviceWorker.unregister()
