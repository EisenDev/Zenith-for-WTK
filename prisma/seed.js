const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // Clear existing data
    await prisma.review.deleteMany();
    await prisma.hotel.deleteMany();

    const hotel = await prisma.hotel.create({
        data: {
            id: '00000000-0000-0000-0000-000000000001',
            name: 'ZENITH Grand Resort',
            location: 'Maldives',
        },
    });

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

    const reviews = Array.from({ length: 1000 }).map(() => {
        const isPositive = Math.random() > 0.3;
        return {
            hotelId: hotel.id,
            guestName: names[Math.floor(Math.random() * names.length)],
            rating: isPositive ? 4 + Math.floor(Math.random() * 2) : 1 + Math.floor(Math.random() * 3),
            source: sources[Math.floor(Math.random() * sources.length)],
            comment: isPositive ? comments_pos[Math.floor(Math.random() * comments_pos.length)] : comments_neg[Math.floor(Math.random() * comments_neg.length)],
            sentimentTag: isPositive ? 'Positive' : 'Negative',
            createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        };
    });

    await prisma.review.createMany({
        data: reviews,
    });

    console.log('Seed successful.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
