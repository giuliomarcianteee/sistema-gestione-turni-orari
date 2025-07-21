package com.orari.turni.repository;

import com.orari.turni.entity.Dipendente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DipendenteRepository extends JpaRepository<Dipendente, String> {
    
    List<Dipendente> findByNegozio(String negozio);
    
    @Query("SELECT d FROM Dipendente d WHERE d.negozio = :negozio AND (d.dataFineContratto IS NULL OR d.dataFineContratto >= CURRENT_DATE)")
    List<Dipendente> findByNegozioAndAttivi(@Param("negozio") String negozio);
}
