import {renderHook, act} from '@testing-library/react-hooks'
import {useAsync} from '../hooks'

function deferred() {
  let resolve, reject
  const promise = new Promise((res, rej) => {
    resolve = res
    reject = rej
  })
  return {promise, resolve, reject}
}

test('calling run with a promise which resolves, data updated', async () => {
	const {promise, resolve} = deferred()
	const resolvedValue = {message: 'resolved!'}
	const initialState = {status: 'idle', data: null, error: null}
	const {result} = renderHook(() => {
		return useAsync(initialState)
	})

	const {run, reset, setData, setError} = result.current
	expect(result.current.data).toEqual(initialState.data)
	expect(result.current.status).toEqual(initialState.status)
	expect(result.current.error).toEqual(initialState.error)
	expect(result.current.isError).toBe(false)
	expect(result.current.isSuccess).toBe(false)
	expect(result.current.isIdle).toBe(true)
	expect(result.current.isLoading).toBe(false)
	expect(run).toEqual(expect.any(Function))
	expect(reset).toEqual(expect.any(Function))
	expect(setData).toEqual(expect.any(Function))
	expect(setError).toEqual(expect.any(Function))
	
	act(() => {
		run(promise)
	})
	
	expect(result.current.status).toBe('pending')
	expect(result.current.isLoading).toBe(true)
	
	await act(async () => {
		await resolve(resolvedValue)
	})

	expect(result.current.status).toBe('resolved')
	expect(result.current.isSuccess).toBe(true)
	expect(result.current.data).toBe(resolvedValue)
	
	act(() => {
		reset()
	})
	expect(result.current.status).toEqual(initialState.status)
	expect(result.current.isSuccess).toBe(false)
	expect(result.current.isIdle).toBe(true)
	expect(result.current.isLoading).toBe(false)
})

test('calling run with a promise which rejects, error updated', async () => {
	const {promise, reject} = deferred()
	const err = { message: 'Mocked error' }
	const {result} = renderHook(() => {
		return useAsync({})
	})
	act(() => {
		result.current.run(promise).catch(e => e)
	})

	await act(async () => {
		await reject(err)
	})

	expect(result.current.status).toBe('rejected')
	expect(result.current.data).toBe(null)
	expect(result.current.isError).toBe(true)
	expect(result.current.error).toBe(err)
})

test.todo('can specify an initial state')
// 💰 useAsync(customInitialState)

test.todo('can set the data')
// 💰 result.current.setData('whatever you want')

test.todo('can set the error')
// 💰 result.current.setError('whatever you want')

test.todo('No state updates happen if the component is unmounted while pending')
// 💰 const {result, unmount} = renderHook(...)
// 🐨 ensure that console.error is not called (React will call console.error if updates happen when unmounted)

test.todo('calling "run" without a promise results in an early error')
