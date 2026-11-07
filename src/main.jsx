import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { LangProvider } from './i18n/LangContext'
import { SettingsProvider } from './context/SettingsContext'
import { CartProvider } from './context/CartContext'
import { init } from './data/dataService'
import * as db from './data/dataService'
import App from './App'
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