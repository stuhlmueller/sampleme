Template.ratingForm.onRendered(function(){
  $('.slider').slider();
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
