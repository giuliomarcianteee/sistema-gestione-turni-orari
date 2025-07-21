package com.orari.turni.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "negozi")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Negozio {
    
    @Id
    @Column(name = "Codice")
    private String codice;
    
    @Column(name = "Neg")
    private String nome;
    
    @Column(name = "Coordinatore")
    private String coordinatore;
}
