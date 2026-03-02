async function test() {
    try {
        const res = await fetch('http://localhost:3000/api/reviews');
        const text = await res.text();
        console.log('Status:', res.status);
        console.log('Body snippet:', text.substring(0, 500));
    } catch (err) {
        console.error('Fetch error:', err);
    }
}
test();
