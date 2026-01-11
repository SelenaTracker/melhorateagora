// ============================================
// SISTEMA COMPLETO DE STREAMS - SELENA GOMEZ
// ============================================

// 1. DADOS COMPLETOS DE TODAS AS MÚSICAS (150+)
const initialMusicData = [
    // Colaborações e Músicas Principais (Primeiras 40)
    {
        id: 1,
        name: "We Don't Talk Anymore (feat. Selena Gomez)",
        album: "Nine Track Mind",
        artist: "Charlie Puth ft. Selena Gomez",
        totalStreams: 2431368336,
        dailyStreams: 1169562,
        goal: 2500000000,
        lastUpdated: new Date().toISOString().split('T')[0],
        isCollab: true,
        color: "#FF6B8B"
    },
    {
        id: 2,
        name: "Calm Down (with Selena Gomez)",
        album: "Calm Down (Remixes)",
        artist: "Rema ft. Selena Gomez",
        totalStreams: 1803387295,
        dailyStreams: 587856,
        goal: 2000000000,
        lastUpdated: new Date().toISOString().split('T')[0],
        isCollab: true,
        color: "#4CAF50"
    },
    {
        id: 3,
        name: "Taki Taki (with Selena Gomez, Ozuna & Cardi B)",
        album: "Taki Taki",
        artist: "DJ Snake ft. Selena Gomez",
        totalStreams: 1780374919,
        dailyStreams: 337014,
        goal: 2000000000,
        lastUpdated: new Date().toISOString().split('T')[0],
        isCollab: true,
        color: "#2196F3"
    },
    {
        id: 4,
        name: "It Ain't Me (with Selena Gomez)",
        album: "It Ain't Me",
        artist: "Kygo ft. Selena Gomez",
        totalStreams: 1665937012,
        dailyStreams: 462429,
        goal: 1800000000,
        lastUpdated: new Date().toISOString().split('T')[0],
        isCollab: true,
        color: "#FF9800"
    },
    {
        id: 5,
        name: "Wolves",
        album: "Wolves",
        artist: "Selena Gomez",
        totalStreams: 1514656556,
        dailyStreams: 223746,
        goal: 1700000000,
        lastUpdated: new Date().toISOString().split('T')[0],
        isCollab: false,
        color: "#8A2BE2"
    },
    {
        id: 6,
        name: "Lose You To Love Me",
        album: "Rare",
        artist: "Selena Gomez",
        totalStreams: 1431427847,
        dailyStreams: 289171,
        goal: 1600000000,
        lastUpdated: new Date().toISOString().split('T')[0],
        isCollab: false,
        color: "#8A2BE2"
    },
    {
        id: 7,
        name: "Back To You - From 13 Reasons Why – Season 2 Soundtrack",
        album: "13 Reasons Why (Season 2)",
        artist: "Selena Gomez",
        totalStreams: 1195648690,
        dailyStreams: 158178,
        goal: 1400000000,
        lastUpdated: new Date().toISOString().split('T')[0],
        isCollab: false,
        color: "#8A2BE2"
    },
    {
        id: 8,
        name: "Good For You",
        album: "Revival",
        artist: "Selena Gomez",
        totalStreams: 905974404,
        dailyStreams: 311440,
        goal: 1000000000,
        lastUpdated: new Date().toISOString().split('T')[0],
        isCollab: false,
        color: "#8A2BE2"
    },
    {
        id: 9,
        name: "Hands To Myself",
        album: "Revival",
        artist: "Selena Gomez",
        totalStreams: 764452763,
        dailyStreams: 107860,
        goal: 900000000,
        lastUpdated: new Date().toISOString().split('T')[0],
        isCollab: false,
        color: "#8A2BE2"
    },
    {
        id: 10,
        name: "Same Old Love",
        album: "Revival",
        artist: "Selena Gomez",
        totalStreams: 762260175,
        dailyStreams: 198507,
        goal: 900000000,
        lastUpdated: new Date().toISOString().split('T')[0],
        isCollab: false,
        color: "#8A2BE2"
    },
    {
        id: 11,
        name: "Fetish (feat. Gucci Mane)",
        album: "Fetish",
        artist: "Selena Gomez",
        totalStreams: 683375292,
        dailyStreams: 226501,
        goal: 800000000,
        lastUpdated: new Date().toISOString().split('T')[0],
        isCollab: true,
        color: "#9C27B0"
    },
    {
        id: 12,
        name: "Ice Cream (with Selena Gomez)",
        album: "THE ALBUM",
        artist: "BLACKPINK ft. Selena Gomez",
        totalStreams: 649801143,
        dailyStreams: 111814,
        goal: 800000000,
        lastUpdated: new Date().toISOString().split('T')[0],
        isCollab: true,
        color: "#FF4081"
    },
    {
        id: 13,
        name: "The Heart Wants What It Wants",
        album: "For You",
        artist: "Selena Gomez",
        totalStreams: 634450747,
        dailyStreams: 154325,
        goal: 700000000,
        lastUpdated: new Date().toISOString().split('T')[0],
        isCollab: false,
        color: "#8A2BE2"
    },
    {
        id: 14,
        name: "Kill Em With Kindness",
        album: "Revival",
        artist: "Selena Gomez",
        totalStreams: 581931469,
        dailyStreams: 48615,
        goal: 650000000,
        lastUpdated: new Date().toISOString().split('T')[0],
        isCollab: false,
        color: "#8A2BE2"
    },
    {
        id: 15,
        name: "Bad Liar",
        album: "Bad Liar",
        artist: "Selena Gomez",
        totalStreams: 539106203,
        dailyStreams: 39466,
        goal: 600000000,
        lastUpdated: new Date().toISOString().split('T')[0],
        isCollab: false,
        color: "#8A2BE2"
    },
    {
        id: 16,
        name: "Baila Conmigo (with Rauw Alejandro)",
        album: "Revelación",
        artist: "Selena Gomez",
        totalStreams: 512606675,
        dailyStreams: 51440,
        goal: 600000000,
        lastUpdated: new Date().toISOString().split('T')[0],
        isCollab: true,
        color: "#4CAF50"
    },
    {
        id: 17,
        name: "Come & Get It",
        album: "Stars Dance",
        artist: "Selena Gomez",
        totalStreams: 494200392,
        dailyStreams: 125763,
        goal: 550000000,
        lastUpdated: new Date().toISOString().split('T')[0],
        isCollab: false,
        color: "#8A2BE2"
    },
    {
        id: 18,
        name: "People You Know",
        album: "Rare",
        artist: "Selena Gomez",
        totalStreams: 441992182,
        dailyStreams: 246997,
        goal: 500000000,
        lastUpdated: new Date().toISOString().split('T')[0],
        isCollab: false,
        color: "#8A2BE2"
    },
    {
        id: 19,
        name: "I Want You To Know",
        album: "True Colors",
        artist: "Zedd ft. Selena Gomez",
        totalStreams: 385917941,
        dailyStreams: 77873,
        goal: 450000000,
        lastUpdated: new Date().toISOString().split('T')[0],
        isCollab: true,
        color: "#2196F3"
    },
    {
        id: 20,
        name: "I Can't Get Enough (benny blanco, Selena Gomez, J Balvin, Tainy)",
        album: "I Can't Get Enough",
        artist: "benny blanco ft. Selena Gomez",
        totalStreams: 372867903,
        dailyStreams: 26075,
        goal: 450000000,
        lastUpdated: new Date().toISOString().split('T')[0],
        isCollab: true,
        color: "#FF9800"
    },
    {
        id: 21,
        name: "Look At Her Now",
        album: "Rare",
        artist: "Selena Gomez",
        totalStreams: 339234462,
        dailyStreams: 28498,
        goal: 400000000,
        lastUpdated: new Date().toISOString().split('T')[0],
        isCollab: false,
        color: "#8A2BE2"
    },
    {
        id: 22,
        name: "Rare",
        album: "Rare",
        artist: "Selena Gomez",
        totalStreams: 305722137,
        dailyStreams: 24991,
        goal: 350000000,
        lastUpdated: new Date().toISOString().split('T')[0],
        isCollab: false,
        color: "#8A2BE2"
    },
    {
        id: 23,
        name: "Let Somebody Go",
        album: "Music Of The Spheres",
        artist: "Coldplay & Selena Gomez",
        totalStreams: 293562362,
        dailyStreams: 57651,
        goal: 350000000,
        lastUpdated: new Date().toISOString().split('T')[0],
        isCollab: true,
        color: "#3F51B5"
    },
    {
        id: 24,
        name: "Single Soon",
        album: "Single Soon",
        artist: "Selena Gomez",
        totalStreams: 270462580,
        dailyStreams: 50629,
        goal: 300000000,
        lastUpdated: new Date().toISOString().split('T')[0],
        isCollab: false,
        color: "#8A2BE2"
    },
    {
        id: 25,
        name: "Slow Down",
        album: "Stars Dance",
        artist: "Selena Gomez",
        totalStreams: 200582586,
        dailyStreams: 61326,
        goal: 250000000,
        lastUpdated: new Date().toISOString().split('T')[0],
        isCollab: false,
        color: "#8A2BE2"
    },
    {
        id: 26,
        name: "Ojos Tristes (with The Marías)",
        album: "Ojos Tristes",
        artist: "Selena Gomez",
        totalStreams: 193630315,
        dailyStreams: 312200,
        goal: 250000000,
        lastUpdated: new Date().toISOString().split('T')[0],
        isCollab: true,
        color: "#4CAF50"
    },
    {
        id: 27,
        name: "Feel Me",
        album: "Rare (Deluxe)",
        artist: "Selena Gomez",
        totalStreams: 188892142,
        dailyStreams: 23260,
        goal: 220000000,
        lastUpdated: new Date().toISOString().split('T')[0],
        isCollab: false,
        color: "#8A2BE2"
    },
    {
        id: 28,
        name: "Trust Nobody",
        album: "Trust Nobody",
        artist: "DJ Snake ft. Selena Gomez",
        totalStreams: 183960917,
        dailyStreams: 4328,
        goal: 200000000,
        lastUpdated: new Date().toISOString().split('T')[0],
        isCollab: true,
        color: "#2196F3"
    },
    {
        id: 29,
        name: "Past Life (with Selena Gomez)",
        album: "Past Life",
        artist: "Trevor Daniel ft. Selena Gomez",
        totalStreams: 175465508,
        dailyStreams: 13566,
        goal: 200000000,
        lastUpdated: new Date().toISOString().split('T')[0],
        isCollab: true,
        color: "#FF9800"
    },
    {
        id: 30,
        name: "My Mind & Me",
        album: "My Mind & Me",
        artist: "Selena Gomez",
        totalStreams: 143218997,
        dailyStreams: 16173,
        goal: 170000000,
        lastUpdated: new Date().toISOString().split('T')[0],
        isCollab: false,
        color: "#8A2BE2"
    },
    {
        id: 31,
        name: "Boyfriend",
        album: "Rare",
        artist: "Selena Gomez",
        totalStreams: 139268031,
        dailyStreams: 10008,
        goal: 160000000,
        lastUpdated: new Date().toISOString().split('T')[0],
        isCollab: false,
        color: "#8A2BE2"
    },
    {
        id: 32,
        name: "Souvenir",
        album: "Rare",
        artist: "Selena Gomez",
        totalStreams: 135740321,
        dailyStreams: 72566,
        goal: 150000000,
        lastUpdated: new Date().toISOString().split('T')[0],
        isCollab: false,
        color: "#8A2BE2"
    },
    {
        id: 33,
        name: "Call Me When You Break Up (with Gracie Abrams)",
        album: "Call Me When You Break Up",
        artist: "Selena Gomez",
        totalStreams: 126978816,
        dailyStreams: 95699,
        goal: 150000000,
        lastUpdated: new Date().toISOString().split('T')[0],
        isCollab: true,
        color: "#9C27B0"
    },
    {
        id: 34,
        name: "Me & The Rhythm",
        album: "Revival",
        artist: "Selena Gomez",
        totalStreams: 125298194,
        dailyStreams: 13910,
        goal: 140000000,
        lastUpdated: new Date().toISOString().split('T')[0],
        isCollab: false,
        color: "#8A2BE2"
    },
    {
        id: 35,
        name: "Anxiety (with Selena Gomez)",
        album: "Anxiety",
        artist: "Julia Michaels ft. Selena Gomez",
        totalStreams: 124922257,
        dailyStreams: 5807,
        goal: 140000000,
        lastUpdated: new Date().toISOString().split('T')[0],
        isCollab: true,
        color: "#FF6B8B"
    },
    {
        id: 36,
        name: "Selfish Love (with Selena Gomez)",
        album: "Justice",
        artist: "DJ Snake ft. Selena Gomez",
        totalStreams: 121439780,
        dailyStreams: 12187,
        goal: 140000000,
        lastUpdated: new Date().toISOString().split('T')[0],
        isCollab: true,
        color: "#2196F3"
    },
    {
        id: 37,
        name: "Sober",
        album: "Revival",
        artist: "Selena Gomez",
        totalStreams: 109957567,
        dailyStreams: 11909,
        goal: 130000000,
        lastUpdated: new Date().toISOString().split('T')[0],
        isCollab: false,
        color: "#8A2BE2"
    },
    {
        id: 38,
        name: "De Una Vez",
        album: "Revelación",
        artist: "Selena Gomez",
        totalStreams: 108141450,
        dailyStreams: 8591,
        goal: 120000000,
        lastUpdated: new Date().toISOString().split('T')[0],
        isCollab: false,
        color: "#8A2BE2"
    },
    {
        id: 39,
        name: "It Ain't Me (with Selena Gomez) - Tiësto's AFTR:HRS Remix",
        album: "It Ain't Me (Remixes)",
        artist: "Kygo ft. Selena Gomez",
        totalStreams: 102658617,
        dailyStreams: 3817,
        goal: 120000000,
        lastUpdated: new Date().toISOString().split('T')[0],
        isCollab: true,
        color: "#FF9800"
    },
    {
        id: 40,
        name: "Bluest Flame",
        album: "Rare (Deluxe)",
        artist: "Selena Gomez",
        totalStreams: 89739384,
        dailyStreams: 105642,
        goal: 100000000,
        lastUpdated: new Date().toISOString().split('T')[0],
        isCollab: false,
        color: "#8A2BE2"
    },
    // Continuação com mais músicas...
    {
        id: 41,
        name: "Only You",
        album: "13 Reasons Why (Season 2)",
        artist: "Selena Gomez",
        totalStreams: 88253600,
        dailyStreams: 6656,
        goal: 100000000,
        lastUpdated: new Date().toISOString().split('T')[0],
        isCollab: false,
        color: "#8A2BE2"
    },
    {
        id: 42,
        name: "999 (with Camilo)",
        album: "999",
        artist: "Selena Gomez ft. Camilo",
        totalStreams: 86027332,
        dailyStreams: 6431,
        goal: 100000000,
        lastUpdated: new Date().toISOString().split('T')[0],
        isCollab: true,
        color: "#4CAF50"
    },
    {
        id: 43,
        name: "Me & My Girls",
        album: "Revival",
        artist: "Selena Gomez",
        totalStreams: 84239431,
        dailyStreams: 13328,
        goal: 90000000,
        lastUpdated: new Date().toISOString().split('T')[0],
        isCollab: false,
        color: "#8A2BE2"
    },
    {
        id: 44,
        name: "Ring",
        album: "Revival",
        artist: "Selena Gomez",
        totalStreams: 79265873,
        dailyStreams: 11678,
        goal: 90000000,
        lastUpdated: new Date().toISOString().split('T')[0],
        isCollab: false,
        color: "#8A2BE2"
    },
    {
        id: 45,
        name: "Love On",
        album: "Rare (Deluxe)",
        artist: "Selena Gomez",
        totalStreams: 79083754,
        dailyStreams: 18219,
        goal: 90000000,
        lastUpdated: new Date().toISOString().split('T')[0],
        isCollab: false,
        color: "#8A2BE2"
    },
    {
        id: 46,
        name: "How Does It Feel To Be Forgotten",
        album: "Rare",
        artist: "Selena Gomez",
        totalStreams: 73207212,
        dailyStreams: 54894,
        goal: 80000000,
        lastUpdated: new Date().toISOString().split('T')[0],
        isCollab: false,
        color: "#8A2BE2"
    },
    {
        id: 47,
        name: "Vulnerable",
        album: "Rare",
        artist: "Selena Gomez",
        totalStreams: 70641106,
        dailyStreams: 9878,
        goal: 80000000,
        lastUpdated: new Date().toISOString().split('T')[0],
        isCollab: false,
        color: "#8A2BE2"
    },
    {
        id: 48,
        name: "Dance Again",
        album: "Rare",
        artist: "Selena Gomez",
        totalStreams: 68852013,
        dailyStreams: 7201,
        goal: 80000000,
        lastUpdated: new Date().toISOString().split('T')[0],
        isCollab: false,
        color: "#8A2BE2"
    },
    {
        id: 49,
        name: "Love Will Remember",
        album: "Stars Dance",
        artist: "Selena Gomez",
        totalStreams: 68575246,
        dailyStreams: 6141,
        goal: 80000000,
        lastUpdated: new Date().toISOString().split('T')[0],
        isCollab: false,
        color: "#8A2BE2"
    },
    {
        id: 50,
        name: "Crowded Room (feat. 6LACK)",
        album: "Rare",
        artist: "Selena Gomez",
        totalStreams: 65686269,
        dailyStreams: 6489,
        goal: 75000000,
        lastUpdated: new Date().toISOString().split('T')[0],
        isCollab: true,
        color: "#9C27B0"
    },
    {
        id: 51,
        name: "Love You Like A Love Song",
        album: "When The Sun Goes Down",
        artist: "Selena Gomez & The Scene",
        totalStreams: 1203724659,
        dailyStreams: 821636,
        goal: 1300000000,
        lastUpdated: new Date().toISOString().split('T')[0],
        isCollab: false,
        color: "#8A2BE2"
    },
    {
        id: 52,
        name: "Who Says",
        album: "For You",
        artist: "Selena Gomez & The Scene",
        totalStreams: 609461132,
        dailyStreams: 164347,
        goal: 700000000,
        lastUpdated: new Date().toISOString().split('T')[0],
        isCollab: false,
        color: "#8A2BE2"
    },
    {
        id: 53,
        name: "Naturally",
        album: "Kiss & Tell",
        artist: "Selena Gomez & The Scene",
        totalStreams: 178435093,
        dailyStreams: 62629,
        goal: 200000000,
        lastUpdated: new Date().toISOString().split('T')[0],
        isCollab: false,
        color: "#8A2BE2"
    },
    {
        id: 54,
        name: "A Year Without Rain",
        album: "A Year Without Rain",
        artist: "Selena Gomez & The Scene",
        totalStreams: 140256795,
        dailyStreams: 59457,
        goal: 200000000,
        lastUpdated: new Date().toISOString().split('T')[0],
        isCollab: false,
        color: "#8A2BE2"
    },
    // Adicione todas as outras músicas seguindo o mesmo padrão...
    // Continue até a música 150+
];

// 2. SISTEMA DE ARMAZENAMENTO COMPLETO
class StorageSystem {
    constructor() {
        this.initializeStorage();
    }

    initializeStorage() {
        // Verificar se já existem dados
        const existingData = localStorage.getItem('musicData');
        if (!existingData) {
            localStorage.setItem('musicData', JSON.stringify(initialMusicData));
        }

        // Inicializar votação
        if (!localStorage.getItem('votingData')) {
            const votingData = {
                currentVotes: {
                    "A Year Without Rain": 0,
                    "Bluest Flame": 0,
                    "Only You": 0,
                    "Anxiety": 0
                },
                totalVotes: 0,
                nextReset: this.getNextResetTime(),
                votingHistory: [],
                currentVoters: []
            };
            localStorage.setItem('votingData', JSON.stringify(votingData));
        }

        // Inicializar música foco
        if (!localStorage.getItem('focusSong')) {
            const focusSong = {
                songId: 1, // We Don't Talk Anymore como padrão
                startDate: new Date().toISOString(),
                endDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                previousSongs: []
            };
            localStorage.setItem('focusSong', JSON.stringify(focusSong));
        }

        // Inicializar histórico
        if (!localStorage.getItem('streamHistory')) {
            const today = new Date().toISOString().split('T')[0];
            const musicData = this.getMusicData();
            const history = {};
            history[today] = musicData.map(song => ({
                id: song.id,
                totalStreams: song.totalStreams,
                dailyStreams: song.dailyStreams
            }));
            localStorage.setItem('streamHistory', JSON.stringify(history));
        }

        // Inicializar dados do usuário
        if (!localStorage.getItem('userData')) {
            localStorage.setItem('userData', JSON.stringify({
                loggedIn: false,
                username: '',
                email: '',
                points: 0,
                lastLogin: null,
                completedTasks: [],
                streak: 0,
                lastActive: null,
                totalPointsEarned: 0
            }));
        }

        // Inicializar álbuns
        if (!localStorage.getItem('albums')) {
            this.initializeAlbums();
        }

        // Inicializar histórico de metas
        if (!localStorage.getItem('goalUpdateHistory')) {
            localStorage.setItem('goalUpdateHistory', JSON.stringify([]));
        }

        // Inicializar último check de metas
        if (!localStorage.getItem('lastGoalCheck')) {
            localStorage.setItem('lastGoalCheck', new Date().toDateString());
        }

        // Inicializar contador de usuários
        if (!localStorage.getItem('totalUsers')) {
            localStorage.setItem('totalUsers', '1');
        }
    }

    initializeAlbums() {
        const albums = [
            {
                id: 1,
                name: "Revival",
                artist: "Selena Gomez",
                totalStreams: 0,
                dailyStreams: 0,
                color: "#8A2BE2",
                songs: [8, 9, 10, 14, 21, 34, 37, 43, 44] // IDs das músicas
            },
            {
                id: 2,
                name: "Rare",
                artist: "Selena Gomez",
                totalStreams: 0,
                dailyStreams: 0,
                color: "#FF6B8B",
                songs: [6, 18, 22, 31, 32, 46, 47, 48, 50]
            },
            {
                id: 3,
                name: "Stars Dance",
                artist: "Selena Gomez",
                totalStreams: 0,
                dailyStreams: 0,
                color: "#4CAF50",
                songs: [17, 25, 49]
            },
            {
                id: 4,
                name: "Revelación",
                artist: "Selena Gomez",
                totalStreams: 0,
                dailyStreams: 0,
                color: "#2196F3",
                songs: [16, 38]
            },
            {
                id: 5,
                name: "When The Sun Goes Down",
                artist: "Selena Gomez & The Scene",
                totalStreams: 0,
                dailyStreams: 0,
                color: "#FF9800",
                songs: [51]
            },
            {
                id: 6,
                name: "A Year Without Rain",
                artist: "Selena Gomez & The Scene",
                totalStreams: 0,
                dailyStreams: 0,
                color: "#9C27B0",
                songs: [54]
            },
            {
                id: 7,
                name: "Kiss & Tell",
                artist: "Selena Gomez & The Scene",
                totalStreams: 0,
                dailyStreams: 0,
                color: "#3F51B5",
                songs: [53]
            },
            {
                id: 8,
                name: "For You",
                artist: "Selena Gomez & The Scene",
                totalStreams: 0,
                dailyStreams: 0,
                color: "#00BCD4",
                songs: [13, 52]
            }
        ];

        // Calcular streams dos álbuns
        const musicData = this.getMusicData();
        albums.forEach(album => {
            album.totalStreams = album.songs.reduce((sum, songId) => {
                const song = musicData.find(s => s.id === songId);
                return sum + (song ? song.totalStreams : 0);
            }, 0);
            
            album.dailyStreams = album.songs.reduce((sum, songId) => {
                const song = musicData.find(s => s.id === songId);
                return sum + (song ? song.dailyStreams : 0);
            }, 0);
        });

        localStorage.setItem('albums', JSON.stringify(albums));
    }

    getNextResetTime() {
        const now = new Date();
        const nextMonday = new Date(now);
        
        // Encontrar próxima segunda-feira às 21:00 (horário de Brasília)
        const daysUntilMonday = (8 - now.getDay()) % 7;
        nextMonday.setDate(now.getDate() + (daysUntilMonday || 7));
        nextMonday.setHours(21, 0, 0, 0);
        
        // Ajustar para UTC-3 (Brasília)
        nextMonday.setUTCHours(nextMonday.getUTCHours() - 3);
        
        return nextMonday.toISOString();
    }

    getMusicData() {
        return JSON.parse(localStorage.getItem('musicData')) || initialMusicData;
    }

    getMusicById(id) {
        const data = this.getMusicData();
        return data.find(song => song.id === id);
    }

    getMusicByName(name) {
        const data = this.getMusicData();
        return data.find(song => 
            song.name.toLowerCase().includes(name.toLowerCase())
        );
    }

    updateMusicData(newData) {
        localStorage.setItem('musicData', JSON.stringify(newData));
        this.updateStreamHistory(newData);
        this.updateAlbumStats(newData);
        return newData;
    }

    updateAlbumStats(musicData) {
        const albums = JSON.parse(localStorage.getItem('albums')) || [];
        
        albums.forEach(album => {
            album.totalStreams = album.songs.reduce((sum, songId) => {
                const song = musicData.find(s => s.id === songId);
                return sum + (song ? song.totalStreams : 0);
            }, 0);
            
            album.dailyStreams = album.songs.reduce((sum, songId) => {
                const song = musicData.find(s => s.id === songId);
                return sum + (song ? song.dailyStreams : 0);
            }, 0);
        });

        localStorage.setItem('albums', JSON.stringify(albums));
    }

    updateStreamHistory(data) {
        const today = new Date().toISOString().split('T')[0];
        const history = JSON.parse(localStorage.getItem('streamHistory')) || {};
        
        history[today] = data.map(song => ({
            id: song.id,
            totalStreams: song.totalStreams,
            dailyStreams: song.dailyStreams
        }));
        
        localStorage.setItem('streamHistory', JSON.stringify(history));
    }

    getAlbums() {
        return JSON.parse(localStorage.getItem('albums')) || [];
    }

    getTopAlbums(limit = 5) {
        const albums = this.getAlbums();
        return albums
            .sort((a, b) => b.totalStreams - a.totalStreams)
            .slice(0, limit);
    }

    getVotingData() {
        return JSON.parse(localStorage.getItem('votingData'));
    }

    updateVotingData(data) {
        localStorage.setItem('votingData', JSON.stringify(data));
    }

    getFocusSong() {
        return JSON.parse(localStorage.getItem('focusSong'));
    }

    updateFocusSong(data) {
        localStorage.setItem('focusSong', JSON.stringify(data));
    }

    getUserData() {
        return JSON.parse(localStorage.getItem('userData'));
    }

    updateUserData(data) {
        localStorage.setItem('userData', JSON.stringify(data));
    }

    getPoints() {
        const userData = this.getUserData();
        return userData.points || 0;
    }

    updatePoints(points) {
        const userData = this.getUserData();
        userData.points = points;
        userData.totalPointsEarned = (userData.totalPointsEarned || 0) + points;
        this.updateUserData(userData);
        return points;
    }

    addPoints(amount, task) {
        const userData = this.getUserData();
        userData.points = (userData.points || 0) + amount;
        userData.totalPointsEarned = (userData.totalPointsEarned || 0) + amount;
        
        // Registrar tarefa completada
        userData.completedTasks = userData.completedTasks || [];
        userData.completedTasks.push({
            task,
            points: amount,
            date: new Date().toISOString()
        });
        
        this.updateUserData(userData);
        return userData.points;
    }

    hasCompletedTaskToday(task) {
        const userData = this.getUserData();
        if (!userData.completedTasks) return false;
        
        const today = new Date().toDateString();
        return userData.completedTasks.some(t => 
            t.task === task && new Date(t.date).toDateString() === today
        );
    }

    getGoalUpdateHistory(limit = 50) {
        const history = JSON.parse(localStorage.getItem('goalUpdateHistory')) || [];
        return history.slice(-limit);
    }

    addGoalUpdate(update) {
        const history = this.getGoalUpdateHistory(100);
        history.push({
            ...update,
            date: new Date().toISOString(),
            timestamp: Date.now()
        });
        localStorage.setItem('goalUpdateHistory', JSON.stringify(history));
    }

    incrementUserCount() {
        let totalUsers = parseInt(localStorage.getItem('totalUsers')) || 0;
        totalUsers++;
        localStorage.setItem('totalUsers', totalUsers.toString());
        return totalUsers;
    }

    getTotalUsers() {
        return parseInt(localStorage.getItem('totalUsers')) || 1;
    }
}

// 3. SISTEMA DE ESCALONAMENTO DE METAS
class GoalScalingSystem {
    constructor() {
        this.rules = [
            {
                minDaily: 400000,
                maxDaily: Infinity,
                increment: 5000000,
                description: "Acima de 400k/dia: sobe de 5 em 5 milhões",
                color: "#8A2BE2"
            },
            {
                minDaily: 200000,
                maxDaily: 399999,
                increment: 3000000,
                description: "Entre 200k-399k: sobe de 3 em 3 milhões",
                color: "#FF6B8B"
            },
            {
                minDaily: 100000,
                maxDaily: 199999,
                increment: 2000000,
                description: "Entre 100k-199k: sobe de 2 em 2 milhões",
                color: "#4CAF50"
            },
            {
                minDaily: 30000,
                maxDaily: 95999,
                increment: 1000000,
                description: "Entre 30k-95k: sobe de 1 em 1 milhão",
                color: "#FF9800"
            },
            {
                minDaily: 11000,
                maxDaily: 25000,
                increment: 200000,
                description: "Entre 11k-25k: sobe de 200 em 200 mil",
                color: "#2196F3"
            },
            {
                minDaily: 0,
                maxDaily: 10999,
                increment: 100000,
                description: "Abaixo de 11k: sobe de 100 em 100 mil",
                color: "#9C27B0"
            }
        ];
    }

    calculateNewGoal(currentTotal, dailyStreams, currentGoal) {
        const applicableRule = this.rules.find(rule => 
            dailyStreams >= rule.minDaily && dailyStreams <= rule.maxDaily
        );

        if (!applicableRule) {
            return currentGoal;
        }

        // Verificar se a meta atual foi batida
        if (currentTotal >= currentGoal) {
            const newGoal = currentGoal + applicableRule.increment;
            return {
                newGoal,
                rule: applicableRule,
                increased: true
            };
        }

        return {
            newGoal: currentGoal,
            rule: applicableRule,
            increased: false
        };
    }

    checkAndUpdateAllGoals() {
        const musicData = storage.getMusicData();
        const updates = [];
        let anyUpdated = false;

        const updatedData = musicData.map(song => {
            const result = this.calculateNewGoal(
                song.totalStreams,
                song.dailyStreams,
                song.goal
            );

            if (result.increased && result.newGoal !== song.goal) {
                const oldGoal = song.goal;
                song.goal = result.newGoal;
                anyUpdated = true;

                updates.push({
                    songId: song.id,
                    songName: song.name,
                    oldGoal: oldGoal,
                    newGoal: result.newGoal,
                    dailyStreams: song.dailyStreams,
                    rule: result.rule,
                    progress: (song.totalStreams / result.newGoal) * 100
                });
            }

            return song;
        });

        if (anyUpdated) {
            storage.updateMusicData(updatedData);
            updates.forEach(update => storage.addGoalUpdate(update));
        }

        return updates;
    }

    getRuleForDailyStreams(dailyStreams) {
        return this.rules.find(rule => 
            dailyStreams >= rule.minDaily && dailyStreams <= rule.maxDaily
        );
    }

    simulateFutureGoals(currentTotal, dailyStreams, currentGoal, steps = 5) {
        const simulation = [];
        let simCurrentTotal = currentTotal;
        let simCurrentGoal = currentGoal;
        
        for (let i = 0; i < steps; i++) {
            const result = this.calculateNewGoal(simCurrentTotal, dailyStreams, simCurrentGoal);
            
            if (result.increased) {
                simCurrentGoal = result.newGoal;
            }
            
            const daysToNextGoal = Math.ceil((simCurrentGoal - simCurrentTotal) / dailyStreams);
            const estimatedDate = new Date();
            estimatedDate.setDate(estimatedDate.getDate() + daysToNextGoal);
            
            simulation.push({
                step: i + 1,
                targetGoal: simCurrentGoal,
                daysToReach: daysToNextGoal,
                estimatedDate: estimatedDate.toLocaleDateString('pt-BR'),
                dailyRequired: dailyStreams,
                rule: result.rule
            });
            
            simCurrentTotal = simCurrentGoal;
        }
        
        return simulation;
    }
}

// 4. UTILITÁRIOS
function formatNumber(num) {
    if (num >= 1000000000) {
        return (num / 1000000000).toFixed(2).replace('.', ',') + 'B';
    }
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1).replace('.', ',') + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1).replace('.', ',') + 'K';
    }
    return num.toLocaleString('pt-BR');
}

function parseNumber(str) {
    if (!str) return 0;
    
    str = str.toString().trim();
    
    // Remover pontos e vírgulas, converter para número
    let cleanStr = str.replace(/\./g, '').replace(',', '.');
    
    // Verificar se tem B, M, K
    if (cleanStr.includes('B')) {
        return parseFloat(cleanStr.replace('B', '')) * 1000000000;
    }
    if (cleanStr.includes('M')) {
        return parseFloat(cleanStr.replace('M', '')) * 1000000;
    }
    if (cleanStr.includes('K')) {
        return parseFloat(cleanStr.replace('K', '')) * 1000;
    }
    
    return parseFloat(cleanStr) || 0;
}

function calculateDaysToGoal(current, goal, dailyAverage) {
    if (dailyAverage <= 0 || current >= goal) return 0;
    const remaining = goal - current;
    return Math.ceil(remaining / dailyAverage);
}

function calculateProgress(current, goal) {
    if (goal <= 0) return 0;
    const progress = (current / goal) * 100;
    return Math.min(100, Math.round(progress * 10) / 10);
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function getTimeRemaining(endTime) {
    const total = Date.parse(endTime) - Date.parse(new Date());
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    
    return {
        total,
        days,
        hours,
        minutes,
        seconds
    };
}

function updateVotingTimer() {
    const votingData = storage.getVotingData();
    if (!votingData || !votingData.nextReset) return;
    
    const time = getTimeRemaining(votingData.nextReset);
    
    if (time.total <= 0) {
        // Resetar votação
        votingData.currentVotes = {
            "A Year Without Rain": 0,
            "Bluest Flame": 0,
            "Only You": 0,
            "Anxiety": 0
        };
        votingData.totalVotes = 0;
        votingData.currentVoters = [];
        votingData.nextReset = storage.getNextResetTime();
        storage.updateVotingData(votingData);
        
        // Atualizar música foco com a mais votada
        updateFocusSongFromVotes();
    }
    
    return time;
}

function updateFocusSongFromVotes() {
    const votingData = storage.getVotingData();
    const votes = votingData.currentVotes;
    
    // Encontrar música mais votada
    let maxVotes = 0;
    let winningSong = null;
    
    Object.entries(votes).forEach(([songName, voteCount]) => {
        if (voteCount > maxVotes) {
            maxVotes = voteCount;
            winningSong = songName;
        }
    });
    
    if (winningSong) {
        // Encontrar a música no banco de dados
        const musicData = storage.getMusicData();
        const song = musicData.find(s => 
            s.name.includes(winningSong) || winningSong.includes(s.name)
        );
        
        if (song) {
            const focusSong = storage.getFocusSong();
            focusSong.previousSongs = focusSong.previousSongs || [];
            focusSong.previousSongs.push({
                songId: song.id,
                songName: song.name,
                date: new Date().toISOString(),
                votes: maxVotes
            });
            
            focusSong.songId = song.id;
            focusSong.startDate = new Date().toISOString();
            focusSong.endDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
            
            storage.updateFocusSong(focusSong);
            
            // Mostrar notificação
            showNotification(`"${song.name}" é a nova Música Foco do Dia!`, 'success');
        }
    }
}

// 5. SISTEMA DE NOTIFICAÇÕES
class NotificationSystem {
    constructor() {
        this.container = null;
        this.createContainer();
    }

    createContainer() {
        this.container = document.createElement('div');
        this.container.className = 'notifications-container';
        this.container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 10px;
            max-width: 350px;
        `;
        document.body.appendChild(this.container);
    }

    show(message, type = 'info', duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            background: var(--card-bg);
            border-left: 4px solid ${type === 'success' ? '#4CAF50' : type === 'error' ? '#F44336' : '#2196F3'};
            color: var(--text-color);
            padding: 15px 20px;
            border-radius: var(--border-radius);
            box-shadow: var(--box-shadow);
            display: flex;
            align-items: center;
            gap: 15px;
            animation: slideIn 0.3s ease;
            transform: translateX(400px);
        `;

        const icon = document.createElement('i');
        icon.className = `fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}`;
        icon.style.color = type === 'success' ? '#4CAF50' : type === 'error' ? '#F44336' : '#2196F3';

        const messageEl = document.createElement('span');
        messageEl.textContent = message;

        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '&times;';
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: var(--text-secondary);
            font-size: 20px;
            cursor: pointer;
            margin-left: auto;
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: var(--transition);
        `;
        closeBtn.onmouseover = () => closeBtn.style.background = 'rgba(255, 255, 255, 0.1)';
        closeBtn.onmouseout = () => closeBtn.style.background = 'none';
        closeBtn.onclick = () => this.removeNotification(notification);

        notification.appendChild(icon);
        notification.appendChild(messageEl);
        notification.appendChild(closeBtn);
        this.container.appendChild(notification);

        // Animação de entrada
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);

        // Auto-remover após duração
        if (duration > 0) {
            setTimeout(() => {
                this.removeNotification(notification);
            }, duration);
        }

        return notification;
    }

    removeNotification(notification) {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode === this.container) {
                this.container.removeChild(notification);
            }
        }, 300);
    }
}

// 6. SISTEMA DE PONTOS
class PointsSystem {
    constructor() {
        this.tasks = {
            daily_login: { points: 1, description: "Login diário" },
            use_calculator: { points: 1, description: "Usar calculadora" },
            search_music: { points: 1, description: "Buscar música" },
            listen_focus: { points: 2, description: "Ouvir música foco" },
            listen_playlist: { points: 3, description: "Ouvir playlist" },
            vote: { points: 1, description: "Votar" },
            update_streams: { points: 2, description: "Atualizar streams" },
            add_music: { points: 5, description: "Adicionar música" }
        };
    }

    awardPoints(taskName) {
        const task = this.tasks[taskName];
        if (!task) return 0;

        const userData = storage.getUserData();
        
        // Verificar se já completou a tarefa hoje
        if (storage.hasCompletedTaskToday(taskName)) {
            return 0;
        }

        const points = storage.addPoints(task.points, taskName);
        
        // Mostrar notificação
        const notification = new NotificationSystem();
        notification.show(`+${task.points} ponto(s): ${task.description}`, 'success');
        
        return points;
    }

    getPointsHistory() {
        const userData = storage.getUserData();
        return userData.completedTasks || [];
    }

    getTodayPoints() {
        const history = this.getPointsHistory();
        const today = new Date().toDateString();
        
        return history
            .filter(task => new Date(task.date).toDateString() === today)
            .reduce((sum, task) => sum + task.points, 0);
    }

    getTotalPoints() {
        return storage.getPoints();
    }

    getRank() {
        const points = this.getTotalPoints();
        if (points >= 100) return "Lenda";
        if (points >= 50) return "Super Fã";
        if (points >= 25) return "Fã Dedicado";
        if (points >= 10) return "Fã";
        return "Iniciante";
    }
}

// 7. INICIALIZAÇÃO DO SISTEMA
let storage = null;
let goalSystem = null;
let notificationSystem = null;
let pointsSystem = null;

function initializeSystems() {
    storage = new StorageSystem();
    goalSystem = new GoalScalingSystem();
    notificationSystem = new NotificationSystem();
    pointsSystem = new PointsSystem();
    
    // Verificar e atualizar metas automaticamente
    checkGoalUpdates();
    
    // Atualizar timer de votação
    setInterval(updateVotingTimer, 1000);
    
    return {
        storage,
        goalSystem,
        notificationSystem,
        pointsSystem
    };
}

function checkGoalUpdates() {
    const lastCheck = localStorage.getItem('lastGoalCheck');
    const today = new Date().toDateString();
    
    if (lastCheck !== today) {
        const updates = goalSystem.checkAndUpdateAllGoals();
        
        if (updates.length > 0) {
            // Criar notificação de grupo
            let message = `${updates.length} meta(s) atualizada(s): `;
            updates.slice(0, 3).forEach(update => {
                message += `${update.songName} → ${formatNumber(update.newGoal)}; `;
            });
            if (updates.length > 3) {
                message += `e mais ${updates.length - 3}...`;
            }
            
            notificationSystem.show(message, 'info', 8000);
        }
        
        localStorage.setItem('lastGoalCheck', today);
    }
}

// 8. EXPORTAR PARA USO GLOBAL
window.SelenaStreamTracker = {
    storage: null,
    goalSystem: null,
    notificationSystem: null,
    pointsSystem: null,
    formatNumber,
    parseNumber,
    calculateDaysToGoal,
    calculateProgress,
    formatDate,
    getTimeRemaining,
    initializeSystems
};

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    const systems = initializeSystems();
    
    // Atribuir aos objetos globais
    window.SelenaStreamTracker.storage = systems.storage;
    window.SelenaStreamTracker.goalSystem = systems.goalSystem;
    window.SelenaStreamTracker.notificationSystem = systems.notificationSystem;
    window.SelenaStreamTracker.pointsSystem = systems.pointsSystem;
    
    console.log('Sistema Selena Stream Tracker inicializado com sucesso!');
    console.log(`Total de músicas: ${systems.storage.getMusicData().length}`);
    console.log(`Total de álbuns: ${systems.storage.getAlbums().length}`);
});

// Função auxiliar global para mostrar notificações
function showNotification(message, type = 'info', duration = 5000) {
    if (window.SelenaStreamTracker && window.SelenaStreamTracker.notificationSystem) {
        return window.SelenaStreamTracker.notificationSystem.show(message, type, duration);
    }
    return null;
}
