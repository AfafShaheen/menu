import { Routes, Route } from 'react-router-dom'
import NotFound from './pages/NotFound'
import Header from './components/Header'
import Home from './pages/Home'
import Menu from './pages/Menu'
import Category from './pages/Category'
import Item from './pages/Item'
import Cart from './pages/Cart'
import CartBar from './components/CartBar'
import AdminLayout from './pages/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminItems from './pages/admin/AdminItems'
import AdminCategories from './pages/admin/AdminCategories'
import AdminSlides from './pages/admin/AdminSlides'
import AdminSettings from './pages/admin/AdminSettings'

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/menu/:id" element={<Category />} />
        <Route path="/item/:id" element={<Item />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="items" element={<AdminItems />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="slides" element={<AdminSlides />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      <CartBar />
    </>
  )
}