package com.orari.turni.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "quantita_personale")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuantitaPersonale {
    
    @Id
    @Column(name = "id")
    private Long id;
    
    @Column(name = "neg", length = 3)
    private String negozio;
    
    @Column(name = "mese")
    private String mese;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "gg_sett")
    private GiornoSettimana giornoSettimana;
    
    @Column(name = "Mattina")
    private Integer mattina;
    
    @Column(name = "Pomeriggio")
    private Integer pomeriggio;
    
    @Column(name = "Intermezzo")
    private Integer intermezzo;
    
    public enum GiornoSettimana {
        Lunedì, Martedì, Mercoledì, Giovedì, Venerdì, Sabato, Domenica
    }
}
