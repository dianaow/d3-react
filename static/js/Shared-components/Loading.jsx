import React,{ Component, Fragment } from 'react';
import * as Const from '../Shared-components/Constants';

export default class Loading extends Component {

  render() {

    return (
    	<svg width={Const.width} height={Const.height}>
            <text dx="650" dy="300" fontSize='3em' className="heavy">Loading...</text>
    	</svg>
    )
  }
}
