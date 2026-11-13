import { useCallback, useEffect, useMemo, useState } from 'react'
import { getSettings } from '../data/dataService'
import { SettingsCtx } from './useSettings'

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(null)

  useEffect(() => {
    let alive = true
    getSettings().then((s) => alive && setSettings(s))
    return () => {
      alive = false
    }
  }, [])

  const refresh = useCallback(async () => setSettings(await getSettings()), [])
  const value = useMemo(() => ({ settings, refresh }), [settings, refresh])

  if (!settings) return null
  return <SettingsCtx.Provider value={value}>{children}</SettingsCtx.Provider>
}
