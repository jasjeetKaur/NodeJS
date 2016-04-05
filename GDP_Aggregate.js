function a()
{
var margin = {top:20 , right:10 , bottom:100 , left:40},
  width = 500 - margin.right - margin.left,
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

  d3.json("jsonFiles/GDP_Continent_Aggregate.json" , function(error,data){
    if (error) {
      console.log("error");
    }

    data.forEach(function(d){
      d.aggregate = +d.aggregate;
      d.continent = d.continent;
      console.log(d.aggregate);
    });

    xScale.domain(data.map(function(d){return d.continent;}));
    yScale.domain([0,d3.max(data,function(d){return d.aggregate;})]);

    svg.selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr({
      "x": function(d){ return xScale(d.continent);},
      "y": function(d){ return yScale(d.aggregate);},
      "width": xScale.rangeBand(),
      "height": function(d){return height-yScale(d.aggregate);}

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
    .style("font-size","16px");

    svg.append("g")
      .attr("class","y axis")
      .call(yAxis)
      .style("font-size","12px");

  });
}

function b()
{

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
        d.valueOfYear = +d.valueOfYear;
        d.year = d.year;
        console.log(d.valueOfYear);
      });

      xScale.domain(data.map(function(d){return d.year;}));
      yScale.domain([-6,d3.max(data,function(d){return d.valueOfYear;})]);

      svg.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr({
        "x": function(d){ return xScale(d.year);},
        "y": function(d){ return yScale(d.valueOfYear);},
        "width": xScale.rangeBand(),
        "height": function(d){return height-yScale(d.valueOfYear);}

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

}
function c()
{

  var margin = {top: 20, right: 20, bottom: 30, left: 40},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  //var x = d3.scale.ordinal()
  //  .rangeRoundBands([0, width], .5);
  var x = d3.scale.ordinal()
      .rangeRoundBands([0,width],0.2,0.2);

  var y = d3.scale.linear()
      .rangeRound([height, 0]);

  var color = d3.scale.ordinal()
      .range(["#98abc5","red"]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .tickFormat(d3.format(".1s"));

  var svg = d3.select("body").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  d3.json("jsonFiles/GDP_Top15_Country1.json", function(error, data) {
    if (error) throw error;

    color.domain(d3.keys(data[0]).filter(function(key) { return key !== "country"; }));

    data.forEach(function(d) {
      var y0 = 0;
      d.gdpgni = color.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name]}; });
      d.total = d.gdpgni[d.gdpgni.length - 1].y1;
    });
    x.domain(data.map(function(d) { return d.country; }));
    y.domain([0, d3.max(data, function(d) { return d.total; })]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);


    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("GDP Gni");

    var country = svg.selectAll(".country")
        .data(data)
      .enter().append("g")
        .attr("class", "g")
        .attr("transform", function(d) { return "translate(" + x(d.country) + ",0)"; });

    country.selectAll("rect")
        .data(function(d) { return d.gdpgni; })
      .enter().append("rect")
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return y(d.y1); })
        .attr("height", function(d) { return y(d.y0) - y(d.y1); })
        .style("fill", function(d) { return color(d.name); });

    var legend = svg.selectAll(".legend")
        .data(color.domain().slice().reverse())
      .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d; });

  });

}

function d()
{
  var margin = {top: 20, right: 20, bottom: 30, left: 40},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  var x = d3.scale.ordinal()
      .rangeRoundBands([0, width], .5);

  var y = d3.scale.linear()
      .rangeRound([height, 0]);

  var color = d3.scale.ordinal()
      .range(["#98abc5","red"]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .tickFormat(d3.format(".1s"));

  var svg = d3.select("body").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  d3.json("jsonFiles/GDP_Top15_Country2.json", function(error, data) {
    if (error) throw error;

    color.domain(d3.keys(data[0]).filter(function(key) { return key !== "countryName"; }));

    data.forEach(function(d) {
      var y0 = 0;
      d.gdpgni = color.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name]}; });
      d.total = d.gdpgni[d.gdpgni.length - 1].y1;
    });
    x.domain(data.map(function(d) { return d.countryName; }));
    y.domain([0, d3.max(data, function(d) { return d.total; })]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("GDP Gni");

    var countryName = svg.selectAll(".countryName")
        .data(data)
      .enter().append("g")
        .attr("class", "g")
        .attr("transform", function(d) { return "translate(" + x(d.countryName) + ",0)"; });

    countryName.selectAll("rect")
        .data(function(d) { return d.gdpgni; })
      .enter().append("rect")
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return y(d.y1); })
        .attr("height", function(d) { return y(d.y0) - y(d.y1); })
        .style("fill", function(d) { return color(d.name); });

    var legend = svg.selectAll(".legend")
        .data(color.domain().slice().reverse())
      .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d; });

  });

}
