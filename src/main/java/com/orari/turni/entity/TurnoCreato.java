package com.orari.turni.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "turni_creati")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TurnoCreato {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    
    @Column(name = "codice_dipendente")
    private String codiceDipendente;
    
    @Column(name = "negozio")
    private String negozio;
    
    @Column(name = "data_turno")
    private LocalDate dataTurno;
    
    @Column(name = "tipo_turno")
    private String tipoTurno;
    
    @Column(name = "ora_inizio")
    private LocalTime oraInizio;
    
    @Column(name = "ora_fine")
    private LocalTime oraFine;
    
    @Column(name = "mese")
    private String mese;
    
    @Column(name = "anno")
    private Integer anno;
    
    @Column(name = "giorno_mese")
    private Integer giornoMese;
    
    @Column(name = "giorno_settimana")
    private Integer giornoSettimana;
    
    // Calcola la durata del turno in ore
    @Transient
    public double getDurataOre() {
        if (oraInizio != null && oraFine != null) {
            return (oraFine.toSecondOfDay() - oraInizio.toSecondOfDay()) / 3600.0;
        }
        return 0.0;
    }
}
