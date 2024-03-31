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

document.getElementById("kid_star_button").addEventListener("click", function() {
    var icon = document.getElementById("kid_star_icon");
    if (icon.classList.contains("filled")) {
        icon.classList.remove("filled");
    } else {
        icon.classList.add("filled");
    }
    });


const dropdowns = document.querySelectorAll('.teams');

dropdowns.forEach(teams => {
    const select = teams.querySelector('.select');
    const caret = teams.querySelector('.caret');
    const menu = teams.querySelector('.dropdown');
    const options = teams.querySelectorAll('.dropdown li');
    const selected = teams.querySelector('.selected');
    
    select.addEventListener('click', () => {
        caret.classList.toggle('caret-rotate');
        menu.classList.toggle('menu-open');
    });

    options.forEach(option => {
        option.addEventListener('click', () => {
            selected.innerText = option.innerText;
            caret.classList.remove('caret-rotate');
            menu.classList.remove('menu-open');
            options.forEach(option => {
                option.classList.remove('chosen');
            });
            option.classList.add('chosen');
        });
    });
});
