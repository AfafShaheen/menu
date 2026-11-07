import { createContext, useContext, useEffect, useState } from 'react'
import { getSettings } from '../data/dataService'

const Ctx = createContext()

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(null)
  const refresh = async () => setSettings(await getSettings())
  useEffect(() => { refresh() }, [])
  if (!settings) return null
  return <Ctx.Provider value={{ settings, refresh }}>{children}</Ctx.Provider>
}

export const useSettings = () => useContext(Ctx)