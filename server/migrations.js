var ratings = Ratings.find({});
ratings.forEach(function(rating){
  if (Events.findOne({timestamp: rating.timestamp}) == null){
    Events.insert({
      type: 'rating',
      value: rating.value,
      timestamp: rating.timestamp,
      userId: rating.userId
    });
    console.log('inserted', rating);
  }
})
