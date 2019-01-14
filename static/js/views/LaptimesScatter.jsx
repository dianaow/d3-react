import React, { Component } from 'react';
import { max, min, quantile } from 'd3-array';
import * as d3Zoom from 'd3-zoom'
import { select, event } from 'd3-selection';
//import {event as currentEvent, select as currentSelect} from 'd3-selection';
import axios from 'axios'
import Dropdown from '../Shared-components/Dropdown';
import Loading from '../Shared-components/Loading';
import ScatterPlot from '../Main-components/Laptimes-ScatterPlot'
import Header from '../Shared-components/Header'
import * as Const from '../Shared-components/Constants';
import { Button } from 'react-bootstrap'

const RACES_SERVICE_URL = `${process.env.RACES_SERVICE_URL}`
const LAPTIMES_SERVICE_URL = `${process.env.LAPTIMES_SERVICE_URL}`

class LaptimesScatter extends Component {

  constructor(){
    super()
    this.state = {
      races: [],
      seasons: [],
      laptimes: [],
      zoomTransform: null,
      zoomType: null
    }

    this.wrapper = { width: Const.width, height: Const.height }
    this.margins = { top: 60, right: 0, bottom: 0, left: 80 }
    this.svgDimensions = { width: this.wrapper.width - this.margins.left - this.margins.right, 
                           height: this.wrapper.height - this.margins.top - this.margins.bottom}

    this.zoom = d3Zoom.zoom()
      .scaleExtent([1, 40])
      .translateExtent([[0, 0], [this.svgDimensionswidth, this.svgDimensions.height]])
      .on("zoom", this.zoomed.bind(this))

  }

  componentDidMount(){

    const racesRequest = axios.get(RACES_SERVICE_URL)
                .then(response =>
                  response.data.data.map(race => ({
                    season : race.season,
                    roundId : race.roundId,
                    raceName : race.raceName,
                      key: 'races',
                      selected: false,
                      id: race.id-1}))
                  )
              .then(races => this.setDefault(races))

    const laptimesRequest = axios.get(LAPTIMES_SERVICE_URL)
                 .then(response => {this.setState({laptimes: response.data.data})})

    select(this.refs.svg)
      .call(this.zoom)

  }

  componentDidUpdate() {
    select(this.refs.svg)
      .call(this.zoom)
  }

  zoomed () {
    if (event.sourceEvent == null) {
      //console.log('Button click event')
      this.setState({ 
        zoomTransform: -1
      })
    } else {
      //console.log('Mousewheel zoom and pan event')
      this.setState({ 
        zoomTransform: event.transform
      })
    }
  }

  resetted = () => {
    //console.log("Just clicked reset button")
    select(this.refs.svg)
    .transition()
    .duration(750)
    .call(this.zoom.transform, d3Zoom.zoomIdentity.translate(0,0).scale(1))

    this.setState({ 
      zoomType: 'reset'
    })

  }

  setDefault = (races) => {
    const uniqYears = [...new Set(races.map(d => d.season))]
    const uniqRaces = [...new Set(races.map(d => d.raceName))]
    races =  uniqRaces.map((y, index) => ({id: index, raceName:y, selected: false, key: 'races' }) )
  	const seasons =  uniqYears.map((y, index) => ({id: index, season:y, selected: false, key: 'seasons' }) )
  	seasons[0].selected = true;
  	races[0].selected = true;
  	this.setState({seasons, races})
  }

  resetThenSet = (value, key) => {
    let data = [...this.state[key]];
    data.forEach(item => item.selected = false);
    data[value].selected = true;
    this.setState({key: data});
  }

  filterAndSort_Laps = (selectedRace, selectedSeason, laptimes, filtQ) => {
	  var filteredLapsResults = laptimes.filter(d => (d.raceName === selectedRace.raceName && d.season === selectedSeason.season))
    if (filtQ) {
      return this.filterQuantile(filteredLapsResults)
    } else {
      return filteredLapsResults
    }
  }

  filterQuantile = (data) => {
    var upperIQR = quantile(data.map(d => d.time), 0.995)
    return data.filter(d => (d.time < upperIQR))
  }

  render() {

  	const{races, seasons, laptimes, zoomTransform, zoomType} = this.state

    var selectedRace = races.find(d => (d.selected === true))
    var selectedSeason = seasons.find(d => (d.selected === true))

  	if (races.length != 0 && seasons.length != 0 && laptimes.length != 0) {
	    var LapsChart = 
	      <ScatterPlot 
  		    lapsData={this.filterAndSort_Laps(selectedRace, selectedSeason, laptimes, true)} 
          width={this.wrapper.width} 
          height={this.wrapper.height}
          zoomTransform={zoomTransform}
          zoomType={zoomType}
          /> 
      var Others = 
        <div>
          <Button onClick={this.resetted}>Reset</Button>
          <span style={Const.topLegendStyle}>Hover over the dots and scroll mouse wheel to zoom in and out</span>
          <h4>LAP NUMBER</h4>
        </div>
  	 } else {
  	 	var LapsChart = <Loading/>
      var Others = <div></div>
  	}

    if (races.length != 0 && seasons.length != 0)  {
      var Title = <div style={Const.headerStyle}><h3>{selectedSeason.season} {selectedRace.raceName}</h3></div>
    } else {
      var Title = <div style={Const.textStyle}><h3></h3></div>
    }

      return (
        <div className="header">
          <Header/>
    	    <div className="wrapper">
    	      <Dropdown
    	        title="Year"
    	        col="season"
    	        list={seasons}
    	        resetThenSet={this.resetThenSet}
    	      />
    	      <Dropdown
    	        title="Select a race"
    	        col="raceName"
    	        list={races}
    	        resetThenSet={this.resetThenSet}
    	      />
            {Title}
    	    </div>
            {Others}
    	    <svg width={this.svgDimensions.width} height={this.svgDimensions.height} ref='svg'>
    	    	{LapsChart}
    	    </svg>
      	</div>
  	);

    }

}

export default LaptimesScatter;