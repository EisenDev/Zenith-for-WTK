const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
    connectionString: process.env.DATABASE_URL
});

async function main() {
    await client.connect();
    console.log('Connected to database for manual seeding.');

    try {
        // Clear existing data
        await client.query('DELETE FROM reviews');
        await client.query('DELETE FROM hotels');
        await client.query('DELETE FROM "HotelCompetitor"');
        await client.query('DELETE FROM "AISettings"');

        // Insert Hotel
        const hotelId = '00000000-0000-0000-0000-000000000001';
        await client.query(
            'INSERT INTO hotels (id, name, location, "createdAt") VALUES ($1, $2, $3, NOW())',
            [hotelId, 'ZENITH Grand Resort', 'Maldives']
        );

        // Insert Competitors
        const competitors = [
            { name: 'Hilton Maldives', clean: 4.8, val: 4.2, serv: 4.7, loc: 4.9, reviews: 1250, price: 850, sent: 4.5 },
            { name: 'Marriott Resort', clean: 4.5, val: 4.0, serv: 4.4, loc: 4.7, reviews: 980, price: 720, sent: 4.2 },
            { name: 'Four Seasons', clean: 4.9, val: 3.8, serv: 4.9, loc: 4.9, reviews: 850, price: 1200, sent: 4.8 },
            { name: 'Local Boutique', clean: 4.2, val: 4.5, serv: 4.0, loc: 4.3, reviews: 450, price: 450, sent: 4.0 },
        ];

        for (const comp of competitors) {
            await client.query(
                'INSERT INTO "HotelCompetitor" (id, name, cleanliness, value, service, location, "reviewCount", "avgPrice", sentiment, "createdAt") VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, NOW())',
                [comp.name, comp.clean, comp.val, comp.serv, comp.loc, comp.reviews, comp.price, comp.sent]
            );
        }

        // Insert Initial AI Settings
        await client.query(
            'INSERT INTO "AISettings" (id, persona, "autoPilotThreshold", keywords, "updatedAt") VALUES ($1, $2, $3, $4, NOW())',
            ['default', 'Friendly', 4.5, ['Bed bugs', 'Stolen', 'AC broken']]
        );

        const sources = ['Booking.com', 'Expedia', 'Google'];
        const names = ['John Doe', 'Jane Smith', 'Alice Johnson', 'Michael Brown', 'Sophia Davis', 'David Wilson', 'Emma Martinez', 'Chris Anderson'];
        const comments_pos = [
            'Amazing service and stunning views! The room was spotless.',
            'Perfect stay. The staff went above and beyond for our anniversary.',
            'Great location, close to everything. Highly recommended!',
            'The spa treatment was the highlight of our trip. Truly luxurious.',
            'Exceptional breakfast buffet with so many options.'
        ];
        const comments_neg = [
            'The AC was making noise all night. Management didnt help much.',
            'Room service was very slow, took 2 hours for a sandwich.',
            'The pool was closed for maintenance, which was disappointing.',
            'Overpriced for what it offers. Expecting more for a 5-star hotel.',
            'Check-in process took way too long.'
        ];

        console.log('Seeding 1000 reviews...');

        for (let i = 0; i < 1000; i++) {
            const isPositive = Math.random() > 0.3;
            const guestName = names[Math.floor(Math.random() * names.length)];
            const rating = isPositive ? 4 + Math.floor(Math.random() * 2) : 1 + Math.floor(Math.random() * 3);
            const source = sources[Math.floor(Math.random() * sources.length)];
            const comment = isPositive ? comments_pos[Math.floor(Math.random() * comments_pos.length)] : comments_neg[Math.floor(Math.random() * comments_neg.length)];
            const sentimentTag = isPositive ? 'Positive' : 'Negative';
            const createdAt = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);

            await client.query(
                'INSERT INTO reviews (id, "hotelId", "guestName", rating, source, comment, "sentimentTag", "createdAt") VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7)',
                [hotelId, guestName, rating, source, comment, sentimentTag, createdAt]
            );
        }

        console.log('Seed successful.');
    } catch (err) {
        console.error('Seeding error:', err);
    } finally {
        await client.end();
    }
}

main();
