import React from 'react'
import ReactDOM from 'react-dom'
import { Logo } from './components/logo'
import { Dialog } from '@reach/dialog'

import '@reach/dialog/styles.css'

const LoginForm = ({ onSubmit, buttonText }) => {
	const usernameRef = React.useRef(null)
	const passwordRef = React.useRef(null)
	const submitForm = (e) => {
		e.preventDefault()
		onSubmit({
			username: usernameRef.current.value,
			password: passwordRef.current.value
		})
	}

	return (
		<div>
			<form onSubmit={submitForm}>
				<div>
					<h2>Login</h2>
					<label htmlFor="username">Username</label>
					<input id="username" ref={usernameRef} />
				</div>
				<div>
					<label htmlFor="password">Password</label>
					<input id="username" ref={passwordRef} />
				</div>
				<button>{buttonText}</button>
			</form>
		</div>
	)
}

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

	const handleSubmit = (formData) => {
		console.log(formData)
	}

	return (
		<div>
			<Logo />
			<Dialog isOpen={modalState === 'login'} aria-labelledby="login dialog">
				<button className="close-button" onClick={close}>close</button>
				<LoginForm onSubmit={handleSubmit} buttonText="Login" />
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
