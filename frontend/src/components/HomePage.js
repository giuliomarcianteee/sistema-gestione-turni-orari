import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Box,
  CircularProgress,
  Alert
} from '@mui/material';
import { Store, Business } from '@mui/icons-material';
import { turniApi } from '../services/api';

const HomePage = () => {
  const [negozi, setNegozi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadNegozi();
  }, []);

  const loadNegozi = async () => {
    try {
      setLoading(true);
      const response = await turniApi.getAllNegozi();
      setNegozi(response.data);
    } catch (err) {
      setError('Errore nel caricamento dei negozi');
      console.error('Error loading negozi:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNegozioClick = (codice) => {
    navigate(`/negozio/${codice}`);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box textAlign="center" mb={4}>
        <Business sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
        <Typography variant="h3" component="h1" gutterBottom>
          Gestione Turni Orari
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Seleziona un negozio per iniziare
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {negozi.map((negozio) => (
          <Grid item xs={12} sm={6} md={4} key={negozio.codice}>
            <Card 
              sx={{ 
                height: '100%',
                transition: '0.3s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 4
                }
              }}
            >
              <CardActionArea 
                onClick={() => handleNegozioClick(negozio.codice)}
                sx={{ height: '100%' }}
              >
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <Store sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h5" component="h2" gutterBottom>
                    {negozio.nome}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Codice: {negozio.codice}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Coordinatore: {negozio.coordinatore}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      {negozi.length === 0 && (
        <Box textAlign="center" mt={4}>
          <Typography variant="body1" color="text.secondary">
            Nessun negozio disponibile
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default HomePage;
