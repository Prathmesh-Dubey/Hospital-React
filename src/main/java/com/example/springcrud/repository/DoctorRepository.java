package com.example.springcrud.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.example.springcrud.model.Doctor;

@Repository
public interface DoctorRepository extends MongoRepository<Doctor, String> {
    Optional<Doctor> findByPhone(String phone);
    Optional<Doctor> findByEmailAndPhone(String email, String phone);
    Optional<Doctor> findByDoctorId(String doctorId);
}
