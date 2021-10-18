import {loadDevTools} from './dev-tools/load'
import './bootstrap'
import * as React from 'react'
import ReactDOM from 'react-dom'
import {Profiler} from 'components/profiler'
import {App} from './app'
import {AppProviders} from './context'
import {formatDate} from 'utils/misc'

console.log(formatDate(Date.now()))

loadDevTools(() => {
  ReactDOM.render(
    <Profiler id="App Root" phases={['mount']}>
      <AppProviders>
        <App />
      </AppProviders>
    </Profiler>,
    document.getElementById('root'),
  )
})
