package com.example.springcrud.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import com.example.springcrud.model.Admin;

@Repository
public interface AdminRepository extends MongoRepository<Admin, String> {

    Optional<Admin> findByPhone(String phone);
    Optional<Admin> findByEmailAndPhone(String email, String phone);


}