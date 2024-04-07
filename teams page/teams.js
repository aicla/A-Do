// Function to hide scrollbar
function hideScrollbar() {
    document.body.style.overflow = 'hidden';
}

// Function to show scrollbar
function showScrollbar() {
    document.body.style.overflow = '';
}

// Get the modal
var modal = document.getElementById("modal");

// Get the back button
var backButton = document.querySelector(".back-button");

// Get the button that opens the modal
var boxes = document.querySelectorAll(".box .team");

// Loop through each team box and add click event listener
boxes.forEach(function(box) {
    box.addEventListener("click", function() {
        modal.style.display = "block";
        hideScrollbar(); // Hide the scrollbar when modal appears
    });
});

// When the user clicks on the back button, close the modal
backButton.onclick = function() {
    modal.style.display = "none";
    showScrollbar(); // Show the scrollbar when modal is closed
};
