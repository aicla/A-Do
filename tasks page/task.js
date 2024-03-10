function toggleMenu() {
    var menu = document.getElementById("menu");
    menu.classList.toggle("show");
}

function toggleOptions(optionClass) {
    var options = document.querySelector('.' + optionClass);

    var isActive = options.classList.contains('active');
    
    var allOptions = document.querySelectorAll('.v-options, .v-opt2, .v-opt3');
    allOptions.forEach(function(option) {
        if (option !== options) {
            option.classList.remove('active');
        }
    });
    
    if (!isActive) {
        options.classList.add('active');
    } else {
        options.classList.remove('active');
    }
}
