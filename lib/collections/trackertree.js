TrackerTrees = new Ground.Collection('trackertrees');

TrackerTrees.allow({
  insert: function(userId, doc){
    return userId === doc.userId;
  },
  update: function(userId, doc){
    return userId === doc.userId;
  }
});

defaultTrackerOntology = {
  name: "Tracker",
  branches: [
    {name: "Eat", inputs: [{name: "What", type: "text"}] },
    {name: "Drink", branches:
     [{name: "Caffeine", inputs: [{name: "Quantity", type: "slider", range: [0,5], units: "cups"}]},
      {name: "Alcohol", inputs: [{name: "Quantity", type: "slider", range: [0,10]}]}]},
    {name: "Mood", inputs: [{name: "Quality", type: "slider", levels:["very bad", "bad", "ok", "good", "very good"]}] }
  ]
};
