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
	await waitFor(() => (
		expect(screen.queryByLabelText(/loading/i)).not.toBeInTheDocument())
	)

	if (queryCache.isFetching) {
		throw new Error('Loading screen is gone before query resolved. Check the fetch logic!')
	}

	// Check for present UI elements
	expect(screen.getByRole('heading', {name: book.title })).toBeInTheDocument()
	expect(screen.getByRole('img', {name: book.title + ' book cover' })).toHaveAttribute('src', book.coverImageUrl)
	expect(screen.getByRole('heading', {name: book.title})).toHaveTextContent(book.title)
	expect(screen.getByText(book.author)).toBeInTheDocument()
	expect(screen.getByText(book.publisher)).toBeInTheDocument()
	expect(screen.getByText(book.synopsis)).toBeInTheDocument()
	expect(screen.getByRole('button', { name: /add/i})).toBeInTheDocument()

	// Check for spare UI elements
	expect(screen.queryByRole('button', { name: /remove/i})).not.toBeInTheDocument()
	expect(screen.queryByRole('button', { name: /mark as read/i})).not.toBeInTheDocument()
	expect(screen.queryByRole('button', { name: /unmark as read/i})).not.toBeInTheDocument()
	expect(screen.queryByLabelText(/date/i)).not.toBeInTheDocument()
	expect(screen.queryByRole('radio', { name: /star/i })).not.toBeInTheDocument()
	expect(screen.queryByRole('textbox', { name: /notes/i })).not.toBeInTheDocument()
	
})