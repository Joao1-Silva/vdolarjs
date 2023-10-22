import express from 'express';
import router from './routes/routes.js';

const app = express();

const port = process.env.PORT || 4000;

app.listen(port, ()=> {
  console.log(`Server run in ${port}`)
})

app.use(router)