package com.example.springcrud.repository;
import java.util.Optional;


import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.example.springcrud.model.Clinic;

@Repository
public interface ClinicRepository extends MongoRepository<Clinic, String> {

    Optional<Clinic> findByClinicId(String clinicId);

    boolean existsByClinicId(String clinicId);

    void deleteByClinicId(String clinicId);
}
