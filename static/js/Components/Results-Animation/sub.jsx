import React,{ Component, Fragment } from 'react';
import NodeGroup from "react-move/NodeGroup";
import { scaleBand, scaleLinear, scaleOrdinal, scaleQuantize } from 'd3-scale';
import { min, max, range, sum, permute, ticks } from 'd3-array';
import { schemeRdYlBu, schemePiYG } from 'd3-scale-chromatic';
import { select, selectAll } from 'd3-selection';
import { easeCubicInOut, easeLinear } from 'd3-ease';
import { timer, interval } from 'd3-timer';
import * as d3Collection from 'd3-collection';
import * as d3 from 'd3-shape';
import Loading from '../../Shared-components/Loading';
import Header from '../../Shared-components/Header'
import Axis from '../../Shared-components/Axis'
import * as Const from '../../Shared-components/Constants';
import { drawText } from '../../Shared-components/TextBuilder';
import { drawRect, drawBar } from '../../Shared-components/RectBuilder';

class BarChart extends Component {

	constructor(props) {
		super(props)

		this.wrapper = { width: Const.width, height: Const.height }
		this.legendRight = { width: 100, height: 400 }
		this.axisSpace = { width: 30, height: 30 }
		this.margins = { top: 20, right: 20, bottom: 20, left: 30 }
		this.svgDimensions = { width: this.wrapper.width - this.axisSpace.width - this.margins.left - this.margins.right, height: this.wrapper.height - this.axisSpace.height - this.margins.top - this.margins.bottom }

		this.xScale = scaleBand()
										.padding(0.2)
										.range([this.margins.left, this.svgDimensions.width])

		this.yScale = scaleLinear()
										.range([this.svgDimensions.height, this.margins.top])
										.domain([0, 400])

		this.state = {
			stackedData_flat: [],
			stackedData: [],
			races: [],
			xProps: [],
			yProps: [],
			counter: 0
		}

	}

	componentDidMount() {
		this.restructureData(this.props.raceData)
		this.initIteration()
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.props !== prevProps) {
			this.state.counter = 0
			this.restructureData(this.props.raceData)
			this.initIteration()
		}
	}

	initIteration = () => {
		 var Timer = interval(t => {
			if (this.state.counter == this.racesList.length) {
				Timer.stop()
			} else {
				//console.log('one iteration')
				this.showRaceOnebyOne()
			}
		 }, 1500)

	}

	restructureData = (data) => {

		// Create a scale of race-color label pairings (list of races may change year on year, hence i choose to place it within this function instead of constructor)
		this.racesList = this.props.racesList
		this.color = scaleOrdinal()
										.domain(this.racesList)
										.range(schemeRdYlBu[11].concat(schemePiYG[11]))

		// Prep races data for legend render
		var races = []
		this.racesList.map((d,i) => races.push({
			x : 0,
			y : i * 20,
			color : this.color(d),
			raceName : d 
		}))

		// Nest data with driver set as key
		var data1 =  d3Collection.nest()
										.key(d => d.driverRef)
										.entries(data)
 
		// Find list of drivers participating in season 
		// This include drivers signed-on as official drivers and reserve drivers who participared in one/some races only. A better way would be to retrieve list of driver participants of each race )
		var driverList = data1.map(d => d.key)

		// Ensure that all drivers have the same sort arrangement of races
		data1 = data1.map(d => d.values.sort(Const.sortOn("roundId")))
		//console.log(data1)
		
		// Construct an array of arrays where dataNew[i][j] is the point achived for driverRef i and raceName j.
		// Bug fix: If a driver in driverList has not participated in a race, points = NaN. Impute as 0.
		var dataNew = []
		var eachPoints = []
		data1.map((D,I) => {
			var oneDriverRace = Array.from(Array(this.racesList.length), () => 0)
			D.map((d,i) => {
				oneDriverRace[d.roundId-1] = d.points
			})
			dataNew.push(oneDriverRace)
		})
		//console.log(dataNew)

		// Fix the order arrangement of drivers
		var order = range(data1.length).sort((i, j) => driverList[j] - driverList[i])

		// Constructs a stack layout based on data 
		// d3's permute ensures each individual array is sorted in the same order. Important to ensure sort arrangement is aligned for all parameters before stack layout)
		var stackedData = Object.assign(d3.stack().keys(range(this.racesList.length))(permute(dataNew, order)), {
			keys: this.racesList,
			ids: this.racesList.map(R => driverList.map(P => `${R}_${P}`)),
			driverRef: driverList
		})

		stackedData.forEach((d,i) =>
			stackedData.driverRef.forEach((D,I) => {
				stackedData[i][I].key = stackedData.ids[i][I]
				stackedData[i][I].color = this.color(stackedData.keys[i]) 
			})
		)
		//console.log(stackedData)

		this.setState({stackedData, races})
	}

	showRaceOnebyOne = () => {
		// Filter full race results to only include races up until that iteration (eg. iteration1: race1, iteration2: race1,race2)
		let acc = this.state.stackedData.filter(d => d.index <= this.state.counter)
		let flattened = acc.reduce(function(a, b) {
				return a.concat(b);
		}, []);
		//console.log(flattened)

		// Filter full race results to only include race of that iteration (eg. iteration2: race2)
		// Retrieve the sort order of drivers in descending order of points achieved in a particular race
		let tmp = this.state.stackedData.filter(d => d.index == this.state.counter)
		tmp[0].sort((a, b) => { return (b[1]) - (a[1]) })
		var sortOrder = tmp[0].map((d,i) => d.key.split("_").pop())
		//console.log(sortOrder)

		// Update x-scale based on new sort order of drivers
		this.xScale.domain(sortOrder)

		// Update the coordinates for bar render
		flattened.forEach((d,i) => {
			flattened[i].x = this.xScale(d.key.split("_").pop())
			flattened[i].y = ( d[1] ? this.yScale(d[1]) : this.yScale(0) ) 
			flattened[i].width = this.xScale.bandwidth()
			flattened[i].height = ( d[0] ? this.yScale(d[0]) : this.yScale(0) ) - ( d[1] ? this.yScale(d[1]) : this.yScale(0) )
		})
		//console.log(flattened)

		// Update x-axis properties based on new driver sort
		const xProps = [{
			orient: 'Bottom',
			scale: this.xScale,
			translate: `translate(0, ${this.svgDimensions.height})`,
			tickSize: -10
		}]

		// No need for y-axis properties to be updated. (Placing it in this function rather than in constructor, in case it may be dependent on other functions)
		const yProps = [{
			orient: 'Left',
			scale: this.yScale,
			translate: `translate(${this.margins.left}, 0)`,
			tickSize: -10,
			tickValues: range(0, 400+1, 25)
			//tickValues: ticks(0, max(stackedData.totals), 10)
		}]

		this.setState({stackedData_flat: flattened, counter: this.state.counter+1, xProps: xProps, yProps: yProps})

	}

	render() {

		const {stackedData_flat, races, xProps, yProps} = this.state

		if ((stackedData_flat.length != 0) & (xProps.length != 0) & (yProps.length != 0) & (races.length != 0)) {

			const stackedBars = drawBar(stackedData_flat, {strokeWidth: 0})
			const legendColor = drawRect(races, {pre:'legendColor_', width:20, height:20})
			const legendText = drawText(races, {pre:'legendText_', value: 'raceName'})

			return(
				<svg width={this.wrapper.width} height={this.wrapper.height} className='stackedWrapper'>
					<g transform={"translate(" + (this.axisSpace.width + this.margins.left) + "," + (this.margins.top) + ")"}>
						<Axis {...xProps[0]} />
						<Axis {...yProps[0]} />
						{stackedBars}
						<text 
							style={Const.textStyle}
							transform={"translate(" + (- this.margins.left) + "," + (this.svgDimensions.height/2 + this.margins.top + this.axisSpace.height) + ")rotate(-90)"}>
							Points
						</text>
						<text 
							style={Const.textStyle}
							transform={"translate(" + (this.svgDimensions.width/2 - this.axisSpace.width - this.margins.left) + "," + (this.svgDimensions.height + this.axisSpace.height + this.margins.top) + ")"}>
							Driver
						</text>
					</g>
					<g transform={"translate(" + (this.svgDimensions.width-this.legendRight.width) + "," + 0 + ")"}>
						{legendColor}
					</g>
					<g transform={"translate(" + (this.svgDimensions.width-this.legendRight.width + 90) + "," + 15 + ")"}>
						{legendText}
					</g>
				</svg>
		)
	} else {
		return(<Loading/>)
	}

	}

};

export default BarChart;