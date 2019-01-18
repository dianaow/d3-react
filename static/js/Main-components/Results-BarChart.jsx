import React,{ Component, Fragment } from 'react';
import { scaleBand, scaleLinear, scaleOrdinal } from 'd3-scale';
import { min, max, range } from 'd3-array';
import Axis from '../Shared-components/Axis'
import { drawText } from '../Shared-components/TextBuilder';
import { drawBar } from '../Shared-components/RectBuilder';
import Legend from './Results-Legend'
import * as Const from '../Shared-components/Constants';

class BarChart extends Component {

  textStatus = (e) => {

    if(e != "Finished" && e != "+1 Lap" && e != "+2 Laps" && e != "+3 Laps"  && e != "+4 Laps" ){
      return e.substring(0,3).toUpperCase()
    } else if(e == "Transmission" && e == "Clutch" && e == "Hydraulics"  && e == "Electrical" && e == "Radiator" && e == "Brakes"  && e == "Differential" && e == "Overheating"  && e == "Mechanical" && e == "Tyre" && e == "Puncture"  && e == "Drivershaft"){
      return "MEC"
    }
     else {
      return ""
    }
  }

  render() {
    
    const data = this.props.qualData
    const raceData = this.props.raceData

    const wrapper = { width: Const.width * (5/6), height: Const.height * (5/6)}
    const margins = { top: 60, right: 0, bottom: 100, left: 60 }
    const svgDimensions = { width: wrapper.width - margins.left - margins.right, 
                           height: wrapper.height - margins.top - margins.bottom}


    const xScale = scaleBand()
                      .padding(0.1)
                      .domain(data.map(d => d.driverRef))
                      .range([margins.left, svgDimensions.width])

    const yScale = scaleLinear()
                    .domain([0, max(data, d => d.position)])
                    .range([svgDimensions.height, margins.top])


    const yProps = {
      orient: 'Left',
      scale: yScale,
      translate: `translate(${margins.left}, 0)`,
      tickSize: 0,
      tickValues: range(0, max(data, d => d.position)+1, 2)
    }

    data.slice().forEach((d,i) => {
			data[i].x = xScale(d.driverRef)
			data[i].y = yScale(d.position)
			data[i].color = Const.colorScale(d.constructorRef)
			data[i].width = xScale.bandwidth()
			data[i].height = svgDimensions.height - yScale(d.position)
			data[i].stroke = Const.toaddStroke(d.driverRef, d.season) ? 'black': 'grey'
		})	
    const bars = drawBar(data)
    
    raceData.slice().forEach((d,i) => {
		  raceData[i].x = xScale(d.driverRef) + xScale.bandwidth()/2
			raceData[i].y = svgDimensions.height + margins.top/2
			raceData[i].status = this.textStatus(d.status)
		})	  
		const status = drawText(raceData, {value: 'status'})

    return (
      <svg width={wrapper.width} height={wrapper.height}>
        <g transform={"translate(" + (margins.left) + "," + (margins.top) + ")"}>
          <Axis {...yProps} />
          {bars}
          {status}
          <text 
            style={Const.textStyle}
            transform={"translate(" + 0 + "," + (svgDimensions.height/2 + margins.top) + ")rotate(-90)"}>
            Qualifying Position
          </text>
          <text 
            style={Const.textStyle}
            transform={"translate(" + (svgDimensions.width/2) + "," + (svgDimensions.height + margins.top) + ")"}>
            Race Finish Position
          </text>
          <text
            style={Const.topLegendStyle}
            transform={"translate(" + (margins.left) + "," + (svgDimensions.height + margins.top + 20) + ")"}>
              ACC: Accident, COL: Collison, ENG: Engine, GEA: Gearbox, SPU: Spun Off, SUS: Suspension
          </text>
        </g>
      </svg>
    );
  }

};

export default BarChart;