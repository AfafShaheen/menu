import { createContext, useContext } from 'react'

export const SettingsCtx = createContext()
export const useSettings = () => useContext(SettingsCtx)
