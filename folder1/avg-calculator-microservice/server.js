const express = require('express');
const axios = require('axios');
const app = express();
const port = 9876;
const CLIENT_ID = 'f0f80285-dd0b-4add-9f91-c328b6e87a58';
const CLIENT_SECRET = 'FZEkHMpPCWMsXEcM';
const ACCESS_CODE = 'CNneGT';
const EMAIL = 'sarthak.shishodia_cs22@gla.ac.in';
const NAME = 'Sarthak Shishodia';
const ROLL_NO = '2215001596';
let windowState = [];
async function getAuthToken() {
  try {
    const response = await axios.post('http://20.244.56.144/evaluation-service/auth', {
      email: EMAIL,
      name: NAME,
      rollNo: ROLL_NO,
      accessCode: ACCESS_CODE,
      clientID: CLIENT_ID,
      clientSecret: CLIENT_SECRET
    });
    return response.data.access_token;
  } catch (error) {
    console.error('Error fetching auth token:', error);
    return null;
  }
}

async function fetchNumbers(url, token) {
  try {
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data.numbers;
  } catch (error) {
    console.error('Error fetching numbers:', error);
    return [];
  }
}

app.get('/numbers/p', async (req, res) => {
  const token = await getAuthToken();
  if (!token) {
    return res.status(500).json({ error: 'Failed to retrieve access token' });
  }

  const apiUrl = 'http://20.244.56.144/evaluation-service/primes';
  const primeNumbers = await fetchNumbers(apiUrl, token);

  if (primeNumbers.length > 0) {
    windowState = [...new Set([...windowState, ...primeNumbers])]; 
    const windowSize = 10;
    if (windowState.length > windowSize) {
      windowState.shift(); 
    }

    const avg = windowState.reduce((sum, num) => sum + num, 0) / windowState.length;

    return res.json({
      windowPrevState: windowState.slice(0, windowState.length - primeNumbers.length),
      windowCurrState: windowState,
      numbers: windowState,
      avg: avg.toFixed(2)
    });
  }
  return res.status(500).json({ error: 'No prime numbers received from the server' });
});

app.get('/numbers/f', async (req, res) => {
  const token = await getAuthToken();
  if (!token) {
    return res.status(500).json({ error: 'Failed to retrieve access token' });
  }

  const apiUrl = 'http://20.244.56.144/evaluation-service/fibonacci';
  const fibonacciNumbers = await fetchNumbers(apiUrl, token);

  if (fibonacciNumbers.length > 0) {
    windowState = [...new Set([...windowState, ...fibonacciNumbers])]; 
    const windowSize = 10;
    if (windowState.length > windowSize) {
      windowState.shift(); 
    }

    const avg = windowState.reduce((sum, num) => sum + num, 0) / windowState.length;

    return res.json({
      windowPrevState: windowState.slice(0, windowState.length - fibonacciNumbers.length),
      windowCurrState: windowState,
      numbers: windowState,
      avg: avg.toFixed(2)
    });
  }
  return res.status(500).json({ error: 'No Fibonacci numbers received from the server' });
});

app.get('/numbers/e', async (req, res) => {
  const token = await getAuthToken();
  if (!token) {
    return res.status(500).json({ error: 'Failed to retrieve access token' });
  }

  const apiUrl = 'http://20.244.56.144/evaluation-service/even';
  const evenNumbers = await fetchNumbers(apiUrl, token);

  if (evenNumbers.length > 0) {
    windowState = [...new Set([...windowState, ...evenNumbers])];
    const windowSize = 10;
    if (windowState.length > windowSize) {
      windowState.shift();
    }

    const avg = windowState.reduce((sum, num) => sum + num, 0) / windowState.length;

    return res.json({
      windowPrevState: windowState.slice(0, windowState.length - evenNumbers.length),
      windowCurrState: windowState,
      numbers: windowState,
      avg: avg.toFixed(2)
    });
  }
  return res.status(500).json({ error: 'No Even numbers received from the server' });
});

app.get('/numbers/r', async (req, res) => {
  const token = await getAuthToken();
  if (!token) {
    return res.status(500).json({ error: 'Failed to retrieve access token' });
  }

  const apiUrl = 'http://20.244.56.144/evaluation-service/rand';
  const randomNumbers = await fetchNumbers(apiUrl, token);

  if (randomNumbers.length > 0) {
    windowState = [...new Set([...windowState, ...randomNumbers])]; 
    const windowSize = 10;
    if (windowState.length > windowSize) {
      windowState.shift(); 
    }

    const avg = windowState.reduce((sum, num) => sum + num, 0) / windowState.length;

    return res.json({
      windowPrevState: windowState.slice(0, windowState.length - randomNumbers.length),
      windowCurrState: windowState,
      numbers: windowState,
      avg: avg.toFixed(2)
    });
  }
  return res.status(500).json({ error: 'No random numbers received from the server' });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
