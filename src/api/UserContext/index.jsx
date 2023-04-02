import { createContext, useState } from 'react'

const UserContext = createContext()

export const UserProvider = (props) => {
    const [user, setUsername] = useState(sessionStorage.getItem('username') || '')

    const setUser = (username) => {
        sessionStorage.setItem('username', username)
        setUsername(username)
    }

    return (
        <UserContext.Provider
            value={{
                user,
                setUser,
            }}
        >
            {props.children}
        </UserContext.Provider>
    )
}

export default UserContext
