// Brent Kok
// 10725156
// Data Processing Week 4 - Scatter Plot

function load() {
              // Load the data from the data.csv file
          d3.json("scatter.json", function(error, data){
              
            if (error) throw error;

            // Setting margins for the place of the chart
            var margin = {top: 20, right: 20, bottom: 30, left: 40},
                width = 960 - margin.left - margin.right,
                height = 500 - margin.top - margin.bottom;


            // Adding the graph to the page
            var canvas = d3.select("body").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            // Changes the string (GDP in USD) to a number
            data.forEach(function(d) {
              d.["Population"] = +d["Population"];
              d.["GDP"] = +d["GDP"];
            });


            /*
            * Setup the X-value for Inhabitants/Population, 
            * transforming data to value, to a value on the chart
            */ 
            var xValue = function(d) { return d.Population;},
                xScale = d3.scale.linear().range([0, width]),
                xMap = function(d) { return xScale(xValue(d));},
                xAxis = d3.svg.axis().scale(xScale).orient("bottom");

            /*
            * Setup the Y-value for GDP in USD, 
            * transforming data to value, to a value on the chart
            */ 
            var yValue = function(d) { return d.GDP;},
                yScale = d3.scale.linear().range([height, 0]),
                yMap = function(d) { return yScale(yValue(d));},
                yAxis = d3.svg.axis().scale(yScale).orient("left");

            // Ensure that the dots don't overlap the axes
            xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
            yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);

            // Adding the tooltip area to the webpage
            var tooltip = d3.select("body").append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);


            // Include and append data on the X-axis
            canvas.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis)
                .append("text")
                        .attr("class", "label")
                        .attr("x", width)
                        .attr("y", -6)
                        .style("text-anchor", "end")
                        .text("Population");

            // Include and append data on the Y-axis
            canvas.append("g")
                .attr("class", "y axis")
                .call(yAxis)
                .append("text")
                        .attr("class", "label")
                        .attr("transform", "rotate(-90)")
                        .attr("y", 6)
                        .attr("dy", ".71em")
                        .style("text-anchor", "end")
                        .text("GDP (USD)");
          
            // Sort colors for countries
            var color_countries = [{"Member": {"<1960": "#2100ac"}}, {"Member": {"<1970": "#2120ac"}}, {"Member": {"<1980": "#2140ac"}}, {"Member": {"<1995": "#2160ac"}}, {"Member": {">2000": "#2180ac"}}];

            // Function to get color
            function coloring(member, dataset){
              // Loop to run through the 5 options
              for (var z = 0; z < 5; z++){
                if (member == Object.keys(dataset[z]["Member"])) {
                  return dataset[z]["Member"][member]
                }
              }
            }

            // Includes the data dots for the countries
            canvas.selectAll(".dot")
                .data(data)
                .enter().append("circle")
                .attr("class", "dot")
                      .attr("r", 3.5)
                      .attr("cx", xMap)
                      .attr("cy", yMap)
                      .style("fill", function(d) { return coloring(d.Member, color_countries); });

            // Draw rectangles for the legend
            var rectangle_widht = 12;
            var rectangle_height = 12;

            // Edit rectangles
            canvas.append("g")
              .selectAll("rectangle")
              .data(color_countries)
              .enter().append("rectangle")
                    .attr("class", "rectanglelegend")
                    .attr("width", rectangle_widht)
                    .attr("height", rectangle_height)
                    .attr("x", function(d,i) { return i*15;})
                    .style("fill", function(d, i){ return color_countries[i]["Member"]{Object.keys(color_countries[i]["Member"])}});
            
            // Edit restangles with regard to color  
            canvas.append("g")
              .selectAll("text")
              .data(color_countries)
              .enter().append("text")
                      .attr("class", "rectanglelegend")
                      .text(function(d, i) {return Object.keys(d.Member);})
                      .attr("x", width + margin.left + rect_width*2)  
                      .attr("y", function(d, i) { return i*20 - 3;})
                      .attr("dy", "1em"); 
      
            // Include legend to the scatter plot
            canvas.append("g").append("text")
              .attr("class", "rectanglelegend") 
              .attr("x", 845)
              .attr("y", -5)
              .text("Member");

            // Show data and change color when mouse hovers over the data
            .on("mouseover", function(d) {
                tooltip.transition()
                     .duration(200)
                     .style("opacity", .9);
                tooltip.html(d["Country"] + "<br/> (" + xValue(d) 
                + ", " + yValue(d) + ")")
                     .style("left", (d3.event.pageX + 5) + "px")
                     .style("top", (d3.event.pageY - 28) + "px");
            })

            // Make sure the color changes back when mouse left the dot
            .on("mouseout", function(d) {
                tooltip.transition()
                     .duration(500)
                     .style("opacity", 0);
            });

  });
}