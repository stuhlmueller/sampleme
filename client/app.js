_.extend(App, {
  promptToggleVal: false
});

App.helpers = {
  user: function(){return Meteor.user();}
};

_.each(App.helpers, function (helper, key) {
  UI.registerHelper(key, helper);
});

Template.ratingForm.onRendered(function(){
  $('.slider').slider();
});

var sampleDelay = function(callback){
  return runWebPPLCode(
    "exponential(.5) * 2000",
    function(s, delay){
      console.log('Sampled delay using webppl: ', delay);
      return callback(delay);});
};

var continuousNotification = function(){
  console.log('continuousNotification');
  sampleDelay(
    function(delay){
      console.log('delay:', delay);
      setTimeout(
        function(){
          var title = "SampleMe"; // template.$('[data-field="title"]').val()
          var message = "Hey, it's time to check in!"; // template.$('[data-field="message"]').val()
          Meteor.call('notify', title, message, function(err, res) {
            if (err) {
	      console.log(err);
            } else {
              console.log('res', res);
	      if (res.userCount) {
	        console.log('Notification sent.');
	      }
              // if notifications are enabled
              if (App.promptToggleVal){
                continuousNotification();
              }
            }
          });
        }, delay);
    });
}

Template.notificationTest.events({
  'click [data-action="send-notification"], submit': function (event, template) {
    event.preventDefault();    
    continuousNotification();
  }
});

Template.ratingForm.events({
  'submit form': function(e) {
    e.preventDefault();

    var rating = {
      value: $("#rating").slider('getValue'),
      timestamp: new Date(),
      userId: Meteor.user()._id
    };
    rating._id = Ratings.insert(rating);

    $("#rating").slider();
    // Router.go('postPage', post);
  },

  'change #promptToggle': function(e){
    console.log('change #promptToggle', e);
    var promptToggleVal = $('#promptToggle').val();
    console.log('promptToggleVal', promptToggleVal);
    global.promptToggleVal = promptToggleVal; // FIXME: store in db
  }
});

Template.ratingsList.helpers({
  ratings: function(){
    return Ratings.find({userId: Meteor.user()._id},
                        {sort: {timestamp: -1}});
  }
});

Accounts.ui.config({
  passwordSignupFields: 'USERNAME_ONLY'
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
    var dataset = Ratings.find({userId: Meteor.user()._id},
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
