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

    const { lapsData, resultsData, zoomTransform, zoomType } = props

    let transformX = ""
    let transformY = "" 

    this.wrapper = { width: props.width, height: props.height }
    this.margins = { top: 60, right: 0, bottom: 0, left: 80 }
    this.svgDimensions = { width: this.wrapper.width - this.margins.left - this.margins.right, 
                           height: this.wrapper.height - this.margins.top - this.margins.bottom}

    this.xScale = scaleLinear()
                    .domain([0,60])
                    .rangeRound([this.margins.left, this.svgDimensions.width-this.margins.left])

    this.yScale = scaleLinear()
                    .domain([70,140])
                    .rangeRound([this.svgDimensions.height-15, 15])

    if (zoomTransform) {
      if ((zoomTransform == -1) & (zoomType == 'reset')) {
        transformY = this.yScale
        console.log("Reset zoom")
      } else if ((zoomTransform == -1) & (zoomType == 'preset')) {
        transformY = this.yScale.domain([85, 95])
        console.log("Zoom preset")
      } else {
        transformY = zoomTransform.rescaleY(this.yScale)
      }
    } else {
      transformY = this.yScale
    }

    return transformY
  }

  render() {
    
    const {lapsData, resultsData} = this.props
    
    const yScale = this.newScales
    const xScale = this.xScale

    const xProps = {
      orient: 'Top',
      scale: xScale,
      translate: `translate(0, ${this.svgDimensions.height})`,
      tickSize: -this.svgDimensions.height+15,
      tickValues: range(1,65,5)
    }

    const yProps = {
      orient: 'Left',
      scale: yScale,
      translate: `translate(${this.margins.left}, 0)`,
      tickSize: this.svgDimensions.width,
      ticks:8
    }
    
    
    const lapsData_new = lapsData.map(d => {
      return {
          id: d.id,
          //color: Const.driverColors.filter(c => (c.driverRef == d.driverRef) && (c.season == d.season))[0].value, Note: using driverColors list may not be accurate, because recent seasons have shown that there may be mid-season driver changes
          color: Const.colorScale(resultsData.filter(c=> (c.driverRef == d.driverRef) && (c.season == d.season) && (c.raceName == d.raceName))[0].constructorRef),
          stroke: Const.toaddStroke(d.driverRef, d.season) ? 'black': 'white',
          x: xScale(d.lap),
          y: yScale(d.time),
          driverRef: d.driverRef,
          time: d.time
      }
    })
    //console.log(lapsData_new)
    
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
          transform={"translate(" + 20 + "," + (this.svgDimensions.height/2) + ")rotate(-90)"}>
          Time to complete (in sec)
        </text>
    </React.Fragment>
    )
  }

}

export default ScatterPlot;