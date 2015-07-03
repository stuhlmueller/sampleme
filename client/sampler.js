Template.ratingForm.onRendered(function(){
  $('.slider').slider();
});

Template.ratingForm.events({
  'submit form': function(e) {
    e.preventDefault();

    var rating = {
      value: $("#rating").slider('getValue')
    };

    Meteor.call('insertRating', rating, function(error, results){
      if (error){
        return alert(error.reason);
      } else {
        // reset slider
        $("#rating").slider();
      }      
    });
  }
});
