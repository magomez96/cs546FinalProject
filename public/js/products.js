function show(ID) {
    //console.log(ID);
    var formToShow = document.getElementById("add-" + ID.toString());
    var buttonToHide = document.getElementById("button-" + ID.toString());
    var liToResize = document.getElementById(ID.toString());
    //console.log("add-" + ID.toString())
    formToShow.classList.remove("hidden");
    buttonToHide.classList.add("hidden");
    liToResize.classList.remove("itemContainer");
    liToResize.classList.add("itemContainerBig");
}

function hide(ID) {
    //console.log(ID);
    var formToHide = document.getElementById("add-" + ID.toString());
    var buttonToShow = document.getElementById("button-" + ID.toString());
    var liToResize = document.getElementById(ID.toString());
    //console.log("add-" + ID.toString())
    formToHide.classList.add("hidden");
    buttonToShow.classList.remove("hidden");
    liToResize.classList.remove("itemContainerBig");
    liToResize.classList.add("itemContainer");
}