import {useQuery, useMutation, queryCache} from 'react-query'
import {client} from 'utils/api-client'

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
	}, {
		onSettled: () => queryCache.invalidateQueries('list-items')
	})
	return create
}

function useUpdateListItem({token}) {
	const [mutate] = useMutation((data) => {
    return client(`list-items/${data.id}`, {
			method: 'PUT',
			token,
			data
		})
	}, {
    onSettled: () => queryCache.invalidateQueries('list-items')
  })
	return mutate
}

function useRemoveListItem ({token}) {
	const [remove] = useMutation((id) => {
    return client(`list-items/${id}`, {
			token,
			method: 'DELETE'
		})
	}, {
      onSettled: () => queryCache.invalidateQueries('list-items')
	})
	return remove
}

export {
	useListItems,
	useListItem,
	useCreateListItem,
	useUpdateListItem,
	useRemoveListItem
}
