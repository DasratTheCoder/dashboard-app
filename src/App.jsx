import React from 'react'
import Login from './pages/authen/login'
import Dashboard from './pages/authen/dashboard/dashboard'
import { Routes, Route } from 'react-router-dom'
const App = () => {
  return (
    <>
    <Routes>
      <Route path='/' element={<Login/>}/>
      <Route path='/dashboard' element={<Dashboard/>}/>
    </Routes>
    </>
  )
}

export default App