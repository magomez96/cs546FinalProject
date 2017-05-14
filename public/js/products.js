/*Retrive data from modal when adding item to make
 *sure that it adds the right item id to the user
*/
$(document).ready(function (e) {
  $('#addItemModal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget)
    var recipient = button.data('upc')
    var modal = $(this)
    modal.find('#upc').val(recipient)
  })
});

/*Set date js calendar's max date to today so the user
 *cannot select a purchase date in the future
*/
$(document).ready(function () {
  var now = new Date(),
    maxDate = now.toISOString().substring(0, 10);
  $('#purDate').attr('max', maxDate);
});
