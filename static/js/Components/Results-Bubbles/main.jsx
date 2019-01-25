import React, { Component } from 'react';
import axios from 'axios'
import { queue } from 'd3-queue';
import { csv, json } from 'd3-request'
import { max, range } from 'd3-array';
import { event, select, selectAll } from 'd3-selection';
import { scaleOrdinal, scaleSequential, scaleSqrt } from 'd3-scale';
import { nest } from 'd3-collection';
import { drag } from 'd3-drag'
import * as d3 from 'd3-force';
import Header from '../../Shared-components/Header'
import * as Const from '../../Shared-components/Constants';
import { NodePieBuilder } from '../../Shared-components/NodePieBuilder';

const RESULTS_SERVICE_URL = `${process.env.RESULTS_SERVICE_URL}`
const RACES_SERVICE_URL = `${process.env.RACES_SERVICE_URL}`
const LAPTIMES_SERVICE_URL = `${process.env.LAPTIMES_SERVICE_URL}`

// Initialize scales
const color = scaleOrdinal()
	.range(["#EFB605", "#E47D06", "#DB0131", "#AF0158", "#7F378D", "#3465A8", "#0AA174", "#7EB852"])
	.domain(function(d){return d.raceName})

const radius = scaleSqrt().range([0, 7])

class Bubbles extends Component {

	constructor(){
		super()

		var mainFullWidth = Const.width,
				mainFullHeight = 1500

		this.margin = {top: 0, right: 0, bottom: 0, left:0}
		this.width = mainFullWidth - this.margin.left - this.margin.right,
		this.height = mainFullHeight - this.margin.top - this.margin.bottom

		this.state = {
			graph: []
		}
	}

	componentDidMount(){

		axios.all([
				axios.get(RESULTS_SERVICE_URL),
				axios.get(RACES_SERVICE_URL),
				axios.get(LAPTIMES_SERVICE_URL + "/2016")
			])
			.then(axios.spread((graph, races, laptimes) => {
				this.dataFormatting(graph.data, races.data, laptimes.data)
			})) 

	}

	dataFormatting = (graph, races, laptimes) => {

		//console.log(graph, races, laptimes)
		var arr = ['Australian Grand Prix', 'Bahrain Grand Prix', 'Chinese Grand Prix']
		graph.data = graph.data.filter(d =>(arr.indexOf(d.raceName) != -1) && (d.season == 2016))
		races.data = races.data.filter(d =>(arr.indexOf(d.raceName) != -1) && (d.season == 2016))
		laptimes.data = laptimes.data.filter(d =>(arr.indexOf(d.raceName) != -1))

		// Format JSON structure of race results to make it suitable for drawing nodes
		var res = []
		graph.data.forEach((d,i) => {
			res = laptimes.data.filter((x,idx) => (x.driverRef == d.driverRef) & (x.raceName == d.raceName) & (x.season == d.season))
			graph.data[i].pieChart = res
			d.id = d.id + 10
			d.roundId = d.roundId + 200
			d.value = 300 / d.position
			d.label = Const.formatDriverNames(d.driverRef)
			d.laps = d.laps ? d.laps : 0
		})
		
		// Create nodes for each raceName and title
		var mainTitle = {'roundId': 200, 'id': 200, 'raceName': 'FORMULA 1', 'value': '', 'label': 'FORMULA 1'}
		graph.data.push(mainTitle)
		races.data.forEach((d,i) => {
			d.position = 1
			d.roundId = 200
			d.id = d.id + 200
			d.value = 280 / d.position
			d.label = d.raceName
			graph.data.push(races.data[i])
		})

		// Format JSON structure of race results to make it suitable for drawing links 
		graph.links = []
		graph.data.forEach((d,i) => 
			graph.links[i] = {'source': d.roundId, 'target': d.id, key:i, raceName: d.raceName}
		)
		//console.log(graph.links)

		//graph.data = graph.data.slice(0, -3)
		//graph.links = graph.links.slice(0, -3)

		// Find the maximum number of laps ran (Note: This may be different from the total number of laps run by each driver) 
		var maxLaps = nest()
			.key(d => d.roundId)
			.rollup(v => max(v, d => d.laps? d.laps : 0))
			.entries(graph.data)
		//console.log(maxLaps)

		graph.data.map((d,i) => { 
			d.maxLaps = maxLaps.filter((x,idx) => (x.key == d.roundId))[0].value
		})
		//console.log(graph.data)
			 
		this.setState({graph})

	}

	renderForceLayout = (graph) => {

		//console.log(graph.data)
		//console.log(graph.links)
		var svg = select(".canvas")

		svg.selectAll("*").remove()

		// Draw links
		var link = svg.append("g")
				.attr("class", "links")
			.selectAll("line")
			.data(graph.links)
			.enter().append("line")
				.attr("stroke-width", 2)
				.style('stroke', d => color(d.raceName))

		// Create nodes
		var node = svg.append("g")
				.attr("class", "nodes")
			.selectAll("g")
			.data(graph.data)
			.enter()
				.append("g")
			.style('transform-origin', '50% 50%')
				.attr('class', d => "node_"+d.label)
				.call(drag()
							.on("start", dragstarted)
							.on("drag", dragged)
							.on("end", dragended))

		// Initialize force simulation
		var simulation = d3.forceSimulation()
				.force("link", 
							 d3.forceLink().id(d => d.id)
								.distance(d => radius(d.source.value*2) + radius(d.target.value*2))
								.strength(0.75)
							)
				.force("charge", d3.forceManyBody().strength(-300))
				.force("collide", d3.forceCollide().radius(d => radius(d.value*1.5)))
				.force("center", d3.forceCenter(this.width/2+250, this.height /2-50))

		simulation
				.nodes(graph.data)
				.on("tick", ticked)

		simulation.force("link")
				.links(graph.links)

		node.each(function (d) {
			NodePieBuilder.drawNodePie(select(this), d.pieChart, {
				radius: radius(d.value),
				parentNodeColor: color(d.raceName),
				maxLaps: d.maxLaps,
				data: d
			});
		});
		
		// Only select nodes of raceNames to have text placed in circle center
		node.append("text")
				.filter(d => d.id > 200)
				.attr("dy", ".35em")
				.attr("text-anchor", "middle")
				.style('fill', 'white')
				.text(d => d.label)

		// Only select nodes of raceNames to have description text
		node.append("text")
				.filter(d => d.id > 200)
					.attr('dy', -30)
					.attr("text-anchor", "middle")
					.style('fill', 'white')
					.text(d => d.season)


		function ticked() {

			link
					.attr("x1", d => d.source.x)
					.attr("y1", d => d.source.y)
					.attr("x2", d => d.target.x)
					.attr("y2", d => d.target.y)

			node.attr("transform", d => "translate(" + d.x + "," + d.y + ")")

		}

		function dragstarted(d) {
			if (!event.active) simulation.alphaTarget(0.3).restart();
			d.fx = d.x;
			d.fy = d.y;
		}

		function dragged(d) {
			d.fx = event.x;
			d.fy = event.y;
		}

		function dragended(d) {
			if (!event.active) simulation.alphaTarget(0);
			d.fx = null;
			d.fy = null;
		}

	}

	renderLegend = () => {

		var svg = select(".canvas")
		var legendMargin = { top: radius(300/1)*1.5, right: radius(300/1) * 1.5} // place legend within canvas

		// Draw a circle
		var timings = range(85,106,1)
		var pies = range(1,21,1)
		var legendData = []
		pies.map((d,i) => {
			legendData.push({id:1, label:'Driver', laps:"No. of laps", lap: i, time: timings[i], vx:0, vy:0, value:300/1})
		})
		//console.log(legendData)

		var circlesWrapper = svg.append("g")
													.attr("class", "legendGrp")
													.attr('transform', "translate(" + legendMargin.right + "," + legendMargin.top + ")")

		var acircle = circlesWrapper.append("g")
				.attr("class", "legend")
			.selectAll("g")
			.data(legendData)
			.enter()
				.append("g")

		NodePieBuilder.drawNodePie(acircle, legendData, {
			radius: radius(300),
			parentNodeColor: '#AF0158',
			maxLaps: 20,
			data: legendData,
			showPieLabels: true
		})

		// Append line indicator for start label
		circlesWrapper.append("g")
				.attr('class', 'misc-line-wrap')
				.append('line')
					.attr('x1', 0)
					.attr('x2', 200)
					.attr('y1', 120-radius(300/1))
					.attr('y2', 120-radius(300/1))
					.style('stroke', 'black')
					//.style('stroke-dasharray', ('2,2'))

		// Append start label
		circlesWrapper.append("g")
				.attr('class', 'misc-labels-wrap')
				.append('text')
					.attr('x', 200)
					.attr('y', 110-radius(300/1))
					.attr('shape-rendering', 'crispEdges')
					.style('text-anchor', 'end')
					.style('fill', 'black')
					.style('font-size', 10)
					.text('First Lap')

		// Append line indicator for laptimes
		circlesWrapper.append("g")
				.attr('class', 'misc-line-wrap')
				.append('line')
					.attr('x1', 78)
					.attr('x2', 200)
					.attr('y1', 40-radius(300/1))
					.attr('y2', 40-radius(300/1))
					.style('stroke', 'black')
					//.style('stroke-dasharray', ('2,2'))

		// Append pie laptimes label
		circlesWrapper.append("g")
				.attr('class', 'misc-labels-wrap')
				.append('text')
					.attr('x', 200)
					.attr('y', 30-radius(300/1))
					.attr('shape-rendering', 'crispEdges')
					.style('text-anchor', 'end')
					.style('fill', 'black')
					.style('font-size', 10)
					.text('Time to complete a lap')

		// Initialize data for winning position circle legend
		var jsonCircles = [
			 { "x_axis": 0, "y_axis": 400-radius(300/1), "radius": radius(300/1), 'value': 1},
			 { "x_axis": 0, "y_axis": 400-radius(300/2), "radius": radius(300/2), 'value': 2},
			 { "x_axis": 0, "y_axis": 400-radius(300/3), "radius": radius(300/3), 'value': 3},
			 { "x_axis": 0, "y_axis": 400-radius(300/5), "radius": radius(300/5), 'value': 5},
			 { "x_axis": 0, "y_axis": 400-radius(300/10), "radius": radius(300/10), 'value': 10},
			 { "x_axis": 0, "y_axis": 400-radius(300/15), "radius": radius(300/15), 'value': 15},
			 { "x_axis": 0, "y_axis": 400-radius(300/22), "radius": radius(300/22), 'value': 22}];

		// Draw group of circles
		var circles = circlesWrapper.append("g")
										.attr("class", "values-wrap")
										.selectAll("circle")
										.data(jsonCircles)
										.enter()
										.append("circle");

		var circleAttributes = circles
														.attr("cx", d => d.x_axis)
														.attr("cy", d => d.y_axis)
														.attr("r",  d => d.radius)
														.attr('stroke-width', 1)
														.attr('stroke', 'black')
														.style("fill", 'transparent')
		
		// Append dotted line indicator for win position labels
		circlesWrapper.append('g')
				.attr('class', 'values-line-wrap')
				.selectAll('.values-labels')
				.data(jsonCircles)
				.enter().append('line')
				.attr('x1', d => d.x_axis)
				.attr('x2', 150)
				.attr('y1', d => d.y_axis-d.radius)
				.attr('y2', d => d.y_axis-d.radius)
				.style('stroke', 'black')
				.style('stroke-dasharray', ('2,2'))

		// Append win position labels
		circlesWrapper.append('g')
				.attr('class', 'values-labels-wrap')
				.selectAll('.values-labels')
				.data(jsonCircles)
				.enter().append('text')
				.attr('x', 150 + 10)
				.attr('y', d => (d.y_axis - d.radius + 5))
				.attr('shape-rendering', 'crispEdges')
				.style('text-anchor', 'end')
				.style('fill', 'black')
				.style('font-size', 10)
				.text(d => d.value)

		// Append legend title
		circlesWrapper.append('text')
				.attr('x', 0)
				.attr('y', 400-2*radius(300/1)-10)
				.style('text-anchor', 'middle')
				.style('fill', 'black')
				.style('font-size', 12)
				.text('Race Winning Position')    

	}


	render() {

		const {graph} = this.state

		if (graph.length != 0) {
			this.renderForceLayout(graph) 
			this.renderLegend()
		} 
		return (
			<div className="header">
				<Header/>
				<svg className='canvas' width={this.width} height={this.height} transform={"translate(" + this.margin.left + "," + this.margin.top + ")"}>
					<text dx="600" dy="300" fontSize='3em' className="heavy">Loading...</text>
				</svg>
			</div>
		)

	}

}

export default Bubbles;