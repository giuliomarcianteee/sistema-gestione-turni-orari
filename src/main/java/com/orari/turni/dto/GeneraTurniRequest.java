package com.orari.turni.dto;

import lombok.Data;

@Data
public class GeneraTurniRequest {
    private String negozio;
    private String mese; // formato YYYY-MM
    private boolean cancellaPrecedenti = true;
}
