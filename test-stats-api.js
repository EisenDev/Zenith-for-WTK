async function test() {
    try {
        const res = await fetch('http://localhost:3000/api/stats');
        const data = await res.json();
        console.log('Stats:', JSON.stringify(data, null, 2));
    } catch (err) {
        console.error('Fetch error:', err);
    }
}
test();
