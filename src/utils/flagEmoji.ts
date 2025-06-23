/**
 * Converts a country code to a flag emoji
 * @param countryCode - The two-letter country code (e.g., "US", "DE")
 * @returns The flag emoji as a string
 */
export function getFlagEmoji(countryCode: string): string {
  // Convert country code to flag emoji using Unicode regional indicator symbols
  if (countryCode.length !== 2) {
    return '🏳️'; // Fallback flag
  }

  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  
  return String.fromCodePoint(...codePoints);
}

/**
 * Alternative method using direct Unicode flag emojis
 */
export const flagEmojiMap: Record<string, string> = {
  "AD": "🇦🇩", "AE": "🇦🇪", "AF": "🇦🇫", "AG": "🇦🇬", "AL": "🇦🇱", "AM": "🇦🇲",
  "AO": "🇦🇴", "AR": "🇦🇷", "AT": "🇦🇹", "AU": "🇦🇺", "AZ": "🇦🇿", "BA": "🇧🇦",
  "BB": "🇧🇧", "BD": "🇧🇩", "BE": "🇧🇪", "BF": "🇧🇫", "BG": "🇧🇬", "BH": "🇧🇭",
  "BI": "🇧🇮", "BJ": "🇧🇯", "BN": "🇧🇳", "BO": "🇧🇴", "BR": "🇧🇷", "BS": "🇧🇸",
  "BT": "🇧🇹", "BW": "🇧🇼", "BY": "🇧🇾", "BZ": "🇧🇿", "CA": "🇨🇦", "CD": "🇨🇩",
  "CF": "🇨🇫", "CG": "🇨🇬", "CH": "🇨🇭", "CI": "🇨🇮", "CL": "🇨🇱", "CM": "🇨🇲",
  "CN": "🇨🇳", "CO": "🇨🇴", "CR": "🇨🇷", "CU": "🇨🇺", "CV": "🇨🇻", "CY": "🇨🇾",
  "CZ": "🇨🇿", "DE": "🇩🇪", "DJ": "🇩🇯", "DK": "🇩🇰", "DM": "🇩🇲", "DO": "🇩🇴",
  "DZ": "🇩🇿", "EC": "🇪🇨", "EE": "🇪🇪", "EG": "🇪🇬", "ER": "🇪🇷", "ES": "🇪🇸",
  "ET": "🇪🇹", "FI": "🇫🇮", "FJ": "🇫🇯", "FM": "🇫🇲", "FR": "🇫🇷", "GA": "🇬🇦",
  "GB": "🇬🇧", "GD": "🇬🇩", "GE": "🇬🇪", "GH": "🇬🇭", "GM": "🇬🇲", "GN": "🇬🇳",
  "GQ": "🇬🇶", "GR": "🇬🇷", "GT": "🇬🇹", "GW": "🇬🇼", "GY": "🇬🇾", "HN": "🇭🇳",
  "HR": "🇭🇷", "HT": "🇭🇹", "HU": "🇭🇺", "ID": "🇮🇩", "IE": "🇮🇪", "IL": "🇮🇱",
  "IN": "🇮🇳", "IQ": "🇮🇶", "IR": "🇮🇷", "IS": "🇮🇸", "IT": "🇮🇹", "JM": "🇯🇲",
  "JO": "🇯🇴", "JP": "🇯🇵", "KE": "🇰🇪", "KG": "🇰🇬", "KH": "🇰🇭", "KI": "🇰🇮",
  "KM": "🇰🇲", "KN": "🇰🇳", "KP": "🇰🇵", "KR": "🇰🇷", "KW": "🇰🇼", "KZ": "🇰🇿",
  "LA": "🇱🇦", "LB": "🇱🇧", "LC": "🇱🇨", "LI": "🇱🇮", "LK": "🇱🇰", "LR": "🇱🇷",
  "LS": "🇱🇸", "LT": "🇱🇹", "LU": "🇱🇺", "LV": "🇱🇻", "LY": "🇱🇾", "MA": "🇲🇦",
  "MC": "🇲🇨", "MD": "🇲🇩", "ME": "🇲🇪", "MG": "🇲🇬", "MH": "🇲🇭", "MK": "🇲🇰",
  "ML": "🇲🇱", "MM": "🇲🇲", "MN": "🇲🇳", "MR": "🇲🇷", "MT": "🇲🇹", "MU": "🇲🇺",
  "MV": "🇲🇻", "MW": "🇲🇼", "MX": "🇲🇽", "MY": "🇲🇾", "MZ": "🇲🇿", "NA": "🇳🇦",
  "NE": "🇳🇪", "NG": "🇳🇬", "NI": "🇳🇮", "NL": "🇳🇱", "NO": "🇳🇴", "NP": "🇳🇵",
  "NR": "🇳🇷", "NZ": "🇳🇿", "OM": "🇴🇲", "PA": "🇵🇦", "PE": "🇵🇪", "PG": "🇵🇬",
  "PH": "🇵🇭", "PK": "🇵🇰", "PL": "🇵🇱", "PT": "🇵🇹", "PW": "🇵🇼", "PY": "🇵🇾",
  "QA": "🇶🇦", "RO": "🇷🇴", "RS": "🇷🇸", "RU": "🇷🇺", "RW": "🇷🇼", "SA": "🇸🇦",
  "SB": "🇸🇧", "SC": "🇸🇨", "SD": "🇸🇩", "SE": "🇸🇪", "SG": "🇸🇬", "SI": "🇸🇮",
  "SK": "🇸🇰", "SL": "🇸🇱", "SM": "🇸🇲", "SN": "🇸🇳", "SO": "🇸🇴", "SR": "🇸🇷",
  "SS": "🇸🇸", "ST": "🇸🇹", "SV": "🇸🇻", "SY": "🇸🇾", "SZ": "🇸🇿", "TD": "🇹🇩",
  "TG": "🇹🇬", "TH": "🇹🇭", "TJ": "🇹🇯", "TL": "🇹🇱", "TM": "🇹🇲", "TN": "🇹🇳",
  "TO": "🇹🇴", "TR": "🇹🇷", "TT": "🇹🇹", "TV": "🇹🇻", "TW": "🇹🇼", "TZ": "🇹🇿",
  "UA": "🇺🇦", "UG": "🇺🇬", "US": "🇺🇸", "UY": "🇺🇾", "UZ": "🇺🇿", "VA": "🇻🇦",
  "VC": "🇻🇨", "VE": "🇻🇪", "VN": "🇻🇳", "VU": "🇻🇺", "WS": "🇼🇸", "YE": "🇾🇪",
  "ZA": "🇿🇦", "ZM": "🇿🇲", "ZW": "🇿🇼"
};

/**
 * Get flag emoji with fallback support
 */
export function getReliableFlagEmoji(countryCode: string): string {
  // First try the map lookup
  const mapEmoji = flagEmojiMap[countryCode.toUpperCase()];
  if (mapEmoji) {
    return mapEmoji;
  }
  
  // Fallback to computed emoji
  return getFlagEmoji(countryCode);
}
