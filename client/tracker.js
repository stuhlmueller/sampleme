var addFullNames = function(ontology){
  if (!ontology.fullName){
    ontology.fullName = ontology.name; // root
  }
  if (ontology.branches){
    ontology.branches.forEach(function(branch){
      branch.fullName = ontology.fullName + '-' + branch.name;
      addFullNames(branch);
    });
  }
  if (ontology.inputs){
    ontology.inputs.forEach(function(input){
      input.fullName = ontology.fullName + '-' + input.name;
    });
  }
};

/*


Inputs:
slider: if levels is given the slider is discrete and the tooltip shows the level label.
  if levels not given then range and (optionlly) units should be.
*/

var trackerOntology = {
  name: "Tracker",
  branches: [
    {name: "Eat", inputs: [{name: "What", type: "text"}] },
    {name: "Drink", branches:
     [{name: "Caffeine", inputs: [{name: "Quantity", type: "slider", range: [0,5], units: "cups"}]},
      {name: "Alcohol", inputs: [{name: "Quantity", type: "slider", range: [0,10]}]}]},
    {name: "Mood", inputs: [{name: "Quality", type: "slider", levels:["bad", "ok", "good"]}] },
    {name: "Twowords", inputs: [{name: "Check spaces", type: "slider", levels:["bad", "ok", "good"]}] }
  ]
};



addFullNames(trackerOntology);


Template.tracker.helpers({
  branches: function(){
    return trackerOntology.branches;
  }
});


Template.tracker.onRendered(function(){
  $('.slider').each(function(i,x){
    var levels=$(x).attr('data-levels');
    levels = (levels==undefined)?undefined:levels.split(",")
    var units=$(x).attr('data-units');
    units = (units==undefined)?"":units
    $(x).slider({
      formater: function(value) {
        if(levels!=undefined){
          return levels[value]
        } else {
          return value + " " + units
        }
      } // initialize slider
    })
  })
});


Template.trackerBranch.events({
  'click button.toggle-subpane': function(e){
    e.preventDefault();
    e.stopPropagation();
    var subPaneId = $(e.toElement).data('target');
    $(subPaneId).toggle();
  }
});


Template.trackerInput.helpers({
  isSlider: function(){
    return (this.type === 'slider');
  }
});

//TODO: there is probably a more elegant way to get the slider info into the element...
Template.trackerSlider.helpers({
  min: function(){
    var levels=this.levels, range=this.range;
    if (levels==undefined){
      return range[0]
    } else {
      return 0
    }
  },
  max: function(){
    var levels=this.levels, range=this.range;
    if (levels==undefined){
      return range[1]
    } else {
      return levels.length-1
    }
  },
  step: function(){
    var levels=this.levels, range=this.range;
    if (levels==undefined){
      return (range[1]-range[0])/100
    } else {
      return 1
    }
  },
  levels: function(){
    return this.levels;
  },
  units: function(){
    return this.units;
  }
});


Template.trackerInputs.events({
  'submit form': function(e, t) {
    e.preventDefault();

    // get info from all the input elements
    var event = {
      type: 'tracker'
    };
    t.$('.trackerInput').map(
      function(ind, obj){
        event.subtype = obj.name;
        if ($(obj).hasClass('slider')){
          event.value = $(obj).slider('getValue');
          //TODO: record the level label if there is one.
        } else {
          event.value = $(obj).val();
        }
      });

    console.log(event)

    Meteor.call('insertEvent', event, function(error, results){
      if (error){
        return alert(error.reason);
      }
    });

    // Reset everything
    $('.trackerForm').trigger('reset');
    $('.subpane').hide();
    $('.slider .trackerInput').slider();    
    
  }
});
