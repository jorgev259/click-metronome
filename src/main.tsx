import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'

import App from './App.tsx'
import { HashRouter, Route, Routes } from 'react-router'
import Layout from './components/layout.tsx'

const malaguena = [
  { index: 0, compasses: 14, measure: 4, bpm: 84 },
  { index: 1, compasses: 5, measure: 4, bpm: 74, label: 'Maestoso' },
  { index: 3, compasses: 1, measure: 2, bpm: 74 },
  { index: 4, compasses: 2, measure: 4, bpm: 142 },
  { index: 5, compasses: 12, measure: 3, bpm: 142, label: 'Latin' },
  { index: 6, compasses: 3, measure: 4, bpm: 142 },
  { index: 7, compasses: 35, measure: 4, bpm: 162, label: 'Driving' },
  { index: 8, compasses: 17, measure: 4, bpm: 162, label: 'Swing' },
  { index: 9, compasses: 4, measure: 4, bpm: 162, label: 'Driving' },
  { index: 10, compasses: 4, measure: 4, bpm: 162, times: 2 },
  { index: 11, compasses: 4, measure: 4, bpm: 162, times: 2 },
  { index: 12, compasses: 29, measure: 4, bpm: 162 }
]

const rootElement = document.getElementById('root')
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<App song={[]} />} />
            <Route path='/malaguena' element={<App song={malaguena} />} />
          </Route>
        </Routes>
      </HashRouter>
    </StrictMode>
  )
}
