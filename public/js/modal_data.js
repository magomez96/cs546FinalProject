
$(document).ready(function (e) {
  $('#addItemModal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget) // Button that triggered the modal
    var recipient = button.data('upc') // Extract info from data-* attributes
    // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
    // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
    console.log("TEST")
    console.log(recipient)
    var modal = $(this)
    modal.find('#upc').val(recipient)
  })
});

