package com.orari.turni.dto;

import lombok.Data;
import java.util.List;

@Data
public class NegozioDettaglioDto {
    private String codice;
    private String nome;
    private String coordinatore;
    private List<DipendenteDto> dipendenti;
    private List<TurnoTemplateDto> turni;
}
