package com.example.springcrud.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.example.springcrud.model.Medicines;

@Repository
public interface MedicinesRepository extends MongoRepository<Medicines, String> {

    List<Medicines> findByPatientId(String patientId);
    List<Medicines> findByDoctorId(String doctorId);
    List<Medicines> findByDoctorIdAndPatientId(String doctorId, String patientId);
    List<Medicines> findByMedicineNameContainingIgnoreCase(String medicineName);
}