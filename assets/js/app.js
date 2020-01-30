// Chart setup
var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 150
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// SVG setup

var svg = d3.select("#scatter").append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);
    
// SVG append
var chartGroup = svg.append("g")
.attr("transform", `translate(${margin.left}, ${margin.top})`);

// Reading CSV
d3.csv("/assets/data/data.csv").then(function(seldata){
    seldata.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
    });
    // Scaling functions
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(seldata, d => d.poverty) -1, d3.max(seldata, d => d.poverty)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(seldata, d => d.healthcare)])
      .range([height, 0]);

    // Axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Axis append
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    var circlesGroup = chartGroup.selectAll("circle")
      .data(seldata)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d.poverty))
      .attr("cy", d => yLinearScale(d.healthcare))
      .attr("r", "20")
      .attr("fill", "blue") 
      .attr("opacity", "0.5");
    
    // Add state labels to the points
    var circleLabels = chartGroup.selectAll(null)
        .data(seldata)
        .enter()
        .append("text")
        .attr("dx", d => xLinearScale(d.poverty)-7)
        .attr("dy", d => yLinearScale(d.healthcare)+3)
        .text(function(d) {return d.abbr;})
        .attr("font-family", "sans-serif")
        .attr("font-size", "10px")
        .attr("fill", "black")
        .attr("font-weight", "900");
    
    /*var circlesGroup = chartGroup.selectAll("g")
        .data(seldata)
        .enter()
        .append("g")
        //.attr("x", d => xLinearScale(d.poverty))
        //.attr("y", d => yLinearScale(d.healthcare))
    
        circlesGroup.append("circle")
            .attr("x", d => xLinearScale(d.poverty))
            .attr("y", d => yLinearScale(d.healthcare))
            .attr("r", "15")
            .attr("fill", "blue") 
            .attr("opacity", "0.5")
        
        circlesGroup.append("text")
            //.attr("x", d => xLinearScale(d.poverty))
            //.attr("y", d => yLinearScale(d.healthcare))
            .text(d =>d.abbr)
            .attr("font-family", "sans-serif")
            .attr("font-size", "10px")
            .attr("fill", "black")*/

    // Create axes labels
    chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Lacks Healthcare (%)");

    chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    .attr("class", "axisText")
    .text("In Poverty (%)");

   // Tooltip
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`State: ${d.state}<br> Poverty: ${d.poverty}%<br>Obesity: ${d.obesity}%`);
      });
    chartGroup.call(toolTip);
      
    toolTip
      .style("background-color","black")
      .style("color","white")
      .style("padding","0.5px")
      .style("border-radius", "1px")
    
    // Event listeners
    circlesGroup.on("click", function(data) {
      toolTip.show(data, this);
    })
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });
});