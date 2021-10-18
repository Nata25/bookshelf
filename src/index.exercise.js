import {loadDevTools} from './dev-tools/load'
import './bootstrap'
import * as React from 'react'
import ReactDOM from 'react-dom'
import {App} from './app'
import {AppProviders} from './context'
import Profiler from 'components/profiler.exercise'

loadDevTools(() => {
  ReactDOM.render(
    <AppProviders>
      <Profiler id="Root Profiler">
        <App />
      </Profiler>
    </AppProviders>,
    document.getElementById('root'),
  )
})
