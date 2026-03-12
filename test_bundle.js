const axios = require('axios');

async function testBundle() {
  const email = 'amayd@iitbhilai.ac.in';
  const internalSecret = 'ol_hub_EoqOB3DI7pTCCyayV8ezDk1WgbVgQZCC';
  
  const services = [
    { name: 'academics', provider: 'Acadmap', url: `https://acadmap.openlake.in/api/v1/internal/user?email=${email}` },
    { name: 'community', provider: 'CoSADB', url: `https://student-database-cosa-jztd.onrender.com/api/v1/internal/user?email=${email}` },
    { name: 'institute', provider: 'Smart Insti', url: `http://localhost:8000/api/v1/internal/user?email=${email}` }
  ];

  console.log(`--- Fetching Bundle for ${email} ---\n`);

  const bundle = {
    identity: { email },
    warnings: []
  };

  for (const service of services) {
    try {
      const response = await axios.get(service.url, {
        headers: { 'X-Hub-Secret': internalSecret },
        timeout: 5000
      });
      
      if (response.status === 200) {
        bundle[service.name] = {
          provider: service.provider,
          ...response.data.data
        };
        // Merge identity
        if (response.data.data?.identity) {
          bundle.identity = { ...bundle.identity, ...response.data.data.identity };
        }
        console.log(`✅ ${service.provider}: Success`);
      } else {
        bundle[service.name] = null;
        bundle.warnings.push(`${service.provider} returned ${response.status}`);
        console.log(`⚠️ ${service.provider}: Status ${response.status}`);
      }
    } catch (error) {
      bundle[service.name] = null;
      let reason = error.message;
      if (error.response) {
        reason = `Status ${error.response.status}: ${JSON.stringify(error.response.data)}`;
      }
      bundle.warnings.push(`${service.provider} failed: ${reason}`);
      console.log(`❌ ${service.provider}: Error (${reason})`);
    }
  }

  console.log('\n--- Final Bundle JSON ---');
  console.log(JSON.stringify({ status: 'success', data: bundle }, null, 2));
}

testBundle();
