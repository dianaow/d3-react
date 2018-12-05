import React,{ Component} from 'react';
import { scaleBand, scaleLinear, scaleOrdinal } from 'd3-scale';
import { min, max, range } from 'd3-array';
import Axis from '../Shared-components/Axis'
import Dots from '../Shared-components/Dots'
import Tooltip from '../Shared-components/Tooltip'
import * as Const from '../Shared-components/Constants';

class ScatterPlot extends Component {

  constructor(props) {
    super(props)
    this.newScales = this.updateD3(this.props)

    this.state = {
      tooltip:{ display:false,data:{key:'',value:''}}
    }
  }

componentDidUpdate(prevProps) {
  if (this.props.zoomTransform !== prevProps.zoomTransform) {
    this.newScales = this.updateD3(this.props)
  }
}

  handleMouseOver = (e) => {
    this.setState({tooltip:{
        display:true,
        data: {
            key:e.driverRef,
            value:e.time
            },
        pos:{
            x:e.x,
            y:e.y
            }
      }
    })
  }

  handleMouseOut = (e) => {
    this.setState({tooltip:{
        display:false,
        data: {
            key:'',
            value:''
            }
      }
    })
  }

  updateD3(props) {

    const { lapsData, zoomTransform } = props

    let transformX = ""
    let transformY = "" 

    this.wrapper = { width: props.width, height: props.height }
    this.margins = { top: 60, right: 0, bottom: 0, left: 80 }
    this.svgDimensions = { width: this.wrapper.width - this.margins.left - this.margins.right, 
                           height: this.wrapper.height - this.margins.top - this.margins.bottom}

    this.xScale = scaleLinear()
                    .domain([0,60])
                    .rangeRound([this.margins.left, this.svgDimensions.width])

    this.yScale = scaleLinear()
                    .domain([0, 110])
                    .rangeRound([this.svgDimensions.height, this.margins.top])

    if (zoomTransform) {
      transformY = zoomTransform.rescaleY(this.yScale)
    } else {
      transformY = this.yScale
    }

    return transformY
  }

  render() {
    
    const {lapsData} = this.props
    
    const yScale = this.newScales
    const xScale = this.xScale
    const ticksRange = this.yScale

    const xProps = {
      orient: 'Bottom',
      scale: xScale,
      translate: `translate(0, ${this.wrapper.height})`,
      tickSize: this.wrapper.height,
      tickValues: range(0,65,5)
    }

    const yProps = {
      orient: 'Left',
      scale: yScale,
      translate: `translate(${this.margins.left}, 0)`,
      tickSize: 0,
      ticks:10
    }

    const lapsData_new = lapsData.map(d => {
      return {
          id: d.id,
          radius: 3, 
          color: Const.colorScale(d.constructorRef),
          x: xScale(d.lap),
          y: yScale(d.time),
          driverRef: d.driverRef,
          time: d.time
      }
    })

    return (
      <React.Fragment>
        <g>
          <Axis {...xProps} />
          <Axis {...yProps} />
          <Dots
            data={lapsData_new}
            onMouseOverCallback={this.handleMouseOver}
            onMouseOutCallback={this.handleMouseOut}
            tooltip={this.state.tooltip}
          />
          <Tooltip
            tooltip={this.state.tooltip}
          /> 
        </g>
        <text 
          style={Const.textStyle}
          transform={"translate(" + 10 + "," + (this.wrapper.height/2) + ")rotate(-90)"}>
          Time to complete (in sec)
        </text>
        <text 
          style={Const.textStyle}
          transform={"translate(" + (this.wrapper.width/2) + "," + (this.wrapper.height) + ")"}>
          Lap
        </text>
        <text
          style={Const.topLegendStyle}
          transform={"translate(" + (this.margins.left) + "," + 10 + ")"}>
            Pitlaps and Laptimes above the 99.5th percentile are filtered out.
        </text>
    </React.Fragment>
    )
  }

}

export default ScatterPlot;