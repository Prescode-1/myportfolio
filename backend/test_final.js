const bookingData = {
  name: 'Precious Test',
  email: 'pukwedeh@gmail.com',
  date: '2026-03-23',
  time: '12:00 PM',
  service: 'Software Engineering',
  message: 'Testing the restarted server. If this appears, the notification is working!',
};

async function test() {
  const response = await fetch('http://localhost:5000/api/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookingData),
  });
  const data = await response.json();
  console.log('API Response:', data);
}

test();
