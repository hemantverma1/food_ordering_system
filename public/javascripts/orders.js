$(document).ready(function()
{
  $('.back').click(function(){
     location.href = "/orders";
  });

  $(".view").on("click", function(e) {
    e.preventDefault();
    var id = $(e.currentTarget).prop("id");
    location.href = "/user/myorders/" + id;
  });

  $(".delete").on("click", function(e) {
    e.preventDefault();
    var id = $(e.currentTarget).prop("id");
    $.ajax({
      url: "/orders/" + id,
      type: 'DELETE',
      success: function()
      {
        location.reload();
      },
      error: function()
      {
        console.log("Order removal unsuccessful.");
      }
    });
  });

  $(".process").on("click", function(e) {
    e.preventDefault();
    var id = $(e.currentTarget).prop("id");
    var isDisabled = $(e.currentTarget).hasClass("disabled");

    if(!isDisabled)
    {
      $.ajax({
        url: "/orders/" + id + "/process",
        type: 'POST',
        success: function() {
          location.reload();
        },
        error: function() {
          console.log("Order processing unsuccessful.");
        }
      });
    }
  });
});
