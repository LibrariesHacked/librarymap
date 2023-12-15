import React from 'react'
import { createRoot } from 'react-dom/client'

import App from './App'

import * as serviceWorker from './serviceWorker'

import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

import 'maplibre-gl/dist/maplibre-gl.css'

const container = document.getElementById('app')
const root = createRoot(container)
root.render(<App />)

serviceWorker.unregister()
