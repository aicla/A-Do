// Global array to store the names of members added to the list
const memberNames = [];

// List of available users to suggest from
const availableUsers = [
    "Sunshine Chuyat", "Verna Fe Dizon", "Aira Nicole Bucu",
    "Jazleen Razote", "Vehuel Amante"
];

// Event listener to execute when the DOM content is fully loaded
document.addEventListener("DOMContentLoaded", function () {
    // Get references to the necessary DOM elements
    const suggestionBox = document.getElementById("suggestionBox");
    const memberListBox = document.getElementById("memberListBox");
    const memberInput = document.querySelector(".text-input");
    const buttonContainer = document.querySelector(".button-container"); // Define buttonContainer here

    // Initially hide the suggestion and member list boxes
    suggestionBox.style.display = "none";
    memberListBox.style.display = "none";

    // Function to populate the suggestion box with filtered names
    function populateSuggestions(filteredNames) {
        // Clear any existing suggestions
        suggestionBox.innerHTML = "";

        // Create a suggestion item for each filtered name
        filteredNames.forEach(function (name) {
            const suggestionItem = document.createElement("div");
            suggestionItem.textContent = name;
            suggestionItem.classList.add("suggestion-item");

            // Add click event to select the suggested name
            suggestionItem.addEventListener("click", function () {
                if (!memberNames.includes(name)) {
                    memberNames.push(name); // Add the selected name to the member list
                    updateMemberList(); // Update the member list display
                }
                memberInput.value = ""; // Clear the input field
                suggestionBox.style.display = "none"; // Hide the suggestion box
            });

            // Append the suggestion item to the suggestion box
            suggestionBox.appendChild(suggestionItem);
        });

        // Position the suggestion box below the input field
        const box2Rect = document.querySelector(".box2").getBoundingClientRect();
        suggestionBox.style.display = "block";
        suggestionBox.style.left = `${box2Rect.left}px`;
        suggestionBox.style.top = `${box2Rect.bottom}px`;
        suggestionBox.style.width = `${box2Rect.width}px`;
    }

    // Function to update the member list display
    function updateMemberList() {
        // Clear any existing member items
        memberListBox.innerHTML = "";

        // Create a member item for each name in the memberNames array
        memberNames.forEach(function (name) {
            const memberItem = document.createElement("div");
            memberItem.textContent = name;
            memberListBox.appendChild(memberItem);

            // Add a line separator after each member item
            const line = document.createElement("div");
            line.classList.add("line");
            memberListBox.appendChild(line);
        });

        // Display the member list box
        memberListBox.style.display = "block";
        adjustButtonContainerPosition(); // Adjust the position of the button container
    }

    // Function to adjust the position of the button container
    function adjustButtonContainerPosition() {
        // Calculate the new position based on the member list box height
        const box2Rect = document.querySelector(".box2").getBoundingClientRect();
        const memberListBoxHeight = memberListBox.offsetHeight;
        const buttonContainerHeight = buttonContainer.offsetHeight;

        let newTop = box2Rect.bottom + memberListBoxHeight + 20;

        // Adjust if the new position goes beyond the viewport height
        const viewportHeight = window.innerHeight;
        const bottomMargin = 20;
        if (newTop + buttonContainerHeight > viewportHeight - bottomMargin) {
            newTop = viewportHeight - bottomMargin - buttonContainerHeight;
        }

        // Set the new top position for the button container
        buttonContainer.style.top = `${newTop}px`;
    }

    // Event listener for input field changes
    memberInput.addEventListener("input", function () {
        const typedText = memberInput.value.trim().toLowerCase();

        // Hide the suggestion box if input is empty
        if (typedText === "") {
            suggestionBox.style.display = "none";
            return;
        }

        // Filter available users based on input text
        const filteredNames = availableUsers.filter(name => name.toLowerCase().startsWith(typedText));

        // Show suggestions if there are matches, otherwise hide the suggestion box
        if (filteredNames.length > 0) {
            populateSuggestions(filteredNames);
        } else {
            suggestionBox.style.display = "none";
        }
    });
});

// Export the memberNames array
export { memberNames };
