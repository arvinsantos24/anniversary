import { AnniversaryData } from '../types';
import { DEFAULT_VIEWER_HASH, DEFAULT_CREATOR_HASH } from '../utils/crypto';

export const INITIAL_ANNIVERSARY_DATA: AnniversaryData = {
  coupleNames: 'Alex & Maya',
  partnerOneName: 'Alex',
  partnerTwoName: 'Maya',
  tagline: 'Every second with you is my favorite chapter in this lifetime',
  anniversaryDate: '2023-06-18T18:00:00',
  heroImageUrl: '/src/assets/images/hero_anniversary_couple_1791714783489.jpg',
  heroQuote: 'In all the world, there is no heart for me like yours. In all the world, there is no love for you like mine.',
  youtubeUrl: 'https://www.youtube.com/watch?v=0pWsL6PzYyA', // Romantic acoustic track
  songTitle: 'Until I Found You (Acoustic)',
  viewerPasscodeHash: DEFAULT_VIEWER_HASH, // '1402'
  viewerPasscodeHint: 'Our special date (4 digits: 1402)',
  creatorPasscodeHash: DEFAULT_CREATOR_HASH, // '9999'
  surpriseButtonLabel: 'Open My Heart For You',
  surpriseMessageTitle: 'My Forever Promise',
  surpriseMessageContent: 'No matter where life takes us, through every storm and every sunshine, I choose you today, tomorrow, and every day that follows. Happy Anniversary, my love! ❤️',
  milestones: [
    {
      id: 'milestone-1',
      date: 'June 18, 2023',
      title: 'The Coffee Shop Serendipity',
      description: 'A rainy Sunday afternoon that started with a shared table at a crowded bakery and turned into four hours of non-stop conversation, warm lattes, and realizing we never wanted to leave.',
      imageUrl: '/src/assets/images/timeline_first_date_1791714797478.jpg',
      location: 'Little Fern Cafe',
    },
    {
      id: 'milestone-2',
      date: 'October 14, 2023',
      title: 'Our Starlit Weekend Getaway',
      description: 'Our first road trip out to the quiet lake cabins. We spread a blanket under the vast milky way, fairy lights glowing around us, listening to acoustic songs until sunrise.',
      imageUrl: '/src/assets/images/timeline_romantic_trip_1791714811901.jpg',
      location: 'Silver Lake Lookout',
    },
    {
      id: 'milestone-3',
      date: 'February 14, 2024',
      title: 'The Peony Morning Surprise',
      description: 'Waking up early to surprise you with fresh blush garden roses and hot pastries. Your sleepy smile when you opened the door was the most beautiful thing I had ever seen.',
      imageUrl: '/src/assets/images/gallery_flower_bouquet_1791714823037.jpg',
      location: 'Our Cozy Apartment',
    },
    {
      id: 'milestone-4',
      date: 'June 18, 2024',
      title: 'Golden Hour by the Coast',
      description: 'Walking along the coastal cliffs together at golden hour, watching the warm ocean sunset. It was in that quiet breeze that I knew with certainty: this is my person.',
      imageUrl: '/src/assets/images/hero_anniversary_couple_1791714783489.jpg',
      location: 'Sunset Bluff Shoreline',
    },
  ],
  gallery: [
    {
      id: 'photo-1',
      imageUrl: '/src/assets/images/hero_anniversary_couple_1791714783489.jpg',
      caption: 'Walking into golden hour hand in hand, feeling like the whole world stopped just for us.',
      date: 'Summer 2024',
      tag: 'Adventures',
    },
    {
      id: 'photo-2',
      imageUrl: '/src/assets/images/timeline_first_date_1791714797478.jpg',
      caption: 'Where our story quietly began over two warm cups of coffee.',
      date: 'June 2023',
      tag: 'Beginnings',
    },
    {
      id: 'photo-3',
      imageUrl: '/src/assets/images/timeline_romantic_trip_1791714811901.jpg',
      caption: 'The night we counted shooting stars and whispered our wildest dreams.',
      date: 'October 2023',
      tag: 'Adventures',
    },
    {
      id: 'photo-4',
      imageUrl: '/src/assets/images/gallery_flower_bouquet_1791714823037.jpg',
      caption: 'Fresh morning blooms to remind you how loved you are, every single day.',
      date: 'February 2024',
      tag: 'Sweet Moments',
    },
  ],
  loveLetter: {
    title: 'A Letter To My Whole Heart',
    salutation: 'My Dearest Maya,',
    paragraphs: [
      'As I sit down to write this, I find myself smiling at all the memories that have led us to this exact moment. Time has a strange way of moving so quickly when I am with you, yet every single second spent by your side feels endlessly rich and cherished.',
      'Thank you for being my safe haven. For your laughter that lights up even the gloomiest rooms, for the tender patience you show me, and for how you always know the exact warmth my soul needs after a long day.',
      'Loving you is the easiest, most natural choice I have ever made. You inspire me to be kinder, braver, and more present. As we celebrate another year of our journey, I promise to keep choosing you, celebrating you, and loving you deeper with each passing season.',
    ],
    closing: 'Forever yours, across all lifetimes,',
    signature: 'Alex',
    date: 'On our Anniversary',
  },
  reasons: [
    {
      id: 'reason-1',
      number: 1,
      title: 'Your Crinkle-Eyed Laughter',
      description: 'The way your eyes crinkle up when something is genuinely hilarious to you. It is the most infectious sound on earth.',
    },
    {
      id: 'reason-2',
      number: 2,
      title: 'Our Silent Understanding',
      description: 'How we can exchange a single look across a crowded room and immediately know what the other is thinking.',
    },
    {
      id: 'reason-3',
      number: 3,
      title: 'Your Boundless Compassion',
      description: 'The genuine tenderness you show to people and animals. You make the world around you softer and safer.',
    },
    {
      id: 'reason-4',
      number: 4,
      title: 'Our Cozy Morning Rituals',
      description: 'Brewing morning coffee, sharing quiet conversations in blankets before the rest of the world wakes up.',
    },
    {
      id: 'reason-5',
      number: 5,
      title: 'Your Unwavering Support',
      description: 'How you believe in my wildest dreams even when I doubt myself. Having you in my corner is my greatest strength.',
    },
    {
      id: 'reason-6',
      number: 6,
      title: 'Just Being You',
      description: 'Simply existing as the person you are. There is no one else I would rather share this life with.',
    },
  ],
  finalNote: {
    heading: 'Here is to Every Tomorrow Together',
    body: 'May our days continue to be filled with unexpected laughter, gentle handholds, warm adventures, and a love that only grows stronger with time.',
    signature: 'With all my love, always and forever.',
  },
};
