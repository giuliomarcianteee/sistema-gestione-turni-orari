import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemText,
  Button,
  Chip,
  CircularProgress,
  Alert,
  TextField,
  MenuItem,
  Paper
} from '@mui/material';
import {
  ArrowBack,
  People,
  Schedule,
  CalendarMonth,
  Settings
} from '@mui/icons-material';
import { turniApi } from '../services/api';
import moment from 'moment';

const NegozioDetailPage = () => {
  const { codice } = useParams();
  const navigate = useNavigate();
  const [negozio, setNegozio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(moment().format('YYYY-MM'));

  useEffect(() => {
    loadNegozioDetail();
  }, [codice]);

  const loadNegozioDetail = async () => {
    try {
      setLoading(true);
      const response = await turniApi.getDettaglioNegozio(codice);
      setNegozio(response.data);
    } catch (err) {
      setError('Errore nel caricamento dei dettagli del negozio');
      console.error('Error loading negozio detail:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewGrid = () => {
    navigate(`/griglia/${codice}/${selectedMonth}`);
  };

  const handleConfiguraTurni = () => {
    navigate(`/negozi/${codice}/configura-turni`);
  };

  // Genera opzioni mesi (3 mesi precedenti, corrente, e 3 mesi successivi)
  const generateMonthOptions = () => {
    const months = [];
    for (let i = -3; i <= 3; i++) {
      const date = moment().add(i, 'month');
      months.push({
        value: date.format('YYYY-MM'),
        label: date.format('MMMM YYYY')
      });
    }
    return months;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !negozio) {
    return (
      <Container>
        <Alert severity="error">{error || 'Negozio non trovato'}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box mb={4}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/')}
          sx={{ mb: 2 }}
        >
          Torna alla Home
        </Button>
        
        <Typography variant="h3" component="h1" gutterBottom>
          {negozio.nome}
        </Typography>
        
        <Box display="flex" gap={2} mb={2}>
          <Chip label={`Codice: ${negozio.codice}`} color="primary" />
          <Chip label={`Coordinatore: ${negozio.coordinatore}`} color="secondary" />
        </Box>
      </Box>

      {/* Selezione Mese e Azioni */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Gestione Turni
        </Typography>
        
        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <CalendarMonth color="primary" />
          <TextField
            select
            label="Seleziona Mese"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            sx={{ minWidth: 200 }}
          >
            {generateMonthOptions().map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        <Box display="flex" gap={2}>
          <Button
            variant="contained"
            startIcon={<Settings />}
            onClick={handleConfiguraTurni}
            color="primary"
          >
            Configura Turni
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<Schedule />}
            onClick={handleViewGrid}
          >
            Visualizza Griglia
          </Button>
        </Box>
      </Paper>

      {/* Info Negozio */}
      <Grid container spacing={4}>
        {/* Dipendenti */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <People sx={{ mr: 1 }} />
                <Typography variant="h5">Dipendenti</Typography>
              </Box>
              
              <List>
                {negozio.dipendenti?.map((dipendente) => (
                  <ListItem key={dipendente.codiceDipe}>
                    <ListItemText
                      primary={dipendente.nome}
                      secondary={`${dipendente.oreSettimanali} ore/sett - ${dipendente.oreMensili} ore/mese`}
                    />
                  </ListItem>
                ))}
              </List>
              
              {!negozio.dipendenti?.length && (
                <Typography color="text.secondary">
                  Nessun dipendente trovato
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Turni Template */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Schedule sx={{ mr: 1 }} />
                <Typography variant="h5">Turni Configurati</Typography>
              </Box>
              
              <List>
                {negozio.turni?.map((turno, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={`${turno.tipoTurno} - ${turno.giornoSettimana}`}
                      secondary={`${turno.oraInizio} - ${turno.oraFine} (${turno.durataOre?.toFixed(1)} ore)`}
                    />
                  </ListItem>
                ))}
              </List>
              
              {!negozio.turni?.length && (
                <Typography color="text.secondary">
                  Nessun turno configurato
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default NegozioDetailPage;
