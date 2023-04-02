import { useContext } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Container } from '@mui/material'

import Header from './components/Header'
import UserContext from './api/UserContext'
import Login from './pages/Login'
import Lobby from './pages/Lobby'
import TTT from './pages/TTT'

export default function App() {
    const { user } = useContext(UserContext)

    return (
        <BrowserRouter>
            <Header />
            <Container sx={{ mt: 3 }}>
                <Routes>
                    <Route path='/' element={<Navigate to='/lobby' />} />
                    <Route path='/login' element={!user ? <Login /> : <Navigate to='/lobby' />} />
                    <Route path='/lobby' element={user ? <Lobby /> : <Navigate to='/login' />} />
                    <Route path='/ttt' element={<TTT />} />
                    {/* <Route path='/play/ttt' element={<TTT />} /> */}
                    <Route path='*' element={<Navigate to='/' />} />
                </Routes>
            </Container>
        </BrowserRouter>
    )
}
