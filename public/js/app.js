"use strict"

import { signUpUser, signInUser, signOutUser, resetPassword, getCurrentUserProfile, addNewItem, getUserItems, deleteItem, resetEmail, resetAddress, getUser } from "./firebaseSetup.js"

document.querySelector("#signUpButton").addEventListener("click", (evt) => {
    evt.preventDefault();

    document.querySelector(".loginLoadingSpinner").classList.remove("d-none")

    const firstName = document.querySelector("#signupFirstName")
    const lastName = document.querySelector("#signupLastName")
    const email = document.querySelector("#signupEmail")
    const password = document.querySelector("#signupPassword")
    const address = document.querySelector("#signupAddress")
   
    signUpUser(firstName.value, lastName.value, email.value, password.value, address.value)
    
    let inputs = [firstName, lastName, email, password, address]

    inputs.forEach((input) => input.value = "")
   
})

document.querySelector("#loginButton").addEventListener("click", (evt) => {
    evt.preventDefault();

    document.querySelector(".loginLoadingSpinner").classList.remove("d-none")

    const email = document.querySelector("#emailLogin")
    const password = document.querySelector("#passwordLogin")

    signInUser(email.value, password.value)

    email.value = ""
    password.value = ""    
})

export function successfulSignIn() {
    document.querySelector(".loginLoadingSpinner").classList.add("d-none")

    document.querySelectorAll(".navAction").forEach((button) => {
        button.classList.toggle("d-none");
    })

    document.querySelector("#carouselSignupButton").classList.add("d-none")

    fillProfileModal();

    document.querySelector(".btn-close").click();
}

export function successfulSignOut() {
    document.querySelector("#navLoginButton").classList.remove("d-none");
    document.querySelector("#navDonateButton").classList.add("d-none");
    document.querySelector("#profileIconButton").classList.add("d-none");

    document.querySelector("#closeModalButton").click();

    document.querySelector("#carouselSignupButton").classList.remove("d-none")

}

document.querySelector("#signOutButton").addEventListener("click", () => {
    signOutUser();
})

export async function fillProfileModal() {
    const currentUser = await getCurrentUserProfile();

    document.querySelector("#profileModalTitle").innerHTML = `Hello ${currentUser.displayName}`
    document.querySelector("#profileDisplayName").innerHTML = currentUser.displayName
    document.querySelector("#profileEmail").innerHTML = currentUser.email
    document.querySelector("#profileAddress").innerHTML = currentUser.address

}

document.querySelectorAll(".bi-pencil").forEach((elm) => {
    elm.addEventListener("click", () => {
        document.querySelectorAll(".resetContainer").forEach((container) => {
            container.classList.toggle("d-none");
        })
    })
})

document.querySelectorAll(".bi-check-square").forEach((button) => {
    button.addEventListener("click", () => {
        document.querySelector(".profileLoadingSpinner").classList.remove("d-none")

        let newEmail = document.querySelector("#newEmail");
        let newAddress = document.querySelector("#newAddress")

        if(button.id === "updateEmail") {
            resetEmail(newEmail.value);
        } else if (button.id === "updateAddress") {
            resetAddress(newAddress.value);
        }

        newEmail.value = "";
        newAddress.value = "";
    })
})

document.querySelector("#resetPasswordButton").addEventListener("click", () => {
    document.querySelector(".profileLoadingSpinner").classList.remove("d-none")

    resetPassword();
})

document.querySelector("#donateButton").addEventListener("click", (evt) => {
    evt.preventDefault();

    const itemName = document.querySelector("#itemName")
    const itemDescription = document.querySelector("#itemDescription")
    let itemCategory = "";
    const itemImage = document.querySelector('#imageInput');

    document.querySelectorAll(".form-check-input").forEach((button) => {
        if (button.checked) {
            itemCategory = button.value
        }
    })

    document.querySelector(".donateLoadingSpinner").classList.toggle("d-none");

    addNewItem(itemName.value, itemDescription.value, itemCategory, itemImage.files[0]).then(() => {
        document.querySelector(".donateLoadingSpinner").classList.toggle("d-none");
        alert("Item added successfully");
        document.querySelector("#donateModalClose").click();
        document.querySelectorAll(".donateInput").forEach((input) => {
            input.checked = false;
        })
        let inputs = [itemName, itemDescription, itemImage]
        inputs.forEach((input) => {input.value = ""})
    })
    .catch((error) => {
        console.log(error);
        alert("Error adding item");
    })
})

export function fillUserItems(userID) {
    document.querySelector("#selfItemAccordionBody").innerHTML = "";

    getUserItems(userID).then((items) => {
        items.forEach((doc) => {
            const { imageURL, itemCategory, itemDescription, itemName } = doc.data();
            const itemID = doc.id;

            let newCard = document.createElement("div");
            newCard.classList.add("card", "selfCard", "mb-3")
            newCard.style.maxWidth = "540px"
            let newCardImage = document.createElement("img")
            newCardImage.setAttribute("src", imageURL)
            newCardImage.classList.add("img-fluid", "rounded-start", "selfItemImage")
            newCard.appendChild(newCardImage)
            let newCardBody = document.createElement("div");
            newCardBody.classList.add("card-body", "selfItemsCardBody")
            newCard.appendChild(newCardBody)
            let newCardTitle = document.createElement("h5")
            newCardTitle.classList.add("card-title")
            newCardTitle.innerHTML = itemName
            newCardBody.appendChild(newCardTitle)
            let newCardText = document.createElement("p")
            newCardText.classList.add("card-text")
            newCardText.innerHTML = itemDescription
            newCardBody.appendChild(newCardText)

            let newCardDelete = document.createElement("button")
            newCardDelete.classList.add("btn", "btn-danger", "deleteButton")
            newCardDelete.innerHTML = "Delete"
            newCardDelete.addEventListener("click", () => {
                document.querySelector(".profileLoadingSpinner").classList.remove("d-none")

                deleteItem(itemCategory, itemID, userID, imageURL).then(() => {
                    document.querySelector(".profileLoadingSpinner").classList.add("d-none")
                    alert("Item removed");
                    document.querySelector("#selfItemAccordionBody").removeChild(newCard);

                }).catch((error) => {
                    console.log(error);
                    alert("Error removing item");
                })
            })

            newCardBody.appendChild(newCardDelete)
            document.querySelector("#selfItemAccordionBody").appendChild(newCard)

        })
    })
}

export function createItemCards(Item) {
    let cardDiv = document.createElement("div");
            cardDiv.classList.add("card");
            
            let image = document.createElement("img");
            image.classList.add("card-img-top", "itemImage");
            image.setAttribute("src", Item.imageURL);
            cardDiv.appendChild(image);

            let cardBody = document.createElement("div");
            cardBody.classList.add("card-body");
            cardDiv.appendChild(cardBody);

            let cardTitle = document.createElement("h5");
            cardTitle.classList.add("card-title");
            cardTitle.innerHTML = Item.itemName;
            cardBody.appendChild(cardTitle);

            let cardText = document.createElement("p");
            cardText.classList.add("card-text");
            cardText.innerHTML = Item.itemDescription;
            cardBody.appendChild(cardText);

            let contactButton = document.createElement("button");
            contactButton.classList.add("btn", "btn-success");
            contactButton.innerHTML = "Details";
            contactButton.setAttribute("data-bs-toggle", "modal");
            contactButton.setAttribute("data-bs-target", "#itemDetailsModal");

            contactButton.addEventListener("click", function (evt) {
                fillItemDetailsModal(Item)
            })

            cardDiv.appendChild(contactButton)

    return cardDiv
}

async function fillItemDetailsModal(Item) {
    const user = await getUser(Item.userID);

    document.querySelector("#itemDetailImage").setAttribute("src", Item.imageURL);
    document.querySelector("#itemDetailTitle").innerHTML = Item.itemName;
    document.querySelector("#itemDetailDescription").innerHTML = Item.itemDescription
    document.querySelector("#itemDetailEmail").innerHTML = user.email;
    document.querySelector("#itemDetailAddress").innerHTML = user.address;
}
