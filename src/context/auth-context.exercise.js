import React from 'react'

const AuthContext = React.createContext()

function useAuth () {
	const context = React.useContext(AuthContext)
	if (context === undefined) {
		throw new Error('`useAuth` should be used inside AuthContext.provider.')
	} else {
		return context // { user, register, login, logout }
	}
}

export {AuthContext, useAuth}

