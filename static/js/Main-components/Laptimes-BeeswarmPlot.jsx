import React,{ Component} from 'react';
import { scaleBand, scaleLinear, scaleOrdinal } from 'd3-scale';
import { min, max, range, sum, quantile } from 'd3-array';
import * as d3Collection from 'd3-collection';
import Axis from '../Shared-components/Axis'
import ForceGraph from '../Shared-components/ForceGraph'
import Loading from '../Shared-components/Loading';
import * as Const from '../Shared-components/Constants';

class BeeswarmPlot extends Component {

  constructor(props) {
    super(props)

    this.wrapper = { width: props.width, height: props.height }
    this.margins = { top: 60, right: 0, bottom: 0, left: 80 }
    this.svgDimensions = { width: this.wrapper.width - this.margins.left - this.margins.right, 
                           height: this.wrapper.height - this.margins.top - this.margins.bottom}


    this.xScale = scaleBand()
                    .rangeRound([this.margins.left, this.svgDimensions.width*2])
                    .padding(1)

    this.yScale = scaleBand()
                    .rangeRound([this.svgDimensions.height, this.margins.top])

  }


  formatDriverNames = (e) => {
    if(e.includes("_")){
      return e.split("_")[1]
    } else {
      return e
    }
  }

  getKeyValues = (arr) => {
      return arr.reduce((a,b) => {
          let keys = Object.keys(b);
          keys.forEach(v => {
            a.push(v)
          });
        return a
      }, [])
  }

  pruneObject = (object, desiredKeys) => {
    Object.keys(object)
      .filter(key => !desiredKeys.includes(key))  //Ignore desired keys
      .forEach(key => delete object[key])         //Remove the leftovers
  }
  
  createNodes = (lapsData, xScale, yScale) => {

    var data = lapsData.slice()

    // Get an array of all the sorted 'values' columns (or 1 sec intervals) 
    var value_fields = range(80.0, 110.0, 1)
    value_fields = value_fields.sort((a, b) => { return a-b })
    value_fields = value_fields.map(d => d.toFixed(1))
    var value_fields_str = value_fields.map(d => d.toString())

    xScale.domain(value_fields_str)
    yScale.domain(lapsData.map(d => d.constructorRef))

    // Add back the string labels
    var newItems = ['constructorRef', 'driverRef', 'season', 'raceName']; 
    let arr = value_fields.slice()
    arr.push(...newItems); 

    //Prune columns 'values' not in arr for each driver
    data.forEach((item,index) => this.pruneObject(item, arr)); 

    // Nest the data by driver name
    var drivers = d3Collection.nest()
                  .key(d => this.formatDriverNames(d.driverRef))
                  .entries(data)

    var nodes = [];

    // Iterate over each driver
    drivers.forEach((driver,driver_i) => {

      var temp_data = value_fields.map(function(col) {
          var x = driver.values[0][col];
          if (x === undefined) {
              x = 0;
          } 
          return x
      });

      // Create nodes based on absolute count.
      var cnt_so_far = 0;

      temp_data.forEach(function(d,i) {
          var new_nodes = range(d).map( x => {
              return {
                  id: driver.key + i.toString() + '_' + x.toString(),
                  radius: 3,
                  color: Const.colorScale(driver.values[0].constructorRef),
                  cx: xScale(value_fields_str[i]),
                  cy: yScale(driver.values[0].constructorRef),
                  season: driver.values[0].season,
                  driverRef: driver.key,
              };
          });
          nodes = nodes.concat(new_nodes);
          cnt_so_far += d;
      });
    
    drivers[driver_i].cnt = cnt_so_far;
    })

    return {nodes:nodes, xscale:xScale, yscale:yScale}
  }


  render() {
        
    const nodes = this.createNodes(this.props.lapsData, this.xScale, this.yScale)

    const xbandSize = nodes.xscale.bandwidth()
    const ybandSize = nodes.yscale.bandwidth()

    const xProps = {
      orient: 'Bottom',
      scale: nodes.xscale,
      translate: `translate(-${xbandSize/2}, ${this.svgDimensions.height})`,
      tickSize: 0
    }

    const yProps = {
      orient: 'Left',
      scale: nodes.yscale,
      translate: `translate(${this.margins.left}, -${ybandSize/2})`,
      tickSize: 0,
      tickValues: nodes.yscale.domain()
    }

    const chart = {
      width: this.props.width-this.margins.left-10,
      height: this.props.height,
      overflowX: 'scroll',
      float:'left'
    }

    const yaxis = {
      float:'left'
    }

    const wrap = {
      minWidth: this.props.width,
      height: this.props.height,
    }

    if (nodes.nodes.length != 0) {
      var forces = 
          <ForceGraph
            nodes={nodes.nodes}
            svgDimensions={this.svgDimensions}
          />
     } else {
      var forces = <Loading width="1200" height="850"/>
    }

    return (
      <div style={wrap}>
        <div id ='yaxis' style={yaxis}>
          <svg width={this.margins.left} height={this.wrapper.height}>
            <Axis {...yProps} />
          </svg>
        </div>
        <div id='chart' style={chart}>
          <svg width={this.wrapper.width*2-this.margins.left} height={this.wrapper.height}>
            <g style={{overflow:"auto"}}>
              // use React to draw all the nodes, d3 already calculated the x and y
              {forces}
              <text 
                style={Const.textStyle}
                transform={"translate(" + (this.svgDimensions.width/2) + "," + (this.svgDimensions.height+40) + ")"}>
                Time to complete (in sec)
              </text>
              <text
                style={Const.topLegendStyle}
                transform={"translate(" + (this.margins.left) + "," + 10 + ")"}>
                  Laps where driver made a pitstop are not included. Only laptimes completed within 85 to 105 seconds are included.
              </text>
            </g>
            <Axis {...xProps} />
          </svg>
        </div>
      </div>
    )
  }

}

export default BeeswarmPlot;