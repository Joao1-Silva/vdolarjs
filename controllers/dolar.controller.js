import fetch from 'node-fetch';
import NodeCache from 'node-cache';

// Initialize cache with 5 minutes TTL
const cache = new NodeCache({ stdTTL: 300 });

const dolar = async (req, res) => {
    try {
        // Check cache first
        const cachedData = cache.get('bcvRate');
        if (cachedData) {
            return res.json(cachedData);
        }

        // If not in cache, fetch from API
        const response = await fetch('https://pydolarve.org/api/v1/dollar?page=bcv');
        const data = await response.json();
        
        // Log the entire response to see its structure
        console.log('API Response:', JSON.stringify(data, null, 2));

        // Check if we have the expected data
        if (!data || !data.items || !data.items[0]) {
            throw new Error('Invalid API response format');
        }

        const bcvRate = data.items[0];
        
        const responseData = {
            price: parseFloat(bcvRate.price),
            lastUpdate: bcvRate.timestamp || new Date().toISOString(),
            internetUsage: {
                youtubeHD: {
                    dataPerHour: 1.5, // GB per hour
                    description: "YouTube HD Streaming"
                },
                netflixHD: {
                    dataPerHour: 3, // GB per hour
                    description: "Netflix HD Streaming"
                },
                spotify: {
                    dataPerHour: 0.072, // GB per hour (72MB)
                    description: "Spotify Music Streaming"
                },
                browsing: {
                    dataPerHour: 0.06, // GB per hour (60MB)
                    description: "Web Browsing"
                }
            }
        };

        // Store in cache
        cache.set('bcvRate', responseData);
        
        // Send the formatted response
        res.json(responseData);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            message: error.message
        });
    }
};

export default dolar;