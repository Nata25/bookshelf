import React from 'react'
import {client} from 'utils/api-client'

function Profiler ({id, phases, metadata, ...props}) {
	if (phases && phases.includes('mount')) console.log(`Profiler for ${id} init.`)
	const queue = React.useRef([])
	const sendData = (data) => {
		client('profile', {data})
	}

	const callback = (...data) => {
		const [id, phase, actualDuration, baseDuration, startTime, commitTime, interactions] = data
		if (!phases || phases.includes(phase)) {
			const profilerData = {
				metadata,
				id,
				phase,
				actualDuration,
				baseDuration,
				startTime,
				commitTime,
				interactions: [...interactions]
			}
			queue.current.push(profilerData)
		}
	}

	React.useEffect(() => {
		const interval = setInterval(() => {
			if (queue.current.length) {
				const data = [...queue.current]
				sendData(data)
				queue.current = []
			}
		}, 5000)
		return () => { clearInterval(interval)}
	}, [])

	return (
		<React.Profiler id={id} onRender={callback} {...props}/>
	)
}

export {Profiler}
