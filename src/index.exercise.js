import React from 'react'
import ReactDOM from 'react-dom'
import { Logo } from './components/logo'
import { Dialog } from '@reach/dialog'

import '@reach/dialog/styles.css'

const App = () => {
	const [modalState, setModalState] = React.useState('closed')

	function login () {
		setModalState('login')
	}

	function register () {
		setModalState('register')
	}

	function close () {
		setModalState('closed')
	}

	return (
		<div>
			<Logo />
			<Dialog isOpen={modalState === 'login'} aria-labelledby="login dialog">
				<button className="close-button" onClick={close}>close</button>
				<p>Login button clicked!</p>
			</Dialog>
			<Dialog isOpen={modalState === 'register'} aria-labelledby="register dialog">
				<button className="close-button" onClick={close}>close</button>
				<p>Register button clicked!</p>
			</Dialog>
			<h1>Bookshelf</h1>
			<button onClick={login}>Login</button>
			<button onClick={register}>Register</button>
		</div>
	)
}

ReactDOM.render(<App/>, document.getElementById('root'))
