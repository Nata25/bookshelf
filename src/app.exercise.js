/** @jsx jsx */
import {jsx} from '@emotion/core'

import * as React from 'react'
import * as auth from 'auth-provider'
import {AuthenticatedApp} from './authenticated-app'
import {UnauthenticatedApp} from './unauthenticated-app'

function App() {
  const [user, setUser] = React.useState(null)

  async function login ({ username, password } = {}) {
    const user = await auth.login({ username, password })
    if (user) setUser(user)
  }

  async function register ({ username, password } = {}) {
    const user = await auth.register({ username, password })
    if (user) setUser(user)
  }

  function logout () {
    auth.logout()
    setUser(null)
  }

  return (
    <div>
      {user && <AuthenticatedApp user={user} logout={logout} />}
      {!user && <UnauthenticatedApp login={login} register={register} />}
    </div>
  )
}

export {App}

/*
eslint
  no-unused-vars: "off",
*/
