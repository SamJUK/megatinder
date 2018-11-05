const express = require('express');
const router = express.Router();

const model = require('../models/profiles');

router.get('/', (req, res, next) => {
    const offset = req.body.offset || 0;
    const limit = req.body.limit || 5;

    let opts =  {
        offset: offset,
        limit: limit
    };

    model.getUsers(req.db, opts).then(function(doc) {
        res.status(200).json(doc);
    }).catch(function(err) {
        const error = new Error(err);
        error.status = 500;
        next(error);
        return;
    });
});

router.get('/:id', (req, res, next) => {
    const id = req.params.id;
    const user = model.getUser(req.db, id);

    if(user === false) {
        const error = new Error('User Not Found');
        error.status = 404;
        next(error);
        return;
    }

    res.status(200).json(user);
});


router.put('/:id', (req, res, next) => {
   const id = req.params.id;

   if(req.body.hasOwnProperty('_id') && req.body._id !== null) {
     model.insertUser(req.db, req.body)
         .then(function(doc) {
            res.status(200).json(doc);
         })
         .catch(function(err) {
             const error = new Error(err.errmsg);
             error.status = 500;
             next(error);
             return;
         });
   }

});

module.exports = router;