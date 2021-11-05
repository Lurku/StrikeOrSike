var express = require('express');
const {createRoom, isRoomJoinable, getRoom} = require("../players");
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Hit or Miss', room: req.session.room});
});

router.post('/create_game', function (req, res, next) {
    // Todo: validate input
    const room = createRoom(req.body.name, req.body.room);
    // store name in session variable
    req.session.name = req.body.name;
    if (room.error) {
        // Todo: redirect on error
        res.redirect('/error');
    } else {
        res.redirect('/' + req.body.room);
    }

});

router.post('/join_game', function (req, res, next) {
    // Todo: validate input
    const room = isRoomJoinable(req.body.name, req.body.room);
    // store name in session variable
    req.session.name = req.body.name;
    if (room.error) {
        // Todo: redirect on error
        res.redirect('/error');
    } else {
        res.redirect('/' + req.body.room);
    }
});

router.get('/:room', function (req, res, next) {
    // Todo: validate room
    const room = getRoom(req.params.room);

    if (!room) {
        res.redirect('/error');
        return;
    }

    // if player doesn't have a name redirect them to join page with room filled in
    if(!req.session.name){
        req.session.room = req.params.room;
        res.redirect('/');
    }
    const player = room.players.find(player => player.name = req.session.name);


    res.render('hitormiss', {name: req.session.name, room: room, leader: player.leader});

});


module.exports = router;
