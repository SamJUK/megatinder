const fs = require('fs');
const path = require('path');
const dotenv = require ('dotenv');

dotenv.refresh = function (options) {
    let dotenvPath = path.resolve(process.cwd(), '.env');
    let encoding = 'utf8';

    if (options) {
        if (options.path !== null) {
            dotenvPath = options.path
        }
        if (options.encoding !== null) {
            encoding = options.encoding
        }
    }

    try {
        // specifying an encoding returns a string instead of a buffer
        const parsed = dotenv.parse(fs.readFileSync(dotenvPath, { encoding }));

        Object.keys(parsed).forEach(function (key) {
            process.env[key] = parsed[key];
        });

        return { parsed }
    } catch (e) {
        return { error: e }
    }
};

module.exports = dotenv;