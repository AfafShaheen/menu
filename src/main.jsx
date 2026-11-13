import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { LangProvider } from './i18n/LangContext'
import { SettingsProvider } from './context/SettingsContext'
import { CartProvider } from './context/CartContext'
import { init } from './data/dataService'
import * as db from './data/dataService'
import App from './App'
import '@fontsource/cairo/arabic-400.css'
import '@fontsource/cairo/arabic-600.css'
import '@fontsource/cairo/arabic-700.css'
import '@fontsource/cairo/latin-400.css'
import '@fontsource/cairo/latin-600.css'
import '@fontsource/cairo/latin-700.css'
import './index.css'

if (import.meta.env.DEV) window.db = db // للاختبار من الكونسول فقط

init().then(() => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <HashRouter>
        <LangProvider>
          <SettingsProvider>
            <CartProvider>
              <App />
            </CartProvider>
          </SettingsProvider>
        </LangProvider>
      </HashRouter>
    </StrictMode>
  )
})