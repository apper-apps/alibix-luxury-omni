import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Layout from '@/components/organisms/Layout'
import Home from '@/components/pages/Home'
import Categories from '@/components/pages/Categories'
import ProductDetail from '@/components/pages/ProductDetail'
import Cart from '@/components/pages/Cart'
import Checkout from '@/components/pages/Checkout'
import Orders from '@/components/pages/Orders'
import Profile from '@/components/pages/Profile'
import Admin from '@/components/pages/Admin'
import { LanguageProvider } from '@/hooks/useLanguage'
import { CartProvider } from '@/hooks/useCart'

function App() {
  return (
    <LanguageProvider>
      <CartProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/admin/*" element={<Admin />} />
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="categories" element={<Categories />} />
                <Route path="categories/:categoryId" element={<Categories />} />
                <Route path="product/:productId" element={<ProductDetail />} />
                <Route path="cart" element={<Cart />} />
                <Route path="checkout" element={<Checkout />} />
                <Route path="orders" element={<Orders />} />
                <Route path="profile" element={<Profile />} />
              </Route>
            </Routes>
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
              className="z-[9999]"
            />
          </div>
        </Router>
      </CartProvider>
    </LanguageProvider>
  )
}

export default App