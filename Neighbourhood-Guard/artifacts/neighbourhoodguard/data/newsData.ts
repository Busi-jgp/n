export interface NewsArticle {
  id: string;
  headline: string;
  summary: string;
  source: string;
  suburb: string;
  category: "crime" | "safety" | "infrastructure" | "community";
  timestamp: number;
  url?: string;
}

export const NEWS_ARTICLES: NewsArticle[] = [
  {
    id: "n1",
    headline: "Waterkloof Ridge house break-in syndicate dismantled",
    summary: "Tshwane Metro Police arrested four suspects linked to a sophisticated house break-in ring operating across Waterkloof Ridge and Waterkloof Park. Stolen goods worth over R450 000 recovered.",
    source: "Pretoria News",
    suburb: "Waterkloof",
    category: "crime",
    timestamp: Date.now() - 2 * 60 * 60 * 1000,
  },
  {
    id: "n2",
    headline: "Garsfontein neighbourhood watch reports 35% drop in incidents",
    summary: "Following the rollout of community cameras and 24-hour patrols, the Garsfontein Neighbourhood Watch reported a significant decline in vehicle theft and smash-and-grab incidents this quarter.",
    source: "Rekord East",
    suburb: "Garsfontein",
    category: "safety",
    timestamp: Date.now() - 5 * 60 * 60 * 1000,
  },
  {
    id: "n3",
    headline: "CCTV cameras catch car theft syndicate in Menlyn parking",
    summary: "New footage released by Menlyn Park Mall security shows a coordinated car theft ring operating across multiple levels. SAPS Garsfontein has opened cases and is appealing for information.",
    source: "IOL",
    suburb: "Menlyn",
    category: "crime",
    timestamp: Date.now() - 6 * 60 * 60 * 1000,
  },
  {
    id: "n4",
    headline: "Lynnwood Road signal outage causes safety concerns after load shedding",
    summary: "Multiple traffic lights on Lynnwood Road remain non-functional following extended Stage 4 load shedding. Motorists are asked to treat all intersections as four-way stops.",
    source: "Pretoria East Rekord",
    suburb: "Lynnwood",
    category: "infrastructure",
    timestamp: Date.now() - 3 * 60 * 60 * 1000,
  },
  {
    id: "n5",
    headline: "Centurion smash-and-grab incidents spike on N14",
    summary: "At least eight smash-and-grab incidents have been reported on the N14 between Centurion and Midrand over the past two weeks. Police are urging motorists to keep windows up and valuables out of sight.",
    source: "Centurion Rekord",
    suburb: "Centurion",
    category: "crime",
    timestamp: Date.now() - 8 * 60 * 60 * 1000,
  },
  {
    id: "n6",
    headline: "Brooklyn residents call for increased patrols after string of muggings",
    summary: "Brooklyn and Nieuw Muckleneuk residents have submitted a memorandum to the City of Tshwane after six mugging incidents were reported near Duxbury Road within three weeks.",
    source: "Rekord West",
    suburb: "Brooklyn",
    category: "community",
    timestamp: Date.now() - 12 * 60 * 60 * 1000,
  },
  {
    id: "n7",
    headline: "Hatfield student precinct safety upgrade announced",
    summary: "The City of Tshwane will install 42 new cameras and increase foot patrols in the Hatfield student precinct following increased criminal activity near the University of Pretoria.",
    source: "Pretoria News",
    suburb: "Hatfield",
    category: "safety",
    timestamp: Date.now() - 18 * 60 * 60 * 1000,
  },
  {
    id: "n8",
    headline: "Faerie Glen estate's new biometric gate system a model for Gauteng",
    summary: "A Faerie Glen residential estate's newly installed biometric access control and ANPR camera system has reduced unauthorised access incidents to zero over the past 60 days.",
    source: "Security Focus Africa",
    suburb: "Faerie Glen",
    category: "community",
    timestamp: Date.now() - 24 * 60 * 60 * 1000,
  },
  {
    id: "n9",
    headline: "Moreleta Park cable theft leaves suburb without power for 12 hours",
    summary: "Cable thieves targeted a main feeder cable in Moreleta Park, leaving nearly 800 households without electricity. Eskom has since restored power and increased patrols in the area.",
    source: "Rekord East",
    suburb: "Moreleta Park",
    category: "infrastructure",
    timestamp: Date.now() - 30 * 60 * 60 * 1000,
  },
];

export function getNewsForSuburb(suburb: string): NewsArticle[] {
  if (!suburb) return NEWS_ARTICLES.slice(0, 4);
  const exact = NEWS_ARTICLES.filter((a) => a.suburb.toLowerCase() === suburb.toLowerCase());
  const others = NEWS_ARTICLES.filter((a) => a.suburb.toLowerCase() !== suburb.toLowerCase());
  return [...exact, ...others].slice(0, 6);
}

export function timeAgoNews(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export const CATEGORY_COLORS: Record<NewsArticle["category"], string> = {
  crime: "#E53E3E",
  safety: "#27AE60",
  infrastructure: "#F6AD55",
  community: "#4299E1",
};
