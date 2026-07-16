const axios = require('axios');
const config = require('../../config/env');
const CropPrice = require('./crop-prices.model');

/**
 * Fetch commodity prices from data.gov.in API
 */
exports.fetchFromGovAPI = async (filters = {}) => {
  try {
    const params = {
      'api-key': config.dataGovApiKey,
      format: 'json',
      limit: 100,
    };

    if (filters.state) params['filters[state]'] = filters.state;
    if (filters.commodity) params['filters[commodity]'] = filters.commodity;
    if (filters.district) params['filters[district]'] = filters.district;

    const url = `${config.dataGovBaseUrl}/${config.dataGovResourceId}`;
    const response = await axios.get(url, { params, timeout: 10000 });

    if (response.data && response.data.records) {
      return response.data.records.map(record => ({
        state: record.state || '',
        district: record.district || '',
        market: record.market || '',
        commodity: record.commodity || '',
        variety: record.variety || '',
        arrival_date: record.arrival_date || '',
        min_price: parseFloat(record.min_price) || 0,
        max_price: parseFloat(record.max_price) || 0,
        modal_price: parseFloat(record.modal_price) || 0,
      }));
    }
    return [];
  } catch (error) {
    console.error('data.gov.in API error:', error.message);
    return null; // Return null to indicate API failure
  }
};

/**
 * Get cached data or fetch from API
 */
exports.getOrFetchPrices = async (filters = {}) => {
  // First, try to get cached data
  const query = {};
  if (filters.state) query.state = new RegExp(filters.state, 'i');
  if (filters.commodity) query.commodity = new RegExp(filters.commodity, 'i');

  let cachedData = await CropPrice.find(query).sort({ fetched_at: -1 }).limit(100);

  if (cachedData.length > 0) {
    return { source: 'cache', data: cachedData };
  }

  // Fetch from API
  const apiData = await exports.fetchFromGovAPI(filters);

  if (apiData && apiData.length > 0) {
    // Cache the data
    const docs = apiData.map(item => ({ ...item, fetched_at: new Date() }));
    await CropPrice.insertMany(docs, { ordered: false }).catch(() => {});
    return { source: 'api', data: apiData };
  }

  // Return sample data as fallback
  return { source: 'sample', data: getSampleData(filters) };
};

/**
 * Sample data for when API is unavailable
 */
function getSampleData(filters = {}) {
  const sampleData = [
    { state: 'Maharashtra', district: 'Pune', market: 'Pune', commodity: 'Rice', variety: 'Basmati', arrival_date: '2025-01-15', min_price: 2800, max_price: 3500, modal_price: 3150 },
    { state: 'Maharashtra', district: 'Nashik', market: 'Nashik', commodity: 'Wheat', variety: 'Lokwan', arrival_date: '2025-01-15', min_price: 2200, max_price: 2800, modal_price: 2500 },
    { state: 'Maharashtra', district: 'Pune', market: 'Pune', commodity: 'Maize', variety: 'Yellow', arrival_date: '2025-01-15', min_price: 1800, max_price: 2200, modal_price: 2000 },
    { state: 'Punjab', district: 'Ludhiana', market: 'Ludhiana', commodity: 'Rice', variety: 'Pusa Basmati', arrival_date: '2025-01-15', min_price: 3000, max_price: 3800, modal_price: 3400 },
    { state: 'Punjab', district: 'Amritsar', market: 'Amritsar', commodity: 'Wheat', variety: 'HD 2967', arrival_date: '2025-01-15', min_price: 2100, max_price: 2600, modal_price: 2350 },
    { state: 'Uttar Pradesh', district: 'Lucknow', market: 'Lucknow', commodity: 'Rice', variety: 'Sona Masuri', arrival_date: '2025-01-15', min_price: 2600, max_price: 3200, modal_price: 2900 },
    { state: 'Uttar Pradesh', district: 'Kanpur', market: 'Kanpur', commodity: 'Wheat', variety: 'UP 262', arrival_date: '2025-01-15', min_price: 2000, max_price: 2500, modal_price: 2250 },
    { state: 'Karnataka', district: 'Bangalore', market: 'Yeshwanthpur', commodity: 'Rice', variety: 'Ponni', arrival_date: '2025-01-15', min_price: 2700, max_price: 3300, modal_price: 3000 },
    { state: 'Karnataka', district: 'Mysore', market: 'Mysore', commodity: 'Maize', variety: 'Yellow', arrival_date: '2025-01-15', min_price: 1700, max_price: 2100, modal_price: 1900 },
    { state: 'Tamil Nadu', district: 'Chennai', market: 'Koyambedu', commodity: 'Rice', variety: 'Ponni', arrival_date: '2025-01-15', min_price: 2900, max_price: 3600, modal_price: 3250 },
    { state: 'Gujarat', district: 'Ahmedabad', market: 'Ahmedabad', commodity: 'Cotton', variety: 'Shankar-6', arrival_date: '2025-01-15', min_price: 5500, max_price: 6500, modal_price: 6000 },
    { state: 'Gujarat', district: 'Rajkot', market: 'Rajkot', commodity: 'Groundnut', variety: 'Bold', arrival_date: '2025-01-15', min_price: 4800, max_price: 5600, modal_price: 5200 },
    { state: 'Rajasthan', district: 'Jaipur', market: 'Jaipur', commodity: 'Wheat', variety: 'Lok-1', arrival_date: '2025-01-15', min_price: 2100, max_price: 2700, modal_price: 2400 },
    { state: 'Madhya Pradesh', district: 'Bhopal', market: 'Bhopal', commodity: 'Soyabean', variety: 'Yellow', arrival_date: '2025-01-15', min_price: 4200, max_price: 5000, modal_price: 4600 },
    { state: 'West Bengal', district: 'Kolkata', market: 'Kolkata', commodity: 'Rice', variety: 'Minikit', arrival_date: '2025-01-15', min_price: 2500, max_price: 3100, modal_price: 2800 },
    { state: 'Andhra Pradesh', district: 'Guntur', market: 'Guntur', commodity: 'Cotton', variety: 'H-4', arrival_date: '2025-01-15', min_price: 5200, max_price: 6200, modal_price: 5700 },
    { state: 'Haryana', district: 'Karnal', market: 'Karnal', commodity: 'Rice', variety: 'Basmati 1121', arrival_date: '2025-01-15', min_price: 3200, max_price: 4000, modal_price: 3600 },
    { state: 'Bihar', district: 'Patna', market: 'Patna', commodity: 'Wheat', variety: 'HD 2733', arrival_date: '2025-01-15', min_price: 1900, max_price: 2400, modal_price: 2150 },
    { state: 'Kerala', district: 'Ernakulam', market: 'Kochi', commodity: 'Coconut', variety: 'Malabar', arrival_date: '2025-01-15', min_price: 8000, max_price: 12000, modal_price: 10000 },
    { state: 'Odisha', district: 'Cuttack', market: 'Cuttack', commodity: 'Rice', variety: 'Swarna', arrival_date: '2025-01-15', min_price: 2400, max_price: 2900, modal_price: 2650 },
  ];

  let filtered = sampleData;
  if (filters.state) {
    filtered = filtered.filter(d => d.state.toLowerCase().includes(filters.state.toLowerCase()));
  }
  if (filters.commodity) {
    filtered = filtered.filter(d => d.commodity.toLowerCase().includes(filters.commodity.toLowerCase()));
  }

  // If no data matches the filters in the sample, dynamically generate some realistic data!
  if (filtered.length === 0 && (filters.state || filters.commodity)) {
    const state = filters.state || 'Various States';
    const commodity = filters.commodity || 'Various Crops';
    
    // Generate 3-5 random markets for this state/crop
    const numMarkets = Math.floor(Math.random() * 3) + 3; 
    const basePrice = Math.floor(Math.random() * 5000) + 1500;
    
    for (let i = 0; i < numMarkets; i++) {
      const minP = basePrice - Math.floor(Math.random() * 500);
      const maxP = basePrice + Math.floor(Math.random() * 800);
      
      filtered.push({
        state: state,
        district: `District ${i+1}`,
        market: `Market ${i+1}`,
        commodity: commodity,
        variety: 'Local/FAQ',
        arrival_date: new Date().toISOString().split('T')[0],
        min_price: minP,
        max_price: maxP,
        modal_price: Math.floor((minP + maxP) / 2)
      });
    }
  }

  return filtered;
}

/**
 * Get available states from the production dataset
 */
exports.getStates = () => {
  return [
    'Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam',
    'Bihar', 'Chandigarh', 'Chhattisgarh', 'Dadra and Nagar Haveli', 'Goa',
    'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand',
    'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Puducherry', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  ];
};

/**
 * Get available commodities
 */
exports.getCommodities = () => {
  return [
    'Rice', 'Wheat', 'Maize', 'Jowar', 'Bajra', 'Ragi', 'Cotton', 'Jute',
    'Sugarcane', 'Groundnut', 'Soyabean', 'Sunflower', 'Coconut', 'Arecanut',
    'Banana', 'Mango', 'Orange', 'Papaya', 'Grapes', 'Apple', 'Coffee',
    'Turmeric', 'Black pepper', 'Dry chillies', 'Potato', 'Onion', 'Tomato',
  ];
};
