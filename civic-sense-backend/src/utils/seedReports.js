import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import Report from '../models/Report.js';
import connectDB from '../config/db.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

// Configure dotenv to read from root .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

const CITIES = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'];
const CATEGORIES = ['Roads', 'Sanitation', 'Streetlights', 'Water Supply', 'Parks'];
const STATUSES = ['reported', 'in_progress', 'resolved', 'rejected'];
const DEPARTMENTS = ['Infrastructure', 'Health', 'Energy', 'Water', 'Environment'];

const generateRandomCoordinates = (city) => {
    const lat = faker.location.latitude();
    const lng = faker.location.longitude();
    return [parseFloat(lng), parseFloat(lat)];
};

const seedReports = async () => {
    await connectDB();

    console.log('Seeding data... This may take a moment.');

    // const existingCount = await Report.countDocuments();
    // if (existingCount > 0) {
    //    console.log(`Database already has ${existingCount} reports. Clearing...`);
    //    await Report.deleteMany({});
    // }

    const BATCH_SIZE = 1000;
    const TOTAL_REPORTS = 10000;

    for (let batch = 0; batch < TOTAL_REPORTS / BATCH_SIZE; batch++) {
        const reports = [];
        for (let i = 0; i < BATCH_SIZE; i++) {
            const city = faker.helpers.arrayElement(CITIES);
            const status = faker.helpers.arrayElement(STATUSES);
            const createdAt = faker.date.recent({ days: 30 });

            let resolvedAt = undefined;
            if (status === 'resolved') {
                // Random resolution time between 1 hour and 10 days
                const resolutionTimeMs = faker.number.int({ min: 3600000, max: 864000000 });
                resolvedAt = new Date(createdAt.getTime() + resolutionTimeMs);

                // Ensure resolvedAt doesn't exceed current time (optional, but realistic)
                if (resolvedAt > new Date()) resolvedAt = new Date();
            }

            reports.push({
                title: faker.lorem.sentence({ min: 3, max: 8 }),
                description: faker.lorem.paragraph(),
                category: faker.helpers.arrayElement(CATEGORIES),
                status: status,
                city: city,
                area: faker.location.street(),
                department: faker.helpers.arrayElement(DEPARTMENTS),
                location: {
                    type: 'Point',
                    coordinates: generateRandomCoordinates(city)
                },
                createdAt: createdAt,
                updatedAt: resolvedAt || createdAt,
                resolvedAt: resolvedAt
            });
        }
        await Report.insertMany(reports);
        console.log(`Inserted batch ${batch + 1}/${TOTAL_REPORTS / BATCH_SIZE}`);
    }

    console.log(`Successfully seeded ${TOTAL_REPORTS} reports!`);
    mongoose.disconnect();
    process.exit();
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    seedReports();
}

export default seedReports;
