import React, { Component } from 'react'
import * as d3 from 'd3-force';
import Dots from '../Laptimes-ScatterPlot/DotsWithTooltips'
import Tooltip from '../../Shared-components/Tooltip'
import * as Const from '../../Shared-components/Constants';
import { drawCircle, drawCircleInteractive } from '../../Shared-components/CircleBuilder';

class ForceGraph extends Component {

  constructor() {
    super()
    this.forceStrength = 0.8
    this.charge=1

    this.simulation = d3.forceSimulation()  
      .force('charge', d3.forceManyBody().strength(this.charge))
      .force("collide", d3.forceCollide(4))
      .alphaDecay(0.1)
      .velocityDecay(0.4)
      .stop()

    this.state = {
      nodes: [],
      tooltip:{ display:false,data:{key:'',value:''}}
    }

  }

  componentDidMount() {
    this.updateNodePositions(this.props.nodes)
  }

  componentDidUpdate(prevProps, prevState) {

    if (this.props.nodes != prevProps.nodes) {
        this.updateNodePositions(this.props.nodes)
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

  updateNodePositions = (nodes) => {
    this.simulation
      .nodes(nodes)
      .force('x', d3.forceX().strength(this.forceStrength).x(d => d.x))
      .force('y', d3.forceY().strength(this.forceStrength).y(d => d.y))
    
    for (var i = 0; i < 100; ++i) this.simulation.tick()

    this.setState({nodes})

  }

  render() {
    return (
      <React.Fragment>
        <Dots
          data={this.state.nodes}
          onMouseOverCallback={this.handleMouseOver}
          onMouseOutCallback={this.handleMouseOut}
          tooltip={this.state.tooltip}
          options={{pre:"beeswarm_", hover_radius:4, non_hover_radius:3}}
        />
        <Tooltip tooltip={this.state.tooltip}/> 
      </React.Fragment>
    )
  }

}

export default ForceGraph;