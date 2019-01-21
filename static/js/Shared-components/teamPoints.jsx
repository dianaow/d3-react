import React, { Component, Fragment } from 'react'
import { drawText } from './TextBuilder';
import { drawRect } from './RectBuilder';
import * as Const from './Constants';

export default class Legend extends Component {
	

	sumPoints = (data) => {
		const sum = [
		  ...data.reduce(
		    (map, item) => {
		      const { constructorRef: key, points } = item;
		      const prev = map.get(key);
		      if(prev) {
		        prev.points += points
		      } else {
		        map.set(key, Object.assign({}, item))
		      }
		      
		      return map
		    },
		    new Map()
		  ).values()
		]

		return sum
	}

    sortPoints = (summedPoints, tmp) => {

    	const uniqTeams = [...new Set(summedPoints.map(d => d.constructorRef))]
		var filtered = [];

		Const.teamColors.map(d => {
		   uniqTeams.map(f => {
		       if(d.key == f){
		          filtered.push(d);
		         }
		   })
		})

        filtered.sort((a, b) => { return tmp.indexOf(b.key) - tmp.indexOf(a.key) })
	    return filtered
    }

	render() {

	    const raceData = this.props.data

	    var summedPoints = this.sumPoints(raceData)
	    summedPoints.sort((a, b) => { return (b.points) - (a.points) })
	    var tmp = summedPoints.map(d => d.constructorRef)
	    var filt_colormap = this.sortPoints(summedPoints, tmp)
		
		filt_colormap.forEach((d,i) => {
			filt_colormap[i].id = tmp.indexOf(d.key)
			filt_colormap[i].x = 30
			filt_colormap[i].y = (tmp.indexOf(d.key) * 30)+60
			
		})
		const legendText = drawText(filt_colormap, {pre:'label_', fontSize:'12px', textAnchor:'start', value:'key'})
		
		summedPoints.forEach((d,i) => {
			summedPoints[i].id = tmp.indexOf(d.constructorRef)
			summedPoints[i].x = 115
			summedPoints[i].y = (tmp.indexOf(d.constructorRef) * 30)+60
			
		})
		const legendCalc = drawText(summedPoints, {pre:'points_', fill:'white', fontSize:'14px', textAnchor:'middle', fontWeight:'bold', value:'points'})
		
		filt_colormap.forEach((d,i) => {
			filt_colormap[i].x = 100
			filt_colormap[i].y = (tmp.indexOf(d.key) * 30)+45
			filt_colormap[i].color = d.value
		})	    
		const legendColorBar = drawRect(filt_colormap, {width:30, height:30})
		
	    return (
	    <svg className='team-legend' width={Const.wrapper.width/8} height={Const.wrapper.height}>
	      	<text x={100} y={30}>Points</text>
	      	{legendColorBar}
		    {legendText}
		    {legendCalc}
		</svg>
	    )
	}

}