$(document).ready(function (e) {
  $('#addItemModal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget)
    var recipient = button.data('upc')
    var modal = $(this)
    modal.find('#upc').val(recipient)
  })
});

$(document).ready(function () {
  var now = new Date(),
    maxDate = now.toISOString().substring(0, 10);
  $('#purDate').attr('max', maxDate);
});
