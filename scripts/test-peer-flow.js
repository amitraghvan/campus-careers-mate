
const BASE_URL = 'http://localhost:3000/api/v1';

async function sh(cmd) {
    return new Promise((resolve, reject) => {
        const exec = require('child_process').exec;
        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                console.warn(error);
            }
            resolve(stdout ? stdout.trim() : stderr);
        });
    });
}

async function request(method, url, body = null, token = null) {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const options = {
        method,
        headers,
    };
    if (body) options.body = JSON.stringify(body);

    try {
        const req = await fetch(`${BASE_URL}${url}`, options);
        const res = await req.json();
        // Unwrap the response if it follows the standard API structure
        const data = (res.success === true && res.data !== undefined) ? res.data : res;
        return { status: req.status, data };
    } catch (e) {
        return { status: 500, error: e.message };
    }
}

async function main() {
    console.log("🚀 Starting Peer Connect Integration Test...");

    // 1. Register User A
    const emailA = `userA_${Date.now()}@test.com`;
    console.log(`\n1. Registering User A (${emailA})...`);
    const regA = await request('POST', '/auth/signup', {
        name: 'User A',
        email: emailA,
        password: 'Password@123',
        college: 'Test College'
    });

    if (regA.status !== 201) {
        console.error("❌ Failed to register User A:", regA);
        return;
    }
    const tokenA = regA.data.tokens.accessToken;
    const userIdA = regA.data.user.id;
    console.log("✅ User A Registered. ID:", userIdA);

    // 2. Register User B
    const emailB = `userB_${Date.now()}@test.com`;
    console.log(`\n2. Registering User B (${emailB})...`);
    const regB = await request('POST', '/auth/signup', {
        name: 'User B',
        email: emailB,
        password: 'Password@123',
        college: 'Test College'
    });

    if (regB.status !== 201) {
        console.error("❌ Failed to register User B:", regB);
        return;
    }
    const tokenB = regB.data.tokens.accessToken;
    const userIdB = regB.data.user.id;
    console.log("✅ User B Registered. ID:", userIdB);

    // 3. Create Profiles
    console.log("\n3. Creating Profiles...");
    const p1 = await request('POST', '/peers/profile', {
        college: 'IIT Test',
        targetJobRoles: ['SDE'],
        placementStage: 'Preparing',
        headline: 'Ready to code'
    }, tokenA);
    if (p1.status !== 201) console.error("❌ Profile A failed:", p1);

    const p2 = await request('POST', '/peers/profile', {
        college: 'IIT Test',
        targetJobRoles: ['Data'],
        placementStage: 'Applying',
        headline: 'Data Wizard'
    }, tokenB);
    if (p2.status !== 201) console.error("❌ Profile B failed:", p2);

    console.log("✅ Profiles created.");

    // 4. Discover Peers (User A looking for B)
    console.log("\n4. User A discovering peers...");
    const discover = await request('GET', '/peers/profile/discover', null, tokenA);
    // console.log("Discover Response:", JSON.stringify(discover.data, null, 2));

    if (discover.status !== 200) {
        console.error("❌ Discovery failed:", JSON.stringify(discover.data, null, 2));
        return;
    }

    const userBProfile = discover.data.data.find(p => p.user.id === userIdB); // Note: structure is data.data because of pagination wrapper
    if (!userBProfile) {
        console.error("❌ User B NOT found in discovery list for User A");
        console.log("Full list:", JSON.stringify(discover.data, null, 2));
    } else {
        console.log("✅ User B found in discovery.");
    }

    // 5. Send Connection Request (A -> B)
    console.log(`\n5. User A sending request to User B (${userIdB})...`);
    const reqRes = await request('POST', `/peers/connections/request/${userIdB}`, {}, tokenA);
    if (reqRes.status !== 201) {
        console.error("❌ Failed to send request:", reqRes);
    } else {
        console.log("✅ Request sent.");
    }

    // 6. Check Incoming Requests (User B)
    console.log("\n6. User B checking incoming requests...");
    const incoming = await request('GET', '/peers/connections/incoming', null, tokenB);
    const reqFromA = incoming.data.find(r => r.requesterId === userIdA);

    if (!reqFromA) {
        console.error("❌ Request from A NOT found in B's incoming list");
        console.log("Incoming list:", JSON.stringify(incoming.data, null, 2));
        return;
    }
    console.log("✅ Request from A found. Request ID:", reqFromA.id);

    // 7. Accept Request (User B)
    console.log(`\n7. User B accepting request (${reqFromA.id})...`);
    const acceptRes = await request('PATCH', `/peers/connections/accept/${reqFromA.id}`, {}, tokenB);
    if (acceptRes.status !== 200) {
        console.error("❌ Failed to accept request:", acceptRes);
        return;
    }
    console.log("✅ Request accepted.");

    // 8. Verify Connection (User A)
    console.log("\n8. User A checking connections...");
    const connectionsA = await request('GET', '/peers/connections', null, tokenA);
    const connToB = connectionsA.data.find(c => c.receiverId === userIdB || c.requesterId === userIdB);
    if (!connToB) {
        console.error("❌ Connection to B NOT found for User A");
    } else {
        console.log("✅ Connection established verified.");
    }

    // 9. Send Message (A -> B)
    console.log("\n9. User A sending message to User B...");
    // First, find conversation
    const chatsA = await request('GET', '/chats', null, tokenA);
    const conversation = chatsA.data.find(c =>
        (c.participantOneId === userIdA && c.participantTwoId === userIdB) ||
        (c.participantTwoId === userIdA && c.participantOneId === userIdB)
    );

    if (!conversation) {
        console.error("❌ Conversation not found for User A");
        return;
    }
    console.log("Conversation ID:", conversation.id);

    const msgRes = await request('POST', `/chats/${conversation.id}/messages`, { content: "Hello B!" }, tokenA);
    if (msgRes.status === 201) {
        console.log("✅ Message sent.");
    } else {
        console.error("❌ Failed to send message:", msgRes);
    }

    // 10. Read Message (User B)
    console.log("\n10. User B reading messages...");
    const msgsB = await request('GET', `/chats/${conversation.id}/messages`, null, tokenB);
    if (msgsB.data.length > 0 && msgsB.data[0].content === "Hello B!") {
        console.log("✅ Message received by B.");
    } else {
        console.error("❌ Message NOT received by B:", msgsB.data);
    }

    console.log("\n🎉 Integration Test Complete!");
}

main();
