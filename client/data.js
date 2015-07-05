Template.eventsList.helpers({
  events: function(){
    return Events.find({userId: Meteor.user()._id},
                       {sort: {timestamp: -1}});
  }
});


Template.ratingsChart.rendered = function(){
  console.log('Template.ratingsChart.onRendered');
  
  //Width and height
  var boxWidth = $("#main").width();
  var boxHeight = Math.min(400,$(window).height() - 140);
  var margin = {top: 20, right: 40, bottom: 30, left: 50};
  var width = boxWidth - margin.left - margin.right;
  var height = boxHeight - margin.top - margin.bottom;

  var x = d3.time.scale()
      .range([0, width]);

  var y = d3.scale.linear()
      .range([height, 0]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

  var line = d3.svg.line()
      .x(function(d) {
	return x(d.date);
      })
      .y(function(d) {
	return y(d.value);
      });

  var svg = d3.select("#lineChart")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")");

  svg.append("g")
    .attr("class", "y axis")
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Rating");

  Deps.autorun(function(){
    console.log('drawing chart');
    var dataset = Events.find({userId: Meteor.user()._id},
                              {type: 'rating'},
                              {sort: {timestamp: -1}}).fetch();

    dataset.forEach(function(obj){
      // console.log(obj.timestamp);
      obj.date = obj.timestamp;
    });
    
    var paths = svg.selectAll("path.line")
	.data([dataset]); //todo - odd syntax here - should use a key function, but can't seem to get that working

    x.domain(d3.extent(dataset, function(d) { return d.timestamp; }));
    y.domain([0, 10]);

    //Update X axis
    svg.select(".x.axis")
      .transition()
      .duration(1000)
      .call(xAxis);
    
    //Update Y axis
    svg.select(".y.axis")
      .transition()
      .duration(1000)
      .call(yAxis);
    
    paths
      .enter()
      .append("path")
      .attr("class", "line")
      .attr('d', line);

    paths
      .attr('d', line); //todo - should be a transition, but removed it due to absence of key
    
    paths
      .exit()
      .remove();
  });
};


Template.eventItem.events({
  'click': function(e){
    e.preventDefault();
    Events.remove(this._id, function(error){
      if (error){
        throwError(error.reason);
      }
    });    
  }
});
