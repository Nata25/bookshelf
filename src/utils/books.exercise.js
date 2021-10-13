import {useQuery} from 'react-query'
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

function useBook (bookId, user) {
	const { data } = useQuery({
    queryKey: ['book', {bookId}],
    queryFn: () => client(`books/${bookId}`, {token: user.token})
  })
	return data?.book ?? loadingBook
}

function useBookSearch(query, user) {
	const result = useQuery({
    queryKey: ['bookSearch', {query}],
    queryFn: () => {
      return client(`books?query=${encodeURIComponent(query)}`, {
        token: user.token,
      }).then(data => data.books)
    }
  })
	return { ...result, books: result?.data ?? loadingBooks }
}

export {
	useBook,
	useBookSearch
}
