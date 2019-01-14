import React from 'react'
import { ButtonToolbar, Button, ToggleButtonGroup, ToggleButton } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { Link } from 'react-router-dom'

const Header = () => (
	<div className='dd-header'>
		<h1>FORMULA 1</h1>
	    <ButtonToolbar>
	    	<ToggleButtonGroup type="radio" name="options" defaultValue={6}>
	    		<LinkContainer to="/about">
					<ToggleButton value={1}>About</ToggleButton>
				</LinkContainer>
		    	<LinkContainer to="/laptimes-beeswarmplot">
					<ToggleButton value={2}>Beeswarmplot: Laptimes</ToggleButton>
				</LinkContainer>
				<LinkContainer to="/laptimes-scatterplot">
				    <ToggleButton value={3}>Scatterplot: Laptimes</ToggleButton>
				</LinkContainer>
				<LinkContainer to="/results-barchart">
				    <ToggleButton value={4}>Bar Chart: Race vs Qual Results</ToggleButton>
				</LinkContainer>
				<LinkContainer to="/animation">
				    <ToggleButton value={5}>Animation: Yearly Results</ToggleButton>
				</LinkContainer>
			    <LinkContainer to="/bubbles">
				    <ToggleButton value={6}>Force Layout: Race Results</ToggleButton>
				</LinkContainer>
		    </ToggleButtonGroup>
	    </ButtonToolbar>
    </div>
)

export default Header
