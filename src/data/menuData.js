// Import images
import bruschettaImg from '../assets/images/bruchetta.svg';
import crispyCalamariImg from '../assets/images/crispy-calamari.png';
import stuffedMushroomsImg from '../assets/images/stuffed-mushrooms.png';
import greekSaladImg from '../assets/images/greek_salad.jpg';
import lemonHerbChickenImg from '../assets/images/lemon-herb-chicken.png';
import traditionalMoussakaImg from '../assets/images/traditional-moussaka.png';
import pastaAglioEOlioImg from '../assets/images/pasta-aglio-e-olio.png';
import lemonDessertImg from '../assets/images/lemon_dessert.jpg';
import baklavaImg from '../assets/images/baklava.png';
import freshlySqueezedLemonadeImg from '../assets/images/freshly-squeezed-lemonade.png';
import mediterraneanMintTeaImg from '../assets/images/mediterranean-mint-tea.png';
import italianEspressoImg from '../assets/images/italian-espresso.png';

// Import new dish images
import seafoodPaellaImg from '../assets/images/new-dishes/seafood-paella.png';
import lambSouvlakiImg from '../assets/images/new-dishes/lamb-souvlaki.png';
import galaktobourekoImg from '../assets/images/new-dishes/galaktoboureko.png';

// Placeholder for menuData.js
// This file will export an array of menu item objects and categories.

export const menuCategories = [
  "Appetizers",
  "Main Courses",
  "Desserts",
  "Drinks"
];

export const menuItems = [
  // Appetizers
  {
    id: 1,
    category: "Appetizers",
    name: "Bruschetta",
    price: 8.99,
    description: "Grilled bread rubbed with garlic and topped with fresh tomatoes, basil, and a drizzle of balsamic glaze.",
    image: bruschettaImg,
    dietaryTags: ["vegetarian", "vegan", "dairy-free"]
  },
  {
    id: 2,
    category: "Appetizers",
    name: "Crispy Calamari",
    price: 12.50,
    description: "Tender calamari rings lightly battered and fried until golden, served with a zesty lemon-aioli.",
    image: crispyCalamariImg,
    dietaryTags: ["pescatarian"]
  },
  {
    id: 3,
    category: "Appetizers",
    name: "Stuffed Mushrooms",
    price: 10.00,
    description: "Large mushroom caps filled with a savory mixture of herbs, cheese, and breadcrumbs, baked to perfection.",
    image: stuffedMushroomsImg,
    dietaryTags: ["vegetarian"]
  },
  // Main Courses
  {
    id: 4,
    category: "Main Courses",
    name: "Classic Greek Salad",
    price: 15.99,
    description: "A hearty portion of crispy lettuce, ripe tomatoes, cucumbers, Kalamata olives, red onions, and authentic feta cheese, tossed in our signature lemon-herb vinaigrette. Served with pita bread.",
    image: greekSaladImg,
    dietaryTags: ["vegetarian", "gluten-free-option"]
  },
  {
    id: 5,
    category: "Main Courses",
    name: "Lemon Herb Chicken",
    price: 22.00,
    description: "Grilled chicken breast marinated in lemon juice, garlic, and Mediterranean herbs, served with roasted vegetables and a side of tzatziki sauce.",
    image: lemonHerbChickenImg,
    dietaryTags: ["gluten-free"]
  },
  {
    id: 6,
    category: "Main Courses",
    name: "Traditional Moussaka",
    price: 19.50,
    description: "Layers of baked eggplant, seasoned ground lamb, and creamy béchamel sauce, a true Mediterranean classic.",
    image: traditionalMoussakaImg,
    dietaryTags: []
  },
  {
    id: 7,
    category: "Main Courses",
    name: "Pasta Aglio e Olio",
    price: 17.00,
    description: "Simple yet flavorful spaghetti tossed with garlic, olive oil, red pepper flakes, and fresh parsley. A taste of Italy.",
    image: pastaAglioEOlioImg,
    dietaryTags: ["vegetarian", "vegan", "dairy-free"]
  },
  // Desserts
  {
    id: 8,
    category: "Desserts",
    name: "Grandma's Lemon Cake",
    price: 9.00,
    description: "Our famous lemon dessert, a secret family recipe. Moist, tangy, and utterly irresistible. Served with a dollop of fresh cream.",
    image: lemonDessertImg,
    dietaryTags: ["vegetarian"]
  },
  {
    id: 9,
    category: "Desserts",
    name: "Baklava",
    price: 7.50,
    description: "Rich, sweet pastry made of layers of filo filled with chopped nuts and sweetened and held together with syrup.",
    image: baklavaImg,
    dietaryTags: ["vegetarian", "contains-nuts"]
  },
  // Drinks
  {
    id: 10,
    category: "Drinks",
    name: "Freshly Squeezed Lemonade",
    price: 4.50,
    description: "Cool and refreshing, made daily with fresh lemons and a hint of mint.",
    image: freshlySqueezedLemonadeImg,
    dietaryTags: ["vegetarian", "vegan", "gluten-free", "dairy-free"]
  },
  {
    id: 11,
    category: "Drinks",
    name: "Mediterranean Mint Tea",
    price: 4.00,
    description: "Aromatic black tea infused with fresh mint leaves, served chilled or hot.",
    image: mediterraneanMintTeaImg,
    dietaryTags: ["vegetarian", "vegan", "gluten-free", "dairy-free"]
  },
  {
    id: 12,
    category: "Drinks",
    name: "Italian Espresso",
    price: 3.50,
    description: "Rich and aromatic single shot of espresso, the perfect pick-me-up.",
    image: italianEspressoImg,
    dietaryTags: ["vegetarian", "vegan", "gluten-free", "dairy-free"]
  },
  // New Main Courses
  {
    id: 13,
    category: "Main Courses",
    name: "Seafood Paella",
    price: 24.99,
    description: "A vibrant Spanish rice dish cooked with saffron and topped with a medley of seafood including shrimp, mussels, and calamari, garnished with fresh lemon and parsley.",
    image: seafoodPaellaImg,
    dietaryTags: ["pescatarian", "gluten-free"]
  },
  {
    id: 14,
    category: "Main Courses",
    name: "Lamb Souvlaki",
    price: 21.50,
    description: "Tender marinated lamb skewers grilled to perfection, served with warm pita bread, tzatziki sauce, and a side of Greek salad with feta cheese.",
    image: lambSouvlakiImg,
    dietaryTags: []
  },
  // New Dessert
  {
    id: 15,
    category: "Desserts",
    name: "Galaktoboureko",
    price: 8.50,
    description: "A traditional Greek dessert featuring a creamy semolina custard wrapped in crispy filo pastry, soaked in a citrus-infused syrup and garnished with a touch of cinnamon.",
    image: galaktobourekoImg,
    dietaryTags: ["vegetarian"]
  }
];
