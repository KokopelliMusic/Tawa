import { gql } from "apollo-server-core";

export const typeDefs = gql`
    type Query {
    }

    enum SongType {
        SPOTIFY,
        YOUTUBE
    }

    type Session {
        id: String!
        user: User!
        playlist: Playlist!
    }

    type User {
        id: Int!
        createdAt: String!
        updatedAt: String!

        username: String!
        auth0Id: String!
    }

    type Playlist {
        id: Int!
        createdAt: Date!
        updatedAt: Date!

        user: User!
        name: String!
        songs: [Song]!

    }

    type Song {
        id: Int!
        createdAt: Date!
        updatedAt: Date!

        title: String!
        playCount: Int!
        addedBy: User!
        playlist: Playlist!
        songType: SongType!
        platformId: String!

        # Only Spotify has these properties
        artist: String
        length: Int
        album: String
        cover: String
    }
`

export const resolvers = {
    Query: {
        // test: () => [{ id: 1, name: 'test' }]
    }
}