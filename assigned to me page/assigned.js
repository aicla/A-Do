function toggleMenu() {
    var menu = document.getElementById("menu");
    menu.classList.toggle("show");
}

function toggleOptions(optionClass) {
    var options = document.querySelector('.' + optionClass);

    var isActive = options.classList.contains('active');

    var allOptions = document.querySelectorAll('.v-options');
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

function selectOption(option) {
    var selectedOption = document.querySelector('.selected-option');
    selectedOption.textContent = option;
    toggleOptions('v-options'); 
}
