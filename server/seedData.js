import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';
import Showroom from './src/models/Showroom.js';
import Product from './src/models/Product.js';
import Booking from './src/models/Booking.js';
import Invoice from './src/models/Invoice.js';
import Payment from './src/models/Payment.js';

dotenv.config();

const sampleShowrooms = [
  {
    name: 'Downtown Auto Plaza',
    address: '123 Main Street',
    city: 'Mumbai',
    location: {
      type: 'Point',
      coordinates: [72.8777, 19.0760] // [longitude, latitude]
    },
    totalParkingSlots: 50,
    availableSlots: 30,
    facilities: ['WIFI', 'WAITING_LOUNGE', 'COFFEE', 'CAR_WASH'],
    phoneNumber: '9876543210',
    operatingHours: '9:00 AM - 8:00 PM',
    isActive: true
  },
  {
    name: 'Northside Service Center',
    address: '456 Park Avenue',
    city: 'Delhi',
    location: {
      type: 'Point',
      coordinates: [77.2090, 28.6139]
    },
    totalParkingSlots: 40,
    availableSlots: 25,
    facilities: ['WIFI', 'WAITING_LOUNGE', 'RESTROOM'],
    phoneNumber: '9876543211',
    operatingHours: '8:00 AM - 7:00 PM',
    isActive: true
  },
  {
    name: 'Eastside Auto Hub',
    address: '789 Lake Road',
    city: 'Bangalore',
    location: {
      type: 'Point',
      coordinates: [77.5946, 12.9716]
    },
    totalParkingSlots: 60,
    availableSlots: 45,
    facilities: ['WIFI', 'WAITING_LOUNGE', 'COFFEE', 'CAR_WASH', 'RESTROOM'],
    phoneNumber: '9876543212',
    operatingHours: '7:00 AM - 9:00 PM',
    isActive: true
  }
];

const sampleProducts = [
  {
    name: 'Premium Engine Oil 5W-30',
    description: 'High-quality synthetic engine oil for optimal engine performance',
    category: 'OILS_FLUIDS',
    price: 1200,
    originalPrice: 1500,
    brand: 'Castrol',
    stock: 50,
    sku: 'EO-5W30-001',
    specifications: new Map([
      ['Viscosity', '5W-30'],
      ['Type', 'Synthetic'],
      ['Volume', '4 Liters']
    ]),
    compatibility: [
      { make: 'Honda', model: 'Civic', year: '2020-2023' },
      { make: 'Toyota', model: 'Camry', year: '2019-2023' }
    ],
    isActive: true,
    isFeatured: true,
    tags: ['oil', 'synthetic', 'engine']
  },
  {
    name: 'All-Season Tire Set',
    description: 'Durable all-season tires for excellent grip and performance',
    category: 'TIRES',
    price: 8500,
    originalPrice: 10000,
    brand: 'Michelin',
    stock: 20,
    sku: 'TIRE-AS-001',
    specifications: new Map([
      ['Size', '205/55R16'],
      ['Type', 'All-Season'],
      ['Quantity', '4 Tires']
    ]),
    isActive: true,
    isFeatured: true,
    tags: ['tire', 'all-season', 'michelin']
  },
  {
    name: 'Car Battery 12V 75Ah',
    description: 'Long-lasting maintenance-free car battery',
    category: 'BATTERIES',
    price: 5500,
    brand: 'Exide',
    stock: 30,
    sku: 'BAT-12V-75',
    specifications: new Map([
      ['Voltage', '12V'],
      ['Capacity', '75Ah'],
      ['Type', 'Maintenance-Free']
    ]),
    isActive: true,
    tags: ['battery', 'exide', '12v']
  },
  {
    name: 'Brake Pad Set - Front',
    description: 'High-performance ceramic brake pads for enhanced stopping power',
    category: 'BRAKES',
    price: 2200,
    brand: 'Bosch',
    stock: 40,
    sku: 'BP-FRONT-001',
    specifications: new Map([
      ['Type', 'Ceramic'],
      ['Position', 'Front'],
      ['Quantity', '4 Pads']
    ]),
    compatibility: [
      { make: 'Maruti', model: 'Swift', year: '2018-2023' }
    ],
    isActive: true,
    tags: ['brake', 'ceramic', 'bosch']
  },
  {
    name: 'LED Headlight Bulbs H4',
    description: 'Ultra-bright LED headlight bulbs with long lifespan',
    category: 'ELECTRICAL',
    price: 1800,
    originalPrice: 2200,
    brand: 'Philips',
    stock: 60,
    sku: 'LED-H4-001',
    specifications: new Map([
      ['Type', 'LED'],
      ['Bulb Type', 'H4'],
      ['Brightness', '6000K']
    ]),
    isActive: true,
    isFeatured: true,
    tags: ['led', 'headlight', 'philips']
  },
  {
    name: 'Air Filter',
    description: 'High-efficiency air filter for clean engine performance',
    category: 'ENGINE_PARTS',
    price: 450,
    brand: 'Mann',
    stock: 80,
    sku: 'AF-001',
    specifications: new Map([
      ['Type', 'Panel Filter'],
      ['Material', 'High-grade Paper']
    ]),
    isActive: true,
    tags: ['air filter', 'engine', 'mann']
  },
  {
    name: 'Car Floor Mats - Universal',
    description: 'Weather-resistant floor mats for all car models',
    category: 'ACCESSORIES',
    price: 1200,
    brand: '3M',
    stock: 100,
    sku: 'FM-UNI-001',
    specifications: new Map([
      ['Material', 'Rubber'],
      ['Type', 'Universal Fit'],
      ['Pieces', '4']
    ]),
    isActive: true,
    tags: ['floor mats', 'accessories', '3m']
  },
  {
    name: 'Shock Absorber - Rear',
    description: 'Premium shock absorbers for smooth and comfortable ride',
    category: 'SUSPENSION',
    price: 3200,
    brand: 'Monroe',
    stock: 25,
    sku: 'SA-REAR-001',
    specifications: new Map([
      ['Type', 'Gas-filled'],
      ['Position', 'Rear'],
      ['Quantity', '2 Units']
    ]),
    isActive: true,
    tags: ['shock absorber', 'suspension', 'monroe']
  }
];

const seedDatabase = async () => {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/park_plaza');
    console.log('Connected to database');

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Showroom.deleteMany({});
    await Product.deleteMany({});
    await Booking.deleteMany({});
    await Invoice.deleteMany({});
    await Payment.deleteMany({});
    console.log('Existing data cleared');

    // Create showrooms
    console.log('Creating showrooms...');
    const showrooms = await Showroom.insertMany(sampleShowrooms);
    console.log(`Created ${showrooms.length} showrooms`);

    // Create users
    console.log('Creating users...');
    
    // Admin user
    const admin = await User.create({
      username: 'admin',
      name: 'Admin User',
      email: 'parkplaza.admin@gmail.com',
      phone: '9999999999',
      password: 'admin123',
      role: 'ADMIN',
      emailVerified: true,
      isActive: true
    });
    console.log('Created admin user');

    // Employee users (one for each showroom)
    const employees = [];
    for (let i = 0; i < showrooms.length; i++) {
      const employee = await User.create({
        username: `employee${i + 1}`,
        name: `Employee ${i + 1}`,
        email: `parkplaza.employee${i + 1}@gmail.com`,
        phone: `988888888${i}`,
        password: 'employee123',
        role: 'EMPLOYEE',
        showroomId: showrooms[i]._id,
        emailVerified: true,
        isActive: true
      });
      employees.push(employee);
    }
    console.log(`Created ${employees.length} employees`);

    // Regular users
    const users = [];
    for (let i = 0; i < 5; i++) {
      const user = await User.create({
        username: `user${i + 1}`,
        name: `User ${i + 1}`,
        email: `parkplaza.user${i + 1}@gmail.com`,
        phone: `987654321${i}`,
        password: 'user123',
        role: 'USER',
        emailVerified: true,
        address: {
          street: `${100 + i} Example Street`,
          city: 'Mumbai',
          state: 'Maharashtra',
          zipCode: '400001',
          country: 'India'
        },
        isActive: true
      });
      users.push(user);
    }
    console.log(`Created ${users.length} regular users`);

    // Create products
    console.log('Creating products...');
    const products = await Product.insertMany(sampleProducts);
    console.log(`Created ${products.length} products`);

    // Create sample bookings
    console.log('Creating sample bookings...');
    const booking1 = await Booking.create({
      userId: users[0]._id,
      showroomId: showrooms[0]._id,
      serviceType: 'PARKING',
      duration: 'DAILY',
      carDetails: {
        carNumber: 'MH01AB1234',
        make: 'Honda',
        model: 'Civic',
        year: '2021'
      },
      estimatedCost: 100,
      status: 'PENDING'
    });

    const booking2 = await Booking.create({
      userId: users[1]._id,
      showroomId: showrooms[1]._id,
      serviceType: 'WASH',
      duration: 'DAILY',
      carDetails: {
        carNumber: 'DL02CD5678',
        make: 'Toyota',
        model: 'Camry',
        year: '2020'
      },
      estimatedCost: 500,
      status: 'PENDING'
    });
    
    console.log('Created sample bookings');

    console.log('\n=== Seed Data Summary ===');
    console.log(`Showrooms: ${showrooms.length}`);
    console.log(`Users Created:`);
    console.log(`- Admin: 1 (username: admin, email: parkplaza.admin@gmail.com, password: admin123)`);
    console.log(`- Employees: ${employees.length} (username: employee1-${employees.length}, email: parkplaza.employee1-${employees.length}@gmail.com, password: employee123)`);
    console.log(`- Regular Users: ${users.length} (username: user1-${users.length}, email: parkplaza.user1-${users.length}@gmail.com, password: user123)`);
    console.log(`Products: ${products.length}`);
    console.log(`Bookings: 2`);
    console.log('\nDatabase seeded successfully!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
