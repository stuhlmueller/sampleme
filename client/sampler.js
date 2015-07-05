Template.ratingForm.onRendered(function(){
  $('.slider').slider();
});

Template.ratingForm.events({
  'submit form': function(e) {
    e.preventDefault();

    var rating = {
      value: $("#rating").slider('getValue'),
      type: 'rating'
    };

    Meteor.call('insertEvent', rating, function(error, results){
      if (error){
        return alert(error.reason);
      } else {
        // reset slider
        $("#rating").slider();
      }      
    });
  }
});
