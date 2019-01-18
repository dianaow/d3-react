import React, { Component } from 'react'

var DEFAULT_OPTIONS = {
	pre:'default_',
	fill:'black',
	fontSize:'11px',
	textAnchor:'middle',
	fontWeight:'normal',
	value:'id'
};  

function getOptionOrDefault(key, options, defaultOptions) {
    defaultOptions = defaultOptions || DEFAULT_OPTIONS;
    if (options && key in options) {
        return options[key];
    }
    return defaultOptions[key];
}

export const drawText = (data, options) => {
	
	var pre = getOptionOrDefault('pre', options);
	var fill = getOptionOrDefault('fill', options);
	var fontSize = getOptionOrDefault('fontSize', options);
	var fontWeight = getOptionOrDefault('fontWeight', options);
	var textAnchor = getOptionOrDefault('textAnchor', options);
	var value = getOptionOrDefault('value', options);
		
	return data.map((d,i) =>
	    <text
	      className={pre + i}
	      key={d.id}
	      x={d.x}
	      y={d.y}
	      fill={fill}
	      fontSize={fontSize}
	      fontWeight={fontWeight}
	      textAnchor={textAnchor}
	    >
	    	{d[value]}
	    </text>
	)
	 
}
