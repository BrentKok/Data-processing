// Brent Kok
// 10725156
// Data Processing Week 5 - Line Graph
// https://bl.ocks.org/jqadrad/a58719d82741b1642a2061c071ae2375


window.onload = function() {
	
	// Setting margins for the place of the chart
	var svg = d3.select('svg'),
		margin = {top: 30, right: 40, bottom: 30, left: 50},
		width = 600 - margin.left - margin.right,
		height = 270 - margin.top - margin.bottom,
  		g = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

	// Graph of the title
	g.append('text')
		.attr('x', (width - 2))             
		.attr('y', 0 - (margin.top / 3))
		.attr('text-anchor', 'middle')  
		.style('font-size', '16px') 
		.text('Temperature De Bilt & Berkhout');

	// Transform date
	var	parseDate = d3.time.format("%Y%m%d").parse;

	// Scale x and y
	var	x = d3.time.scale().range([0, width]);
	var	y = d3.scale.linear().range([height, 0]);

	var color = d3.scale.category10();

	var	xAxis = d3.svg.axis().scale(x)
		.orient("bottom");

	var	yAxis = d3.svg.axis().scale(y)
		.orient("left");

	// Initialise line
	var	line = d3.svg.line()
		.x(function(d) { return x(d.date); })
		.y(function(d) { return y(d.temp); });
	
	// Create svg element
	var	svg = d3.select("body").append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
		.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");


	d3.json("line.json", function(error, data) {
		//data.forEach(function(d){
			//d.date = parseDate(d.date);
			//d.values = +d.values;
	//	});

		if (error) throw error;

		// Log data as a check
		console.log(data);

		// Select columns
		color.domain(d3.keys(data[0]).filter(function(key) { 
			return key !== "date" && key !== "Max" && key !== "Min" && key !== "Average";
		}));

		var Station = color.domain().map(function(name) {
			return {
				name: name,
				values: data.map(function(d) {
					return {date: d.date, temp: +d[name]};
				})
			};
		});

		// Set the domain for X
		x.domain(d3.extent(data, function(d) { return d.date; }));
		
		// Set the domain for Y
		y.domain([
			d3.min(Station, function(c) { return d3.min(c.values, function(v) { return v.temp; }); }),
			d3.max(Station, function(c) { return d3.max(c.values, function(v) { return v.temp; }); })
		]);


	/*
	svg.selectAll("*").remove();

	var legend = svg.selectAll('g')
		.data(Station)
		.enter()
	.append('g')
		.attr('class', 'legend');

	legend.append('rect')
		.attr('x', width - 20)
		.attr('y', function(d, i){ return i * 20;})
		.attr('width', 10)
		.attr('height', 10)
		.style('fill', function(d){
			return color(d.name);
		});

	legend.append('text')
		.attr('x', width - 8)
		.attr('y', function(d, i){ return (i * 20) + 9;})
		.text(function(d){ return d.name; });

	legend
			.on("click", function(d){
				reDraw(d.name);
			});
	*/
	
	// Setting the X-axis including attributes
		svg.append("g")		
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call (xAxis)
		.append("text")
			.attr("transform", "rotate(0)")
			.attr("x", -15)
			.attr("dx", ".71em")
			.style("text-anchor", "end")
			.text("Date");

	    // Setting the Y-axis including attributes
		svg.append("g")
			.attr("class", "y axis")
			.call(yAxis)
		.append("text")
			.attr("transform", "rotate(-90)")
			.attr("y", -15)
			.attr("dy", ".71em")
			.style("text-anchor", "end")
			.text("Temperature in C");

		var Station = svg.selectAll(".Station")
			.data(Station)
			.enter().append("g")
			.attr("class", "Station");

	    // Draw lines
		Station.append("path")
			.attr("class", "line")
			.attr("d", function(d) { 
				return line(d.values); 
			})
			.style("stroke", function(d) { 
				return color(d.name); 
			});

		Station.append("text")
			.datum(function(d) { 
				return { 
					name: d.name, 
					value: d.values[d.values.length - 1]
				}; 
			})
			.attr("transform", function(d) { 
				return "translate(" + x(d.value.date) + "," + y(d.value.temp) + ")"; 
			})
			.attr("x", 3)
			.attr("dy", ".35em")
			.text(function(d) { 
				return d.name; 
			});

		Station.selectAll("circle")
			.data(function(d){return d.values})
			.enter()
			.append("circle")
			.attr("r", 3)
			.attr("cx", function(d) { 
				return x(d.date); 
			})
			.attr("cy", function(d) { 
				return y(d.values); 
			})
			.style("fill", function(d,i,j) { 
				return color(Station[j].name); 
			});
	});
}		