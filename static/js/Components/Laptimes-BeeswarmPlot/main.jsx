import React, { Component } from 'react';
import { max, min, quantile } from 'd3-array';
import axios from 'axios'
import BeeswarmPlot from './sub'
import Legend from '../../Shared-components/driverLegend'
import Dropdown from '../../Shared-components/Dropdown';
import Loading from '../../Shared-components/Loading';
import Header from '../../Shared-components/Header'
import * as Const from '../../Shared-components/Constants';

const RACES_SERVICE_URL = `${process.env.RACES_SERVICE_URL}`
const LAPTIMES_SERVICE_URL = `${process.env.ROUNDED_LAPTIMES_SERVICE_URL}`
const RESULTS_SERVICE_URL = `${process.env.RESULTS_SERVICE_URL}`

class LaptimesBeeswarm extends Component {

  constructor(){
    super()
    this.state = {
      races: [],
      seasons: [],
      laptimes: [],
      results: []
    }
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
              .catch(error => {console.log(error)})

    const laptimesRequest = axios.get(LAPTIMES_SERVICE_URL)
                 .then(response => {this.setState({laptimes: response.data.data})})
                 .catch(error => {console.log(error)})
  
    //purpose of reading in results data is to merge the contructorRef to driverRef. Laptimes data does not contain constructorRef info, while results/qual data contains drivers' constructorRef
    const resultsRequest = axios.get(RESULTS_SERVICE_URL)
                 .then(response => {this.setState({results: response.data.data})})
                 .catch(error => {console.log(error)})
                 
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

  render() {

    const {races, seasons, laptimes, results} = this.state
    var selectedRace = races.find(d => (d.selected === true))
    var selectedSeason = seasons.find(d => (d.selected === true))
    
    if (races.length != 0 && seasons.length != 0 && laptimes.length != 0) {
    var distPlot = 
      <BeeswarmPlot
        lapsData={Const.filterAndSort(selectedRace, selectedSeason, laptimes, '')}
        /> 
      var legend = <Legend data={Const.filterAndSort(selectedRace, selectedSeason, results, 'position')}/>
    } else {
      var distPlot = <Loading/>
    }

    if (races.length != 0 && seasons.length != 0)  {
      var Title = <div style={Const.headerStyle}><h3>{selectedSeason.season} {selectedRace.raceName}</h3></div>
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
          <Dropdown
            title="Select a race"
            col="raceName"
            list={races}
            resetThenSet={this.resetThenSet}
          />
          {Title}
        </div>
        {distPlot}
        {legend}
      </div>
    );

  }

}

export default LaptimesBeeswarm;