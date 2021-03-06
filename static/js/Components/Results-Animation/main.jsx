import React, { Component } from 'react';
import axios from 'axios'
import { max, min, quantile } from 'd3-array';
import { selectAll } from 'd3-selection'
import BarChart from './sub1'
import Dropdown from '../../Shared-components/Dropdown';
import Loading from '../../Shared-components/Loading';
import Header from '../../Shared-components/Header'
import * as Const from '../../Shared-components/Constants';

const RESULTS_SERVICE_URL = `${process.env.RESULTS_SERVICE_URL}`
const RACES_SERVICE_URL = `${process.env.RACES_SERVICE_URL}`

class ResultsBar extends Component {

	constructor(){
		super()
		this.state = {
			results: [],
			races: [],
			seasons: [],
			play: 'false'
		};
	}

	componentDidMount(){

		const resultsRequest = axios.get(RESULTS_SERVICE_URL)
			.then(response => {this.setState({results: response.data.data})})
			.catch(error => {console.log(error)})
	
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
	}

	 setDefault = (races) => {
		const uniqYears = [...new Set(races.map(d => d.season))]
		const uniqRaces = [...new Set(races.map(d => d.raceName))]
		const seasons =  uniqYears.map((y, index) => ({id: index, season:y, selected: false, key: 'seasons' }) )
		seasons[0].selected = true;
		this.setState({seasons, races: uniqRaces})
	}

	resetThenSet = (value, key) => {
		let data = [...this.state[key]];
		data.forEach(item => item.selected = false);
		data[value].selected = true;
		this.setState({key: data});
	}

	initAnimation = () => {
		this.setState({ 
			play: 'true'
		})
	}

	render() {

		const{races, seasons, results} = this.state

		var selectedSeason = seasons.find(d => (d.selected === true))

		if (seasons.length != 0 && results.length != 0) {
			var ResultsChart = 
				<BarChart 
					raceData={Const.filterAndSortSeason(selectedSeason, results, '')} 
					racesList={races}
					play={this.state.play} />
		} else {
			var ResultsChart = <Loading/>
		}

		if (races.length != 0 && seasons.length != 0)  {
			var Title = <div style={Const.headerStyle}><h3>{selectedSeason.season}</h3></div>
		} else {
			var Title = <div style={Const.headerStyle}><h3></h3></div>
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
					{Title}
				</div>
        <span style={Const.topLegendStyle}>Points are awarded as follows: 1st place - 25 points; 2nd -18; 3rd - 15; 4th -12; 5th - 10; 6th - 8; 7th - 6; 8th - 4; 9th - 2; 10th - 1</span>
				<div id='stackedBarChart'>
					{ResultsChart}
				</div>
			</div>
		);

	}

}

export default ResultsBar;