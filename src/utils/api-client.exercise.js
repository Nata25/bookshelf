const apiURL = process.env.REACT_APP_API_URL

function client(endpoint, {token, headers, data, ...customConfig} = {}) {
  const customHeaders = { ...headers }
  let body
  if (token) {
    Object.assign(customHeaders, {
      Authorization: `Bearer ${token}`
    })
  }
  if (data) {
    body = JSON.stringify(data)
    Object.assign(customHeaders, {
      'Content-Type': 'application/json'
    })
  }
  const config = {
    method: data ? 'POST' : 'GET',
    headers: { ...customHeaders },
    body,
    ...customConfig
  }

  return window.fetch(`${apiURL}/${endpoint}`, config).then(async response => {
    const data = await response.json()
    if (response.ok) {
      return data
    } else {
      return Promise.reject(data)
    }
  })
}

export {client}
