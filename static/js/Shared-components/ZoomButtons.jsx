import React,{ Component, Fragment } from 'react';
import * as d3Zoom from 'd3-zoom';
import { interpolate } from 'd3-interpolate';
import { transition } from 'd3-transition';
import { event } from 'd3-selection';
import { ButtonToolbar, Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default class ZoomButtons extends Component {

	constructor(props){
		super(props)

		this.zoom = d3Zoom.zoom()
			.scaleExtent([1, 20])
			.on("zoom", this.zoomed)

		this.state = {
			zoomTransform: null,
			zoom: this.zoom
		}

	}

	componentDidMount(){
		select(this.props.svgSelected)
			.call(this.state.zoom)

		select(this.props.xAxis)
			.call()
	}

	componentDidUpdate() {
		select(this.props.svgSelected)
			.call(this.state.zoom)
	}

	zoomed = () => {
		this.setState({ 
			zoomTransform: event.target
		})
	}


	zoomClick = () => {
		const {zoom} = this.state.zoom
		const svg = this.props.svgSelected
		svg.call(zoom.event)

		// Record the coordinates (in data space) of the center (in screen space).
		var center0 = zoom.center(), translate0 = zoom.translate(), coordinates0 = coordinates(center0)
		zoom.scale(zoom.scale() * Math.pow(2, +this.getAttribute("data-zoom")))

		// Translate back to the center.
			var center1 = point(coordinates0);
			zoom.translate([translate0[0] + center0[0] - center1[0], translate0[1] + center0[1] - center1[1]])

			svg.transition().duration(750).call(zoom.event)
}

	coordinates = (point) => {
		var scale = zoom.scale(), translate = zoom.translate();
		return [(point[0] - translate[0]) / scale, (point[1] - translate[1]) / scale];
	}

	point = (coordinates) => {
		var scale = zoom.scale(), translate = zoom.translate();
		return [coordinates[0] * scale + translate[0], coordinates[1] * scale + translate[1]];
	}

	render() {

		return (
				<ButtonToolbar>
						<Button id="zoom_in" onClick={this.zoomClick}><FontAwesomeIcon icon="plus" size="sm" color="#ccc"/></Button>
						<Button id="zoom_out" onClick={this.zoomClick}><FontAwesomeIcon icon="minus" size="sm" color="#ccc"/></Button>
				</ButtonToolbar>
		)
	}
}
