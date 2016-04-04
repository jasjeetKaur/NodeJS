var margin = {top:20 , right:10 , bottom:100 , left:40},
  width = 700 - margin.right - margin.left,
  height = 500 - margin.top - margin.bottom;

  var svg = d3.select('body')
    .append('svg')
    .attr({
      "width" : width + margin.right + margin.left,
      "height" : height + margin.top + margin.bottom,
    })
    .append('g')
    .attr("transform","translate(" + margin.left + ',' + margin.right + ')');

  var xScale = d3.scale.ordinal()
    .rangeRoundBands([0,width],0.2,0.2);

  var yScale = d3.scale.linear()
    .range([height,0]);

  var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom");

  var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left");

  d3.json("jsonFiles/indiaGrowth.json" , function(error,data){
    if (error) {
      console.log("error");
    }

    data.forEach(function(d){
      d.yearGrowth = +d.yearGrowth;
      d.year = d.year;
      console.log(d.yearGrowth);
    });

    xScale.domain(data.map(function(d){return d.year;}));
    yScale.domain([-6,d3.max(data,function(d){return d.yearGrowth;})]);

    svg.selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr({
      "x": function(d){ return xScale(d.year);},
      "y": function(d){ return yScale(d.yearGrowth);},
      "width": xScale.rangeBand(),
      "height": function(d){return height-yScale(d.yearGrowth);}

    });

    svg.append("g")
    .attr("class","x axis")
    .attr("transform","translate(0,"+height+")")
    .call(xAxis)
    .selectAll('text')
    .attr("transform","rotate(-90)")
    .attr("dx","-.8em")
    .attr("dy",".25em")
    .style("text-anchor","end")
    .style("font-size","12px");

    svg.append("g")
      .attr("class","y axis")
      .call(yAxis);

  });
