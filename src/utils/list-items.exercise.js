import {useQuery, useMutation, queryCache} from 'react-query'
import {client} from 'utils/api-client'

const onSettled = () => queryCache.invalidateQueries('list-items')

function useListItems ({token}) {
	const { data } = useQuery({
    queryKey: 'list-items',
    queryFn: () => client('list-items', {token}).then(data => data.listItems)
  })
	return data
}

function useListItem(user, bookId) {
	const listItems = useListItems(user)
	return listItems?.find(li => li.bookId === bookId) ?? null
}

function useCreateListItem({token}, options) {
	return useMutation(({bookId}) => {
    return client('list-items', {
			token,
			data: { bookId }
		})
	}, { onSettled, ...options })
}

function useUpdateListItem({token}, options) {
	return useMutation((data) => {
    return client(`list-items/${data.id}`, {
			method: 'PUT',
			token,
			data
		})
	}, { onSettled, ...options })
}

function useRemoveListItem ({token}, options) {
	return useMutation((id) => {
    return client(`list-items/${id}`, {
			token,
			method: 'DELETE'
		})
	}, { onSettled, ...options })
}

export {
	useListItems,
	useListItem,
	useCreateListItem,
	useUpdateListItem,
	useRemoveListItem
}
