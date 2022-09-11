import Dog from "./Dog.js"
import {barcelonaFacebookDogs, barcelonaRescueDogs} from "./data.js"

let firstTimeRendering = true 
let profileIsExpanded = false
let dogLoaded = false 
let hasSeenFacebookDogs = false 
let hasSeenRescueDogs = false 
let undoIsAlive = false
let userIsReturningToEndScreen = false
let groupBeingUsed = ""
let nextDogToDisplay
let currentDog 
let dogsToDisplay
let spliceNumber
let groupToSearch
let dogToLoad 
let clone = []
let discardPile = [] 
let undoPile = []
let superLikesLeft = 10
const shareLinkUrl = window.location.search
const urlParams = new URLSearchParams(shareLinkUrl)
const dogToSearch = urlParams.get("dog")
const tempGroupToSearch = urlParams.get('group')

function getNextDog(){
    if (dogLoaded){
        dogLoaded = false 
        return new Dog(dogToLoad)
    }
    if (undoPile.length > 0){
        nextDogToDisplay = undoPile.pop()
        return nextDogToDisplay
    } else if (dogsToDisplay.length > 0){ 
    const i = Math.floor(Math.random() * dogsToDisplay.length)
    nextDogToDisplay = dogsToDisplay[i]
    dogsToDisplay.splice(i, 1)
    return new Dog(nextDogToDisplay)
    } else {
        noMoreDogs()
    }
}

// function removeSwipeModeEventListiners(){
//     document.getElementById("like-button").removeEventListener("click", like)
//     document.getElementById("dislike-button").removeEventListener("click", dislike)
//     document.getElementById("super-like-button").removeEventListener("click", superLike)
//     document.getElementById("undo-button").removeEventListener("click", undo)
//     document.getElementById("logo-icon").removeEventListener("click", generateHomeScreen)
//     document.getElementById("profile-icon").removeEventListener("click", function(){
//         generateProfileOrChatScreen("profile")})
//     document.getElementById("chat-icon").removeEventListener("click", function(){
//         generateProfileOrChatScreen("chat")})
// }

function noMoreDogs(){

    // removeSwipeModeEventListiners()
    groupBeingUsed === barcelonaFacebookDogs ? hasSeenFacebookDogs = true : hasSeenRescueDogs = true 

    let timeOutLength

    document.getElementById("number-of-super-likes-left").textContent = ""

    if (userIsReturningToEndScreen) {
        timeOutLength = 1
        userIsReturningToEndScreen = false 
    }  else { timeOutLength = 1000}           


    setTimeout(() => {
        disableAllButtons()
        // disableAllButtons()
        let imageNumberToUse 
        hasSeenFacebookDogs && hasSeenRescueDogs ? imageNumberToUse = 3 : imageNumberToUse = 2 

        document.getElementById("profile-container").style.animation = "background-zoom-out-2 8s ease both"
        document.getElementById('profile-container').style.backgroundImage = `url("images/Barcelona${imageNumberToUse}.jpg")`
        document.getElementById("profile-container").classList.add("final-screen")
        document.getElementById("profile-container").classList.add("fade-in-effect-1")

        let thankYouMessage = "Thank you for using Tindog!"
    
        const finalMessageHeader = `<img src="images/TindogLogo2.png" id="tindog-logo">`                            
    
        const rescueFinalMessage1 = `<p class="final-message">${thankYouMessage} To see more dogs in need of adoption or to
                                        find out how you can adopt them, please 
                                        visit <a href="https://protectorabcn.es/" target="_blank">protectorabcn.es.</a>
                                    </p>`
        
        const rescueFinalMessage2A = `<p class="final-message">Alternatively, 
                                            <button id="show-facebook-dogs-button">Click here</button> to 
                                            see the other version of Tindog, featuring real
                                             dogs from the Barcelona Dogs Facebook group!
                                        </p>`

        const rescueFinalMessage2B = `<p class="final-message">There are also many other shelters 
                                            and pet adoption organizations in the area.
                                            <a href="https://www.shbarcelona.com/blog/en/adopt-pet-barcelona/" target="_blank">
                                            Click here</a> to learn more about them.
                                      </p> `
    
        const facebookFinalMessage3A = `<p class="final-message">${thankYouMessage} Now that you've seen some good dogs who
                                            have owners, why not check out some also-good dogs 
                                             who need to be adopted?
                                        </p> 
                           
                                         <p class="final-message">
                                            <button id="show-adoption-dogs-button">Click here</button> 
                                            to see the Barcelona rescue dog version of Tindog!
                                         </p> `
        const facebookFinalMessage3B = `<p class="final-message one-with-margin">Wish you had a dog (or another dog)? There
                                             are many dogs who are waiting to be adopted in Barcelona. To see some of them,
                                               please visit
                                                <a href="https://protectorabcn.es/" target="_blank">protectorabcn.es.</a>
                                        </p>`

        const aboutButton = `<button id="about-button">About Tindog</button>`

        if (groupBeingUsed === barcelonaRescueDogs){

            if (hasSeenFacebookDogs === false) {

                document.getElementById(`profile-container`).innerHTML = 
                finalMessageHeader + rescueFinalMessage1 + rescueFinalMessage2A + aboutButton

                } else { thankYouMessage = ""
                        document.getElementById(`profile-container`).innerHTML = 
                        finalMessageHeader + rescueFinalMessage1 + rescueFinalMessage2B + aboutButton
                    }
        } else {
                if (hasSeenRescueDogs === false){
                 document.getElementById(`profile-container`).innerHTML = 
                 finalMessageHeader + facebookFinalMessage3A + aboutButton
                } else {
                  document.getElementById(`profile-container`).innerHTML = 
                   finalMessageHeader + facebookFinalMessage3B + aboutButton
                 } 
             }
        
        document.getElementById("about-button").addEventListener("click", function(){
            userIsReturningToEndScreen = true
            generateHomeScreen()
        })
        document.getElementById("show-adoption-dogs-button") ? 
            document.getElementById("show-adoption-dogs-button").addEventListener("click", function(){
                reinitialize(barcelonaRescueDogs)
             }) : ""

        document.getElementById("show-facebook-dogs-button") ? 
            document.getElementById("show-facebook-dogs-button").addEventListener("click", function(){
                reinitialize(barcelonaFacebookDogs)
              }) : ""           
    }, timeOutLength); 
}

function render() {
    document.getElementById("number-of-super-likes-left").innerHTML = `x${superLikesLeft}`
    superLikesLeft === 0 ? document.getElementById("number-of-super-likes-left").classList.add("no-super-likes-left"):""
    superLikesLeft > 0 && document.getElementById("number-of-super-likes-left").classList.contains("no-super-likes-left") ? document.getElementById("number-of-super-likes-left").classList.remove("no-super-likes-left"):""

    document.getElementById("profile-container").style.overflow = "hidden"
    document.getElementById(`profile-container`).innerHTML = currentDog.getProfileHtml()
    document.getElementById("current-dog-photo").style.objectPosition = currentDog.initialObjectPosition

    if (firstTimeRendering) {
        document.getElementById("profile-container").classList.add("text-focus-in") 
        document.getElementById("dislike-button").disabled = false 
        document.getElementById("like-button").disabled = false 
        document.getElementById("super-like-button").disabled = false 
        document.getElementById("logo-icon").disabled = false 
        document.getElementById("profile-icon").disabled = false 
        document.getElementById("chat-icon").disabled = false 
        firstTimeRendering = false 
    } else {
        document.getElementById("text-overlay-container").classList.add("text-focus-in")
    }
    document.getElementById("current-dog-photo").addEventListener("click", expand)
    document.getElementById("text-overlay-container").addEventListener("click", expand)
    document.getElementById("like-button").addEventListener("click", like)
    document.getElementById("super-like-button").addEventListener("click", superLike)
    document.getElementById("dislike-button").addEventListener("click", dislike)
    document.getElementById("undo-button").addEventListener("click", undo)
    document.getElementById("logo-icon").addEventListener("click", generateHomeScreen)
    document.getElementById("profile-icon").addEventListener("click", function(){
        generateProfileOrChatScreen("profile")})
    document.getElementById("chat-icon").addEventListener("click", function(){
        generateProfileOrChatScreen("chat")})
    if (discardPile.length === 0){
        document.getElementById("undo-button").removeEventListener("click", undo)
        document.getElementById("undo-button").disabled = true
     } else { document.getElementById("undo-button").disabled = false
    }
}

function undo(){
    undoIsAlive = true 
    profileIsExpanded ? unexpand() : ""
    undoPile.push(currentDog)
    undoPile.push(discardPile.pop())
    changeDogs("undo")
    reverseStatusEffect()
    cancelPreviousStatusChanges()

}

function cancelPreviousStatusChanges(){
    currentDog.hasBeenSwiped = false 
    currentDog.hasBeenLiked = false
    currentDog.hasBeenSuperLiked = false 
    
}

function reverseStatusEffect(){
    let badgeName 
    let animationClassNameNumber

    if (currentDog.hasBeenSuperLiked){
        badgeName = "like" 
        animationClassNameNumber = "-2"
        superLikesLeft++
        document.getElementById("super-like-button").disabled = false 

        setTimeout(() => {
            document.getElementById("like-badge").src = "images/super-like-badge.png"
            document.getElementById("badge-container").style.zIndex = "1"
            document.getElementById(`${badgeName}-badge`).style.visibility = "visible"
            document.getElementById(`${badgeName}-badge`).classList.add(`bounce-in-bck-reverse${animationClassNameNumber}`)
        }, 500)

        setTimeout(() => {
            document.getElementById(`${badgeName}-badge`).style.visibility = "hidden"
            document.getElementById("like-badge").src = "images/badge-like.png"
            document.getElementById(`${badgeName}-badge`).classList.remove(`bounce-in-bck-reverse${animationClassNameNumber}`)
        }, 700)

    } else if (currentDog.hasBeenLiked){
        badgeName = "like" 
        animationClassNameNumber = "-2"
    } else {
        badgeName = "nope" 
        animationClassNameNumber = ""
    }
    
  if (currentDog.hasBeenSuperLiked === false){
    setTimeout(() => {
        document.getElementById("badge-container").style.zIndex = "1"
        document.getElementById(`${badgeName}-badge`).style.visibility = "visible"
        document.getElementById(`${badgeName}-badge`).classList.add(`bounce-in-bck-reverse${animationClassNameNumber}`)
    }, 500);
    setTimeout(() => {
        document.getElementById(`${badgeName}-badge`).style.visibility = "hidden"
        document.getElementById(`${badgeName}-badge`).classList.remove(`bounce-in-bck-reverse${animationClassNameNumber}`)
    }, 700)
}
}

function disableAllButtons(){
    disableBottomButtons()
    disableTopButtons()
}

function disableTopButtons(){
    document.getElementById("logo-icon").disabled = true 
    document.getElementById("profile-icon").disabled = true 
    document.getElementById("chat-icon").disabled = true 
}

function generateWelcomeScreen(){

    document.getElementById("profile-container").style.backgroundImage = 'url("images/Barcelona4.jpg")'
    document.getElementById("profile-container").style.animation = "background-zoom-out 8s ease both"
    document.getElementById("profile-container").classList.add("welcome-screen")
    document.getElementById(`profile-container`).innerHTML = 
         `<img src="images/TindogLogo2.png" id="tindog-logo" class="fade-in-effect-1">`
    disableAllButtons()

    let timeOutLength

    dogLoaded ? timeOutLength = 1000 : timeOutLength = 2500 

    setTimeout(() => {
        document.getElementById("tindog-logo").classList.remove("fade-in-effect-1")

        if (dogLoaded) {

            document.getElementById(`profile-container`).innerHTML +=  ` <p class="welcome-message-loading shake-horizontal fade-in-effect-2" id="loading-message">Loading ${dogToLoad.name}...</p>` 
            
            setTimeout(() => {
                document.getElementById("loading-message").style.color = "rgb(0, 206, 206)"
                document.getElementById("loading-message").innerHTML = `${dogToLoad.name} loaded!`
                document.getElementById("loading-message").classList.remove("shake-horizontal")
                document.getElementById("loading-message").classList.remove("fade-in-effect-2")
            }, 2000)

            setTimeout(() => {initialize(groupToSearch)}, 3000)
            
        } else {
                document.getElementById(`profile-container`).innerHTML += 
                
                    `<p id="please-confirm-message" class="welcome-message">Please confirm you're not a cat by clicking the checkbox below:</p> 
                    
                    <div id="cat-confirmation-container" class="fade-in-effect-2">
                        <div id="cat-confirmation-checkbox"></div>
                        <div>I am not a cat. </div> 
                    </div>    `
                document.getElementById("cat-confirmation-checkbox").addEventListener("click", function() {
                        document.getElementById("cat-confirmation-container").classList.remove("fade-in-effect-2")
                        document.getElementById("cat-confirmation-checkbox").innerHTML = `<img id="paw-print-checkmark" src="images/paw-print.png">`
                        document.getElementById("cat-confirmation-checkbox").style.background = "lightgreen"
                        setTimeout(() => {
                            document.getElementById("cat-confirmation-container").style.animation = "none"
                            document.getElementById("please-confirm-message").style.animation = "none"
                            document.getElementById("tindog-logo").style.visibility = "hidden" 
                            document.getElementById("please-confirm-message").style.visibility = "hidden" 
                            document.getElementById(`profile-container`).innerHTML += `<img id="security-logo" src="images/security-logo.png">`
                        }, 50)

                        setTimeout(() => {
                            generateWelcomeScreen2()}, 2500)
                }) 
        }
    }, timeOutLength)
}

function generateWelcomeScreen2(){

    document.getElementById("profile-container").style.backgroundImage = "url('images/Barcelona.jpg')"
    document.getElementById("profile-container").style.animation = "background-pan 6s ease both"
    document.getElementById("security-logo").remove()
    document.getElementById("please-confirm-message").remove()
    document.getElementById("tindog-logo").remove()
    document.getElementById("cat-confirmation-container").remove()
    document.getElementById(`profile-container`).innerHTML += 
    
                    `<p class="welcome-message" id="first-welcome-message">Welcome 
                        to Tindog: Barcelona Edition — a fake app featuring<br> <b>real</b> dogs of 
                        Barcelona!</p>`

    setTimeout(() => {
        document.getElementById(`profile-container`).innerHTML += 
        ` 
        <div id="welcome-screen-buttons-container" class="fade-in-effect-3">
            <p id="choose-pack-message"><span>Choose a pack:</span></p>
            <div id="welcome-screen-buttons-container-inner">
                <button id="adoption-button" class="welcome-screen-button"><img id="rescue-dog-icon" src="images/rescue-dog-icon.png"></button> 
                <button id="facebook-button" class="welcome-screen-button"><img id="facebook-dog-icon"  src="images/FacebookDogsIcon.png"></button> 
            </div>
        </div> 
        `          
    }, 2000)

    document.addEventListener('click',function(e){
        if(e.target && e.target.id== 'facebook-dog-icon'){
            initialize(barcelonaFacebookDogs)
            }})

    document.addEventListener('click',function(e){
    if(e.target && e.target.id== 'rescue-dog-icon'){
        initialize(barcelonaRescueDogs)
        }})
}
    
function initialize(groupToUse){
    document.getElementById("profile-container").style.backgroundImage = "none"
    document.getElementById("profile-container").style.animation = ""
    document.getElementById("profile-container").classList.remove("welcome-screen")
    dogsToDisplay = createCloneOf(groupToUse)
    dogLoaded ? dogsToDisplay.splice(spliceNumber, 1) : ""
    currentDog = getNextDog()
    groupBeingUsed === barcelonaRescueDogs ? superLikesLeft = barcelonaRescueDogs.length : superLikesLeft = 10
    render()
    }

function reinitialize(groupToUse){
    discardPile = [] 
    undoPile = []
    document.getElementById("profile-container").style.backgroundImage = "none"
    document.getElementById("profile-container").style.animation = ""
    document.getElementById("profile-container").classList.remove("final-screen")
    dogsToDisplay = createCloneOf(groupToUse)  
    currentDog = getNextDog()
    firstTimeRendering = true 
    groupBeingUsed === barcelonaRescueDogs ? superLikesLeft = barcelonaRescueDogs.length : superLikesLeft = 10
    render()
}

function createCloneOf(groupToUse){
   groupBeingUsed = groupToUse
   return clone = [...groupToUse]
}

function unexpand() {
    document.getElementById("current-dog-photo").removeEventListener("click", unexpand)
    document.getElementById("current-dog-photo").style.objectPosition = currentDog.initialObjectPosition
    document.getElementById("current-dog-photo").style.animation = "make-image-bigger .2s ease both" 
    document.getElementById("text-overlay-container").innerHTML = currentDog.getTextOverlayHtml()
    document.getElementById("expanded-profile-container").remove()
    document.getElementById("profile-container").style.overflow = "hidden"
    document.getElementById("current-dog-photo").addEventListener("click", expand)
    document.getElementById("text-overlay-container").addEventListener("click", expand)
    profileIsExpanded = false 

}

function removeOtherScreen() {
    document.getElementById("home-screen-container") ? document.getElementById("home-screen-container").remove() : ""
    document.getElementById("profile-screen-container") ? document.getElementById("profile-screen-container").remove() : ""
    document.getElementById("chat-screen-container") ? document.getElementById("chat-screen-container").remove() : ""
}

function generateHomeScreen(){
    removeOtherScreen()
    profileIsExpanded ? unexpand() : ""
    disableBottomButtons()
    document.getElementById("profile-container").innerHTML += `
    
                    <div id="home-screen-container" class="fade-in-effect">

                    <img src="images/TindogLogo2.png" id="tindog-logo-2">

                    <p class="home-screen-message">Tindog was created by Daniel Beck Rose as a project
                    for the <a href="https://scrimba.com/learn/frontend">Scrimba Frontend Developer course</a>.</p>   

                    <p class="home-screen-message">His dog is Toby, a cocker spaniel, who has <a href="#" target="_blank">a profile</a> on Tindog, of course. The other Facebook dogs are from the <a href="https://www.facebook.com/groups/DogsBarcelona" target="_blank">Barcelona Dogs Facebook group</a>. The background images of Barcelona are from <a href="https://unsplash.com/s/photos/barcelona" target="_blank">Unsplash</a>.</p>

                    <p class="home-screen-message">Daniel doesn't have a website, linkedin profile, or anything like that yet. 
                    If you want to get in touch with him, just <a href="mailto:danielbeckrose@gmail.com">email him</a> or <a href="https://www.facebook.com/danielbeckrose" target="_blank">message him on Facebook</a>.</p>

                    <button id="home-screen-back-button">Back</button>
                     </div>`
    document.getElementById("home-screen-back-button").addEventListener("click", function(){
        goBack("home")})

}

function goBack(fromWhere){
    
    document.getElementById(`${fromWhere}-screen-container`).remove()

            if (userIsReturningToEndScreen){
                noMoreDogs()
            } else{
            enableBottomButtons()
            render()}
    }

function disableBottomButtons(){
    document.getElementById("undo-button").disabled = true 
    document.getElementById("dislike-button").disabled = true 
    document.getElementById("like-button").disabled = true 
    document.getElementById("super-like-button").disabled = true 
}

function enableBottomButtons(){
    document.getElementById("dislike-button").disabled = false 
    document.getElementById("like-button").disabled = false 
    discardPile.length > 0 ? document.getElementById("undo-button").disabled = false : "" 
    superLikesLeft > 0 ? document.getElementById("super-like-button").disabled = false : ""

}

function generateProfileOrChatScreen(whichOne){
    removeOtherScreen()
    profileIsExpanded ? unexpand() : ""
    disableBottomButtons()
    let variableMessage
    whichOne === "profile" ? variableMessage = "edit your profile" : variableMessage = "send messages to other users"

    document.getElementById("profile-container").innerHTML += `

                <div id="${whichOne}-screen-container" class="fade-in-effect">

                    <img src="images/DonPerro.jpg" id="profile-avatar">

                    <p id="profile-name">Señor Don Perro, 12</p>

                    <p class="profile-message">Hello, Señor. We regret to inform you that you are currently unable to ${variableMessage} because your account is
                      under review by our staff.</p>
                    
                    <p class="profile-message">We have received a number of complaints about
                    your behavior from other Tindog users, and we are currently investigating them. Thank you for your understanding.</p>

                    <button id="${whichOne}-screen-back-button">Back</button>

                </div>  

    `

    document.getElementById(`${whichOne}-screen-back-button`).addEventListener("click", function(){
        goBack(whichOne)})

}

function superLike(){
        superLikesLeft--
        currentDog.hasBeenSwiped = true 
        currentDog.hasBeenSuperLiked = true 
        document.getElementById("like-badge").src = "images/super-like-badge.png"
        like()
        superLikesLeft === 0 ? document.getElementById("super-like-button").disabled = true : ""
}

function like() {
    profileIsExpanded ? unexpand() : ""
    currentDog.hasBeenSwiped = true 
    currentDog.hasBeenSuperLiked ? currentDog.hasBeenLiked = false : currentDog.hasBeenLiked = true
    document.getElementById("profile-container").scrollTo({top: 0, behavior: "smooth"})
    document.getElementById("badge-container").style.zIndex = "1"
    document.getElementById("like-badge").style.visibility = "visible"
    document.getElementById("like-badge").classList.add("bounce-in-bck-2")
    discardPile.push(currentDog)
    dogsToDisplay.length > 0 ? changeDogs("like") : noMoreDogs()
 }

 function changeDogs(typeOfChange){
    let direction = "" 
    let kindOfDogToUse = ""
    const lastDog = currentDog
    currentDog  = getNextDog()
    typeOfChange === "like" ? direction = "right" : typeOfChange === "undo" ? direction = "left-reverse" : direction = "left"
    typeOfChange === "undo" ? kindOfDogToUse = lastDog : kindOfDogToUse = currentDog
    setTimeout(() => {
        document.getElementById("profile-card").classList.add(`swing-out-${direction}-fwd`)
        document.getElementById("profile-container").style.backgroundImage = `url(${kindOfDogToUse.avatar}` 
        document.getElementById("profile-container").style.backgroundPosition = kindOfDogToUse.initialObjectPosition 
    }, 150);
    setTimeout(() => {
        render() 
    }, 350)
 }

 function dislike() {
    profileIsExpanded ? unexpand() : ""
    currentDog.hasBeenSwiped = true 
    discardPile.push(currentDog)
    document.getElementById("profile-container").scrollTo({top: 0, behavior: "smooth"})
    document.getElementById("badge-container").style.zIndex = "1"
    document.getElementById("nope-badge").style.visibility = "visible"
    document.getElementById("nope-badge").classList.add("bounce-in-bck")
    dogsToDisplay.length > 0 ? changeDogs("dislike") : noMoreDogs()
    
 }


 function expand(){
    document.getElementById("info-icon").remove()
    document.getElementById("name-overlay").remove()
    document.getElementById("location-overlay").remove()
    document.getElementById("current-dog-photo").removeEventListener("click", expand)
    document.getElementById("current-dog-photo").style.transition = "object-position 1s"
    document.getElementById("current-dog-photo").style.objectPosition = currentDog.secondaryObjectPosition
    document.getElementById("current-dog-photo").style.animation = "make-image-smaller 1s ease both"
    document.getElementById("text-overlay-container").classList.remove("text-focus-in")
    document.getElementById("profile-container").style.backgroundImage = "none"
    document.getElementById("profile-container").style.overflowY  = "scroll"
    document.getElementById("profile-card").innerHTML += currentDog.getExpandedProfileHtml()
    document.getElementById("share-link").addEventListener("click", share)
    document.getElementById("current-dog-photo").addEventListener("click", unexpand)
    profileIsExpanded = true 
 }

function share(){

    let groupName
    groupBeingUsed === barcelonaFacebookDogs ? groupName = "Facebook" : groupName = "Rescue"
    let dogNameToUse
    currentDog.shareName ? dogNameToUse = currentDog.shareName : dogNameToUse = currentDog.name 
    const shareLink = currentDog.generateShareLink(dogNameToUse, groupName)
    const directLink = currentDog.generateDirectLink(dogNameToUse, groupName)
    const faceBookLink = `https://www.facebook.com/sharer/sharer.php?u=${shareLink}`
    const twitterLink = `https://twitter.com/intent/tweet?url=${shareLink}&text=Check%20out%20my%20dog's%20profile%20on%20Tindog!`
    const whatsAppLink = `https://api.whatsapp.com/send?text=${shareLink}`
    const emailLink = `mailto:?subject=Now%20that's%20what%20I%20call%20a%20hot%20dog!&body=Check%20out%20${currentDog.name.replaceAll(' ', '%20')}'s%20profile%20on%20Tindog%20%E2%80%94%20the%20Tinder%20for%20dogs!%20The%20link%20is%20${shareLink}%0D%0A`
    document.getElementById("current-dog-photo").style.transition = ""
    document.getElementById("current-dog-photo").style.animation = "make-image-smaller .1s ease reverse both"
    document.getElementById("text-overlay-container").innerHTML = currentDog.getTextOverlayHtml()

    document.getElementById("overall-container").innerHTML += 
                `<div id="share-modal-overlay-container">

                    <div id="share-modal-content-container">

                        <div id="share-modal-social-media-container">
                            <p class="share-text">Share a direct link to ${currentDog.name}'s Tindog profile on social media:</p> 
                            <div class="share-modal-media-buttons-container">
                                <a href=${faceBookLink} target="_blank"> <img class="share-button" src="images/facebook-icon.png"></a>
                                <a href=${whatsAppLink} target="_blank"><img class="share-button" src="images/whatsapp-icon.png"></a>
                                <a href=${twitterLink} target="_blank"> <img class="share-button" src="images/twitter-icon.png"></a>
                            </div>
                        </div>

                        <div id="share-modal-links-container">
                            <p class="share-text">Or copy it to your clipboard, send it by email, or open it in a new tab!</p>
                            <div class="share-modal-media-buttons-container">
                                <div id="copy-link-button-container"><img class="share-button" id="copy-link-button" src="images/copy-link-icon.png"></div>
                                <a href=${emailLink} target="_blank"><img class="share-button" src="images/email-icon.png"></a>
                                <a href=${directLink} target="_blank"><img class="share-button" src="images/open-link-icon.png"></a>
                            </div> 
                        </div>

                        <button id="go-back-button">Never mind!</button>

                    </div>
                </div>`
    
                document.getElementById("copy-link-button").addEventListener("click", function(){
                    document.getElementById("copy-link-button-container").innerHTML += `<div id="text-copied-speech-bubble-container"> <img id="text-copied-speech-bubble" src="images/cartoon-bubble-left.png"> <div id="text-copied-speech-bubble-message">Copied!</div></div>`
                    navigator.clipboard.writeText(`${directLink}`)
                })
    document.getElementById("go-back-button").addEventListener("click", closeModal)
    document.addEventListener('click',function(e){
        if(e.target && e.target.classList== 'share-button'){
            setTimeout(() => {
                closeModal()
            }, 1000);

        }})
}

function closeModal(){
    document.getElementById("share-modal-overlay-container").remove()
    render()
    expand()
}

function loadApp(){
    if (!tempGroupToSearch || !dogToSearch) { 
        generateWelcomeScreen()
    } else if (tempGroupToSearch.toLowerCase() === "facebook"){
        groupToSearch = barcelonaFacebookDogs 
        searchForDog()
    } else if (tempGroupToSearch.toLowerCase() === "rescue"){
        groupToSearch = barcelonaRescueDogs
        searchForDog()
    } else {
        generateWelcomeScreen()
    }
}

function searchForDog() {
    let dogNameToUse 
    for (let i=0; i < groupToSearch.length; i++){
        if (groupToSearch[i].shareName){
            dogNameToUse = groupToSearch[i].shareName
        } else {
            dogNameToUse = groupToSearch[i].name
        }
        if (dogNameToUse.toLowerCase() === dogToSearch.toLowerCase()){
            dogLoaded = true 
            spliceNumber = i 
            dogToLoad = groupToSearch[i]
            generateWelcomeScreen()
        } 
    }
    if (dogLoaded === false) {
        generateWelcomeScreen()
    }

}

loadApp()


