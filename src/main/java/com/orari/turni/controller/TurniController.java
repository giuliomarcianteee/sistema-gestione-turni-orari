package com.orari.turni.controller;

import com.orari.turni.dto.*;
import com.orari.turni.entity.Negozio;
import com.orari.turni.entity.QuantitaPersonale;
import com.orari.turni.entity.Turno;
import com.orari.turni.service.TurniService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/turni")
@CrossOrigin(origins = "http://localhost:3000")
public class TurniController {
    
    @Autowired
    private TurniService turniService;
    
    @GetMapping("/negozi")
    public List<Negozio> getAllNegozi() {
        return turniService.getAllNegozi();
    }
    
    @GetMapping("/negozi/{codice}")
    public ResponseEntity<NegozioDettaglioDto> getDettaglioNegozio(@PathVariable String codice) {
        try {
            NegozioDettaglioDto dettaglio = turniService.getDettaglioNegozio(codice);
            return ResponseEntity.ok(dettaglio);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/griglia")
    public ResponseEntity<GrigliaOrariDto> getGrigliaOrari(
            @RequestParam String negozio,
            @RequestParam String mese) {
        try {
            GrigliaOrariDto griglia = turniService.getGrigliaOrari(negozio, mese);
            return ResponseEntity.ok(griglia);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/genera")
    public ResponseEntity<Map<String, String>> generaTurni(@RequestBody GeneraTurniRequest request) {
        try {
            turniService.generaTurni(request);
            return ResponseEntity.ok(Map.of("message", "Turni generati con successo"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Errore nella generazione turni: " + e.getMessage()));
        }
    }
    
    @PostMapping("/turno")
    public ResponseEntity<TurnoCreatoDto> salvaTurno(@RequestBody TurnoCreatoDto turno) {
        try {
            TurnoCreatoDto saved = turniService.salvaTurno(turno);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @DeleteMapping("/turno/{id}")
    public ResponseEntity<Map<String, String>> eliminaTurno(@PathVariable Long id) {
        try {
            turniService.eliminaTurno(id);
            return ResponseEntity.ok(Map.of("message", "Turno eliminato con successo"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Errore nell'eliminazione turno: " + e.getMessage()));
        }
    }
    
    @PostMapping("/scambia")
    public ResponseEntity<Map<String, String>> scambiaTurni(
            @RequestParam Long turno1,
            @RequestParam Long turno2) {
        try {
            turniService.scambiaTurni(turno1, turno2);
            return ResponseEntity.ok(Map.of("message", "Turni scambiati con successo"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Errore nello scambio turni: " + e.getMessage()));
        }
    }
    
    // API per QuantitaPersonale
    @GetMapping("/quantita-personale/{negozio}/{mese}")
    public ResponseEntity<List<QuantitaPersonale>> getQuantitaPersonale(
            @PathVariable String negozio, 
            @PathVariable String mese) {
        try {
            List<QuantitaPersonale> quantita = turniService.getQuantitaPersonale(negozio, mese);
            return ResponseEntity.ok(quantita);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/quantita-personale")
    public ResponseEntity<QuantitaPersonale> salvaQuantitaPersonale(@RequestBody QuantitaPersonale quantita) {
        try {
            QuantitaPersonale saved = turniService.salvaQuantitaPersonale(quantita);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // API per Turni (template orari)
    @GetMapping("/turni-template/{negozio}")
    public ResponseEntity<List<Turno>> getTurniTemplate(@PathVariable String negozio) {
        try {
            List<Turno> turni = turniService.getTurniTemplate(negozio);
            return ResponseEntity.ok(turni);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/turni-template")
    public ResponseEntity<Turno> salvaTurnoTemplate(@RequestBody Turno turno) {
        try {
            Turno saved = turniService.salvaTurnoTemplate(turno);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @DeleteMapping("/turni-template/{id}")
    public ResponseEntity<Map<String, String>> eliminaTurnoTemplate(@PathVariable Long id) {
        try {
            turniService.eliminaTurnoTemplate(id);
            return ResponseEntity.ok(Map.of("message", "Turno template eliminato con successo"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Errore nell'eliminazione turno template: " + e.getMessage()));
        }
    }
}
