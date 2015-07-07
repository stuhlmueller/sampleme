var trackerOntology =
  [{name: "Eat", inputs: [{name: "what", type: "text"}] },
   {name: "Drink", branches:
                    [{name: "Caffeine", inputs: [{name: "quantity", type: "slider"}]},
                     {name: "Alchohol", inputs: [{name: "quantity", type: "slider"}]}]}
  ]

Template.trackerTree.helpers(
  {branches: function() {
    return trackerOntology;
    }
  })
