-- Creazione tabella turni_creati per memorizzare i turni generati
CREATE TABLE IF NOT EXISTS turni_creati (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    codice_dipendente VARCHAR(20) NOT NULL,
    negozio VARCHAR(3) NOT NULL,
    data_turno DATE NOT NULL,
    tipo_turno VARCHAR(50) NOT NULL,
    ora_inizio TIME NOT NULL,
    ora_fine TIME NOT NULL,
    mese VARCHAR(7) NOT NULL,
    anno INT NOT NULL,
    giorno_mese INT NOT NULL,
    giorno_settimana INT NOT NULL,
    
    INDEX idx_negozio_mese (negozio, mese),
    INDEX idx_dipendente (codice_dipendente),
    INDEX idx_data_turno (data_turno),
    
    CONSTRAINT fk_turni_creati_dipendente 
        FOREIGN KEY (codice_dipendente) 
        REFERENCES dipendenti(CodiceDIPE) 
        ON UPDATE CASCADE ON DELETE CASCADE,
        
    CONSTRAINT fk_turni_creati_negozio 
        FOREIGN KEY (negozio) 
        REFERENCES negozi(Codice) 
        ON UPDATE CASCADE ON DELETE CASCADE
);
