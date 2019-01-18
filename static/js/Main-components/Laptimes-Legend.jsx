import React, { Component, Fragment } from 'react'
import * as Const from '../Shared-components/Constants';
import { drawCircle, drawCircleInteractive } from '../Shared-components/CircleBuilder';
import { drawText } from '../Shared-components/TextBuilder';

export default class Legend extends Component {
	
	render() {
    	
    	const data  = this.props.data
		
		data.forEach((d,i) => {
			data[i].x = (i+1)*62
			data[i].y = 10
			data[i].color = Const.colorScale(d.constructorRef)
        	data[i].stroke = Const.toaddStroke(d.driverRef, d.season) ? 'black': 'grey'
		})
		const dots = drawCircle(data, {pre:'dots_'})
		
		data.forEach((d,i) => {
			data[i].y = 30
		})
		const labels = drawText(data, {pre:'label_', value:'driverRef'})
		
	    return (
		    <svg className='legend' width={Const.wrapper.width} height={Const.wrapper.height*(1/10)}>
	          {dots}
	          {labels}
	        </svg>
	    )
	}

}