const express = require('express');
const router = express.Router();
const Destination = require('../models/Destination');
const mongoose = require('mongoose');
const { protect, admin } = require('../middleware/authMiddleware');

const WK = 'https://upload.wikimedia.org/wikipedia/commons/thumb';

const fallbackDestinations = [
  {
    _id: "1", name: "Cox's Bazar", location: "Chattogram Division", division: "Chattogram",
    description: "Home to the world's longest natural sea beach — 120km of unbroken golden sand meeting the Bay of Bengal, with spectacular sunsets and a vibrant local fishing culture.",
    imageUrl: `${WK}/9/99/Coxs_bazar_sea_beach.jpg/1280px-Coxs_bazar_sea_beach.jpg`,
    rating: 4.8, category: "Beach", slug: "coxs-bazar",
    topSpots: [
      { name: "Inani Beach", description: "Famous for unique natural coral stones scattered across the shore, best at low tide. A peaceful alternative to the crowded main beach.", imageUrl: `${WK}/5/5e/Inani_beach%2C_Cox%27s_bazar.jpg/640px-Inani_beach%2C_Cox%27s_bazar.jpg`, tourGuide: "Take a CNG from Kolatoli Beach Road, 20km south. Best at sunrise." },
      { name: "Himchhari National Park", description: "A hilly forest reserve with a beautiful waterfall and panoramic sea views. The waterfall is most powerful right after the monsoon season.", imageUrl: `${WK}/9/99/Coxs_bazar_sea_beach.jpg/640px-Coxs_bazar_sea_beach.jpg`, tourGuide: "5km south of Cox's Bazar town via Marine Drive. Entry fee 20 BDT." },
      { name: "Marine Drive Road", description: "The world's longest marine drive — 80km of coastal highway running parallel to the beach all the way to Teknaf, with ocean views at every turn.", imageUrl: `${WK}/9/99/Coxs_bazar_sea_beach.jpg/640px-Coxs_bazar_sea_beach.jpg`, tourGuide: "Rent a motorcycle or hire a CNG for the full scenic southern route." },
      { name: "Saint Martin Island", description: "Bangladesh's only coral island — crystal clear water, coconut groves, and some of the best snorkelling in the Bay of Bengal.", imageUrl: `${WK}/9/99/Coxs_bazar_sea_beach.jpg/640px-Coxs_bazar_sea_beach.jpg`, tourGuide: "Take the morning launch from Teknaf (2.5hrs). Overnight stays available on the island." },
      { name: "Kolatoli Beach", description: "The main tourist hub with sunset views over the bay, beach horses, colourful fishing boats, and evening seafood stalls lighting up the shore.", imageUrl: `${WK}/9/99/Coxs_bazar_sea_beach.jpg/640px-Coxs_bazar_sea_beach.jpg`, tourGuide: "The central beach strip. Most hotels within walking distance." }
    ],
    hotelOptions: [
      { name: "Sayeman Beach Resort", price: "৳7,000", category: "Luxury", bookingUrl: "https://www.sayeman.com" },
      { name: "Long Beach Hotel", price: "৳5,500", category: "Premium", bookingUrl: "https://www.longbeachhotel.com.bd" },
      { name: "Sea Gull Hotel", price: "৳4,200", category: "Mid-Range", bookingUrl: "https://www.seagullhotelbd.com" },
      { name: "Hotel Lakeshore", price: "৳6,800", category: "Luxury", bookingUrl: "https://www.lakeshorehotel.com.bd" },
      { name: "Ocean Paradise Hotel", price: "৳3,500", category: "Budget", bookingUrl: "https://www.booking.com/hotel/bd/ocean-paradise-coxs-bazar.html" }
    ],
    restaurants: [
      { name: "Jhawbon Restaurant", specialty: "Shutki (Dried Fish) Curry", priceRange: "৳300–600/person", description: "Authentic Chittagonian sea-fish preparations. The shutki bhuna here is legendary among locals." },
      { name: "Ocean Restaurant", specialty: "Grilled Lobster & Tiger Prawn", priceRange: "৳500–1200/person", description: "Fresh seafood platters with lobster, crab, and prawn sourced daily from local fishermen at dawn." },
      { name: "Shef Restaurant", specialty: "Mezban Beef & Rice", priceRange: "৳200–400/person", description: "Traditional Chittagonian mezban-style slow-cooked beef with fragrant rice — a community-feast staple." },
      { name: "Padma Restaurant", specialty: "Fresh Fish & Dal", priceRange: "৳150–300/person", description: "Beloved local spot for no-frills authentic Bangladeshi fish-and-rice meals at honest prices." }
    ]
  },
  {
    _id: "2", name: "Sundarbans", location: "Khulna Division", division: "Khulna",
    description: "The world's largest mangrove forest and UNESCO Heritage Site — a labyrinth of tidal creeks and ancient trees, home to the iconic Royal Bengal Tiger.",
    imageUrl: `${WK}/6/6a/Sundarban.jpg/1280px-Sundarban.jpg`,
    rating: 4.9, category: "Wildlife", slug: "sundarbans",
    topSpots: [
      { name: "Kotka Wildlife Sanctuary", description: "Prime tiger and wildlife viewing. Spotted deer, crocodiles, and water monitors frequent the beach edges at dusk — unforgettable.", imageUrl: `${WK}/6/6a/Sundarban.jpg/640px-Sundarban.jpg`, tourGuide: "Only accessible by boat from Mongla. Requires a forest department entry permit." },
      { name: "Hiron Point (Nilkamal)", description: "The southernmost accessible point for tourists — famous for dolphin sightings and Royal Bengal Tigers coming to drink at sunset.", imageUrl: `${WK}/6/6a/Sundarban.jpg/640px-Sundarban.jpg`, tourGuide: "3-day tour packages from Khulna are most popular. Book through an authorised operator." },
      { name: "Karamjal Forest Station", description: "Easy-access entry with a wildlife rescue centre — home to deer, crocodiles, and exotic birds. Perfect as a first Sundarbans experience.", imageUrl: `${WK}/6/6a/Sundarban.jpg/640px-Sundarban.jpg`, tourGuide: "1.5 hours by launch from Mongla Port. Day-trips fully possible." },
      { name: "Dublar Char Island", description: "A seasonal island famous for the annual Rash Mela Hindu festival and vast colonies of migratory birds arriving each winter.", imageUrl: `${WK}/6/6a/Sundarban.jpg/640px-Sundarban.jpg`, tourGuide: "Only accessible during Rash Mela season (Nov–Dec) via approved boat tours." }
    ],
    hotelOptions: [
      { name: "Hotel Tiger Garden International", price: "৳4,000", category: "Mid-Range", bookingUrl: "https://www.booking.com/hotel/bd/tiger-garden-international.html" },
      { name: "Khulna City Inn", price: "৳2,500", category: "Budget", bookingUrl: "https://www.booking.com/hotel/bd/khulna-city.html" },
      { name: "Mongla Eco Resort", price: "৳3,500", category: "Mid-Range", bookingUrl: "https://www.booking.com/hotel/bd/mongla.html" }
    ],
    restaurants: [
      { name: "Tiger Garden Restaurant", specialty: "Chingri Malaikari (Prawn Coconut Curry)", priceRange: "৳400–800/person", description: "Khulna's celebrated restaurant for traditional king prawn curries slow-cooked in rich coconut milk." },
      { name: "Mongla Bazaar Tea Stalls", specialty: "Sundarbans Honey Tea", priceRange: "৳20–50/person", description: "Tea sweetened with pure Sundarbans wild honey — a completely unique, unforgettable flavour." },
      { name: "Khulna Riverside Mess", specialty: "Bhetki Fish Fry", priceRange: "৳200–400/person", description: "No-frills riverside canteen serving some of the freshest Bhetki fish in all of south-west Bangladesh." }
    ]
  },
  {
    _id: "3", name: "Bandarban", location: "Chittagong Hill Tracts", division: "Chattogram",
    description: "The roof of Bangladesh — cloud-kissed peaks soaring above 3,000 feet, roaring waterfalls, and the rich living culture of 11 indigenous hill communities.",
    imageUrl: `${WK}/4/40/Nilgiri%2C_Bandarban.jpg/1280px-Nilgiri%2C_Bandarban.jpg`,
    rating: 4.9, category: "Hill", slug: "bandarban",
    topSpots: [
      { name: "Nilgiri Peak", description: "At 2,200 feet, Nilgiri offers an ethereal morning where clouds float below your feet. On clear days, you can see all the way to the Bay of Bengal.", imageUrl: `${WK}/4/40/Nilgiri%2C_Bandarban.jpg/640px-Nilgiri%2C_Bandarban.jpg`, tourGuide: "Hire a chandergari (jeep) from Bandarban town. Entry requires army registration with NID card." },
      { name: "Nafakhum Waterfall", description: "Bangladesh's largest and most powerful waterfall — a thundering blue-green cascade through a narrow gorge, dubbed the 'Niagara of Bangladesh'.", imageUrl: `${WK}/4/40/Nilgiri%2C_Bandarban.jpg/640px-Nilgiri%2C_Bandarban.jpg`, tourGuide: "5–6 hour trek from Thanchi. Mandatory guide required. Forest permit from Thanchi army camp." },
      { name: "Boga Lake", description: "A mysterious high-altitude crater lake at 1,246 feet with crystal-clear emerald water. No geological explanation exists for its formation — part of its mystique.", imageUrl: `${WK}/4/40/Nilgiri%2C_Bandarban.jpg/640px-Nilgiri%2C_Bandarban.jpg`, tourGuide: "3–4 hour trek from Ruma Bazaar. Hire a local Bawm guide. Camping available lakeside." },
      { name: "Shoilpropat Waterfall", description: "The most accessible waterfall in Bandarban — a 30-foot cascade just 4km from town, perfect for a refreshing swim on a hot afternoon.", imageUrl: `${WK}/4/40/Nilgiri%2C_Bandarban.jpg/640px-Nilgiri%2C_Bandarban.jpg`, tourGuide: "Short CNG ride from town. Entry fee 20 BDT. Bring sandals for slippery rocks." },
      { name: "Golden Temple (Swarna Kyaung)", description: "Bangladesh's largest Buddhist temple complex — a magnificent golden pagoda surrounded by peaceful monastery halls and colourful prayer flags.", imageUrl: `${WK}/4/40/Nilgiri%2C_Bandarban.jpg/640px-Nilgiri%2C_Bandarban.jpg`, tourGuide: "2km from Bandarban town. CNG 50 BDT. Remove shoes before entering the temple." }
    ],
    hotelOptions: [
      { name: "Sairu Hill Resort", price: "৳12,000", category: "Luxury", bookingUrl: "https://www.sairuhill.com" },
      { name: "Nilgiri Resort (Army)", price: "৳8,000", category: "Luxury", bookingUrl: "https://www.booking.com/hotel/bd/nilgiri.html" },
      { name: "Guide Tours Eco Lodge", price: "৳3,500", category: "Mid-Range", bookingUrl: "https://www.guidetours.com.bd" },
      { name: "Hotel Hills View", price: "৳2,000", category: "Budget", bookingUrl: "https://www.booking.com/hotel/bd/hills-view-bandarban.html" }
    ],
    restaurants: [
      { name: "Ruma Bazaar Tribal Kitchen", specialty: "Bamboo Shoot Curry (Badal Bhaat)", priceRange: "৳150–300/person", description: "Authentic Marma and Bawm tribal cuisine — bamboo shoot curries, smoked meats in bamboo cups. Completely unique in Bangladesh." },
      { name: "Meghla Complex Food Court", specialty: "Mixed Bangladeshi & Hill Foods", priceRange: "৳200–400/person", description: "Scenic lakeside restaurant combining mainstream Bangladeshi dishes with indigenous hillside specialties." },
      { name: "Bandarban Town Restaurant", specialty: "Pork with Foraged Hill Greens", priceRange: "৳250–500/person", description: "Rare in Bangladesh — authentic indigenous pork preparations with vegetables foraged from surrounding hills." }
    ]
  },
  {
    _id: "4", name: "Sylhet", location: "Sylhet Division", division: "Sylhet",
    description: "A mystic land of emerald tea gardens, sacred Sufi shrines, and the haunting beauty of ancient swamp forests — the spiritual and natural heartland of Bangladesh.",
    imageUrl: `${WK}/e/ea/Ratargul_Swamp_Forest_02.jpg/1280px-Ratargul_Swamp_Forest_02.jpg`,
    rating: 4.9, category: "Nature", slug: "sylhet",
    topSpots: [
      { name: "Ratargul Swamp Forest", description: "South Asia's only freshwater swamp forest — ancient trees rising from mirror-still emerald water, accessible only by small wooden boat. Magical in monsoon.", imageUrl: `${WK}/e/ea/Ratargul_Swamp_Forest_02.jpg/640px-Ratargul_Swamp_Forest_02.jpg`, tourGuide: "CNG from Amberkhana to Gowain Ghat, then rent a wooden boat. Visit July–October." },
      { name: "Jaflong", description: "A breathtaking river valley on the India border where crystal streams tumble over colourful pebbles, surrounded by rolling tea gardens and Khasi villages.", imageUrl: `${WK}/e/ea/Ratargul_Swamp_Forest_02.jpg/640px-Ratargul_Swamp_Forest_02.jpg`, tourGuide: "90 minutes from Sylhet city. Buses from Kumargaon bus stand. Best in clear weather." },
      { name: "Bichanakandi", description: "A surreal rock-strewn river where crystal water flows between massive boulders cascading from the Meghalaya hills — a photographer's paradise.", imageUrl: `${WK}/e/ea/Ratargul_Swamp_Forest_02.jpg/640px-Ratargul_Swamp_Forest_02.jpg`, tourGuide: "Local bus to Hadapur from Sylhet, then 30-minute walk. Small boats available." },
      { name: "Lalakhal River", description: "Famous for its startling turquoise-blue water — boat rides along the Sari River with lush green hills on both sides create an almost surreal landscape.", imageUrl: `${WK}/e/ea/Ratargul_Swamp_Forest_02.jpg/640px-Ratargul_Swamp_Forest_02.jpg`, tourGuide: "Hire a motorboat from Sylhet for a combined Lalakhal + Jaflong day trip." },
      { name: "Hazrat Shah Jalal Dargah", description: "The holiest Sufi shrine in Bangladesh — the 14th century mausoleum of Shah Jalal, where thousands of pilgrims gather and sacred catfish swim in the shrine pond.", imageUrl: `${WK}/e/ea/Ratargul_Swamp_Forest_02.jpg/640px-Ratargul_Swamp_Forest_02.jpg`, tourGuide: "City centre. Modest dress required. Most atmospheric during Friday jummah prayers." }
    ],
    hotelOptions: [
      { name: "Rose View Hotel", price: "৳6,000", category: "Luxury", bookingUrl: "https://www.roseviewhotel.com" },
      { name: "Hotel Noorjahan Grand", price: "৳4,000", category: "Premium", bookingUrl: "https://www.hotelnoorjahangrand.com" },
      { name: "Hotel Star Pacific", price: "৳2,500", category: "Mid-Range", bookingUrl: "https://www.booking.com/hotel/bd/star-pacific-sylhet.html" },
      { name: "Hotel Darikhana", price: "৳1,500", category: "Budget", bookingUrl: "https://www.booking.com/hotel/bd/darikhana-sylhet.html" }
    ],
    restaurants: [
      { name: "Pach Bhai Restaurant", specialty: "Naga Chilli Chicken & 7-Layer Tea", priceRange: "৳300–600/person", description: "The definitive Sylheti experience — legendary naga chilli preparations and the famous seven-layer tea." },
      { name: "Panshi Restaurant", specialty: "Hilsa Fish with Naga Chilli", priceRange: "৳400–800/person", description: "Sylhet's most famous restaurant. Their hilsa-naga chilli preparation has no equal in the region." },
      { name: "Nilufar Restaurant", specialty: "Sylheti Rice Cakes & Lentil Soup", priceRange: "৳150–300/person", description: "Traditional Sylheti breakfast of smoked rice cakes with lentil soup and freshly foraged greens." }
    ]
  },
  {
    _id: "5", name: "Srimangal", location: "Sylhet Division", division: "Sylhet",
    description: "The tea capital of Bangladesh — vast rolling hills carpeted in vivid green tea estates, fragrant with the scent of fresh-picked leaves and buzzing with wildlife.",
    imageUrl: `${WK}/4/4a/Tea_Garden_in_Sreemangal.jpg/1280px-Tea_Garden_in_Sreemangal.jpg`,
    rating: 4.7, category: "Nature", slug: "srimangal",
    topSpots: [
      { name: "Finlay Tea Estate", description: "One of Bangladesh's oldest tea gardens. Walk endless rows of manicured tea bushes and watch skilled women pluck fresh leaves with extraordinary speed.", imageUrl: `${WK}/4/4a/Tea_Garden_in_Sreemangal.jpg/640px-Tea_Garden_in_Sreemangal.jpg`, tourGuide: "Rickshaw from Srimangal town. Get permission at the estate office main gate." },
      { name: "Lawachara National Park", description: "A rare semi-evergreen rainforest home to critically endangered western hoolock gibbons and over 246 species of birds — one of the finest birding spots in Bangladesh.", imageUrl: `${WK}/4/4a/Tea_Garden_in_Sreemangal.jpg/640px-Tea_Garden_in_Sreemangal.jpg`, tourGuide: "Certified guides available at the forest gate. Gibbons most active at dawn." },
      { name: "Nilkantha Tea Cabin", description: "World-famous for the 7-Layer Tea — a magical drink with seven distinct layers using teas of different densities and flavours. A must-try Srimangal experience.", imageUrl: `${WK}/4/4a/Tea_Garden_in_Sreemangal.jpg/640px-Tea_Garden_in_Sreemangal.jpg`, tourGuide: "Town centre. Price 70–80 BDT per glass. Watch the careful preparation performance." },
      { name: "Hail Haor Wetland", description: "A vast seasonal inland sea attracting thousands of migratory birds in winter — from open-bill storks to northern pintails in enormous flocks.", imageUrl: `${WK}/4/4a/Tea_Garden_in_Sreemangal.jpg/640px-Tea_Garden_in_Sreemangal.jpg`, tourGuide: "Hire a motorboat from Srimangal. Best November–February for peak bird arrivals." }
    ],
    hotelOptions: [
      { name: "Grand Sultan Tea Resort", price: "৳15,000", category: "Luxury", bookingUrl: "https://www.grandsultanteagroup.com" },
      { name: "Tea Town Resort", price: "৳5,000", category: "Mid-Range", bookingUrl: "https://www.booking.com/hotel/bd/tea-town-resort.html" },
      { name: "Hotel Planet", price: "৳1,500", category: "Budget", bookingUrl: "https://www.booking.com/hotel/bd/planet-srimangal.html" }
    ],
    restaurants: [
      { name: "Nilkantha Tea Cabin", specialty: "7-Layer Tea (Saat Rang Cha)", priceRange: "৳70–100/person", description: "The World-famous inventor of seven-colour seven-taste layered tea. A unique Srimangal invention and must-see spectacle." },
      { name: "Grand Sultan Resort Restaurant", specialty: "Tea-Infused Organic Food", priceRange: "৳400–800/person", description: "Elegant farm-to-table cuisine where even the rice is cooked with Srimangal's finest Darjeeling-style green tea." },
      { name: "Maya Bonani", specialty: "Bamboo Chicken", priceRange: "৳200–400/person", description: "Rustic local favourite — chicken cooked inside sealed bamboo tubes over a wood fire, an ancient indigenous technique." }
    ]
  },
  {
    _id: "6", name: "Sajek Valley", location: "Rangamati District", division: "Chattogram",
    description: "The 'Queen of Hills' — a highland paradise where rolling clouds drift below mountain peaks at dawn and vast golden sunsets paint the sky crimson and pink.",
    imageUrl: `${WK}/a/ae/Sajek_Valley_Rangamati_%282%29.jpg/1280px-Sajek_Valley_Rangamati_%282%29.jpg`,
    rating: 4.8, category: "Hill", slug: "sajek-valley",
    topSpots: [
      { name: "Ruilui Para Viewpoint", description: "The crown viewpoint of Sajek. At dawn, thick cotton clouds fill the valleys below while peaks glow orange. The most breathtaking sunrise in Bangladesh.", imageUrl: `${WK}/a/ae/Sajek_Valley_Rangamati_%282%29.jpg/640px-Sajek_Valley_Rangamati_%282%29.jpg`, tourGuide: "Wake at 5:30am for the cloud-sea phenomenon. 5-minute walk from the main resort area." },
      { name: "Konglak Para Village", description: "A Tripura tribal village on a hilltop where villagers weave traditional textiles and live a way of life unchanged for centuries.", imageUrl: `${WK}/a/ae/Sajek_Valley_Rangamati_%282%29.jpg/640px-Sajek_Valley_Rangamati_%282%29.jpg`, tourGuide: "15-minute walk from Ruilui. Visit at midday. Small gifts for children welcome." },
      { name: "Sajek Helipad Viewpoint", description: "The highest accessible point with a full 360° panoramic view of green hills rolling to the horizon in every direction under open sky.", imageUrl: `${WK}/a/ae/Sajek_Valley_Rangamati_%282%29.jpg/640px-Sajek_Valley_Rangamati_%282%29.jpg`, tourGuide: "10-minute uphill walk from the main road. Best at sunset — sky turns gold over the hills." }
    ],
    hotelOptions: [
      { name: "Meghpunji Resort", price: "৳8,000", category: "Luxury", bookingUrl: "https://www.booking.com/hotel/bd/meghpunji-resort-sajek.html" },
      { name: "Sajek Valley Resort", price: "৳5,000", category: "Mid-Range", bookingUrl: "https://www.booking.com/hotel/bd/sajek-valley-resort.html" },
      { name: "Tribal Eco Cottage", price: "৳2,000", category: "Budget", bookingUrl: "https://www.booking.com/hotel/bd/sajek.html" }
    ],
    restaurants: [
      { name: "Ruilui Community Kitchen", specialty: "Tribal Smoked Chicken & Bamboo Rice", priceRange: "৳200–400/person", description: "Authentic Tripura and Lushai tribal cuisine — smoked meats, wild forest vegetables, and fermented bamboo shoot dishes." },
      { name: "Meghpunji Dining Hall", specialty: "Organic Highland Meals", priceRange: "৳400–700/person", description: "Farm-to-table with ingredients from surrounding tribal villages. Meals served with a view of the cloud-covered hills." }
    ]
  },
  {
    _id: "7", name: "Rangamati", location: "Chittagong Hill Tracts", division: "Chattogram",
    description: "The lake city — a breathtaking expanse of turquoise Kaptai Lake threading between emerald hills, the cultural heartland of the Chakma people of Bangladesh.",
    imageUrl: `${WK}/b/b0/Kaptai_Lake.jpg/1280px-Kaptai_Lake.jpg`,
    rating: 4.7, category: "Nature", slug: "rangamati",
    topSpots: [
      { name: "Kaptai Lake", description: "Bangladesh's largest lake — 726 km² of turquoise water dotted with forested islands and tribal fishing villages. Boat rides here are unforgettable.", imageUrl: `${WK}/b/b0/Kaptai_Lake.jpg/640px-Kaptai_Lake.jpg`, tourGuide: "Hire a speedboat from Rangamati launch ghat. Full-day explorations: 1,500–2,000 BDT." },
      { name: "Shuvolong Waterfall", description: "An accessible jungle waterfall reachable only by boat across Kaptai Lake — the boat journey itself is as spectacular as the waterfall.", imageUrl: `${WK}/b/b0/Kaptai_Lake.jpg/640px-Kaptai_Lake.jpg`, tourGuide: "2-hour boat ride from Rangamati ghat. Best September–November when water is fullest." },
      { name: "Rajban Bihar Monastery", description: "A grand Buddhist monastery perched on a hillock — the cultural and spiritual centre of the Chakma Buddhist community, with stunning lake views.", imageUrl: `${WK}/b/b0/Kaptai_Lake.jpg/640px-Kaptai_Lake.jpg`, tourGuide: "Accessible by rickshaw from town centre. Monks welcome visitors; be respectful." },
      { name: "Hanging Bridge (Jhulonto Setu)", description: "A suspension footbridge connecting to a small island — perhaps the most photographed spot in Rangamati, especially beautiful at golden hour.", imageUrl: `${WK}/b/b0/Kaptai_Lake.jpg/640px-Kaptai_Lake.jpg`, tourGuide: "5-minute rickshaw from town centre. Entry 10 BDT. Visit at sunset for best light." }
    ],
    hotelOptions: [
      { name: "Parjatan Motel Rangamati", price: "৳3,500", category: "Mid-Range", bookingUrl: "https://www.booking.com/hotel/bd/parjatan-rangamati.html" },
      { name: "Hotel Sufiyan International", price: "৳2,500", category: "Mid-Range", bookingUrl: "https://www.booking.com/hotel/bd/sufiyan-international-rangamati.html" },
      { name: "Hotel Green Castle", price: "৳1,800", category: "Budget", bookingUrl: "https://www.booking.com/hotel/bd/green-castle-rangamati.html" }
    ],
    restaurants: [
      { name: "Hanging Bridge Restaurant", specialty: "Kaptai Lake Fresh Fish", priceRange: "৳200–500/person", description: "Stunning lakeside dining. Fish caught hours earlier from the lake, cooked simply with turmeric and mustard oil." },
      { name: "Chakma Food Corner", specialty: "Bamboo Shoot & Hilsa", priceRange: "৳150–300/person", description: "Authentic Chakma cuisine featuring bamboo-cooked preparations almost impossible to find outside the hill tracts." }
    ]
  },
  {
    _id: "8", name: "Kuakata", location: "Barisal Division", division: "Barisal",
    description: "The 'Daughter of the Sea' — one of the world's rare beaches where you can witness both sunrise AND sunset over the ocean from the very same sand.",
    imageUrl: `${WK}/1/1f/Kuakata_sea_beach.jpg/1280px-Kuakata_sea_beach.jpg`,
    rating: 4.6, category: "Beach", slug: "kuakata",
    topSpots: [
      { name: "Kuakata Main Beach", description: "An 18km gently curved shore. Walk east for sunrise, walk west for sunset — the beach faces both directions, offering two ocean sun events daily.", imageUrl: `${WK}/1/1f/Kuakata_sea_beach.jpg/640px-Kuakata_sea_beach.jpg`, tourGuide: "Best October–March. Sunset point is 3km west; sunrise point 2km east of the main gate." },
      { name: "Fatrar Char Mangrove", description: "A small mangrove island accessible by trawler — a miniature Sundarbans with spotted deer, monkeys, and diverse bird life, with far fewer tourists.", imageUrl: `${WK}/1/1f/Kuakata_sea_beach.jpg/640px-Kuakata_sea_beach.jpg`, tourGuide: "Hire a trawler from Kuakata ghat. Full-day trip combining crab island. 800–1,200 BDT." },
      { name: "Rakhaine Village & Buddhist Temple", description: "A centuries-old Buddhist temple with a bronze historical Buddha, and adjacent Rakhaine tribal villages where artisans weave distinctive handloom textiles.", imageUrl: `${WK}/1/1f/Kuakata_sea_beach.jpg/640px-Kuakata_sea_beach.jpg`, tourGuide: "5-minute walk from the main beach. Temple is open all day. Weavers work in the mornings." }
    ],
    hotelOptions: [
      { name: "Hotel Al Helal Grand", price: "৳3,000", category: "Mid-Range", bookingUrl: "https://www.booking.com/hotel/bd/al-helal-grand-kuakata.html" },
      { name: "Kuakata Parjatan Hotel", price: "৳4,000", category: "Mid-Range", bookingUrl: "https://www.booking.com/hotel/bd/kuakata-parjatan.html" },
      { name: "Hotel Sea Beach", price: "৳1,500", category: "Budget", bookingUrl: "https://www.booking.com/hotel/bd/sea-beach-kuakata.html" }
    ],
    restaurants: [
      { name: "Beach Crab House", specialty: "Live Sea Crab & Prawn Grill", priceRange: "৳300–800/person", description: "Buy fresh crab and prawn by weight from fishermen returning at dawn, then have them grilled on the spot at the beach." },
      { name: "Rakhaine Women's Kitchen", specialty: "Smoked Fish & Sticky Rice", priceRange: "৳150–300/person", description: "Authentic Rakhaine tribal cuisine run by local women. Smoked-fish preparations with aromatic sticky rice are the highlight." }
    ]
  },
  {
    _id: "9", name: "Ahsan Manzil", location: "Old Dhaka, Dhaka Division", division: "Dhaka",
    description: "The magnificent Pink Palace of Dhaka — the opulent 19th century residence of the Nawab of Dhaka, rising above the Buriganga River in Indo-Saracenic grandeur.",
    imageUrl: `${WK}/4/4b/Ahsan_Manzil.jpg/1280px-Ahsan_Manzil.jpg`,
    rating: 4.5, category: "Historical", slug: "ahsan-manzil",
    topSpots: [
      { name: "Ahsan Manzil Museum", description: "23 rooms of impeccably preserved Nawabi-era artefacts — ornate furniture, oil paintings, personal silverware, and rare photographs of the Nawabs of Dhaka.", imageUrl: `${WK}/4/4b/Ahsan_Manzil.jpg/640px-Ahsan_Manzil.jpg`, tourGuide: "Islampur, Old Dhaka. Rickshaw from Sadarghat. Sat–Wed 10am–5pm. Entry 20 BDT." },
      { name: "Buriganga River Ghat", description: "The ancient river ghat below the palace — ride a wooden rowboat on the Buriganga at sunset for a timeless Old Dhaka experience unchanged for centuries.", imageUrl: `${WK}/4/4b/Ahsan_Manzil.jpg/640px-Ahsan_Manzil.jpg`, tourGuide: "Sadarghat boat rides negotiable: 200–300 BDT. Combine with an Old Dhaka street-food walk." },
      { name: "Old Dhaka Street Walk", description: "The surrounding lanes of Islampur and Shankhari Bazaar are a living museum — Hindu conch-shell artisans, perfumers, and century-old sweet shops line every alley.", imageUrl: `${WK}/4/4b/Ahsan_Manzil.jpg/640px-Ahsan_Manzil.jpg`, tourGuide: "Best explored on foot. Start at Sadarghat at 9am and walk north. Hire a local guide for context." }
    ],
    hotelOptions: [
      { name: "Pan Pacific Sonargaon Dhaka", price: "৳18,000", category: "Luxury", bookingUrl: "https://www.panpacific.com/en/hotels-and-resorts/pp-dhaka.html" },
      { name: "Hotel 71", price: "৳8,000", category: "Premium", bookingUrl: "https://www.booking.com/hotel/bd/71.html" },
      { name: "Hotel Victory (Purana Paltan)", price: "৳2,500", category: "Budget", bookingUrl: "https://www.booking.com/hotel/bd/victory-dhaka.html" }
    ],
    restaurants: [
      { name: "Hajir Biryani (Nazira Bazaar)", specialty: "Old Dhaka Kacchi Biryani", priceRange: "৳300–600/person", description: "Bangladesh's most legendary biryani — whole leg of mutton slow-cooked overnight in sealed pots with saffron and ghee. A 150-year-old institution." },
      { name: "Star Hotel Biryani", specialty: "Bakarkhani Bread & Tehari Rice", priceRange: "৳150–350/person", description: "Old Dhaka's most iconic breakfast spot for 100 years. Mughal-style flaky bakarkhani with kheer is a morning ritual for thousands." },
      { name: "Nanna Mia's Biriyani", specialty: "Moghlai Paratha & Mutton Curry", priceRange: "৳200–500/person", description: "Nanna Mia's 100-year-old shop is the hub of Old Dhaka's Mughal food heritage. The Moghlai paratha is sublime." }
    ]
  },
  {
    _id: "10", name: "Bagerhat Mosque City", location: "Khulna Division", division: "Khulna",
    description: "A UNESCO World Heritage Site — the medieval mosque city of Khan Jahan Ali, home to the extraordinary Sixty Dome Mosque built with 77 black stone columns.",
    imageUrl: `${WK}/f/fd/Sath_gambuj_masjid.jpg/1280px-Sath_gambuj_masjid.jpg`,
    rating: 4.7, category: "Historical", slug: "bagerhat",
    topSpots: [
      { name: "Sixty Dome Mosque (Shait Gumbad)", description: "Built in the 15th century — 77 domes crown this terracotta brick mosque. The scale and craftsmanship of this 600-year-old structure is awe-inspiring.", imageUrl: `${WK}/f/fd/Sath_gambuj_masjid.jpg/640px-Sath_gambuj_masjid.jpg`, tourGuide: "3 hours from Khulna by bus. Modest dress required. Best light for photography: late afternoon." },
      { name: "Khan Jahan Ali Tomb", description: "The sacred mausoleum of Bagerhat's founder, with two ancient 'sacred crocodiles' that pilgrims feed — one of the most remarkable living traditions in Bangladesh.", imageUrl: `${WK}/f/fd/Sath_gambuj_masjid.jpg/640px-Sath_gambuj_masjid.jpg`, tourGuide: "5-minute rickshaw from the mosque. Raw meat to feed the crocodiles sold by vendors outside." }
    ],
    hotelOptions: [
      { name: "Hotel Royal International", price: "৳2,000", category: "Mid-Range", bookingUrl: "https://www.booking.com/hotel/bd/royal-international-bagerhat.html" },
      { name: "Khulna Hotel (Day Trip Base)", price: "৳2,500", category: "Mid-Range", bookingUrl: "https://www.booking.com/hotel/bd/khulna.html" }
    ],
    restaurants: [
      { name: "Bagerhat Bazaar Diner", specialty: "Khulna Chingri Malaikari", priceRange: "৳300–600/person", description: "Prawns from the nearby Sundarbans delta slow-cooked in coconut milk. The defining dish of Khulna cuisine." }
    ]
  },
  {
    _id: "11", name: "Paharpur Vihara", location: "Naogaon, Rajshahi Division", division: "Rajshahi",
    description: "A UNESCO World Heritage Site — ruins of the 8th century Somapura Mahavihara, once the largest Buddhist monastery south of the Himalayas.",
    imageUrl: `${WK}/1/10/Paharpur_Buddhist_Monastery.jpg/1280px-Paharpur_Buddhist_Monastery.jpg`,
    rating: 4.6, category: "Historical", slug: "paharpur",
    topSpots: [
      { name: "Somapura Mahavihara Ruins", description: "177 monastic cells arranged around a massive central temple in a vast square compound. The scale of this 1,200-year-old monastery is staggering.", imageUrl: `${WK}/1/10/Paharpur_Buddhist_Monastery.jpg/640px-Paharpur_Buddhist_Monastery.jpg`, tourGuide: "Hire an on-site guide (200–300 BDT) for historical context. Wear sun protection — it is fully exposed." },
      { name: "Paharpur Archaeological Museum", description: "Thousands of terracotta plaques, stone sculptures, ancient coins, and artefacts unearthed from the Paharpur excavation — a treasure trove of South Asian Buddhist art.", imageUrl: `${WK}/1/10/Paharpur_Buddhist_Monastery.jpg/640px-Paharpur_Buddhist_Monastery.jpg`, tourGuide: "At the site entrance. Open Sat–Thu 9am–5pm. Entry included with site ticket." }
    ],
    hotelOptions: [
      { name: "Hotel Momo Inn (Rajshahi)", price: "৳2,000", category: "Mid-Range", bookingUrl: "https://www.booking.com/hotel/bd/momo-inn-rajshahi.html" },
      { name: "Hotel Nice International", price: "৳1,500", category: "Budget", bookingUrl: "https://www.booking.com/hotel/bd/nice-international-rajshahi.html" }
    ],
    restaurants: [
      { name: "Nawab Restaurant (Rajshahi)", specialty: "Rajshahi Mango Lassi & Fish Pitha", priceRange: "৳200–500/person", description: "Rajshahi's famous seasonal mango lassi uses Chapai Nawabganj Fazli mangoes — the finest in the world. Available May–July." }
    ]
  },
  {
    _id: "12", name: "Tanguar Haor", location: "Sunamganj, Sylhet Division", division: "Sylhet",
    description: "A Ramsar Wetland of global significance — a vast inland sea in the monsoon, then a shimmering mirror of sky in winter, hosting over 200 species of migratory birds.",
    imageUrl: `${WK}/5/59/Tanguar_Haor.jpg/1280px-Tanguar_Haor.jpg`,
    rating: 4.8, category: "Wildlife", slug: "tanguar-haor",
    topSpots: [
      { name: "Haor Watchtower", description: "The iconic watchtower rising from the middle of the open water. At dawn, mist rolls across the haor and thousands of birds take flight simultaneously overhead.", imageUrl: `${WK}/5/59/Tanguar_Haor.jpg/640px-Tanguar_Haor.jpg`, tourGuide: "Stay overnight on a houseboat. Permits from Sunamganj DC office. Best November–February." },
      { name: "Houseboat Night Experience", description: "Sleep under a canopy of stars on a traditional wooden nauka as frogs, night herons, and the glow of distant fishing lanterns surround you in all directions.", imageUrl: `${WK}/5/59/Tanguar_Haor.jpg/640px-Tanguar_Haor.jpg`, tourGuide: "Book a houseboat package in advance — they fill up quickly during winter bird season." }
    ],
    hotelOptions: [
      { name: "Traditional Houseboat (Nauka)", price: "৳5,000", category: "Eco-Stay", bookingUrl: "https://www.booking.com/hotel/bd/tanguar-haor.html" },
      { name: "Sunamganj Circuit House", price: "৳1,500", category: "Budget", bookingUrl: "https://www.booking.com/hotel/bd/sunamganj.html" }
    ],
    restaurants: [
      { name: "Houseboat Kitchen", specialty: "Fresh Haor Fish & River Prawn", priceRange: "৳300–600/person", description: "Your houseboat cook prepares freshly caught silver carp, boal, and tiny haor prawns — hours after they leave the water." }
    ]
  },
  {
    _id: "13", name: "Kantajew Temple", location: "Dinajpur, Rangpur Division", division: "Rangpur",
    description: "The finest terracotta temple in Bangladesh — an 18th century Hindu masterpiece encrusted with over 15,000 terracotta panels depicting Ramayana and Mahabharata stories.",
    imageUrl: `${WK}/3/33/Kantanagar_Temple-Dinajpur.jpg/1280px-Kantanagar_Temple-Dinajpur.jpg`,
    rating: 4.6, category: "Historical", slug: "kantajew-temple",
    topSpots: [
      { name: "Kantajew Temple Main Complex", description: "Every inch of exterior wall is covered in intricate mythological scenes in clay. Walk slowly along each face reading the stories — a comic strip carved in terracotta.", imageUrl: `${WK}/3/33/Kantanagar_Temple-Dinajpur.jpg/640px-Kantanagar_Temple-Dinajpur.jpg`, tourGuide: "12km from Dinajpur city. Bus to Kantanagar, then CNG to the gate. Best light: morning." },
      { name: "Dinajpur Rajbari", description: "The ruins of the ancient Dinajpur King's Palace — sprawling structures, ceremonial ponds, and heritage buildings from the zamindari era of Bengal.", imageUrl: `${WK}/3/33/Kantanagar_Temple-Dinajpur.jpg/640px-Kantanagar_Temple-Dinajpur.jpg`, tourGuide: "In Dinajpur town centre. Combine with Ramna Park for a full heritage day." }
    ],
    hotelOptions: [
      { name: "Hotel Dipjoy", price: "৳1,800", category: "Mid-Range", bookingUrl: "https://www.booking.com/hotel/bd/dipjoy-dinajpur.html" },
      { name: "Hotel Al Rashid", price: "৳1,200", category: "Budget", bookingUrl: "https://www.booking.com/hotel/bd/al-rashid-dinajpur.html" }
    ],
    restaurants: [
      { name: "Famous Hotel (Dinajpur)", specialty: "Dinajpur Lichi Juice & Biriyani", priceRange: "৳150–300/person", description: "Dinajpur's most celebrated produce is its Mazafati lychees. This restaurant's fresh lychee juice is the best in Bangladesh, June–July." }
    ]
  },
  {
    _id: "14", name: "Lalbagh Fort", location: "Old Dhaka, Dhaka Division", division: "Dhaka",
    description: "A 17th century Mughal architectural jewel in the heart of Old Dhaka — featuring three grand structures including the ethereal Pari Bibi mausoleum inlaid with marble.",
    imageUrl: `${WK}/6/6c/Lalbagh_Fort.jpg/1280px-Lalbagh_Fort.jpg`,
    rating: 4.4, category: "Historical", slug: "lalbagh-fort",
    topSpots: [
      { name: "Pari Bibi Mausoleum", description: "The jewel of Lalbagh Fort — the marble-inlaid tomb of the Mughal governor's daughter. Legend says her death here led the entire fort to be abandoned, unfinished.", imageUrl: `${WK}/6/6c/Lalbagh_Fort.jpg/640px-Lalbagh_Fort.jpg`, tourGuide: "Centrepiece of the compound. Evening lighting after 5pm is spectacular." },
      { name: "Diwan-i-Aam & Museum", description: "Mughal weaponry, coins, miniature paintings, and household objects from the era of Aurangzeb — displayed in the restored audience hall of the fort.", imageUrl: `${WK}/6/6c/Lalbagh_Fort.jpg/640px-Lalbagh_Fort.jpg`, tourGuide: "Sat–Wed 9am–5pm, Thu 9am–12pm. Entry 20 BDT locals / 200 BDT foreign visitors." }
    ],
    hotelOptions: [
      { name: "Pan Pacific Sonargaon Dhaka", price: "৳18,000", category: "Luxury", bookingUrl: "https://www.panpacific.com/en/hotels-and-resorts/pp-dhaka.html" },
      { name: "Hotel Grand Prince", price: "৳5,000", category: "Premium", bookingUrl: "https://www.booking.com/hotel/bd/grand-prince-dhaka.html" }
    ],
    restaurants: [
      { name: "Nanna Mia's Biryani (Old Dhaka)", specialty: "Kacchi Biryani — The Original", priceRange: "৳250–500/person", description: "The most authentic Old Dhaka dum biryani — a 100-year-old recipe with whole mutton leg sealed in a pot overnight with saffron and ghee." }
    ]
  },
  {
    _id: "15", name: "Patenga Beach", location: "Chattogram Division", division: "Chattogram",
    description: "Chittagong's beloved urban beach — where locals gather at sunset to watch container ships navigate the great Karnaphuli river mouth into one of Asia's major seaports.",
    imageUrl: `${WK}/c/c3/Patenga_sea_beach%2C_chittagong%2C_Bangladesh.jpg/1280px-Patenga_sea_beach%2C_chittagong%2C_Bangladesh.jpg`,
    rating: 4.3, category: "Beach", slug: "patenga-beach",
    topSpots: [
      { name: "Patenga Main Beach", description: "Chittagong's city beach with open sea views, colourful fishing boats, and the dramatic sight of massive cargo ships entering the Karnaphuli channel at sunset.", imageUrl: `${WK}/c/c3/Patenga_sea_beach%2C_chittagong%2C_Bangladesh.jpg/640px-Patenga_sea_beach%2C_chittagong%2C_Bangladesh.jpg`, tourGuide: "14km from Chittagong city centre. CNG or city bus service. Best at sunset. Free entry." },
      { name: "Foy's Lake (Mini Cox's)", description: "An artificial lake in a hilly forest park — rowboats, a cable car, and a small amusement park make this a beloved family destination in the city.", imageUrl: `${WK}/c/c3/Patenga_sea_beach%2C_chittagong%2C_Bangladesh.jpg/640px-Patenga_sea_beach%2C_chittagong%2C_Bangladesh.jpg`, tourGuide: "In Khulshi, Chittagong. Open daily 9am–6pm. Entry 50 BDT. Rowboat hire extra." }
    ],
    hotelOptions: [
      { name: "Radisson Blu Chittagong Bay View", price: "৳12,000", category: "Luxury", bookingUrl: "https://www.radissonhotels.com/en-us/hotels/radisson-blu-chittagong-bay-view" },
      { name: "Hotel Agrabad", price: "৳5,000", category: "Premium", bookingUrl: "https://www.booking.com/hotel/bd/agrabad.html" },
      { name: "Peninsula Chittagong", price: "৳8,000", category: "Luxury", bookingUrl: "https://www.peninsulachittagong.com" }
    ],
    restaurants: [
      { name: "Mezban Restaurant (Chawkbazar)", specialty: "Chittagonian Mezban Beef Feast", priceRange: "৳200–500/person", description: "The iconic slow-cooked Chittagonian mezban beef — a thousand-year-old community feast tradition, available year-round at this legendary spot." },
      { name: "Chittagong Port Teahouse", specialty: "Chittagong Sea Prawn Platter", priceRange: "৳400–900/person", description: "Incredible freshness of giant tiger prawns and mud crabs offloaded from trawlers arriving at the nearby port each morning." }
    ]
  }
];

router.get('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json(fallbackDestinations);
    }
    const destinations = await Destination.find({}).maxTimeMS(2000);
    res.json(destinations.length > 0 ? destinations : fallbackDestinations);
  } catch (error) {
    res.json(fallbackDestinations);
  }
});

router.get('/:id', async (req, res) => {
  try {
    // Always try fallback first by slug for reliability
    const fallback = fallbackDestinations.find(
      d => d.slug === req.params.id || d._id === req.params.id
    );
    if (mongoose.connection.readyState !== 1) {
      return res.json(fallback || { message: 'Not found' });
    }
    const dest = await Destination.findOne({
      $or: [{ slug: req.params.id }, mongoose.Types.ObjectId.isValid(req.params.id) ? { _id: req.params.id } : { slug: req.params.id }]
    }).maxTimeMS(2000);
    if (dest) return res.json(dest);
    if (fallback) return res.json(fallback);
    res.status(404).json({ message: 'Destination not found' });
  } catch (error) {
    const fallback = fallbackDestinations.find(d => d.slug === req.params.id || d._id === req.params.id);
    if (fallback) return res.json(fallback);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/destinations
// @desc    Create a new destination
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  try {
    const destination = new Destination(req.body);
    // ensure slug is created if missing
    if (!destination.slug) {
      destination.slug = destination.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }
    const createdDestination = await destination.save();
    res.status(201).json(createdDestination);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create destination', error: error.message });
  }
});

// @route   PUT /api/destinations/:id
// @desc    Update a destination
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    
    if (destination) {
      Object.assign(destination, req.body);
      const updatedDestination = await destination.save();
      res.json(updatedDestination);
    } else {
      res.status(404).json({ message: 'Destination not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to update destination', error: error.message });
  }
});

// @route   DELETE /api/destinations/:id
// @desc    Delete a destination
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    
    if (destination) {
      await destination.deleteOne();
      res.json({ message: 'Destination removed' });
    } else {
      res.status(404).json({ message: 'Destination not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete destination', error: error.message });
  }
});

module.exports = router;
