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

  function Bar(props) {
    return (
        <rect
          className='driverOneRace'
          key={ props.data.key }
          x={ props.data.x }
          y={ props.data.y }
          fill={ props.data.fill }
          width={ props.data.width }
          height={ props.data.height }
          style={{'mix-blend-mode': 'multiply'}}
        />
      )
  }

class BarChart extends Component {

  constructor(props) {
    super(props)

    this.wrapper = { width: Const.width, height: Const.height }
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
      if (this.state.counter == 3) {
        Timer.stop()
      } else {
        this.showRaceOnebyOne()
      }
     }, 1000)

  }

  showRaceOnebyOne = () => {
    let tmp = this.state.stackedData.filter(d => d.index <= this.state.counter)
    let flattened = tmp.reduce(function(a, b) {
        return a.concat(b);
    }, []);
    console.log(flattened)
    this.setState({dataOneRace: flattened, counter: this.state.counter+1})
  }

  restructureData = (data) => {

    var data1 =  d3Collection.nest()
                    .key(d => Const.formatDriverNames(d.driverRef))
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

    this.xScale = this.xScale
                    .domain(stackedData.driverRef)

    this.yScale = this.yScale
                    .domain([0, max(stackedData.totals)])

    const xbandSize = this.xScale.bandwidth()

    this.color = scaleOrdinal()
                    .domain(stackedData.keys)
                    .range(schemeSpectral[11])

    stackedData.forEach((d,i) =>
      stackedData.driverRef.forEach((D,I) => {
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

  updateD3() {

    const {stackedData, dataOneRace} = this.state
    //console.log(stackedData, dataOneRace)

    const xProps = {
      orient: 'Bottom',
      scale: this.xScale,
      translate: `translate(0, ${this.svgDimensions.height})`,
      tickSize: -10
    }

    const yProps = {
      orient: 'Left',
      scale: this.yScale,
      translate: `translate(${this.margins.left}, 0)`,
      tickSize: -10,
      tickValues: range(0, max(stackedData.totals), 5)
      //tickValues: ticks(0, max(stackedData.totals), 10)
    }

    const legendColorBar = (
      stackedData.keys.map((d,i) =>
        <g transform={"translate(" + 0 + "," + (i*20) + ")"}> 
          <rect
            fill={this.color(stackedData.keys[i])}
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

    const BarGroup = (
      <svg width={this.wrapper.width} height={this.wrapper.height} className='stackedWrapper'>
        <g transform={"translate(" + (this.axisSpace.width + this.margins.left) + "," + (this.margins.top) + ")"}>
          <Axis {...xProps} />
          <Axis {...yProps} />
            <NodeGroup
              data={dataOneRace}
              keyAccessor={d => d.key}
              start={this.startTransition}
              enter={this.enterTransition}
              update={this.updateTransition}
            >
              {nodes => (
                <g>
                  {nodes.map(({ key, data, state }) => (
                    <Bar key={key} data={data} state={state} />
                  ))}
                </g>
              )}
            </NodeGroup>
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
    
    return BarGroup
  }

  autoSortD3() {

    const BarGroup = this.updateD3()

    const {dataOneRace} = this.state

    const svg = select('.stackedWrapper')
    const bar = selectAll('driverOneRace')
    const gx = select('.Axis-bottom')

    const t = svg.transition()
      .duration(750);

    bar.data(dataOneRace, d => d[1])
        .order()
      .transition(t)
        .delay((d, i) => i * 20)
        .attr("x", d => d.x);

  }

  startTransition(d, i) {
    return { value: d[1], y: d.y, opacity: 0 };
  }

  enterTransition(d) {
    return { value: d[1], opacity: [1], timing: { duration: 250 } };
  }

  updateTransition(d, i) {
    return { value: d[1], y: d[1], opacity: [1], timing: { duration: 300 } };
  }

  render() {

    if ((this.state.stackedData.length != 0) & (this.state.dataOneRace.length != 0)) {
      //this.autoSortD3()
      const BarGroup = this.updateD3()
      return(BarGroup)
    } else {
      return(<Loading width="1550" height="600"/>)
    }

  }

};

export default BarChart;



