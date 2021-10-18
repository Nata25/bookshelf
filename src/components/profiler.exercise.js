import React from 'react'

function Profiler ({id, children}) {
	const callback = (...data) => {
		console.log(...data)
	}
	return (
		<React.Profiler id={id} onRender={callback}>
			{children}
		</React.Profiler>
	)
}

export default Profiler
