// Brent Kok
// 10725156
// Data Processing Week 5 - Line Graph

function load() {
 
          // Load the data from the data.csv file
          d3.json("line.json", function(error, data){
              
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

          var parseTime = d3.timeParse("%d%m%Y");

          var x = d3.scaleTime().range[0, width],
              y = d3.scaleLinear().range([height, 0]),
              z = d3.scaleOrdinal(d3.schemeCategory10);

          var line = d3.line()
              .curve(d3.curveBasis)
              .x(function(d) { return x(d.date); })
              .y(function(d) { return y(d.average); })

            var region = data.columns.slice(1).map(function(id) {
              return {
                id: id,
                values: data.map(function(d) {
                  return {date: d.date, average: d[id]};
                })
              };
            })

            x.domain(d3.extent(data, function(d) { return d.date; }));

            y.domain([
              d3.min(region, function(c) { return d3.min(c.values, function(d) { return d.average; }); }),
              d3.max(region, function(c) { return d3.max(c.values, function(d) { return d.average; }); })
            ]);

            z.domain(region.map(function(c) { return c.id; }));

            g.append("g")
                .attr("class", "axis axis--x")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x));

            g.append("g")
                .attr("class", "axis axis--y")
                .call(d3.axisLeft(y))
              .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", "0.71em")
                .attr("fill", "#000")
                .text("Temperature, C");

            var region = g.selectAll(".region")
              .data(region)
              .enter().append("g")
                .attr("class", "region");

            city.append("path")
                .attr("class", "line")
                .attr("d", function(d) { return line(d.values); })
                .style("stroke", function(d) { return z(d.id); });

            city.append("text")
                .datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
                .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.average) + ")"; })
                .attr("x", 3)
                .attr("dy", "0.35em")
                .style("font", "10px sans-serif")
                .text(function(d) { return d.id; });
          });

          function type(d, _, columns) {
            d.date = parseTime(d.date);
            for (var i = 1, n = columns.length, c; i < n; ++i) d[c = columns[i]] = +d[c];
            return d;
          }
}