# Contribuire al Sistema di Gestione Turni Orari

Grazie per il tuo interesse nel contribuire al progetto! 🎉

## 🚀 Come Contribuire

### 🐛 Segnalazione Bug
- Usa la sezione **Issues** di GitHub
- Descrivi chiaramente il problema
- Includi passi per riprodurre il bug
- Specifica il sistema operativo e le versioni usate

### 💡 Suggerimenti Feature
- Apri un **Issue** con label "enhancement"
- Descrivi il caso d'uso e i benefici
- Proponi una soluzione se possibile

### 🔧 Pull Requests
1. **Fork** il repository
2. Crea un **branch** per la tua feature: `git checkout -b feature/nuova-funzione`
3. **Commit** le modifiche: `git commit -m "Aggiunge nuova funzione"`
4. **Push** al branch: `git push origin feature/nuova-funzione`
5. Apri una **Pull Request**

## 📋 Guidelines di Sviluppo

### Backend (Java/Spring Boot)
- Usa **Java 17+** e Spring Boot 3.2
- Segui le **convenzioni Lombok** (`@Data`, `@Service`, etc.)
- Scrivi **test unitari** per la logica di business
- Documenta i metodi pubblici con **JavaDoc**

### Frontend (React)
- Usa **componenti funzionali** con hooks
- Applica **Material-UI** per consistenza UI
- Mantieni **responsiveness** per mobile
- Usa **PropTypes** per validazione props

### Database
- **NON** modificare lo schema esistente
- Usa **JPA annotations** per mapping
- Query personalizzate con `@Query` quando necessario

## 🎯 Aree di Contribuzione

### 🔧 Backend
- Miglioramenti algoritmo generazione turni
- Nuove API per funzionalità avanzate
- Ottimizzazioni performance database
- Sistema notifiche email/SMS

### 🎨 Frontend  
- Nuovi componenti UI riusabili
- Miglioramenti UX/UI design
- Dashboard analytics avanzate
- Tema scuro / personalizzazione

### 📊 Features Richieste
- **Export Excel/PDF** delle griglie
- **Sistema permessi** utenti (admin/manager/viewer)
- **Backup automatico** configurazioni
- **API mobile** per app companion
- **Reportistica avanzata** con grafici
- **Integrazione calendario** (Google Calendar, Outlook)

## 🧪 Testing

### Backend Tests
```bash
mvn test                    # Unit tests
mvn integration-test        # Integration tests
```

### Frontend Tests  
```bash
cd frontend
npm test                    # React tests
npm run test:coverage       # Coverage report
```

## 📝 Commit Messages

Usa **Conventional Commits**:
```
feat: aggiunge export Excel per griglia turni
fix: corregge bug calcolo ore mensili
docs: aggiorna README con nuove API
style: migliora layout responsive mobile
refactor: ottimizza algoritmo generazione turni
test: aggiunge test per TurniService
```

## 🔍 Code Review

Ogni PR sarà reviewata per:
- ✅ **Funzionalità** corretta e testata
- ✅ **Codice pulito** e ben documentato  
- ✅ **Performance** ottimali
- ✅ **Compatibilità** con versioni esistenti
- ✅ **Security** best practices

## 📞 Supporto

Per domande o aiuto:
- 📧 Apri un **Issue** per discussioni pubbliche
- 💬 Usa **Discussions** per domande generali
- 📋 Controlla la **documentazione** nel README

## 🎉 Riconoscimenti

I contributori saranno riconosciuti nel README e nelle release notes.

Grazie per rendere questo progetto sempre migliore! 🚀
