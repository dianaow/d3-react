import React, { Component, Fragment } from 'react'
import * as Const from '../Shared-components/Constants';
import { drawCircle, drawCircleInteractive } from '../Shared-components/CircleBuilder';

const wrapper = Const.wrapper

export default class Legend extends Component {
	
	render() {
    	
    	const data  = this.props.data
		
		data.forEach((d,i) => {
			data[i].x = (i+1)*62
			data[i].y = 60
			data[i].color = Const.colorScale(data.filter(c=> (c.driverRef == d.driverRef) && (c.season == d.season) && (c.raceName == d.raceName))[0].constructorRef)
        	data[i].stroke = Const.toaddStroke(d.driverRef, d.season) ? 'black': 'white'
		})
		
		const dots = drawCircle(data, {pre:'dots_', radius:10, strokeWidth:3, opacity:1})
		
    	const labels = (
	      data.map((d,i) =>
	        <text
	          className={'label_' + d.driverRef}
	          key={d.id}
	          x={(i+1)*62}
	          y='80'
	          fill='black'
	          style={{'fontSize': '11px', 'textAnchor': 'middle'}}
	        >
	        	{Const.formatDriverNames(d.driverRef)}
	        </text>
	      )
	    )
	     
	    return (
		    <svg className='legend' width={wrapper.width} height={wrapper.height/3}>
	          {dots}
	          {labels}
	        </svg>
	    )
	}

}