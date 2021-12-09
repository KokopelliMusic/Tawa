import { gql } from "apollo-server-core";
import { Playlist, PrismaClient, Session, Song } from ".prisma/client";
import { GraphQLScalarType, Kind } from "graphql";

const prisma = new PrismaClient();

// Define the Date Type
const dateScalar = new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    serialize(value) {
        return value.getTime(); // Convert outgoing Date to integer for JSON
    },
    parseValue(value) {
        return new Date(value); // Convert incoming integer to Date
    },
    parseLiteral(ast) {
        if (ast.kind === Kind.INT) {
            return new Date(parseInt(ast.value, 10)); // Convert hard-coded AST string to integer and then to Date
        }
        return null; // Invalid hard-coded value (not an integer)
    },
});


export const typeDefs = gql`
    scalar Date

    type Query {
        song(id: Int!): Song
        playlist(id: Int!): Playlist
        sessionById(id: String!): Session
        sessionByUser(user: String!): Session
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
    Date: dateScalar,
    Query: {
        playlist: async (_: any, { id }: Playlist) => {
            return await prisma.playlist.findFirst({
                where: { id }
            })
        },
        song: async (_: any, { id }: Song) => {
            return await prisma.song.findFirst({
                where: { id }
            })
        },
        sessionById: async (_: any, { id }: Session) => {
            return await prisma.session.findFirst({
                where: { id }
            });
        },
        sessionByUser: async(_: any, { userId }: Session) => {
            return await prisma.session.findFirst({
                where: { userId }
            });
        },
    }
}