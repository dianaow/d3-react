import React from 'react'
import { ButtonToolbar, Button, ToggleButtonGroup, ToggleButton } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { Link } from 'react-router-dom'

const Header = () => (
	<div className='dd-header'>
		<h1>FORMULA 1</h1>
	    <ButtonToolbar>
	    	<ToggleButtonGroup type="radio" name="options" defaultValue={2}>
	    		<LinkContainer to="/about">
					<ToggleButton value={1}>About</ToggleButton>
				</LinkContainer>
		    	<LinkContainer to="/laptimes-beeswarmplot">
					<ToggleButton value={2}>Laptimes v1</ToggleButton>
				</LinkContainer>
				<LinkContainer to="/laptimes-scatterplot">
				    <ToggleButton value={3}>Laptimes v2</ToggleButton>
				</LinkContainer>
				<LinkContainer to="/results-barchart">
				    <ToggleButton value={4}>Results</ToggleButton>
				</LinkContainer>
		    </ToggleButtonGroup>
	    </ButtonToolbar>
    </div>
)

export default Header
