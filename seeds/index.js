const mongoose = require('mongoose');
const cities = require('./cities')
const {names} = require('./seedHelpers')
const Furniture = require('../models/furniture')

main().catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb+srv://pranshu05patel:PbsHmDwhVJ5FmuhJ@cluster0.8udh8o7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
  console.log("Mongo Connection Open!!")
}

const sample = array => array[Math.floor(Math.random() * array.length)];

const bedImages = [
  {
    url: 'https://res.cloudinary.com/dqeaomlck/image/upload/v1719660766/Furniture/bed-1.jpg',
    filename: 'Furniture/bed-1'
  },
  {
    url: 'https://res.cloudinary.com/dqeaomlck/image/upload/v1719660768/Furniture/bed-2.jpg',
    filename: 'Furniture/bed-2'
  },
  {
    url: 'https://res.cloudinary.com/dqeaomlck/image/upload/v1719660752/Furniture/bed-3.jpg',
    filename: 'Furniture/bed-3'
  }
];

const chairImages = [
  {
    url: 'https://res.cloudinary.com/dqeaomlck/image/upload/v1719660819/Furniture/chair-1.jpg',
    filename: 'Furniture/chair-1'
  },
  {
    url: 'https://res.cloudinary.com/dqeaomlck/image/upload/v1719660811/Furniture/chair-2.jpg',
    filename: 'Furniture/chair-2'
  },
  {
    url: 'https://res.cloudinary.com/dqeaomlck/image/upload/v1719660803/Furniture/chair-3.jpg',
    filename: 'Furniture/chair-3'
  }
];

const lampImages = [
  {
    url: 'https://res.cloudinary.com/dqeaomlck/image/upload/v1719638749/Furniture/lamp-1.avif',
    filename: 'Furniture/lamp-1'
  },
  {
    url: 'https://res.cloudinary.com/dqeaomlck/image/upload/v1719660979/Furniture/lamp-2.jpg',
    filename: 'Furniture/lamp-2'
  },
  {
    url: 'https://res.cloudinary.com/dqeaomlck/image/upload/v1719660976/Furniture/lamp-3.jpg',
    filename: 'Furniture/lamp-3'
  }
];
const sofaImages = [
  {
    url: 'https://res.cloudinary.com/dqeaomlck/image/upload/v1719638738/Furniture/sofa-1.avif',
    filename: 'Furniture/sofa-1'
  },
  {
    url: 'https://res.cloudinary.com/dqeaomlck/image/upload/v1719660673/Furniture/sofa-2.avif',
    filename: 'Furniture/sofa-2'
  },
  {
    url: 'https://res.cloudinary.com/dqeaomlck/image/upload/v1719661042/Furniture/sofa-3.jpg',
    filename: 'Furniture/sofa-3'
  }
];

const getImageArray = (title) => {
  if (title.toLowerCase().includes('bed')) return bedImages;
  if (title.toLowerCase().includes('chair')) return chairImages;
  if (title.toLowerCase().includes('lamp')) return lampImages;
  if (title.toLowerCase().includes('sofa')) return sofaImages;
  return [
    {
      url: 'https://res.cloudinary.com/dqeaomlck/image/upload/v1719638738/Furniture/sofa-1.avif',
      filename: 'Furniture/sofa-1'
    }
  ];
};
const getProductType = (title) => {
  if (title.toLowerCase().includes('bed')) return 'bed';
  if (title.toLowerCase().includes('chair')) return 'chair';
  if (title.toLowerCase().includes('lamp')) return 'lamp';
  if (title.toLowerCase().includes('sofa')) return 'sofa';
  return 'sofa'
};

const seedDB = async () => {
  await Furniture.deleteMany({});
  for (let i = 0; i < 300; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 200) + 100;
    const title = `${sample(names)}`;
    const images = getImageArray(title);
    const productType = getProductType(title);
    const furniture = new Furniture({
      author: '667fa931b0438f0e72d2ca80',
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title,
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum, quo! Lorem ipsum dolor sit amet consectetur adipisicing elit.',
      price,
      productType,
      geometry: {
        type: "Point",
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude]
      },
      images
    });
    await furniture.save();
  }
};

seedDB().then(() => mongoose.connection.close());