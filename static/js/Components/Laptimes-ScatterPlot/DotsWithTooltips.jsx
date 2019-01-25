import React, { Component } from 'react'
import * as Const from '../../Shared-components/Constants';
import { drawCircleInteractive } from '../../Shared-components/CircleBuilder';

var DEFAULT_OPTIONS = {
  pre: 'default_',
  strokeWidth:1,
  hover_radius:5,
  non_hover_radius:3,
  hover_opacity:0.5
};  

function getOptionOrDefault(key, options, defaultOptions) {
    defaultOptions = defaultOptions || DEFAULT_OPTIONS;
    if (options && key in options) {
        return options[key];
    }
    return defaultOptions[key];
}

export default class Dots extends Component {


	render() {
		const { data, tooltip, onMouseOverCallback, onMouseOutCallback, options } = this.props
    console.log(this.props.options)
    var pre = getOptionOrDefault('pre', options);
    var strokeWidth = getOptionOrDefault('strokeWidth', options);
    var hover_radius = getOptionOrDefault('hover_radius', options);
    var non_hover_radius = getOptionOrDefault('non_hover_radius', options);
    var hover_opacity = getOptionOrDefault('hover_opacity', options);
    
		var name = tooltip.data.key
		var selectedData = data.filter(d => d.driverRef === name)
		var nonselectedData = data.filter(d => d.driverRef !== name)

		const selectedDots = drawCircleInteractive(selectedData, {pre:pre, radius:hover_radius, strokeWidth:strokeWidth, opacity:1}, onMouseOverCallback, onMouseOutCallback)

		if(tooltip.display==true){
			var dots = drawCircleInteractive(nonselectedData, {pre:pre, radius:non_hover_radius, strokeWidth:strokeWidth, opacity:hover_opacity}, onMouseOverCallback, onMouseOutCallback)
		} else {
			var dots = drawCircleInteractive(nonselectedData, {pre:pre, radius:non_hover_radius, strokeWidth:strokeWidth, opacity:1}, onMouseOverCallback, onMouseOutCallback)
		}

		return (
			<g>
			{dots}
			{selectedDots}
			</g>
		)
	}
}