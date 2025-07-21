<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Sistema di Gestione Turni Orari - Istruzioni per Copilot

Questo è un progetto full-stack per la gestione dei turni di lavoro dei punti vendita.

## Architettura del Progetto

### Backend (Spring Boot)
- **Linguaggio**: Java 17
- **Framework**: Spring Boot 3.2 con Maven
- **Database**: MySQL con schema `orari`
- **Pattern**: REST API con architettura layered (Controller → Service → Repository → Entity)

### Frontend (React)
- **Linguaggio**: JavaScript (ES6+)
- **Framework**: React 18 con Material-UI
- **Routing**: React Router DOM
- **HTTP Client**: Axios per chiamate API

## Convenzioni di Codice

### Backend Java
- Usa annotazioni Lombok per ridurre boilerplate (`@Data`, `@NoArgsConstructor`, `@AllArgsConstructor`)
- Controller REST con mapping `/api/turni/*`
- Gestione errori con `ResponseEntity` e try-catch
- Transazioni con `@Transactional` sui servizi
- Query personalizzate con `@Query` quando necessario

### Frontend React
- Componenti funzionali con hooks (`useState`, `useEffect`)
- Material-UI per tutti i componenti UI
- Gestione stato locale (no Redux necessario)
- Async/await per chiamate API
- Moment.js per manipolazione date

## Regole di Business Principali

1. **Generazione Turni**: L'algoritmo deve rispettare:
   - Minimo 2 giorni di riposo non consecutivi
   - Alternanza dei tipi di turno
   - Ore contrattuali mensili
   - Fabbisogno personale per giorno/turno

2. **Validazioni**:
   - Turni non sovrapposti per stesso dipendente
   - Orari validi (inizio < fine)
   - Dipendenti attivi nel periodo

3. **UI/UX**:
   - Responsive design
   - Funzioni stampa ottimizzate
   - Feedback visuale per azioni utente
   - Conferme per operazioni distruttive

## Database Schema

### Tabelle Esistenti
- `negozi`: Codice, Neg, Coordinatore
- `dipendenti`: CodiceDIPE, NEG, NOME, Ore_Sett, etc.
- `turni`: Template orari per negozio/giorno
- `quantita_personale`: Fabbisogno personale

### Tabella Creata
- `turni_creati`: Turni generati dal sistema

## Pattern Comuni

### Gestione Errori Frontend
```javascript
try {
  const response = await api.call();
  // handle success
} catch (err) {
  setError('Messaggio errore');
  console.error('Error context:', err);
}
```

### Controller Backend
```java
@PostMapping("/endpoint")
public ResponseEntity<?> method(@RequestBody Dto request) {
  try {
    Result result = service.process(request);
    return ResponseEntity.ok(result);
  } catch (Exception e) {
    return ResponseEntity.badRequest()
      .body(Map.of("error", e.getMessage()));
  }
}
```

## Priorità di Sviluppo

1. **Correttezza** dei dati e logica business
2. **Usabilità** dell'interfaccia utente  
3. **Performance** delle query e rendering
4. **Manutenibilità** del codice

Quando suggerisci modifiche, considera sempre l'impatto sulle regole di business e l'esperienza utente.
