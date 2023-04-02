import { useContext, useEffect, useRef, useState } from 'react'
import { Box, Button, Container, Grid, TextField, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'

import UserContext from '../../api/UserContext'
import { serverUri } from '../../api/Constants'

export default function TTT() {
    const socket = useRef()
    const grid = useRef()
    const { user } = useContext(UserContext)

    const [choice, setChoice] = useState('')
    const [gamecode, setGamecode] = useState('')
    const [requested, setRequested] = useState('')
    const [connected, setConnected] = useState(false)
    const [error, setError] = useState('')
    const [winner, setWinner] = useState('')
    const [yourTurn, setYourTurn] = useState(false)
    const [gameState, setGameState] = useState(Array.from(Array(9)))

    let content

    useEffect(() => {
        if (choice === 'start') {
            socket.current = new WebSocket(serverUri)
            socket.current.onopen = () => {
                const message = {
                    event: 'create',
                    username: user,
                    game: 'ttt',
                }
                socket.current.send(JSON.stringify(message))
            }
            socket.current.onmessage = (event) => {
                const data = JSON.parse(event.data)
                if (data.error) {
                    setError(data.error)
                } else {
                    setError('')
                }
                if (data.statusCode === 'created') {
                    setGamecode(data.id)
                }
                if (data.statusCode === 'ready') {
                    setRequested(data.guestName)
                }
                if (data.statusCode === 'started') {
                    setGameState(data.state)
                    setConnected(true)
                    setYourTurn(data.turn === 'x')
                }
                if (data.statusCode === 'over') {
                    setWinner(data.winner)
                }
            }
        }
    }, [choice])

    const startTheGame = () => {
        const message = {
            event: 'start',
            username: user,
            guest: requested,
            id: gamecode,
        }
        socket.current.send(JSON.stringify(message))
    }

    const join = (event) => {
        event.preventDefault()
        socket.current = new WebSocket(serverUri)
        socket.current.onopen = () => {
            const message = {
                event: 'join',
                username: user,
                code: gamecode,
            }
            socket.current.send(JSON.stringify(message))
        }
        socket.current.onmessage = (event) => {
            const data = JSON.parse(event.data)
            if (data.error) {
                setError(data.error)
            } else {
                setError('')
            }
            if (data.statusCode === 'ready') {
                setRequested(data.hostName)
            }
            if (data.statusCode === 'started') {
                setGameState(data.state)
                setConnected(true)
                setYourTurn(data.turn === 'o')
            }
            if (data.statusCode === 'over') {
                setWinner(data.winner)
            }
        }
    }

    const move = (cell) => {
        const message = {
            event: 'ttt-turn',
            id: gamecode,
            cellId: cell.target.id,
            username: user,
        }
        socket.current.send(JSON.stringify(message))
    }

    if (connected) {
        content = (
            <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                <Grid container ref={grid} maxWidth={500} gap={2}>
                    {gameState.map((v, i) => (
                        <Grid
                            item
                            key={i}
                            id={i}
                            onClick={(e) => !winner && move(e)}
                            sx={{ width: 150, height: 150, border: '1px solid #000', cursor: 'pointer' }}
                        >
                            {v === 'x' && <CloseIcon sx={{ height: 100, width: 100, padding: 3 }} />}
                            {v === 'o' && <RadioButtonUncheckedIcon sx={{ height: 100, width: 100, padding: 3 }} />}
                        </Grid>
                    ))}
                </Grid>
                <Box>
                    {error && <Typography>Error: {error}</Typography>}
                    {winner && (<Typography>{winner === 'tie' ? 'Tie!' : `Game Over: ${winner} wins` }</Typography>)}
                    {!winner && <Typography>{yourTurn ? 'Your turn' : `${requested}'s turn`}</Typography>}
                </Box>
            </Box>
        )
    } else {
        if (choice === 'start') {
            content = (
                <Box>
                    <Typography>Give this code to your friend so they can join the game:</Typography>
                    <Typography>{gamecode}</Typography>
                    <br />
                    {requested && <Typography>{requested} wants to join. Accept?</Typography>}
                    {requested && (
                        <Button onClick={startTheGame} variant='contained' color='success'>
                            OK, Start the game
                        </Button>
                    )}
                </Box>
            )
        } else if (choice === 'join') {
            content = (
                <Box sx={{ textAlign: 'center', mt: 20 }}>
                    <Typography>Enter game code:</Typography>
                    <form onSubmit={join}>
                        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, justifyContent: 'center', mt: 2 }}>
                            <TextField
                                size='small'
                                id='gamecode'
                                autoFocus
                                value={gamecode}
                                onChange={(e) => setGamecode(e.target.value)}
                            />
                            <Button
                                disabled={gamecode.length === 0 || requested}
                                type='submit'
                                variant='contained'
                                color='success'
                            >
                                Join
                            </Button>
                        </Box>
                    </form>
                    {error && <Typography>Error: {error}</Typography>}
                    {requested && <Typography>Waiting for the host to start the game.</Typography>}
                </Box>
            )
        } else {
            content = (
                <Box sx={{ mt: 30, display: 'flex', flexDirection: 'row', gap: 4, justifyContent: 'center' }}>
                    <Button variant='contained' size='large' onClick={() => setChoice('start')}>
                        Start a New Game
                    </Button>
                    <Button variant='contained' size='large' onClick={() => setChoice('join')}>
                        Join Existing Game
                    </Button>
                </Box>
            )
        }
    }

    return <Container sx={{ mt: 2 }}>{content}</Container>
}
