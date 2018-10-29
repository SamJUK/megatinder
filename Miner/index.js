"use strict";
const dotenv = require('../dotenv-sam');
dotenv.config();

const fs = require('fs-extra');
const tinder = require('tinder');
const tinderClient = new tinder.TinderClient();
global.tinderClient = tinderClient;

const divider = () => console.log('--------------------');

const genders = [
    'Male',
    'Female'
];

const onAuth = () => {
    if( tinderClient.userId === null ) {
        console.log('Invalid Access Token Regenerating and waiting 1 min');
        // Exec AutoAuth
        const { spawn } = require('child_process');
        const autoauth = spawn('npm', ['run', 'auth']);

        autoauth.stdout.on('data', (data) => console.log(`stdout: ${data}`));
        autoauth.stderr.on('data', (data) => console.log(`stderr: ${data}`));
        autoauth.on('close', (code) => console.log(`child process exited with code ${code}`));


        // Wait 15 sec before retrying
        setTimeout(function(){
            dotenv.refresh();
            authenticate();
        }, 15 * 1000);
        return;
    }

    const user = tinderClient.defaults.user;
    const full_name = user.full_name;
    const id = user._id;

    console.log(`Connected as ${full_name} - ${id}`);
    console.log(`Gender: ${genders[user.gender]}`);
    console.log(`Target Gender: ${genders[user.gender_filter]}`);
    console.log(`Age Filter: ${user.age_filter_min} - ${user.age_filter_max}`);
    console.log(`Distance Filter: ${user.distance_filter}`);
    console.log(`Traveling: ${user.is_traveling}`);
    console.log(`Discoverable: ${user.discoverable}`);
    console.log(`Is Banned: ${user.banned}`);
    console.log(`Groups: ${JSON.stringify(user.groups)}`);
    divider();

    // Do Miney things
};

const authenticate = () => {
    tinderClient.authorize(
        process.env.TINDER_ACCESS_TOKEN,
        process.env.userID,
        onAuth
    );
};

authenticate();