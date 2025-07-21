package com.orari.turni.service;

import com.orari.turni.entity.*;
import com.orari.turni.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class GeneratoreTurniService {
    
    private final Random random = new Random(); // Aggiunto per randomizzazione
    
    @Autowired
    private DipendenteRepository dipendenteRepository;
    
    @Autowired
    private TurnoRepository turnoRepository;
    
    @Autowired
    private QuantitaPersonaleRepository quantitaPersonaleRepository;
    
    @Value("${app.turni.rules.min-rest-days:2}")
    private int minRestDays;
    
    @Value("${app.turni.rules.max-consecutive-same-shift:3}")
    private int maxConsecutiveSameShift;
    
    public List<TurnoCreato> generaTurni(String negozio, String mese) {
        // Reinizializza il seed casuale per ogni generazione
        random.setSeed(System.currentTimeMillis());
        
        // Converte il formato mese da "2025-07" a "Luglio"
        String nomeMesseItaliano = convertMeseToItalian(mese);
        
        // Ottieni dipendenti attivi
        List<Dipendente> dipendenti = dipendenteRepository.findByNegozioAndAttivi(negozio);
        
        // Ottieni template turni
        List<Turno> turniTemplate = turnoRepository.findByNegozioOrderByGiornoSettimanaAscOraInizioAsc(negozio);
        
        // Ottieni requisiti personale
        List<QuantitaPersonale> requisiti = quantitaPersonaleRepository.findByNegozioAndMese(negozio, nomeMesseItaliano);
        
        // Genera calendario del mese
        YearMonth yearMonth = YearMonth.parse(mese);
        List<LocalDate> giorniMese = generateGiorniMese(yearMonth);
        
        // Mescola l'ordine dei giorni per aggiungere variazione
        // (mantenendo comunque l'ordine cronologico generale)
        List<LocalDate> giorniMescolati = new ArrayList<>(giorniMese);
        
        // Dividi il mese in settimane e mescola l'ordine all'interno di ogni settimana
        Map<Integer, List<LocalDate>> settimane = giorniMese.stream()
                .collect(Collectors.groupingBy(data -> data.getDayOfYear() / 7));
        
        giorniMescolati.clear();
        for (List<LocalDate> settimana : settimane.values()) {
            Collections.shuffle(settimana, random);
            giorniMescolati.addAll(settimana);
        }
        
        // Inizializza strutture dati per l'algoritmo
        List<TurnoCreato> turniCreati = new ArrayList<>();
        Map<String, List<LocalDate>> riposiDipendente = new HashMap<>();
        Map<String, Map<String, Integer>> contatoreTurniConsecutivi = new HashMap<>();
        
        // Inizializza contatori per ogni dipendente
        for (Dipendente dipendente : dipendenti) {
            riposiDipendente.put(dipendente.getCodiceDipe(), new ArrayList<>());
            contatoreTurniConsecutivi.put(dipendente.getCodiceDipe(), new HashMap<>());
        }
        
        // Algoritmo di generazione turni
        for (LocalDate giorno : giorniMescolati) {
            DayOfWeek dayOfWeek = giorno.getDayOfWeek();
            String nomeGiorno = convertDayOfWeekToItalian(dayOfWeek);
            
            // Trova requisiti per questo giorno
            QuantitaPersonale reqGiorno = requisiti.stream()
                    .filter(q -> q.getGiornoSettimana().toString().equals(nomeGiorno))
                    .findFirst().orElse(null);
            
            if (reqGiorno == null) continue;
            
        // Genera turni per ogni tipo (Mattina, Pomeriggio, Intermezzo) in ordine casuale
        List<String> tipiTurno = Arrays.asList("Mattina", "Pomeriggio", "Intermezzo");
        Collections.shuffle(tipiTurno, random);
        
        for (String tipoTurno : tipiTurno) {
            Integer quantita = null;
            switch (tipoTurno) {
                case "Mattina":
                    quantita = reqGiorno.getMattina();
                    break;
                case "Pomeriggio":
                    quantita = reqGiorno.getPomeriggio();
                    break;
                case "Intermezzo":
                    quantita = reqGiorno.getIntermezzo();
                    break;
            }
            
            if (quantita != null && quantita > 0) {
                processaTurno(tipoTurno, quantita, giorno, nomeGiorno, 
                             turniTemplate, dipendenti, turniCreati, riposiDipendente, 
                             contatoreTurniConsecutivi, negozio, mese);
            }
        }
        }
        
        // Applica regole post-generazione
        applicaRegolePostGenerazione(turniCreati, dipendenti, giorniMese);
        
        return turniCreati;
    }
    
    private void processaTurno(String tipoTurno, Integer quantitaRichiesta, LocalDate giorno,
                              String nomeGiorno, List<Turno> turniTemplate, List<Dipendente> dipendenti,
                              List<TurnoCreato> turniCreati, Map<String, List<LocalDate>> riposiDipendente,
                              Map<String, Map<String, Integer>> contatoreTurniConsecutivi,
                              String negozio, String mese) {
        
        if (quantitaRichiesta == null || quantitaRichiesta <= 0) return;
        
        // Trova template per questo turno
        Turno template = turniTemplate.stream()
                .filter(t -> tipoTurno.equals(t.getTipoTurno()) && 
                           nomeGiorno.equals(t.getGiornoSettimana() != null ? t.getGiornoSettimana().toString() : ""))
                .findFirst().orElse(null);
        
        if (template == null) return;
        
        // Seleziona dipendenti per questo turno usando l'algoritmo
        List<Dipendente> dipendentiSelezionati = selezionaDipendenti(
                dipendenti, quantitaRichiesta, tipoTurno, giorno, 
                turniCreati, riposiDipendente, contatoreTurniConsecutivi);
        
        // Crea i turni
        for (Dipendente dipendente : dipendentiSelezionati) {
            TurnoCreato turno = new TurnoCreato();
            turno.setCodiceDipendente(dipendente.getCodiceDipe());
            turno.setNegozio(negozio);
            turno.setDataTurno(giorno);
            turno.setTipoTurno(tipoTurno);
            turno.setOraInizio(template.getOraInizio());
            turno.setOraFine(template.getOraFine());
            turno.setMese(mese);
            turno.setAnno(giorno.getYear());
            turno.setGiornoMese(giorno.getDayOfMonth());
            turno.setGiornoSettimana(giorno.getDayOfWeek().getValue());
            
            turniCreati.add(turno);
            
            // Aggiorna contatori
            aggiornaContatori(dipendente.getCodiceDipe(), tipoTurno, giorno, 
                            contatoreTurniConsecutivi);
        }
    }
    
    private List<Dipendente> selezionaDipendenti(List<Dipendente> dipendenti, int quantitaRichiesta,
                                               String tipoTurno, LocalDate giorno,
                                               List<TurnoCreato> turniCreati,
                                               Map<String, List<LocalDate>> riposiDipendente,
                                               Map<String, Map<String, Integer>> contatoreTurniConsecutivi) {
        
        // Filtra dipendenti già assegnati in questo giorno
        Set<String> dipendentiGiaAssegnati = turniCreati.stream()
                .filter(t -> t.getDataTurno().equals(giorno))
                .map(TurnoCreato::getCodiceDipendente)
                .collect(Collectors.toSet());
        
        List<Dipendente> disponibili = dipendenti.stream()
                .filter(d -> !dipendentiGiaAssegnati.contains(d.getCodiceDipe()))
                .collect(Collectors.toList());
        
        // Ordina i dipendenti per priorità con randomizzazione
        disponibili.sort((d1, d2) -> {
            int score1 = calcolaPunteggioDipendente(d1.getCodiceDipe(), tipoTurno, giorno, 
                                                  turniCreati, riposiDipendente, contatoreTurniConsecutivi);
            int score2 = calcolaPunteggioDipendente(d2.getCodiceDipe(), tipoTurno, giorno,
                                                  turniCreati, riposiDipendente, contatoreTurniConsecutivi);
            
            // Se i punteggi sono simili (differenza < 100), ordina casualmente
            int diff = Math.abs(score1 - score2);
            if (diff < 100) {
                return random.nextBoolean() ? -1 : 1;
            }
            
            return Integer.compare(score2, score1); // Ordine decrescente (punteggio più alto = priorità maggiore)
        });
        
        // Aggiungi ulteriore randomizzazione: mescola i primi candidati se hanno punteggi simili
        if (disponibili.size() > quantitaRichiesta) {
            List<Dipendente> candidatiTop = new ArrayList<>();
            List<Dipendente> altriCandidati = new ArrayList<>();
            
            // Calcola il punteggio del primo dipendente come riferimento
            if (!disponibili.isEmpty()) {
                int punteggioRiferimento = calcolaPunteggioDipendente(
                    disponibili.get(0).getCodiceDipe(), tipoTurno, giorno, 
                    turniCreati, riposiDipendente, contatoreTurniConsecutivi);
                
                for (Dipendente d : disponibili) {
                    int punteggio = calcolaPunteggioDipendente(d.getCodiceDipe(), tipoTurno, giorno,
                                                              turniCreati, riposiDipendente, contatoreTurniConsecutivi);
                    
                    // Se il punteggio è simile al riferimento (entro 150 punti), consideralo candidato top
                    if (Math.abs(punteggio - punteggioRiferimento) <= 150) {
                        candidatiTop.add(d);
                    } else {
                        altriCandidati.add(d);
                    }
                }
                
                // Mescola casualmente i candidati top
                Collections.shuffle(candidatiTop, random);
                
                // Ricomponi la lista: prima i candidati top mescolati, poi gli altri
                disponibili.clear();
                disponibili.addAll(candidatiTop);
                disponibili.addAll(altriCandidati);
            }
        }
        
        // Seleziona i primi N dipendenti
        return disponibili.stream()
                .limit(Math.min(quantitaRichiesta, disponibili.size()))
                .collect(Collectors.toList());
    }
    
    private int calcolaPunteggioDipendente(String codiceDipendente, String tipoTurno, LocalDate giorno,
                                         List<TurnoCreato> turniCreati,
                                         Map<String, List<LocalDate>> riposiDipendente,
                                         Map<String, Map<String, Integer>> contatoreTurniConsecutivi) {
        int punteggio = 1000; // Punteggio base
        
        // Aggiungi un fattore casuale per variare la selezione (-50 a +50)
        punteggio += random.nextInt(101) - 50;
        
        // Penalizza se ha fatto troppi turni consecutivi dello stesso tipo
        Map<String, Integer> contatori = contatoreTurniConsecutivi.get(codiceDipendente);
        if (contatori != null && contatori.getOrDefault(tipoTurno, 0) >= maxConsecutiveSameShift) {
            punteggio -= 500;
        }
        
        // Premia se non ha fatto questo tipo di turno recentemente
        long turniRecentiStessoTipo = turniCreati.stream()
                .filter(t -> t.getCodiceDipendente().equals(codiceDipendente))
                .filter(t -> t.getTipoTurno().equals(tipoTurno))
                .filter(t -> t.getDataTurno().isAfter(giorno.minusDays(7)))
                .count();
        
        punteggio -= turniRecentiStessoTipo * 50;
        
        // Calcola quanti turni ha fatto questo mese
        long turniMese = turniCreati.stream()
                .filter(t -> t.getCodiceDipendente().equals(codiceDipendente))
                .count();
        
        // Premia chi ha fatto meno turni
        punteggio += (int) (100 - turniMese * 5);
        
        return punteggio;
    }
    
    private void aggiornaContatori(String codiceDipendente, String tipoTurno, LocalDate giorno,
                                 Map<String, Map<String, Integer>> contatoreTurniConsecutivi) {
        
        Map<String, Integer> contatori = contatoreTurniConsecutivi.get(codiceDipendente);
        
        // Incrementa il contatore per questo tipo di turno
        contatori.put(tipoTurno, contatori.getOrDefault(tipoTurno, 0) + 1);
        
        // Resetta i contatori degli altri tipi di turno
        for (String tipo : Arrays.asList("Mattina", "Pomeriggio", "Intermezzo")) {
            if (!tipo.equals(tipoTurno)) {
                contatori.put(tipo, 0);
            }
        }
    }
    
    private void applicaRegolePostGenerazione(List<TurnoCreato> turniCreati, List<Dipendente> dipendenti,
                                            List<LocalDate> giorniMese) {
        
        // Assicura giorni di riposo minimi
        for (Dipendente dipendente : dipendenti) {
            assicuraRiposiMinimi(dipendente, turniCreati, giorniMese);
        }
        
        // Bilancia le ore tra i dipendenti
        bilanciaOreDipendenti(turniCreati, dipendenti, giorniMese);
    }
    
    private void assicuraRiposiMinimi(Dipendente dipendente, List<TurnoCreato> turniCreati,
                                    List<LocalDate> giorniMese) {
        
        List<LocalDate> giorniLavoro = turniCreati.stream()
                .filter(t -> t.getCodiceDipendente().equals(dipendente.getCodiceDipe()))
                .map(TurnoCreato::getDataTurno)
                .sorted()
                .collect(Collectors.toList());
        
        // Verifica sequenze consecutive troppo lunghe
        List<LocalDate> giorniDaRimuovere = new ArrayList<>();
        int consecutivi = 0;
        LocalDate precedente = null;
        
        for (LocalDate giorno : giorniLavoro) {
            if (precedente != null && giorno.equals(precedente.plusDays(1))) {
                consecutivi++;
                if (consecutivi >= 6) { // Max 5 giorni consecutivi
                    giorniDaRimuovere.add(giorno);
                }
            } else {
                consecutivi = 1;
            }
            precedente = giorno;
        }
        
        // Rimuovi turni per assicurare riposi
        turniCreati.removeIf(t -> t.getCodiceDipendente().equals(dipendente.getCodiceDipe()) &&
                                giorniDaRimuovere.contains(t.getDataTurno()));
    }
    
    private void bilanciaOreDipendenti(List<TurnoCreato> turniCreati, List<Dipendente> dipendenti,
                                     List<LocalDate> giorniMese) {
        
        for (Dipendente dipendente : dipendenti) {
            double oreAttuali = turniCreati.stream()
                    .filter(t -> t.getCodiceDipendente().equals(dipendente.getCodiceDipe()))
                    .mapToDouble(TurnoCreato::getDurataOre)
                    .sum();
            
            double oreTarget = dipendente.getOreMensili();
            
            // Se ha troppe ore, rimuovi alcuni turni
            if (oreAttuali > oreTarget * 1.1) { // 10% di tolleranza
                rimuoviTurniEccessivi(dipendente, turniCreati, oreAttuali - oreTarget);
            }
        }
    }
    
    private void rimuoviTurniEccessivi(Dipendente dipendente, List<TurnoCreato> turniCreati, double oreEccessive) {
        List<TurnoCreato> turniDipendente = turniCreati.stream()
                .filter(t -> t.getCodiceDipendente().equals(dipendente.getCodiceDipe()))
                .sorted((t1, t2) -> t2.getDataTurno().compareTo(t1.getDataTurno())) // Dal più recente
                .collect(Collectors.toList());
        
        double oreRimosse = 0;
        Iterator<TurnoCreato> iterator = turniDipendente.iterator();
        
        while (iterator.hasNext() && oreRimosse < oreEccessive) {
            TurnoCreato turno = iterator.next();
            oreRimosse += turno.getDurataOre();
            turniCreati.remove(turno);
        }
    }
    
    private List<LocalDate> generateGiorniMese(YearMonth yearMonth) {
        List<LocalDate> giorni = new ArrayList<>();
        LocalDate primo = yearMonth.atDay(1);
        LocalDate ultimo = yearMonth.atEndOfMonth();
        
        LocalDate giorno = primo;
        while (!giorno.isAfter(ultimo)) {
            giorni.add(giorno);
            giorno = giorno.plusDays(1);
        }
        
        return giorni;
    }
    
    private String convertDayOfWeekToItalian(DayOfWeek dayOfWeek) {
        switch (dayOfWeek) {
            case MONDAY: return "Lunedì";
            case TUESDAY: return "Martedì";
            case WEDNESDAY: return "Mercoledì";
            case THURSDAY: return "Giovedì";
            case FRIDAY: return "Venerdì";
            case SATURDAY: return "Sabato";
            case SUNDAY: return "Domenica";
            default: return dayOfWeek.name();
        }
    }
    
    private String convertMeseToItalian(String meseFormatoYYYYMM) {
        // Converte da "2025-07" a "Luglio"
        try {
            String[] parti = meseFormatoYYYYMM.split("-");
            if (parti.length != 2) return meseFormatoYYYYMM;
            
            int numeroMese = Integer.parseInt(parti[1]);
            switch (numeroMese) {
                case 1: return "Gennaio";
                case 2: return "Febbraio";
                case 3: return "Marzo";
                case 4: return "Aprile";
                case 5: return "Maggio";
                case 6: return "Giugno";
                case 7: return "Luglio";
                case 8: return "Agosto";
                case 9: return "Settembre";
                case 10: return "Ottobre";
                case 11: return "Novembre";
                case 12: return "Dicembre";
                default: return meseFormatoYYYYMM;
            }
        } catch (Exception e) {
            return meseFormatoYYYYMM;
        }
    }
}
