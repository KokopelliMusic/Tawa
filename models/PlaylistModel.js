
class PlaylistModel {

    constructor(name, userId) {
        this.name = name;
        this.userId = userId;
    }

    save(db) {
        const stmt = db.prepare(`INSERT INTO playlist (name, user_id) VALUES (?, ?)`);
        stmt.run(this.name, this.userId);
        stmt.finalize();
    }

}

module.exports = PlaylistModel;