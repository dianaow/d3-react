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
import * as Const from '../Shared-components/Constants';
import NodeGroup from "react-move/NodeGroup";


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

    this.svg = select("#stackedBarChart")
      .append("svg")
        .attr("width", this.wrapper.width)
        .attr("height", this.wrapper.height)
        .attr("class", "stackedWrapper")
      .append("g")
        .attr("transform",
              "translate(" + this.margins.left + "," + this.margins.top + ")");

    this.state = {
      stackedData: [],
      counter: 0
    }

  }

  componentDidMount() {
    this.restructureData(this.props.raceData)
    //this.renderAxisLegend()
    this.initIteration()
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props !== prevProps) {
      this.state.counter = 0
      this.restructureData(this.props.raceData)
      //this.renderAxisLegend()
      this.initIteration()
    }
  }

  initIteration = () => {

    var Timer = interval(t => {
      if (this.state.counter == 3) {
        Timer.stop()
      } else {
        var dataOneRace = this.showRaceOnebyOne()
        this.drawBars(dataOneRace)
      }
     }, 1000)
  }

  showRaceOnebyOne = () => {
    let tmp = this.state.stackedData.filter(d => d.index <= this.state.counter)
    let flattened = tmp.reduce(function(a, b) {
        return a.concat(b);
    }, []);
    this.setState({counter: this.state.counter+1})
    return flattened
  }

  restructureData = (data) => {

    var data1 =  d3Collection.nest()
                    .key(d => this.formatDriverNames(d.driverRef))
                    .entries(data)
    var driverList = data1.map(d => d.key)

    var mapped = this.racesList.map(R => driverList.map(P => `${R}_${P}`))

    // Compute the total points achieved by driver in season by summing points across races.
    var totalPoints = []
    var firstPoints = []
    data1.forEach((d,i) => {
      var f, sum = d.values.reduce((a, {points}) => {
          return a, a+points
        }, 0);
      totalPoints.push(sum)
      firstPoints.push(f)
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

    this.xScale.domain(stackedData.driverRef)

    this.yScale.domain([0, max(stackedData.totals)])

    const xbandSize = this.xScale.bandwidth()

    this.color = scaleOrdinal()
                    .domain(stackedData.keys)
                    .range(schemeSpectral[11])

    // Sum up the total points acheived after each race

    stackedData.forEach((d,i) =>
      stackedData.driverRef.forEach((D,I) => {
        stackedData[i][I][0] = ( stackedData[i][I][0] ? stackedData[i][I][0] : 0 ) 
        stackedData[i][I][1] = ( stackedData[i][I][1] ? stackedData[i][I][1] : 0 ) 
        stackedData[i][I].driverRef = D
        stackedData[i][I].key = stackedData.ids[i][I]
        stackedData[i][I].x = this.xScale(D)
        stackedData[i][I].y = ( d[I][1] ? this.yScale(d[I][1]) : this.yScale(0) ) 
        stackedData[i][I].fill = this.color(stackedData.keys[i]) 
        stackedData[i][I].width = this.xScale.bandwidth()
        stackedData[i][I].height = ( d[I][0] ? this.yScale(d[I][0]) : this.yScale(0) ) - ( d[I][1] ? this.yScale(d[I][1]) : this.yScale(0) )
      })
    )


    this.setState({stackedData})
  }

  formatDriverNames = (e) => {
    if(e.includes("_")){
      return e.split("_")[1]
    } else {
      return e
    }
  }

  renderAxisLegend() {

  }

  drawBars = (data) => {
       
    data.map(d=>console.log(d.key, d[1]))
    var rects = this.svg
      .selectAll(".bar")
      .data(data)

    rects
      .enter()
      .append("rect")
      .merge(rects)
        .attr("class", "bar")
        .attr('key', function (d) { return d.key })
        .attr("x", function (d) { return d.x })
        .attr("y", function (d) { return d.y })
        .attr("width", function (d) { return d.width })
        .attr("height", function (d) { return d.height })
        .attr("fill", function (d) { return d.fill })

    var t = this.svg.transition()
                    .duration(750)

    rects.data(data, d => d[1])
          .order()
         .transition(t)
          .delay((d, i) => i * 20)
          .attr("x", function (d) { return d.x });

  }

  render() {

    if (this.state.stackedData.length != 0) {
      return(<div></div>)
    } else {
      return(<Loading width="1550" height="600"/>)
    }

  }

};

export default BarChart;
