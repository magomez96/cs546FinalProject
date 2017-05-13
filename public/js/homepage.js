window.onload = function() {
    var items = document.getElementsByClassName("itemContainer");
    for (var i = 0; i < items.length; i++) {
        var expDate = new Date(items[i].getAttribute("data-expDate"));
        var daysUntilExpiration = (expDate - new Date()) / (1000 * 60 * 60 * 24);
        console.log(items[i].nickname);
        console.log(expDate)
        console.log(daysUntilExpiration)
        if (daysUntilExpiration < 1 && daysUntilExpiration < 0) {
            items[i].classList.add("expireToday");
        } else if (daysUntilExpiration < 2 && daysUntilExpiration > 0) {
            items[i].classList.add("expireTomorrow");
        } else if (daysUntilExpiration < 7) {
            items[i].classList.add("expireThisWeek");
        }
    }
}