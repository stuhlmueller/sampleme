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

var trackerOntology = {
  name: "Tracker",
  branches: [
    {name: "Eat", inputs: [{name: "What", type: "text"}] },
    {name: "Drink", branches:
     [{name: "Caffeine", inputs: [{name: "Quantity", type: "slider"}]},
      {name: "Alcohol", inputs: [{name: "Quantity", type: "slider"}]}]},
    {name: "Mood", inputs: [{name: "Quality", type: "slider"}] }]
};

addFullNames(trackerOntology);


Template.trackerTree.helpers({
  branches: function(){
    return trackerOntology.branches;
  }
});


Template.trackerTree.onRendered(function(){  
  $('.slider').slider();  // initialize all sliders
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
        } else {
          event.value = $(obj).val();
        }
      });
    
    console.log(event)
    
    Meteor.call('insertEvent', event, function(error, results){
      if (error){
        return alert(error.reason);
      } else {
        // reset everything
        $('.trackerForm').trigger('reset');
        $('.subpane').hide();
        $('.slider .trackerInput').slider();
      }
    });
  }
});
