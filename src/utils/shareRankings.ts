import { RankedCountry } from '@/hooks/useFlagSorting';

// Simple base64 encoding for URL-safe sharing
export function encodeRankings(rankings: RankedCountry[]): string {
  // Sort by rank and extract just the country codes and ranks
  const sortedRankings = rankings
    .filter(country => country.rank !== undefined)
    .sort((a, b) => (a.rank || 0) - (b.rank || 0))
    .map(country => ({
      code: country.code,
      rank: country.rank
    }));

  // Create a compact string representation
  const dataString = JSON.stringify(sortedRankings);
  
  // Encode to base64 and make URL-safe
  const encoded = btoa(dataString)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
  
  return encoded;
}

// Decode rankings from hash
export function decodeRankings(hash: string): { code: string; rank: number }[] | null {
  try {
    // Restore base64 padding and characters
    let base64 = hash
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    
    // Add padding if necessary
    while (base64.length % 4) {
      base64 += '=';
    }
    
    const dataString = atob(base64);
    const rankings = JSON.parse(dataString);
    
    // Validate the structure
    if (Array.isArray(rankings) && rankings.every(item => 
      typeof item.code === 'string' && typeof item.rank === 'number'
    )) {
      return rankings;
    }
    
    return null;
  } catch (error) {
    console.warn('Failed to decode rankings:', error);
    return null;
  }
}

// Generate a shareable URL for rankings
export function generateShareUrl(rankings: RankedCountry[], baseUrl?: string): string {
  const hash = encodeRankings(rankings);
  const base = baseUrl || (typeof window !== 'undefined' ? window.location.origin : '');
  return `${base}/share/${hash}`;
}

// Create a short description for social sharing
export function generateShareDescription(rankings: RankedCountry[]): string {
  const topCountries = rankings
    .filter(country => country.rank !== undefined)
    .sort((a, b) => (a.rank || 0) - (b.rank || 0))
    .slice(0, 3)
    .map(country => country.name);

  if (topCountries.length === 0) {
    return 'Check out my flag favorites ranking!';
  }

  return `My top flag favorites: ${topCountries.join(', ')} and ${rankings.length - 3} more!`;
}

// Generate metadata for social sharing
export function generateShareMetadata(rankings: RankedCountry[]) {
  const topCountries = rankings
    .filter(country => country.rank !== undefined)
    .sort((a, b) => (a.rank || 0) - (b.rank || 0))
    .slice(0, 5);

  const title = 'My Flag Favorites Ranking';
  const description = generateShareDescription(rankings);
  
  return {
    title,
    description,
    topCountries: topCountries.map(c => ({ name: c.name, flag: c.flag, rank: c.rank })),
    totalRanked: rankings.length
  };
}
