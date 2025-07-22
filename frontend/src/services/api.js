import axios from 'axios';

const API_BASE_URL = 'http://localhost:8090/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const turniApi = {
  // Negozi
  getAllNegozi: () => api.get('/turni/negozi'),
  getDettaglioNegozio: (codice) => api.get(`/turni/negozi/${codice}`),
  
  // Griglia orari
  getGrigliaOrari: (negozio, mese) => api.get(`/turni/griglia`, {
    params: { negozio, mese }
  }),
  
  // Generazione turni
  generaTurni: (request) => api.post('/turni/genera', request),
  
  // Gestione turni singoli
  salvaTurno: (turno) => api.post('/turni/turno', turno),
  eliminaTurno: (id) => api.delete(`/turni/turno/${id}`),
  scambiaTurni: (turno1, turno2) => api.post('/turni/scambia', null, {
    params: { turno1, turno2 }
  }),
  
  // QuantitaPersonale
  getQuantitaPersonale: (negozio, mese) => api.get(`/turni/quantita-personale/${negozio}/${mese}`),
  salvaQuantitaPersonale: (quantita) => api.post('/turni/quantita-personale', quantita),
  
  // Turni Template
  getTurniTemplate: (negozio) => api.get(`/turni/turni-template/${negozio}`),
  salvaTurnoTemplate: (turno) => api.post('/turni/turni-template', turno),
  eliminaTurnoTemplate: (id) => api.delete(`/turni/turni-template/${id}`),
};

export default api;
