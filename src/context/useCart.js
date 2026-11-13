import { createContext, useContext } from 'react'

export const CartCtx = createContext()
export const useCart = () => useContext(CartCtx)
