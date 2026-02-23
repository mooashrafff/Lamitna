export type MoodOption = "cozy" | "big_family" | "fancy" | "chill";
export type CookingEffort = "simple" | "happy_to_cook" | "all_out";
export type DietaryOption = "vegetarian" | "nut_free" | "dairy_free" | "no_restrictions";

export const CUISINES = [
  { id: "egyptian", code: "EG", name: "Egyptian" },
  { id: "lebanese", code: "LB", name: "Lebanese" },
  { id: "syrian", code: "SY", name: "Syrian" },
  { id: "palestinian", code: "PS", name: "Palestinian" },
  { id: "moroccan", code: "MA", name: "Moroccan" },
  { id: "turkish", code: "TR", name: "Turkish" },
  { id: "pakistani", code: "PK", name: "Pakistani" },
  { id: "indian", code: "IN", name: "Indian" },
  { id: "bangladeshi", code: "BD", name: "Bangladeshi" },
  { id: "somali", code: "SO", name: "Somali" },
  { id: "yemeni", code: "YE", name: "Yemeni" },
  { id: "iraqi", code: "IQ", name: "Iraqi" },
  { id: "indonesian", code: "ID", name: "Indonesian" },
  { id: "malaysian", code: "MY", name: "Malaysian" },
  { id: "nigerian", code: "NG", name: "Nigerian" },
  { id: "sudanese", code: "SD", name: "Sudanese" },
  { id: "afghan", code: "AF", name: "Afghan" },
  { id: "iranian", code: "IR", name: "Iranian" },
  { id: "mixed", code: "mixed", name: "Mixed / Surprise me" },
] as const;

export type CuisineId = (typeof CUISINES)[number]["id"];

export interface MenuItem {
  id: string;
  category: "Appetizers" | "Mains" | "Sides" | "Drinks" | "Desserts";
  name: string;
  quantity: string;
}

export interface GroceryItem {
  id: string;
  category: string;
  name: string;
  checked: boolean;
}

type FoodCategory = "Appetizers" | "Mains" | "Sides" | "Drinks" | "Desserts";

interface CuisineFoodDB {
  Appetizers: string[];
  Mains: string[];
  Sides: string[];
  Drinks: string[];
  Desserts: string[];
}

/** Full Ramadan food database per cuisine – fallback picks randomly from these */
const FOOD_DATABASE: Record<string, CuisineFoodDB> = {
  egyptian: {
    Appetizers: [
      "Lentil Soup", "Orzo Soup", "Molokhia Soup", "Sambousek Meat", "Sambousek Cheese",
      "Sambousek Spinach", "Mahshi Warak Enab", "Mahshi Cabbage", "Mahshi Zucchini", "Mahshi Eggplant",
      "Taameya", "Fried Potatoes with Garlic", "Baba Ghanoush", "Tahini Salad", "Green Salad",
      "Pickled Vegetables", "Eggplant Fritters", "Foul Medames (small portion starter)", "Cheese Borek", "Dates with Tamarind",
    ],
    Mains: [
      "Molokhia with Chicken", "Molokhia with Rabbit", "Fatta with Meat", "Fatta with Liver", "Koshari",
      "Stuffed Pigeon", "Grilled Kofta", "Grilled Kebab", "Shish Tawook", "Roasted Chicken",
      "Béchamel Pasta", "Lasagna Egyptian Style", "Okra Stew (Bamia)", "Peas & Carrots Stew", "Spinach Stew",
      "White Beans Stew", "Liver & Onions", "Hawawshi", "Sayadeya Fish", "Fried Fish",
      "Mahshi Mixed Tray", "Kabsa Egyptian Version", "Macarona Bel Salsa", "Meat & Potato Tray", "Kofta in Tahini",
    ],
    Sides: [
      "Rice with Vermicelli", "White Rice", "Brown Rice", "Baladi Bread", "Shrimp Salad",
      "Coleslaw", "Yogurt with Cucumber", "Garlic Dip", "Spicy Tomato Sauce", "Pickles Mix",
      "Green Tahini", "Vinegar Garlic Sauce", "Fried Eggplant Slices", "Arugula Salad", "Beetroot Salad",
    ],
    Drinks: [
      "Tamarind", "Karkade", "Qamar El Din", "Sobia", "Mango Juice",
      "Guava Juice", "Lemon Mint", "Sugarcane Juice", "Carob (Kharoob)", "Dates Smoothie",
      "Milk with Dates", "Mint Tea", "Black Tea", "Coffee", "Laban",
    ],
    Desserts: [
      "Qatayef Nuts", "Qatayef Cream", "Kunafa Cream", "Kunafa Mango", "Basbousa",
      "Zalabya", "Rice Pudding", "Om Ali", "Konafa Rolls", "Atayef Asafiri",
      "Balah El Sham", "Baklava", "Mahalabia", "Cream Caramel", "Chocolate Kunafa",
      "Coconut Basbousa", "Date Cake", "Feteer with Honey", "Cream Puff", "Biscuit Cake",
    ],
  },
  lebanese: {
    Appetizers: [
      "Lentil Soup", "Freekeh Soup", "Hummus", "Baba Ghanoush", "Muhammara",
      "Labneh", "Fattoush", "Tabbouleh", "Cheese Rolls", "Spinach Fatayer",
      "Meat Sambousek", "Cheese Sambousek", "Kibbeh Fried", "Kibbeh Nayeh", "Warak Enab",
      "Stuffed Zucchini", "Falafel", "Pickles & Olives",
    ],
    Mains: [
      "Mixed Grill", "Shish Tawook", "Kafta", "Lamb Chops", "Shawarma Plate",
      "Kibbeh bil Sanieh", "Maqluba", "Sayadieh", "Stuffed Eggplant", "Moghrabieh",
      "Freekeh with Chicken", "Rice with Nuts", "Lamb Ouzi", "Kofta in Tahini", "Spinach Stew",
      "Green Beans Stew", "Okra Stew", "Chicken with Garlic Sauce", "Fish Harra", "Musakhan",
      "Kabsa Lebanese Style", "Grilled Shrimp",
    ],
    Sides: [
      "Rice with Vermicelli", "Arabic Bread", "Yogurt", "Garlic Sauce (Toum)", "Cucumber Yogurt",
      "Tomato Salad", "Tahini", "Hummus Beiruti", "Spicy Potatoes", "Pickled Turnips",
      "Arayes", "Lentil Mujadara",
    ],
    Drinks: [
      "Jallab", "Ayran", "Tamarind", "Lemon Mint", "Orange Juice",
      "Rose Water Drink", "Carob", "Pomegranate Juice", "Tea", "Arabic Coffee",
      "Laban", "Mint Tea",
    ],
    Desserts: [
      "Atayef", "Znoud El Sit", "Baklava", "Knafeh", "Mahalabia",
      "Layali Lubnan", "Maamoul", "Rice Pudding", "Halawet el Jibn", "Date Cookies",
      "Osmalieh", "Katayef with Ashta", "Coconut Cake", "Pistachio Rolls", "Cream Kunafa",
    ],
  },
  syrian: {
    Appetizers: [
      "Lentil Soup", "Freekeh Soup", "Shish Barak Soup", "Muhammara", "Hummus",
      "Baba Ghanoush", "Fattoush", "Tabbouleh", "Yalanji", "Sambousek Meat",
      "Sambousek Cheese", "Kibbeh Fried", "Kibbeh Grilled", "Spinach Fatayer", "Cheese Fatayer",
      "Falafel", "Labneh", "Pickled Vegetables",
    ],
    Mains: [
      "Kibbeh bil Sanieh", "Kibbeh Labanieh", "Kabsa Syrian Style", "Maqluba", "Fasolia with Lamb",
      "Bamieh", "Molokhia Syrian Style", "Shawarma Plate", "Mixed Grill", "Shish Tawook",
      "Lamb Ouzi", "Chicken Freekeh", "Stuffed Zucchini", "Stuffed Eggplant", "Musakhan",
      "Sayadieh", "Kofta in Tahini", "Rice with Nuts",
    ],
    Sides: [
      "Arabic Bread", "Vermicelli Rice", "Yogurt", "Toum (Garlic Sauce)", "Pickled Turnips",
      "Spicy Potatoes", "Tahini Sauce", "Cucumber Yogurt", "Tomato Salad", "Lentil Mujadara",
    ],
    Drinks: [
      "Tamarind", "Jallab", "Lemon Mint", "Carob", "Rose Drink",
      "Ayran", "Tea", "Arabic Coffee", "Pomegranate Juice", "Laban",
    ],
    Desserts: [
      "Halawet el Jibn", "Atayef", "Maamoul", "Baklava", "Knafeh",
      "Znoud el Sit", "Mahalabia", "Rice Pudding", "Date Cookies", "Coconut Cake",
    ],
  },
  palestinian: {
    Appetizers: [
      "Lentil Soup", "Hummus", "Baba Ghanoush", "Musakhan Rolls", "Falafel",
      "Warak Enab", "Pickles", "Labneh", "Fattoush", "Sambousek",
    ],
    Mains: [
      "Maqluba", "Musakhan", "Mansaf Palestinian Style", "Sayadieh", "Stuffed Zucchini",
      "Freekeh with Chicken", "Kofta in Tahini", "Bamia", "Mixed Grill", "Ouzi",
    ],
    Sides: [
      "Vermicelli Rice", "Arabic Bread", "Yogurt", "Cucumber Salad", "Tahini Sauce",
      "Garlic Dip", "Pickled Turnips", "Lentil Mujadara",
    ],
    Drinks: [
      "Tamarind", "Qamar El Din", "Lemon Mint", "Jallab", "Tea", "Coffee",
    ],
    Desserts: [
      "Knafeh Nabulsi", "Atayef", "Maamoul", "Baklava", "Rice Pudding", "Coconut Basbousa",
    ],
  },
  moroccan: {
    Appetizers: [
      "Harira Soup", "Chebakia", "Briouats (Meat)", "Briouats (Cheese)", "Zaalouk",
      "Taktouka", "Moroccan Salad", "Batbout", "Harcha", "Dates with Milk",
    ],
    Mains: [
      "Chicken Tagine with Olives", "Lamb Tagine with Prunes", "Couscous with Vegetables", "Rfissa",
      "Pastilla Chicken", "Kefta Tagine", "Fish Chermoula", "Mechoui Lamb", "Seffa", "Tride",
    ],
    Sides: [
      "Khobz Bread", "Olive Salad", "Pickled Carrots", "Tomato Cucumber Salad", "Couscous Plain",
    ],
    Drinks: [
      "Mint Tea", "Avocado Smoothie", "Date Milk", "Orange Juice", "Almond Milk",
    ],
    Desserts: [
      "Chebakia", "Sellou", "Ghriba", "Kaab el Ghazal", "Almond Briouats", "Basbousa Moroccan Style",
    ],
  },
  turkish: {
    Appetizers: [
      "Mercimek Soup", "Ezogelin Soup", "Borek Cheese", "Borek Meat", "Imam Bayildi",
      "Dolma", "Cacik", "Haydari", "Shepherd Salad", "Pide Bread",
    ],
    Mains: [
      "Doner Kebab", "Iskender Kebab", "Adana Kebab", "Kofta", "Manti",
      "Pilav", "Chicken Guvec", "Lamb Stew", "Karniyarik", "Stuffed Peppers",
    ],
    Sides: [
      "Yogurt", "Pickles", "Rice", "Fresh Bread", "Bulgur Pilaf",
    ],
    Drinks: [
      "Ayran", "Turkish Tea", "Turkish Coffee", "Sherbet", "Pomegranate Juice",
    ],
    Desserts: [
      "Baklava", "Gullac", "Kunefe", "Lokum", "Sutlac", "Revani",
    ],
  },
  pakistani: {
    Appetizers: [
      "Fruit Chaat", "Pakora", "Samosa", "Chana Chaat", "Dahi Bhalla",
      "Spring Rolls", "Haleem Starter", "Dates", "Rooh Afza",
    ],
    Mains: [
      "Chicken Biryani", "Beef Biryani", "Nihari", "Karahi Chicken", "Haleem",
      "Pulao", "Kofta Curry", "Daal Tadka", "Korma", "BBQ Platter",
    ],
    Sides: [
      "Roti", "Naan", "Raita", "Salad", "Pickles",
    ],
    Drinks: [
      "Rooh Afza", "Lassi", "Mango Shake", "Lemon Soda", "Tea",
    ],
    Desserts: [
      "Kheer", "Gulab Jamun", "Jalebi", "Ras Malai", "Shahi Tukda",
    ],
  },
  indian: {
    Appetizers: [
      "Samosa", "Pakora", "Chaat", "Dahi Puri", "Dates",
      "Lentil Soup", "Fruit Salad",
    ],
    Mains: [
      "Chicken Biryani", "Mutton Biryani", "Butter Chicken", "Rogan Josh", "Paneer Butter Masala",
      "Dal Makhani", "Chicken Korma", "Tandoori Chicken",
    ],
    Sides: [
      "Naan", "Roti", "Raita", "Salad", "Pickles",
    ],
    Drinks: [
      "Mango Lassi", "Masala Chai", "Rose Milk", "Lemon Soda", "Falooda",
    ],
    Desserts: [
      "Gulab Jamun", "Rasgulla", "Kheer", "Jalebi", "Kulfi",
    ],
  },
};

/** Fixed sample menus for cuisines without full DB (e.g. Iranian) – kept for backward compatibility */
const SAMPLE_MENUS: Record<string, MenuItem[]> = {
  iranian: [
    { id: "1", category: "Appetizers", name: "Paneer Sabzi Khordan (Fresh Herbs, Feta, Radishes, Walnuts)", quantity: "1 individual platter" },
    { id: "2", category: "Appetizers", name: "Ash-e Reshteh (Thick Noodle and Herb Soup with Kashk)", quantity: "1 medium bowl" },
    { id: "3", category: "Appetizers", name: "Kookoo Sabzi (Persian Herb Frittata)", quantity: "2 large wedges" },
    { id: "4", category: "Mains", name: "Zereshk Polo ba Morgh (Barberry Rice with Saffron Chicken)", quantity: "1 generous plate" },
    { id: "5", category: "Mains", name: "Ghormeh Sabzi (Herb Stew with Lamb and Kidney Beans)", quantity: "1 small pot" },
    { id: "6", category: "Sides", name: "Tahdig (Crispy Saffron Rice)", quantity: "2-3 pieces" },
    { id: "7", category: "Sides", name: "Salad Shirazi (Cucumber, Tomato, Onion Salad)", quantity: "1 bowl" },
    { id: "8", category: "Drinks", name: "Doogh (Chilled Yogurt Drink with Dried Mint)", quantity: "2 glasses" },
    { id: "9", category: "Drinks", name: "Chai with Nabat (Persian Tea with Saffron Rock Candy)", quantity: "2-3 cups" },
    { id: "10", category: "Desserts", name: "Sholezard (Saffron Rice Pudding)", quantity: "1 bowl" },
    { id: "11", category: "Desserts", name: "Zulbia and Bamiyeh (Syrup-soaked Deep Fried Sweets)", quantity: "1 small platter" },
  ],
  default: [
    { id: "d1", category: "Appetizers", name: "Mixed mezze", quantity: "1 platter" },
    { id: "d2", category: "Mains", name: "Rice with protein", quantity: "1 plate" },
    { id: "d3", category: "Sides", name: "Salad", quantity: "1 bowl" },
    { id: "d4", category: "Drinks", name: "Juice or tea", quantity: "2 glasses" },
    { id: "d5", category: "Desserts", name: "Sweet treat", quantity: "1 serving" },
  ],
};

const SAMPLE_GROCERIES: Record<string, GroceryItem[]> = {
  iranian: [
    { id: "g1", category: "PRODUCE", name: "5 bunches fresh parsley", checked: false },
    { id: "g2", category: "PRODUCE", name: "4 bunches fresh cilantro", checked: false },
    { id: "g3", category: "PRODUCE", name: "3 bunches fresh chives or scallions", checked: false },
    { id: "g4", category: "PRODUCE", name: "1 bunch fresh dill", checked: false },
    { id: "g5", category: "PRODUCE", name: "1 bunch fresh mint", checked: false },
    { id: "g6", category: "PRODUCE", name: "1 bunch radishes", checked: false },
    { id: "g7", category: "PRODUCE", name: "3 large yellow onions", checked: false },
    { id: "g8", category: "PRODUCE", name: "2 Persian cucumbers", checked: false },
    { id: "g9", category: "PROTEIN", name: "500g chicken (thighs or drumsticks)", checked: false },
    { id: "g10", category: "PROTEIN", name: "300g stewing lamb or beef", checked: false },
    { id: "g11", category: "PROTEIN", name: "6 large eggs", checked: false },
    { id: "g12", category: "DAIRY", name: "200ml Liquid Kashk", checked: false },
    { id: "g13", category: "DAIRY", name: "100g Butter", checked: false },
    { id: "g14", category: "GRAINS & BREAD", name: "1kg Basmati rice", checked: false },
    { id: "g15", category: "GRAINS & BREAD", name: "1 pack Sangak or Barbari bread", checked: false },
    { id: "g16", category: "PANTRY", name: "1/2 cup dried Kidney beans", checked: false },
    { id: "g17", category: "PANTRY", name: "1/2 cup Dried barberries (Zereshk)", checked: false },
    { id: "g18", category: "SPICES", name: "1 gram Saffron threads", checked: false },
    { id: "g19", category: "SPICES", name: "Turmeric, Cinnamon, Salt, Black Pepper", checked: false },
    { id: "g20", category: "BEVERAGES", name: "Loose leaf Persian black tea", checked: false },
    { id: "g21", category: "BEVERAGES", name: "500ml Doogh", checked: false },
    { id: "g22", category: "OTHER", name: "Nabat (Saffron rock candy)", checked: false },
  ],
  egyptian: [
    { id: "ge1", category: "PRODUCE", name: "Tomatoes, onions, garlic, greens", checked: false },
    { id: "ge2", category: "PROTEIN", name: "Chicken or meat as per menu", checked: false },
    { id: "ge3", category: "GRAINS & BREAD", name: "Rice, vermicelli, baladi bread", checked: false },
    { id: "ge4", category: "PANTRY", name: "Tahini, molokhia, lentils, spices", checked: false },
    { id: "ge5", category: "DAIRY", name: "Yogurt, butter", checked: false },
    { id: "ge6", category: "BEVERAGES", name: "Karkade, tamarind, dates", checked: false },
  ],
  lebanese: [
    { id: "gl1", category: "PRODUCE", name: "Parsley, tomatoes, cucumber, mint", checked: false },
    { id: "gl2", category: "PROTEIN", name: "Chicken, lamb, or fish as per menu", checked: false },
    { id: "gl3", category: "GRAINS & BREAD", name: "Rice, vermicelli, Arabic bread", checked: false },
    { id: "gl4", category: "PANTRY", name: "Chickpeas, tahini, freekeh, spices", checked: false },
    { id: "gl5", category: "DAIRY", name: "Labneh, yogurt", checked: false },
    { id: "gl6", category: "BEVERAGES", name: "Jallab, lemon, mint, tea", checked: false },
  ],
  syrian: [
    { id: "gs1", category: "PRODUCE", name: "Herbs, tomatoes, cucumber, eggplant", checked: false },
    { id: "gs2", category: "PROTEIN", name: "Chicken, lamb, or minced meat", checked: false },
    { id: "gs3", category: "GRAINS & BREAD", name: "Rice, bulgur, Arabic bread", checked: false },
    { id: "gs4", category: "PANTRY", name: "Lentils, tahini, pomegranate molasses", checked: false },
    { id: "gs5", category: "DAIRY", name: "Yogurt, labneh", checked: false },
    { id: "gs6", category: "BEVERAGES", name: "Jallab, tamarind, tea, coffee", checked: false },
  ],
  palestinian: [
    { id: "gp1", category: "PRODUCE", name: "Onions, tomatoes, cucumber, sumac", checked: false },
    { id: "gp2", category: "PROTEIN", name: "Chicken, lamb as per menu", checked: false },
    { id: "gp3", category: "GRAINS & BREAD", name: "Rice, vermicelli, Arabic bread", checked: false },
    { id: "gp4", category: "PANTRY", name: "Freekeh, tahini, chickpeas, spices", checked: false },
    { id: "gp5", category: "DAIRY", name: "Yogurt", checked: false },
    { id: "gp6", category: "BEVERAGES", name: "Tamarind, qamar el din, tea", checked: false },
  ],
  moroccan: [
    { id: "gm1", category: "PRODUCE", name: "Onions, tomatoes, olives, preserved lemon", checked: false },
    { id: "gm2", category: "PROTEIN", name: "Chicken, lamb, or fish", checked: false },
    { id: "gm3", category: "GRAINS & BREAD", name: "Couscous, khobz bread", checked: false },
    { id: "gm4", category: "PANTRY", name: "Harira ingredients, spices, almonds", checked: false },
    { id: "gm5", category: "DAIRY", name: "Butter, milk", checked: false },
    { id: "gm6", category: "BEVERAGES", name: "Mint tea, dates", checked: false },
  ],
  turkish: [
    { id: "gt1", category: "PRODUCE", name: "Tomatoes, cucumber, peppers, eggplant", checked: false },
    { id: "gt2", category: "PROTEIN", name: "Lamb, chicken, or minced meat", checked: false },
    { id: "gt3", category: "GRAINS & BREAD", name: "Rice, bulgur, pide bread", checked: false },
    { id: "gt4", category: "PANTRY", name: "Lentils, tomato paste, spices", checked: false },
    { id: "gt5", category: "DAIRY", name: "Yogurt", checked: false },
    { id: "gt6", category: "BEVERAGES", name: "Ayran, tea, coffee", checked: false },
  ],
  pakistani: [
    { id: "gpk1", category: "PRODUCE", name: "Onions, tomatoes, ginger, garlic", checked: false },
    { id: "gpk2", category: "PROTEIN", name: "Chicken, beef, or lamb as per menu", checked: false },
    { id: "gpk3", category: "GRAINS & BREAD", name: "Basmati rice, naan, roti", checked: false },
    { id: "gpk4", category: "PANTRY", name: "Daal, spices, oil", checked: false },
    { id: "gpk5", category: "DAIRY", name: "Yogurt, ghee", checked: false },
    { id: "gpk6", category: "BEVERAGES", name: "Rooh Afza, lassi, tea", checked: false },
  ],
  indian: [
    { id: "gin1", category: "PRODUCE", name: "Onions, tomatoes, ginger, garlic, cilantro", checked: false },
    { id: "gin2", category: "PROTEIN", name: "Chicken, mutton, or paneer as per menu", checked: false },
    { id: "gin3", category: "GRAINS & BREAD", name: "Basmati rice, naan, roti", checked: false },
    { id: "gin4", category: "PANTRY", name: "Lentils, spices, ghee", checked: false },
    { id: "gin5", category: "DAIRY", name: "Yogurt, cream", checked: false },
    { id: "gin6", category: "BEVERAGES", name: "Chai, lassi, rose syrup", checked: false },
  ],
  default: [
    { id: "gd1", category: "PRODUCE", name: "Fresh herbs and vegetables", checked: false },
    { id: "gd2", category: "PROTEIN", name: "Chicken or lamb", checked: false },
    { id: "gd3", category: "GRAINS & BREAD", name: "Rice and bread", checked: false },
    { id: "gd4", category: "PANTRY", name: "Spices and oils", checked: false },
  ],
};

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Pick up to n random items from array (no duplicates) */
function pickRandom<T>(arr: T[], n: number): T[] {
  if (arr.length === 0) return [];
  const shuffled = shuffle(arr);
  return shuffled.slice(0, Math.min(n, arr.length));
}

function scaleQuantity(qty: string, guestCount: number): string {
  const n = guestCount;
  if (n <= 1) return qty;
  if (qty.includes("1 ") && !qty.includes("1/")) {
    const num = parseInt(qty, 10) || 1;
    const rest = qty.replace(/^\d+\s*/, "");
    if (num === 1) return `${Math.max(1, Math.ceil(n / 4))} ${rest}`;
  }
  if (qty.includes("bowl") || qty.includes("plate") || qty.includes("platter"))
    return `${Math.max(1, Math.ceil(n / 4))} ${qty.replace(/^\d+\s*/, "")}`;
  return qty;
}

const DEFAULT_QUANTITIES: Record<FoodCategory, string> = {
  Appetizers: "1 bowl",
  Mains: "1 plate",
  Sides: "1 serving",
  Drinks: "2 glasses",
  Desserts: "1 serving",
};

/** Build menu from food DB: random picks per category, quantities scaled by guests */
function buildMenuFromDatabase(db: CuisineFoodDB, guestCount: number): MenuItem[] {
  // Keep the fallback aligned with the AI rules (and more variable across regenerations)
  const appetizers = pickRandom(db.Appetizers, 2);
  const mains = pickRandom(db.Mains, 1);
  const sides = pickRandom(db.Sides, 1);
  const drinks = pickRandom(db.Drinks, 1);
  const desserts = pickRandom(db.Desserts, 1);

  const categories: FoodCategory[] = ["Appetizers", "Mains", "Sides", "Drinks", "Desserts"];
  const items: MenuItem[] = [];
  let id = 0;
  const ts = Date.now();

  for (const name of appetizers) {
    items.push({
      id: `fb-${ts}-${++id}`,
      category: "Appetizers",
      name,
      quantity: scaleQuantity(DEFAULT_QUANTITIES.Appetizers, guestCount),
    });
  }
  for (const name of mains) {
    items.push({
      id: `fb-${ts}-${++id}`,
      category: "Mains",
      name,
      quantity: scaleQuantity(DEFAULT_QUANTITIES.Mains, guestCount),
    });
  }
  for (const name of sides) {
    items.push({
      id: `fb-${ts}-${++id}`,
      category: "Sides",
      name,
      quantity: scaleQuantity(DEFAULT_QUANTITIES.Sides, guestCount),
    });
  }
  for (const name of drinks) {
    items.push({
      id: `fb-${ts}-${++id}`,
      category: "Drinks",
      name,
      quantity: scaleQuantity(DEFAULT_QUANTITIES.Drinks, guestCount),
    });
  }
  for (const name of desserts) {
    items.push({
      id: `fb-${ts}-${++id}`,
      category: "Desserts",
      name,
      quantity: scaleQuantity(DEFAULT_QUANTITIES.Desserts, guestCount),
    });
  }
  return items;
}

/** Randomized fallback when AI is not available – different each time, scaled by guests */
export function getMenuForCuisineFallback(cuisineId: string, guestCount: number): MenuItem[] {
  const db = FOOD_DATABASE[cuisineId];
  if (db) {
    return buildMenuFromDatabase(db, guestCount);
  }
  if (cuisineId === "mixed") {
    const cuisineKeys = Object.keys(FOOD_DATABASE);
    const randomCuisine = cuisineKeys[Math.floor(Math.random() * cuisineKeys.length)];
    return buildMenuFromDatabase(FOOD_DATABASE[randomCuisine], guestCount);
  }
  const menu = SAMPLE_MENUS[cuisineId] ?? SAMPLE_MENUS.default;
  const shuffled = shuffle(menu);
  return shuffled.map((item, i) => ({
    ...item,
    id: `${item.id}-${Date.now()}-${i}`,
    quantity: scaleQuantity(item.quantity, guestCount),
  }));
}

export function getGroceryForCuisineFallback(cuisineId: string): GroceryItem[] {
  let key = cuisineId;
  if (cuisineId === "mixed") {
    const dbCuisines = Object.keys(FOOD_DATABASE);
    key = dbCuisines[Math.floor(Math.random() * dbCuisines.length)];
  }
  const list = SAMPLE_GROCERIES[key] ?? SAMPLE_GROCERIES.default;
  const shuffled = shuffle(list);
  return shuffled.map((item, i) => ({
    ...item,
    id: `${item.id}-${Date.now()}-${i}`,
    checked: false,
  }));
}
