const express = require('express');
const PlaylistModel = require('./models/PlaylistModel');
const SessionModel = require('./models/SessionModel');
const { generateSessionID } = require('./util');
const router = express.Router();

router.get(
    '/new',
    (req, res) => {
        // ugh ff dit fixen
        const session = new SessionModel(req.body.playlistId, req.body.userId)

        session.save(req.db)

        res.status(200).json(session.toJSON())
    }
)

module.exports = router