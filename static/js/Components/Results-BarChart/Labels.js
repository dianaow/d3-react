import React,{ Component, Fragment } from 'react';
import * as Const from '../../Shared-components/Constants';

class Labels extends Component {

  render() {
    
    const idx = this.props.data
    const {xScale, margins, svgDimensions} = this.props

    const DNF_indicator = (
      <rect
        className='dnf'
        x={xScale(idx[0])-1.5}
        y={-margins.top}
        width={xScale(idx.slice(-1)[0]) - xScale(idx[0]) + xScale.bandwidth()+3}
        height={50}
        fill="red"
        opacity={0.5}
      />
    )

    const DNF_box = (
      <rect
        className='dnf'
        x={xScale(idx[0])-3}
        y={-margins.top-3}
        width={xScale(idx.slice(-1)[0]) - xScale(idx[0]) + xScale.bandwidth()+6}
        height={svgDimensions.height+margins.top+6}
        fill="transparent"
        opacity={0.5}
        stroke={'red'}
        strokeWidth={3}
      />
    )

    const DNF_text = (
      <text
        className={Const.textStyle}
        x={xScale(idx[0])+5}
        y={0}>
        'Did Not Finish'
      </text>
    )

    return (
      <g>
        {DNF_indicator}
        {DNF_box}
        {DNF_text}
      </g>
    );
  }

};

export default Labels;