package com.orari.turni.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class TurnoCreatoDto {
    private Long id;
    private String codiceDipendente;
    private String nomeDipendente;
    private String negozio;
    private LocalDate dataTurno;
    private String tipoTurno;
    private LocalTime oraInizio;
    private LocalTime oraFine;
    private Integer giornoMese;
    private Integer giornoSettimana;
    private Double durataOre;
}
