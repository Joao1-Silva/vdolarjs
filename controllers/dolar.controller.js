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
        
        // Test log for API response structure
        console.log('[Test] API Response received:', data ? 'Success' : 'Failed');

        let priceData = null;
        
        // Check if data has monitors and USD data
        if (data && data.monitors && data.monitors.usd) {
            priceData = data.monitors.usd;
            console.log('[Test] USD data found:', !!priceData);
        }

        if (!priceData) {
            throw new Error('Could not find USD price data in the API response');
        }

        // Format current date as fallback
        const currentDate = new Date().toLocaleString('es-VE', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });

        const responseData = {
            price: parseFloat(priceData.price || 0),
            lastUpdate: priceData.last_update || currentDate,
            change: priceData.change || 0,
            percentChange: priceData.percent || 0,
            oldPrice: priceData.price_old || 0,
            trend: {
                symbol: priceData.symbol || '',
                color: priceData.color || 'black'
            },
            internetUsage: {
                youtubeTiktok: {
                    dataPerHour: 1.5,
                    description: "YouTube - TikTok"
                },
                netflixHD: {
                    dataPerHour: 3,
                    description: "Netflix HD Streaming"
                },
                spotify: {
                    dataPerHour: 0.072,
                    description: "Spotify Music Streaming"
                },
                browsing: {
                    dataPerHour: 0.06,
                    description: "Web Browsing"
                }
            }
        };

        // Test log for final data
        console.log('[Test] Response data prepared:', {
            price: responseData.price,
            lastUpdate: responseData.lastUpdate
        });

        // Store in cache
        cache.set('bcvRate', responseData);
        
        // Send the formatted response
        res.json(responseData);
    } catch (error) {
        console.error('[Error]:', error.message);
        res.status(500).json({
            error: 'Error interno del servidor',
            message: error.message
        });
    }
};

export default dolar;