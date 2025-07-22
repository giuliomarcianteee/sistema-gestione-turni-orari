import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  CircularProgress,
  Alert,
  TextField,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  ArrowBack,
  People,
  Schedule,
  CalendarMonth,
  Add,
  Edit,
  Delete,
  Save,
  PlayArrow
} from '@mui/icons-material';
import { turniApi } from '../services/api';
import moment from 'moment';
import 'moment/locale/it';

moment.locale('it');

const NegozioDetailPage = () => {
  const { codice } = useParams();
  const navigate = useNavigate();
  
  const [negozio, setNegozio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  
  // Selettori separati per anno e mese
  const [selectedYear, setSelectedYear] = useState(moment().year());
  const [selectedMonth, setSelectedMonth] = useState(moment().month() + 1); // moment usa 0-based
  
  // Dati
  const [turniTemplate, setTurniTemplate] = useState([]);
  const [quantitaPersonale, setQuantitaPersonale] = useState([]);
  const [griglia, setGriglia] = useState(null);
  
  // Dialog per modifica turno
  const [editTurnoDialog, setEditTurnoDialog] = useState({
    open: false,
    turno: null,
    isNew: false
  });

  const giorni = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'];
  const tipiTurno = ['Mattina', 'Pomeriggio', 'Intermezzo'];
  const anni = [2025, 2026, 2027];
  const mesi = [
    { value: 1, label: 'Gennaio' },
    { value: 2, label: 'Febbraio' },
    { value: 3, label: 'Marzo' },
    { value: 4, label: 'Aprile' },
    { value: 5, label: 'Maggio' },
    { value: 6, label: 'Giugno' },
    { value: 7, label: 'Luglio' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Settembre' },
    { value: 10, label: 'Ottobre' },
    { value: 11, label: 'Novembre' },
    { value: 12, label: 'Dicembre' }
  ];

  useEffect(() => {
    loadNegozioDetail();
  }, [codice]);

  useEffect(() => {
    if (negozio) {
      loadTurniTemplate();
      loadQuantitaPersonale();
      loadGriglia();
    }
  }, [negozio, selectedYear, selectedMonth]);

  const getCurrentMeseString = () => {
    return `${selectedYear}-${selectedMonth.toString().padStart(2, '0')}`;
  };

  const getMeseItalianoString = () => {
    const nomiMesi = [
      '', 'gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno',
      'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'
    ];
    return nomiMesi[selectedMonth] || 'gennaio';
  };

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

  const loadTurniTemplate = async () => {
    try {
      const response = await turniApi.getTurniTemplate(codice);
      setTurniTemplate(response.data || []);
    } catch (err) {
      console.error('Error loading turni template:', err);
      setTurniTemplate([]);
    }
  };

  const loadQuantitaPersonale = async () => {
    try {
      const meseString = getCurrentMeseString();
      const response = await turniApi.getQuantitaPersonale(codice, meseString);
      
      let quantitaData = response.data;
      if (!quantitaData || quantitaData.length === 0) {
        quantitaData = inizializzaQuantitaPersonale();
      }
      setQuantitaPersonale(quantitaData);
    } catch (err) {
      console.error('Error loading quantita personale:', err);
      setQuantitaPersonale(inizializzaQuantitaPersonale());
    }
  };

  const loadGriglia = async () => {
    try {
      const meseString = getCurrentMeseString();
      const response = await turniApi.getGrigliaOrari(codice, meseString);
      setGriglia(response.data);
    } catch (err) {
      console.error('Error loading griglia:', err);
      setGriglia(null);
    }
  };

  const inizializzaQuantitaPersonale = () => {
    return giorni.map(giorno => ({
      id: null,
      negozio: codice,
      mese: getMeseItalianoString(),
      giornoSettimana: giorno,
      mattina: 1,
      pomeriggio: 1,
      intermezzo: 1
    }));
  };

  // Gestione turni template
  const getTurnoConfig = (giorno, tipoTurno) => {
    return turniTemplate.find(t => 
      t.giornoSettimana === giorno && t.tipoTurno === tipoTurno
    );
  };

  const handleAddTurno = (giorno, tipoTurno) => {
    setEditTurnoDialog({
      open: true,
      isNew: true,
      turno: {
        id: null,
        negozio: codice,
        giornoSettimana: giorno,
        tipoTurno: tipoTurno,
        oraInizio: '08:00',
        oraFine: '14:00'
      }
    });
  };

  const handleEditTurno = (turno) => {
    setEditTurnoDialog({
      open: true,
      isNew: false,
      turno: { 
        ...turno,
        oraInizio: turno.oraInizio?.substring(0, 5) || '08:00',
        oraFine: turno.oraFine?.substring(0, 5) || '14:00'
      }
    });
  };

  const salvaTurnoTemplate = async () => {
    try {
      const turno = editTurnoDialog.turno;
      await turniApi.salvaTurnoTemplate(turno);
      setEditTurnoDialog({ open: false, turno: null, isNew: false });
      await loadTurniTemplate();
      alert('✅ Turno salvato con successo!');
    } catch (err) {
      alert('❌ Errore nel salvare il turno: ' + (err.response?.data?.message || err.message));
    }
  };

  const eliminaTurnoTemplate = async (turnoId) => {
    if (window.confirm('Sei sicuro di voler eliminare questo turno?')) {
      try {
        await turniApi.eliminaTurnoTemplate(turnoId);
        await loadTurniTemplate();
        alert('✅ Turno eliminato con successo!');
      } catch (err) {
        alert('❌ Errore nell\'eliminazione del turno: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  // Gestione quantità personale
  const getQuantitaConfig = (giorno, tipoTurno) => {
    const quantita = quantitaPersonale.find(q => q.giornoSettimana === giorno);
    if (!quantita) return 0;
    
    switch (tipoTurno) {
      case 'Mattina': return quantita.mattina || 0;
      case 'Pomeriggio': return quantita.pomeriggio || 0;
      case 'Intermezzo': return quantita.intermezzo || 0;
      default: return 0;
    }
  };

  const updateQuantitaPersonale = (giorno, tipoTurno, valore) => {
    setQuantitaPersonale(prev => {
      const newQuantita = [...prev];
      let found = newQuantita.find(q => q.giornoSettimana === giorno);
      
      if (!found) {
        found = {
          id: null,
          negozio: codice,
          mese: getMeseItalianoString(),
          giornoSettimana: giorno,
          mattina: 1,
          pomeriggio: 1,
          intermezzo: 1
        };
        newQuantita.push(found);
      }
      
      switch (tipoTurno) {
        case 'Mattina': found.mattina = parseInt(valore) || 0; break;
        case 'Pomeriggio': found.pomeriggio = parseInt(valore) || 0; break;
        case 'Intermezzo': found.intermezzo = parseInt(valore) || 0; break;
        default: break;
      }
      
      return newQuantita;
    });
  };

  const salvaQuantitaPersonale = async () => {
    try {
      setSaving(true);
      
      for (const quantita of quantitaPersonale) {
        await turniApi.salvaQuantitaPersonale(quantita);
      }
      
      alert('✅ Quantità personale salvata con successo!');
    } catch (err) {
      alert('❌ Errore nel salvare la quantità personale: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  // Gestione generazione turni
  const handleGenerateTurni = async () => {
    const isConfirmed = window.confirm(
      `Vuoi generare i turni per ${mesi.find(m => m.value === selectedMonth)?.label} ${selectedYear}?\n\n` +
      '⚠️ ATTENZIONE: Questo cancellerà tutti i turni esistenti per questo mese e ne creerà di nuovi.\n\n' +
      'Continuare?'
    );
    
    if (isConfirmed) {
      try {
        setGenerating(true);
        const meseString = getCurrentMeseString();
        
        await turniApi.generaTurni({
          negozio: codice,
          mese: meseString,
          cancellaPrecedenti: true
        });
        
        alert('✅ Turni generati con successo!');
        await loadGriglia(); // Ricarica la griglia
      } catch (err) {
        alert('❌ Errore nella generazione turni: ' + (err.response?.data?.error || err.message));
      } finally {
        setGenerating(false);
      }
    }
  };

  // Helper functions per la griglia
  const getDayName = (giorno) => {
    const date = new Date(selectedYear, selectedMonth - 1, giorno);
    return date.toLocaleDateString('it-IT', { weekday: 'short' });
  };

  const getTurnoColor = (tipoTurno) => {
    switch (tipoTurno) {
      case 'Mattina': return '#fff3cd';
      case 'Pomeriggio': return '#d1ecf1';
      case 'Intermezzo': return '#d4edda';
      default: return '#f8f9fa';
    }
  };

  const getTurnoShort = (tipoTurno) => {
    switch (tipoTurno) {
      case 'Mattina': return 'M';
      case 'Pomeriggio': return 'P';
      case 'Intermezzo': return 'I';
      default: return '?';
    }
  };

  const getOreColor = (oreTotali, oreTarget) => {
    const percentuale = oreTotali / oreTarget;
    if (percentuale < 0.9) return '#ffebee'; // Rosso chiaro - sotto target
    if (percentuale > 1.1) return '#fff3e0'; // Arancione chiaro - sopra target
    return '#e8f5e8'; // Verde chiaro - nel target
  };

  const getOreStatus = (oreTotali, oreTarget) => {
    const percentuale = oreTotali / oreTarget;
    if (percentuale < 0.9) return '↓';
    if (percentuale > 1.1) return '↑';
    return '✓';
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
    <Container maxWidth="xl" sx={{ mt: 2, mb: 4 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            🏪 {negozio?.nome} ({negozio?.codice})
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Coordinatore: {negozio?.coordinatore}
          </Typography>
        </Box>
        
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/')}
          variant="outlined"
        >
          Torna alla Home
        </Button>
      </Box>

      {/* Selettori Anno e Mese */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box display="flex" alignItems="center" gap={3}>
          <CalendarMonth color="primary" />
          <Typography variant="h6">Seleziona Periodo:</Typography>
          
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Anno</InputLabel>
            <Select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              label="Anno"
            >
              {anni.map(anno => (
                <MenuItem key={anno} value={anno}>{anno}</MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Mese</InputLabel>
            <Select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              label="Mese"
            >
              {mesi.map(mese => (
                <MenuItem key={mese.value} value={mese.value}>{mese.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <Typography variant="body1" color="primary" sx={{ fontWeight: 'bold' }}>
            Configurazione per: {mesi.find(m => m.value === selectedMonth)?.label} {selectedYear}
          </Typography>
        </Box>
      </Paper>

      {/* Dipendenti */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            <People sx={{ mr: 1, verticalAlign: 'middle' }} />
            Dipendenti ({negozio?.dipendenti?.length || 0})
          </Typography>
          
          <Grid container spacing={2}>
            {negozio?.dipendenti?.map((dipendente, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle2">{dipendente.nome}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {dipendente.oreMensili} ore/mese
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Turni Template Configurati - GRIGLIA MODIFICABILE */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            <Schedule sx={{ mr: 1, verticalAlign: 'middle' }} />
            Turni Configurati - Fasce Orarie MODIFICABILI
          </Typography>
          
          <Alert severity="warning" sx={{ mb: 2 }}>
            ⚠️ <strong>Modifica Orari:</strong> Clicca su una cella per modificare gli orari. Questi vengono salvati nella tabella "turni" del database.
          </Alert>
          
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>
                    Giorno
                  </TableCell>
                  {tipiTurno.map(tipo => (
                    <TableCell key={tipo} align="center" sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>
                      {tipo}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              
              <TableBody>
                {giorni.map(giorno => (
                  <TableRow key={giorno}>
                    <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#fafafa' }}>
                      {giorno}
                    </TableCell>
                    
                    {tipiTurno.map(tipo => {
                      const config = getTurnoConfig(giorno, tipo);
                      return (
                        <TableCell key={tipo} align="center" sx={{ p: 1 }}>
                          {config ? (
                            <Box sx={{ 
                              p: 1, 
                              backgroundColor: '#e8f5e8', 
                              borderRadius: 1,
                              fontSize: '0.9em',
                              position: 'relative',
                              cursor: 'pointer',
                              '&:hover': { backgroundColor: '#d4edda' }
                            }}
                            onClick={() => handleEditTurno(config)}
                            >
                              <div style={{ fontWeight: 'bold' }}>
                                {config.oraInizio?.substring(0, 5)} - {config.oraFine?.substring(0, 5)}
                              </div>
                              <div style={{ fontSize: '0.8em', color: '#666' }}>
                                ({config.durataOre?.toFixed(1) || '0'} ore)
                              </div>
                              
                              <IconButton 
                                size="small" 
                                sx={{ position: 'absolute', top: 0, right: 0, p: 0.5 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  eliminaTurnoTemplate(config.id);
                                }}
                              >
                                <Delete fontSize="small" color="error" />
                              </IconButton>
                            </Box>
                          ) : (
                            <Box sx={{ 
                              p: 1, 
                              backgroundColor: '#f5f5f5', 
                              borderRadius: 1,
                              color: '#999',
                              fontSize: '0.9em',
                              cursor: 'pointer',
                              '&:hover': { backgroundColor: '#e0e0e0' }
                            }}
                            onClick={() => handleAddTurno(giorno, tipo)}
                            >
                              <Add fontSize="small" />
                              <div>Aggiungi Turno</div>
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
        </CardContent>
      </Card>

      {/* Quantità Personale */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">
              <People sx={{ mr: 1, verticalAlign: 'middle' }} />
              Quantità Personale - {mesi.find(m => m.value === selectedMonth)?.label} {selectedYear}
            </Typography>
            
            <Button
              startIcon={<Save />}
              onClick={salvaQuantitaPersonale}
              variant="contained"
              color="primary"
              disabled={saving}
            >
              {saving ? <CircularProgress size={20} /> : 'Salva Quantità'}
            </Button>
          </Box>
          
          <Alert severity="info" sx={{ mb: 2 }}>
            💡 <strong>Definisci:</strong> Quante persone devono lavorare in ogni turno per ogni giorno della settimana.
          </Alert>
          
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>
                    Giorno
                  </TableCell>
                  {tipiTurno.map(tipo => (
                    <TableCell key={tipo} align="center" sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>
                      {tipo}
                      <div style={{ fontSize: '0.8em', fontWeight: 'normal', color: '#666' }}>
                        (n° persone)
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              
              <TableBody>
                {giorni.map(giorno => (
                  <TableRow key={giorno}>
                    <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#fafafa' }}>
                      {giorno}
                    </TableCell>
                    
                    {tipiTurno.map(tipo => (
                      <TableCell key={tipo} align="center">
                        <TextField
                          type="number"
                          size="small"
                          value={getQuantitaConfig(giorno, tipo)}
                          onChange={(e) => updateQuantitaPersonale(giorno, tipo, e.target.value)}
                          inputProps={{
                            min: 0,
                            max: 10,
                            step: 1,
                            style: { textAlign: 'center' }
                          }}
                          sx={{ 
                            width: 80,
                            '& input': {
                              fontSize: '1.1em',
                              fontWeight: 'bold'
                            }
                          }}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Griglia Turni Generati */}
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">
              <CalendarMonth sx={{ mr: 1, verticalAlign: 'middle' }} />
              Turni Generati - {mesi.find(m => m.value === selectedMonth)?.label} {selectedYear}
            </Typography>
            
            <Button
              startIcon={<PlayArrow />}
              onClick={handleGenerateTurni}
              variant="contained"
              color="success"
              size="large"
              disabled={generating}
              sx={{
                minWidth: 200,
                fontSize: '1.1rem',
                fontWeight: 'bold'
              }}
            >
              {generating ? <CircularProgress size={20} color="inherit" /> : '🎲 Genera Turni'}
            </Button>
          </Box>
          
          {griglia ? (
            <Box>
              <Alert severity="success" sx={{ mb: 2 }}>
                ✅ Turni generati per {griglia.dipendenti?.length} dipendenti su {griglia.giorniMese?.length} giorni
              </Alert>
              
              {/* Griglia Completa Integrata */}
              <Paper sx={{ mt: 2, overflow: 'hidden' }}>
                <TableContainer sx={{ maxHeight: '600px' }}>
                  <Table stickyHeader size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', minWidth: 120 }}>
                          Dipendente
                        </TableCell>
                        {griglia.giorniMese?.map(giorno => (
                          <TableCell 
                            key={giorno} 
                            align="center" 
                            sx={{ 
                              fontWeight: 'bold', 
                              backgroundColor: '#f5f5f5',
                              minWidth: 80,
                              fontSize: '0.8rem'
                            }}
                          >
                            {giorno}
                            <div style={{ fontSize: '0.7rem', color: '#666' }}>
                              {getDayName(giorno)}
                            </div>
                          </TableCell>
                        ))}
                        <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#e3f2fd', minWidth: 80 }}>
                          Tot Ore
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    
                    <TableBody>
                      {griglia.dipendenti?.map(dipendente => (
                        <TableRow key={dipendente.codiceDipe}>
                          <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#fafafa' }}>
                            {dipendente.nome}
                            <div style={{ fontSize: '0.8rem', color: '#666' }}>
                              Target: {dipendente.oreMensili}h
                            </div>
                          </TableCell>
                          
                          {griglia.giorniMese?.map(giorno => {
                            const turniGiorno = griglia.turniPerDipendente?.[dipendente.codiceDipe]?.filter(
                              t => new Date(t.dataTurno).getDate() === giorno
                            ) || [];
                            
                            return (
                              <TableCell key={giorno} align="center" sx={{ p: 0.5 }}>
                                {turniGiorno.length > 0 ? (
                                  <Box>
                                    {turniGiorno.map((turno, idx) => (
                                      <Box
                                        key={idx}
                                        sx={{
                                          backgroundColor: getTurnoColor(turno.tipoTurno),
                                          borderRadius: 1,
                                          p: 0.5,
                                          mb: idx < turniGiorno.length - 1 ? 0.5 : 0,
                                          fontSize: '0.7rem',
                                          fontWeight: 'bold',
                                          cursor: 'pointer',
                                          '&:hover': {
                                            opacity: 0.8
                                          }
                                        }}
                                        title={`${turno.tipoTurno}: ${turno.oraInizio?.substring(0,5)}-${turno.oraFine?.substring(0,5)}`}
                                      >
                                        {getTurnoShort(turno.tipoTurno)}
                                        <div style={{ fontSize: '0.6rem' }}>
                                          {turno.oraInizio?.substring(0,5)}-{turno.oraFine?.substring(0,5)}
                                        </div>
                                      </Box>
                                    ))}
                                  </Box>
                                ) : (
                                  <Box sx={{ 
                                    color: '#999', 
                                    fontSize: '0.8rem',
                                    p: 1
                                  }}>
                                    -
                                  </Box>
                                )}
                              </TableCell>
                            );
                          })}
                          
                          <TableCell align="center" sx={{ 
                            fontWeight: 'bold', 
                            backgroundColor: getOreColor(griglia.oreTotaliPerDipendente?.[dipendente.codiceDipe] || 0, dipendente.oreMensili)
                          }}>
                            {griglia.oreTotaliPerDipendente?.[dipendente.codiceDipe] || 0}h
                            <div style={{ fontSize: '0.7rem', color: '#666' }}>
                              {getOreStatus(griglia.oreTotaliPerDipendente?.[dipendente.codiceDipe] || 0, dipendente.oreMensili)}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Box>
          ) : (
            <Alert severity="info">
              ℹ️ Nessun turno generato per questo periodo. Clicca "Genera Turni" per iniziare.
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Dialog per modifica turno template */}
      <Dialog open={editTurnoDialog.open} onClose={() => setEditTurnoDialog({ open: false, turno: null, isNew: false })}>
        <DialogTitle>
          {editTurnoDialog.isNew ? 'Nuovo Turno' : 'Modifica Turno'} - {editTurnoDialog.turno?.giornoSettimana} {editTurnoDialog.turno?.tipoTurno}
        </DialogTitle>
        
        <DialogContent sx={{ minWidth: 300 }}>
          {editTurnoDialog.turno && (
            <Box sx={{ pt: 1 }}>
              <TextField
                fullWidth
                label="Giorno"
                value={editTurnoDialog.turno.giornoSettimana || ''}
                disabled
                margin="normal"
              />
              
              <TextField
                fullWidth
                label="Tipo Turno"
                value={editTurnoDialog.turno.tipoTurno || ''}
                disabled
                margin="normal"
              />
              
              <TextField
                fullWidth
                type="time"
                label="Ora Inizio"
                value={editTurnoDialog.turno.oraInizio || '08:00'}
                onChange={(e) => setEditTurnoDialog(prev => ({
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
                value={editTurnoDialog.turno.oraFine || '14:00'}
                onChange={(e) => setEditTurnoDialog(prev => ({
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
          <Button onClick={() => setEditTurnoDialog({ open: false, turno: null, isNew: false })}>
            Annulla
          </Button>
          
          <Button onClick={salvaTurnoTemplate} variant="contained">
            {editTurnoDialog.isNew ? 'Aggiungi' : 'Salva'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default NegozioDetailPage;
