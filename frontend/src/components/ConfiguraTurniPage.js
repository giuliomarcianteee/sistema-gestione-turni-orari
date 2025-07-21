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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Chip,
  Grid
} from '@mui/material';
import { 
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { turniApi } from '../services/api';
import { useParams, useNavigate } from 'react-router-dom';

const ConfiguraTurniPage = () => {
  const { codiceNegozio } = useParams();
  const navigate = useNavigate();
  
  const [negozio, setNegozio] = useState(null);
  const [turni, setTurni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTurno, setEditingTurno] = useState(null);
  const [formData, setFormData] = useState({
    giornoSettimana: 'Lunedì',
    tipoTurno: 'Mattina',
    oraInizio: '08:30',
    oraFine: '14:30'
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const giorniSettimana = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'];
  const tipiTurno = ['Mattina', 'Pomeriggio', 'Intermezzo'];

  useEffect(() => {
    loadData();
  }, [codiceNegozio]);

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await turniApi.getDettaglioNegozio(codiceNegozio);
      setNegozio(response.data);
      
      // Carica i turni configurati per questo negozio
      await loadTurni();
    } catch (error) {
      console.error('Errore nel caricamento dati:', error);
      setSnackbar({ open: true, message: 'Errore nel caricamento dei dati', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const loadTurni = async () => {
    try {
      // Assumiamo che ci sia un endpoint per ottenere i turni configurati
      // Per ora simulo con dati mock basati sulla tabella turni
      const mockTurni = [];
      giorniSettimana.forEach(giorno => {
        tipiTurno.forEach(tipo => {
          let oraInizio = '08:30';
          let oraFine = '14:30';
          
          if (tipo === 'Pomeriggio') {
            oraInizio = '14:30';
            oraFine = '20:30';
          } else if (tipo === 'Intermezzo') {
            oraInizio = '12:00';
            oraFine = '19:00';
          }
          
          mockTurni.push({
            id: `${giorno}-${tipo}`,
            giornoSettimana: giorno,
            tipoTurno: tipo,
            oraInizio,
            oraFine
          });
        });
      });
      
      setTurni(mockTurni);
    } catch (error) {
      console.error('Errore nel caricamento turni:', error);
    }
  };

  const handleOpenDialog = (turno = null) => {
    if (turno) {
      setEditingTurno(turno);
      setFormData({
        giornoSettimana: turno.giornoSettimana,
        tipoTurno: turno.tipoTurno,
        oraInizio: turno.oraInizio,
        oraFine: turno.oraFine
      });
    } else {
      setEditingTurno(null);
      setFormData({
        giornoSettimana: 'Lunedì',
        tipoTurno: 'Mattina',
        oraInizio: '08:30',
        oraFine: '14:30'
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingTurno(null);
  };

  const handleSave = async () => {
    try {
      // Implementa il salvataggio del turno
      console.log('Salvataggio turno:', formData);
      
      if (editingTurno) {
        // Modifica turno esistente
        const updatedTurni = turni.map(t => 
          t.id === editingTurno.id 
            ? { ...t, ...formData, id: `${formData.giornoSettimana}-${formData.tipoTurno}` }
            : t
        );
        setTurni(updatedTurni);
      } else {
        // Aggiungi nuovo turno
        const nuovoTurno = {
          id: `${formData.giornoSettimana}-${formData.tipoTurno}-${Date.now()}`,
          ...formData
        };
        setTurni([...turni, nuovoTurno]);
      }
      
      setSnackbar({ open: true, message: 'Turno salvato con successo', severity: 'success' });
      handleCloseDialog();
    } catch (error) {
      console.error('Errore nel salvataggio:', error);
      setSnackbar({ open: true, message: 'Errore nel salvataggio', severity: 'error' });
    }
  };

  const handleDelete = async (turnoId) => {
    try {
      setTurni(turni.filter(t => t.id !== turnoId));
      setSnackbar({ open: true, message: 'Turno eliminato con successo', severity: 'success' });
    } catch (error) {
      console.error('Errore nell\'eliminazione:', error);
      setSnackbar({ open: true, message: 'Errore nell\'eliminazione', severity: 'error' });
    }
  };

  const getTurniPerGiorno = (giorno) => {
    return turni.filter(t => t.giornoSettimana === giorno);
  };

  const formatTime = (time) => {
    return time ? time.substring(0, 5) : '';
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
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <ScheduleIcon color="primary" />
        <Typography variant="h4">
          Configurazione Turni - {negozio?.nome}
        </Typography>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Griglia Turni</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Aggiungi Turno
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Giorno</strong></TableCell>
                <TableCell><strong>Mattina</strong></TableCell>
                <TableCell><strong>Pomeriggio</strong></TableCell>
                <TableCell><strong>Intermezzo</strong></TableCell>
                <TableCell><strong>Azioni</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {giorniSettimana.map((giorno) => {
                const turniGiorno = getTurniPerGiorno(giorno);
                const mattina = turniGiorno.filter(t => t.tipoTurno === 'Mattina');
                const pomeriggio = turniGiorno.filter(t => t.tipoTurno === 'Pomeriggio');
                const intermezzo = turniGiorno.filter(t => t.tipoTurno === 'Intermezzo');

                return (
                  <TableRow key={giorno}>
                    <TableCell><strong>{giorno}</strong></TableCell>
                    <TableCell>
                      {mattina.map(turno => (
                        <Chip
                          key={turno.id}
                          label={`${formatTime(turno.oraInizio)} - ${formatTime(turno.oraFine)}`}
                          size="small"
                          sx={{ mr: 1, mb: 1 }}
                          onClick={() => handleOpenDialog(turno)}
                          onDelete={() => handleDelete(turno.id)}
                        />
                      ))}
                    </TableCell>
                    <TableCell>
                      {pomeriggio.map(turno => (
                        <Chip
                          key={turno.id}
                          label={`${formatTime(turno.oraInizio)} - ${formatTime(turno.oraFine)}`}
                          size="small"
                          sx={{ mr: 1, mb: 1 }}
                          onClick={() => handleOpenDialog(turno)}
                          onDelete={() => handleDelete(turno.id)}
                        />
                      ))}
                    </TableCell>
                    <TableCell>
                      {intermezzo.map(turno => (
                        <Chip
                          key={turno.id}
                          label={`${formatTime(turno.oraInizio)} - ${formatTime(turno.oraFine)}`}
                          size="small"
                          sx={{ mr: 1, mb: 1 }}
                          onClick={() => handleOpenDialog(turno)}
                          onDelete={() => handleDelete(turno.id)}
                        />
                      ))}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog()}
                        title="Aggiungi turno per questo giorno"
                      >
                        <AddIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="outlined"
          onClick={() => navigate(`/negozi/${codiceNegozio}`)}
        >
          Torna al Negozio
        </Button>
        <Button
          variant="contained"
          onClick={() => navigate(`/negozi/${codiceNegozio}/griglia`)}
        >
          Visualizza Griglia Orari
        </Button>
      </Box>

      {/* Dialog per modifica/aggiunta turno */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingTurno ? 'Modifica Turno' : 'Aggiungi Turno'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <TextField
                select
                fullWidth
                label="Giorno della settimana"
                value={formData.giornoSettimana}
                onChange={(e) => setFormData({...formData, giornoSettimana: e.target.value})}
                SelectProps={{ native: true }}
              >
                {giorniSettimana.map(giorno => (
                  <option key={giorno} value={giorno}>{giorno}</option>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                select
                fullWidth
                label="Tipo turno"
                value={formData.tipoTurno}
                onChange={(e) => setFormData({...formData, tipoTurno: e.target.value})}
                SelectProps={{ native: true }}
              >
                {tipiTurno.map(tipo => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                type="time"
                fullWidth
                label="Ora inizio"
                value={formData.oraInizio}
                onChange={(e) => setFormData({...formData, oraInizio: e.target.value})}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                type="time"
                fullWidth
                label="Ora fine"
                value={formData.oraFine}
                onChange={(e) => setFormData({...formData, oraFine: e.target.value})}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annulla</Button>
          <Button onClick={handleSave} variant="contained">
            {editingTurno ? 'Salva' : 'Aggiungi'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar per notifiche */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({...snackbar, open: false})}
      >
        <Alert severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ConfiguraTurniPage;
