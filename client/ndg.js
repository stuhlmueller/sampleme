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
      bs.forEach(function(b){b.fullname=trackerOntology.name+":"+b.name})
    }
  })

  Template.branch.helpers(
    {
      extendBranchFullNames: function(bs){
        var fullname = this.fullname
        bs.forEach(function(b){b.fullname=fullname+":"+b.name})
      },
      extendInputFullNames: function(is){
        var fullname = this.fullname
        is.forEach(function(i){i.fullname=fullname+":"+i.name})
      }
    }
  )
