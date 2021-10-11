// 🐨 you'll need to import React and ReactDOM up here
import React from 'react'
import ReactDOM from 'react-dom'
import { Logo } from './components/logo'

const App = () => {
	function login () {
		alert('Login button clicked!')
	}

	function register () {
		alert('Register button clicked!')
	}

	return (
		<div>
			<Logo />
			<h1>Bookshelf</h1>
			<button onClick={login}>Login</button>
			<button onClick={register}>Register</button>
		</div>
	)
}

ReactDOM.render(<App/>, document.getElementById('root'))
