package com.orari.turni.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalTime;

@Entity
@Table(name = "turni")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Turno {
    
    @Id
    @Column(name = "id")
    private Long id;
    
    @Column(name = "Neg")
    private String negozio;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "gg_sett")
    private GiornoSettimana giornoSettimana;
    
    @Column(name = "turno")
    private String tipoTurno;
    
    @Column(name = "ora_inizio")
    private LocalTime oraInizio;
    
    @Column(name = "ora_fine")
    private LocalTime oraFine;
    
    public enum GiornoSettimana {
        Lunedì, Martedì, Mercoledì, Giovedì, Venerdì, Sabato, Domenica
    }
    
    // Calcola la durata del turno in ore
    @Transient
    public double getDurataOre() {
        if (oraInizio != null && oraFine != null) {
            return (oraFine.toSecondOfDay() - oraInizio.toSecondOfDay()) / 3600.0;
        }
        return 0.0;
    }
}
