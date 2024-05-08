export const memberNames = [];

document.addEventListener("DOMContentLoaded", function () {
    const addMemberButton = document.querySelector(".add-member");
    const memberListBox = document.querySelector(".member-list-box");
    const memberListContainer = document.querySelector(".button-container");

    addMemberButton.addEventListener("click", function () {
        const memberInput = document.querySelector(".text-input");
        const memberName = memberInput.value.trim();

        if (memberName !== "") {
            // Check if the member name already exists
            if (!memberNames.includes(memberName)) {
                memberNames.push(memberName);
            }
            // Clear input field
            memberInput.value = "";

            // Populate member list box
            populateMemberListBox();

            // Adjust button container position
            adjustButtonContainerPosition();
        }
    });

    function populateMemberListBox() {
        // Clear existing content
        memberListBox.innerHTML = "";
    
        // Populate with member names and lines
        memberNames.forEach(function (name) {
            const memberItem = document.createElement("div");
            memberItem.textContent = name;
    
            // line after each member name
            const line = document.createElement("div");
            line.classList.add("line");
    
            memberListBox.appendChild(memberItem);
            memberListBox.appendChild(line);
        });
    
        // Show member list box
        memberListBox.style.display = "block";
    }

    function adjustButtonContainerPosition() {
        // Get height of the member list box
        const memberListBoxHeight = memberListBox.offsetHeight;
        
        // Adjust top margin of the button container
        memberListContainer.style.marginTop = `${memberListBoxHeight + 20}px`;
    }
});
