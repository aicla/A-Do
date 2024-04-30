function toggleMenu() {
    var menu = document.getElementById("menu");
    menu.classList.toggle("show");
}

function deleteItem() {
    var box = document.querySelector(".box");
    box.remove();
}
