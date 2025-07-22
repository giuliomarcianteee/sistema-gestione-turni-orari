import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  Card,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import {
  ArrowBack,
  Print,
  SwapHoriz,
  Refresh,
  PlayArrow,
  CalendarMonth
} from '@mui/icons-material';
import { turniApi } from '../services/api';
import moment from 'moment';
import 'moment/locale/it';

moment.locale('it');

const GrigliaOrariPage = () => {
  const { codice, mese } = useParams();
  const navigate = useNavigate();
  const printRef = useRef();
  
  const [currentMese, setCurrentMese] = useState(mese);
  
  const [griglia, setGriglia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editDialog, setEditDialog] = useState({ open: false, turno: null });
  const [selectedTurni, setSelectedTurni] = useState([]);

  useEffect(() => {
    loadGriglia();
  }, [codice, currentMese]);

  // Genera lista mesi per tutto l'anno corrente e prossimo
  const generateMesiOptions = () => {
    const mesi = [];
    const currentYear = moment().year();
    const years = [currentYear, currentYear + 1];
    
    years.forEach(year => {
      for (let month = 1; month <= 12; month++) {
        const meseValue = `${year}-${month.toString().padStart(2, '0')}`;
        const meseLabel = moment(meseValue).format('MMMM YYYY');
        mesi.push({ value: meseValue, label: meseLabel });
      }
    });
    
    return mesi;
  };

  const mesiOptions = generateMesiOptions();

  const loadGriglia = async () => {
    try {
      setLoading(true);
      const response = await turniApi.getGrigliaOrari(codice, currentMese);
      setGriglia(response.data);
    } catch (err) {
      setError('Errore nel caricamento della griglia');
      console.error('Error loading griglia:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMeseChange = (event) => {
    const newMese = event.target.value;
    setCurrentMese(newMese);
    // Aggiorna anche l'URL per mantenere la consistenza
    navigate(`/negozio/${codice}/griglia/${newMese}`, { replace: true });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleEditTurno = (turno) => {
    setEditDialog({ open: true, turno: { ...turno } });
  };

  const handleSaveTurno = async () => {
    try {
      const { turno } = editDialog;
      if (turno.id) {
        await turniApi.salvaTurno(turno);
      } else {
        await turniApi.salvaTurno(turno);
      }
      setEditDialog({ open: false, turno: null });
      loadGriglia();
    } catch (err) {
      alert('Errore nel salvare il turno: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleDeleteTurno = async (turnoId) => {
    if (window.confirm('Sei sicuro di voler eliminare questo turno?')) {
      try {
        await turniApi.eliminaTurno(turnoId);
        loadGriglia();
      } catch (err) {
        alert('Errore nell\'eliminazione del turno: ' + (err.response?.data?.error || err.message));
      }
    }
  };

  const handleScambiaTurni = async () => {
    if (selectedTurni.length !== 2) {
      alert('Seleziona esattamente 2 turni per scambiarli');
      return;
    }

    try {
      await turniApi.scambiaTurni(selectedTurni[0], selectedTurni[1]);
      setSelectedTurni([]);
      loadGriglia();
    } catch (err) {
      alert('Errore nello scambio turni: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleGenerateTurni = async () => {
    const isConfirmed = window.confirm(
      'Vuoi rigenerare tutti i turni per questo mese?\n\n' +
      '⚠️ ATTENZIONE: Questo cancellerà tutti i turni esistenti e ne creerà di nuovi.\n\n' +
      '✅ I nuovi turni saranno diversi dai precedenti grazie alla randomizzazione.\n\n' +
      'Continuare?'
    );
    
    if (isConfirmed) {
      try {
        setLoading(true);
        // Prima cancella i turni esistenti, poi genera quelli nuovi
        await turniApi.generaTurni({
          negozio: codice,
          mese: currentMese,
          cancellaPrecedenti: true
        });
        alert('✅ Turni rigenerati con successo!\n\nI nuovi turni sono stati creati con una distribuzione diversa.');
        loadGriglia();
      } catch (err) {
        setError('Errore nella rigenerazione turni: ' + (err.response?.data?.error || err.message));
        setLoading(false);
      }
    }
  };

  const getTurnoForDay = (codiceDipendente, giorno) => {
    const turni = griglia.turniPerDipendente[codiceDipendente] || [];
    return turni.find(t => t.giornoMese === giorno);
  };

  const getTurnoColor = (tipoTurno) => {
    switch (tipoTurno) {
      case 'Mattina': return '#e3f2fd';
      case 'Pomeriggio': return '#fff3e0';
      case 'Intermezzo': return '#f3e5f5';
      case 'Special': return '#e8f5e8';
      default: return '#f5f5f5';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !griglia) {
    return (
      <Container>
        <Alert severity="error">{error || 'Griglia non trovata'}</Alert>
      </Container>
    );
  }

  return (
    <Box>
      {/* Header - non stampabile */}
      <Container maxWidth="xl" sx={{ mt: 2, mb: 2 }} className="no-print">
        {/* Titolo e selettore mese */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box display="flex" alignItems="center" gap={3}>
            <Box>
              <Typography variant="h4" component="h1" gutterBottom>
                📅 Griglia Turni - {griglia.negozio}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {moment(currentMese).format('MMMM YYYY')}
              </Typography>
            </Box>
            
            {/* Selettore Mese */}
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel id="mese-select-label">
                <CalendarMonth sx={{ mr: 1 }} />
                Seleziona Mese
              </InputLabel>
              <Select
                labelId="mese-select-label"
                value={currentMese}
                onChange={handleMeseChange}
                label="Seleziona Mese"
                sx={{
                  backgroundColor: 'white',
                  '& .MuiSelect-select': {
                    display: 'flex',
                    alignItems: 'center'
                  }
                }}
              >
                {mesiOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          
          {/* Pulsante principale - Rigenera Turni */}
          <Button
            startIcon={<PlayArrow />}
            onClick={handleGenerateTurni}
            variant="contained"
            color="success"
            size="large"
            sx={{
              minWidth: 200,
              height: 56,
              fontSize: '1.1rem',
              fontWeight: 'bold',
              boxShadow: 3,
              '&:hover': {
                boxShadow: 6,
              }
            }}
          >
            🎲 Rigenera Turni
          </Button>
        </Box>

        {/* Barra azioni secondarie */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate(`/negozio/${codice}`)}
            variant="outlined"
          >
            Torna al Negozio
          </Button>
          
          <Box display="flex" gap={1}>
            <Button
              startIcon={<PlayArrow />}
              onClick={handleGenerateTurni}
              variant="contained"
              color="success"
              sx={{ fontWeight: 'bold' }}
            >
              🎲 Genera Turni
            </Button>
            
            <Button
              startIcon={<SwapHoriz />}
              onClick={handleScambiaTurni}
              disabled={selectedTurni.length !== 2}
              variant="outlined"
            >
              Scambia Turni ({selectedTurni.length})
            </Button>
            
            <Button
              startIcon={<Print />}
              onClick={handlePrint}
              variant="contained"
            >
              Stampa
            </Button>
          </Box>
        </Box>
        
        {/* Info box */}
        <Alert severity="info" sx={{ mb: 2 }}>
          💡 <strong>Suggerimento:</strong> Usa il selettore per cambiare mese, poi clicca "🎲 Rigenera Turni" per creare una nuova distribuzione casuale. Ogni rigenerazione cancellerà i turni precedenti e ne creerà di nuovi!
        </Alert>
      </Container>

      {/* Contenuto stampabile */}
      <Container maxWidth="xl" ref={printRef}>
        {/* Intestazione per stampa */}
        <Box textAlign="center" mb={3} className="print-only">
          <Typography variant="h4" component="h1" gutterBottom>
            Turni Orari - {griglia.negozio}
          </Typography>
          <Typography variant="h6" color="text.secondary">
            {moment(currentMese).format('MMMM YYYY')}
          </Typography>
        </Box>

        {/* Griglia turni */}
        <TableContainer component={Paper} sx={{ mb: 4 }}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', minWidth: 200 }}>
                  Dipendente
                </TableCell>
                {griglia.giorniMese?.map((giorno) => (
                  <TableCell 
                    key={giorno} 
                    align="center" 
                    sx={{ 
                      fontWeight: 'bold',
                      minWidth: 80,
                      backgroundColor: moment(`${mese}-${giorno.toString().padStart(2, '0')}`).day() === 0 ? '#ffebee' : 'inherit'
                    }}
                  >
                    <Box>
                      <div>{giorno}</div>
                      <div style={{ fontSize: '0.7em', color: '#666' }}>
                        {moment(`${mese}-${giorno.toString().padStart(2, '0')}`).format('dd')}
                      </div>
                    </Box>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            
            <TableBody>
              {griglia.dipendenti?.map((dipendente) => (
                <TableRow key={dipendente.codiceDipe}>
                  <TableCell sx={{ fontWeight: 'bold' }}>
                    {dipendente.nome}
                  </TableCell>
                  
                  {griglia.giorniMese?.map((giorno) => {
                    const turno = getTurnoForDay(dipendente.codiceDipe, giorno);
                    const isWeekend = moment(`${mese}-${giorno.toString().padStart(2, '0')}`).day() === 0;
                    
                    return (
                      <TableCell 
                        key={giorno}
                        align="center"
                        sx={{ 
                          backgroundColor: turno ? getTurnoColor(turno.tipoTurno) : (isWeekend ? '#ffebee' : 'inherit'),
                          fontSize: '0.8em',
                          p: 0.5,
                          cursor: 'pointer',
                          position: 'relative'
                        }}
                        onClick={() => turno && handleEditTurno(turno)}
                      >
                        {turno && (
                          <Box>
                            <div style={{ fontWeight: 'bold' }}>
                              {turno.tipoTurno.substring(0, 3)}
                            </div>
                            <div>
                              {turno.oraInizio.substring(0, 5)}-{turno.oraFine.substring(0, 5)}
                            </div>
                            
                            {/* Controlli - solo in visualizzazione */}
                            <Box className="no-print" sx={{ position: 'absolute', top: 0, right: 0 }}>
                              <IconButton 
                                size="small" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const isSelected = selectedTurni.includes(turno.id);
                                  if (isSelected) {
                                    setSelectedTurni(prev => prev.filter(id => id !== turno.id));
                                  } else {
                                    setSelectedTurni(prev => [...prev, turno.id]);
                                  }
                                }}
                                color={selectedTurni.includes(turno.id) ? 'primary' : 'default'}
                              >
                                <SwapHoriz fontSize="small" />
                              </IconButton>
                            </Box>
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

        {/* Riepilogo ore */}
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Riepilogo Ore Mensili
                </Typography>
                
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Dipendente</TableCell>
                      <TableCell align="center">Ore Contrattuali</TableCell>
                      <TableCell align="center">Ore Generate</TableCell>
                      <TableCell align="center">Differenza</TableCell>
                    </TableRow>
                  </TableHead>
                  
                  <TableBody>
                    {griglia.dipendenti?.map((dipendente) => {
                      const oreGenerate = dipendente.oreGenerate || 0;
                      const oreContrattuali = dipendente.oreMensili || 0;
                      const differenza = oreGenerate - oreContrattuali;
                      
                      return (
                        <TableRow key={dipendente.codiceDipe}>
                          <TableCell>{dipendente.nome}</TableCell>
                          <TableCell align="center">{oreContrattuali}</TableCell>
                          <TableCell align="center">{oreGenerate.toFixed(1)}</TableCell>
                          <TableCell align="center">
                            <Chip 
                              label={`${differenza > 0 ? '+' : ''}${differenza.toFixed(1)}`}
                              color={Math.abs(differenza) <= 2 ? 'success' : 'warning'}
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Dialog per modifica turno */}
      <Dialog open={editDialog.open} onClose={() => setEditDialog({ open: false, turno: null })}>
        <DialogTitle>
          {editDialog.turno?.id ? 'Modifica Turno' : 'Nuovo Turno'}
        </DialogTitle>
        
        <DialogContent sx={{ minWidth: 300 }}>
          {editDialog.turno && (
            <Box sx={{ pt: 1 }}>
              <TextField
                select
                fullWidth
                label="Tipo Turno"
                value={editDialog.turno.tipoTurno || ''}
                onChange={(e) => setEditDialog(prev => ({
                  ...prev,
                  turno: { ...prev.turno, tipoTurno: e.target.value }
                }))}
                margin="normal"
              >
                <MenuItem value="Mattina">Mattina</MenuItem>
                <MenuItem value="Pomeriggio">Pomeriggio</MenuItem>
                <MenuItem value="Intermezzo">Intermezzo</MenuItem>
                <MenuItem value="Special">Special</MenuItem>
              </TextField>
              
              <TextField
                fullWidth
                type="time"
                label="Ora Inizio"
                value={editDialog.turno.oraInizio || ''}
                onChange={(e) => setEditDialog(prev => ({
                  ...prev,
                  turno: { ...prev.turno, oraInizio: e.target.value }
                }))}
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
              
              <TextField
                fullWidth
                type="time"
                label="Ora Fine"
                value={editDialog.turno.oraFine || ''}
                onChange={(e) => setEditDialog(prev => ({
                  ...prev,
                  turno: { ...prev.turno, oraFine: e.target.value }
                }))}
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
            </Box>
          )}
        </DialogContent>
        
        <DialogActions>
          <Button onClick={() => setEditDialog({ open: false, turno: null })}>
            Annulla
          </Button>
          
          {editDialog.turno?.id && (
            <Button 
              onClick={() => handleDeleteTurno(editDialog.turno.id)}
              color="error"
            >
              Elimina
            </Button>
          )}
          
          <Button onClick={handleSaveTurno} variant="contained">
            Salva
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GrigliaOrariPage;
