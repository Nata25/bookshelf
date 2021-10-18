import React from 'react'
import {client} from 'utils/api-client'

function Profiler ({id, phases, children}) {
	if (!phases || phases.includes('mount')) console.log(`Profiler for ${id} init.`)

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
