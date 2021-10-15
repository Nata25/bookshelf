import * as React from 'react'
import {FullPageSpinner, FullPageErrorFallback} from 'components/lib'
import * as auth from 'auth-provider'
import {useAsync} from 'utils/hooks'
import {client} from 'utils/api-client'

const AuthContext = React.createContext()
AuthContext.displayName = 'AuthContext'

function useAuth () {
	const context = React.useContext(AuthContext)
	if (context === undefined) {
		throw new Error('`useAuth` should be used inside AuthProvider.')
	} else {
		return context // { user, register, login, logout }
	}
}

function useClient () {
  const {token} = useAuth().user
  return React.useCallback((endpoint, config) => {
    return client(endpoint, {...config, token})
  }, [token])
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

function AuthProvider ({children}) {
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

export {useAuth, useClient, AuthProvider}
