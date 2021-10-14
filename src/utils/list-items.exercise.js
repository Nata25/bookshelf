import {useQuery, useMutation, queryCache} from 'react-query'
import {client} from 'utils/api-client'
import {setQueryDataForBook} from './books'

const onSettled = () => queryCache.invalidateQueries('list-items')
const onSuccess = (data) => {
	data.forEach((item) => setQueryDataForBook(item.bookId, item.book))
}
const onError = (err, newTodo, rollback) => {
	if (typeof rollback === 'function') rollback()
}
const onMutateDefault = () => {
	queryCache.cancelQueries('list-items')
	return queryCache.getQueryData('list-items')
}

function useListItems ({token}) {
	const { data } = useQuery({
    queryKey: 'list-items',
    queryFn: () => client('list-items', {token}).then(data => data.listItems),
		config: {onSuccess}
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
	}, {
		...options,
		onMutate (data) {
			const previousList = onMutateDefault()
			queryCache.setQueryData('list-items', oldList => {
				return oldList.map(li => li.id === data.id ? { ...li, ...data } : li)
			})
			return () => queryCache.setQueryData('list-items', previousList)
		},
		onSettled,
		onError
	})
}

function useRemoveListItem ({token}, options) {
	return useMutation((id) => {
    return client(`list-items/${id}`, {
			token,
			method: 'DELETE'
		})
	}, {
		...options,
		onMutate(removedItem) {
			const previousItems = queryCache.getQueryData('list-items')

			queryCache.setQueryData('list-items', old => {
				return old.filter(item => item.id !== removedItem.id)
			})

			return () => queryCache.setQueryData('list-items', previousItems)
		},
		onSettled,
		onError
	})
}

export {
	useListItems,
	useListItem,
	useCreateListItem,
	useUpdateListItem,
	useRemoveListItem
}
