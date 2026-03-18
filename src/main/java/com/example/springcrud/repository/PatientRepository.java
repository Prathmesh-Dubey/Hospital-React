package com.example.springcrud.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import com.example.springcrud.model.Patient;

@Repository
public interface PatientRepository extends MongoRepository<Patient, String> {

    Optional<Patient> findByPhone(String phone);

    List<Patient> findByDoctorIdsContaining(String doctorId);

    Optional<Patient> findByPatientId(String patientId);

    

}