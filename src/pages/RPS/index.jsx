import { useContext, useEffect, useRef, useState } from 'react'
import { Box, Button, Container, TextField, Typography } from '@mui/material'

import UserContext from '../../api/UserContext'
import { serverUri } from '../../api/Constants'

export default function RPS() {
    const socket = useRef()
    const { user } = useContext(UserContext)

    const [choice, setChoice] = useState('')
    const [gamecode, setGamecode] = useState('')
    const [requested, setRequested] = useState(false)
    const [connected, setConnected] = useState(false)
    const [error, setError] = useState('')
    const [winner, setWinner] = useState('')
    const [yourTurn, setYourTurn] = useState(false)

    let content

    useEffect(() => {
        if (choice === 'start') {
            socket.current = new WebSocket(serverUri)
            socket.current.onopen = () => {
                const message = {
                    event: 'create',
                    username: user,
                    game: 'rps',
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
                    setConnected(true)
                    setYourTurn(!data.hostMove)
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
                setConnected(true)
                setYourTurn(data.hostMove)
            }
            if (data.statusCode === 'over') {
                setWinner(data.winner)
            }
        }
    }

    const move = (move) => {
        const message = {
            event: 'rps-turn',
            id: gamecode,
            move: move,
            username: user,
        }
        socket.current.send(JSON.stringify(message))
    }

    if (connected) {
        content = (
            <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
                    {winner === '' &&
                        (yourTurn ? (
                            <>
                                <Button onClick={() => move('rock')} variant='contained'>
                                    Rock
                                </Button>
                                <Button onClick={() => move('paper')} variant='contained'>
                                    Paper
                                </Button>
                                <Button onClick={() => move('scissors')} variant='contained'>
                                    Scissors
                                </Button>
                            </>
                        ) : (
                            <Typography>Enemy's turn</Typography>
                        ))}
                </Box>
                <Box>
                    {error && <Typography>Error: {error}</Typography>}
                    {winner !== '' &&
                        (winner !== 0 ? (
                            <Typography>Game Over: {winner} wins</Typography>
                        ) : (
                            <Typography>Tie!</Typography>
                        ))}
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
                                disabled={gamecode.length === 0 || requested !== false}
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
