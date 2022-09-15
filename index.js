import Dog from "./Dog.js"
import {barcelonaFacebookDogs, barcelonaRescueDogs, sampleDogs} from "./data.js"

let firstTimeRendering = true 
let profileIsExpanded = false
let dogLoaded = false 
let hasSeenFacebookDogs = false 
let hasSeenRescueDogs = false 
let userIsReturningToEndScreen = false
let undoIsAlive = false 
let needsTutorial = true  
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
let touchstartX = 0
let touchstartY = 0
let touchendX = 0
let touchendY = 0 


let typeOfInteraction = "click"

window.addEventListener("touchstart", function() {
    typeOfInteraction = "touchstart"
})

    

function checkDirection() {
    touchendX + 75 < touchstartX ? dislike() 
    : touchendX - 75 > touchstartX ? like()  
         : touchendY + 75 < touchstartY ? superLike() : ""
}
const shareLinkUrl = window.location.search
const urlParams = new URLSearchParams(shareLinkUrl)
const dogToSearch = urlParams.get("dog")
const tempGroupToSearch = urlParams.get('group')

const appHeight = () => {
    const doc = document.documentElement
    doc.style.setProperty('--app-height', `${window.innerHeight}px`)
}
window.addEventListener('resize', appHeight)
appHeight()



function getNextDog(){
    if (dogLoaded){
        dogLoaded = false 
        return new Dog(dogToLoad)
    }
    if (needsTutorial){
        return new Dog(sampleDogs.shift())
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

function noMoreDogs(){

    // removeSwipeModeEventListiners()
    groupBeingUsed === barcelonaFacebookDogs ? hasSeenFacebookDogs = true : hasSeenRescueDogs = true 

    let timeOutLength

    disableAllButtons()

    document.getElementById("number-of-super-likes-left").textContent = ""

    if (userIsReturningToEndScreen) {
        timeOutLength = 1
        userIsReturningToEndScreen = false 
    }  else { timeOutLength = 1000}           


    setTimeout(() => {
        // disableAllButtons()
        let imageNumberToUse 
        hasSeenFacebookDogs && hasSeenRescueDogs ? imageNumberToUse = 3 : imageNumberToUse = 2 

        document.getElementById("profile-container").style.animation = "background-zoom-out-2 8s ease-in-out both"
        document.getElementById('profile-container').style.backgroundImage = `url("images/Barcelona${imageNumberToUse}.jpg")`
        document.getElementById("profile-container").classList.add("final-screen")
        document.getElementById("profile-container").classList.add("fade-in-effect-1")

        let thankYouMessage = "Thank you for using Tindog!"
    
        const finalMessageHeader = `<img src="images/TinDogLogo2.png" id="tindog-logo-3">`                            
    
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

            if (!hasSeenFacebookDogs) {

                document.getElementById(`profile-container`).innerHTML = 
                finalMessageHeader + rescueFinalMessage1 + rescueFinalMessage2A + aboutButton

                } else { thankYouMessage = ""
                        document.getElementById(`profile-container`).innerHTML = 
                        finalMessageHeader + rescueFinalMessage1 + rescueFinalMessage2B + aboutButton
                    }
        } else {
                if (!hasSeenRescueDogs){
                 document.getElementById(`profile-container`).innerHTML = 
                 finalMessageHeader + facebookFinalMessage3A + aboutButton
                } else {
                  document.getElementById(`profile-container`).innerHTML = 
                   finalMessageHeader + facebookFinalMessage3B + aboutButton
                 } 
             }
        
        document.getElementById("about-button").addEventListener(typeOfInteraction, function(){
            userIsReturningToEndScreen = true
            generateHomeScreen()
        }, {passive: true})
        document.getElementById("show-adoption-dogs-button") ? 
            document.getElementById("show-adoption-dogs-button").addEventListener(typeOfInteraction, function(){
                reinitialize(barcelonaRescueDogs)
             }, {passive: true}) : ""

        document.getElementById("show-facebook-dogs-button") ? 
            document.getElementById("show-facebook-dogs-button").addEventListener(typeOfInteraction, function(){
                reinitialize(barcelonaFacebookDogs)
              }, {passive: true}) : ""           
    }, timeOutLength); 
}


function addAllButtonEventListeners(){

    if (discardPile.length > 0) {
        document.getElementById("undo-button").addEventListener(typeOfInteraction, undo, {passive: true})} 
    document.getElementById("like-button").addEventListener(typeOfInteraction, like, {passive: true})
    document.getElementById("super-like-button").addEventListener(typeOfInteraction, superLike, {passive: true})
    document.getElementById("dislike-button").addEventListener(typeOfInteraction, dislike, {passive: true})
    document.getElementById("logo-icon").addEventListener(typeOfInteraction, generateHomeScreen, {passive: true})
    document.getElementById("profile-icon").addEventListener(typeOfInteraction, function(){
        generateProfileOrChatScreen("profile")}, {passive: true})
    document.getElementById("chat-icon").addEventListener(typeOfInteraction, function(){
        generateProfileOrChatScreen("chat")}, {passive: true})
}

function updateButtons(){

    document.getElementById("info-icon").addEventListener(typeOfInteraction, expand, {passive: true}) 

    if (firstTimeRendering && !needsTutorial){
        addAllButtonEventListeners()
    }

    if (firstTimeRendering) {
        updateSuperLikes()
        document.getElementById("profile-container").classList.add("text-focus-in") 
        document.getElementById("dislike-button").disabled = false 
        document.getElementById("like-button").disabled = false 
        document.getElementById("super-like-button").disabled = false 
        document.getElementById("logo-icon").disabled = false 
        document.getElementById("profile-icon").disabled = false 
        document.getElementById("chat-icon").disabled = false 
        firstTimeRendering = false 
    } else {
        // document.getElementById("text-overlay-container").classList.add("text-focus-in")
    }


    if (!needsTutorial) {

        document.getElementById("current-dog-photo").addEventListener('touchstart', e => {
            touchstartX = e.changedTouches[0].screenX
            touchstartY = e.changedTouches[0].screenY
            }, {passive: true})

            document.getElementById("current-dog-photo").addEventListener('touchend', e => {
            touchendX = e.changedTouches[0].screenX
            touchendY = e.changedTouches[0].screenY
            checkDirection()
            }, {passive: true})
    }

    if (discardPile.length > 0 && !undoIsAlive && !needsTutorial) {
        document.getElementById("undo-button").disabled = false
        document.getElementById("undo-button").addEventListener(typeOfInteraction, undo, {passive: true}) 
        undoIsAlive = true 
     } 
     
     if (discardPile.length === 0 && undoIsAlive && !needsTutorial) {
        document.getElementById("undo-button").removeEventListener(typeOfInteraction, undo, {passive: true})
        document.getElementById("undo-button").disabled = true
        undoIsAlive = false 
     }
}




function render() {
   
    document.getElementById("profile-container").style.overflow = "hidden"
    document.getElementById(`profile-container`).innerHTML = currentDog.getProfileHtml()
    document.getElementById("current-dog-photo").style.objectPosition = currentDog.initialObjectPosition

    updateButtons()

  
}
       


function undo(){
    if (discardPile.length > 0) {
        profileIsExpanded ? unexpand() : ""
        undoPile.push(currentDog)
        undoPile.push(discardPile.pop())
        changeDogs("undo")
        reverseStatusEffect()
        cancelPreviousStatusChanges()
    }
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
        badgeName = "super-like" 
        animationClassNameNumber = "-3"
        superLikesLeft++
        document.getElementById("super-like-button").disabled = false 
    } else if (currentDog.hasBeenLiked){
        badgeName = "like" 
        animationClassNameNumber = "-2"
    } else {
        badgeName = "nope" 
        animationClassNameNumber = ""
    }

setTimeout(() => {
    document.getElementById("badge-container").style.zIndex = "1"
    document.getElementById(`${badgeName}-badge`).style.display = "block"
    document.getElementById(`${badgeName}-badge`).classList.add(`bounce-in-bck-reverse${animationClassNameNumber}`)
}, 500)

setTimeout(() => {
    document.getElementById(`${badgeName}-badge`).style.display = "none"
    document.getElementById(`${badgeName}-badge`).classList.remove(`bounce-in-bck-reverse${animationClassNameNumber}`)
}, 700)


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
    document.getElementById("profile-container").style.animation = "background-zoom-out 3s ease-in-out both"
    document.getElementById("profile-container").classList.add("welcome-screen")
    document.getElementById(`profile-container`).innerHTML = 
         `<img src="images/TinDogLogo2.png" id="tindog-logo" class="fade-in-effect-1"> ${variableHtml}`   

    let variableHtml =  
                `<p id="please-confirm-message" class="welcome-message">Please confirm you're not a cat by clicking the checkbox below:</p> 
                
                <div id="cat-confirmation-container" class="fade-in-effect-2">
                    <div id="cat-confirmation-checkbox"></div>
                    <div>I am not a cat. </div> 
                </div>    `

    if (dogLoaded){
        variableHtml = `<p class="welcome-message-loading shake-horizontal fade-in-effect-2" id="loading-message">Loading ${dogToLoad.name}...</p>` 
        setTimeout(() => {
            document.getElementById("loading-message").innerText = `${dogToLoad.name} loaded!`
            document.getElementById("loading-message").style.color = 'rgb(0, 250, 0)'

        }, 3200)

        setTimeout(() => {
            initialize(groupToSearch)}
            , 3900)

    } else {

        setTimeout(() => {
            document.getElementById("cat-confirmation-checkbox").addEventListener(typeOfInteraction, function() {
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
                    generateWelcomeScreen2()}, 1500)
        })      
        }, 1000);
       
}


    
    disableAllButtons()

//     if (dogLoaded) {

//         document.getElementById(`profile-container`).innerHTML +=  ` <p class="welcome-message-loading shake-horizontal fade-in-effect-2" id="loading-message">Loading ${dogToLoad.name}...</p>` 
        
//         setTimeout(() => {
//             document.getElementById("loading-message").innerText = `${dogToLoad.name} loaded!`
//             document.getElementById("loading-message").style.color = 'rgb(0, 250, 0)'

//         }, 3200)

//         setTimeout(() => {initialize(groupToSearch)}, 3900)

//     } else {

       

//         document.getElementById("cat-confirmation-checkbox").addEventListener(typeOfInteraction, function() {
//                 document.getElementById("cat-confirmation-container").classList.remove("fade-in-effect-2")
//                 document.getElementById("cat-confirmation-checkbox").innerHTML = `<img id="paw-print-checkmark" src="images/paw-print.png">`
//                 document.getElementById("cat-confirmation-checkbox").style.background = "lightgreen"

//                 setTimeout(() => {
//                     document.getElementById("cat-confirmation-container").style.animation = "none"
//                     document.getElementById("please-confirm-message").style.animation = "none"
//                     document.getElementById("tindog-logo").style.visibility = "hidden" 
//                     document.getElementById("please-confirm-message").style.visibility = "hidden" 
//                     document.getElementById(`profile-container`).innerHTML += `<img id="security-logo" src="images/security-logo.png">`
//                 }, 50)

//                 setTimeout(() => {
//                     generateWelcomeScreen2()}, 1500)
//         }) 
// }



    // let timeOutLength

    // dogLoaded ? timeOutLength = 1000 : timeOutLength = 2500 

    // setTimeout(() => {
    //     document.getElementById("tindog-logo").classList.remove("fade-in-effect-1")

    //     if (dogLoaded) {

    //         document.getElementById(`profile-container`).innerHTML +=  ` <p class="welcome-message-loading shake-horizontal fade-in-effect-2" id="loading-message">Loading ${dogToLoad.name}...</p>` 
            
    //         setTimeout(() => {
    //             document.getElementById("loading-message").innerText = `${dogToLoad.name} loaded!`
    //             document.getElementById("loading-message").style.color = 'rgb(0, 250, 0)'

    //         }, 2000)

    //         setTimeout(() => {initialize(groupToSearch)}, 2700)
            
    //     } else {
    //             document.getElementById(`profile-container`).innerHTML += 
                
    //                 `<p id="please-confirm-message" class="welcome-message">Please confirm you're not a cat by clicking the checkbox below:</p> 
                    
    //                 <div id="cat-confirmation-container" class="fade-in-effect-2">
    //                     <div id="cat-confirmation-checkbox"></div>
    //                     <div>I am not a cat. </div> 
    //                 </div>    `
    //             document.getElementById("cat-confirmation-checkbox").addEventListener(typeOfInteraction, function() {
    //                     document.getElementById("cat-confirmation-container").classList.remove("fade-in-effect-2")
    //                     document.getElementById("cat-confirmation-checkbox").innerHTML = `<img id="paw-print-checkmark" src="images/paw-print.png">`
    //                     document.getElementById("cat-confirmation-checkbox").style.background = "lightgreen"
    //                     setTimeout(() => {
    //                         document.getElementById("cat-confirmation-container").style.animation = "none"
    //                         document.getElementById("please-confirm-message").style.animation = "none"
    //                         document.getElementById("tindog-logo").style.visibility = "hidden" 
    //                         document.getElementById("please-confirm-message").style.visibility = "hidden" 
    //                         document.getElementById(`profile-container`).innerHTML += `<img id="security-logo" src="images/security-logo.png">`
    //                     }, 50)

    //                     setTimeout(() => {
    //                         generateWelcomeScreen2()}, 1500)
    //             }) 
    //     }
    // }, timeOutLength)
}

function generateWelcomeScreen2(){

    document.getElementById("profile-container").style.backgroundImage = "url('images/Barcelona.jpg')"
    document.getElementById("profile-container").style.animation = "background-pan 3s ease-in-out both"
    document.getElementById("security-logo").remove()
    document.getElementById("please-confirm-message").remove()
    document.getElementById("tindog-logo").remove()
    document.getElementById("cat-confirmation-container").remove()
    document.getElementById(`profile-container`).innerHTML += 
    
                    `<p class="welcome-message" id="first-welcome-message">Welcome 
                        to Tindog: Barcelona Edition — a fake app featuring<br> <b>real</b> dogs of 
                        Barcelona!</p>
                         <button id="next-button">Next</button>`    

    setTimeout(() => {  
        document.getElementById("next-button").addEventListener(typeOfInteraction, initialize)  
    }, 2000)

}
    
function initialize(groupToUse){

    if (window.innerWidth < 500){
        document.getElementById("header-button-container").style.display = "flex"
        document.getElementById("button-container").style.display = "flex"
    }
    
  
    if (needsTutorial && !dogLoaded){
        generateTutorial()
    } else {
        document.getElementById("profile-container").style.backgroundImage = "none"
        document.getElementById("profile-container").style.animation = ""
        document.getElementById("profile-container").classList.remove("welcome-screen")
        dogsToDisplay = createCloneOf(groupToUse)
        dogLoaded ? dogsToDisplay.splice(spliceNumber, 1) : ""
        currentDog = getNextDog()
        groupBeingUsed === barcelonaRescueDogs ? superLikesLeft = barcelonaRescueDogs.length : superLikesLeft = 10
        render()
    }
}

 function addSwipeEventListeners(whichVersion){


        document.getElementById("profile-card").addEventListener('touchstart', e => {
            touchstartX = e.changedTouches[0].screenX
            touchstartY = e.changedTouches[0].screenY
            }, {passive: true})
    
        document.getElementById("profile-card").addEventListener('touchend', e => {
            touchendX = e.changedTouches[0].screenX
            touchendY = e.changedTouches[0].screenY
            whichVersion === "tutorialVersion" ? checkDirectionTutorialVersion() : checkDirection()        
            }, {passive: true})    
    }

function checkDirectionTutorialVersion(){
    touchendX - 75 > touchstartX && tutorialStep === 1 && tutorialSwipeIsAlive ? tutorialStepTwo()
        : touchendY + 75 < touchstartY && tutorialStep === 2 && tutorialSwipeIsAlive ? tutorialStepThree() 
            : touchendX + 75 < touchstartX  && tutorialStep === 3 && tutorialSwipeIsAlive ? tutorialStepFour() : ""
}

let tutorialStep = 1 
let tutorialSwipeIsAlive = true 


function generateTutorial(){
    superLikesLeft++
    document.getElementById("profile-container").style.backgroundImage = "none"
    document.getElementById("profile-container").style.animation = ""
    document.getElementById("profile-container").classList.remove("welcome-screen")
    dogsToDisplay = sampleDogs
    currentDog = getNextDog()
    render()
    disableAllButtons()
    document.getElementById("number-of-super-likes-left").classList.add("no-super-likes-left")
    document.getElementById("info-icon").style.opacity = "0.5"
    document.getElementById("info-icon").style.cursor = "not-allowed"
    document.getElementById("like-button").disabled = false
    document.getElementById("profile-card").innerHTML += `<p id="instruction" class="instruction-overlay">Swipe right ⮕  or press the <img src="images/icon-heart.png" class="instruction-image"> button to like a dog! Try it now!</p>`
    document.getElementById("like-button").addEventListener(typeOfInteraction, tutorialStepTwo, {passive: true} )
    addSwipeEventListeners("tutorialVersion")

}

function tutorialStepTwo(){
    tutorialSwipeIsAlive = false
    tutorialStep = 2
    document.getElementById("instruction").remove()
    like()
    document.getElementById("info-icon").style.opacity = "0.5"
    document.getElementById("like-button").disabled = true
    document.getElementById("like-button").removeEventListener(typeOfInteraction, tutorialStepTwo, {passive: true} )
    setTimeout(() => {
        tutorialSwipeIsAlive = true
        document.getElementById("profile-card").innerHTML += `<p id="instruction" class="instruction-overlay-2">Swipe up ⬆ or press the <img src="images/super-like-button.png" class="instruction-image"> button to superlike a dog! Try it now!</p>`
        document.getElementById("super-like-button").disabled = false
        document.getElementById("number-of-super-likes-left").classList.remove("no-super-likes-left")
        addSwipeEventListeners("tutorialVersion")
        document.getElementById("super-like-button").addEventListener(typeOfInteraction, tutorialStepThree, {passive: true} )
    }, 1000);
}

function tutorialStepThree(){
    tutorialSwipeIsAlive = false
    tutorialStep = 3
    document.getElementById("instruction").remove()
    superLike()
    document.getElementById("number-of-super-likes-left").classList.add("no-super-likes-left")
    document.getElementById("info-icon").style.opacity = "0.5"
    document.getElementById("super-like-button").disabled = true
    document.getElementById("super-like-button").removeEventListener(typeOfInteraction, tutorialStepThree, {passive: true} )
    setTimeout(() => {
        tutorialSwipeIsAlive = true
        document.getElementById("dislike-button").disabled = false
        document.getElementById("profile-card").innerHTML += `<p id="instruction" class="instruction-overlay">Swipe left ⬅ or press the <img src="images/icon-cross.png" class="instruction-image"> button to reject a dog! Try it now!</p>`
        addSwipeEventListeners("tutorialVersion")
        document.getElementById("dislike-button").addEventListener(typeOfInteraction, tutorialStepFour, {passive: true} )
    }, 1000);
}
function tutorialStepFour(){
    tutorialStep = 4
    tutorialSwipeIsAlive = false
    document.getElementById("instruction").remove()
    dislike()
    document.getElementById("number-of-super-likes-left").classList.add("no-super-likes-left")
    document.getElementById("dislike-button").disabled = true
    document.getElementById("dislike-button").removeEventListener(typeOfInteraction, tutorialStepFour, {passive: true} )
    setTimeout(() => {
        document.getElementById("undo-button").disabled = false
        document.getElementById("profile-card").innerHTML += `<p id="instruction" class="instruction-overlay-3">Regretting you rejected that dog? No worries! You can undo your choices by pressing the <img src="images/undo-arrow.png" class="instruction-image"> button! Try it now!</p>`
        document.getElementById("undo-button").addEventListener(typeOfInteraction, tutorialStepFive, {passive: true} )
    }, 1000)
    document.getElementById("info-icon").style.opacity = "0.5"

}

function tutorialStepFive(){
    document.getElementById("instruction").remove()
    undo()
    document.getElementById("number-of-super-likes-left").classList.add("no-super-likes-left")
    document.getElementById("undo-button").disabled = true
    document.getElementById("undo-button").removeEventListener(typeOfInteraction, tutorialStepFive, {passive: true} )
    setTimeout(() => {
        document.getElementById("info-icon").style.opacity = "1"
        document.getElementById("profile-card").innerHTML += `<p id="instruction" class="instruction-overlay-3">Remember: it's not all about looks! Read a dog's profile by pressing the <img src="images/info-icon.png" class="instruction-image"> button below! Try it now!</p>`
        document.getElementById("info-icon").addEventListener(typeOfInteraction, tutorialStepSix, {passive: true} )
    }, 1000);
}

function tutorialStepSix(){
    document.getElementById("info-icon").removeEventListener(typeOfInteraction, tutorialStepSix, {passive: true} )
    document.getElementById("instruction").remove()
    expand()
    document.getElementById("info-icon").style.opacity = "0.5"
    setTimeout(() => {
        document.getElementById("profile-card").innerHTML += `<p id="instruction" class="instruction-overlay-3">Press the <img src="images/down-arrow.png" class="instruction-image"> button to go back to a dog's full photo. Try it now!</p>`
        document.getElementById("info-icon").addEventListener(typeOfInteraction, tutorialStepSeven, {passive: true} )
    }, 1000);
}

function tutorialStepSeven(){
    document.getElementById("info-icon").removeEventListener(typeOfInteraction, tutorialStepSeven, {passive: true} )
    document.getElementById("instruction").remove()
    unexpand()
    document.getElementById("info-icon").style.opacity = "0.5"
    setTimeout(() => {
        document.getElementById("profile-card").innerHTML += `<p id="instruction" class="instruction-overlay-3">All the other buttons and links do things too! Try them out later! Ready to start looking at some real dogs of Barcelona?<br> <button id="ready-button">Ready!</button></p>`
        document.getElementById("ready-button").addEventListener(typeOfInteraction, tutorialStepEight, {passive: true} )
    }, 1000);
}

function tutorialStepEight(){
document.getElementById("profile-card").innerHTML = `<p id="instruction" class="instruction-overlay-3">There are two packs of dogs: rescue dogs from a local animal shelter and Facebook dogs from a local Facebook group. </p>
    <div id="welcome-screen-buttons-container">
    <p id="choose-pack-message"><span>Choose a pack:</span></p>
    <div id="welcome-screen-buttons-container-inner">
        <button id="adoption-button" class="welcome-screen-button"><img id="rescue-dog-icon" src="images/rescue-dog-icon.png"></button> 
        <button id="facebook-button" class="welcome-screen-button"><img id="facebook-dog-icon"  src="images/FacebookDogsIcon.png"></button> 
    </div>
    </div> 
    `    


    document.addEventListener(typeOfInteraction,function(e){
    if(e.target && e.target.id== 'facebook-dog-icon'){
        prepareForNormalInitialization()
        initialize(barcelonaFacebookDogs)
        }}, {passive: true} )

    document.addEventListener(typeOfInteraction,function(e){
    if(e.target && e.target.id== 'rescue-dog-icon'){
        prepareForNormalInitialization()
    initialize(barcelonaRescueDogs)
    }}, {passive: true} )    


        document.getElementById("instruction").style.animation = "fade-in-effect-delayed 4s ease both"
        document.getElementById("profile-container").style.animation = "background-zoom-out-3 3s ease-in-out both"
        document.getElementById("profile-container").style.backgroundImage = "url('images/Barcelona1.jpg')"
}

function prepareForNormalInitialization(){
    document.getElementById("profile-container").classList.remove("text-focus-in") 
    document.getElementById("profile-container").style.animation = "none"
    discardPile = [] 
    undoPile = []
    needsTutorial = false
    firstTimeRendering = true 
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

function unexpand(type) {
    resetTouchData()
    let animationDuration = ".5s"
    if (type === "quick"){
        animationDuration = ".2s"
    }
    profileIsExpanded = false 
    document.documentElement.style.setProperty('--initial-image-position', `${currentDog.secondaryObjectPosition}`);
    document.documentElement.style.setProperty('--final-image-position', `${currentDog.initialObjectPosition}`);
    document.getElementById("current-dog-photo").removeEventListener(typeOfInteraction, unexpand)
    // document.getElementById("current-dog-photo").style.objectPosition = currentDog.initialObjectPosition
    document.getElementById("current-dog-photo").style.animation = `make-image-bigger ${animationDuration} ease both, change-image-position ${animationDuration} ease both`
    document.getElementById("text-overlay-container").innerHTML = currentDog.getTextOverlayHtml()
    document.getElementById("expanded-profile-container").remove()
    document.getElementById("profile-container").style.overflow = "hidden"
    if (!needsTutorial) {
        document.getElementById("info-icon").removeEventListener(typeOfInteraction, unexpand, {passive: true})
        document.getElementById("info-icon").addEventListener(typeOfInteraction, expand, {passive: true})
        document.getElementById("current-dog-photo").addEventListener('touchstart', e => {
            touchstartX = e.changedTouches[0].screenX
            touchstartY = e.changedTouches[0].screenY
            }, {passive: true})
        document.getElementById("current-dog-photo").addEventListener('touchend', e => {
            touchendX = e.changedTouches[0].screenX
            touchendY = e.changedTouches[0].screenY
            checkDirection()
        }, {passive: true})
        document.getElementById("profile-card").removeEventListener('touchstart', e => {
            touchstartX = e.changedTouches[0].screenX
            }, {passive: true})
        document.getElementById("profile-card").removeEventListener('touchend', e => {
            touchendX = e.changedTouches[0].screenX
            checkDirection()
        }, {passive: true})
    }

}

function removeOtherScreen() {
    document.getElementById("home-screen-container") ? document.getElementById("home-screen-container").remove() : ""
    document.getElementById("profile-screen-container") ? document.getElementById("profile-screen-container").remove() : ""
    document.getElementById("chat-screen-container") ? document.getElementById("chat-screen-container").remove() : ""
}

function generateHomeScreen(){
    console.log("hello")
    removeOtherScreen()
    profileIsExpanded ? unexpand() : ""
    disableBottomButtons()
    document.getElementById("profile-container").innerHTML += `
    
                    <div id="home-screen-container" class="fade-in-effect">

                    <img src="images/TinDogLogo2.png" id="tindog-logo-2">

                    <p class="home-screen-message">Tindog was created by Daniel Beck Rose as a project
                    for the <a href="https://scrimba.com/learn/frontend">Scrimba Frontend Developer course</a>.</p>   

                    <p class="home-screen-message">His dog is Toby, a cocker spaniel, who has <a href="#" target="_blank">a profile</a> on Tindog, of course. The other Facebook dogs are from the <a href="https://www.facebook.com/groups/DogsBarcelona" target="_blank">Barcelona Dogs Facebook group</a>. The background images of Barcelona and the tutorial images of dogs are from <a href="https://unsplash.com/s/photos/barcelona" target="_blank">Unsplash</a>.</p>

                    <p class="home-screen-message">Daniel doesn't have a website, LinkedIn profile, or anything like that yet. 
                    If you want to get in touch with him, just <a href="mailto:danielbeckrose@gmail.com">email him</a> or <a href="https://www.facebook.com/danielbeckrose" target="_blank">message him on Facebook</a>.</p>

                    <button id="home-screen-back-button">Back</button>
                     </div>`
    document.getElementById("home-screen-back-button").addEventListener(typeOfInteraction, function(){
        goBack("home")}, {passive: true})

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

    document.getElementById(`${whichOne}-screen-back-button`).addEventListener(typeOfInteraction, function(){
        goBack(whichOne)}, {passive: true})

}

function generateGeneralDecisionEffects(){
    currentDog.hasBeenSwiped = true 
    document.getElementById("profile-container").scrollTo({top: 0, behavior: "smooth"})
    document.getElementById("badge-container").style.zIndex = "1"
    discardPile.push(currentDog)
}


let numberOfDeadSuperLikeSwipes = 0 

function superLike(){
    
        if (superLikesLeft > 0){
            profileIsExpanded ? unexpand("quick") : ""
            superLikesLeft--
            generateGeneralDecisionEffects()
            // currentDog.hasBeenSwiped = true 
            currentDog.hasBeenSuperLiked = true 
            // document.getElementById("profile-container").scrollTo({top: 0, behavior: "smooth"})
            // document.getElementById("badge-container").style.zIndex = "1"
            document.getElementById("super-like-badge").style.display = "block"
            document.getElementById("super-like-badge").classList.add("bounce-in-bck-3")
            // discardPile.push(currentDog)
            dogsToDisplay.length > 0 ? changeDogs("superLike") : noMoreDogs()
        } else {
            numberOfDeadSuperLikeSwipes++ 
            if (numberOfDeadSuperLikeSwipes === 2){
                document.getElementById("profile-card").innerHTML += `<p id="instruction" class="instruction-overlay">You've run out of superlikes.</p>`
                // document.getElementById("text-overlay-container").classList.remove("text-focus-in")
                document.getElementById("info-icon").addEventListener(typeOfInteraction, expand, {passive: true}) 
                document.getElementById("current-dog-photo").style.animation = ""
                setTimeout(() => {
                    document.getElementById("instruction") ? document.getElementById("instruction").remove() : ""
                    numberOfDeadSuperLikeSwipes = 0
                }, 2000)
                addSwipeEventListeners()
            }
        }
    updateSuperLikes()

}

function updateSuperLikes(){
    document.getElementById("number-of-super-likes-left").innerHTML = `x${superLikesLeft}`
    if (superLikesLeft <= 0) {
         document.getElementById("number-of-super-likes-left").classList.add("no-super-likes-left")
        document.getElementById("super-like-button").disabled = true 
    }

    superLikesLeft > 0 && document.getElementById("number-of-super-likes-left").classList.contains("no-super-likes-left") ? document.getElementById("number-of-super-likes-left").classList.remove("no-super-likes-left"):""

    if (superLikesLeft === 0) {
        document.getElementById("super-like-button").disabled = true
        document.getElementById("super-like-button").removeEventListener(typeOfInteraction, superLike, {passive: true})
    }
}

function like() {
    profileIsExpanded ? unexpand("quick") : ""
    currentDog.hasBeenSwiped = true 
    currentDog.hasBeenLiked = true
    document.getElementById("profile-container").scrollTo({top: 0, behavior: "smooth"})
    document.getElementById("badge-container").style.zIndex = "1"
    document.getElementById("like-badge").style.display = "block"
    document.getElementById("like-badge").classList.add("bounce-in-bck-2")
    discardPile.push(currentDog)
    dogsToDisplay.length > 0 ? changeDogs("like") : noMoreDogs()
 }

 function changeDogs(typeOfChange){

    let direction = "" 
    let kindOfDogToUse = ""
    const lastDog = currentDog
    currentDog  = getNextDog()

    typeOfChange === "like" ? direction = "right" 
        : typeOfChange === "superLike" ? direction = "top" 
        : typeOfChange === "dislike" ? direction = "left"
        : typeOfChange === "undo" ? 
            lastDog.hasBeenLiked ? direction = "right-reverse"
            :lastDog.hasBeenSuperLiked ?  direction = "top-reverse"
            : direction = "left-reverse" : ""

    typeOfChange === "undo" ? kindOfDogToUse = lastDog : kindOfDogToUse = currentDog

    setTimeout(() => {
        document.getElementById("profile-card").classList.add(`swing-out-${direction}-fwd`)
        document.getElementById("profile-container").style.backgroundImage = `url(${kindOfDogToUse.avatar}` 
        document.getElementById("profile-container").style.backgroundPosition = kindOfDogToUse.initialObjectPosition 
    }, 150)

    setTimeout(() => {
        render() 
    }, 350)
 }

 function dislike() {
    profileIsExpanded ? unexpand("quick") : ""
    currentDog.hasBeenSwiped = true 
    discardPile.push(currentDog)
    document.getElementById("profile-container").scrollTo({top: 0, behavior: "smooth"})
    document.getElementById("badge-container").style.zIndex = "1"
    document.getElementById("nope-badge").style.display = "block"
    document.getElementById("nope-badge").classList.add("bounce-in-bck")
    dogsToDisplay.length > 0 ? changeDogs("dislike") : noMoreDogs()
    
 }

 function resetTouchData(){
    touchstartX = 0
    touchstartY = 0
    touchendX = 0
    touchendY = 0 
 }

 function expand(){
    resetTouchData()
    document.documentElement.style.setProperty('--initial-image-position', `${currentDog.initialObjectPosition}`);
    document.documentElement.style.setProperty('--final-image-position', `${currentDog.secondaryObjectPosition}`);
    document.getElementById("info-icon").src = "images/down-arrow.png"
    document.getElementById("info-icon").style.bottom = `-${parseInt(window.getComputedStyle(document.getElementById("info-icon")).width) * 1.9}px`
    document.getElementById("name-overlay").remove()
    document.getElementById("location-overlay").remove()
    // document.getElementById("current-dog-photo").style.transition = "object-position 1s"
    // document.getElementById("current-dog-photo").style.objectPosition = currentDog.secondaryObjectPosition
    document.getElementById("current-dog-photo").style.animation = "make-image-smaller 1s ease both, change-image-position 1s ease both"
    // document.getElementById("current-dog-photo").style.animation = "change-image-position 1s ease both"
    // document.getElementById("text-overlay-container").classList.remove("text-focus-in")
    document.getElementById("profile-container").classList.remove("text-focus-in")
    document.getElementById("profile-container").style.backgroundImage = "none"
    document.getElementById("profile-container").style.overflowY  = "scroll"
    document.getElementById("profile-card").innerHTML += currentDog.getExpandedProfileHtml()


    if (!needsTutorial) {
        document.getElementById("share-link").addEventListener(typeOfInteraction, share, {passive: true})
        document.getElementById("info-icon").removeEventListener(typeOfInteraction, expand, {passive: true}) 
        document.getElementById("info-icon").addEventListener(typeOfInteraction, unexpand, {passive: true})
        document.getElementById("profile-card").addEventListener('touchstart', e => {
            touchstartX = e.changedTouches[0].screenX
            }, {passive: true})
        document.getElementById("profile-card").addEventListener('touchend', e => {
            touchendX = e.changedTouches[0].screenX
            checkDirection()
            }, {passive: true})
    }

    profileIsExpanded = true 
 }

function share(){
    unexpand("quick")
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

                        <button id="go-back-button">Go Back</button>

                    </div>
                </div>`
    
                document.getElementById("copy-link-button").addEventListener(typeOfInteraction, function(){
                    document.getElementById("copy-link-button-container").innerHTML += `<div id="text-copied-speech-bubble-container"> <img id="text-copied-speech-bubble" src="images/cartoon-bubble-left.png"> <div id="text-copied-speech-bubble-message">Copied!</div></div>`
                    navigator.clipboard.writeText(`${directLink}`)
                }, {passive: true})
    document.getElementById("go-back-button").addEventListener(typeOfInteraction, closeModal, {passive: true})
    document.addEventListener(typeOfInteraction,function(e){
        if(e.target && e.target.classList== 'share-button'){
            setTimeout(() => {
                closeModal()
            }, 1000);
        }}, {passive: true})
}

function closeModal(){
    document.getElementById("share-modal-overlay-container").remove()
    render()
    addAllButtonEventListeners()
    // document.getElementById("text-overlay-container").classList.remove("text-focus-in")
}

function loadApp(){

    // document.getElementById("header-button-container").style.opacity = "0.3"
    // document.getElementById("button-container").style.opacity = "0.3"

    if (window.innerWidth < 500){
        document.getElementById("header-button-container").style.display = "none"
        document.getElementById("button-container").style.display = "none"
    }

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
            needsTutorial = false 
            spliceNumber = i 
            dogToLoad = groupToSearch[i]
            generateWelcomeScreen()
        } 
    }
    if (!dogLoaded) {
        generateWelcomeScreen()
    }

}


let images = ["images/Agata.jpeg", "images/Annie.jpeg", "images/Arco.jpeg", "images/Aslan.jpeg", "images/badge-like.png", "images/badge-nope.png", "images/Balloo.jpeg", "images/Barcelona.jpg", "images/Barcelona2.jpg", "images/Barcelona3.jpg", "images/Barcelona4.jpg", "images/Bella.jpeg", "images/Buddy.jpeg", "images/Canica-Ting-Ting.jpeg", "images/cartoon-bubble-left.png", "images/Chico-2.jpeg", "images/Chico.jpeg", "images/Chilli.jpeg", "images/copy-link-icon.png", "images/Dana.jpeg", "images/Darling.jpeg", "images/DonPerro.jpg", "images/Duna.jpeg", "images/Ekaitz.jpeg", "images/email-icon.png", "images/Enzo.jpeg", 
                "images/facebook-icon.png", "images/FacebookDogsIcon.png", "images/Flecha.jpeg", "images/Frida.jpeg", "images/Gala.jpeg", "images/George.jpeg", "images/Gohan.jpeg", "images/Happy.jpeg", "images/HenryAndDobby.jpeg", "images/home-icon.png", "images/Horus.jpeg", "images/icon-chat.png", "images/icon-cross.png", "images/icon-heart.png", "images/icon-profile.png", "images/info-icon.png", "images/Izzy.jpeg", "images/Jordi.jpeg", "images/Kira.jpeg", "images/Kiwi.jpeg", "images/Kona.jpeg", "images/Lemmy.jpeg", "images/Lisa.jpeg", "images/location-icon-2.png", "images/location-icon.png", "images/logo.png", "images/Loky.jpeg", "images/Luna.jpeg", "images/Miga.jpeg", "images/Miles.jpeg", "images/Milo.jpeg", "images/Milow.jpeg", "images/Mora.jpeg", "images/Nemo.jpeg", "images/Neo.jpeg", "images/Nerea.jpeg", "images/Nina.jpeg", "images/Nudo.jpeg", "images/open-link-icon.png", "images/Otis.jpeg", "images/paw-button.png", "images/paw-print.png", "images/Penny.jpeg", "images/Pip.jpeg", "images/rescue-dog-icon.png", "images/Rex.jpeg", "images/Rino.jpeg", "images/Rollo.jpeg", "images/Salsifi.jpeg", "images/Sandy.jpeg", "images/Sansa.jpeg", "images/Sassy.jpeg", "images/security-logo.png", "images/Slinky.jpeg", "images/Spooky.jpeg", "images/super-like-badge.png", "images/super-like-button.png", "images/Teddy.jpeg", "images/Tero.jpeg", "images/Thor.jpeg", "images/ti.jpg", "images/TinDogLogo2.png", "images/Tita.jpeg", "images/Tizon.jpeg", "images/Toby.jpeg", "images/Tro.jpeg", "images/TrufoAndRufa.jpeg", "images/twitter-icon.png", "images/Tyler.jpeg", "images/undo-arrow.png", "images/Vermú.jpeg", "images/whatsapp-icon.png", "images/Wolfie.jpeg", "images/Yara.jpeg", "images/Yohji.jpeg", "images/Gretel.jpeg", "images/Prada.jpeg", "images/down-arrow.png", "images/Barcelona1.jpg", "images/sampleDog1.jpg", "images/sampleDog2.jpg", "images/sampleDog3.jpg", "images/sadDog.jpg"]

// function loadAppAssets () {

//     for (let i = 0; i < images.length; ++i) {
//         let img = new Image();
//         img.src = images[i];
//         i = images.length - 1 ? loadApp() : ""
//     }
// }

// loadAppAssets()



let loadingDotsTimer = setInterval(loadingDots, 200)
let dotCount = 0


function loadingDots(){
    dotCount++
    dotCount === 1 ? document.getElementById("dot-1").style.visibility = "visible" :
    dotCount === 2 ? document.getElementById("dot-2").style.visibility = "visible" :
    dotCount === 3 ? document.getElementById("dot-3").style.visibility = "visible" :
    dotCount === 4 ? loadingDotsReset() : ""
}
function loadingDotsReset(){
    document.getElementById("dot-2").style.visibility = "hidden" 
    document.getElementById("dot-3").style.visibility = "hidden" 
    document.getElementById("dot-1").style.visibility = "hidden" 
    dotCount = 0
    
}

async function loadImages(imageUrlArray) {
    const promiseArray = []; // create an array for promises
    const imageArray = []; // array for the images

    for (let imageUrl of imageUrlArray) {

        promiseArray.push(new Promise(resolve => {

            const img = new Image();

            img.onload = resolve
            // if you don't need to do anything when the image loads,
            // then you can just write img.onload = resolve;

            img.onload = function() {
                // do stuff with the image if necessary

                // resolve the promise, indicating that the image has been loaded
                resolve();
            };

            img.src = imageUrl;
            imageArray.push(img);
        }));
    }

    await Promise.all(promiseArray); // wait for all the images to be loaded
    document.body.classList.remove("light-blue-background")
    document.getElementById("loading-message").remove()
    clearInterval(loadingDotsTimer)
    document.getElementById("overall-container").style.display = "flex"
    loadApp()
    return imageArray;
}


function awaitImages(){
    document.body.classList.add("light-blue-background")
    document.getElementById("overall-container").style.display = "none"
    document.body.innerHTML += `<h1 id="loading-message">Loading Tindog<span id="dot-1">.</span><span id="dot-2">.</span><span id="dot-3">.</span></h1>`

}



awaitImages()

loadImages(images)
