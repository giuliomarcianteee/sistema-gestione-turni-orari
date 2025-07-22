import React, { useState, useEffect } from 'react';
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
  TextField,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  ArrowBack,
  Save,
  CalendarMonth,
  Schedule,
  People,
  Add,
  Edit,
  Delete
} from '@mui/icons-material';
import { turniApi } from '../services/api';
import moment from 'moment';
import 'moment/locale/it';

moment.locale('it');

const ConfiguraTurniPage = () => {
  const { codice } = useParams();
  const navigate = useNavigate();
  
  const [currentMese, setCurrentMese] = useState(moment().format('YYYY-MM'));
  const [negozio, setNegozio] = useState(null);
  const [turniTemplate, setTurniTemplate] = useState([]);
  const [quantitaPersonale, setQuantitaPersonale] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  
  const [editTurnoDialog, setEditTurnoDialog] = useState({ 
    open: false, 
    turno: null, 
    isNew: false 
  });

  const giorni = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'];
  const tipiTurno = ['Mattina', 'Pomeriggio', 'Intermezzo'];

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

  useEffect(() => {
    loadData();
  }, [codice, currentMese]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Carica dettagli negozio
      const negozioResponse = await turniApi.getDettaglioNegozio(codice);
      setNegozio(negozioResponse.data);
      
      // Carica turni template dalla nuova API
      const turniResponse = await turniApi.getTurniTemplate(codice);
      setTurniTemplate(turniResponse.data || []);
      
      // Carica quantità personale
      const quantitaResponse = await turniApi.getQuantitaPersonale(codice, currentMese);
      
      // Inizializza quantità personale se vuota
      let quantitaData = quantitaResponse.data;
      if (!quantitaData || quantitaData.length === 0) {
        quantitaData = inizializzaQuantitaPersonale();
      }
      setQuantitaPersonale(quantitaData);
      
    } catch (err) {
      setError('Errore nel caricamento dei dati: ' + (err.response?.data?.message || err.message));
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const inizializzaQuantitaPersonale = () => {
    return giorni.map(giorno => ({
      id: null,
      negozio: codice,
      mese: converteMeseInItaliano(currentMese),
      giornoSettimana: giorno,
      mattina: 1,
      pomeriggio: 1,
      intermezzo: 1
    }));
  };

  const converteMeseInItaliano = (meseNumerico) => {
    const mesi = {
      '01': 'gennaio', '02': 'febbraio', '03': 'marzo', '04': 'aprile',
      '05': 'maggio', '06': 'giugno', '07': 'luglio', '08': 'agosto',
      '09': 'settembre', '10': 'ottobre', '11': 'novembre', '12': 'dicembre'
    };
    const [anno, mese] = meseNumerico.split('-');
    return mesi[mese] || 'gennaio';
  };

  const handleMeseChange = (event) => {
    const newMese = event.target.value;
    setCurrentMese(newMese);
  };

  const getTurnoConfig = (giorno, tipoTurno) => {
    return turniTemplate.find(t => 
      t.giornoSettimana === giorno && t.tipoTurno === tipoTurno
    );
  };

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
          mese: converteMeseInItaliano(currentMese),
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

  // Gestione turni template
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
      turno: { ...turno, 
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
      loadData(); // Ricarica i dati
      alert('✅ Turno salvato con successo!');
    } catch (err) {
      alert('❌ Errore nel salvare il turno: ' + (err.response?.data?.message || err.message));
    }
  };

  const eliminaTurnoTemplate = async (turnoId) => {
    if (window.confirm('Sei sicuro di voler eliminare questo turno?')) {
      try {
        await turniApi.eliminaTurnoTemplate(turnoId);
        loadData(); // Ricarica i dati
        alert('✅ Turno eliminato con successo!');
      } catch (err) {
        alert('❌ Errore nell\'eliminazione del turno: ' + (err.response?.data?.message || err.message));
      }
    }
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
            ⚙️ Configurazione Turni - {negozio?.nome}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Configura orari e quantità personale per {moment(currentMese).format('MMMM YYYY')}
          </Typography>
        </Box>
        
        {/* Selettore Mese */}
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>
            <CalendarMonth sx={{ mr: 1 }} />
            Seleziona Mese
          </InputLabel>
          <Select
            value={currentMese}
            onChange={handleMeseChange}
            label="Seleziona Mese"
          >
            {mesiOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Bottone indietro */}
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate(`/negozio/${codice}`)}
        variant="outlined"
        sx={{ mb: 3 }}
      >
        Torna al Negozio
      </Button>

      {/* Card per Turni Configurati - MODIFICABILE */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            <Schedule sx={{ mr: 1, verticalAlign: 'middle' }} />
            Turni Configurati (Orari) - MODIFICABILE
          </Typography>
          
          <Alert severity="warning" sx={{ mb: 2 }}>
            ⚠️ <strong>Attenzione:</strong> Qui puoi MODIFICARE gli orari dei turni. Questi orari verranno utilizzati per generare i turni mensili. Clicca su una cella per modificarla o aggiungere nuovi orari.
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
          
          <Box mt={2}>
            <Alert severity="info">
              💡 <strong>Come funziona:</strong><br/>
              - Clicca su "Aggiungi Turno" per creare un nuovo orario<br/>
              - Clicca su un turno esistente per modificarlo<br/>
              - Usa l'icona cancella per eliminare un turno<br/>
              - Questi orari saranno utilizzati nella generazione automatica
            </Alert>
          </Box>
        </CardContent>
      </Card>

      {/* Card per Quantità Personale */}
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">
              <People sx={{ mr: 1, verticalAlign: 'middle' }} />
              Quantità Personale Richiesta - {moment(currentMese).format('MMMM YYYY')}
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
          
          <Alert severity="warning" sx={{ mb: 2 }}>
            ⚠️ <strong>Importante:</strong> Questi numeri definiscono quante persone devono lavorare in ogni turno per ogni giorno della settimana. La generazione automatica rispetterà questi requisiti.
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
          
          <Box mt={2}>
            <Alert severity="info">
              💡 <strong>Come funziona:</strong><br/>
              - Se metti "2" in Mattina-Lunedì, la generazione creerà 2 turni mattutini per ogni lunedì del mese<br/>
              - Se metti "0", quel turno non verrà generato per quel giorno<br/>
              - La generazione rispetterà sia gli orari configurati che le quantità richieste
            </Alert>
          </Box>
        </CardContent>
      </Card>

      {/* Dialog per modifica/aggiunta turno template */}
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

export default ConfiguraTurniPage;
