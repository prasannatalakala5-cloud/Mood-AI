export interface DetailedSong {
  id: string;
  title: string;
  artist: string;
  language: 'Telugu' | 'English' | 'Hindi';
  mood: 'Happy' | 'Sad' | 'Angry' | 'Stressed' | 'Relaxed';
  suitableGender: 'Male' | 'Female' | 'All';
  spotifyUrl: string;
  youtubeUrl?: string;
  albumArt: string;
}

export const SONG_DATABASE: DetailedSong[] = [
  // ==========================================
  // TELUGU SONGS (21 Songs)
  // ==========================================
  {
    id: 'tel-hap-1',
    title: 'Naatu Naatu',
    artist: 'Rahul Sipligunj, Kaala Bhairava (RRR)',
    language: 'Telugu',
    mood: 'Happy',
    suitableGender: 'Male',
    spotifyUrl: 'https://open.spotify.com/track/2SST96NInY76g63vS87J82',
    youtubeUrl: 'https://www.youtube.com/watch?v=sAzlWScHTc4',
    albumArt: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=60'
  },
  {
    id: 'tel-hap-2',
    title: 'Chitti Nee Navvante',
    artist: 'Ram Miriyala (Jathi Ratnalu)',
    language: 'Telugu',
    mood: 'Happy',
    suitableGender: 'Male',
    spotifyUrl: 'https://open.spotify.com/track/1S8z3T9kK3wD67X6A8K4Zc',
    youtubeUrl: 'https://www.youtube.com/watch?v=xTf43H7hK18',
    albumArt: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&auto=format&fit=crop&q=60'
  },
  {
    id: 'tel-hap-3',
    title: 'Butta Bomma',
    artist: 'Armaan Malik (Ala Vaikunthapurramuloo)',
    language: 'Telugu',
    mood: 'Happy',
    suitableGender: 'Male',
    spotifyUrl: 'https://open.spotify.com/track/6SgZ7X5g68b20wY7Xv8z2S',
    youtubeUrl: 'https://www.youtube.com/watch?v=2mLDyY1433I',
    albumArt: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&auto=format&fit=crop&q=60'
  },
  {
    id: 'tel-hap-4',
    title: 'Hoyna Hoyna',
    artist: 'Anirudh Ravichander (Gang Leader)',
    language: 'Telugu',
    mood: 'Happy',
    suitableGender: 'Female',
    spotifyUrl: 'https://open.spotify.com/track/4X8Y7w2N9Gv4K9W7Xv8z2S',
    youtubeUrl: 'https://www.youtube.com/watch?v=G3XpX2N9K8Z',
    albumArt: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=300&auto=format&fit=crop&q=60'
  },
  {
    id: 'tel-hap-5',
    title: 'Ramuloo Ramulaa',
    artist: 'Anurag Kulkarni, Mangli',
    language: 'Telugu',
    mood: 'Happy',
    suitableGender: 'Female',
    spotifyUrl: 'https://open.spotify.com/track/3yK1N9K7A8v4K9W7Xv8z2S',
    youtubeUrl: 'https://www.youtube.com/watch?v=H7P43H7hK18',
    albumArt: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&auto=format&fit=crop&q=60'
  },
  {
    id: 'tel-sad-1',
    title: 'Adiga Adiga',
    artist: 'Sid Sriram (Ninnu Kori)',
    language: 'Telugu',
    mood: 'Sad',
    suitableGender: 'Male',
    spotifyUrl: 'https://open.spotify.com/track/5uK6N9K7A8v4K9W7Xv8z2S',
    youtubeUrl: 'https://www.youtube.com/watch?v=s8XpX2N9K8Z',
    albumArt: 'https://images.unsplash.com/photo-1446057032654-9d8885b7518a?w=300&auto=format&fit=crop&q=60'
  },
  {
    id: 'tel-sad-2',
    title: 'O Rendu Prema Meghalu',
    artist: 'Sreerama Chandra (Baby)',
    language: 'Telugu',
    mood: 'Sad',
    suitableGender: 'Male',
    spotifyUrl: 'https://open.spotify.com/track/6vK6N9K7A8v4K9W7Xv8z2S',
    youtubeUrl: 'https://www.youtube.com/watch?v=q8XpX2N9K8Z',
    albumArt: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300&auto=format&fit=crop&q=60'
  },
  {
    id: 'tel-sad-3',
    title: 'Priyathama Priyathama',
    artist: 'Chinmayi Sripada (Majili)',
    language: 'Telugu',
    mood: 'Sad',
    suitableGender: 'Female',
    spotifyUrl: 'https://open.spotify.com/track/7vK6N9K7A8v4K9W7Xv8z2S',
    youtubeUrl: 'https://www.youtube.com/watch?v=w8XpX2N9K8Z',
    albumArt: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=300&auto=format&fit=crop&q=60'
  },
  {
    id: 'tel-sad-4',
    title: 'Nuvve Nuvve',
    artist: 'K.S. Chithra (Nuvve Nuvve)',
    language: 'Telugu',
    mood: 'Sad',
    suitableGender: 'Female',
    spotifyUrl: 'https://open.spotify.com/track/8vK6N9K7A8v4K9W7Xv8z2S',
    youtubeUrl: 'https://www.youtube.com/watch?v=e8XpX2N9K8Z',
    albumArt: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=300&auto=format&fit=crop&q=60'
  },
  {
    id: 'tel-ang-1',
    title: 'Fear Song',
    artist: 'Anirudh Ravichander (Devara)',
    language: 'Telugu',
    mood: 'Angry',
    suitableGender: 'Male',
    spotifyUrl: 'https://open.spotify.com/track/1S9XW7A9r4Z8Y9W7Xv8z2S',
    youtubeUrl: 'https://www.youtube.com/watch?v=e7XpX2N9K8Z',
    albumArt: 'https://images.unsplash.com/photo-1487180144351-b8472da7a4c3?w=300&auto=format&fit=crop&q=60'
  },
  {
    id: 'tel-ang-2',
    title: 'Jai Balayya',
    artist: 'Kari Sishor, Thaman S (Akhanda)',
    language: 'Telugu',
    mood: 'Angry',
    suitableGender: 'Male',
    spotifyUrl: 'https://open.spotify.com/track/2S9XW7A9r4Z8Y9W7Xv8z2S',
    youtubeUrl: 'https://www.youtube.com/watch?v=y7XpX2N9K8Z',
    albumArt: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&auto=format&fit=crop&q=60'
  },
  {
    id: 'tel-ang-3',
    title: 'Rudhrama Devi Theme',
    artist: 'Ilaiyaraaja (Rudhrama Devi)',
    language: 'Telugu',
    mood: 'Angry',
    suitableGender: 'Female',
    spotifyUrl: 'https://open.spotify.com/track/3S9XW7A9r4Z8Y9W7Xv8z2S',
    youtubeUrl: 'https://www.youtube.com/watch?v=a7XpX2N9K8Z',
    albumArt: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=300&auto=format&fit=crop&q=60'
  },
  {
    id: 'tel-ang-4',
    title: 'Dethadi Dethadi',
    artist: 'Geetha Madhuri (Dookudu)',
    language: 'Telugu',
    mood: 'Angry',
    suitableGender: 'Female',
    spotifyUrl: 'https://open.spotify.com/track/4S9XW7A9r4Z8Y9W7Xv8z2S',
    youtubeUrl: 'https://www.youtube.com/watch?v=u7XpX2N9K8Z',
    albumArt: 'https://images.unsplash.com/photo-1482440308425-276ad0f28b19?w=300&auto=format&fit=crop&q=60'
  },
  {
    id: 'tel-str-1',
    title: 'Samayama',
    artist: 'Anurag Kulkarni (Hi Nanna)',
    language: 'Telugu',
    mood: 'Stressed',
    suitableGender: 'All',
    spotifyUrl: 'https://open.spotify.com/track/5S9XW7A9r4Z8Y9W7Xv8z2S',
    youtubeUrl: 'https://www.youtube.com/watch?v=i7XpX2N9K8Z',
    albumArt: 'https://images.unsplash.com/photo-1518235506717-e1ed3306a89b?w=300&auto=format&fit=crop&q=60'
  },
  {
    id: 'tel-str-2',
    title: 'Nee Choopule',
    artist: 'Haricharan, Chitra (Endukante Premanta)',
    language: 'Telugu',
    mood: 'Stressed',
    suitableGender: 'Female',
    spotifyUrl: 'https://open.spotify.com/track/6S9XW7A9r4Z8Y9W7Xv8z2S',
    youtubeUrl: 'https://www.youtube.com/watch?v=v7XpX2N9K8Z',
    albumArt: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=300&auto=format&fit=crop&q=60'
  },
  {
    id: 'tel-str-3',
    title: 'Vakeel Saab Theme',
    artist: 'Thaman S (Vakeel Saab)',
    language: 'Telugu',
    mood: 'Stressed',
    suitableGender: 'Male',
    spotifyUrl: 'https://open.spotify.com/track/7S9XW7A9r4Z8Y9W7Xv8z2S',
    youtubeUrl: 'https://www.youtube.com/watch?v=x8XpX2N9K8Z',
    albumArt: 'https://images.unsplash.com/photo-1471478331149-c72f17e33c73?w=300&auto=format&fit=crop&q=60'
  },
  {
    id: 'tel-rel-1',
    title: 'Kalaavathi',
    artist: 'Sid Sriram (Sarkaru Vaari Paata)',
    language: 'Telugu',
    mood: 'Relaxed',
    suitableGender: 'Male',
    spotifyUrl: 'https://open.spotify.com/track/8S9XW7A9r4Z8Y9W7Xv8z2S',
    youtubeUrl: 'https://www.youtube.com/watch?v=m7XpX2N9K8Z',
    albumArt: 'https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?w=300&auto=format&fit=crop&q=60'
  },
  {
    id: 'tel-rel-2',
    title: 'Inkem Inkem',
    artist: 'Sid Sriram (Geetha Govindam)',
    language: 'Telugu',
    mood: 'Relaxed',
    suitableGender: 'Male',
    spotifyUrl: 'https://open.spotify.com/track/9S9XW7A9r4Z8Y9W7Xv8z2S',
    youtubeUrl: 'https://www.youtube.com/watch?v=p7XpX2N9K8Z',
    albumArt: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=300&auto=format&fit=crop&q=60'
  },
  {
    id: 'tel-rel-3',
    title: 'Manasa Manasa',
    artist: 'Sid Sriram (Most Eligible Bachelor)',
    language: 'Telugu',
    mood: 'Relaxed',
    suitableGender: 'Female',
    spotifyUrl: 'https://open.spotify.com/track/0S9XW7A9r4Z8Y9W7Xv8z2S',
    youtubeUrl: 'https://www.youtube.com/watch?v=r7XpX2N9K8Z',
    albumArt: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=300&auto=format&fit=crop&q=60'
  },
  {
    id: 'tel-rel-4',
    title: 'Kalyani Vaccha Vaccha',
    artist: 'Mangli, Karthik',
    language: 'Telugu',
    mood: 'Relaxed',
    suitableGender: 'Female',
    spotifyUrl: 'https://open.spotify.com/track/1S9XW7A9r4Z8Y9W7Xv8z3S',
    youtubeUrl: 'https://www.youtube.com/watch?v=k7XpX2N9K8Z',
    albumArt: 'https://images.unsplash.com/photo-1453090927415-5f45085b65c0?w=300&auto=format&fit=crop&q=60'
  },
  {
    id: 'tel-rel-5',
    title: 'Vellipoke Sundaree',
    artist: 'Karthik (Pushpa)',
    language: 'Telugu',
    mood: 'Relaxed',
    suitableGender: 'All',
    spotifyUrl: 'https://open.spotify.com/track/2S9XW7A9r4Z8Y9W7Xv8z3S',
    youtubeUrl: 'https://www.youtube.com/watch?v=z7XpX2N9K8Z',
    albumArt: 'https://images.unsplash.com/photo-1415201375678-741a16dfc109?w=300&auto=format&fit=crop&q=60'
  },

  // ==========================================
  // ENGLISH SONGS (21 Songs)
  // ==========================================
  {
    id: 'eng-hap-1',
    title: 'Happy',
    artist: 'Pharrell Williams',
    language: 'English',
    mood: 'Happy',
    suitableGender: 'All',
    spotifyUrl: 'https://open.spotify.com/track/60nZKP7J6qqv0m67Sg7r3v',
    youtubeUrl: 'https://www.youtube.com/watch?v=ZbZSe6N_BXs',
    albumArt: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=300&auto=format&fit=crop&q=60'
  },
  {
    id: 'eng-hap-2',
    title: 'Shake It Off',
    artist: 'Taylor Swift',
    language: 'English',
    mood: 'Happy',
    suitableGender: 'Female',
    spotifyUrl: 'https://open.spotify.com/track/0Yg9XKP7J6qqv0m67Sg7r3v',
    youtubeUrl: 'https://www.youtube.com/watch?v=nfWlot6h_JM',
    albumArt: 'https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?w=300&auto=format&fit=crop&q=60'
  },
  {
    id: 'eng-hap-3',
    title: "Can't Stop the Feeling!",
    artist: 'Justin Timberlake',
    language: 'English',
    mood: 'Happy',
    suitableGender: 'Male',
    spotifyUrl: 'https://open.spotify.com/track/1Yg9XKP7J6qqv0m67Sg7r3v',
    youtubeUrl: 'https://www.youtube.com/watch?v=ru0K8uYEZWw',
    albumArt: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&auto=format&fit=crop&q=60'
  },
  {
    id: 'eng-hap-4',
    title: 'Flowers',
    artist: 'Miley Cyrus',
    language: 'English',
    mood: 'Happy',
    suitableGender: 'Female',
    spotifyUrl: 'https://open.spotify.com/track/403XKP7J6qqv0m67Sg7r3v',
    youtubeUrl: 'https://www.youtube.com/watch?v=G7KNmW9a75Y',
    albumArt: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=300&auto=format&fit=crop&q=60'
  },
  {
    id: 'eng-hap-5',
    title: 'Levitating',
    artist: 'Dua Lipa',
    language: 'English',
    mood: 'Happy',
    suitableGender: 'Female',
    spotifyUrl: 'https://open.spotify.com/track/503XKP7J6qqv0m67Sg7r3v',
    youtubeUrl: 'https://www.youtube.com/watch?v=TUVcZfQe-Kw',
    albumArt: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=300&auto=format&fit=crop&q=60'
  },
  {
    id: 'eng-sad-1',
    title: 'Someone Like You',
    artist: 'Adele',
    language: 'English',
    mood: 'Sad',
    suitableGender: 'Female',
    spotifyUrl: 'https://open.spotify.com/track/6vK6XKP7J6qqv0m67Sg7r3v',
    youtubeUrl: 'https://www.youtube.com/watch?v=hLQl3WQQoQ0',
    albumArt: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=300&auto=format&fit=crop&q=60'
  },
  {
    id: 'eng-sad-2',
    title: 'Fix You',
    artist: 'Coldplay',
    language: 'English',
    mood: 'Sad',
    suitableGender: 'Male',
    spotifyUrl: 'https://open.spotify.com/track/7vK6XKP7J6qqv0m67Sg7r3v',
    youtubeUrl: 'https://www.youtube.com/watch?v=k4V3_GgWw8E',
    albumArt: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=300&auto=format&fit=crop&q=60'
  },
  {
    id: 'eng-sad-3',
    title: 'Ocean Eyes',
    artist: 'Billie Eilish',
    language: 'English',
    mood: 'Sad',
    suitableGender: 'Female',
    spotifyUrl: 'https://open.spotify.com/track/8vK6XKP7J6qqv0m67Sg7r3v',
    youtubeUrl: 'https://www.youtube.com/watch?v=viImbdrS3uU',
    albumArt: 'https://images.unsplash.com/photo-1484876065684-b683cf17d276?w=300&auto=format&fit=crop&q=60'
  },
  {
    id: 'eng-sad-4',
    title: 'Let Her Go',
    artist: 'Passenger',
    language: 'English',
    mood: 'Sad',
    suitableGender: 'Male',
    spotifyUrl: 'https://open.spotify.com/track/9vK6XKP7J6qqv0m67Sg7r3v',
    youtubeUrl: 'https://www.youtube.com/watch?v=RBumgq5yVrA',
    albumArt: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=300&auto=format&fit=crop&q=60'
  },
  {
    id: 'eng-ang-1',
    title: 'Lose Yourself',
    artist: 'Eminem',
    language: 'English',
    mood: 'Angry',
    suitableGender: 'Male',
    spotifyUrl: 'https://open.spotify.com/track/1S9XWKP7J6qqv0m67Sg7r3v',
    youtubeUrl: 'https://www.youtube.com/watch?v=_Yhyp-_h_N6',
    albumArt: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&auto=format&fit=crop&q=60'
  },
  {
    id: 'eng-ang-2',
    title: 'Stronger',
    artist: 'Kanye West',
    language: 'English',
    mood: 'Angry',
    suitableGender: 'Male',
    spotifyUrl: 'https://open.spotify.com/track/2S9XWKP7J6qqv0m67Sg7r3v',
    youtubeUrl: 'https://www.youtube.com/watch?v=PsO6ZnUZI0g',
    albumArt: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=300&auto=format&fit=crop&q=60'
  },
  {
    id: 'eng-ang-3',
    title: 'Bad Guy',
    artist: 'Billie Eilish',
    language: 'English',
    mood: 'Angry',
    suitableGender: 'Female',
    spotifyUrl: 'https://open.spotify.com/track/3S9XWKP7J6qqv0m67Sg7r3v',
    youtubeUrl: 'https://www.youtube.com/watch?v=DyDfgMOUjCI',
    albumArt: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=300&auto=format&fit=crop&q=60'
  },
  {
    id: 'eng-ang-4',
    title: 'Roar',
    artist: 'Katy Perry',
    language: 'English',
    mood: 'Angry',
    suitableGender: 'Female',
    spotifyUrl: 'https://open.spotify.com/track/4S9XWKP7J6qqv0m67Sg7r3v',
    youtubeUrl: 'https://www.youtube.com/watch?v=CevxZvSJLk8',
    albumArt: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&auto=format&fit=crop&q=60'
  },
  {
    id: 'eng-str-1',
    title: 'Breathin',
    artist: 'Ariana Grande',
    language: 'English',
    mood: 'Stressed',
    suitableGender: 'Female',
    spotifyUrl: 'https://open.spotify.com/track/5S9XWKP7J6qqv0m67Sg7r3v',
    youtubeUrl: 'https://www.youtube.com/watch?v=kN0iD0pI3_s',
    albumArt: 'https://images.unsplash.com/photo-1518235506717-e1ed3306a89b?w=300&auto=format&fit=crop&q=60'
  },
  {
    id: 'eng-str-2',
    title: 'Stay',
    artist: 'The Kid LAROI, Justin Bieber',
    language: 'English',
    mood: 'Stressed',
    suitableGender: 'Male',
    spotifyUrl: 'https://open.spotify.com/track/6S9XWKP7J6qqv0m67Sg7r3v',
    youtubeUrl: 'https://www.youtube.com/watch?v=kTJczUoc26U',
    albumArt: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=60'
  },
  {
    id: 'eng-str-3',
    title: 'Believer',
    artist: 'Imagine Dragons',
    language: 'English',
    mood: 'Stressed',
    suitableGender: 'All',
    spotifyUrl: 'https://open.spotify.com/track/7S9XWKP7J6qqv0m67Sg7r3v',
    youtubeUrl: 'https://www.youtube.com/watch?v=7wtfhZwyrcc',
    albumArt: 'https://images.unsplash.com/photo-1487180144351-b8472da7a4c3?w=300&auto=format&fit=crop&q=60'
  },
  {
    id: 'eng-rel-1',
    title: 'Perfect',
    artist: 'Ed Sheeran',
    language: 'English',
    mood: 'Relaxed',
    suitableGender: 'Male',
    spotifyUrl: 'https://open.spotify.com/track/8S9XWKP7J6qqv0m67Sg7r3v',
    youtubeUrl: 'https://www.youtube.com/watch?v=2Vv-BfVoq4g',
    albumArt: 'https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?w=300&auto=format&fit=crop&q=60'
  },
  {
    id: 'eng-rel-2',
    title: 'As It Was',
    artist: 'Harry Styles',
    language: 'English',
    mood: 'Relaxed',
    suitableGender: 'Male',
    spotifyUrl: 'https://open.spotify.com/track/9S9XWKP7J6qqv0m67Sg7r3v',
    youtubeUrl: 'https://www.youtube.com/watch?v=H5v3kku4y6Q',
    albumArt: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=300&auto=format&fit=crop&q=60'
  },
  {
    id: 'eng-rel-3',
    title: 'Sunset Lover',
    artist: 'Petit Biscuit',
    language: 'English',
    mood: 'Relaxed',
    suitableGender: 'Female',
    spotifyUrl: 'https://open.spotify.com/track/0S9XWKP7J6qqv0m67Sg7r3v',
    youtubeUrl: 'https://www.youtube.com/watch?v=wx_V38v4pSM',
    albumArt: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300&auto=format&fit=crop&q=60'
  },
  {
    id: 'eng-rel-4',
    title: 'Clair de Lune',
    artist: 'Claude Debussy',
    language: 'English',
    mood: 'Relaxed',
    suitableGender: 'All',
    spotifyUrl: 'https://open.spotify.com/track/1S9XWKP7J6qqv0m67Sg7r4v',
    youtubeUrl: 'https://www.youtube.com/watch?v=CvFH_6DNRCY',
    albumArt: 'https://images.unsplash.com/photo-1453090927415-5f45085b65c0?w=300&auto=format&fit=crop&q=60'
  },
  {
    id: 'eng-rel-5',
    title: 'River Flows in You',
    artist: 'Yiruma',
    language: 'English',
    mood: 'Relaxed',
    suitableGender: 'All',
    spotifyUrl: 'https://open.spotify.com/track/2S9XWKP7J6qqv0m67Sg7r4v',
    youtubeUrl: 'https://www.youtube.com/watch?v=7maJOI3QMu0',
    albumArt: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&auto=format&fit=crop&q=60'
  },

  // ==========================================
  // HINDI SONGS (21 Songs)
  // ==========================================
  {
    id: 'hin-hap-1',
    title: 'Ghunghroo',
    artist: 'Arijit Singh, Shilpa Rao (War)',
    language: 'Hindi',
    mood: 'Happy',
    suitableGender: 'Female',
    spotifyUrl: 'https://open.spotify.com/track/1S9XWKP7J6qqv0m67Sg7r5v',
    youtubeUrl: 'https://www.youtube.com/watch?v=qN4ooNx77u0',
    albumArt: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=60'
  },
  {
    id: 'hin-hap-2',
    title: 'Kar Gayi Chull',
    artist: 'Badshah, Fazilpuria, Sukriti Kakar',
    language: 'Hindi',
    mood: 'Happy',
    suitableGender: 'Female',
    spotifyUrl: 'https://open.spotify.com/track/2S9XWKP7J6qqv0m67Sg7r5v',
    youtubeUrl: 'https://www.youtube.com/watch?v=NTHz9eWJca0',
    albumArt: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&auto=format&fit=crop&q=60'
  },
  {
    id: 'hin-hap-3',
    title: 'Badtameez Dil',
    artist: 'Benny Dayal, Shefali Alvares',
    language: 'Hindi',
    mood: 'Happy',
    suitableGender: 'Male',
    spotifyUrl: 'https://open.spotify.com/track/3S9XWKP7J6qqv0m67Sg7r5v',
    youtubeUrl: 'https://www.youtube.com/watch?v=II2EO33ofp0',
    albumArt: 'https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?w=300&auto=format&fit=crop&q=60'
  },
  {
    id: 'hin-hap-4',
    title: 'Kesariya',
    artist: 'Arijit Singh (Brahmastra)',
    language: 'Hindi',
    mood: 'Happy',
    suitableGender: 'Male',
    spotifyUrl: 'https://open.spotify.com/track/4S9XWKP7J6qqv0m67Sg7r5v',
    youtubeUrl: 'https://www.youtube.com/watch?v=BddP6PYo2gs',
    albumArt: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=300&auto=format&fit=crop&q=60'
  },
  {
    id: 'hin-hap-5',
    title: 'London Thumakda',
    artist: 'Labh Janjua, Sonu Kakkar, Neha Kakkar',
    language: 'Hindi',
    mood: 'Happy',
    suitableGender: 'Female',
    spotifyUrl: 'https://open.spotify.com/track/5S9XWKP7J6qqv0m67Sg7r5v',
    youtubeUrl: 'https://www.youtube.com/watch?v=udra3Mfw2oo',
    albumArt: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=300&auto=format&fit=crop&q=60'
  },
  {
    id: 'hin-sad-1',
    title: 'Channa Mereya',
    artist: 'Arijit Singh (Ae Dil Hai Mushkil)',
    language: 'Hindi',
    mood: 'Sad',
    suitableGender: 'Male',
    spotifyUrl: 'https://open.spotify.com/track/6S9XWKP7J6qqv0m67Sg7r5v',
    youtubeUrl: 'https://www.youtube.com/watch?v=284Ov7ysny8',
    albumArt: 'https://images.unsplash.com/photo-1446057032654-9d8885b7518a?w=300&auto=format&fit=crop&q=60'
  },
  {
    id: 'hin-sad-2',
    title: 'Tum Hi Ho',
    artist: 'Arijit Singh (Aashiqui 2)',
    language: 'Hindi',
    mood: 'Sad',
    suitableGender: 'Male',
    spotifyUrl: 'https://open.spotify.com/track/7S9XWKP7J6qqv0m67Sg7r5v',
    youtubeUrl: 'https://www.youtube.com/watch?v=Umqb9ku81g0',
    albumArt: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300&auto=format&fit=crop&q=60'
  },
  {
    id: 'hin-sad-3',
    title: 'Kabira',
    artist: 'Tochi Raina, Rekha Bhardwaj',
    language: 'Hindi',
    mood: 'Sad',
    suitableGender: 'Female',
    spotifyUrl: 'https://open.spotify.com/track/8S9XWKP7J6qqv0m67Sg7r5v',
    youtubeUrl: 'https://www.youtube.com/watch?v=jHNE7t8RIlk',
    albumArt: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=300&auto=format&fit=crop&q=60'
  },
  {
    id: 'hin-sad-4',
    title: 'Agar Tum Saath Ho',
    artist: 'Alka Yagnik, Arijit Singh (Tamasha)',
    language: 'Hindi',
    mood: 'Sad',
    suitableGender: 'Female',
    spotifyUrl: 'https://open.spotify.com/track/9S9XWKP7J6qqv0m67Sg7r5v',
    youtubeUrl: 'https://www.youtube.com/watch?v=sK7riqg2mr4',
    albumArt: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=300&auto=format&fit=crop&q=60'
  },
  {
    id: 'hin-ang-1',
    title: 'Bekhayali',
    artist: 'Sachet Tandon (Kabir Singh)',
    language: 'Hindi',
    mood: 'Angry',
    suitableGender: 'Male',
    spotifyUrl: 'https://open.spotify.com/track/0S9XWKP7J6qqv0m67Sg7r5v',
    youtubeUrl: 'https://www.youtube.com/watch?v=VOLKJJvf14A',
    albumArt: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&auto=format&fit=crop&q=60'
  },
  {
    id: 'hin-ang-2',
    title: 'Zinda',
    artist: 'Siddharth Mahadevan (Bhaag Milkha Bhaag)',
    language: 'Hindi',
    mood: 'Angry',
    suitableGender: 'Male',
    spotifyUrl: 'https://open.spotify.com/track/1S9XWKP7J6qqv0m67Sg7r6v',
    youtubeUrl: 'https://www.youtube.com/watch?v=9_pYV_CgIas',
    albumArt: 'https://images.unsplash.com/photo-1487180144351-b8472da7a4c3?w=300&auto=format&fit=crop&q=60'
  },
  {
    id: 'hin-ang-3',
    title: 'Dangal Title Track',
    artist: 'Daler Mehndi (Dangal)',
    language: 'Hindi',
    mood: 'Angry',
    suitableGender: 'All',
    spotifyUrl: 'https://open.spotify.com/track/2S9XWKP7J6qqv0m67Sg7r6v',
    youtubeUrl: 'https://www.youtube.com/watch?v=y600Z56rYV8',
    albumArt: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=300&auto=format&fit=crop&q=60'
  },
  {
    id: 'hin-ang-4',
    title: 'Sher Aaya Sher',
    artist: 'DIVINE (Gully Boy)',
    language: 'Hindi',
    mood: 'Angry',
    suitableGender: 'Male',
    spotifyUrl: 'https://open.spotify.com/track/3S9XWKP7J6qqv0m67Sg7r6v',
    youtubeUrl: 'https://www.youtube.com/watch?v=v8V_A7XpX2N',
    albumArt: 'https://images.unsplash.com/photo-1482440308425-276ad0f28b19?w=300&auto=format&fit=crop&q=60'
  },
  {
    id: 'hin-str-1',
    title: 'Kar Har Maidaan Fateh',
    artist: 'Sukhwinder Singh, Shreya Ghoshal',
    language: 'Hindi',
    mood: 'Stressed',
    suitableGender: 'All',
    spotifyUrl: 'https://open.spotify.com/track/4S9XWKP7J6qqv0m67Sg7r6v',
    youtubeUrl: 'https://www.youtube.com/watch?v=t-A7XpX2N8Z',
    albumArt: 'https://images.unsplash.com/photo-1518235506717-e1ed3306a89b?w=300&auto=format&fit=crop&q=60'
  },
  {
    id: 'hin-str-2',
    title: 'Shabaashiyan',
    artist: 'Shilpa Rao, Anand Bhaskar',
    language: 'Hindi',
    mood: 'Stressed',
    suitableGender: 'Female',
    spotifyUrl: 'https://open.spotify.com/track/5S9XWKP7J6qqv0m67Sg7r6v',
    youtubeUrl: 'https://www.youtube.com/watch?v=w7XpX2N9K8Z',
    albumArt: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=300&auto=format&fit=crop&q=60'
  },
  {
    id: 'hin-str-3',
    title: 'Kun Faya Kun',
    artist: 'A.R. Rahman, Javed Ali, Mohit Chauhan',
    language: 'Hindi',
    mood: 'Stressed',
    suitableGender: 'All',
    spotifyUrl: 'https://open.spotify.com/track/6S9XWKP7J6qqv0m67Sg7r6v',
    youtubeUrl: 'https://www.youtube.com/watch?v=T94PHkuyd84',
    albumArt: 'https://images.unsplash.com/photo-1471478331149-c72f17e33c73?w=300&auto=format&fit=crop&q=60'
  },
  {
    id: 'hin-rel-1',
    title: 'Love You Zindagi',
    artist: 'Jasleen Royal (Dear Zindagi)',
    language: 'Hindi',
    mood: 'Relaxed',
    suitableGender: 'Female',
    spotifyUrl: 'https://open.spotify.com/track/7S9XWKP7J6qqv0m67Sg7r6v',
    youtubeUrl: 'https://www.youtube.com/watch?v=33-K716W0_I',
    albumArt: 'https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?w=300&auto=format&fit=crop&q=60'
  },
  {
    id: 'hin-rel-2',
    title: 'Apna Bana Le',
    artist: 'Arijit Singh, Sachin-Jigar (Bhediya)',
    language: 'Hindi',
    mood: 'Relaxed',
    suitableGender: 'Male',
    spotifyUrl: 'https://open.spotify.com/track/8S9XWKP7J6qqv0m67Sg7r6v',
    youtubeUrl: 'https://www.youtube.com/watch?v=ElZfdU54Cp8',
    albumArt: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=300&auto=format&fit=crop&q=60'
  },
  {
    id: 'hin-rel-3',
    title: 'Ilahi',
    artist: 'Arijit Singh (Yeh Jawaani Hai Deewani)',
    language: 'Hindi',
    mood: 'Relaxed',
    suitableGender: 'Male',
    spotifyUrl: 'https://open.spotify.com/track/9S9XWKP7J6qqv0m67Sg7r6v',
    youtubeUrl: 'https://www.youtube.com/watch?v=fdubeMFwuVM',
    albumArt: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=300&auto=format&fit=crop&q=60'
  },
  {
    id: 'hin-rel-4',
    title: 'Qaafirana',
    artist: 'Arijit Singh, Nikhita Gandhi (Kedarnath)',
    language: 'Hindi',
    mood: 'Relaxed',
    suitableGender: 'Female',
    spotifyUrl: 'https://open.spotify.com/track/0S9XWKP7J6qqv0m67Sg7r6v',
    youtubeUrl: 'https://www.youtube.com/watch?v=ZAn3Jv_t7iU',
    albumArt: 'https://images.unsplash.com/photo-1453090927415-5f45085b65c0?w=300&auto=format&fit=crop&q=60'
  },
  {
    id: 'hin-rel-5',
    title: 'Dil Diyan Gallan',
    artist: 'Atif Aslam (Tiger Zinda Hai)',
    language: 'Hindi',
    mood: 'Relaxed',
    suitableGender: 'Male',
    spotifyUrl: 'https://open.spotify.com/track/1S9XWKP7J6qqv0m67Sg7r7v',
    youtubeUrl: 'https://www.youtube.com/watch?v=SAcpESN_Fk4',
    albumArt: 'https://images.unsplash.com/photo-1415201375678-741a16dfc109?w=300&auto=format&fit=crop&q=60'
  }
];
