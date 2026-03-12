export type Category =
  | "All"
  | "Warm"
  | "Red"
  | "Orange"
  | "Yellow"
  | "Green"
  | "Blue"
  | "Purple"
  | "Pink"
  | "Neutral";

export type PantoneColor = {
  id: string;
  code: string;
  name: string;
  hex: string;
  category: Exclude<Category, "All">;
  year?: number;
};

export const CATEGORIES: Category[] = [
  "All",
  "Warm",
  "Red",
  "Orange",
  "Yellow",
  "Green",
  "Blue",
  "Purple",
  "Pink",
  "Neutral",
];

export const PANTONE_COLORS: PantoneColor[] = [
  // Color of the Year - Warm
  { id: "1", code: "15-1520", name: "Peach Fuzz", hex: "#FFBE98", category: "Warm", year: 2024 },
  { id: "2", code: "16-1546", name: "Living Coral", hex: "#FF6B6B", category: "Warm", year: 2019 },
  { id: "3", code: "18-1438", name: "Marsala", hex: "#955251", category: "Warm", year: 2015 },
  { id: "4", code: "17-1230", name: "Sandstorm", hex: "#C2A882", category: "Warm" },
  { id: "5", code: "14-1318", name: "Cream Blush", hex: "#F2D4C4", category: "Warm" },
  { id: "6", code: "16-1520", name: "Dusty Rose", hex: "#E8A898", category: "Warm" },
  { id: "7", code: "15-1340", name: "Apricot", hex: "#F5A77A", category: "Warm" },
  { id: "8", code: "16-1430", name: "Copper Tan", hex: "#D4906E", category: "Warm" },
  { id: "9", code: "14-1220", name: "Bisque", hex: "#F5CDB8", category: "Warm" },
  { id: "10", code: "15-1515", name: "Peach Beige", hex: "#E8C4A8", category: "Warm" },

  // Red
  { id: "11", code: "18-1750", name: "Viva Magenta", hex: "#BB2649", category: "Red", year: 2023 },
  { id: "12", code: "19-1664", name: "True Red", hex: "#BF1932", category: "Red" },
  { id: "13", code: "18-1660", name: "Aurora Red", hex: "#B83A4B", category: "Red" },
  { id: "14", code: "19-1557", name: "Chili Pepper", hex: "#9B1B30", category: "Red" },
  { id: "15", code: "18-1655", name: "Tomato", hex: "#CE4B35", category: "Red" },
  { id: "16", code: "19-1758", name: "Flame Scarlet", hex: "#CD212A", category: "Red" },
  { id: "17", code: "17-1741", name: "Hibiscus", hex: "#CA3433", category: "Red" },
  { id: "18", code: "18-1541", name: "Cranberry", hex: "#A02958", category: "Red" },
  { id: "19", code: "19-1862", name: "Racing Red", hex: "#C81B28", category: "Red" },
  { id: "20", code: "17-1644", name: "Grenadine", hex: "#E8472F", category: "Red" },

  // Orange
  { id: "21", code: "17-1463", name: "Tangerine Tango", hex: "#DD4132", category: "Orange", year: 2012 },
  { id: "22", code: "16-1362", name: "Orange Tiger", hex: "#F4831F", category: "Orange" },
  { id: "23", code: "15-1157", name: "Tangerine", hex: "#F28A30", category: "Orange" },
  { id: "24", code: "16-1358", name: "Burnt Orange", hex: "#D2601A", category: "Orange" },
  { id: "25", code: "16-1440", name: "Peach Amber", hex: "#E8956D", category: "Orange" },
  { id: "26", code: "15-1164", name: "Nectarine", hex: "#FF964F", category: "Orange" },
  { id: "27", code: "16-1442", name: "Autumn Maple", hex: "#C97B4B", category: "Orange" },
  { id: "28", code: "17-1340", name: "Sienna", hex: "#B5623B", category: "Orange" },

  // Yellow
  { id: "29", code: "13-0647", name: "Illuminating", hex: "#F5DF4D", category: "Yellow", year: 2021 },
  { id: "30", code: "13-0858", name: "Vibrant Yellow", hex: "#F8E231", category: "Yellow" },
  { id: "31", code: "14-0846", name: "Gold Fusion", hex: "#E8C84B", category: "Yellow" },
  { id: "32", code: "12-0752", name: "Lemon Verbena", hex: "#F4E77C", category: "Yellow" },
  { id: "33", code: "15-1062", name: "Amber Yellow", hex: "#F5A623", category: "Yellow" },
  { id: "34", code: "15-0950", name: "Saffron", hex: "#F4A024", category: "Yellow" },
  { id: "35", code: "14-1064", name: "Sunflower", hex: "#F6C40F", category: "Yellow" },
  { id: "36", code: "13-0755", name: "Buttercup", hex: "#F8DD5E", category: "Yellow" },

  // Green
  { id: "37", code: "15-0343", name: "Greenery", hex: "#88B04B", category: "Green", year: 2017 },
  { id: "38", code: "17-0145", name: "Emerald", hex: "#009473", category: "Green", year: 2013 },
  { id: "39", code: "15-5519", name: "Turquoise", hex: "#45B5AA", category: "Green", year: 2010 },
  { id: "40", code: "15-0545", name: "Green Flash", hex: "#79C753", category: "Green" },
  { id: "41", code: "18-0135", name: "Foliage", hex: "#5A7247", category: "Green" },
  { id: "42", code: "16-0237", name: "Jade Lime", hex: "#A7C264", category: "Green" },
  { id: "43", code: "17-0230", name: "Shale Green", hex: "#7D9B76", category: "Green" },
  { id: "44", code: "18-0430", name: "Calliste Green", hex: "#5B6F44", category: "Green" },
  { id: "45", code: "16-0430", name: "Peapod", hex: "#A1AE71", category: "Green" },
  { id: "46", code: "19-0230", name: "Kombu Green", hex: "#3D4F3A", category: "Green" },

  // Blue
  { id: "47", code: "19-4052", name: "Classic Blue", hex: "#0F4C81", category: "Blue", year: 2020 },
  { id: "48", code: "17-3938", name: "Very Peri", hex: "#6667AB", category: "Blue", year: 2022 },
  { id: "49", code: "15-3920", name: "Cerulean", hex: "#9BB7D4", category: "Blue", year: 2000 },
  { id: "50", code: "19-4340", name: "Deep Teal", hex: "#006E7F", category: "Blue" },
  { id: "51", code: "18-4244", name: "Marina", hex: "#4F84C4", category: "Blue" },
  { id: "52", code: "19-4241", name: "Sailor Blue", hex: "#3A5DAE", category: "Blue" },
  { id: "53", code: "17-4328", name: "Sky Blue", hex: "#7BC4E2", category: "Blue" },
  { id: "54", code: "19-4150", name: "Snorkel Blue", hex: "#034F84", category: "Blue" },
  { id: "55", code: "15-4020", name: "Powder Blue", hex: "#B5D3E7", category: "Blue" },
  { id: "56", code: "18-4528", name: "Niagara", hex: "#5A7FA5", category: "Blue" },
  { id: "57", code: "17-4041", name: "Little Boy Blue", hex: "#6CA0DC", category: "Blue" },
  { id: "58", code: "15-3817", name: "Serenity", hex: "#92A8D1", category: "Blue", year: 2016 },

  // Purple
  { id: "59", code: "18-3838", name: "Ultra Violet", hex: "#5F4B8B", category: "Purple", year: 2018 },
  { id: "60", code: "18-3633", name: "Amethyst Orchid", hex: "#926AA6", category: "Purple", year: 2014 },
  { id: "61", code: "18-3224", name: "Radiant Orchid", hex: "#AD5E99", category: "Purple", year: 2014 },
  { id: "62", code: "19-3748", name: "Royal Purple", hex: "#6B3FA0", category: "Purple" },
  { id: "63", code: "16-3520", name: "Pastel Lilac", hex: "#B8A9C9", category: "Purple" },
  { id: "64", code: "18-3025", name: "Violet Tulip", hex: "#B3AECA", category: "Purple" },
  { id: "65", code: "19-3536", name: "Mulberry", hex: "#7A2D6B", category: "Purple" },
  { id: "66", code: "17-3628", name: "Lavender Herb", hex: "#9D8BBB", category: "Purple" },

  // Pink
  { id: "67", code: "13-2010", name: "Rose Quartz", hex: "#F7CAC9", category: "Pink", year: 2016 },
  { id: "68", code: "18-2043", name: "Fuchsia Rose", hex: "#C74375", category: "Pink", year: 2001 },
  { id: "69", code: "18-2043", name: "Honeysuckle", hex: "#D94F70", category: "Pink", year: 2011 },
  { id: "70", code: "17-2034", name: "Pink Lemonade", hex: "#F0758A", category: "Pink" },
  { id: "71", code: "16-1723", name: "Flamingo Pink", hex: "#F4A8A5", category: "Pink" },
  { id: "72", code: "14-1714", name: "Baby Pink", hex: "#F9D2D2", category: "Pink" },
  { id: "73", code: "18-2336", name: "Carmine Rose", hex: "#E05E8A", category: "Pink" },
  { id: "74", code: "15-2216", name: "Orchid Hush", hex: "#DAAFC4", category: "Pink" },

  // Neutral
  { id: "75", code: "17-5104", name: "Ultimate Gray", hex: "#939597", category: "Neutral", year: 2021 },
  { id: "76", code: "15-1516", name: "Sand", hex: "#C4A882", category: "Neutral" },
  { id: "77", code: "16-1318", name: "Warm Taupe", hex: "#B09A84", category: "Neutral" },
  { id: "78", code: "19-0303", name: "Jet Black", hex: "#2B2B2C", category: "Neutral" },
  { id: "79", code: "17-1512", name: "Simply Taupe", hex: "#AD9D8F", category: "Neutral" },
  { id: "80", code: "16-1324", name: "Hazelnut", hex: "#C2A080", category: "Neutral" },
];

/** 올해의 컬러(COTYE) 미리보기용 헥스 코드 */
export const COTYE_PREVIEW_COLORS = PANTONE_COLORS.filter((c) => c.year)
  .sort((a, b) => (b.year ?? 0) - (a.year ?? 0))
  .slice(0, 8)
  .map((c) => c.hex);
