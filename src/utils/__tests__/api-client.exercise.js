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

test(
  'when data is provided, it is stringified and sent with POST method', async () => {
    const mockedData = {
      user: 'someuser',
      password: 'somepassword'
    }
    let request
    const endpoint = 'endpoint'
    server.use(
      rest.post(`${apiUrl}/${endpoint}`, async (req, res, ctx) => {
        request = req
        return res(ctx.json({}))
      }),
    )

    await client(endpoint, { data: mockedData })
    expect(request.body).toEqual(mockedData)
    expect(request.method).toBe('POST')
    expect(request.headers.get('Content-type')).toBe('application/json')
  }
)

test('if response status is no successful, promise is rejected', async () => {
  const endpoint = 'endpoint'
  const errorResponse = {message: 'this is the response!'}
  let error
  server.use(
    rest.get(`${apiUrl}/${endpoint}`, async (req, res, ctx) => {
      return res(ctx.status(400), ctx.json(errorResponse))
    })
  )
  try {
    await client(endpoint)
  } catch (e) {
    error = e
  }
  expect(error).not.toBeFalsy()
  await expect(client(endpoint)).rejects.toEqual(errorResponse)
})

