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

let price = consultaDolar.getMonitor("BCV", "price");
let lastUpdate = consultaDolar.getMonitor("BCV", "lastUpdate");

app.get('/home', (req, res) => {
  res.status(200).json('Welcome, your app is working well');
})

app.get('/dolarbcv', async (req, res) => {
    try {
      const price = await consultaDolar.getMonitor("BCV", "price");
      const lastUpdate = await consultaDolar.getMonitor("BCV", "lastUpdate");
      res.json({ priceBCV: price, lastUpdate });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Error interno del servidor');
    }
  })