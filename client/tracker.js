// mutation
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

// no mutation
var withFullNames = function(ontology){
  var fullNameOntology = clone(ontology);
  addFullNames(fullNameOntology);
  return fullNameOntology;
}

/*
Inputs:
slider: 
  if levels is given the slider is discrete and the tooltip shows the level label.
  if levels not given then range and (optionlly) units should be.
*/

Template.tracker.helpers({
  branches: function(){
    var tree = TrackerTrees.findOne({userId: Meteor.user()._id});
    if (!tree){
      createTrackerOntology();
      return [];
    } else {
      var trackerOntology = withFullNames(tree.json);    
      return trackerOntology.branches;
    }
  }
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

    console.log('Inserting event:', event)

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


Template.trackerSlider.onRendered(function(){

  // Initialize slider
  
  var sliderDOMElement = this.find('.slider');

  var levels = this.data.levels;
  var units = this.data.units;
  var range = this.data.range;
  var min, max, step;

  units = (units === undefined) ? "" : units;
  
  if (levels === undefined){
    // range
    min = range[0];
    max = range[1];
    step = (range[1] - range[0]) / 100;
  } else {
    // discrete levels
    min = 0;
    max = levels.length - 1;
    step = 1;
  }
  
  $(sliderDOMElement).slider({
    units: units,
    levels: levels,
    min: min,
    max: max,
    step: step,
    value: min,
    orientation: 'horizontal',
    formater: function(value) {
      if (levels != undefined){
        return levels[value];
      } else {
        return value + " " + units;
      }
    }
  });
});
