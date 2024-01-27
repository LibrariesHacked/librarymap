import React from 'react'
import { createRoot } from 'react-dom/client'

import App from './App'

import * as serviceWorker from './serviceWorker'

import '@fontsource-variable/urbanist';

import 'maplibre-gl/dist/maplibre-gl.css'

const container = document.getElementById('app')
const root = createRoot(container)
root.render(<App />)

serviceWorker.unregister()
