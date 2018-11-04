const fs = require('fs');

module.exports = {

    profiles_path: './profiles/mine',

    getUser: function(uid) {
        const path = `${this.profiles_path}/${uid}.json`;

        if(!fs.existsSync(path)) {
            return false;
        }

        return JSON.parse(fs.readFileSync(path));
    },

    getUsers: function(params) {
        let files = this.getProfilesByDate().slice(params.offset, params.limit);
        return files.map(file => this.getUser(file.substr(0, file.length-5)));},

    getProfilesByDate: function() {
        let files = fs.readdirSync( this.profiles_path );
        let sorted = [];
        if(files.length > 1) {
            sorted = files.sort((a, b) => {
                let s1 = fs.statSync(`${this.profiles_path}/${a}`);
                let s2 = fs.statSync(`${this.profiles_path}/${b}`);
                return s1.ctime < s2.ctime;
            });
        }
        return sorted;
    }
};