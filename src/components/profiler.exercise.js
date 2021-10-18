import React from 'react'
import {client} from 'utils/api-client'

function Profiler ({id, phases, children}) {
	const callback = (...data) => {
		const [id, phase, actualDuration, baseDuration, startTime, commitTime] = data
		if (!phases || phases.includes(phase)) {
			client('profile', {data: {
				id, phase, actualDuration, baseDuration, startTime, commitTime
			}})
		}
	}
	return (
		<React.Profiler id={id} onRender={callback}>
			{children}
		</React.Profiler>
	)
}

export {Profiler}
