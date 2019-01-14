import { scaleSequential, scaleSqrt } from 'd3-scale';
import { interpolateGreys } from 'd3-scale-chromatic'

var colorWithinNode = scaleSequential(interpolateGreys).domain([85, 105])
var radius = scaleSqrt().range([0, 7])

// PIE CHART WITHIN NODES
var DEFAULT_OPTIONS = {
    //node
    radius: 300,
    outerStrokeWidth: 0,
    parentNodeColor: '#EFB605',

    //arcPath
    outerArcLabel: 'Driver',
    innerArcLabel: 'No. of laps',
    arcId: 1,
    circleCenterX: 0,
    circleCenterY: 0,
    
    //piechart
    showPieLabels: false,
    showPieChartBorder: true,
    pieChartBorderColor: 'white',
    pieChartBorderWidth: '2',
    maxLaps: 20
};  

function getOptionOrDefault(key, options, defaultOptions) {
    defaultOptions = defaultOptions || DEFAULT_OPTIONS;
    if (options && key in options) {
        return options[key];
    }
    return defaultOptions[key];
}

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;
    return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians)) -5
    };
}

function describeArc(x, y, radius, startAngle, endAngle, modifyArc) {
  
  if (modifyArc == true) {
    startAngle = startAngle
  } 

  var start = polarToCartesian(x, y, radius, startAngle);
  var end = polarToCartesian(x, y, radius, endAngle);
  var arcLength = endAngle - startAngle;
  if (arcLength < 0) arcLength += 360;
  var longArc = arcLength >= 180 ? 1 : 0;

  var d = [
    "M", start.x, start.y,
    "A", radius, radius, 0, longArc, 1, end.x, end.y
  ].join(" ");

  return d;
}

function drawParentCircle(nodeElement, options) {
    var outerStrokeWidth = getOptionOrDefault('outerStrokeWidth', options);
    var radius = getOptionOrDefault('radius', options);
    var parentNodeColor = getOptionOrDefault('parentNodeColor', options);

    nodeElement.insert("circle")
        .attr("id", "parent-pie")
        .attr("r", radius)
        .attr("fill", function (d) {
            return parentNodeColor;
        })
        .attr("stroke", function (d) {
            return parentNodeColor;
        })
        .attr("stroke-width", outerStrokeWidth)

}

function drawPieChart(nodeElement, percentages, options) {
    var radius = getOptionOrDefault('radius', options);
    var parentNodeColor = getOptionOrDefault('parentNodeColor', options);
    var radius = radius-10
    var halfRadius = radius / 2;
    var halfCircumference = 2 * Math.PI * halfRadius;
    var maxLaps = getOptionOrDefault('maxLaps', options);
    
    var percentToDraw = 0
    percentages.forEach(function(p,i){
      percentToDraw += (1/maxLaps);

      nodeElement.insert('circle', '#parent-pie + *')
        .attr("r", halfRadius)
        .attr("fill", 'transparent')
        .style('stroke', (((percentages[i].time <= 105) && (percentages[i].time >= 85)) ? colorWithinNode(percentages[i].time) : parentNodeColor))
        .style('stroke-width', radius)
        .style('stroke-dasharray',
                halfCircumference * percentToDraw
                + ' '
                + halfCircumference)
    })
}

function drawPieChartBorder(nodeElement, options) {
    var radius = getOptionOrDefault('radius', options);
    var radius = radius - 10
    var pieChartBorderColor = getOptionOrDefault('pieChartBorderColor', options);
    var pieChartBorderWidth = getOptionOrDefault('pieChartBorderWidth', options);

    nodeElement.insert("circle")
        .attr("r", radius)
        .attr("fill", 'transparent')
        .attr("stroke", pieChartBorderColor)
        .attr("stroke-width", pieChartBorderWidth);
}

function drawStartMarker(nodeElement, options) {
    var radius = getOptionOrDefault('radius', options);
    var halfRadius = radius / 2;
    var halfCircumference = 2 * Math.PI * halfRadius;
    var pieChartBorderWidth = getOptionOrDefault('pieChartBorderWidth', options);
    var maxLaps = getOptionOrDefault('maxLaps', options);

    nodeElement.insert('circle', '#parent-pie + *')
        .attr("r", halfRadius)
        .attr("fill", 'transparent')
        .style('stroke', 'green')
        .style('stroke-width', radius)
        .style('stroke-dasharray',
                halfCircumference * 1/maxLaps
                + ' '
                + halfCircumference)
}

function drawArcsforName(nodeElement, d, options) {
  var parentNodeColor = getOptionOrDefault('parentNodeColor', options);

  // Draw arcs of nodes
  var arcs =  nodeElement.append("path")
    .attr("id", function(d) { return "s"+d.id; }) //Unique id of the path
    .attr("d", function(d) { return describeArc(d.vx, d.vy, radius(d.value), -160, 160); }) //SVG path
    .style("fill", "none")

  // Append text to arcs of nodes
  var arcPaths = nodeElement.append("text")
    .append('textPath')
      .filter(function(d) { return d.id <= 200 })
      .attr("fill", parentNodeColor)
      .attr("xlink:href", function(d) { return "#s"+d.id; }) //place the ID of the path here
      .attr("text-anchor", "middle") //place the text halfway on the arc
      .attr("startOffset", "50%")
      .text(function(d) { return d.label; })

}

function drawArcsforLapNumber(nodeElement, d) {
  var pieArc =  nodeElement.append("path")
    .attr("id", function(d) { return "lastLap"+d.id; }) //Unique id of the path
    .attr("d", function(d) { return describeArc(d.vx, d.vy, radius(d.value)-12, -160, 160) }) //SVG path
    //.attr("d", function(d) { return describeArc(d.vx, d.vy, radius(d.value)-12, -(d.maxLaps-d.laps+1)/d.maxLaps * 360, -(d.maxLaps-d.laps)/d.maxLaps * 360, true) }) //SVG path
    .style("fill", "none")

  // Append lap number to arcs of piechart
  var pieArcText = nodeElement.append("text")
    .append('textPath')
      .attr("fill", 'white')
      .attr("xlink:href", function(d) { return "#lastLap"+d.id; }) //place the ID of the path here
      .attr("text-anchor", "middle") //place the text halfway on the arc
      .attr("startOffset", "50%")    
      .style("font-weight", 'bold')
      .style("font-size", 8)
      .text(function(d) { return d.laps; })

}

function drawPieLabels(nodeElement, percentages, options) {
  var maxLaps = getOptionOrDefault('maxLaps', options);
  
  percentages.forEach(function(d,i){

    var pieArc =  nodeElement.append("path")
      .attr("id", "pie"+d.id+i) //Unique id of the path
      .attr("d", describeArc(d.vx, d.vy, radius(d.value)-24, 90+(360/maxLaps)*(i), 90+(360/maxLaps)*(i+1)))
      .style("fill", "none")

    // Append lap number to arcs of piechart
    var pieArcText = nodeElement.append("text")
      .append('textPath')
        .attr("fill", ((d.time >= 95) | (d.time == 85)) ? 'white' : 'black')
        .attr("xlink:href", "#pie"+d.id+i) //place the ID of the path here
        .attr("text-anchor", "middle") //place the text halfway on the arc
        .attr("startOffset", "50%")    
        .style("font-weight", 'bold')
        .style("font-size", 9)
        .text(d.time)
  })

}

export const NodePieBuilder = {
    drawNodePie: function (nodeElement, percentages, options) {
      //console.log(nodeElement)
      drawParentCircle(nodeElement, options);
  
      var showPieChartBorder = getOptionOrDefault('showPieChartBorder', options);
      if (showPieChartBorder) {
        drawPieChartBorder(nodeElement, options);
      } 

      if (!percentages) return;

      var showPieLabels = getOptionOrDefault('showPieLabels', options);
      if (showPieLabels) {
        drawPieLabels(nodeElement, percentages, options);
      } 

      drawArcsforName(nodeElement, percentages, options)
      drawArcsforLapNumber(nodeElement, percentages) 
      drawStartMarker(nodeElement, options);
      drawPieChart(nodeElement, percentages, options);
    }
}