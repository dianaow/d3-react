import React,{ Component, Fragment } from 'react';
import { scaleBand, scaleLinear, scaleOrdinal, scaleQuantize } from 'd3-scale';
import { min, max, range, sum, permute, ticks } from 'd3-array';
import { schemeSpectral } from 'd3-scale-chromatic';
import { select, selectAll } from 'd3-selection';
import { easeCubicInOut } from 'd3-ease';
import { timer, interval } from 'd3-timer';
import * as d3Collection from 'd3-collection';
import * as d3 from 'd3-shape';
import Loading from '../Shared-components/Loading';
import Axis from '../Shared-components/Axis'
import BarsOneRace from './Results-BarAnimation'
import * as Const from '../Shared-components/Constants';

class BarChart extends Component {

  constructor(props) {
    super(props)

    this.wrapper = { width: this.props.width, height: this.props.height }
    this.legendRight = { width: 100, height: 400 }
    this.axisSpace = { width: 30, height: 30 }
    this.margins = { top: 20, right: 20, bottom: 20, left: 30 }
    this.svgDimensions = { width: this.wrapper.width - this.legendRight.width - this.axisSpace.width - this.margins.left - this.margins.right, height: this.wrapper.height - this.axisSpace.height - this.margins.top - this.margins.bottom }

    this.xScale = scaleBand()
                    .padding(0.1)
                    .range([this.margins.left, this.svgDimensions.width])

    this.yScale = scaleLinear()
                    .range([this.svgDimensions.height, this.margins.top])

    this.racesList = this.props.racesList

    this.state = {
      dataOneRace: [],
      stackedData: [],
      counter: 0
    }

  }

  componentDidMount() {
    this.restructureData(this.props.raceData)
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props !== prevProps) {
      this.restructureData(this.props.raceData)
    }
  }

  initIteration = () => {
     var Timer = interval(t => {
      if (this.state.counter == 3) {
        Timer.stop()
      } else {
        this.showRaceOnebyOne()
      }
     }, 1000)

  }

  showRaceOnebyOne = () => {
    let tmp = this.state.stackedData.filter(d => d.index == this.state.counter)
    this.setState({dataOneRace:tmp, counter: this.state.counter+1})
  }

  restructureData = (data) => {

    var data1 =  d3Collection.nest()
                    .key(d => this.formatDriverNames(d.driverRef))
                    .entries(data)
    var driverList = data1.map(d => d.key)

    var mapped = this.racesList.map(R => driverList.map(P => `${R}_${P}`))

    // Compute the total points achieved by driver in season by summing points across races.
    var totalPoints = []
    data1.forEach((d,i) => {
      var sum = d.values.reduce((a, {points}) => {
          return a+points
        }, 0);
      totalPoints.push(sum)
    })

    // Construct an array of arrays where dataNew[i][j] is the point achived for driverRef i and raceName j.
    var dataNew = []
    var eachPoints = []
    data1.forEach((d,i) => {
      var oneDriverRace = []
      d.values.map(p => oneDriverRace.push(p.points))
      dataNew.push(oneDriverRace)
    })

    // Compute the desired order of drivers by descending total points.
    var order = range(data1.length - 1).sort((i, j) => totalPoints[j] - totalPoints[i]);

    var stackedData = Object.assign(d3.stack().keys(range(this.racesList.length))(permute(dataNew, order)), {
      keys: this.racesList,
      ids: mapped,
      totals: permute(totalPoints, order),
      driverRef: permute(driverList, order)
    })

    this.setState({stackedData})
  }

  formatDriverNames = (e) => {
    if(e.includes("_")){
      return e.split("_")[1]
    } else {
      return e
    }
  }

  updateD3(state) {

    const {stackedData, dataOneRace, counter} = state

    const xScale = this.xScale
                    .domain(stackedData.driverRef)

    const yScale = this.yScale
                    .domain([0, max(stackedData.totals)])

    const xbandSize = xScale.bandwidth()

    const color = scaleOrdinal()
                    .domain(stackedData.keys)
                    .range(schemeSpectral[11])

    const xProps = {
      orient: 'Bottom',
      scale: xScale,
      translate: `translate(0, ${this.svgDimensions.height})`,
      tickSize: -10
    }

    const yProps = {
      orient: 'Left',
      scale: yScale,
      translate: `translate(${this.margins.left}, 0)`,
      tickSize: -10,
      tickValues: range(0, max(stackedData.totals), 5)
      //tickValues: ticks(0, max(stackedData.totals), 10)
    }

    const legendColorBar = (
      stackedData.keys.map((d,i) =>
        <g transform={"translate(" + 0 + "," + (i*20) + ")"}> 
          <rect
            fill={color(stackedData.keys[i])}
            x={0}
            width={20}
            height={20}
          />
          <text
            x={25}
            dy="0.35em"
            alignmentBaseline="middle"
            style={Const.legendStyle}
          >
            {d}
          </text>
        </g>
      )
    )

    const bars = (
      stackedData.map((d,i) =>
        stackedData.driverRef.map((D,I) => 
          <rect
            ref='barsAllRaces'
            key={ stackedData.ids[i][I] }
            x={ xScale(D) }
            y={ ( d[I][1] ? yScale(d[I][1]) : yScale(0) ) }
            fill={ color(stackedData.keys[i]) }
            width={ xScale.bandwidth() }
            height={ ( d[I][0] ? yScale(d[I][0]) : yScale(0) ) - ( d[I][1] ? yScale(d[I][1]) : yScale(0) ) }
          />
        )
      )
    )

    if (this.props.play == 'true') {
      selectAll(this.refs.barsAllRaces).remove()
      this.initIteration()
      console.log(dataOneRace)
        dataOneRace.map((D,I) => 
          D.map((d,i) => 
            <BarsOneRace
              ref={counter-1}
              key={ stackedData.ids[counter-1][i] }
              x={ xScale(stackedData.driverRef[i]) }
              y={ ( d[1] ? yScale(d[1]) : yScale(0) ) }
              fill={ color(stackedData.keys[counter-1]) }
              width={ xScale.bandwidth() }
              height={ ( d[0] ? yScale(d[0]) : yScale(0) ) - ( d[1] ? yScale(d[1]) : yScale(0) ) }
            />
          )
        )

    }

    const Bar = (
      <svg width={this.wrapper.width} height={this.wrapper.height}>
        <g transform={"translate(" + (this.axisSpace.width + this.margins.left) + "," + (this.margins.top) + ")"}>
          <Axis {...xProps} />
          <Axis {...yProps} />
          {bars}
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
        <g transform={"translate(" + (this.svgDimensions.width) + "," + (this.margins.top) + ")"}>
          {legendColorBar}
        </g>
      </svg>
    )
    
    return Bar
 }

  render() {

    if (this.state.stackedData.length != 0) {
      const Bar = this.updateD3(this.state)
      return(Bar)
    } else {
      return(<Loading width="1550" height="600"/>)
    }

  }

};

export default BarChart;



