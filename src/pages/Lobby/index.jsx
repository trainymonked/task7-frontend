import { Box, Button, Card, CardActions, CardContent, Container, Grid, Typography } from '@mui/material'

export function OutlinedCard({ game }) {
    return (
        <Box sx={{ minWidth: 275 }}>
            <Card variant='outlined'>
                <CardContent>
                    <Typography variant='h5' gutterBottom>
                        {game.name}
                    </Typography>
                    <Typography variant='body2'>{game.description}</Typography>
                </CardContent>
                <CardActions>
                    <Button size='small' href={`/${game.id}`}>
                        Play
                    </Button>
                </CardActions>
            </Card>
        </Box>
    )
}

const games = [
    {
        id: 'ttt',
        name: 'Tic-Tac-Toe',
        description: `A game in which two players seek in alternate turns to complete a row, a column, or a diagonal with either three O's or three X's drawn in the spaces of a grid of nine squares; noughts and crosses.`,
    },
    {
        id: 'rps',
        name: 'Rock Paper Scissors',
        description: `Rock paper scissors is a hand game, played between two people, in which each player simultaneously forms one of three shapes with an outstretched hand. These shapes are "rock", "paper", and "scissors".`,
    },
]

export default function Lobby() {
    return (
        <Container sx={{ mt: 2 }}>
            <Box>
                <Typography>Choose the game</Typography>

                <Grid container spacing={2} mt={2}>
                    {games.map((game) => (
                        <Grid item md={4} key={game.id}>
                            <OutlinedCard game={game} />
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Container>
    )
}
