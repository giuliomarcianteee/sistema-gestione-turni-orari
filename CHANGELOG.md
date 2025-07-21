# Changelog

Tutte le modifiche notevoli a questo progetto saranno documentate in questo file.

Il formato è basato su [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
e questo progetto segue il [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2025-07-21

### Aggiunto ✨
- **Sistema completo di gestione turni** con backend Spring Boot e frontend React
- **Algoritmo intelligente di generazione turni** con randomizzazione controllata
- **Interfaccia web responsive** con Material-UI design system
- **Configurazione turni personalizzabile** per ogni negozio
- **Griglia interattiva mensile** per visualizzazione e modifica turni
- **Sistema di stampa ottimizzato** per formato A4
- **API REST complete** per gestione negozi, dipendenti e turni
- **Database integration** con schema MySQL esistente 'orari'
- **Build automatico integrato** Maven con frontend plugin

### Funzionalità Backend 🚀
- **TurniController**: API per generazione, modifica e gestione turni
- **NegozioController**: Gestione punti vendita e dipendenti
- **GeneratoreTurniService**: Algoritmo avanzato con regole business
  - Rispetto ore contrattuali mensili
  - Minimo 2 giorni riposo non consecutivi
  - Alternanza tipi turno (Mattina/Pomeriggio/Intermezzo)
  - Distribuzione equa carico di lavoro
  - Randomizzazione per generazioni sempre diverse
- **JPA Entities**: Mapping completo su database esistente
- **Repository Layer**: Spring Data con query personalizzate

### Funzionalità Frontend ⚛️
- **HomePage**: Lista negozi con navigazione intuitiva
- **NegozioDetailPage**: Dettagli negozio e dipendenti
- **ConfiguraTurniPage**: Griglia configurazione turni settimanali
- **GrigliaOrariPage**: Vista mensile con modifica turni individuali
- **Responsive design**: Ottimizzato per desktop, tablet e mobile
- **Material-UI theming**: Design system consistente
- **React Router**: Navigazione SPA fluida

### Database Schema 🗄️
- **Integrazione schema esistente** senza modifiche strutturali
- **Nuova tabella turni_creati** per turni generati dal sistema
- **Mapping JPA completo** su tabelle esistenti:
  - negozi (punti vendita)
  - dipendenti (anagrafica personale)
  - turni (template orari)
  - quantita_personale (fabbisogno giornaliero)

### Architettura Tecnica 🏗️
- **Java 17** con Spring Boot 3.2.0
- **React 19.1.0** con Material-UI 7.2.0
- **MySQL 8.0+** database esistente
- **Maven** build system con frontend plugin
- **JPA/Hibernate** ORM per persistenza
- **Axios** HTTP client per comunicazione API
- **Moment.js** per gestione date

### Regole Business Implementate 📋
- **Riposi minimi**: 2+ giorni non consecutivi per dipendente
- **Ore contrattuali**: Bilanciamento automatico ore mensili
- **Alternanza turni**: Evita monotonia con rotazione intelligente
- **Fabbisogno copertura**: Rispetta necessità operative giornaliere
- **Equità distribuzione**: Carico di lavoro uniforme tra dipendenti
- **Randomizzazione**: Ogni generazione produce risultati diversi

### Performance e Ottimizzazioni ⚡
- **Build produzione integrato**: Frontend compilato in target/classes/static
- **Query database ottimizzate**: JPA con join strategici
- **Lazy loading**: Caricamento progressivo dati frontend
- **Caching browser**: Risorse statiche con cache headers
- **Stampa ottimizzata**: CSS media queries per layout stampa

### Sicurezza 🔒
- **SQL injection prevention**: JPA parameterized queries
- **CORS configuration**: Configurazione sicura cross-origin
- **Input validation**: Bean Validation annotations
- **Error handling**: Gestione eccezioni centralizzata

### Documentazione 📚
- **README completo** con guida installazione e utilizzo
- **API documentation** con esempi request/response
- **Architecture overview** con diagrammi e spiegazioni
- **Troubleshooting guide** per problemi comuni
- **Development setup** per contributori

### Testing 🧪
- **Unit tests** per logica business critica
- **Integration tests** per API endpoints
- **Frontend tests** con React Testing Library
- **Build verification** con Maven lifecycle

---

## Versioni Future Pianificate

### [1.1.0] - Planned
- **Export Excel/PDF** delle griglie turni
- **Sistema notifiche** email per turni assegnati
- **Dashboard analytics** con metriche performance
- **API mobile** per app companion

### [1.2.0] - Planned  
- **Sistema permessi** utenti (admin/manager/viewer)
- **Backup automatico** configurazioni
- **Integrazione calendario** (Google Calendar, Outlook)
- **Tema personalizzabile** con dark mode

### [2.0.0] - Planned
- **Multi-tenant architecture** per più aziende
- **Advanced AI scheduling** con machine learning
- **Real-time collaboration** con WebSocket
- **Progressive Web App** per uso offline

---

*Legenda:*
- ✨ Aggiunto: Nuove funzionalità
- 🔧 Modificato: Cambiamenti a funzionalità esistenti  
- 🐛 Corretto: Bug fixes
- ❌ Rimosso: Funzionalità deprecate
- 🔒 Sicurezza: Vulnerability fixes
