import { useContext } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import Header from './components/Header'
import UserContext from './api/UserContext'
import Login from './pages/Login'
import Lobby from './pages/Lobby'
import TTT from './pages/TTT'
import RPS from './pages/RPS'

export default function App() {
    const { user } = useContext(UserContext)

    return (
        <BrowserRouter>
            <Header />
            <Routes>
                <Route path='/' element={<Navigate to='/lobby' />} />
                <Route path='/login' element={!user ? <Login /> : <Navigate to='/lobby' />} />
                <Route path='/lobby' element={user ? <Lobby /> : <Navigate to='/login' />} />
                <Route path='/ttt' element={user ? <TTT /> : <Navigate to='/login' />} />
                <Route path='/rps' element={user ? <RPS /> : <Navigate to='/login' />} />
                <Route path='*' element={<Navigate to='/' />} />
            </Routes>
        </BrowserRouter>
    )
}
