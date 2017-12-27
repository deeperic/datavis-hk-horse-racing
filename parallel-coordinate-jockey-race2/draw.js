// linear color scale
var blue_to_brown = d3.scale.linear()
  .domain([1, 14])
  .range(["Red", "Green"])
  .interpolate(d3.interpolateLab);

var colorgen = d3.scale.ordinal()
    .domain([1, 14])
    .range(["#a6cee3","#1f78b4","#b2df8a","#33a02c",
            "#fb9a99","#e31a1c","#fdbf6f","#ff7f00",
            "#cab2d6","#6a3d9a","#ffff99","#b15928"]);
            
// interact with this variable from a javascript console
var pc1;

// load csv file and create the chart
//d3.csv('cars.csv', function(data) {
d3.csv('jockey_pc.csv', function(data) {
  pc1 = d3.parcoords()("#example")
    .data(data)
    .hideAxis(["Number"])
    .composite("darken")
    .margin({ top: 24, left: 50, bottom: 12, right: 0 })
    .color(function(d) { return colorgen(d['Number']); })  // quantitative color scale
    .alpha(0.65)
    .render()
    .brushMode("1D-axes")  // enable brushing
    .interactive()  // command line mode

  var explore_count = 0;
  var exploring = {};
  var explore_start = false;
  pc1.svg
    .selectAll(".dimension")
    .style("cursor", "pointer")
    .on("click", function(d) {
      exploring[d] = d in exploring ? false : true;
      event.preventDefault();
      if (exploring[d]) d3.timer(explore(d,explore_count));
    });

  function explore(dimension,count) {
    if (!explore_start) {
      explore_start = true;
      d3.timer(pc1.brush);
    }
    var speed = (Math.round(Math.random()) ? 1 : -1) * (Math.random()+0.5);
    return function(t) {
      if (!exploring[dimension]) return true;
      var domain = pc1.yscale[dimension].domain();
      var width = (domain[1] - domain[0])/4;

      var center = width*1.5*(1+Math.sin(speed*t/1200)) + domain[0];

      pc1.yscale[dimension].brush.extent([
        d3.max([center-width*0.01, domain[0]-width/400]),
        d3.min([center+width*1.01, domain[1]+width/100])
      ])(pc1.g()
          .filter(function(d) {
            return d == dimension;
          })
      );
    };
  };

});