const util = require('util');

class SessionModel {

    constructor(playlistId, userId) {
        this.playlist = playlist;
        this.user = user;
        this.id = util.generateSessionId();
    }

    toJSON() {
        return {
            id: this.id,
            playlist: this.playlist,
            user: this.user
        };
    }

    save(db) {
        const stmt = db
            .prepare('INSERT INTO session (id, playlist_id, user_id) VALUES (?, ?, ?)')
            .run(this.id, this.playlist, this.user);
        stmt.finalize();
    }
}

module.exports = SessionModel
