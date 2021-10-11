/** @jsx jsx */
import {jsx} from '@emotion/core'
import React from 'react'
import './bootstrap'
import Tooltip from '@reach/tooltip'
import {FaSearch} from 'react-icons/fa'
import {Input, BookListUL, Spinner} from './components/lib'
import {BookRow} from './components/book-row'
import * as colors from 'styles/colors'
import {client} from './utils/api-client'

function DiscoverBooksScreen() {
  const [status, setStatus] = React.useState('idle')
  const [data, setData] = React.useState([])
  const [query, setQuery] = React.useState('')
  const [queried, setQueried] = React.useState(false)
  const [error, setError] = React.useState(null)

  React.useEffect(() => {
    const getBooks = async (q) => {
      setStatus('loading')
      try {
        const data = await client(`books?query=${encodeURIComponent(q)}`)
        if (data) {
          setStatus('success')
          setData(data)
        }
      } catch (e) {
        setStatus('error')
        setError(e)
      }
    }
    if (!queried) return
    getBooks(query)
  }, [query, queried])


  function handleSearchSubmit(event) {
    event.preventDefault()
    setQueried(true)
    const { search } = event.target.elements
    setQuery(search.value)
  }

  return (
    <div
      css={{maxWidth: 800, margin: 'auto', width: '90vw', padding: '40px 0'}}
    >
      <form onSubmit={handleSearchSubmit}>
        <Input
          placeholder="Search books..."
          id="search"
          css={{width: '100%'}}
        />
        <Tooltip label="Search Books">
          <label htmlFor="search">
            <button
              type="submit"
              css={{
                border: '0',
                position: 'relative',
                marginLeft: '-35px',
                background: 'transparent',
              }}
            >
              {status === 'loading' ? <Spinner /> : <FaSearch aria-label="search" />}
            </button>
          </label>
        </Tooltip>
      </form>

      {
        (status === 'error' && error) ? (
          <div css={{color: colors.danger}}>
            <p>There was an error:</p>
            {console.log(error)}
            <pre>{error.message}</pre>
          </div>
        ) : null
      }

      {status === 'success' ? (
        data?.books?.length ? (
          <BookListUL css={{marginTop: 20}}>
            {data.books.map(book => (
              <li key={book.id} aria-label={book.title}>
                <BookRow key={book.id} book={book} />
              </li>
            ))}
          </BookListUL>
        ) : (
          <p>No books found. Try another search.</p>
        )
      ) : null}
    </div>
  )
}

export {DiscoverBooksScreen}
