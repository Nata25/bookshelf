import {useQuery, queryCache} from 'react-query'
import {client} from 'utils/api-client'
import bookPlaceholderSvg from 'assets/book-placeholder.svg'

const loadingBook = {
  title: 'Loading...',
  author: 'loading...',
  coverImageUrl: bookPlaceholderSvg,
  publisher: 'Loading Publishing',
  synopsis: 'Loading...',
  loadingBook: true,
}

const loadingBooks = Array.from({length: 10}, (v, index) => ({
  id: `loading-book-${index}`,
  ...loadingBook,
}))

const getBookSearchQueryConfig = ({ query, token }) => {
	return {
		queryKey: ['bookSearch', {query}],
		queryFn: () => client(`books?query=${encodeURIComponent(query)}`, {token}).then(data => data.books)
	}
}

async function refetchBookSearchQuery (user) {
	queryCache.removeQueries('bookSearch')
	await queryCache.prefetchQuery(
		getBookSearchQueryConfig({ query: '', token: user.token })
	)
}

function useBookSearch(query, user) {
	const result = useQuery(
		{ ...getBookSearchQueryConfig({ query, token: user.token }),
		config: {
			onSuccess(data) {
				data.forEach(book => setQueryDataForBook(book.id, book))
			}
		}
	})
	return { ...result, books: result?.data ?? loadingBooks }
}

function useBook (bookId, user) {
	const { data } = useQuery({
    queryKey: ['book', {bookId}],
    queryFn: () => client(`books/${bookId}`, {token: user.token})
  })
	return data?.book ?? loadingBook
}

function setQueryDataForBook (bookId, book) {
	queryCache.setQueryData(['book', {bookId}], { book })
}

export {
	useBook,
	useBookSearch,
	refetchBookSearchQuery,
	setQueryDataForBook
}
