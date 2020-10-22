// Code Here

// Chart area and set margins
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 45,
  bottom: 60,
  left: 90
};

// Subtract margins from total chart area
var chartHeight = svgHeight - margin.top - margin.bottom;
var chartWidth  = svgWidth - margin.left - margin.right;

// SVG container
var svg = d3
    .select('#scatter')
    .append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight)
    .append("g")

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.select(".chart").append("div").attr("class","tooltip").style("opacity",0);
  
// Read from data.csv
d3.csv("assets/data/data.csv", function(err, listData) {

  if (err) throw err;
    
  // Format
  listData.forEach(function(data) {
  data.poverty = +data.poverty;
  data.healthcare = +data.healthcare;
});
  
       // FSet x and y scale
      var yLinearScale = d3.scaleLinear().range([chartHeight, 0]);
      var xLinearScale = d3.scaleLinear().range([0, chartWidth]);
  
      // Create funxtions for each axis
      var bottomAxis = d3.axisBottom(xLinearScale);
      var leftAxis = d3.axisLeft(yLinearScale);
  
      // Scale 
      xLinearScale.domain([8,
          d3.max(listData, function(data) {
          return +data.poverty * 1.07;
        }),
      ]);

      yLinearScale.domain([0,
          d3.max(listData, function(data) {
          return +data.healthcare * 1.2;
        }),
      ]);
  
      // Tool tip
      var toolTip = d3
        .tip()
        .attr('class', 'tooltip')
        .offset([60, 15])
        .html(function(data) {
            var state = data.state;
            var poverty = +data.poverty;
            var healthcare = +data.healthcare;
            return (
            state + '<br> Poverty (%): ' + poverty + '<br> Lacks Healthcare (%)): ' + healthcare
            );
        });
  
      chartGroup.call(toolTip);
      
      // Create Scatter
      chartGroup
      .selectAll('circle')
      .data(listData)
      .enter()
      .append('circle')
      .attr('cx', function(data, index) {
        return xLinearScale(data.poverty);
      })
      .attr('cy', function(data, index) {
        return yLinearScale(data.healthcare);
      })
      .attr('r', '16')
      .attr('fill', 'lightgreen')
      .attr('fill-opacity',0.6)
      .attr('stroke', 'salmon')
      
      // Mouseover
      .on("mouseover",function(data) {
        toolTip.show(data,this);
      })
      // Mouseout
      .on("mouseout", function(data, index) {
        toolTip.hide(data,this);
      });

      // CG1
      chartGroup
        .append('g')
        .attr('transform', `translate(0, ${chartHeight})`)
        .call(bottomAxis);
  
      chartGroup.append('g').call(leftAxis);
  
      svg.selectAll(".dot")
      .data(listData)
      .enter()
      .append("text")
      .text(function(data) { return data.abbr; })
      .attr('x', function(data) {
        return xLinearScale(data.poverty);
      })
      .attr('y', function(data) {
        return yLinearScale(data.healthcare);
      })
      .attr("font-size", "10px")
      .attr("fill", "black")
      .style("text-anchor", "middle");

      // CG2
      chartGroup
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0 - margin.left + 40)
        .attr('x', 0 - chartHeight / 2)
        .attr('dy', '1em')
        .attr('class', 'axisText')
        .text('No Healthcare (%)');
  
      // CG3
      chartGroup
        .append('text')
        .attr(
          'transform',
          'translate(' + chartWidth / 2 + ' ,' + (chartHeight + margin.top + 40) + ')',
        )
        .attr('class', 'axisText')
        .text('Poverty (%)');

      //Event listeners with transitions for obesity vs income to be added. 


})