import React, { Component } from "react";
import ReactDOM from "react-dom";
import { transition } from 'd3-transition'
import { easeCubicInOut } from 'd3-ease'

class BarsOneRace extends Component {

    componentDidMount() {
        console.log(this.props.x)
        this.addBars()
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props !== prevProps) {
          this.addBars()
        }
    }

    addBars = () => {
        console.log(this.props.ref)
        d3.select(this.props.ref)
          .transition()
          .duration(1000)
          .ease(easeCubicInOut)
          .enter()
          .append('rect')   
            .attr('key', this.props.key)
            .attr('x', this.props.x)
            .attr('y', this.props.y)
            .attr('fill', this.props.fill)
            .attr('width', this.props.width)
            .attr('height', this.props.height)
    }

}

export default BarsOneRace;
