// Get the modals
var modal = document.getElementById("modal");
var membersModal = document.getElementById("members-modal");
var addTeamModal = document.getElementById("add-team-modal");

// Get the back buttons
var backButton = modal.querySelector(".back-button");
var membersBackButton = membersModal.querySelector(".back-button");
var addTeamBackButton = addTeamModal.querySelector(".cancel-btn");

// Get the button that opens the modal
var boxes = document.querySelectorAll(".box .team");

// Loop through each team box and add click event listener
boxes.forEach(function(box) {
    box.addEventListener("click", function() {
        modal.style.display = "block";
        hideScrollbar(); 
    });
});

// When the user clicks on the back button in the team content modal, close the modal
backButton.onclick = function() {
    modal.style.display = "none";
    showScrollbar();
};

// When the user clicks on the "Members" button, open the members modal
var membersButton = document.querySelector(".members-btn");
membersButton.onclick = function() {
    membersModal.style.display = "block";
    hideScrollbar(); 
};

// When the user clicks on the back button in the members modal, close the modal
membersBackButton.onclick = function() {
    membersModal.style.display = "none";
    hideScrollbar();
};

// When the user clicks on the add icon, open the add team modal
var addIcon = document.querySelector(".add");
addIcon.onclick = function() {
    addTeamModal.style.display = "block";
    hideScrollbar(); 
};

// When the user clicks on the CANCEL button in the add team modal, close the modal
addTeamBackButton.onclick = function() {
    addTeamModal.style.display = "none";
    showScrollbar();
};

// Function to hide scrollbar
function hideScrollbar() {
    document.body.style.overflow = 'hidden';
}

// Function to show scrollbar
function showScrollbar() {
    document.body.style.overflow = '';
}