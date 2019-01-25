import React,{ Component, Fragment } from 'react';
import { scaleBand, scaleLinear, scaleOrdinal } from 'd3-scale';
import { min, max, range } from 'd3-array';
import Labels from './Labels'
import Axis from '../../Shared-components/Axis'
import Legend from '../../Shared-components/driverLegend'
import { drawText } from '../../Shared-components/TextBuilder';
import { drawBar } from '../../Shared-components/RectBuilder';
import * as Const from '../../Shared-components/Constants';

class BarChart extends Component {

	render() {
		
		const data = this.props.qualData
		const raceData = this.props.raceData

		const wrapper = { width: Const.width * (7/8), height: 550}
		const margins = { top: 20, right: 0, bottom: 100, left: 60 }
		const svgDimensions = { width: wrapper.width - margins.left - margins.right, 
													 height: wrapper.height - margins.top - margins.bottom}


		const xScale = scaleBand()
											.padding(0.2)
											.domain(data.map(d => d.driverRef))
											.range([margins.left, svgDimensions.width])

		const yScale = scaleLinear()
										.domain([0, 24])
										.range([svgDimensions.height, margins.top])


		const yProps = {
			orient: 'Left',
			scale: yScale,
			translate: `translate(${margins.left}, 0)`,
			tickSize: 0,
			tickValues: range(0, 24+1, 2)
		}

		data.slice().forEach((d,i) => {
			data[i].x = xScale(d.driverRef)
			data[i].y = yScale(d.position)
			data[i].color = Const.colorScale(d.constructorRef)
			data[i].width = xScale.bandwidth()
			data[i].height = svgDimensions.height - yScale(d.position)
			//data[i].stroke = Const.toaddStroke(d.driverRef, d.season) ? 'black': 'grey'
		})	
		const bars = drawBar(data)
		
		raceData.slice().forEach((d,i) => {
			raceData[i].x = xScale(d.driverRef) + xScale.bandwidth()/2
			raceData[i].y = margins.top
		})	  
		const status = drawText(raceData, {value: 'status'})

		raceData.slice().forEach((d,i) => {
			raceData[i].y = svgDimensions.height + margins.bottom*(1/5)
		})     
		const drivers = drawText(raceData, {value: 'driverRef'})

		var idx = []
		raceData.map((d,i) => {
			if (d.status != ""){
				idx.push(d.driverRef)
			}
		})

		if (idx.length != 0) {
			var labels = <Labels data={idx} xScale={xScale} margins={margins} svgDimensions={svgDimensions}/>
		} else {
			var labels = <g></g>
		}

		return (
			<svg width={wrapper.width} height={wrapper.height}>
				<g transform={"translate(" + (margins.left) + "," + (margins.top) + ")"}>
					<Axis {...yProps} />
					{labels}
					{bars}
					{drivers}
					{status}
					<text 
						style={Const.textStyle}
						transform={"translate(" + 0 + "," + (svgDimensions.height/2 + margins.top) + ")rotate(-90)"}>
						Qualifying Position
					</text>
					<text 
						style={Const.textStyle}
						transform={"translate(" + (svgDimensions.width/2) + "," + (svgDimensions.height + margins.bottom*(3/5)) + ")"}>
						Race Finish Position
					</text>
					<text
						style={Const.topLegendStyle}
						transform={"translate(" + (margins.left) + "," + (svgDimensions.height + margins.bottom*(4/5)) + ")"}>
							ACC: Accident, COL: Collison, ENG: Engine, GEA: Gearbox, HYD: Hydraulic, POW: Power, RET: Retired, SPU: Spun Off, SUS: Suspension
					</text>
				</g>
			</svg>
		);
		
	}

};

export default BarChart;