package com.orari.turni.dto;

import lombok.Data;
import java.time.LocalTime;

@Data
public class TurnoTemplateDto {
    private String tipoTurno;
    private String giornoSettimana;
    private LocalTime oraInizio;
    private LocalTime oraFine;
    private Integer quantitaRichiesta;
    private Double durataOre;
}
