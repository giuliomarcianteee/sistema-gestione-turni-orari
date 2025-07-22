import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  TextField,
  Button,
  Snackbar,
  Alert,
  Chip,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import { 
  Schedule as ScheduleIcon,
  ArrowBack,
  Save as SaveIcon
} from '@mui/icons-material';
import { turniApi } from '../services/api';
import { useParams, useNavigate } from 'react-router-dom';

const ConfiguraTurniPage = () => {
  const { codiceNegozio } = useParams();
  const navigate = useNavigate();
  
  const [negozio, setNegozio] = useState(null);
  const [grigliaTurni, setGrigliaTurni] = useState({});
  const [loading, setLoading] = useState(true);
  const [editingCell, setEditingCell] = useState(null);
  const [tempEdit, setTempEdit] = useState({ oraInizio: '', oraFine: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const giorniSettimana = [
    { key: 'lunedi', label: 'Lunedì' },
    { key: 'martedi', label: 'Martedì' },
    { key: 'mercoledi', label: 'Mercoledì' },
    { key: 'giovedi', label: 'Giovedì' },
    { key: 'venerdi', label: 'Venerdì' },
    { key: 'sabato', label: 'Sabato' },
    { key: 'domenica', label: 'Domenica' }
  ];
  
  const tipiTurno = [
    { key: 'mattina', label: 'Mattina', color: '#fff8e1', icon: '🌅' },
    { key: 'intermezzo', label: 'Intermezzo', color: '#f3e5f5', icon: '🕐' },
    { key: 'pomeriggio', label: 'Pomeriggio', color: '#e3f2fd', icon: '🌇' }
  ];

  useEffect(() => {
    loadData();
  }, [codiceNegozio]);

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await turniApi.getDettaglioNegozio(codiceNegozio);
      setNegozio(response.data);
      
      // Inizializza la griglia con orari default
      const grigliaIniziale = {};
      giorniSettimana.forEach(giorno => {
        grigliaIniziale[giorno.key] = {};
        tipiTurno.forEach(turno => {
          let oraInizio = '08:00';
          let oraFine = '14:00';
          
          if (turno.key === 'pomeriggio') {
            oraInizio = '14:00';
            oraFine = '20:00';
          } else if (turno.key === 'intermezzo') {
            oraInizio = '12:00';
            oraFine = '19:00';
          }
          
          grigliaIniziale[giorno.key][turno.key] = {
            oraInizio,
            oraFine,
            attivo: true
          };
        });
      });
      
      setGrigliaTurni(grigliaIniziale);
    } catch (error) {
      console.error('Errore nel caricamento dati:', error);
      setSnackbar({ open: true, message: 'Errore nel caricamento dei dati', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCellEdit = (giorno, turno) => {
    const currentData = grigliaTurni[giorno][turno];
    setEditingCell({ giorno, turno });
    setTempEdit({
      oraInizio: currentData.oraInizio,
      oraFine: currentData.oraFine
    });
  };

  const handleSaveEdit = () => {
    if (!editingCell) return;
    
    const { giorno, turno } = editingCell;
    setGrigliaTurni(prev => ({
      ...prev,
      [giorno]: {
        ...prev[giorno],
        [turno]: {
          ...prev[giorno][turno],
          oraInizio: tempEdit.oraInizio,
          oraFine: tempEdit.oraFine
        }
      }
    }));
    
    setEditingCell(null);
    setSnackbar({ open: true, message: 'Turno aggiornato!', severity: 'success' });
  };

  const handleCancelEdit = () => {
    setEditingCell(null);
    setTempEdit({ oraInizio: '', oraFine: '' });
  };

  const toggleTurnoAttivo = (giorno, turno) => {
    setGrigliaTurni(prev => ({
      ...prev,
      [giorno]: {
        ...prev[giorno],
        [turno]: {
          ...prev[giorno][turno],
          attivo: !prev[giorno][turno].attivo
        }
      }
    }));
  };

  const salvaConfigurazioni = async () => {
    try {
      // Qui implementeresti la chiamata API per salvare le configurazioni
      console.log('Salvataggio configurazioni:', grigliaTurni);
      setSnackbar({ open: true, message: '✅ Configurazioni salvate con successo!', severity: 'success' });
    } catch (error) {
      console.error('Errore nel salvataggio:', error);
      setSnackbar({ open: true, message: 'Errore nel salvataggio', severity: 'error' });
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Typography>Caricamento...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <ScheduleIcon color="primary" sx={{ fontSize: 32 }} />
          <Box>
            <Typography variant="h4">
              🔧 Configurazione Turni
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {negozio?.nome} - Imposta gli orari per ogni tipo di turno
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate(`/negozio/${codiceNegozio}`)}
            variant="outlined"
          >
            Indietro
          </Button>
          <Button
            startIcon={<SaveIcon />}
            onClick={salvaConfigurazioni}
            variant="contained"
            color="success"
            size="large"
          >
            💾 Salva Configurazioni
          </Button>
        </Box>
      </Box>

      {/* Info Alert */}
      <Alert severity="info" sx={{ mb: 3 }}>
        💡 <strong>Come usare:</strong> Clicca su una cella per modificare gli orari. Usa il toggle per attivare/disattivare un turno per uno specifico giorno.
      </Alert>

      {/* Griglia Configurazione Turni */}
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            📋 Griglia Orari Settimanali
          </Typography>
          
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell sx={{ fontWeight: 'bold', width: '15%' }}>
                    📅 Giorno
                  </TableCell>
                  {tipiTurno.map(turno => (
                    <TableCell key={turno.key} align="center" sx={{ fontWeight: 'bold', backgroundColor: turno.color, width: '28%' }}>
                      {turno.icon} {turno.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {giorniSettimana.map(giorno => (
                  <TableRow key={giorno.key} sx={{ '&:nth-of-type(odd)': { backgroundColor: '#fafafa' } }}>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                      {giorno.label}
                    </TableCell>
                    {tipiTurno.map(turno => {
                      const turnoData = grigliaTurni[giorno.key]?.[turno.key];
                      const isEditing = editingCell?.giorno === giorno.key && editingCell?.turno === turno.key;
                      
                      return (
                        <TableCell key={turno.key} align="center" sx={{ backgroundColor: turno.color, opacity: turnoData?.attivo ? 1 : 0.3 }}>
                          {isEditing ? (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, p: 1 }}>
                              <TextField
                                type="time"
                                size="small"
                                label="Inizio"
                                value={tempEdit.oraInizio}
                                onChange={(e) => setTempEdit({...tempEdit, oraInizio: e.target.value})}
                                InputLabelProps={{ shrink: true }}
                              />
                              <TextField
                                type="time"
                                size="small"
                                label="Fine"
                                value={tempEdit.oraFine}
                                onChange={(e) => setTempEdit({...tempEdit, oraFine: e.target.value})}
                                InputLabelProps={{ shrink: true }}
                              />
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button size="small" onClick={handleSaveEdit} color="success">✓</Button>
                                <Button size="small" onClick={handleCancelEdit} color="error">✗</Button>
                              </Box>
                            </Box>
                          ) : (
                            <Box
                              onClick={() => handleCellEdit(giorno.key, turno.key)}
                              sx={{
                                cursor: 'pointer',
                                p: 2,
                                borderRadius: 1,
                                minHeight: 80,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: 1,
                                border: '2px solid transparent',
                                '&:hover': {
                                  border: '2px solid #1976d2',
                                  backgroundColor: 'rgba(25, 118, 210, 0.1)'
                                }
                              }}
                            >
                              {turnoData?.attivo ? (
                                <>
                                  <Typography variant="body1" fontWeight="bold">
                                    {turnoData.oraInizio} - {turnoData.oraFine}
                                  </Typography>
                                  <Chip 
                                    size="small" 
                                    label="ATTIVO" 
                                    color="success" 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleTurnoAttivo(giorno.key, turno.key);
                                    }}
                                  />
                                </>
                              ) : (
                                <>
                                  <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                                    {turnoData?.oraInizio} - {turnoData?.oraFine}
                                  </Typography>
                                  <Chip 
                                    size="small" 
                                    label="DISATTIVO" 
                                    variant="outlined"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleTurnoAttivo(giorno.key, turno.key);
                                    }}
                                  />
                                </>
                              )}
                            </Box>
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          {/* Legenda */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>📖 Legenda</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 20, height: 20, backgroundColor: '#fff8e1', border: '1px solid #ddd' }} />
                  <Typography variant="body2">🌅 Mattina - Turni mattutini</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 20, height: 20, backgroundColor: '#f3e5f5', border: '1px solid #ddd' }} />
                  <Typography variant="body2">🕐 Intermezzo - Turni intermedi</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 20, height: 20, backgroundColor: '#e3f2fd', border: '1px solid #ddd' }} />
                  <Typography variant="body2">🌇 Pomeriggio - Turni pomeridiani</Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>

      {/* Snackbar per notifiche */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ConfiguraTurniPage;
