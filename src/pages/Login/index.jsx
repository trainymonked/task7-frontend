import { Box, Button, TextField, Typography } from '@mui/material'
import { useContext, useState } from 'react'

import UserContext from '../../api/UserContext'

export default function Login() {
    const [username, setUsername] = useState('')
    const { setUser } = useContext(UserContext)

    const login = (event) => {
        event.preventDefault()
        setUser(username)
    }

    return (
        <Box sx={{ textAlign: 'center', mt: 20 }}>
            <Typography>Enter a username:</Typography>
            <form onSubmit={login}>
                <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, justifyContent: 'center', mt: 2 }}>
                    <TextField
                        size='small'
                        id='username'
                        autoFocus
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <Button disabled={username.trim().length === 0} type='submit' variant='contained' color='success'>
                        Log in
                    </Button>
                </Box>
            </form>
        </Box>
    )
}
