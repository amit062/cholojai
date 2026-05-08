require('dotenv').config();
const mongoose = require('mongoose');
const Destination = require('./models/Destination');
const { pipeline } = require('stream/promises');
const fs = require('fs');
const path = require('path');

const WK = 'https://upload.wikimedia.org/wikipedia/commons/thumb';

// Ensure directories exist
const imagesDir = path.join(__dirname, '../frontend/public/images');
const destDir = path.join(imagesDir, 'destinations');
const spotsDir = path.join(imagesDir, 'spots');

[imagesDir, destDir, spotsDir].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Powerful scraper download function that acts like Google Image search
// Requests highly specific local photos from Flickr
const downloadImage = async (keywords, filepath) => {
  try {
    const searchTerms = encodeURIComponent(keywords.replace(/[' ]/g, ''));
    const url = `https://loremflickr.com/800/600/bangladesh,${searchTerms}`;
    
    // Some random delay to prevent hitting rate limits
    await new Promise(r => setTimeout(r, 600));

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'CholojaiBot/1.0 (contact@cholojai.com) NativeNodeFetcher',
      }
    });

    if (!res.ok) throw new Error(`Status ${res.status}`);

    const writer = fs.createWriteStream(filepath);
    await pipeline(res.body, writer);
    return true;

  } catch (error) {
    console.error(`  [X] Download failed for ${keywords} -> ${error.message}`);
    // Safe fallback to generic bangladesh travel photo
    try {
        const fbRes = await fetch('https://loremflickr.com/800/600/bangladesh,travel'); 
        const writer = fs.createWriteStream(filepath);
        await pipeline(fbRes.body, writer);
        return true;
    } catch {
        return false;
    }
  }
};

const getHotels = (destName) => [
  { name: `${destName} Backpackers Hostel`, price: "৳500", category: "Budget", bookingUrl: `https://www.agoda.com/search?text=${encodeURIComponent(destName)}` },
  { name: `Green Eco Lodge ${destName}`, price: "৳1,200", category: "Budget", bookingUrl: `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(destName)}` },
  { name: `Hotel City Center ${destName}`, price: "৳1,800", category: "Budget", bookingUrl: `https://www.agoda.com/search?text=${encodeURIComponent(destName)}` },
  { name: `Comfort Inn ${destName}`, price: "৳2,500", category: "Mid-Range", bookingUrl: `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(destName)}` },
  { name: `Silver Sands Hotel ${destName}`, price: "৳3,500", category: "Mid-Range", bookingUrl: `https://www.agoda.com/search?text=${encodeURIComponent(destName)}` },
  { name: `Grand Plaza ${destName}`, price: "৳4,500", category: "Mid-Range", bookingUrl: `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(destName)}` },
  { name: `The Emerald Resort ${destName}`, price: "৳6,000", category: "Premium", bookingUrl: `https://www.agoda.com/search?text=${encodeURIComponent(destName)}` },
  { name: `Royal Heritage ${destName}`, price: "৳8,500", category: "Premium", bookingUrl: `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(destName)}` },
  { name: `${destName} Paradise Resort`, price: "৳12,000", category: "Luxury", bookingUrl: `https://www.agoda.com/search?text=${encodeURIComponent(destName)}` },
  { name: `The President's Palace ${destName}`, price: "৳18,000", category: "Luxury", bookingUrl: `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(destName)}` },
];

const sampleDestinations = [
  {
    name: "Cox's Bazar", location: "Chattogram Division", division: "Chattogram",
    description: "Home to the world's longest natural sea beach — 120km of unbroken golden sand.",
    imageUrl: `${WK}/9/99/Coxs_bazar_sea_beach.jpg/1280px-Coxs_bazar_sea_beach.jpg`,
    rating: 4.8, category: "Beach", slug: "coxs-bazar",
    topSpots: [
      { name: "Inani Beach", description: "Famous for coral stones.", imageUrl: `${WK}/5/5e/Inani_beach%2C_Cox%27s_bazar.jpg/640px-Inani_beach%2C_Cox%27s_bazar.jpg`, tourGuide: "Take a CNG from Kolatoli Beach.", directions: "Head south on Marine Drive for 25km.", transportCost: "৳300-500 by CNG.", suppliesNeeded: "Bring sunscreen and drinking water." },
      { name: "Himchhari National Park", description: "Hilly forest reserve.", imageUrl: `${WK}/9/99/Coxs_bazar_sea_beach.jpg/640px-Coxs_bazar_sea_beach.jpg`, tourGuide: "5km south of town.", directions: "South on Marine Drive 5km.", transportCost: "৳100 by easybike.", suppliesNeeded: "Comfortable hiking shoes." },
      { name: "Marine Drive Road", description: "80km coastal highway.", imageUrl: `${WK}/9/99/Coxs_bazar_sea_beach.jpg/640px-Coxs_bazar_sea_beach.jpg`, tourGuide: "Rent a motorcycle.", directions: "Starts from Kolatoli circle.", transportCost: "Free to enter. Jeep hire ৳2000/day.", suppliesNeeded: "Snacks and camera." },
      { name: "Saint Martin Island", description: "Bangladesh's only coral island.", imageUrl: `${WK}/9/99/Coxs_bazar_sea_beach.jpg/640px-Coxs_bazar_sea_beach.jpg`, tourGuide: "Morning launch from Teknaf.", directions: "Bus to Teknaf, then 2.5hr ferry.", transportCost: "Ferry return ৳1200.", suppliesNeeded: "Seasickness pills, NID card." },
      { name: "Kolatoli Beach", description: "Main tourist hub.", imageUrl: `${WK}/9/99/Coxs_bazar_sea_beach.jpg/640px-Coxs_bazar_sea_beach.jpg`, tourGuide: "Central beach strip.", directions: "Walk west from hotels.", transportCost: "Free.", suppliesNeeded: "Nothing special." }
    ],
    hotelOptions: getHotels("Cox's Bazar"),
    restaurants: [
      { name: "Jhawbon Restaurant", specialty: "Shutki Curry", priceRange: "৳300–600", description: "Authentic Chittagonian sea-fish." },
      { name: "Poushee Restaurant", specialty: "Rupchanda Fry", priceRange: "৳400-800", description: "Famous for fresh sea fish fry." }
    ]
  },
  {
    name: "Sundarbans", location: "Khulna Division", division: "Khulna",
    description: "The world's largest mangrove forest, home to the Royal Bengal Tiger.",
    imageUrl: `${WK}/6/6a/Sundarban.jpg/1280px-Sundarban.jpg`,
    rating: 4.9, category: "Wildlife", slug: "sundarbans",
    topSpots: [
      { name: "Kotka Wildlife Sanctuary", description: "Prime tiger viewing.", imageUrl: `${WK}/6/6a/Sundarban.jpg/640px-Sundarban.jpg`, tourGuide: "Accessible by boat from Mongla.", directions: "12 hours by tourist cruiser from Khulna/Mongla.", transportCost: "Included in 3-day tour.", suppliesNeeded: "Binoculars, insect repellent, neutral clothing." },
      { name: "Hiron Point", description: "Dolphin sightings.", imageUrl: `${WK}/6/6a/Sundarban.jpg/640px-Sundarban.jpg`, tourGuide: "Book through authorised operator.", directions: "Deep south of the forest by boat.", transportCost: "Tour package only.", suppliesNeeded: "Motion sickness medicine." },
      { name: "Karamjal Forest Station", description: "Easy-access entry.", imageUrl: `${WK}/6/6a/Sundarban.jpg/640px-Sundarban.jpg`, tourGuide: "1.5 hours by launch from Mongla.", directions: "Take an engine boat from Mongla port.", transportCost: "৳1000 boat reserve.", suppliesNeeded: "Bottled water." },
      { name: "Dublar Char Island", description: "Migratory birds.", imageUrl: `${WK}/6/6a/Sundarban.jpg/640px-Sundarban.jpg`, tourGuide: "Access during Rash Mela season.", directions: "Southernmost islands.", transportCost: "Tour package.", suppliesNeeded: "Warm clothes in winter." },
      { name: "Kochikhali", description: "Tiger tracking trail.", imageUrl: `${WK}/6/6a/Sundarban.jpg/640px-Sundarban.jpg`, tourGuide: "Guided walks only.", directions: "East of Kotka by boat.", transportCost: "Tour package.", suppliesNeeded: "Leech socks, closed shoes." }
    ],
    hotelOptions: getHotels("Sundarbans"),
    restaurants: [
      { name: "Tiger Garden Diet", specialty: "Prawn Coconut Curry", priceRange: "৳400–800", description: "Khulna's celebrated king prawn curries." },
      { name: "Mongla Fishermans Dine", specialty: "Crab Masala", priceRange: "৳300-600", description: "Spicy crab caught locally." }
    ]
  },
  {
    name: "Bandarban", location: "Chittagong Hill Tracts", division: "Chattogram",
    description: "Cloud-kissed peaks and rich native cultural heritage.",
    imageUrl: `${WK}/4/40/Nilgiri%2C_Bandarban.jpg/1280px-Nilgiri%2C_Bandarban.jpg`,
    rating: 4.9, category: "Hill", slug: "bandarban",
    topSpots: [
      { name: "Nilgiri Peak", description: "Clouds float below your feet.", imageUrl: `${WK}/4/40/Nilgiri%2C_Bandarban.jpg/640px-Nilgiri%2C_Bandarban.jpg`, tourGuide: "Hire a jeep.", directions: "45km south of Bandarban town.", transportCost: "Jeep reserve ৳3500.", suppliesNeeded: "Warm clothes, NID card for army check." },
      { name: "Nafakhum Waterfall", description: "Niagara of Bangladesh.", imageUrl: `${WK}/4/40/Nilgiri%2C_Bandarban.jpg/640px-Nilgiri%2C_Bandarban.jpg`, tourGuide: "Trek from Thanchi.", directions: "Bus to Thanchi (4hrs), boat up Remakri (2hrs), walk 3hrs.", transportCost: "Bus ৳200, Boat ৳4000, Guide ৳1500/day.", suppliesNeeded: "Trekking shoes, dry bag, water purifiers, cash." },
      { name: "Boga Lake", description: "High-altitude crater lake.", imageUrl: `${WK}/4/40/Nilgiri%2C_Bandarban.jpg/640px-Nilgiri%2C_Bandarban.jpg`, tourGuide: "Trek from Ruma.", directions: "Bus to Ruma, then jeep to Boga.", transportCost: "Jeep from Ruma ৳2500.", suppliesNeeded: "Mosquito repellent, basic medical kit." },
      { name: "Shoilpropat", description: "Accessible waterfall.", imageUrl: `${WK}/4/40/Nilgiri%2C_Bandarban.jpg/640px-Nilgiri%2C_Bandarban.jpg`, tourGuide: "CNG from town.", directions: "4km on Thanchi road.", transportCost: "CNG ৳100.", suppliesNeeded: "Slippers, towel." },
      { name: "Golden Temple", description: "Largest Buddhist temple.", imageUrl: `${WK}/4/40/Nilgiri%2C_Bandarban.jpg/640px-Nilgiri%2C_Bandarban.jpg`, tourGuide: "2km from town.", directions: "Balaghata area.", transportCost: "Auto-rickshaw ৳50.", suppliesNeeded: "Modest clothes (no shorts)." }
    ],
    hotelOptions: getHotels("Bandarban"),
    restaurants: [
      { name: "Ruma Tribal Kitchen", specialty: "Bamboo Shoot Curry", priceRange: "৳150–300", description: "Authentic Marma cuisine." },
      { name: "Panciam Restaurant", specialty: "Smoked Pork", priceRange: "৳250–500", description: "Authentic indigenous preparations." }
    ]
  },
  {
    name: "Sylhet", location: "Sylhet Division", division: "Sylhet",
    description: "Emerald tea gardens, Sufi shrines, and ancient swamp forests.",
    imageUrl: `${WK}/e/ea/Ratargul_Swamp_Forest_02.jpg/1280px-Ratargul_Swamp_Forest_02.jpg`,
    rating: 4.9, category: "Nature", slug: "sylhet",
    topSpots: [
      { name: "Ratargul Swamp Forest", description: "Freshwater swamp forest.", imageUrl: `${WK}/e/ea/Ratargul_Swamp_Forest_02.jpg/640px-Ratargul_Swamp_Forest_02.jpg`, tourGuide: "CNG to Gowain Ghat.", directions: "25km northwest of Sylhet city.", transportCost: "CNG reserve ৳800, Boat hire ৳750.", suppliesNeeded: "Umbrella, bottled water." },
      { name: "Jaflong", description: "River valley on the India border.", imageUrl: `${WK}/e/ea/Ratargul_Swamp_Forest_02.jpg/640px-Ratargul_Swamp_Forest_02.jpg`, tourGuide: "Buses from Kumargaon.", directions: "60km north via Sylhet-Tamabil Highway.", transportCost: "Bus ৳100.", suppliesNeeded: "Sunscreen, change of clothes." },
      { name: "Bichanakandi", description: "Rock-strewn river.", imageUrl: `${WK}/e/ea/Ratargul_Swamp_Forest_02.jpg/640px-Ratargul_Swamp_Forest_02.jpg`, tourGuide: "Bus to Hadapur, then walk.", directions: "Near Rustumpur.", transportCost: "Boat from Hadapur ghat ৳1500.", suppliesNeeded: "Water shoes." },
      { name: "Lalakhal River", description: "Turquoise-blue water.", imageUrl: `${WK}/e/ea/Ratargul_Swamp_Forest_02.jpg/640px-Ratargul_Swamp_Forest_02.jpg`, tourGuide: "Motorboat from Sylhet.", directions: "35km from city.", transportCost: "Boat ride ৳1000/hr.", suppliesNeeded: "Snacks." },
      { name: "Shah Jalal Shrine", description: "Holiest Sufi shrine.", imageUrl: `${WK}/e/ea/Ratargul_Swamp_Forest_02.jpg/640px-Ratargul_Swamp_Forest_02.jpg`, tourGuide: "City centre.", directions: "Dargah Mahalla.", transportCost: "Rickshaw ৳20.", suppliesNeeded: "Modest attire." }
    ],
    hotelOptions: getHotels("Sylhet"),
    restaurants: [
      { name: "Panshe Restaurant", specialty: "Hilsa with Naga Chilli", priceRange: "৳400–800", description: "Sylhet's most famous restaurant." },
      { name: "Pach Bhai", specialty: "Beef Bhuna", priceRange: "৳300–600", description: "Legendary local dining." }
    ]
  },
  {
    name: "Srimangal", location: "Sylhet Division", division: "Sylhet",
    description: "The tea capital of Bangladesh with rolling green hills of tea estates.",
    imageUrl: `${WK}/4/4a/Tea_Garden_in_Sreemangal.jpg/1280px-Tea_Garden_in_Sreemangal.jpg`,
    rating: 4.7, category: "Nature", slug: "srimangal",
    topSpots: [
      { name: "Lawachara National Park", description: "Rare semi-evergreen rainforest.", imageUrl: `${WK}/4/4a/Tea_Garden_in_Sreemangal.jpg/640px-Tea_Garden_in_Sreemangal.jpg`, tourGuide: "Guides available at gate.", directions: "8km from town.", transportCost: "CNG ৳150.", suppliesNeeded: "Insect repellent, zoom lens." },
      { name: "Nilkantha Tea Cabin", description: "7-Layer Tea creator.", imageUrl: `${WK}/4/4a/Tea_Garden_in_Sreemangal.jpg/640px-Tea_Garden_in_Sreemangal.jpg`, tourGuide: "Town centre.", directions: "Ramnagar Manipuri Para.", transportCost: "Rickshaw ৳20.", suppliesNeeded: "Cash only." },
      { name: "Finlay Tea Estate", description: "Oldest tea garden.", imageUrl: `${WK}/4/4a/Tea_Garden_in_Sreemangal.jpg/640px-Tea_Garden_in_Sreemangal.jpg`, tourGuide: "Get permission at gate.", directions: "Bordering the town.", transportCost: "Walk or cycle.", suppliesNeeded: "Water." },
      { name: "Hail Haor", description: "Vast wetland for birding.", imageUrl: `${WK}/4/4a/Tea_Garden_in_Sreemangal.jpg/640px-Tea_Garden_in_Sreemangal.jpg`, tourGuide: "Motorboat in winter.", directions: "15km west.", transportCost: "Boat ৳500/hr.", suppliesNeeded: "Binoculars." },
      { name: "Madhabpur Lake", description: "Lake surrounded by tea.", imageUrl: `${WK}/4/4a/Tea_Garden_in_Sreemangal.jpg/640px-Tea_Garden_in_Sreemangal.jpg`, tourGuide: "Hire a CNG.", directions: "Past Kamalganj.", transportCost: "CNG reserve ৳600.", suppliesNeeded: "Sun hat." }
    ],
    hotelOptions: getHotels("Srimangal"),
    restaurants: [
      { name: "Nilkantha Tea", specialty: "7-Layer Tea", priceRange: "৳70–100", description: "The famous layered tea." },
      { name: "Maya Bonani", specialty: "Bamboo Chicken", priceRange: "৳200–400", description: "Rustic local favourite." }
    ]
  },
  {
    name: "Sajek Valley", location: "Rangamati District", division: "Chattogram",
    description: "The 'Queen of Hills' — clouds drift below mountain peaks at dawn.",
    imageUrl: `${WK}/a/ae/Sajek_Valley_Rangamati_%282%29.jpg/1280px-Sajek_Valley_Rangamati_%282%29.jpg`,
    rating: 4.8, category: "Hill", slug: "sajek-valley",
    topSpots: [
      { name: "Ruilui Para Viewpoint", description: "Watch cotton clouds at dawn.", imageUrl: `${WK}/a/ae/Sajek_Valley_Rangamati_%282%29.jpg/640px-Sajek_Valley_Rangamati_%282%29.jpg`, tourGuide: "Wake at 5:30am.", directions: "Center of the resorts.", transportCost: "Walking distance.", suppliesNeeded: "Jacket for morning chill." },
      { name: "Konglak Para", description: "Highest village in Sajek.", imageUrl: `${WK}/a/ae/Sajek_Valley_Rangamati_%282%29.jpg/640px-Sajek_Valley_Rangamati_%282%29.jpg`, tourGuide: "Walk from Ruilui.", directions: "3km uphill trek.", transportCost: "Free.", suppliesNeeded: "Water, walking stick." },
      { name: "Sajek Helipad", description: "360-degree sunset views.", imageUrl: `${WK}/a/ae/Sajek_Valley_Rangamati_%282%29.jpg/640px-Sajek_Valley_Rangamati_%282%29.jpg`, tourGuide: "Best at sunset.", directions: "10-min walk from center.", transportCost: "Free.", suppliesNeeded: "Camera." },
      { name: "Hazachora Waterfall", description: "En route to Sajek.", imageUrl: `${WK}/a/ae/Sajek_Valley_Rangamati_%282%29.jpg/640px-Sajek_Valley_Rangamati_%282%29.jpg`, tourGuide: "Stop during military escort.", directions: "Khagrachori-Sajek road.", transportCost: "Included in jeep fare.", suppliesNeeded: "Towels." },
      { name: "Alutila Cave", description: "Natural subterranean cave.", imageUrl: `${WK}/a/ae/Sajek_Valley_Rangamati_%282%29.jpg/640px-Sajek_Valley_Rangamati_%282%29.jpg`, tourGuide: "Buy a mashal (torch).", directions: "In Khagrachori before ascending to Sajek.", transportCost: "Entry ৳20.", suppliesNeeded: "Fire torch (available at gate), anti-slip shoes." }
    ],
    hotelOptions: getHotels("Sajek Valley"),
    restaurants: [
      { name: "Ruilui Kitchen", specialty: "Bamboo Rice", priceRange: "৳200–400", description: "Tripura smoked meats." },
      { name: "Meghpunji Dine", specialty: "Organic Highland Food", priceRange: "৳400–700", description: "Farm to table." }
    ]
  },
  {
    name: "Rangamati", location: "Chittagong Hill Tracts", division: "Chattogram",
    description: "The lake city — turquoise Kaptai Lake threading between emerald hills.",
    imageUrl: `${WK}/b/b0/Kaptai_Lake.jpg/1280px-Kaptai_Lake.jpg`,
    rating: 4.7, category: "Nature", slug: "rangamati",
    topSpots: [
      { name: "Kaptai Lake", description: "Bangladesh's largest lake.", imageUrl: `${WK}/b/b0/Kaptai_Lake.jpg/640px-Kaptai_Lake.jpg`, tourGuide: "Hire a speedboat.", directions: "Reserve Market ghat.", transportCost: "Boat ৳1500-3000/day.", suppliesNeeded: "Sun hat, water." },
      { name: "Shuvolong Waterfall", description: "Boat-access only waterfall.", imageUrl: `${WK}/b/b0/Kaptai_Lake.jpg/640px-Kaptai_Lake.jpg`, tourGuide: "2hr boat ride.", directions: "Across Kaptai Lake.", transportCost: "Included in boat reserve.", suppliesNeeded: "Waterproof bag." },
      { name: "Rajban Bihar", description: "Chakma Buddhist monastery.", imageUrl: `${WK}/b/b0/Kaptai_Lake.jpg/640px-Kaptai_Lake.jpg`, tourGuide: "Monks welcome visitors.", directions: "Town center.", transportCost: "Auto ৳30.", suppliesNeeded: "Modest clothes." },
      { name: "Hanging Bridge", description: "Famous suspension bridge.", imageUrl: `${WK}/b/b0/Kaptai_Lake.jpg/640px-Kaptai_Lake.jpg`, tourGuide: "Visit at sunset.", directions: "Parjatan complex.", transportCost: "Auto ৳50.", suppliesNeeded: "Camera." },
      { name: "Polwel Park", description: "Lakeside eco-park.", imageUrl: `${WK}/b/b0/Kaptai_Lake.jpg/640px-Kaptai_Lake.jpg`, tourGuide: "Run by police.", directions: "Kaptai Road.", transportCost: "Entry ৳30.", suppliesNeeded: "Picnic items." }
    ],
    hotelOptions: getHotels("Rangamati"),
    restaurants: [
      { name: "Hanging Bridge Cafe", specialty: "Lake Fish", priceRange: "৳200–500", description: "Fresh caught kaptai fish." },
      { name: "Chakma Kitchen", specialty: "Bamboo Shoot & Hilsa", priceRange: "৳150–300", description: "Authentic Chakma cuisine." }
    ]
  },
  {
    name: "Kuakata", location: "Barisal Division", division: "Barisal",
    description: "The unique beach where you can witness both sunrise and sunset over the ocean.",
    imageUrl: `${WK}/1/1f/Kuakata_sea_beach.jpg/1280px-Kuakata_sea_beach.jpg`,
    rating: 4.6, category: "Beach", slug: "kuakata",
    topSpots: [
      { name: "Kuakata Main Beach", description: "East for sunrise, West for sunset.", imageUrl: `${WK}/1/1f/Kuakata_sea_beach.jpg/640px-Kuakata_sea_beach.jpg`, tourGuide: "Rent a bike to travel across.", directions: "Town center out to the sea.", transportCost: "Motorcycle taxi ৳100/point.", suppliesNeeded: "Sunglasses." },
      { name: "Fatrar Char", description: "Miniature Sundarbans mangrove.", imageUrl: `${WK}/1/1f/Kuakata_sea_beach.jpg/640px-Kuakata_sea_beach.jpg`, tourGuide: "Hire a trawler.", directions: "Across the estuary.", transportCost: "Trawler ৳800-1200.", suppliesNeeded: "Water, snacks." },
      { name: "Rakhaine Village", description: "Buddhist tribal weavers.", imageUrl: `${WK}/1/1f/Kuakata_sea_beach.jpg/640px-Kuakata_sea_beach.jpg`, tourGuide: "Weavers work in mornings.", directions: "5 mins from main beach.", transportCost: "Walking distance.", suppliesNeeded: "Cash for purchasing weaving." },
      { name: "Crab Island (Lal Kakrar Char)", description: "Swarm of red crabs at dawn.", imageUrl: `${WK}/1/1f/Kuakata_sea_beach.jpg/640px-Kuakata_sea_beach.jpg`, tourGuide: "Go at low tide.", directions: "Eastern end of beach.", transportCost: "Bike ৳200.", suppliesNeeded: "Do NOT disturb the crabs." },
      { name: "Gangamati Reserved Forest", description: "Evergreen mangrove patch.", imageUrl: `${WK}/1/1f/Kuakata_sea_beach.jpg/640px-Kuakata_sea_beach.jpg`, tourGuide: "Good for sunrise.", directions: "Far east of beach.", transportCost: "Bike ৳300.", suppliesNeeded: "Insect repellent." }
    ],
    hotelOptions: getHotels("Kuakata"),
    restaurants: [
      { name: "Beach Crab House", specialty: "Live Sea Crab", priceRange: "৳300–800", description: "Grilled fresh on the beach." },
      { name: "Rakhaine Women's Kitchen", specialty: "Smoked Fish", priceRange: "৳150–300", description: "Authentic Rakhaine tribal." }
    ]
  },
  {
    name: "Ahsan Manzil", location: "Old Dhaka", division: "Dhaka",
    description: "The magnificent Pink Palace of Dhaka, residence of the Nawabs.",
    imageUrl: `${WK}/4/4b/Ahsan_Manzil.jpg/1280px-Ahsan_Manzil.jpg`,
    rating: 4.5, category: "Historical", slug: "ahsan-manzil",
    topSpots: [
      { name: "Ahsan Manzil Museum", description: "23 rooms of Nawabi artefacts.", imageUrl: `${WK}/4/4b/Ahsan_Manzil.jpg/640px-Ahsan_Manzil.jpg`, tourGuide: "Entry 20 BDT.", directions: "Islampur, Old Dhaka.", transportCost: "Rickshaw from Sadarghat ৳30.", suppliesNeeded: "Bottled water." },
      { name: "Buriganga River Ghat", description: "Ancient river boats.", imageUrl: `${WK}/4/4b/Ahsan_Manzil.jpg/640px-Ahsan_Manzil.jpg`, tourGuide: "Rowboat at sunset.", directions: "Directly behind the palace.", transportCost: "Boat ride ৳100.", suppliesNeeded: "Camera." },
      { name: "Shankhari Bazaar", description: "Hindu conch-shell artisans.", imageUrl: `${WK}/4/4b/Ahsan_Manzil.jpg/640px-Ahsan_Manzil.jpg`, tourGuide: "Walk north from palace.", directions: "10 min walk.", transportCost: "Free.", suppliesNeeded: "Patience for crowds." },
      { name: "Sadarghat Boat Terminal", description: "Bustling river port.", imageUrl: `${WK}/4/4b/Ahsan_Manzil.jpg/640px-Ahsan_Manzil.jpg`, tourGuide: "Watch giant river ferries.", directions: "5 min walk east.", transportCost: "Terminal entry ৳10.", suppliesNeeded: "Secure your bags against pickpockets." },
      { name: "Armenian Church", description: "18th century history.", imageUrl: `${WK}/4/4b/Ahsan_Manzil.jpg/640px-Ahsan_Manzil.jpg`, tourGuide: "Quiet sanctuary.", directions: "Armanitola.", transportCost: "Rickshaw ৳50.", suppliesNeeded: "Respectful demeanor." }
    ],
    hotelOptions: getHotels("Old Dhaka"),
    restaurants: [
      { name: "Hajir Biryani", specialty: "Old Dhaka Kacchi", priceRange: "৳300–600", description: "Legendary 150-year-old biryani shop." },
      { name: "Star Hotel", specialty: "Bakarkhani & Tehari", priceRange: "৳150–350", description: "Mughal-style traditions." }
    ]
  },
  {
    name: "Bagerhat Mosque City", location: "Khulna Division", division: "Khulna",
    description: "A UNESCO Heritage medieval mosque city built by Khan Jahan Ali.",
    imageUrl: `${WK}/f/fd/Sath_gambuj_masjid.jpg/1280px-Sath_gambuj_masjid.jpg`,
    rating: 4.7, category: "Historical", slug: "bagerhat",
    topSpots: [
      { name: "Sixty Dome Mosque", description: "15th century terracotta masterpiece.", imageUrl: `${WK}/f/fd/Sath_gambuj_masjid.jpg/640px-Sath_gambuj_masjid.jpg`, tourGuide: "Best light late afternoon.", directions: "Bagerhat town edge.", transportCost: "Bus from Khulna ৳80.", suppliesNeeded: "Modest clothes." },
      { name: "Khan Jahan Ali Tomb", description: "Holy mausoleum with crocodiles.", imageUrl: `${WK}/f/fd/Sath_gambuj_masjid.jpg/640px-Sath_gambuj_masjid.jpg`, tourGuide: "Feed the crocodiles.", directions: "2km from mosque.", transportCost: "Rickshaw ৳20.", suppliesNeeded: "Buy meat at gate if you wish to feed crocs." },
      { name: "Nine Dome Mosque", description: "Smaller ornate mosque.", imageUrl: `${WK}/f/fd/Sath_gambuj_masjid.jpg/640px-Sath_gambuj_masjid.jpg`, tourGuide: "Walk west of Thakur Dighi.", directions: "Near the tomb.", transportCost: "Walk.", suppliesNeeded: "Water." },
      { name: "Zinda Pir Mosque", description: "Single domed beauty.", imageUrl: `${WK}/f/fd/Sath_gambuj_masjid.jpg/640px-Sath_gambuj_masjid.jpg`, tourGuide: "Part of the archaeological complex.", directions: "Near Sixty Dome.", transportCost: "Walk.", suppliesNeeded: "None." },
      { name: "Ghora Dighi", description: "Massive ancient water tank.", imageUrl: `${WK}/f/fd/Sath_gambuj_masjid.jpg/640px-Sath_gambuj_masjid.jpg`, tourGuide: "Relax by the water.", directions: "Behind Sixty Dome.", transportCost: "Walk.", suppliesNeeded: "None." }
    ],
    hotelOptions: getHotels("Khulna"),
    restaurants: [
      { name: "Bagerhat Bazaar Diner", specialty: "Chingri Malaikari", priceRange: "৳300–600", description: "Sundarbans delta prawns." },
      { name: "Abbas Hotel", specialty: "Chui Jhal", priceRange: "৳250-500", description: "The most famous Chui Jhal joint in Khulna." }
    ]
  },
  {
    name: "Paharpur Vihara", location: "Rajshahi Division", division: "Rajshahi",
    description: "Ruins of the 8th century Somapura Mahavihara, once the largest Buddhist monastery south of the Himalayas.",
    imageUrl: `${WK}/1/10/Paharpur_Buddhist_Monastery.jpg/1280px-Paharpur_Buddhist_Monastery.jpg`,
    rating: 4.6, category: "Historical", slug: "paharpur",
    topSpots: [
      { name: "Somapura Mahavihara", description: "177 monastic cells around a massive temple.", imageUrl: `${WK}/1/10/Paharpur_Buddhist_Monastery.jpg/640px-Paharpur_Buddhist_Monastery.jpg`, tourGuide: "Hire on-site guide.", directions: "10km from Joypurhat.", transportCost: "Auto from Joypurhat ৳150.", suppliesNeeded: "Sun umbrella, drinking water (fully exposed)." },
      { name: "Archaeological Museum", description: "Terracotta plaques and stone art.", imageUrl: `${WK}/1/10/Paharpur_Buddhist_Monastery.jpg/640px-Paharpur_Buddhist_Monastery.jpg`, tourGuide: "Entry included.", directions: "Site entrance.", transportCost: "Walk.", suppliesNeeded: "None." },
      { name: "Satyapir Vita", description: "Tara temple ruins.", imageUrl: `${WK}/1/10/Paharpur_Buddhist_Monastery.jpg/640px-Paharpur_Buddhist_Monastery.jpg`, tourGuide: "Quiet exploration.", directions: "East of main Vihara.", transportCost: "Walk.", suppliesNeeded: "None." },
      { name: "Mahasthangarh", description: "Ancient citadel (300 BCE).", imageUrl: `${WK}/1/10/Paharpur_Buddhist_Monastery.jpg/640px-Paharpur_Buddhist_Monastery.jpg`, tourGuide: "Combine trip.", directions: "1 hr away in Bogura.", transportCost: "Bus ৳100.", suppliesNeeded: "Walking shoes." },
      { name: "Varendra Museum", description: "Oldest museum in Bangladesh.", imageUrl: `${WK}/1/10/Paharpur_Buddhist_Monastery.jpg/640px-Paharpur_Buddhist_Monastery.jpg`, tourGuide: "See black stone Vishnu idols.", directions: "Rajshahi City center.", transportCost: "Bus to Rajshahi ৳200.", suppliesNeeded: "None." }
    ],
    hotelOptions: getHotels("Rajshahi"),
    restaurants: [
      { name: "Nawab Restaurant", specialty: "Mango Lassi", priceRange: "৳200–500", description: "World's finest mango lassi." },
      { name: "Rahmaniya Bogura", specialty: "Bogurar Doi", priceRange: "৳100", description: "Famous sweet curd." }
    ]
  },
  {
    name: "Tanguar Haor", location: "Sunamganj, Division", division: "Sylhet",
    description: "A vast inland sea in monsoon, shimmering mirror of sky in winter.",
    imageUrl: `${WK}/5/59/Tanguar_Haor.jpg/1280px-Tanguar_Haor.jpg`,
    rating: 4.8, category: "Wildlife", slug: "tanguar-haor",
    topSpots: [
      { name: "Haor Watchtower", description: "Watch millions of birds.", imageUrl: `${WK}/5/59/Tanguar_Haor.jpg/640px-Tanguar_Haor.jpg`, tourGuide: "Best Nov-Feb.", directions: "Center of the Haor.", transportCost: "Boat reserve ৳3000-5000/day.", suppliesNeeded: "Binoculars, telephoto lens." },
      { name: "Houseboat Sleep", description: "Sleep on a wooden nauk.", imageUrl: `${WK}/5/59/Tanguar_Haor.jpg/640px-Tanguar_Haor.jpg`, tourGuide: "Book in advance.", directions: "Board from Tahirpur.", transportCost: "Package ৳4000/person.", suppliesNeeded: "Mosquito net, power bank." },
      { name: "Niladri Lake", description: "Kashmir of Bangladesh.", imageUrl: `${WK}/5/59/Tanguar_Haor.jpg/640px-Tanguar_Haor.jpg`, tourGuide: "Abandoned limestone quarry.", directions: "Tekerghat near India border.", transportCost: "Bike from Tahirpur ৳150.", suppliesNeeded: "Sunscreen." },
      { name: "Jadukata River", description: "Magic river with white sand.", imageUrl: `${WK}/5/59/Tanguar_Haor.jpg/640px-Tanguar_Haor.jpg`, tourGuide: "Crystal clear water.", directions: "Near Barek Tila.", transportCost: "Bike ৳100.", suppliesNeeded: "Swimwear." },
      { name: "Barek Tila", description: "Hillock overlooking the river.", imageUrl: `${WK}/5/59/Tanguar_Haor.jpg/640px-Tanguar_Haor.jpg`, tourGuide: "Aboriginal village.", directions: "Across Jadukata river.", transportCost: "Ferry ৳10.", suppliesNeeded: "Water." }
    ],
    hotelOptions: getHotels("Sunamganj"),
    restaurants: [
      { name: "Houseboat Kitchen", specialty: "Fresh Haor Fish", priceRange: "৳300–600", description: "Caught and cooked on boat." },
      { name: "Sunamganj Pansi", specialty: "Haor Duck Curry", priceRange: "৳400-600", description: "Famous local winter duck." }
    ]
  },
  {
    name: "Kantajew Temple", location: "Dinajpur, Rangpur Division", division: "Rangpur",
    description: "The finest terracotta temple in Bangladesh — 15,000 carved panels.",
    imageUrl: `${WK}/3/33/Kantanagar_Temple-Dinajpur.jpg/1280px-Kantanagar_Temple-Dinajpur.jpg`,
    rating: 4.6, category: "Historical", slug: "kantajew-temple",
    topSpots: [
      { name: "Main Temple", description: "Comic strip carved in terracotta.", imageUrl: `${WK}/3/33/Kantanagar_Temple-Dinajpur.jpg/640px-Kantanagar_Temple-Dinajpur.jpg`, tourGuide: "Read the Ramayana panels.", directions: "12km from Dinajpur city.", transportCost: "Auto ৳150.", suppliesNeeded: "Water." },
      { name: "Dinajpur Rajbari", description: "Ruins of the King's Palace.", imageUrl: `${WK}/3/33/Kantanagar_Temple-Dinajpur.jpg/640px-Kantanagar_Temple-Dinajpur.jpg`, tourGuide: "Explore the ancient ponds.", directions: "Dinajpur town center.", transportCost: "Rickshaw ৳30.", suppliesNeeded: "None." },
      { name: "Nayabad Mosque", description: "Mughal era mosque.", imageUrl: `${WK}/3/33/Kantanagar_Temple-Dinajpur.jpg/640px-Kantanagar_Temple-Dinajpur.jpg`, tourGuide: "Built by Kantajew temple workers.", directions: "1km from Kantajew.", transportCost: "Walk.", suppliesNeeded: "None." },
      { name: "Ramsagar National Park", description: "Largest man-made lake.", imageUrl: `${WK}/3/33/Kantanagar_Temple-Dinajpur.jpg/640px-Kantanagar_Temple-Dinajpur.jpg`, tourGuide: "Dug in 18th century.", directions: "8km south of Dinajpur.", transportCost: "Auto ৳100.", suppliesNeeded: "Picnic snacks." },
      { name: "Swapnapuri", description: "Amusement eco-park.", imageUrl: `${WK}/3/33/Kantanagar_Temple-Dinajpur.jpg/640px-Kantanagar_Temple-Dinajpur.jpg`, tourGuide: "Family destination.", directions: "50km from town.", transportCost: "Bus ৳80.", suppliesNeeded: "Full day free." }
    ],
    hotelOptions: getHotels("Dinajpur"),
    restaurants: [
      { name: "Famous Hotel", specialty: "Lichi Juice", priceRange: "৳150–300", description: "Best mazafati lychees." },
      { name: "Rabbani Hotel", specialty: "Beef Vuna", priceRange: "৳200-400", description: "Legendary town diner." }
    ]
  },
  {
    name: "Lalbagh Fort", location: "Old Dhaka", division: "Dhaka",
    description: "A 17th century Mughal jewel with the marble Pari Bibi mausoleum.",
    imageUrl: `${WK}/6/6c/Lalbagh_Fort.jpg/1280px-Lalbagh_Fort.jpg`,
    rating: 4.4, category: "Historical", slug: "lalbagh-fort",
    topSpots: [
      { name: "Pari Bibi Mausoleum", description: "Marble-inlaid tomb.", imageUrl: `${WK}/6/6c/Lalbagh_Fort.jpg/640px-Lalbagh_Fort.jpg`, tourGuide: "Evening lighting is best.", directions: "Center of the fort.", transportCost: "Entry ৳20.", suppliesNeeded: "Water." },
      { name: "Diwan-i-Aam", description: "Mughal museum.", imageUrl: `${WK}/6/6c/Lalbagh_Fort.jpg/640px-Lalbagh_Fort.jpg`, tourGuide: "View ancient weaponry.", directions: "Right of entrance.", transportCost: "Included in entry.", suppliesNeeded: "None." },
      { name: "Fort Mosque", description: "Three domed mosque.", imageUrl: `${WK}/6/6c/Lalbagh_Fort.jpg/640px-Lalbagh_Fort.jpg`, tourGuide: "Still in use today.", directions: "West side.", transportCost: "Included.", suppliesNeeded: "Modest clothes." },
      { name: "Dhakeshwari Temple", description: "National Hindu Temple.", imageUrl: `${WK}/6/6c/Lalbagh_Fort.jpg/640px-Lalbagh_Fort.jpg`, tourGuide: "12th century origins.", directions: "1km from fort.", transportCost: "Rickshaw ৳30.", suppliesNeeded: "Flowers for offering (optional)." },
      { name: "Hussaini Dalan", description: "Shia mosque.", imageUrl: `${WK}/6/6c/Lalbagh_Fort.jpg/640px-Lalbagh_Fort.jpg`, tourGuide: "Historical architecture.", directions: "Near Bakshibazar.", transportCost: "Rickshaw ৳40.", suppliesNeeded: "None." }
    ],
    hotelOptions: getHotels("Dhaka"),
    restaurants: [
      { name: "Nanna Mia's Biryani", specialty: "Kacchi Biryani", priceRange: "৳250–500", description: "Authentic dum biryani." },
      { name: "Royal Restaurant", specialty: "Pistachio Badam Sherbet", priceRange: "৳150-300", description: "Famous nutty drink." }
    ]
  },
  {
    name: "Patenga Beach", location: "Chattogram Division", division: "Chattogram",
    description: "Watch massive container ships navigate the Karnaphuli river at sunset.",
    imageUrl: `${WK}/c/c3/Patenga_sea_beach%2C_chittagong%2C_Bangladesh.jpg/1280px-Patenga_sea_beach%2C_chittagong%2C_Bangladesh.jpg`,
    rating: 4.3, category: "Beach", slug: "patenga-beach",
    topSpots: [
      { name: "Patenga Main Beach", description: "City beach and port view.", imageUrl: `${WK}/c/c3/Patenga_sea_beach%2C_chittagong%2C_Bangladesh.jpg/640px-Patenga_sea_beach%2C_chittagong%2C_Bangladesh.jpg`, tourGuide: "Best at sunset.", directions: "14km from Chittagong center.", transportCost: "Bus ৳40, CNG ৳250.", suppliesNeeded: "None." },
      { name: "Foy's Lake", description: "Mini Cox's Bazar amusement.", imageUrl: `${WK}/c/c3/Patenga_sea_beach%2C_chittagong%2C_Bangladesh.jpg/640px-Patenga_sea_beach%2C_chittagong%2C_Bangladesh.jpg`, tourGuide: "Rent a rowboat.", directions: "Khulshi.", transportCost: "Auto ৳150.", suppliesNeeded: "Entry fee ৳50." },
      { name: "Ethnological Museum", description: "Tribal history of BD.", imageUrl: `${WK}/c/c3/Patenga_sea_beach%2C_chittagong%2C_Bangladesh.jpg/640px-Patenga_sea_beach%2C_chittagong%2C_Bangladesh.jpg`, tourGuide: "Fascinating dioramas.", directions: "Agrabad.", transportCost: "Auto ৳100.", suppliesNeeded: "None." },
      { name: "Chandranath Hill", description: "Trek to hilltop Shiva temple.", imageUrl: `${WK}/c/c3/Patenga_sea_beach%2C_chittagong%2C_Bangladesh.jpg/640px-Patenga_sea_beach%2C_chittagong%2C_Bangladesh.jpg`, tourGuide: "2 hr steep hike.", directions: "Sitakunda (40km out).", transportCost: "Bus ৳80.", suppliesNeeded: "Hiking shoes, lots of water." },
      { name: "Bhatiari Lake", description: "Sunset over hills and lakes.", imageUrl: `${WK}/c/c3/Patenga_sea_beach%2C_chittagong%2C_Bangladesh.jpg/640px-Patenga_sea_beach%2C_chittagong%2C_Bangladesh.jpg`, tourGuide: "Army maintained area.", directions: "Near Cantonment.", transportCost: "Auto ৳200.", suppliesNeeded: "Camera." }
    ],
    hotelOptions: getHotels("Chittagong"),
    restaurants: [
      { name: "Mezban Restaurant", specialty: "Mezban Beef", priceRange: "৳200–500", description: "Legendary slow-cooked beef." },
      { name: "Chittagong Port Teahouse", specialty: "Sea Prawn", priceRange: "৳400–900", description: "Fresh from the trawlers." }
    ]
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB Atlas');
    
    // Convert all image URLs by downloading them and pointing to the local filepath 
    // INSIDE the array before seeding.
    for (let i = 0; i < sampleDestinations.length; i++) {
        const dest = sampleDestinations[i];
        console.log(`Processing: ${dest.name}...`);
        
        // 1. Download Destination Image
        const mainFilename = `${dest.slug}.jpg`;
        const mainFilepath = path.join(destDir, mainFilename);
        const s1 = await downloadImage(dest.name, mainFilepath);
        if (s1) {
            dest.imageUrl = `/images/destinations/${mainFilename}`;
            console.log(`  -> Handled Main Image for ${dest.name}`);
        }

        // 2. Download Spot Images
        for (let j = 0; j < dest.topSpots.length; j++) {
            const spot = dest.topSpots[j];
            const spotFilename = `${dest.slug}-spot-${j+1}.jpg`;
            const spotFilepath = path.join(spotsDir, spotFilename);
            const s2 = await downloadImage(spot.name, spotFilepath);
            if (s2) {
                spot.imageUrl = `/images/spots/${spotFilename}`;
                console.log(`  -> Handled Spot ${j+1}: ${spot.name}`);
            }
        }
    }

    await Destination.deleteMany({});
    console.log('🧹 Wiped old data...');
    
    // Insert new data
    await Destination.insertMany(sampleDestinations);
    console.log('🌱 SUCCESS: Successfully seeded database with local image paths!');
    
    process.exit();
  } catch (error) {
    console.error('❌ Migration Error:', error);
    process.exit(1);
  }
};

seedDB();
