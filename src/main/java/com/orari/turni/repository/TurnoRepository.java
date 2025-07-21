package com.orari.turni.repository;

import com.orari.turni.entity.Turno;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TurnoRepository extends JpaRepository<Turno, Long> {
    
    List<Turno> findByNegozio(String negozio);
    
    List<Turno> findByNegozioOrderByGiornoSettimanaAscOraInizioAsc(String negozio);
}
