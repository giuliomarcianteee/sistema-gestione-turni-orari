# 📋 Sistema di Gestione Turni Orari

> **Un'applicazione web completa per la gestione intelligente dei turni di lavoro dei punti vendita**

![Java](https://img.shields.io/badge/Java-17-orange) ![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.0-brightgreen) ![React](https://img.shields.io/badge/React-19.1.0-blue) ![MySQL](https://img.shields.io/badge/MySQL-8.0+-blue)

---

## 📖 Indice

1. [Panoramica](#-panoramica)
2. [Funzionalità Principali](#-funzionalità-principali)
3. [Architettura Tecnica](#️-architettura-tecnica)
4. [Installazione](#-installazione)
5. [Utilizzo dell'Applicazione](#-utilizzo-dellapplicazione)
6. [Algoritmo di Generazione Turni](#-algoritmo-di-generazione-turni)
7. [Struttura del Progetto](#-struttura-del-progetto)
8. [API Reference](#-api-reference)
9. [Configurazione Database](#️-configurazione-database)
10. [Sviluppo e Personalizzazione](#-sviluppo-e-personalizzazione)
11. [Troubleshooting](#-troubleshooting)

---

## 🎯 Panoramica

Il **Sistema di Gestione Turni Orari** è una soluzione full-stack progettata per automatizzare e ottimizzare la pianificazione dei turni di lavoro nei punti vendita. L'applicazione combina un potente algoritmo di generazione automatica con un'interfaccia utente intuitiva per la gestione manuale.

### 🚀 Caratteristiche Distintive

- **🤖 Generazione Automatica Intelligente**: Algoritmo avanzato che rispetta regole aziendali complesse
- **🎲 Randomizzazione Controllata**: Ogni generazione produce turni sempre diversi mantenendo l'equità
- **📱 Interfaccia Responsive**: Design ottimizzato per desktop, tablet e dispositivi mobili
- **🖨️ Stampa Professionale**: Layout ottimizzato per stampa formato A4
- **⚡ Prestazioni Elevate**: Backend Spring Boot con frontend React per massima reattività

---

## ✨ Funzionalità Principali

### 🏪 **Gestione Negozi**
- **Vista panoramica** di tutti i punti vendita
- **Dettagli negozio** con informazioni dipendenti e configurazioni
- **Navigazione intuitiva** tra i diversi store
- **Configurazione personalizzata** per ogni punto vendita

### 👥 **Gestione Dipendenti**
- **Anagrafica completa** con ore contrattuali (settimanali/mensili)
- **Tracking automatico** delle ore lavorate
- **Visualizzazione stato** (attivo/inattivo)
- **Statistiche personalizzate** per ogni dipendente

### 🛠️ **Configurazione Turni**
- **Griglia interattiva** giorni della settimana × tipi di turno
- **Template personalizzabili** per ogni negozio
- **Gestione orari** con validazione automatica
- **Tipi turno**: Mattina, Pomeriggio, Intermezzo

### 🧠 **Generazione Turni Intelligente**

#### Algoritmo Avanzato che Rispetta:
- ✅ **Riposi minimi**: 2+ giorni non consecutivi
- ✅ **Alternanza turni**: Evita monotonia e stress
- ✅ **Ore contrattuali**: Bilancia automaticamente le ore mensili
- ✅ **Fabbisogno personale**: Rispetta le necessità operative
- ✅ **Equità distribuzione**: Carico di lavoro uniforme
- ✅ **Randomizzazione**: Ogni generazione è unica

### 📅 **Griglia Orari Interattiva**
- **Vista mensile completa** con tutti i dipendenti
- **Modifica in tempo reale** di singoli turni
- **Scambio turni** tra dipendenti con un click
- **Riepilogo ore** con evidenziazione scostamenti
- **Codice colore** per distinguere i tipi di turno

### �️ **Funzioni Stampa Avanzate**
- **Layout ottimizzato** per formato A4
- **Stampa a colori** per distinguere i turni
- **Versione B/N** per stampanti monocromatiche  
- **Intestazioni professionali** con dati negozio

---

## 🏗️ Architettura Tecnica

### **Backend (Spring Boot)**
```
├── 🚀 Spring Boot 3.2.0
├── ☕ Java 17
├── 🗄️ MySQL 8.0+ (Database esistente)
├── 🔗 JPA/Hibernate (ORM)
├── 🌐 REST API
├── 📊 Algoritmo personalizzabile
└── 🔧 Maven (Build System)
```

### **Frontend (React)**
```
├── ⚛️ React 19.1.0
├── 🎨 Material-UI 7.2.0 (Design System)
├── 🛣️ React Router DOM (Navigation)
├── 📡 Axios (HTTP Client)
├── 📅 Moment.js (Date Management)
└── 📦 NPM (Package Manager)
```

### **Database MySQL**
```sql
-- Database esistente 'orari' con struttura ottimizzata
├── negozi              (Punti vendita)
├── dipendenti          (Anagrafica personale)  
├── turni               (Template orari)
├── quantita_personale  (Fabbisogno giornaliero)
└── turni_creati       (Turni generati - NUOVA)
```

---

## 🚀 Installazione

### **Prerequisiti Sistema**
```bash
☕ Java 17+                 # OpenJDK o Oracle JDK
🟢 Node.js 18+             # Per il frontend React
🗄️ MySQL 8.0+              # Database server
📦 Maven 3.6+              # Build automation
```

### **1️⃣ Setup Database**
```sql
-- Il database 'orari' deve essere già configurato
-- Credenziali di default:
Host: localhost:3306
Database: orari
Username: root  
Password: @Ppsmith15048!
```

### **2️⃣ Clonazione e Setup**
```bash
# Clone del repository
git clone <repository-url>
cd Orari

# Verifica prerequisiti
java -version    # Deve essere 17+
node -version    # Deve essere 18+
mvn -version     # Deve essere 3.6+
```

### **3️⃣ Avvio Automatico (Raccomandato)**
```bash
# Build completo e avvio integrato
mvn clean spring-boot:run

# L'applicazione sarà disponibile su:
# 🌐 http://localhost:8090
```

### **4️⃣ Avvio Separato (Sviluppo)**
```bash
# Backend (Porta 8090)
mvn spring-boot:run

# Frontend (Porta 3000) - Nuovo terminale
cd frontend
npm install
npm start
```

---

## 📖 Utilizzo dell'Applicazione

### **🎯 Flusso di Lavoro Principale**

#### **Passo 1: Selezione Negozio**
1. 🏠 Accedi alla **Home Page** (`http://localhost:8090`)
2. 🏪 **Seleziona il negozio** dalla lista dei punti vendita
3. 👁️ Visualizza **dettagli negozio** e dipendenti

#### **Passo 2: Configurazione Turni**
1. ⚙️ Clicca su **"Configura Turni"**
2. 📋 Imposta la **griglia settimanale**:
   - **Righe**: Giorni della settimana (Lunedì → Domenica)
   - **Colonne**: Tipi turno (Mattina, Pomeriggio, Intermezzo)  
3. ⏰ Definisci **orari per ogni turno**
4. 💾 **Salva** la configurazione

#### **Passo 3: Generazione Turni**
1. 📅 Vai su **"Visualizza Griglia"**
2. 🗓️ **Seleziona il mese** desiderato
3. 🎲 Clicca **"Genera Turni"**
4. ⏳ Il sistema genera automaticamente i turni rispettando tutte le regole

#### **Passo 4: Gestione e Modifica**
1. 📊 **Visualizza la griglia** generata
2. ✏️ **Modifica turni singoli** cliccando sulla cella
3. 🔄 **Scambia turni** tra dipendenti
4. 📈 Controlla il **riepilogo ore mensili**
5. 🖨️ **Stampa** la pianificazione

### **🎨 Interfaccia Utente**

#### **Codici Colore**
- 🟡 **Mattina**: Giallo/Oro
- 🔵 **Pomeriggio**: Blu  
- 🟢 **Intermezzo**: Verde
- 🔴 **Straordinario**: Rosso
- ⚪ **Riposo**: Bianco

#### **Indicatori Visivi**
- ✅ **Ore OK**: Verde (entro target)
- ⚠️ **Ore Eccessive**: Arancione (>110% target)
- ❌ **Ore Insufficienti**: Rosso (<90% target)

---

## 🧠 Algoritmo di Generazione Turni

### **🎯 Obiettivi dell'Algoritmo**
L'algoritmo di generazione è progettato per bilanciare **efficienza operativa** e **benessere dei dipendenti**.

### **📏 Regole Applicate**

#### **1️⃣ Riposi e Benessere**
```java
✅ Minimo 2 giorni di riposo per settimana
✅ Riposi preferibilmente non consecutivi
✅ Massimo 5 giorni lavorativi consecutivi
✅ Alternanza dei tipi di turno per evitare monotonia
```

#### **2️⃣ Ore Contrattuali**
```java  
✅ Rispetto delle ore settimanali/mensili
✅ Tolleranza del ±10% per bilanciamenti
✅ Distribuzione equa tra tutti i dipendenti
✅ Priorità ai contratti part-time/full-time
```

#### **3️⃣ Fabbisogno Operativo**
```java
✅ Copertura richiesta per ogni giorno/turno
✅ Competenze specifiche per ruoli particolari
✅ Flessibilità per picchi di affluenza
✅ Backup automatico per assenze
```

### **🎲 Sistema di Randomizzazione**

#### **Elementi Casuali Multipli:**
1. **Seed Dinamico**: `System.currentTimeMillis()` per ogni generazione
2. **Fattore Casuale**: ±50 punti nel punteggio dipendenti  
3. **Ordine Giorni**: Shuffling intelligente per settimane
4. **Tipi Turno**: Ordine casuale (Mattina/Pomeriggio/Intermezzo)
5. **Candidati Equivalenti**: Selezione casuale tra dipendenti con punteggio simile

#### **Logica di Punteggio:**
```java
🔢 Punteggio Base: 1000 punti
➕ Bonus casuale: -50 a +50 punti  
➖ Penalità turni consecutivi: -500 punti
➕ Bonus variazione turni: +100 punti
➖ Penalità ore eccessive: -5 punti per ora
➕ Bonus ore sottoutilizzate: +10 punti per ora mancante
```

### **⚖️ Bilanciamento Automatico**
```java
1. Calcolo ore target per dipendente
2. Distribuzione iniziale con algoritmo greedy
3. Ottimizzazione locale con scambi intelligenti  
4. Verifica finale delle regole aziendali
5. Report discrepanze e suggerimenti
```

---

## 📁 Struttura del Progetto

### **🌳 Directory Tree**
```
Orari/
├── 📄 README.md                    # Documentazione
├── 📄 pom.xml                      # Maven configuration  
├── 📁 .github/
│   └── 📄 copilot-instructions.md  # AI assistant config
├── 📁 src/main/java/com/orari/turni/
│   ├── 📄 TurniManagementApplication.java
│   ├── 📁 config/                  # Configurazioni Spring
│   ├── 📁 controller/              # REST Controllers
│   │   ├── 📄 TurniController.java
│   │   └── 📄 NegozioController.java  
│   ├── 📁 dto/                     # Data Transfer Objects
│   │   ├── � GrigliaOrariDto.java
│   │   ├── 📄 TurnoCreatoDto.java
│   │   └── 📄 DipendenteDto.java
│   ├── 📁 entity/                  # JPA Entities
│   │   ├── 📄 Negozio.java
│   │   ├── 📄 Dipendente.java
│   │   ├── 📄 Turno.java
│   │   ├── 📄 QuantitaPersonale.java
│   │   └── 📄 TurnoCreato.java
│   ├── 📁 repository/              # Spring Data Repositories
│   │   ├── 📄 NegozioRepository.java
│   │   ├── 📄 DipendenteRepository.java
│   │   ├── 📄 TurnoRepository.java
│   │   ├── 📄 QuantitaPersonaleRepository.java
│   │   └── 📄 TurnoCreatoRepository.java
│   └── 📁 service/                 # Business Logic
│       ├── 📄 TurniService.java
│       ├── 📄 NegozioService.java
│       └── 📄 GeneratoreTurniService.java  # 🧠 Core Algorithm
├── 📁 src/main/resources/
│   ├── 📄 application.properties   # Spring configuration
│   └── 📁 static/                  # Frontend build output
└── 📁 frontend/
    ├── 📄 package.json             # NPM dependencies
    ├── 📁 public/                  # Static assets
    └── 📁 src/
        ├── 📄 App.js               # Main React component
        ├── 📁 components/          # React Components
        │   ├── 📄 HomePage.js      # 🏠 Landing page
        │   ├── 📄 NegozioDetailPage.js      # 🏪 Store details
        │   ├── 📄 ConfiguraTurniPage.js     # ⚙️ Shift configuration  
        │   └── 📄 GrigliaOrariPage.js       # 📅 Schedule grid
        └── 📁 services/            # API Services
            └── 📄 api.js           # HTTP client
```

### **🔧 File di Configurazione Principali**

#### **Backend Configuration**
```properties
# src/main/resources/application.properties
server.port=8090
spring.datasource.url=jdbc:mysql://localhost:3306/orari
spring.datasource.username=root  
spring.datasource.password=@Ppsmith15048!
spring.jpa.hibernate.ddl-auto=none
app.turni.rules.min-rest-days=2
app.turni.rules.max-consecutive-same-shift=3
```

#### **Frontend Configuration**  
```json
// frontend/package.json
{
  "name": "frontend",
  "version": "0.1.0",
  "dependencies": {
    "react": "^19.1.0",
    "@mui/material": "^7.2.0",
    "axios": "^1.10.0",
    "moment": "^2.30.1"
  }
}
```

---

## 🌐 API Reference

### **🏪 Negozi Endpoints**

#### `GET /api/turni/negozi`
Recupera la lista di tutti i negozi
```json
// Response
[
  {
    "codice": "001",
    "nome": "Negozio Centro",
    "coordinatore": "Mario Rossi"
  }
]
```

#### `GET /api/turni/negozi/{codiceNegozio}`  
Dettagli negozio con dipendenti
```json
// Response  
{
  "negozio": {
    "codice": "001", 
    "nome": "Negozio Centro"
  },
  "dipendenti": [
    {
      "codiceDipe": "EMP001",
      "nome": "Giuseppe Verdi",
      "oreMensili": 168
    }
  ]
}
```

### **📅 Turni Endpoints**

#### `POST /api/turni/genera`
Genera turni automaticamente
```json
// Request
{
  "negozio": "001",
  "mese": "2025-07"
}

// Response
{
  "success": true,
  "turniCreati": 45,
  "message": "Turni generati con successo"
}
```

#### `GET /api/turni/griglia`
Recupera griglia orari mensile
```json
// Request params: ?negozio=001&mese=2025-07

// Response
{
  "negozio": "001",
  "mese": "2025-07", 
  "dipendenti": [...],
  "turniPerDipendente": {
    "EMP001": [
      {
        "data": "2025-07-01",
        "tipoTurno": "Mattina",
        "oraInizio": "08:00",
        "oraFine": "14:00"
      }
    ]
  },
  "giorniMese": [1,2,3,...,31]
}
```

#### `POST /api/turni/turno`
Salva/modifica singolo turno
```json
// Request
{
  "codiceDipendente": "EMP001",
  "negozio": "001", 
  "dataTurno": "2025-07-15",
  "tipoTurno": "Pomeriggio",
  "oraInizio": "14:00",
  "oraFine": "20:00"
}
```

#### `DELETE /api/turni/turno/{id}`
Elimina turno specifico

#### `POST /api/turni/scambia`
Scambia turni tra dipendenti
```json
// Request
{
  "idTurno1": 123,
  "idTurno2": 456
}
```

### **⚙️ Configurazione Endpoints**

#### `GET /api/turni/template/{negozio}`
Template turni configurati
```json
// Response
[
  {
    "giornoSettimana": "Lunedì",
    "tipoTurno": "Mattina", 
    "oraInizio": "08:00",
    "oraFine": "14:00"
  }
]
```

#### `POST /api/turni/template`  
Salva template turno
```json  
// Request
{
  "negozio": "001",
  "giornoSettimana": "Lunedì",
  "tipoTurno": "Mattina",
  "oraInizio": "08:00", 
  "oraFine": "14:00"
}
```

---

## �️ Configurazione Database

### **Schema Database `orari`**

#### **Tabella `negozi`**
```sql
CREATE TABLE negozi (
    Codice VARCHAR(10) PRIMARY KEY,
    Neg VARCHAR(100) NOT NULL,
    Coordinatore VARCHAR(100)
);
```

#### **Tabella `dipendenti`**  
```sql
CREATE TABLE dipendenti (
    CodiceDIPE VARCHAR(20) PRIMARY KEY,
    NEG VARCHAR(10) NOT NULL,
    NOME VARCHAR(100) NOT NULL,
    Ore_Sett INT,
    Ore_Mese INT,
    Attivo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (NEG) REFERENCES negozi(Codice)
);
```

#### **Tabella `turni`** (Template)
```sql
CREATE TABLE turni (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    negozio VARCHAR(10) NOT NULL,
    giorno_settimana ENUM('Lunedì','Martedì','Mercoledì','Giovedì','Venerdì','Sabato','Domenica'),
    tipo_turno ENUM('Mattina','Pomeriggio','Intermezzo'),
    ora_inizio TIME NOT NULL,
    ora_fine TIME NOT NULL,
    FOREIGN KEY (negozio) REFERENCES negozi(Codice)
);
```

#### **Tabella `quantita_personale`** (Fabbisogno)
```sql
CREATE TABLE quantita_personale (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    negozio VARCHAR(10) NOT NULL,
    mese VARCHAR(20) NOT NULL,
    giorno_settimana ENUM('Lunedì','Martedì','Mercoledì','Giovedì','Venerdì','Sabato','Domenica'),
    mattina INT DEFAULT 0,
    pomeriggio INT DEFAULT 0, 
    intermezzo INT DEFAULT 0,
    FOREIGN KEY (negozio) REFERENCES negozi(Codice)
);
```

#### **Tabella `turni_creati`** (Generati)
```sql
CREATE TABLE turni_creati (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    codice_dipendente VARCHAR(20) NOT NULL,
    negozio VARCHAR(10) NOT NULL,
    data_turno DATE NOT NULL,
    tipo_turno ENUM('Mattina','Pomeriggio','Intermezzo') NOT NULL,
    ora_inizio TIME NOT NULL,
    ora_fine TIME NOT NULL,
    mese VARCHAR(10) NOT NULL,
    anno INT NOT NULL,
    giorno_mese INT NOT NULL,
    giorno_settimana INT NOT NULL,
    FOREIGN KEY (codice_dipendente) REFERENCES dipendenti(CodiceDIPE),
    FOREIGN KEY (negozio) REFERENCES negozi(Codice)
);
```

### **🔧 Script di Setup Iniziale**
```sql
-- Inserimento negozi di esempio
INSERT INTO negozi (Codice, Neg, Coordinatore) VALUES
('001', 'Negozio Centro', 'Mario Rossi'),
('002', 'Negozio Periferia', 'Anna Bianchi');

-- Inserimento dipendenti di esempio  
INSERT INTO dipendenti (CodiceDIPE, NEG, NOME, Ore_Sett, Ore_Mese, Attivo) VALUES
('EMP001', '001', 'Giuseppe Verdi', 40, 168, TRUE),
('EMP002', '001', 'Maria Rossi', 30, 126, TRUE);

-- Template turni standard
INSERT INTO turni (negozio, giorno_settimana, tipo_turno, ora_inizio, ora_fine) VALUES
('001', 'Lunedì', 'Mattina', '08:00:00', '14:00:00'),
('001', 'Lunedì', 'Pomeriggio', '14:00:00', '20:00:00');
```

---

## 🛠️ Sviluppo e Personalizzazione

### **🔧 Configurazione Regole Business**

#### **File `application.properties`**
```properties
# Regole turni personalizzabili
app.turni.rules.min-rest-days=2
app.turni.rules.max-consecutive-same-shift=3
app.turni.rules.max-hours-per-week=48
app.turni.rules.min-hours-per-week=20
app.turni.rules.overtime-threshold=1.1
app.turni.rules.undertime-threshold=0.9
```

#### **Personalizzazione Algoritmo**
```java
// GeneratoreTurniService.java - Modifiche esempio

@Value("${app.turni.rules.prefer-weekends:true}")
private boolean preferWeekends; // Preferenza weekend

@Value("${app.turni.rules.max-night-shifts:2}")  
private int maxNightShifts; // Limite turni notturni

// Aggiungi logica personalizzata
private int calcolaPunteggioPersonalizzato(Dipendente dipendente) {
    int punteggio = punteggioBase;
    
    // Esempio: bonus per seniority
    if (dipendente.getAnniServizio() > 5) {
        punteggio += 100;
    }
    
    // Esempio: malus per assenze recenti
    if (haAssenzeRecenti(dipendente)) {
        punteggio -= 200;
    }
    
    return punteggio;
}
```

### **🎨 Personalizzazione Frontend**

#### **Temi Material-UI**
```javascript
// src/theme.js - Tema personalizzato
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Blu aziendale
    },
    secondary: {
      main: '#dc004e', // Rosso accento
    },
    turni: {
      mattina: '#fff3cd',    // Giallo mattina
      pomeriggio: '#d1ecf1', // Blu pomeriggio  
      intermezzo: '#d4edda', // Verde intermezzo
    }
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  }
});
```

#### **Componenti Personalizzati**
```javascript
// src/components/CustomTurnoCell.js
import React from 'react';
import { Chip, Tooltip } from '@mui/material';

const CustomTurnoCell = ({ turno, onClick, dipendente }) => {
  const getColor = (tipo) => {
    switch(tipo) {
      case 'Mattina': return 'warning';
      case 'Pomeriggio': return 'info'; 
      case 'Intermezzo': return 'success';
      default: return 'default';
    }
  };

  return (
    <Tooltip title={`${dipendente.nome} - ${turno.oraInizio}-${turno.oraFine}`}>
      <Chip
        label={turno.tipoTurno}
        color={getColor(turno.tipoTurno)}
        onClick={onClick}
        sx={{
          fontSize: '0.75rem',
          height: '24px',
          cursor: 'pointer'
        }}
      />
    </Tooltip>
  );
};
```

### **📊 Aggiunta Nuove Funzionalità**

#### **Esempio: Sistema Notifiche**
```java
// service/NotificationService.java
@Service
public class NotificationService {
    
    public void notificaTurniGenerati(String negozio, int numeroTurni) {
        // Email notification
        emailService.sendTurniGeneratedNotification(negozio, numeroTurni);
        
        // Sistema log
        log.info("Turni generati per negozio {}: {} turni", negozio, numeroTurni);
    }
    
    public void notificaConflittiTurni(List<ConflittoTurno> conflitti) {
        conflitti.forEach(conflitto -> {
            log.warn("Conflitto turno: {}", conflitto);
        });
    }
}
```

#### **Esempio: Export Excel**  
```java
// controller/ExportController.java
@RestController
@RequestMapping("/api/export")
public class ExportController {
    
    @GetMapping("/excel")
    public ResponseEntity<byte[]> exportToExcel(
            @RequestParam String negozio,
            @RequestParam String mese) {
        
        byte[] excelData = excelExportService.generateExcel(negozio, mese);
        
        return ResponseEntity.ok()
                .header("Content-Type", "application/vnd.ms-excel")
                .header("Content-Disposition", "attachment; filename=turni.xlsx")
                .body(excelData);
    }
}
```

---

## 🆘 Troubleshooting

### **❌ Problemi Comuni e Soluzioni**

#### **🔥 Errore di Connessione Database**
```bash
Error: Access denied for user 'root'@'localhost'

✅ Soluzioni:
1. Verifica credenziali in application.properties
2. Controlla che MySQL sia in esecuzione: sudo systemctl start mysql
3. Testa connessione: mysql -u root -p
4. Verifica permessi utente database
```

#### **🔥 Port 8090 già in uso**
```bash
Error: Port 8090 is already in use

✅ Soluzioni:
1. Trova processo: lsof -i :8090
2. Termina processo: kill -9 <PID>
3. O cambia porta in application.properties: server.port=8091
```

#### **🔥 Frontend non carica**
```bash
Error: Module not found

✅ Soluzioni:
1. Reinstalla dipendenze: cd frontend && rm -rf node_modules && npm install
2. Cancella cache: npm cache clean --force
3. Verifica versione Node: node -v (deve essere 18+)
```

#### **🔥 Turni non vengono generati**
```bash
Nessun turno creato dopo la generazione

✅ Diagnosi:
1. Verifica dati in tabella quantita_personale
2. Controlla presenza dipendenti attivi
3. Verifica template turni configurati
4. Controlla log applicazione per errori
```

### **📋 Checklist Pre-Deploy**
```bash
✅ Database MySQL avviato e accessibile
✅ Schema 'orari' presente con tutte le tabelle
✅ Dati di esempio inseriti (negozi, dipendenti)
✅ Java 17+ installato
✅ Maven 3.6+ installato  
✅ Node.js 18+ installato
✅ Porta 8090 disponibile
✅ File application.properties configurato
✅ Build completo eseguito: mvn clean package
```

### **🔍 Debug e Log**

#### **Log Applicazione**
```bash
# Visualizza log real-time
tail -f logs/application.log

# Cerca errori specifici  
grep -i error logs/application.log

# Log database queries (dev mode)
# application.properties: logging.level.org.hibernate.SQL=DEBUG
```

#### **Debug Frontend**
```javascript
// Browser Developer Tools
Console → Network → XHR  // Verifica chiamate API
Console → Console        // Errori JavaScript  
Application → Local Storage // Dati memorizzati
```

### **📞 Supporto e Risorse**

#### **Log Files Location**
```bash
📁 Backend logs: target/logs/
📁 Frontend build: frontend/build/
📁 Maven logs: target/surefire-reports/
```

#### **Informazioni di Debug**
```bash
# Informazioni sistema
java -version
mvn -version  
node -version
mysql --version

# Test connessione database
mysql -u root -p orari -e "SHOW TABLES;"

# Test endpoint API
curl http://localhost:8090/api/turni/negozi
```

---

## 📄 Licenza e Crediti

### **📋 Informazioni Progetto**
- **Nome**: Sistema di Gestione Turni Orari
- **Versione**: 1.0.0
- **Tipo**: Applicazione Web Full-Stack
- **Licenza**: Proprietaria / Uso Interno Aziendale

### **🛠️ Tecnologie Utilizzate**
- **Backend**: Spring Boot 3.2.0, Java 17, MySQL 8.0+
- **Frontend**: React 19.1.0, Material-UI 7.2.0
- **Build Tools**: Maven, NPM
- **Database**: MySQL con schema esistente 'orari'

### **👨‍💻 Sviluppo**
Progetto sviluppato per la gestione automatizzata dei turni di lavoro nei punti vendita, con focus su:
- **Algoritmi intelligenti** per la distribuzione equa dei turni
- **Interfaccia utente intuitiva** per la gestione manuale
- **Integrazione database esistente** senza modifiche strutturali
- **Architettura scalabile** per futuri sviluppi

---

**📞 Per supporto tecnico o richieste di personalizzazione, consultare i log dell'applicazione e la documentazione API.**

🎯 **Buona gestione dei turni!** 🎯

### Database
Utilizza il database esistente `orari` con tabelle:
- `negozi` - Informazioni punti vendita
- `dipendenti` - Anagrafica personale
- `turni` - Template orari per negozio/giorno
- `quantita_personale` - Fabbisogno personale per giorno
- `turni_creati` - Turni generati dal sistema (nuova)

## Installazione e Setup

### Prerequisiti
- Java 17+
- Node.js 18+
- MySQL 8.0+
- Maven 3.6+

### Configurazione Database
Il database MySQL `orari` deve essere già configurato con:
- Host: localhost:3306
- Username: root
- Password: @Ppsmith15048!

### Avvio Backend
```bash
# Dalla directory root del progetto
mvn spring-boot:run
```
Il backend sarà disponibile su `http://localhost:8080`

### Avvio Frontend
```bash
# Dalla directory frontend
cd frontend
npm install
npm start
```
Il frontend sarà disponibile su `http://localhost:3000`

### Build Completo
```bash
# Build di entrambi frontend e backend
mvn clean package
```

## Utilizzo

### 1. Selezione Negozio
- Accedi alla home page
- Scegli il negozio da gestire dalla lista

### 2. Generazione Turni
- Seleziona il mese desiderato
- Clicca su "Genera Turni" per creare automaticamente i turni
- Il sistema applicherà tutte le regole configurate

### 3. Visualizzazione e Modifica
- Clicca su "Visualizza Griglia" per vedere i turni generati
- Modifica singoli turni cliccando sulla cella
- Scambia turni selezionando due celle e usando "Scambia Turni"

### 4. Stampa
- Usa il pulsante "Stampa" per ottenere una versione ottimizzata
- La stampa include la griglia e il riepilogo ore

## Regole di Generazione Turni

Il sistema rispetta automaticamente:

1. **Riposi minimi**: Ogni dipendente ha almeno 2 giorni di riposo
2. **Alternanza turni**: Evita troppi turni consecutivi dello stesso tipo
3. **Ore contrattuali**: Bilancia per raggiungere le ore mensili
4. **Fabbisogno**: Rispetta le quantità richieste per giorno/turno
5. **Equità**: Distribuisce il carico di lavoro uniformemente

## Personalizzazione

### Aggiungere Nuove Regole
Le regole sono configurabili nel file `GeneratoreTurniService.java`:
```java
@Value("${app.turni.rules.min-rest-days:2}")
private int minRestDays;
```

### Tipi di Turno Supportati
- **Mattina**: Turni mattutini
- **Pomeriggio**: Turni pomeridiani  
- **Intermezzo**: Turni intermedi
- **Special**: Turni speciali/straordinari

## Sviluppo

### Struttura del Codice
```
├── src/main/java/com/orari/turni/
│   ├── entity/          # Entità JPA
│   ├── repository/      # Repository Spring Data
│   ├── service/         # Logica di business
│   ├── controller/      # REST Controllers
│   ├── dto/             # Data Transfer Objects
│   └── config/          # Configurazioni
├── frontend/src/
│   ├── components/      # Componenti React
│   ├── services/        # Servizi API
│   └── App.js           # App principale
```

### API Endpoints
- `GET /api/turni/negozi` - Lista negozi
- `GET /api/turni/negozi/{codice}` - Dettaglio negozio
- `GET /api/turni/griglia` - Griglia orari
- `POST /api/turni/genera` - Genera turni
- `POST /api/turni/turno` - Salva turno
- `DELETE /api/turni/turno/{id}` - Elimina turno
- `POST /api/turni/scambia` - Scambia turni

## Supporto

Per problemi o richieste di funzionalità, consultare:
- Log dell'applicazione: `logs/`
- Console browser per errori frontend
- Database per verifica dati

## Licenza

Questo progetto è proprietario e destinato all'uso interno aziendale.
