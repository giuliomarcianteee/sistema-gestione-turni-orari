package com.orari.turni.dto;

import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
public class GrigliaOrariDto {
    private String negozio;
    private String mese;
    private List<DipendenteDto> dipendenti;
    private Map<String, List<TurnoCreatoDto>> turniPerDipendente; // Key: codiceDipendente
    private List<Integer> giorniMese; // elenco dei giorni del mese (1-31)
}
