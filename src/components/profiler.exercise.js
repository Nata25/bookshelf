import React from 'react'
import {client} from 'utils/api-client'

function Profiler ({id, children}) {
	const callback = (...data) => {
		const [id, phase, actualDuration, baseDuration, startTime, commitTime] = data
		client('profile', {data: {
			id, phase, actualDuration, baseDuration, startTime, commitTime
		}})
	}
	return (
		<React.Profiler id={id} onRender={callback}>
			{children}
		</React.Profiler>
	)
}

export default Profiler
