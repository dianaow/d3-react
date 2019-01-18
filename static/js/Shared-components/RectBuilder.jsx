import React, { Component } from 'react'

var DEFAULT_OPTIONS = {
	pre: 'default_',
	width:10,
	height:10,
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

export const drawRect = (data, options) => {
	
	var width = getOptionOrDefault('width', options);
    var height = getOptionOrDefault('height', options);
    var opacity = getOptionOrDefault('opacity', options);
    var pre = getOptionOrDefault('pre', options);
    
    return data.map((d,i) =>
	  <rect
	  	className={pre + i}
	    key={d.id}
	    x={d.x}
	    y={d.y}
	    width={width}
	    height={height}
	    fill={d.color}
	    opacity={opacity}
	  />
	)
}

export const drawBar = (data, options) => {
	
	var strokeWidth = getOptionOrDefault('strokeWidth', options);
    var opacity = getOptionOrDefault('opacity', options);
    var pre = getOptionOrDefault('pre', options);
    
    return data.map((d,i) =>
	  <rect
	  	className={pre + i}
	    key={d.id}
	    x={d.x}
	    y={d.y}
	    width={d.width}
	    height={d.height}
	    fill={d.color}
	    stroke={d.stroke}
	    strokeWidth={strokeWidth}
	    opacity={opacity}
	  />
	)
}
