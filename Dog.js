import {barcelonaFacebookDogs, barcelonaRescueDogs}  from "../data.js"

class Dog{
    constructor(data) {
        Object.assign(this, data)
        const {name, avatar, age} = this 
    }


    getTextOverlayHtml(){
        const {name, age} = this 
        return `<p id="name-overlay">${name}, &nbsp${age}</p>
        <div id="location-overlay"><img src="images/location-icon.png" id="location-icon">&nbsp&nbspBarcelona, Spain</div>
        <img id="info-icon" src="images/info-icon.png">`
    }

    getProfileHtml(){
        const textOverlayHtml = this.getTextOverlayHtml()
        return `
        <div id="profile-card">
            <div id="badge-container">
                <img id="nope-badge" src="images/badge-nope.png">
                <img id="like-badge" src="images/badge-like.png">
            </div>
            <img id="current-dog-photo" class="current-dog-photo"  src="${this.avatar}"}>
            <div id="text-overlay-container">
               ${textOverlayHtml}
             </div>
        </div>` 
        
    }

    getExpandedProfileHtml(){
        return `<div class="expanded-profile-container" id="expanded-profile-container">
                    <div id="profile-header">
                        <p id="name-overlay-2">${this.name}, &nbsp${this.age}</p>
                        <div id="location-overlay-2"><img src="images/location-icon-2.png" id="location-icon-2">&nbsp&nbspBarcelona, Spain</div>
                    </div>
                     <p id="profile-text">${this.bio} </p> 
                     <div id="profile-footer">
                        <p id="share-link">Share ${this.name}'s Profile</p>
                     </div>
                </div>`
         }    

    generateShareLink(dogName, groupName){
        return `www.whatever.com/?dog=${dogName.replaceAll(' ', '%20')}%26group=${groupName}`
    }
    generateDirectLink(dogName, groupName){
        return `www.whatever.com/?dog=${dogName.replaceAll(' ', '%20')}&group=${groupName}`
    }
}


export default Dog
