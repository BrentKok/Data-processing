// Gets the data from data.json
d3.json("data.json", function(error, data) {
  if (error) throw error;

  // Formats the data
  data.forEach(function(d) {
      d.date = parseTime(d.date);
      d.close = +d.close;
  });

  // Makes sure that the range of the data fits the scale
  x.domain(d3.extent(data, function(d) { return d.date; }));
  y.domain([0, d3.max(data, function(d) { return d.close; })]);

  // Adding the x Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // Applies the text label for the X-axis
  svg.append("text")             
      .attr("transform",
            "translate(" + (width/2) + " ," + 
                           (height + margin.top + 20) + ")")
      .style("text-anchor", "middle")
      .text("Date");

  // Adding the y Axis
  svg.append("g")
      .call(d3.axisLeft(y));

  // Applies the text label for the X-axis
  svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Rain"); 
}}






