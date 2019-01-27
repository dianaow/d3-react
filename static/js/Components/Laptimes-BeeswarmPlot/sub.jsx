import React,{ Component} from 'react';
import { scaleBand, scaleLinear, scaleOrdinal } from 'd3-scale';
import { selectAll } from 'd3-selection'
import { min, max, range } from 'd3-array';
import * as d3 from 'd3-force';
import Axis from '../../Shared-components/Axis'
import * as Const from '../../Shared-components/Constants';
import ForceGraph from './ForceGraph'

class BeeswarmPlot extends Component {

	constructor(props) {
		super(props)

		this.wrapper = { width: Const.width, height: Const.height}
		this.margins = { top: 20, right: 0, bottom: 0, left: 100 }
		this.svgDimensions = { width: this.wrapper.width - this.margins.left - this.margins.right, 
													 height: this.wrapper.height - this.margins.top - this.margins.bottom}

		this.xScale = scaleLinear()
										.rangeRound([0, this.svgDimensions.width*4])

		this.yScale = scaleBand()
										.rangeRound([this.svgDimensions.height, 0])
                    .padding(1)

	}

	render() {
		
		const {lapsData, resultsData} = this.props

    var min_time = Const.round5(min(lapsData.map(d=>d.time)))
    var max_time = Const.round5(max(lapsData.map(d=>d.time)))
    if(max_time>150){
      max_time=150
    }
    this.xScale.domain([min_time-5, max_time])
		this.yScale.domain(Const.teamColors.map(d=>d.key))

		const xProps = {
			orient: 'Bottom',
			scale: this.xScale,
			translate: `translate(0, ${this.svgDimensions.height})`,
      tickSize: this.svgDimensions.height,
			tickValues: range(min_time-5, max_time+1, 5)
		}

		const yProps = {
			orient: 'Left',
			scale: this.yScale,
			translate: `translate(${this.margins.left}, 0)`,
			tickSize: -10,
			tickValues: this.yScale.domain()
		}

		const lapsData_new = lapsData.map(d => {
			return {
				id: d.id,
				//color: Const.driverColors.filter(c => (c.driverRef == d.driverRef) && (c.season == d.season))[0].value, Note: using driverColors list may not be accurate, because recent seasons have shown that there may be mid-season driver changes
				color: Const.colorScale(resultsData.filter(c=> (c.driverRef == d.driverRef) && (c.season == d.season) && (c.raceName == d.raceName))[0].constructorRef),
				stroke: Const.toaddStroke(d.driverRef, d.season) ? 'black': 'white',
				x: this.xScale(d.time),
				y: this.yScale(resultsData.filter(c=> (c.driverRef == d.driverRef) && (c.season == d.season) && (c.raceName == d.raceName))[0].constructorRef),
				driverRef: d.driverRef,
				time: d.time
			}
		})
		//console.log(lapsData_new)
		
		const chart = {
			width: this.svgDimensions.width,
			height: this.wrapper.height,
			overflowX: 'scroll',
			float:'left'
		}

		const wrap = {
			minWidth: this.wrapper.width,
			height: this.wrapper.height
		}

		return (
			<div style={wrap}>
				<div id ='yaxis' style={{float:'left'}}>
					<svg width={this.margins.left} height={this.wrapper.height}>
						<Axis {...yProps} /> 
					</svg>
				</div>
        <div id='chart' style={chart}>
          <svg width={this.wrapper.width*4} height={this.wrapper.height}>
            <g style={{overflow:"auto"}} transform={"translate(" + 20 + "," + 0 + ")"}>
              <ForceGraph nodes={lapsData_new}/>
              <Axis {...xProps} />
            </g>
          </svg>
        </div>
        <div style={Const.textStyle} width={this.svgDimensions.width} height={20}>
          <span style={{paddingBottom: 20}}>Time to complete a lap(in sec)</span>
        </div>
			</div>
		)

	}

}

export default BeeswarmPlot;