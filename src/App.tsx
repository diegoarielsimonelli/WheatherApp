import { useState } from 'react';
import { City, ErrorState } from './interfaces';
import { Box, Container, TextField, Typography, CircularProgress } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import './App.css';
const API_WEATHER = `http://api.weatherapi.com/v1/current.json?key=${import.meta.env.VITE_API_KEY}&lang=es&q=`;

function App() {
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [weather, setWeather] = useState<City>({
    city: '',
    country: '',
    temperature: 0,
    condition: '',
    conditionText: '',
    icon: ''
  });
  const [error, setError] = useState<ErrorState>({
    error: false,
    message: ''
  });
  function handleReset() {
    setCity('');
    setError({ error: false, message: '' });
    weather.city = '';
  }
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError({ error: false, message: '' });
    setLoading(true);

    try {
      if (!city.trim()) throw { message: 'The city field is required' };

      const res = await fetch(API_WEATHER + city);
      const data = await res.json();

      if (data.error) {
        throw { message: data.error.message };
      }

      setWeather({
        city: data.location.name,
        country: data.location.country,
        temperature: data.current.temp_c,
        condition: data.current.condition.code,
        conditionText: data.current.condition.text,
        icon: data.current.condition.icon
      });
    } catch (error) {
      if (error instanceof Error) {
        setError({ error: true, message: error.message });
      }
    } finally {
      setLoading(false);
    }
  }
  return (
    <Container sx={{ m: 2 }} maxWidth="xs">
      <Typography variant="h3" component="h1" sx={{ m: 2 }}>
        Wheather App
      </Typography>
      <Box sx={{ display: 'grid', gap: 2 }} component="form" autoComplete="off" onSubmit={handleSubmit}>
        <TextField
          id="city"
          label="Enter the name of a city"
          variant="outlined"
          size="small"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
          fullWidth
          error={error.error}
          helperText={error.message}
        ></TextField>
        <LoadingButton
          type="submit"
          variant="contained"
          loading={loading}
          loadingPosition="center"
          loadingIndicator={<CircularProgress color="inherit" size={16} />}
        >
          Search
        </LoadingButton>
        <button type="button" onClick={handleReset}>
          Reset
        </button>
      </Box>{' '}
      {weather.city && (
        <Box
          sx={{
            mt: 2,
            display: 'grid',
            gap: 2,
            textAlign: 'center'
          }}
        >
          <Typography variant="h4" component="h2">
            {weather.city}, {weather.country}
          </Typography>
          <Box component="img" alt={weather.conditionText} src={weather.icon} sx={{ margin: '0 auto' }} />
          <Typography variant="h5" component="h3">
            {weather.temperature} °C
          </Typography>
          <Typography variant="h6" component="h4">
            {weather.conditionText}
          </Typography>
        </Box>
      )}
      <Typography textAlign="center" sx={{ mt: 2, fontSize: '10px' }}>
        Powered by:{' '}
        <a href="https://www.weatherapi.com/" title="Weather API">
          WeatherAPI.com
        </a>
      </Typography>
    </Container>
  );
}

export default App;
