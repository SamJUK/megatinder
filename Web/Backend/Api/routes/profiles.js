const express = require('express');
const router = express.Router();

const model = require('../models/profiles');

router.get('/', (req, res, next) => {
    const offset = req.body.offset || 0;
    const limit = req.body.limit || 5;

    const profiles = model.getUsers({
        offset: offset,
        limit: limit
    });

    res.status(200).json(profiles);
});

router.get('/:id', (req, res, next) => {
    const id = req.params.id;
    const user = model.getUser(id);

    if(user === false) {
        const error = new Error('User Not Found');
        error.status = 404;
        next(error);
        return;
    }

    res.status(200).json(user);
});

module.exports = router;