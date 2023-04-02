import { useContext } from 'react'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Container } from '@mui/material'

import Header from './components/Header'
import UserContext from './api/UserContext'
import Login from './pages/Login'
import Lobby from './pages/Lobby'
import TTT from './pages/TTT'
import RPS from './pages/RPS'

export default function App() {
    const { user } = useContext(UserContext)

    return (
        <HashRouter>
            <Header />
            <Container sx={{ mt: 3 }}>
                <Routes>
                    <Route path='/' element={<Navigate to='/lobby' />} />
                    <Route path='/login' element={!user ? <Login /> : <Navigate to='/lobby' />} />
                    <Route path='/lobby' element={user ? <Lobby /> : <Navigate to='/login' />} />
                    <Route path='/ttt' element={<TTT />} />
                    <Route path='/rps' element={<RPS />} />
                    <Route path='*' element={<Navigate to='/' />} />
                </Routes>
            </Container>
        </HashRouter>
    )
}
