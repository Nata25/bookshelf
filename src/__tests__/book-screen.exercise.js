import * as React from 'react'
import {render, screen, waitFor} from '@testing-library/react'
import {queryCache} from 'react-query'
import {buildUser, buildBook} from 'test/generate'
import * as auth from 'auth-provider'
import {AppProviders} from 'context'
import {App} from 'app'

afterEach(() => {
	queryCache.clear()
	auth.logout()
})

test('renders all the book information', async () => {
	const token = 'EXAMPLE_TOKEN'
	localStorage.setItem(auth.localStorageKey, token)

	const user = buildUser()
	const book = buildBook()
	window.history.pushState({}, 'page title', `/book/${book.id}`)
	
	const originalFetch = window.fetch
	window.fetch = async (url, config) => {
		// console.log(config)
		if (/\/bootstrap$/.test(url)) {
			return Promise.resolve(
				{ok: true, json: async () => ({ user: {...user, token }, listItems: [] })})
		} else if (/\/list-items$/.test(url)) {
			return Promise.resolve({ok: true, json: async () => ({ listItems: [] })})
		} else if (url.endsWith(`/books/${book.id}`)) {
			return Promise.resolve({ok: true, json: async () => ({ book })})
		} return originalFetch(url, config)
	}

	render(<App />, { wrapper: AppProviders })
	waitFor(() => (
		expect(screen.queryByLabelText(/loading/i)).not.toBeInTheDocument())
	)
	// screen.debug()

	if (queryCache.isFetching) {
		throw new Error('Loading screen is gone before query resolved. Check the fetch logic!')
	}
	
	// 🐨 assert the book's info is in the document
	
})