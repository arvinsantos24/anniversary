export interface Milestone {
  id: string;
  date: string;
  title: string;
  description: string;
  imageUrl: string;
  location?: string;
}

export interface GalleryPhoto {
  id: string;
  imageUrl: string;
  caption: string;
  date?: string;
  tag?: string;
}

export interface ReasonCard {
  id: string;
  number: number;
  title: string;
  description: string;
  iconName?: string;
}

export interface LoveLetter {
  title: string;
  salutation: string;
  paragraphs: string[];
  closing: string;
  signature: string;
  date: string;
}

export interface AnniversaryData {
  coupleNames: string;
  partnerOneName: string;
  partnerTwoName: string;
  tagline: string;
  anniversaryDate: string; // ISO string e.g. "2023-06-18T18:30:00"
  heroImageUrl: string;
  heroQuote: string;
  youtubeUrl: string;
  songTitle: string;
  viewerPasscodeHash: string; // SHA-256 hash of viewer passcode
  viewerPasscodeHint: string;
  creatorPasscodeHash: string; // SHA-256 hash of creator PIN
  surpriseMessageTitle: string;
  surpriseMessageContent: string;
  surpriseButtonLabel: string;
  milestones: Milestone[];
  gallery: GalleryPhoto[];
  loveLetter: LoveLetter;
  reasons: ReasonCard[];
  finalNote: {
    heading: string;
    body: string;
    signature: string;
  };
}

export interface ElapsedTime {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalDays: number;
}
