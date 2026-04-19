const fetch = require('node-fetch');

async function check() {
  try {
    const rawContentRes = await fetch("https://backend-rho-nine-57.vercel.app/api/content");
    const rawContent = await rawContentRes.json();
    
    // Attempt payload size update
    const res = await fetch("https://backend-rho-nine-57.vercel.app/api/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rawContent)
    });
    console.log("Status:", res.status);
    const json = await res.json();
    console.log("Response JSON OK:", !!json);
  } catch (err) {
    console.error("Failed:", err.message);
  }
}
check();
