/* Determine if item on homepage expires today, tomorrow or this this week 
 * and add the proper class to it for css styling
 */
window.onload = function() {
    var items = document.getElementsByClassName("itemContainer");
    for (var i = 0; i < items.length; i++) {
        var expDate = new Date(items[i].getAttribute("data-expDate"));
        var daysUntilExpiration = (expDate - new Date()) / (1000 * 60 * 60 * 24);
        if (daysUntilExpiration < 1 && daysUntilExpiration < 0) {
            items[i].classList.add("expireToday");
        } else if (daysUntilExpiration < 2 && daysUntilExpiration > 0) {
            items[i].classList.add("expireTomorrow");
        } else if (daysUntilExpiration < 7) {
            items[i].classList.add("expireThisWeek");
        }
    }
}

/*Retrive data from modal when adding item to make
 *sure that it adds the right item id to the user
 */
$(document).ready(function(e) {
    $('#editItemModal').on('show.bs.modal', function(event) {
        var button = $(event.relatedTarget)
        var recipient = button.data('id')
        var modal = $(this)
        modal.find('#editItemForm').attr("action", `/items/${recipient}`);
    })
});

/*Set date js calendar's max date to today so the user
 *cannot select a purchase date in the future
 */
$(document).ready(function() {
    var now = new Date(),
        maxDate = now.toISOString().substring(0, 10);
    $('#purDate').attr('max', maxDate);
});