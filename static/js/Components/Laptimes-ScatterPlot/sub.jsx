import React,{ Component} from 'react';
import { scaleBand, scaleLinear, scaleOrdinal } from 'd3-scale';
import { min, max, range } from 'd3-array';
import Dots from './DotsWithTooltips'
import Axis from '../../Shared-components/Axis'
import Tooltip from '../../Shared-components/Tooltip'
import Loading from '../../Shared-components/Loading';
import * as Const from '../../Shared-components/Constants';

class ScatterPlot extends Component {

	constructor(props) {
		super(props)
		
    this.wrapper = { width: props.width, height: props.height }
    this.margins = { top:30, right: 20, bottom: 20, left: 40 }
    this.svgDimensions = { width: this.wrapper.width - this.margins.left - this.margins.right, 
                           height: this.wrapper.height - this.margins.top - this.margins.bottom}

    this.xScale = scaleLinear()
                    .rangeRound([0, this.svgDimensions.width])

    this.yScale = scaleLinear()
                    .rangeRound([this.svgDimensions.height, 0])

		this.state = {
      data:[],
      xProps:"",
      yProps:"",
			tooltip:{ display:false,data:{key:'',value:''}}
		}
	}

  componentDidMount() {
    this.updateD3()
  }

	componentDidUpdate(prevProps) {
		if (this.props.zoomTransform !== prevProps.zoomTransform) {
			this.updateD3()
		}
    if (this.props.lapsData !== prevProps.lapsData) {
      this.updateD3()
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

	updateD3 = () => {

		const { lapsData, resultsData, zoomTransform, zoomType } = this.props
 
    var min_time = Const.round5(min(lapsData.map(d=>d.time)))
    var max_time = Const.round5(max(lapsData.map(d=>d.time)))
    if(max_time>150){
      max_time=150
    }
    this.yScale.domain([min_time-10, max_time])

    var max_lap = Const.round5(max(lapsData.map(d=>d.lap)))
    this.xScale.domain([0, max_lap])

    const xProps = {
      orient: 'Top',
      scale: this.xScale,
      translate: `translate(0, ${this.svgDimensions.height})`,
      tickSize: -this.svgDimensions.height,
      tickValues: range(0, max_lap+1, 5)
    }

    var transformY=""
		if (zoomTransform) {
			if ((zoomTransform == -1) & (zoomType == 'reset')) {
				transformY = this.yScale
				//console.log("Reset zoom")
			} else {
				transformY = zoomTransform.rescaleY(this.yScale)
			}
		} else {
			transformY = this.yScale
		}

    const yProps = {
      orient: 'Left',
      scale: transformY,
      translate: `translate(0, 0)`,
      tickSize: this.svgDimensions.width,
      ticks: 10
    }

	   const lapsData_new = lapsData.map(d => {
      return {
        id: d.id,
        //color: Const.driverColors.filter(c => (c.driverRef == d.driverRef) && (c.season == d.season))[0].value, Note: using driverColors list may not be accurate, because recent seasons have shown that there may be mid-season driver changes
        color: Const.colorScale(resultsData.filter(c=> (c.driverRef == d.driverRef) && (c.season == d.season) && (c.raceName == d.raceName))[0].constructorRef),
        stroke: Const.toaddStroke(d.driverRef, d.season) ? 'black': 'white',
        x: this.xScale(d.lap),
        y: transformY(d.time),
        driverRef: d.driverRef,
        time: d.time
      }
    })
    //console.log(lapsData_new)

    this.setState({data: lapsData_new, xProps: xProps, yProps: yProps})
	}

 	render() {
		
		const {data, xProps, yProps, tooltip} = this.state

    if(data.length != 0){
      var xaxis = <Axis {...xProps} />
      var yaxis = <Axis {...yProps} />
      var dots = <Dots
        data={data}
        onMouseOverCallback={this.handleMouseOver}
        onMouseOutCallback={this.handleMouseOut}
        tooltip={this.state.tooltip}
        options={{pre:"scatter_"}}
      />
    } else {
      var xaxis = <div></div>
      var yaxis = <div></div>
      var dots = <Loading/>
    }

		return (
      <React.Fragment>
        {xaxis}
        {yaxis}
        {dots}
        <Tooltip tooltip={tooltip}/> 
      </React.Fragment>
		)

	}

}

export default ScatterPlot;