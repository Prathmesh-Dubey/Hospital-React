package com.example.springcrud.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.example.springcrud.model.MedicalTest;

@Repository
public interface MedicalTestRepository extends MongoRepository<MedicalTest, String> {

    List<MedicalTest> findByPatientId(String patientId);
    List<MedicalTest> findByDoctorId(String doctorId);
    List<MedicalTest> findByTestNameContainingIgnoreCase(String testName);
    List<MedicalTest> findByCategoryIgnoreCase(String category);
    List<MedicalTest> findByResultStatusIgnoreCase(String resultStatus);
    List<MedicalTest> findByDoctorIdAndPatientId(String doctorId, String patientId);
    Optional<MedicalTest> findByTestId(String testId);
    Optional<MedicalTest> findByTestIdAndPatientId(String testId, String patientId);
}