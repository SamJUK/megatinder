const fs = require('fs');

module.exports = {

    db_table: 'profiles',
    profiles_path: './profiles/mine',

    getUser: function(db, uid) {
        const path = `${this.profiles_path}/${uid}.json`;

        if(!fs.existsSync(path)) {
            return false;
        }

        return JSON.parse(fs.readFileSync(path));
    },

    getUsers: function(db, params) {
        let collection = db.get(this.db_table);
        return collection.find({});
    },

    insertUser: function(db, body) {
        let collection = db.get(this.db_table);
        return collection.insert(body);
    }
};