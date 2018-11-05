let API_BASE = 'http://127.0.0.1:8081';
let API_PROFILES_ENDPOINT = API_BASE+'/profiles';

let currentProfile = null;
let profiles = [];

function fetchNewProfiles () {

    fetch(API_PROFILES_ENDPOINT, {
        method: 'get'
    }).then(function (response) {
        response.json().then(json => {
            if(json.hasOwnProperty('error')) {
                throw `${json.error.status} - ${json.error.message}`;
            }

            profiles = [...profiles, ...json];
            nextProfile();

        }).catch( err => {
            console.log('Error on json convert', err);
        });

    }).catch(function (err) {
        console.log('Error occurred fetching profiles', err)
    });
}

function nextProfile() {
    if(currentProfile !== null) {
        profiles.splice(0, 1);
    }
    let profile = profiles[0];
    let name = profile.name;
    let distance = profile.distance_mi;
    let bio = profile.bio;
    let birthdate = profile.birth_date;
    let age = (new Date()).getYear() - (new Date(birthdate)).getYear();

    document.querySelector('.name_val').innerText = name;
    document.querySelector('.age_val').innerText = age;
    document.querySelector('.distance_val').innerText = distance;
    document.querySelector('.bio_val').innerText = bio;

    // Images
    let photos = profile.photos;
    photos = photos.map( photo => photo.processedFiles[0].url );
    photos.forEach( photo => {
        document.querySelector('.img_val').src = photo;
        return true;
    });

    let tab_container = document.querySelector('.card-stack__image-counter');
    for (let i = 0; i < photos.length; i++) {
        let tab = document.createElement('div');
        tab.className = 'card-stack__image-count ';
        if(i === 0) tab.className += 'card-stack__image-count--active ';
        tab_container.appendChild(tab);
    }

    currentProfile = profile.id;
}


function onReady() {
    fetchNewProfiles();

}

if(document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", onReady);
} else {
    onReady();
}