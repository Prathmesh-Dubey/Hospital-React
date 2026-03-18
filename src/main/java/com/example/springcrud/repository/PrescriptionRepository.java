package com.example.springcrud.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.example.springcrud.model.Prescription;
import java.util.Optional;

@Repository
public interface PrescriptionRepository extends MongoRepository<Prescription, String> {


    Optional<Prescription> findByPrescriptionId(String prescriptionId);

    boolean existsByPrescriptionId(String prescriptionId);

    void deleteByPrescriptionId(String prescriptionId);
}