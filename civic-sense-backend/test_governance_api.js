import axios from 'axios';

const API_URL = 'http://localhost:3000/api/governance';
const HEADERS = { 'x-mock-role': 'SUPERADMIN' };

const runTest = async () => {
    try {
        console.log('1. Creating Admin...');
        const createRes = await axios.post(`${API_URL}/admin`, {
            email: `test_admin_${Date.now()}@civic.com`,
            password: 'password123',
            role: 'ADMIN',
            department: 'Sanitation',
            cityAccess: ['Mumbai']
        }, { headers: HEADERS });

        const adminId = createRes.data._id;
        console.log('✅ Admin Created:', adminId);

        console.log('\n2. Listing Admins...');
        const listRes = await axios.get(`${API_URL}/admins`, { headers: HEADERS });
        console.log(`✅ Admins Found: ${listRes.data.meta.total}`);

        console.log('\n3. Updating Department...');
        const updateRes = await axios.patch(`${API_URL}/admin/${adminId}/department`, {
            department: 'Health'
        }, { headers: HEADERS });
        console.log(`✅ Department Updated to: ${updateRes.data.department}`);

    } catch (error) {
        console.error('❌ Test Failed:', error.response ? error.response.data : error.message);
    }
};

runTest();
