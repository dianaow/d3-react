import React, { Component } from 'react'

var DEFAULT_OPTIONS = {
	pre: 'default_',
	radius:8,
	strokeWidth:3,
	opacity:1
};  

function getOptionOrDefault(key, options, defaultOptions) {
    defaultOptions = defaultOptions || DEFAULT_OPTIONS;
    if (options && key in options) {
        return options[key];
    }
    return defaultOptions[key];
}

export const drawCircle = (data, options) => {
	
  var strokeWidth = getOptionOrDefault('strokeWidth', options);
  var radius = getOptionOrDefault('radius', options);
  var opacity = getOptionOrDefault('opacity', options);
  var pre = getOptionOrDefault('pre', options);
    
  return data.map((d,i) =>
	  <circle
	  	className={pre + i}
	    key={d.id}
	    cx={d.x}
	    cy={d.y}
	    r={radius}
	    fill={d.color}
	    stroke={d.stroke}
	    strokeWidth={strokeWidth}
	    opacity={opacity}
	  />
	)
}

export const drawCircleInteractive = (data, options, onMouseOverCallback, onMouseOutCallback) => {
	
  var strokeWidth = getOptionOrDefault('strokeWidth', options);
  var radius = getOptionOrDefault('radius', options);
  var opacity = getOptionOrDefault('opacity', options);
  var pre = getOptionOrDefault('pre', options);
  
  return data.map((d,i) =>
	  <circle
	  	className={pre + i}
	    key={d.id}
	    cx={d.x}
	    cy={d.y}
	    r={radius}
	    fill={d.color}
	    stroke={d.stroke}
	    strokeWidth={strokeWidth}
	    opacity={opacity}
	    onMouseOver={() => onMouseOverCallback(d)}
    	onMouseOut={() => onMouseOutCallback(d)}
	  />
	)
}