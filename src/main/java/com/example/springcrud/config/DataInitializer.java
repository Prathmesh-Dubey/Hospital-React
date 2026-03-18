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

            // Doctor 2
            Doctor doc2 = new Doctor();
            doc2.setDoctorId("DOC-002");
            doc2.setName("Dr. Priya Sharma");
            doc2.setSpecialization("Pediatrics");
            doc2.setExperience(12);
            doc2.setQualification(Arrays.asList("MBBS", "MD (Pediatrics)"));
            doc2.setGender("FEMALE");
            doc2.setPhone("+91-9876543211");
            doc2.setEmail("priya.sharma@hospital.com");
            doc2.setConsultationFee(400.00);
            doc2.setAvailability("AVAILABLE");
            doc2.setHospitalName("Max Healthcare");
            doc2.setAddress("456 Health Avenue, Mumbai");
            doc2.setRating(4.9);
            doctorRepository.save(doc2);

            // Doctor 3
            Doctor doc3 = new Doctor();
            doc3.setDoctorId("DOC-003");
            doc3.setName("Dr. Amit Patel");
            doc3.setSpecialization("Orthopedics");
            doc3.setExperience(10);
            doc3.setQualification(Arrays.asList("MBBS", "MS (Orthopedics)"));
            doc3.setGender("MALE");
            doc3.setPhone("+91-9876543212");
            doc3.setEmail("amit.patel@hospital.com");
            doc3.setConsultationFee(450.00);
            doc3.setAvailability("AVAILABLE");
            doc3.setHospitalName("Fortis Hospital");
            doc3.setAddress("789 Care Road, Bangalore");
            doc3.setRating(4.7);
            doctorRepository.save(doc3);

            // Doctor 4
            Doctor doc4 = new Doctor();
            doc4.setDoctorId("DOC-004");
            doc4.setName("Dr. Kavya Singh");
            doc4.setSpecialization("Dermatology");
            doc4.setExperience(8);
            doc4.setQualification(Arrays.asList("MBBS", "MD (Dermatology)"));
            doc4.setGender("FEMALE");
            doc4.setPhone("+91-9876543213");
            doc4.setEmail("kavya.singh@hospital.com");
            doc4.setConsultationFee(350.00);
            doc4.setAvailability("AVAILABLE");
            doc4.setHospitalName("Medanta Hospital");
            doc4.setAddress("321 Wellness Lane, Pune");
            doc4.setRating(4.6);
            doctorRepository.save(doc4);

            // Doctor 5
            Doctor doc5 = new Doctor();
            doc5.setDoctorId("DOC-005");
            doc5.setName("Dr. Vikram Desai");
            doc5.setSpecialization("Neurology");
            doc5.setExperience(20);
            doc5.setQualification(Arrays.asList("MBBS", "MD (Neurology)", "DM (Neurology)"));
            doc5.setGender("MALE");
            doc5.setPhone("+91-9876543214");
            doc5.setEmail("vikram.desai@hospital.com");
            doc5.setConsultationFee(600.00);
            doc5.setAvailability("AVAILABLE");
            doc5.setHospitalName("Apollo Hospital");
            doc5.setAddress("123 Medical Street, New Delhi");
            doc5.setRating(4.9);
            doctorRepository.save(doc5);
            
        } catch (Exception e) {
            System.err.println("Error initializing doctors: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
