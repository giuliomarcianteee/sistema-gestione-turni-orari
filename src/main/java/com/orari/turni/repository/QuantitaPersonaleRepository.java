package com.orari.turni.repository;

import com.orari.turni.entity.QuantitaPersonale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface QuantitaPersonaleRepository extends JpaRepository<QuantitaPersonale, Long> {
    
    List<QuantitaPersonale> findByNegozioAndMese(String negozio, String mese);
    
    List<QuantitaPersonale> findByNegozio(String negozio);
}
