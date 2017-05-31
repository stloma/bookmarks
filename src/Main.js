import React from 'react'
import { render } from 'react-dom'
import Navigation from './Navigation'

const Container = () => {
	return ( <div><Navigation /></div> )
}

render (
	<Container />,
	document.getElementById('root')
	)
