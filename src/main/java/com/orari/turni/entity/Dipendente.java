package com.orari.turni.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "dipendenti")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Dipendente {
    
    @Id
    @Column(name = "CodiceDIPE")
    private String codiceDipe;
    
    @Column(name = "NEG")
    private String negozio;
    
    @Column(name = "NOME")
    private String nome;
    
    @Column(name = "Ore_Sett")
    private Integer oreSettimanali;
    
    @Column(name = "Livello")
    private Integer livello;
    
    @Column(name = "DATA_ASSUNZIONE")
    private LocalDate dataAssunzione;
    
    @Column(name = "DATA_FINE_CONTRATTO")
    private LocalDate dataFineContratto;
    
    // Calcolato: ore mensili (approssimativo: ore settimanali * 4.33)
    @Transient
    public Integer getOreMensili() {
        return oreSettimanali != null ? Math.round(oreSettimanali * 4.33f) : 0;
    }
}
