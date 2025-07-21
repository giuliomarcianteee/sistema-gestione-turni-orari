package com.orari.turni.dto;

import lombok.Data;

@Data
public class DipendenteDto {
    private String codiceDipe;
    private String nome;
    private Integer oreSettimanali;
    private Integer oreMensili;
    private Double oreGenerate; // ore generate dal programma per il mese
}
