package com.example.springcrud.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.example.springcrud.model.DoctorAvailability;

@Repository
public interface DoctorAvailabilityRepository extends MongoRepository<DoctorAvailability, String> {
}