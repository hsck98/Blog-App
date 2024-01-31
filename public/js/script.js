changeGenre(0);

function changeGenre(genreId) {
  $(".activeGenre").removeClass("activeGenre");
  $("#genre" + genreId).addClass("activeGenre");
  $(".carousel").addClass("d-none");
  if ($("#carouselGenre" + genreId).length) {
    $(".emptySlide").addClass("d-none");
    $("#carouselGenre" + genreId).removeClass("d-none");
  } else {
    $(".emptySlide").removeClass("d-none");
  }

  $(".left.carousel-control").attr("onClick", "$('#carouselGenre" + genreId + "').carousel('prev')");
  $(".right.carousel-control").attr("onClick", "$('#carouselGenre" + genreId + "').carousel('next')");
}

function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function (e) {
      $("#uploaded_img").attr('src', e.target.result);
      $("#uploaded_img").removeClass("d-none");
      $("#default_upload_img").addClass("d-none");
    };

    reader.readAsDataURL(input.files[0]);
  }
}

$("#genre").on("change", function() {
  if(this.value === "newGenre") {
    $(".form-new-genre").removeClass("d-none");
  } else {
    $(".form-new-genre").addClass("d-none");
  }
});

$(".anchorPost").click(function() {
  location.href = "/view-post?id=" + this.id.slice(10,11);
});

$(".deletePost").click(function(event) {
  event.preventDefault();
  if(!confirm("Are you sure you want to delete this post?")) {
    event.stopPropagation();
    return;
  }
  
  $.post("/delete-post", {deletePost: parseInt(this.id.slice(10,11))}, window.location.replace("/"));
  event.stopPropagation();
});