var Request = require('../models/Request');

/**
 * GET /newrequest
 */
exports.newRequest = function (req, res) {
    res.render('newrequest', {
        title: 'Display Add Request'
    });
    //res.redirect('/newrequest');
};

/**
 * POST /addRequest
 * Add request
 * desc, longitude, latitude, category, amount
 */
exports.addRequest = function (req, res, next) {
    //req.assert('desc', 'Description is not valid').isEmail();
    //req.assert('category', 'Password must be at least 4 characters long').len(4);
    
    //var errors = req.validationErrors();
    
    //if (errors) {
    //    req.flash('errors', errors);
    //    return res.redirect('/signup');
    //}
    //console.error(req);
    var request = new Request({
        desc: req.body.desc,
        location : [req.body.longitude, req.body.latitude],
        category: req.body.category,
        amount: req.body.amount
    });
    
    request.save(function (err) {
        console.error(err);
        if (err) return next(err);
        res.redirect('/newrequest');
    });
};

/**
 * GET /getAllRequests
 * Returns all the requests
 */
exports.getAllRequests = function (req, res) {
    Request.find({}, function (err, requests) {
        
        res.send(requests);
    });
};

/**
 * GET /getRequestByLocation
 * Returns the requests by location
 * (longitude, latitude)
 */
exports.getRequestByLocation = function (req, res) {
    Request.find({
        location: {
            $near: [req.params.longitude,req.params.latitude],
            $maxDistance: 100
        }
    }).exec(function (err, requests) {
        if (err) {
            console.error(err);
            return res.status(500).json(err);
        }
    
        res.status(200).json(requests);
    });
};

/**
 * GET /getRequestByLocation
 * Returns the requests by location
 * (longitude, latitude)
 */
exports.clearRequests = function (req, res) {
    Request.remove(function (err) {
        console.error(err);
        if (err) return next(err);
        res.send("Success");
    });
};


exports.removeById = function (req, res) {
    Request.remove({ "_id": ObjectId(req.params.id) },function (err) {
        console.error(err);
        if (err) return next(err);
        res.send("Success");
    });
};