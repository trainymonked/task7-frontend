import { useContext } from 'react'
import { AppBar, Box, Button, SvgIcon, Toolbar, Typography } from '@mui/material'

import { ReactComponent as logo } from '../../logo.svg'
import UserContext from '../../api/UserContext'
import { useNavigate } from 'react-router-dom'

export default function Header() {
    const { user, setUser } = useContext(UserContext)
    const navigate = useNavigate()

    const logOut = () => {
        setUser('')
        navigate('/')
    }
    return (
        <AppBar position='static'>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <SvgIcon component={logo} sx={{ fontSize: '3rem' }} inheritViewBox />
                    <Button color='inherit' size='large' href='/'>
                        Legen<s style={{ color: 'rgba(255, 255, 255, 0.22)' }}>wait for it</s>dary Games
                    </Button>
                </Box>
                {user && (
                    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                        <Typography>{user}</Typography>
                        <Button size='small' color='inherit' variant='outlined' onClick={logOut}>
                            Log Out
                        </Button>
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    )
}
