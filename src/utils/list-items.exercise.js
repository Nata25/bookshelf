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

function useCreateListItem({token}) {
	const [create] = useMutation(({bookId}) => {
    return client('list-items', {
			token,
			data: { bookId }
		})
	}, { onSettled })
	return create
}

function useUpdateListItem({token}) {
	const result = useMutation((data) => {
    return client(`list-items/${data.id}`, {
			method: 'PUT',
			token,
			data
		})
	}, { onSettled })
	return result
}

function useRemoveListItem ({token}) {
	const [remove] = useMutation((id) => {
    return client(`list-items/${id}`, {
			token,
			method: 'DELETE'
		})
	}, { onSettled })
	return remove
}

export {
	useListItems,
	useListItem,
	useCreateListItem,
	useUpdateListItem,
	useRemoveListItem
}
