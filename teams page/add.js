const memberNames = [];

document.addEventListener("DOMContentLoaded", function () {
    const suggestionBox = document.getElementById("suggestionBox");
    const memberListBox = document.getElementById("memberListBox");
    const memberInput = document.querySelector(".text-input");
    const buttonContainer = document.querySelector(".button-container");
    let memberNames = [];

    suggestionBox.style.display = "none";
    memberListBox.style.display = "none";

    function populateSuggestions(filteredNames) {
        suggestionBox.innerHTML = "";

        filteredNames.forEach(function (name) {
            const suggestionItem = document.createElement("div");
            suggestionItem.textContent = name;
            suggestionItem.classList.add("suggestion-item");

            suggestionItem.addEventListener("click", function () {
                memberInput.value = name;
                suggestionBox.style.display = "none";
            });

            suggestionBox.appendChild(suggestionItem);
        });

        const box2Rect = document.querySelector(".box2").getBoundingClientRect();
        suggestionBox.style.display = "block";
        suggestionBox.style.left = `${box2Rect.left}px`;
        suggestionBox.style.top = `${box2Rect.bottom}px`;
        suggestionBox.style.width = `${box2Rect.width}px`;
    }

    function updateMemberList() {
        memberListBox.innerHTML = "";

        memberNames.forEach(function (name) {
            const memberItem = document.createElement("div");
            memberItem.textContent = name;
            memberListBox.appendChild(memberItem);

            const line = document.createElement("div");
            line.classList.add("line");
            memberListBox.appendChild(line);
        });

        memberListBox.style.display = "block";
        adjustButtonContainerPosition();
    }

    function adjustButtonContainerPosition() {
        const box2Rect = document.querySelector(".box2").getBoundingClientRect();
        const memberListBoxHeight = memberListBox.offsetHeight;
        const buttonContainer = document.querySelector(".button-container");
        const buttonContainerHeight = buttonContainer.offsetHeight;

        let newTop = box2Rect.bottom + memberListBoxHeight + 20;

        const viewportHeight = window.innerHeight;
        const bottomMargin = 20;
        if (newTop + buttonContainerHeight > viewportHeight - bottomMargin) {
            newTop = viewportHeight - bottomMargin - buttonContainerHeight;
        }

        buttonContainer.style.top = `${newTop}px`;
    }

    memberInput.addEventListener("input", function () {
        const typedText = memberInput.value.trim().toLowerCase();

        if (typedText === "") {
            suggestionBox.style.display = "none";
            return;
        }

        const filteredNames = memberNames.filter(name => name.toLowerCase().startsWith(typedText));

        if (filteredNames.length > 0) {
            populateSuggestions(filteredNames);
        } else {
            suggestionBox.style.display = "none";
        }
    });

    memberInput.addEventListener("keyup", function (e) {
        if (e.key === "Enter") {
            const memberName = memberInput.value.trim();
            if (memberName !== "") {
                if (!memberNames.includes(memberName)) {
                    memberNames.push(memberName);
                    updateMemberList();
                }

                memberInput.value = "";
                suggestionBox.style.display = "none";
            }
        }
    });

});

export { memberNames };