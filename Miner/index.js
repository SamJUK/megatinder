/**
 * @TODO: Abstacrt functions out properly
 */

"use strict";
const dotenv = require('../dotenv-sam');
dotenv.config();

const fs = require('fs-extra');
const http = require("http");
const tinder = require('tinder');
const tinderClient = new tinder.TinderClient();
global.tinderClient = tinderClient;

const divider = () => console.log('--------------------');

const genders = [
    'Male',
    'Female'
];

const save_user_data =  function(results) {
    for(let i = 0; i < results.length; i++) {
        let id = results[i]._id;
        let name = results[i].name;

        let put_opts = {
            host: process.env.API_HOST || 'localhost',
            port: process.env.API_PORT || '8081',
            path: `/profiles/${id}`,
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }
        };

        let req = http.request(put_opts);
        req.write(JSON.stringify(results[i]));
        req.end();
        console.log('PUT Data for ' + name + ' : ' + id);
    }

    // Wait for 5 seconds not to overwhelm the server
    // Unless we have over 50 items then wait 10 minutes
    let timeout = 5 * 1000;
    setTimeout(mine, timeout);
};

const mine = () => {
    tinderClient.getRecommendations(1, function(err, data) {
        if(err){
            console.log('An error occured!', JSON.stringify(err));
            fs.writeFileSync('errors.json', JSON.stringify(err));
            return;
        }

        if(data.hasOwnProperty('message') && data.message === 'recs exhausted'){
            console.log('Recs Exhausted Waiting for 30 minutes');
            setTimeout(mine, (60 * 1000) * 30);
            return;
        }

        if(data.hasOwnProperty('message') && data.message === 'recs timeout') {
            console.log('Recs Timeout Waiting for 30 minutes');
            setTimeout(mine, (60 * 1000) * 30);
            return;
        }

        save_user_data(data.results);
    });
};

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

    mine();
};

const authenticate = () => {
    tinderClient.authorize(
        process.env.TINDER_ACCESS_TOKEN,
        process.env.userID,
        onAuth
    );
};

authenticate();