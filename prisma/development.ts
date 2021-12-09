import { PrismaClient, SongType } from ".prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding the database');
    const user0 = await prisma.user.create({
        data: {
            username: 'Test1',
            auth0Id: 'auth0|1'
        }
    })

    const user1 = await prisma.user.create({
        data: {
            username: 'Test2',
            auth0Id: 'auth0|2'
        }
    })

    const playlist00 = await prisma.playlist.create({
        data: {
            name: 'TestPlaylist0User0',
            userId: user0.id
        }
    })

    const playlist01 = await prisma.playlist.create({
        data: {
            name: 'TestPlaylist1User0',
            userId: user0.id
        }
    })

    const playlist10 = await prisma.playlist.create({
        data: {
            name: 'TestPlaylist0User1',
            userId: user1.id
        }
    })

    const song0 = await prisma.song.create({
        data: {
            title: 'Atje voor de Sfeer',
            userId: user0.id,
            playCount: 0,
            playlistId: playlist00.id,
            songType: SongType.SPOTIFY,
            platformId: '2bJaewMbxlwnm69zvOAq3s',

            artist: 'Rene Karst',
            album: 'Atje voor de Sfeer',
            length: 198222,
            cover: 'https://i.scdn.co/image/ab67616d0000b273437e84d6f118fe0ef8e17af8'
        }
    })

    const song1 = await prisma.song.create({
        data: {
            title: 'Kali (Outsiders Remix)',
            userId: user0.id,
            playCount: 0,
            playlistId: playlist00.id,
            songType: SongType.SPOTIFY,
            platformId: '5i0Okd7ctP2yCq2fHERUMw',

            artist: 'Outsiders, Django Wagner',
            album: 'Kali (Outsiders Remix)',
            length: 249000,
            cover: 'https://i.scdn.co/image/ab67616d0000b27396815e028826cfeed6f7cbe1'
        }
    })

    const song2 = await prisma.song.create({
        data: {
            title: 'Sterrenstof',
            userId: user0.id,
            playCount: 0,
            playlistId: playlist00.id,
            songType: SongType.SPOTIFY,
            platformId: '7D5vAulNfrQV6xEwzgH0OF',

            artist: 'De Jeugd Van Tegenwoordig',
            album: 'De lachende derde',
            length: 220946,
            cover: 'https://i.scdn.co/image/ab67616d0000b27393696f9522599af13abea2b5'
        }
    })

    console.log(user0, user1)
    console.log(playlist00, playlist01, playlist10)
    console.log(song0, song1, song2)
}

main()
    .then((e) => {
        console.log(e)
        process.exit(0)
    })
    .finally(async () => {
        await prisma.$disconnect();
    })