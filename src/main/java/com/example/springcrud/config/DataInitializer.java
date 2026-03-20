package com.example.springcrud.config;

import com.example.springcrud.model.Doctor;
import com.example.springcrud.repository.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private DoctorRepository doctorRepository;

    @Override
    public void run(String... args) throws Exception {
        // Initialize doctors only if database is empty
        if (doctorRepository.count() == 0) {
            System.out.println("Initializing sample doctors data...");
            initializeDoctors();
            System.out.println("✓ Sample data initialized successfully! Total doctors: " + doctorRepository.count());
        } else {
            System.out.println("Database already contains " + doctorRepository.count() + " doctors. Skipping initialization.");
        }
    }

    private void initializeDoctors() {
        try {
            // Doctor 1
            Doctor doc1 = new Doctor();
            doc1.setDoctorId("DOC-001");
            doc1.setName("Dr. Rajesh Kumar");
            doc1.setSpecialization("Cardiology");
            doc1.setExperience(15);
            doc1.setQualification(Arrays.asList("MBBS", "MD (Cardiology)"));
            doc1.setGender("MALE");
            doc1.setPhone("+91-9876543210");
            doc1.setEmail("rajesh.kumar@hospital.com");
            doc1.setConsultationFee(500.00);
            doc1.setAvailability("AVAILABLE");
            doc1.setHospitalName("Apollo Hospital");
            doc1.setAddress("123 Medical Street, New Delhi");
            doc1.setRating(4.8);
            doctorRepository.save(doc1);
            
        } catch (Exception e) {
            System.err.println("Error initializing doctors: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
