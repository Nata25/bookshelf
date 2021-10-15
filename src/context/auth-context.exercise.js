import * as React from 'react'
import {FullPageSpinner, FullPageErrorFallback} from 'components/lib'
import * as auth from 'auth-provider'
import {useAsync} from 'utils/hooks'
import {client} from 'utils/api-client'

const AuthContext = React.createContext()

function useAuth () {
	const context = React.useContext(AuthContext)
	if (context === undefined) {
		throw new Error('`useAuth` should be used inside AuthContextProvider.')
	} else {
		return context // { user, register, login, logout }
	}
}

async function getUser() {
  let user = null

  const token = await auth.getToken()
  if (token) {
    const data = await client('me', {token})
    user = data.user
  }

  return user
}

function AuthContextProvider ({children}) {
	const {
    data: user,
    error,
    isLoading,
    isIdle,
    isError,
    isSuccess,
    run,
    setData,
  } = useAsync()

  React.useEffect(() => {
    run(getUser())
  }, [run])

  const login = form => auth.login(form).then(user => setData(user))
  const register = form => auth.register(form).then(user => setData(user))
  const logout = () => {
    auth.logout()
    setData(null)
  }

  if (isLoading || isIdle) {
    return <FullPageSpinner />
  }

  if (isError) {
    return <FullPageErrorFallback error={error} />
  }

	if (isSuccess) {
    return (
      <AuthContext.Provider value={{user, login, register, logout}}>
        {children}
      </AuthContext.Provider>
    ) 
  }
}

export {useAuth, AuthContextProvider}
