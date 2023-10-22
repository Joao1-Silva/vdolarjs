import consultaDolar from 'consulta-dolar-venezuela';

const dolar = async (req, res) => {

    try {
        
        const price = await consultaDolar.getMonitor("BCV", "price");
        const lastUpdate = await consultaDolar.getMonitor("BCV", "lastUpdate");
        res.json([{ priceBCV: price, lastUpdated: lastUpdate }]);

    } catch (error) {

        console.error('Error:', error);
        res.status(500).send('Error interno del servidor')

    }

}

export default dolar