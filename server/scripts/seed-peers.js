/**
 * Seed demo peer profiles via the public API.
 * Usage: node scripts/seed-peers.js [BASE_URL]
 * Default: https://campus-careers-mate.onrender.com
 */
const BASE = process.argv[2] || 'https://campus-careers-mate.onrender.com';
const API = `${BASE}/api/v1`;

const DEMO_USERS = [
    { name: 'Priya Sharma', email: 'priya.demo@test.com', password: 'Password@123', college: 'IIT Delhi', roles: ['SDE', 'Full Stack'], stage: 'Interviewing', headline: 'Final year CSE | 3★ on CodeChef' },
    { name: 'Rahul Verma', email: 'rahul.demo@test.com', password: 'Password@123', college: 'BITS Pilani', roles: ['SDE', 'Backend'], stage: 'Preparing', headline: 'DSA grinder | Building side projects' },
    { name: 'Ananya Patel', email: 'ananya.demo@test.com', password: 'Password@123', college: 'IIT Bombay', roles: ['Data Analyst', 'ML Engineer'], stage: 'Applying', headline: 'Data science enthusiast | Kaggle contributor' },
    { name: 'Vikram Singh', email: 'vikram.demo@test.com', password: 'Password@123', college: 'NIT Trichy', roles: ['SDE', 'DevOps'], stage: 'Preparing', headline: 'Open source contributor | Linux nerd' },
    { name: 'Sneha Reddy', email: 'sneha.demo@test.com', password: 'Password@123', college: 'IIIT Hyderabad', roles: ['Frontend', 'SDE'], stage: 'Interviewing', headline: 'React & Next.js | UI/UX enthusiast' },
    { name: 'Amit Kumar', email: 'amitraghvan7488@gmail.com', password: 'Password@123', college: 'IIT Madras', roles: ['SDE', 'Systems'], stage: 'Placed', headline: 'Placed at Google | Happy to help!' },
];

async function seedUser(user) {
    try {
        // Signup
        const signupRes = await fetch(`${API}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: user.name, email: user.email, password: user.password, college: user.college }),
        });

        let token;
        if (signupRes.ok) {
            const data = await signupRes.json();
            token = data.data.tokens.accessToken;
            console.log(`✅ Registered: ${user.name}`);
        } else {
            // User might already exist, try login
            const loginRes = await fetch(`${API}/auth/signin`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: user.email, password: user.password }),
            });
            if (!loginRes.ok) {
                console.log(`⚠️  Skip ${user.name}: already exists and login failed`);
                return;
            }
            const data = await loginRes.json();
            token = data.data.tokens.accessToken;
            console.log(`🔑 Logged in: ${user.name}`);
        }

        // Create peer profile
        const profileRes = await fetch(`${API}/peers/profile`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({
                college: user.college,
                targetJobRoles: user.roles,
                placementStage: user.stage,
                headline: user.headline,
            }),
        });

        if (profileRes.ok) {
            console.log(`   📝 Profile created for ${user.name}`);
        } else {
            const err = await profileRes.json();
            console.log(`   ⚠️  Profile: ${err.message}`);
        }
    } catch (err) {
        console.error(`❌ Error for ${user.name}:`, err.message);
    }
}

async function main() {
    console.log(`\n🌱 Seeding demo peers on ${BASE}\n`);
    for (const user of DEMO_USERS) {
        await seedUser(user);
    }
    console.log('\n✅ Seeding complete!\n');
}

main();
