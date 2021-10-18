import {server, rest} from 'test/server'
import {client} from '../api-client'

const apiUrl = process.env.REACT_APP_API_URL

beforeAll(() => {
  server.listen()
})

afterAll(() => {
  server.close()
})

afterEach(() => {
  server.resetHandlers()
})

test('calls fetch at the endpoint with the arguments for GET requests', async () => {
  const endpoint = 'test-endpoint'
  const mockResult = {mockValue: 'VALUE'}
  server.use(
    rest.get(`${apiUrl}/${endpoint}`, async (req, res, ctx) => {
      return res(ctx.json(mockResult))
    }),
  )

  const data = await client(endpoint)
  expect(data).toEqual(mockResult)
})

test('adds auth token when a token is provided', async () => {
  const token = 'anything'
  let request
  const endpoint = 'endpoint'
  server.use(
    rest.get(`${apiUrl}/${endpoint}`, async (req, res, ctx) => {
      request = req
      return res(ctx.json({}))
    }),
  )
  await client(endpoint, { token })
  expect(request.headers.get('Authorization')).toBe(`Bearer ${token}`)
})
    
test('allows for config overrides for headers', async () => {
  const mode = 'same-origin'
  const headers = {mode}
  let request
  const endpoint = 'endpoint'
  server.use(
    rest.get(`${apiUrl}/${endpoint}`, async (req, res, ctx) => {
      request = req
      return res(ctx.json({}))
    }),
  )
  await client(endpoint, { headers })
  expect(request.headers.get('mode')).toBe(mode)
})

test('allows for config overrides for request method', async () => {
  let request
  const endpoint = 'endpoint'
  const method = 'PUT'
  server.use(
    rest.put(`${apiUrl}/${endpoint}`, async (req, res, ctx) => {
      request = req
      return res(ctx.json({}))
    }),
  )
  await client(endpoint, { method })
  expect(request.method).toBe(method)
})

test.todo(
  'when data is provided, it is stringified and the method defaults to POST',
)
// 🐨 create a mock data object
// 🐨 create a server handler very similar to the previous ones to handle the post request
//    💰 Use rest.post instead of rest.get like we've been doing so far
// 🐨 call client with an endpoint and an object with the data
//    💰 client(endpoint, {data})
// 🐨 verify the request.body is equal to the mock data object you passed
