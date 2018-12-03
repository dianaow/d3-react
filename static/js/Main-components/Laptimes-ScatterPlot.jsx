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
    this.updateD3(props)

    this.state = {
      tooltip:{ display:false,data:{key:'',value:''}}
    }
  }

  componentDidUpdate(prevProps, prevState) {

    if (this.props != prevProps) {
        this.updateD3(this.props)
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
    const { lapsData, width, height, zoomTransform, zoomType } = props
    console.log(zoomTransform)
    this.margins = { top: 60, right: 0, bottom: 0, left: 60 }
    this.svgDimensions = { width: this.width - this.margins.left - this.margins.right, 
                           height: this.height - this.margins.top - this.margins.bottom}

    this.xScale = scaleBand()
                    .domain(lapsData.map(d => d.lap))
                    .range([this.margins.left, this.svgDimensions.width])

    this.yScale = scaleLinear()
                    .domain([min(lapsData.map(d => d.time))-1, max(lapsData.map(d => d.time))])
                    .range([this.svgDimensions.height, this.margins.top])
 
    if (zoomTransform && zoomType === "detail") {
      this.xScale.domain(zoomTransform.rescaleX(this.xScale).domain())
      this.yScale.domain(zoomTransform.rescaleY(this.yScale).domain())
    }

    this.bandSize = this.xScale.bandwidth()
    console.log(this.bandSize)

  }

  get transform() {
    const { x, y, zoomTransform, zoomType } = this.props;
    let transform = "";
 
    if (zoomTransform && zoomType === "scale") {
      transform = `translate(${x + zoomTransform.x}, ${y + zoomTransform.y}) scale(${zoomTransform.k})`;
    }else{
      transform = `translate(${x}, ${y})`;
    }
 
    return transform;
  }

  render() {
    
    const {lapsData} = this.props

    const xProps = {
      orient: 'Bottom',
      scale: this.xScale,
      translate: `translate(-${this.bandSize/2}, ${this.svgDimensions.height})`,
      tickSize: this.svgDimensions.height-this.margins.top,
      tickValues: this.xScale.domain().filter((d,i) => { return !(i%4)})
    }

    const yProps = {
      orient: 'Left',
      scale: this.yScale,
      translate: `translate(${this.margins.left}, 0)`,
      tickSize: 0,
      tickValues: range(Math.round(min(lapsData.map(d => d.time))), Math.round(max(lapsData.map(d => d.time))+1), 1)
    }

    const lapsData_new = lapsData.map(d => {
      return {
          id: d.id,
          radius: 3, 
          color: Const.driverColorScale(d.constructorRef),
          x: this.xScale(d.lap),
          y: this.yScale(d.time),
          driverRef: d.driverRef,
          time: d.time
      }
    })

    return (
      <React.Fragment>
        <Axis {...xProps} />
        <Axis {...yProps} />
        <g transform={this.transform}>
          <Dots
            data={lapsData_new}
            onMouseOverCallback={this.handleMouseOver}
            onMouseOutCallback={this.handleMouseOut}
            tooltip={this.state.tooltip}
          />
        </g>
        <Tooltip
          tooltip={this.state.tooltip}
        /> 
        <text 
          style={Const.textStyle}
          transform={"translate(" + 10 + "," + (this.svgDimensions.height/2) + ")rotate(-90)"}>
          Time to complete (in sec)
        </text>
        <text 
          style={Const.textStyle}
          transform={"translate(" + (this.svgDimensions.width/2) + "," + (this.svgDimensions.height+30) + ")"}>
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