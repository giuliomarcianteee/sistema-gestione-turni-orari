package com.orari.turni.service;

import com.orari.turni.dto.*;
import com.orari.turni.entity.*;
import com.orari.turni.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
@Transactional
public class TurniService {
    
    @Autowired
    private NegozioRepository negozioRepository;
    
    @Autowired
    private DipendenteRepository dipendenteRepository;
    
    @Autowired
    private TurnoRepository turnoRepository;
    
    @Autowired
    private QuantitaPersonaleRepository quantitaPersonaleRepository;
    
    @Autowired
    private TurnoCreatoRepository turnoCreatoRepository;
    
    @Autowired
    private GeneratoreTurniService generatoreTurniService;
    
    public List<Negozio> getAllNegozi() {
        return negozioRepository.findAll();
    }
    
    public NegozioDettaglioDto getDettaglioNegozio(String codice) {
        Negozio negozio = negozioRepository.findById(codice)
                .orElseThrow(() -> new RuntimeException("Negozio non trovato: " + codice));
        
        NegozioDettaglioDto dto = new NegozioDettaglioDto();
        dto.setCodice(negozio.getCodice());
        dto.setNome(negozio.getNome());
        dto.setCoordinatore(negozio.getCoordinatore());
        
        // Dipendenti attivi
        List<Dipendente> dipendenti = dipendenteRepository.findByNegozioAndAttivi(codice);
        dto.setDipendenti(dipendenti.stream().map(this::convertToDto).collect(Collectors.toList()));
        
        // Turni template
        List<Turno> turni = turnoRepository.findByNegozioOrderByGiornoSettimanaAscOraInizioAsc(codice);
        dto.setTurni(turni.stream().map(this::convertToDto).collect(Collectors.toList()));
        
        return dto;
    }
    
    public GrigliaOrariDto getGrigliaOrari(String negozio, String mese) {
        GrigliaOrariDto dto = new GrigliaOrariDto();
        dto.setNegozio(negozio);
        dto.setMese(mese);
        
        // Dipendenti
        List<Dipendente> dipendenti = dipendenteRepository.findByNegozioAndAttivi(negozio);
        List<DipendenteDto> dipendentiDto = dipendenti.stream().map(d -> {
            DipendenteDto dipendenteDto = convertToDto(d);
            // Calcola ore generate
            Double oreGenerate = turnoCreatoRepository.getSommaOreDipendente(d.getCodiceDipe(), mese);
            dipendenteDto.setOreGenerate(oreGenerate != null ? oreGenerate : 0.0);
            return dipendenteDto;
        }).collect(Collectors.toList());
        dto.setDipendenti(dipendentiDto);
        
        // Giorni del mese
        YearMonth yearMonth = YearMonth.parse(mese);
        List<Integer> giorniMese = IntStream.rangeClosed(1, yearMonth.lengthOfMonth())
                .boxed().collect(Collectors.toList());
        dto.setGiorniMese(giorniMese);
        
        // Turni creati
        List<TurnoCreato> turniCreati = turnoCreatoRepository.findByNegozioAndMese(negozio, mese);
        Map<String, List<TurnoCreatoDto>> turniPerDipendente = turniCreati.stream()
                .map(this::convertToDto)
                .collect(Collectors.groupingBy(TurnoCreatoDto::getCodiceDipendente));
        dto.setTurniPerDipendente(turniPerDipendente);
        
        return dto;
    }
    
    public void generaTurni(GeneraTurniRequest request) {
        if (request.isCancellaPrecedenti()) {
            turnoCreatoRepository.deleteByNegozioAndMese(request.getNegozio(), request.getMese());
        }
        
        List<TurnoCreato> nuoviTurni = generatoreTurniService.generaTurni(
                request.getNegozio(), request.getMese());
        
        turnoCreatoRepository.saveAll(nuoviTurni);
    }
    
    public TurnoCreatoDto salvaTurno(TurnoCreatoDto dto) {
        TurnoCreato turno = convertToEntity(dto);
        turno = turnoCreatoRepository.save(turno);
        return convertToDto(turno);
    }
    
    public void eliminaTurno(Long id) {
        turnoCreatoRepository.deleteById(id);
    }
    
    public void scambiaTurni(Long turnoId1, Long turnoId2) {
        TurnoCreato turno1 = turnoCreatoRepository.findById(turnoId1)
                .orElseThrow(() -> new RuntimeException("Turno non trovato: " + turnoId1));
        TurnoCreato turno2 = turnoCreatoRepository.findById(turnoId2)
                .orElseThrow(() -> new RuntimeException("Turno non trovato: " + turnoId2));
        
        // Scambia i dipendenti
        String codiceTmp = turno1.getCodiceDipendente();
        turno1.setCodiceDipendente(turno2.getCodiceDipendente());
        turno2.setCodiceDipendente(codiceTmp);
        
        turnoCreatoRepository.saveAll(Arrays.asList(turno1, turno2));
    }
    
    // Metodi di conversione DTO
    private DipendenteDto convertToDto(Dipendente dipendente) {
        DipendenteDto dto = new DipendenteDto();
        dto.setCodiceDipe(dipendente.getCodiceDipe());
        dto.setNome(dipendente.getNome());
        dto.setOreSettimanali(dipendente.getOreSettimanali());
        dto.setOreMensili(dipendente.getOreMensili());
        return dto;
    }
    
    private TurnoTemplateDto convertToDto(Turno turno) {
        TurnoTemplateDto dto = new TurnoTemplateDto();
        dto.setTipoTurno(turno.getTipoTurno());
        dto.setGiornoSettimana(turno.getGiornoSettimana() != null ? turno.getGiornoSettimana().name() : null);
        dto.setOraInizio(turno.getOraInizio());
        dto.setOraFine(turno.getOraFine());
        dto.setDurataOre(turno.getDurataOre());
        return dto;
    }
    
    private TurnoCreatoDto convertToDto(TurnoCreato turno) {
        TurnoCreatoDto dto = new TurnoCreatoDto();
        dto.setId(turno.getId());
        dto.setCodiceDipendente(turno.getCodiceDipendente());
        dto.setNegozio(turno.getNegozio());
        dto.setDataTurno(turno.getDataTurno());
        dto.setTipoTurno(turno.getTipoTurno());
        dto.setOraInizio(turno.getOraInizio());
        dto.setOraFine(turno.getOraFine());
        dto.setGiornoMese(turno.getGiornoMese());
        dto.setGiornoSettimana(turno.getGiornoSettimana());
        dto.setDurataOre(turno.getDurataOre());
        
        // Trova nome dipendente
        try {
            Dipendente dipendente = dipendenteRepository.findById(turno.getCodiceDipendente()).orElse(null);
            if (dipendente != null) {
                dto.setNomeDipendente(dipendente.getNome());
            }
        } catch (Exception e) {
            // Ignora errori nella ricerca del nome
        }
        
        return dto;
    }
    
    private TurnoCreato convertToEntity(TurnoCreatoDto dto) {
        TurnoCreato turno = new TurnoCreato();
        turno.setId(dto.getId());
        turno.setCodiceDipendente(dto.getCodiceDipendente());
        turno.setNegozio(dto.getNegozio());
        turno.setDataTurno(dto.getDataTurno());
        turno.setTipoTurno(dto.getTipoTurno());
        turno.setOraInizio(dto.getOraInizio());
        turno.setOraFine(dto.getOraFine());
        turno.setGiornoMese(dto.getGiornoMese());
        turno.setGiornoSettimana(dto.getGiornoSettimana());
        
        if (dto.getDataTurno() != null) {
            turno.setMese(dto.getDataTurno().format(DateTimeFormatter.ofPattern("yyyy-MM")));
            turno.setAnno(dto.getDataTurno().getYear());
        }
        
        return turno;
    }
}
