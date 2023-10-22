import fetch from 'node-fetch';

const apiUrl = 'https://pydolarvenezuela-api.vercel.app/api/v1/dollar/history';

const data = async (req, res) => {
  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      console.error(`Error al consultar la API: ${response.status} ${response.statusText}`);
      res.status(500).send('Error al consultar la API');
      return;
    }

    const jsonData = await response.json();
    res.json(jsonData);
    console.log(jsonData);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error al consultar la API');
  }
};


export default data