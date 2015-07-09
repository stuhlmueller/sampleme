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
  name: "Base",
  branches: [
    {name: "Eat", inputs: [{name: "What", type: "text"}] },
    {name: "Drink", branches:
     [{name: "Caffeine", inputs: [{name: "Quantity", type: "slider"}]},
      {name: "Alcohol", inputs: [{name: "Quantity", type: "slider"}]}]}]
};

addFullNames(trackerOntology);


Template.trackerTree.helpers({
  branches: function(){
    return trackerOntology.branches;
  }
});


Template.inputs.events({
  'submit form': function(e, t) {
    e.preventDefault();

    //get info from all the input elements
    var data = t.$(':input').map(function(ind, obj){
      return {name: obj.name, value: obj.value}}) //checkme: value or val()?

    console.log(data)

    Meteor.call('insertEvent', rating, function(error, results){
      if (error){
        return alert(error.reason);
      } else {
        // reset slider
        // $("#rating").slider();
        
      }
    });
  }
});
