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
const LAPTIMES_SERVICE_URL = `${process.env.LAPTIMES_SERVICE_URL}`
const RESULTS_SERVICE_URL = `${process.env.RESULTS_SERVICE_URL}`

class LaptimesBeeswarm extends Component {

  constructor(){
    super()
    this.state = {
      races: [],
      seasons: [],
      laptimes: [],
      results: [],
      counter: 0
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

    //purpose of reading in results data is to merge the contructorRef to driverRef. Laptimes data does not contain constructorRef info, while results/qual data contains drivers' constructorRef
    const resultsRequest = axios.get(RESULTS_SERVICE_URL)
      .then(response => {this.setState({results: response.data.data})})
      .catch(error => {console.log(error)})
    
    this.fetchLaptimes(2016, 1)

  }

  componentDidUpdate(prevProps, prevState) {
    var currentSeason = this.state.seasons.find(d => (d.selected === true))
    var currentRace = this.state.races.find(d => (d.selected === true))
    if(this.state.counter != prevState.counter){
      //console.log('updating', currentSeason.season, currentRace.roundId) verify its doesn't loop infinitely, correct parameters sent to API request
      this.fetchLaptimes(currentSeason.season, currentRace.roundId)
    }

  }

  setDefault = (races) => {
    const uniqYears = [...new Set(races.map(d => d.season))] //retrieve a list of unique race seasons in database
    const seasons =  uniqYears.map((y, index) => ({id: index, season:y, selected: false, key: 'seasons' })) //formatting to enable dropdown selection
    seasons[0].selected = true; //set a default year
    races[0].selected = true; //set a default race
    this.setState({races, seasons})
  }

  resetThenSet = (value, key) => {
    let data = [...this.state[key]];
    data.forEach(item => item.selected = false);
    data[value].selected = true;

    if(key == 'seasons'){
      //ensure that race is also selected for the other year (this ensures we are able to toggle between years without changing race selection)
      var races = this.state.races
      var name = races.find(d => (d.selected === true)).raceName
      var season = data.find(d => (d.selected === true)).season
      races.forEach((d,i) => {
        races[i].selected = (races[i].raceName == name) && (races[i].season == season) ? true : false
      })
      this.setState({seasons: data, races: races})
    } else{
      this.setState({key: data})
    }

    this.setState(prevState => ({
      counter: prevState.counter + 1
    })); 
  }

  fetchLaptimes = (season, race) => {
    const laptimesRequest = axios.get(LAPTIMES_SERVICE_URL + "/" + season.toString() + "/" + race.toString())
      .then(response => {this.setState({laptimes: response.data.data})})
      .catch(error => {console.log(error)})
  }

  render() {

    const{races, seasons, results, laptimes, zoomTransform, zoomType} = this.state

    if (races.length != 0 && seasons.length != 0)  {
      var selectedSeason = seasons.find(d => (d.selected === true)) //find the selected season
      var filteredraces = races.filter(d => d.season === selectedSeason.season) //fiter races accordingly (list of races may change year on year)
      var selectedRace = filteredraces.find(d => (d.selected === true))

      var Title = <div style={Const.headerStyle}><h3>{selectedSeason.season} {selectedRace.raceName}</h3></div>
    } else {
      var Title = <div style={Const.textStyle}><h3></h3></div>
    }

    if (races.length != 0 && seasons.length != 0 && laptimes.length != 0 && results.length !=0) {
      var LapsChart = 
        <BeeswarmPlot
          lapsData={Const.filterAndSort(selectedRace, selectedSeason, laptimes, '')}
          resultsData={Const.filterAndSort(selectedRace, selectedSeason, results, 'position')}
        /> 
      var legend = <Legend data={Const.filterAndSort(selectedRace, selectedSeason, results, 'position')}/>
     } else {
      var LapsChart = <Loading/>
    }

    return (
      <div className="header">
        <Header/>
        <div className="wrapper">
          <Dropdown
            title="Year"
            col="season"
            list={seasons}
            selected="selectedSeason"
            resetThenSet={this.resetThenSet}
          />
          <Dropdown
            title="Select a race"
            col="raceName"
            selected="selectedRace"
            list={filteredraces}
            resetThenSet={this.resetThenSet}
          />
          {Title}
        </div>
        <span style={Const.topLegendStyle}>Hover over dots to show driver label and corresponding laptime</span>
        <div>
          {LapsChart}
        </div>
      </div>
    );

  }

}

export default LaptimesBeeswarm;

