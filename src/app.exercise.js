/** @jsx jsx */
import {jsx} from '@emotion/core'

import * as React from 'react'
import * as auth from 'auth-provider'
import {AuthenticatedApp} from './authenticated-app'
import {UnauthenticatedApp} from './unauthenticated-app'
import { client } from 'utils/api-client.exercise'
import { useAsync } from 'utils/hooks'
import { FullPageSpinner } from './components/lib'

import * as colors from 'styles/colors'

async function getUser () {
  const token = await auth.getToken()
  if (token) {
    const headers = {
      Authorization: `Bearer ${token}`,
    }
    const data = await client('me', {headers})
    if (data) return data.user
  }
}

function App() {
  const {
    data: user,
    error,
    isIdle,
    isLoading,
    isSuccess,
    isError,
    setData,
    run
  } = useAsync()

  function login ({ username, password } = {}) {
    return auth.login({ username, password }).then(u => setData(u))
  }

  function register ({ username, password } = {}) {
    return auth.register({ username, password }).then(u => setData(u))
  }

  function logout () {
    auth.logout()
    setData(null)
  }

  React.useEffect(() => {
    run(getUser())
  }, [run])

  return (
    <div>
      {(isLoading || isIdle) && (
        <FullPageSpinner />
      )}
      {isError && error && (
        <div
          css={{
            color: colors.danger,
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <p>Uh oh... There's a problem. Try refreshing the app.</p>
          <pre>{error.message}</pre>
        </div>
      )}
      {isSuccess && <>
        {user && <AuthenticatedApp user={user} logout={logout} />}
        {(!user) && <UnauthenticatedApp login={login} register={register} />}
        </>
      }
    </div>
  )
}

export {App}

/*
eslint
  no-unused-vars: "off",
*/
