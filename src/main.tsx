import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'

import App from './App.tsx'
import { HashRouter, Route, Routes } from 'react-router'
import Layout from './components/layout.tsx'
import { malaguenaSteps } from './songs/malaguena.tsx'
import { presagioSteps } from './songs/presagio.ts'
import { reflectionsSoundSong } from './songs/reflections-sound.ts'

const rootElement = document.getElementById('root')
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path='malaguena' element={<App song={malaguenaSteps} />} />
            <Route path='presagio' element={<App song={presagioSteps} />} />
            <Route
              path='reflections-sound'
              element={<App song={reflectionsSoundSong} />}
            />
          </Route>
        </Routes>
      </HashRouter>
    </StrictMode>
  )
}
