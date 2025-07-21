package com.orari.turni.repository;

import com.orari.turni.entity.TurnoCreato;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TurnoCreatoRepository extends JpaRepository<TurnoCreato, Long> {
    
    List<TurnoCreato> findByNegozioAndMese(String negozio, String mese);
    
    List<TurnoCreato> findByCodiceDipendente(String codiceDipendente);
    
    void deleteByNegozioAndMese(String negozio, String mese);
    
    @Query("SELECT SUM(CASE WHEN t.oraFine > t.oraInizio THEN " +
           "(HOUR(t.oraFine) * 60 + MINUTE(t.oraFine) - HOUR(t.oraInizio) * 60 - MINUTE(t.oraInizio)) / 60.0 " +
           "ELSE 0 END) " +
           "FROM TurnoCreato t WHERE t.codiceDipendente = :codiceDipendente AND t.mese = :mese")
    Double getSommaOreDipendente(@Param("codiceDipendente") String codiceDipendente, @Param("mese") String mese);
}
