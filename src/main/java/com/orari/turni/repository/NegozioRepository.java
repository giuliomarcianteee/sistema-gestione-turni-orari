package com.orari.turni.repository;

import com.orari.turni.entity.Negozio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NegozioRepository extends JpaRepository<Negozio, String> {
}
