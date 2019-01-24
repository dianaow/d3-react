import React, { Component } from 'react'
import * as Const from '../../Shared-components/Constants';
import { drawCircleInteractive } from '../../Shared-components/CircleBuilder';

export default class Dots extends Component {

	render() {
		const { data, tooltip, onMouseOverCallback, onMouseOutCallback } = this.props

		var name = tooltip.data.key
		var selectedData = data.filter(d => d.driverRef === name)
		var nonselectedData = data.filter(d => d.driverRef !== name)

		const selectedDots = drawCircleInteractive(selectedData, {pre:'scatter_', radius:6, strokeWidth:1, opacity:1}, onMouseOverCallback, onMouseOutCallback)

		if(tooltip.display==true){
			var dots = drawCircleInteractive(nonselectedData, {pre:'scatter_', radius:3, strokeWidth:1, opacity:0.5}, onMouseOverCallback, onMouseOutCallback)
		} else {
			var dots = drawCircleInteractive(nonselectedData, {pre:'scatter_', radius:3, strokeWidth:1, opacity:1}, onMouseOverCallback, onMouseOutCallback)
		}

		return (
			<g>
			{dots}
			{selectedDots}
			</g>
		)
	}
}