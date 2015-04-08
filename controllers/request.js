var Request = require('../models/Request');
var gcm = require('node-gcm');

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
    console.log(req.body);
    var request = new Request({
        desc: req.body.desc,
        location : [req.body.longitude, req.body.latitude],
        category: req.body.category,
        amount: req.body.amount,
        userName: req.body.userName,
        deviceToken: req.body.deviceToken
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


exports.sendPushNotification = function (request, result) {
    var token = request.query.token;
    var senderName = request.query.name;
 //   console.log(token)
 //   token = "APA91bGz3FY7xsDABZJGwaBZ4_q_RZNT4y0NDsnkX16e33xqsm6zraX79MA5xwgO3Os4o5_B8i5U54LfE9J325D0JrfwpDBgO-kwYB5QbO35e6rtBOYMQHA7JOmoC1ZMt5RDigR-qQOd";
//    console.log(token)
    var http = require('http');
    
    var data = {
        "collapseKey": "applice",
        "delayWhileIdle": true,
        "timeToLive": 3,
        "data": {
            "message": "My message",
            "title": "My Title",
            "name": senderName
        },
        "registration_ids": [token]
    };
    
    var dataString = JSON.stringify(data);
    var headers = {
        'Authorization' : 'key=AIzaSyDn4m3wHDacjE5IivzgAt5Fi2A0JrFbb8A',
        'Content-Type' : 'application/json',
        'Content-Length' : dataString.length
    };
    
    var options = {
        host: 'android.googleapis.com',
        port: 80,
        path: '/gcm/send',
        method: 'POST',
        headers: headers
    };
    
    //Setup the request 
    var req = http.request(options, function (res) {
        res.setEncoding('utf-8');
        
        var responseString = '';
        
        res.on('data', function (data) {
            responseString += data;
        });
        
        res.on('end', function () {
            var resultObject = JSON.parse(responseString);
            console.log(resultObject);
            result.send(responseString);
        });
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));

    });
    
    req.on('error', function (e) {
        // TODO: handle error.
        console.log('error : ' + e.message + e.code);
        result.send(e);
    });
    
    req.write(dataString);
    req.end();
};