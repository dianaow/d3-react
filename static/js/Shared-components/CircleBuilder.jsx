import React, { Component } from 'react'

export const drawCircle = (data, options) => {
    return data.map( d =>
	  <circle
	  	className={options.pre + d.driverRef}
	    key={d.id}
	    cx={d.x}
	    cy={d.y}
	    r={options.radius}
	    fill={d.color}
	    stroke={d.stroke}
	    strokeWidth={options.strokeWidth}
	    opacity={options.opacity}
	  />
	)
}

export const drawCircleInteractive = (data, options, onMouseOverCallback, onMouseOutCallback) => {
    return data.map( d =>
	  <circle
	  	className={options.pre + d.driverRef}
	    key={d.id}
	    cx={d.x}
	    cy={d.y}
	    r={options.radius}
	    fill={d.color}
	    stroke={d.stroke}
	    strokeWidth={options.strokeWidth}
	    opacity={options.opacity}
	    onMouseOver={() => onMouseOverCallback(d)}
    	onMouseOut={() => onMouseOutCallback(d)}
	  />
	)
}