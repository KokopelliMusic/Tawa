
class SongModel {

    SPOTIFY_TYPE = 0
    YOUTUBE_TYPE = 1

    constructor(title, songType, platformId, addedBy, playlistId) {
        this.title = title
        this.songType = songType
        this.platformId = platformId
        this.addedBy = addedBy
        this.playlistId = playlistId
        this.plays = 0
    }

    setSpotifyParams(artist, cover, length) {
        this.artist = artist
        this.cover = cover
        this.length = length
    }

    save(db) {
        const stmt
        if (this.songType === this.SPOTIFY_TYPE) {
            stmt = db.prepare('INSERT INTO song (title, song_type, plays, platform_id, added_by, artist, cover, length, playlist_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
            stmt.run(this.title, this.songType, this.plays, this.platformId, this.addedBy, this.artist, this.cover, this.length, this.playlistId)
        } else {
            stmt = db.prepare('INSERT INTO song (title, song_type, plays, platform_id, added_by, playlist_id) VALUES (?, ?, ?, ?, ?, ?)')
            stmt.run(this.title, this.songType, this.plays, this.platformId, this.addedBy, this.playlistId)
        }
        stmt.finalize();
    }
}

module.exports = SongModel