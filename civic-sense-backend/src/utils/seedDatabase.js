import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

// Models
import User from '../models/User.js';
import State from '../models/State.js';
import City from '../models/City.js';
import Area from '../models/Area.js';
import IssueCategory from '../models/IssueCategory.js';
import Issue from '../models/Issue.js';
import AdminMeta from '../models/AdminMeta.js';
import connectDB from '../config/db.js';

// Configure dotenv
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Seed Data
const seedDatabase = async () => {
    try {
        await connectDB();
        console.log('🌱 Starting database seed...\n');

        // Clear existing data
        console.log('🗑️  Clearing existing data...');
        await User.deleteMany({});
        await State.deleteMany({});
        await City.deleteMany({});
        await Area.deleteMany({});
        await IssueCategory.deleteMany({});
        await Issue.deleteMany({});
        await AdminMeta.deleteMany({});
        console.log('✅ Existing data cleared\n');

        // 1. Create States
        console.log('📍 Creating states...');
        const states = await State.insertMany([
            { name: 'Maharashtra', code: 'MH' },
            { name: 'Karnataka', code: 'KA' },
            { name: 'Delhi', code: 'DL' }
        ]);
        console.log(`✅ Created ${states.length} states\n`);

        // 2. Create Cities
        console.log('🏙️  Creating cities...');
        const cities = await City.insertMany([
            { name: 'Mumbai', stateId: states[0]._id, isActive: true },
            { name: 'Pune', stateId: states[0]._id, isActive: true },
            { name: 'Bangalore', stateId: states[1]._id, isActive: true },
            { name: 'New Delhi', stateId: states[2]._id, isActive: true }
        ]);
        console.log(`✅ Created ${cities.length} cities\n`);

        // 3. Create Areas
        console.log('📌 Creating areas...');
        const areas = [];
        for (const city of cities) {
            for (let i = 0; i < 3; i++) {
                areas.push({
                    name: faker.location.street(),
                    cityId: city._id,
                    zipCode: faker.location.zipCode()
                });
            }
        }
        const createdAreas = await Area.insertMany(areas);
        console.log(`✅ Created ${createdAreas.length} areas\n`);

        // 4. Create Issue Categories
        console.log('📂 Creating issue categories...');
        const categories = await IssueCategory.insertMany([
            { name: 'Roads', description: 'Potholes, road damage', icon: '🛣️', color: '#FF5733' },
            { name: 'Water', description: 'Water supply issues', icon: '💧', color: '#3498DB' },
            { name: 'Electricity', description: 'Power outages', icon: '⚡', color: '#F39C12' },
            { name: 'Waste', description: 'Garbage collection', icon: '🗑️', color: '#27AE60' },
            { name: 'Parks', description: 'Park maintenance', icon: '🌳', color: '#2ECC71' }
        ]);
        console.log(`✅ Created ${categories.length} categories\n`);

        // 5. Create Users
        console.log('👥 Creating users...');

        // Superadmin
        const superadmin = await User.create({
            name: 'Super Admin',
            email: 'super@civic.com',
            password_hash: 'super123',
            role: 'SUPERADMIN',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=superadmin'
        });

        // Admins for each city
        const admins = [];
        for (const city of cities) {
            const admin = await User.create({
                name: `${city.name} Admin`,
                email: `admin@${city.name.toLowerCase()}.gov`,
                password_hash: 'password123',
                role: 'ADMIN',
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${city.name}`
            });
            admins.push(admin);

            // Create AdminMeta
            await AdminMeta.create({
                userId: admin._id,
                department: faker.helpers.arrayElement(['Health', 'Infrastructure', 'Sanitation']),
                assignedCities: [city._id],
                permissions: ['MANAGE_ISSUES', 'VIEW_ANALYTICS']
            });
        }

        // Regular users
        const regularUsers = [];
        for (let i = 0; i < 20; i++) {
            const user = await User.create({
                name: faker.person.fullName(),
                email: faker.internet.email().toLowerCase(),
                password_hash: 'user123',
                role: 'USER',
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`
            });
            regularUsers.push(user);
        }
        console.log(`✅ Created 1 superadmin, ${admins.length} admins, ${regularUsers.length} users\n`);

        // 6. Create Issues (including duplicates for testing)
        console.log('📋 Creating issues (including duplicates)...');

        const allUsers = [...regularUsers];
        const issues = [];

        // Create some duplicate issues (same location, same category, different users)
        // Duplicate Group 1: Potholes in Mumbai
        const mumbaiPotholeLocation = [72.8777, 19.0760]; // Mumbai coordinates
        for (let i = 0; i < 5; i++) {
            issues.push({
                userId: allUsers[i]._id,
                categoryId: categories[0]._id, // Roads
                title: `Pothole on ${faker.location.street()}`,
                description: faker.lorem.paragraph(),
                status: 'REPORTED',
                location: {
                    type: 'Point',
                    coordinates: [
                        mumbaiPotholeLocation[0] + (Math.random() - 0.5) * 0.002, // Within ~200m
                        mumbaiPotholeLocation[1] + (Math.random() - 0.5) * 0.002
                    ]
                },
                stateId: states[0]._id,
                cityId: cities[0]._id, // Mumbai
                areaId: createdAreas[0]._id,
                images: [faker.image.url()]
            });
        }

        // Duplicate Group 2: Water issues in Pune
        const puneWaterLocation = [73.8567, 18.5204]; // Pune coordinates
        for (let i = 5; i < 9; i++) {
            issues.push({
                userId: allUsers[i]._id,
                categoryId: categories[1]._id, // Water
                title: `Water supply disruption near ${faker.location.street()}`,
                description: faker.lorem.paragraph(),
                status: 'REPORTED',
                location: {
                    type: 'Point',
                    coordinates: [
                        puneWaterLocation[0] + (Math.random() - 0.5) * 0.003,
                        puneWaterLocation[1] + (Math.random() - 0.5) * 0.003
                    ]
                },
                stateId: states[0]._id,
                cityId: cities[1]._id, // Pune
                areaId: createdAreas[3]._id,
                images: []
            });
        }

        // Duplicate Group 3: Electricity in Bangalore
        const bangaloreElectricLocation = [77.5946, 12.9716]; // Bangalore coordinates
        for (let i = 9; i < 12; i++) {
            issues.push({
                userId: allUsers[i]._id,
                categoryId: categories[2]._id, // Electricity
                title: `Power outage in ${faker.location.street()} area`,
                description: faker.lorem.paragraph(),
                status: 'IN_PROGRESS',
                location: {
                    type: 'Point',
                    coordinates: [
                        bangaloreElectricLocation[0] + (Math.random() - 0.5) * 0.002,
                        bangaloreElectricLocation[1] + (Math.random() - 0.5) * 0.002
                    ]
                },
                stateId: states[1]._id,
                cityId: cities[2]._id, // Bangalore
                areaId: createdAreas[6]._id,
                images: [faker.image.url()]
            });
        }

        // Create regular (non-duplicate) issues
        for (let i = 12; i < 50; i++) {
            const randomCity = faker.helpers.arrayElement(cities);
            const randomState = states.find(s => s._id.equals(randomCity.stateId));
            const randomCategory = faker.helpers.arrayElement(categories);
            const randomUser = faker.helpers.arrayElement(allUsers);
            const randomArea = faker.helpers.arrayElement(createdAreas.filter(a => a.cityId.equals(randomCity._id)));

            issues.push({
                userId: randomUser._id,
                categoryId: randomCategory._id,
                title: faker.lorem.sentence(),
                description: faker.lorem.paragraph(),
                status: faker.helpers.arrayElement(['REPORTED', 'IN_PROGRESS', 'SOLVED']),
                location: {
                    type: 'Point',
                    coordinates: [
                        faker.location.longitude({ min: 72, max: 78 }),
                        faker.location.latitude({ min: 12, max: 28 })
                    ]
                },
                stateId: randomState._id,
                cityId: randomCity._id,
                areaId: randomArea._id,
                images: Math.random() > 0.5 ? [faker.image.url()] : []
            });
        }

        const createdIssues = await Issue.insertMany(issues);
        console.log(`✅ Created ${createdIssues.length} issues (including 3 duplicate groups)\n`);

        console.log('🎉 Database seed completed successfully!\n');
        console.log('📊 Summary:');
        console.log(`   - States: ${states.length}`);
        console.log(`   - Cities: ${cities.length}`);
        console.log(`   - Areas: ${createdAreas.length}`);
        console.log(`   - Categories: ${categories.length}`);
        console.log(`   - Users: ${1 + admins.length + regularUsers.length}`);
        console.log(`   - Issues: ${createdIssues.length}`);
        console.log(`   - Duplicate Groups: 3 (Mumbai Potholes, Pune Water, Bangalore Power)\n`);

        console.log('🔑 Login Credentials:');
        console.log('   Superadmin: super@civic.com / super123');
        console.log('   Mumbai Admin: admin@mumbai.gov / password123');
        console.log('   Pune Admin: admin@pune.gov / password123');
        console.log('   Bangalore Admin: admin@bangalore.gov / password123');
        console.log('   New Delhi Admin: admin@new delhi.gov / password123\n');

        mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('❌ Seed failed:', error);
        process.exit(1);
    }
};

// Run if executed directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    seedDatabase();
}

export default seedDatabase;
