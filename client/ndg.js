var trackerOntology =
{name: "base",
 branches: [{name: "Eat", inputs: [{name: "what", type: "text"}] },
   {name: "Drink", branches:
                    [{name: "Caffeine", inputs: [{name: "quantity", type: "slider"}]},
                     {name: "Alchohol", inputs: [{name: "quantity", type: "slider"}]}]}
  ]
}

Template.trackerTree.helpers(
  {
    branches: function(){return trackerOntology.branches},
    addFullnames: function(bs){
      bs.forEach(function(b){b.fullname=trackerOntology.name+"-"+b.name})
    }
  })

Template.branch.helpers(
    {
      extendBranchFullNames: function(bs){
        var fullname = this.fullname
        bs.forEach(function(b){b.fullname=fullname+"-"+b.name})
      }
    }
  )

Template.inputs.helpers(
      {
        extendInputFullNames: function(is){
          var fullname = this.fullname
          is.forEach(function(i){i.fullname=fullname+"-"+i.name})
        }
      }
    )

Template.inputs.events({
      'submit form': function(e,t) {
        e.preventDefault();

        //get info from all the input elements
        var data = t.$(':input').map(function(ind,obj){
          return {name: obj.name, value: obj.value}}) //checkme: value or val()?

        console.log(data)

        // Meteor.call('insertEvent', rating, function(error, results){
        //   if (error){
        //     return alert(error.reason);
        //   } else {
        //     // reset slider
        //     $("#rating").slider();
        //   }
        // });
      }
    });
