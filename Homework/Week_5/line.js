// Brent Kok
// 10725156
// Data Processing Week 5 - Line Graph

window.onload = function() {
	
	// Setting margins for the place of the chart
	var	margin = {top: 30, right: 40, bottom: 30, left: 50},
		width = 600 - margin.left - margin.right,
		height = 270 - margin.top - margin.bottom;

	// Transform date
	var	parseDate = d3.time.format("%Y%m%d").parse;

	// Scale x and y
	var	x = d3.time.scale().range([0, width]);
	var	y = d3.scale.linear().range([height, 0]);

	var color = d3.scale.category10();

	// Initialise line
	var	line = d3.svg.line()
		.x(function(d) { console.log(d.date, d.value); return x(parseDate(d.date)); })
		.y(function(d) { return y(d.value); });
	
	// Create svg element
	var	svg = d3.select("body").append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
		.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	d3.json("line.json", function(error, data) {
		if (error) throw error;

		// Log data as a check
		console.log(data);

		// Select columns
		color.domain(d3.keys(data[0]).filter(function(key) { 
			return key !== "date" && key !== "Max" && key !== "Min" && key !== "Average";
		}));

		var Stations = color.domain().map(function(name) {
			return {
				d: d,
				values: data.map(function(d) {
					return {date: parseDate(d.date), values: +d[d]};
				})
			};
		});
		console.log(Stations)
		
		// Set the domain for X
		x.domain(d3.extent(data["260"]["Max"], function(d) { return parseDate(d.date); }));
		
		// Set the domain for Y
		y.domain([
			d3.min(d3.entries(data["260"]), function(c) { return d3.min(c.value, function(v) { return v.value; }); }),
			d3.max(d3.entries(data["260"]), function(c) { return d3.max(c.value, function(v) { return v.value; }); })
		]);

		// Scale X and Y axis
		var	xAxis = d3.svg.axis().scale(x)
			.orient("bottom");

		var	yAxis = d3.svg.axis().scale(y)
			.orient("left");

		// Setting the X-axis including attributes
		svg.append("g")		
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call (xAxis)
		.append("text")
			.attr("transform", "rotate(0)")
			.attr("x", -25)
			.attr("dx", ".71em")
			.style("text-anchor", "end")
			.text("");

		// Setting the Y-axis including attributes
		svg.append("g")
			.attr("class", "y axis")
			.call(yAxis)
		.append("text")
			.attr("transform", "rotate(-90)")
			.attr("y", 4)
			.attr("dy", ".71em")
			.style("text-anchor", "end")
			.text("Temperature in C");

		var Station = svg.selectAll(".Station")
			.data(["Min", "Average", "Max"])
			.enter().append("g")
			.attr("class", "City");

		// Draw lines
		Station.append("path")
			.attr("class", "line")
			.attr("d", function(d) { 
				return line(data["260"][d]); 
			})
			.style("stroke", function(d) { 
				return color(d); 
			});

		Station.append("text")
			.datum(function(d) { 
				return { 
					name: d, 
					value: d
				}; 
			})
			.attr("transform", function(d) { 
				return "translate(" + x(d.value.date) + "," + y(d.value.value) + ")"; 
			})
			.attr("x", 250)
			.attr("dy", ".35em")
			.text(function(d) { 
				return d.name; 
			});

		Station.selectAll("circle")
			.data(function(d){return d})
			.enter()
			.append("circle")
			.attr("r", 3)
			.attr("cx", function(d) { 
				return x(d.date); 
			})
			.attr("cy", function(d) { 
				return y(d.value); 
			})
			.style("fill", function(d,i,j) { 
				return color(Station.d); 
			});
	
  });
}