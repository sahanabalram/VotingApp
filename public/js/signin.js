$(document).ready (function() {
    $(document).on("click", "#toggle", function(e){
      e.preventDefault();
      $(".card.effect__click").toggleClass("flipped");
    });
});