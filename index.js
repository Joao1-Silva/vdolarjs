import express from 'express'
import consultaDolar from 'consulta-dolar-venezuela';
import cors from 'cors'

const app = express()
const port = process.env.PORT || 4000;

app.use(cors())

app.listen(port, ()=> {
  console.log(`Server run in ${port}`)
})

// consultaDolar.getMonitor("null").then($ =>{console.log($)}); /*Obtener los valores de todos los monitores*/

// consultaDolar.getMonitor("EnParaleloVzla", "price", "lastUpdate").then($ =>{console.log($)});

// consultaDolar.getMonitor("BCV", "lastUpdate").then($ =>{console.log($)});

app.get('/', (req, res) => {
  res.status(200).json('Welcome, Im API`s Jonathan');
})

app.get('/dolarbcv', async (req, res) => {
    try {
      const price = await consultaDolar.getMonitor("BCV", "price");
      const lastUpdate = await consultaDolar.getMonitor("BCV", "lastUpdate");
      res.json([{ priceBCV: price, lastUpdated: lastUpdate }]);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Error interno del servidor');
    }
  })

app.get('/dolarparalelo', async (req, res) => {
  try {
    const price = await consultaDolar.getMonitor("EnParaleloVzla", "price");
    const lastUpdate = await consultaDolar.getMonitor("EnParaleloVzla", "lastUpdate");
    res.json({ pricePar: price, lastUpdated: lastUpdate });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error interno del servidor');
  }
})

app.get('/dolar', async (req, res) => {
  try {
    const price = await consultaDolar.getMonitor("null");
    res.json({ price: price });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error interno del servidor');
  }
})