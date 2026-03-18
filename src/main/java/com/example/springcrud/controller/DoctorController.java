package com.example.springcrud.controller;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.Map;

import com.example.springcrud.model.LoginResponse;
import com.example.springcrud.model.ResetPasswordRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.springcrud.model.Doctor;
import com.example.springcrud.model.LoginRequest;
import com.example.springcrud.repository.DoctorRepository;
import com.example.springcrud.service.SequenceGeneratorService;

@RestController
@RequestMapping("/api/doctors")
@CrossOrigin(origins = "*")  
public class DoctorController {

        @Autowired
        private BCryptPasswordEncoder passwordEncoder;

        @Autowired
        private DoctorRepository doctorRepository;

        @Autowired
        private SequenceGeneratorService sequenceGeneratorService;

        // ================= CREATE =================

        @PostMapping
        public ResponseEntity<?> createDoctor(@RequestBody Doctor doctor) {

                doctor.setId(null); // let Mongo generate _id

                long seq = sequenceGeneratorService.generateSequence("doctor_sequence");
                doctor.setDoctorId("DOC-" + (1000 + seq));

                doctor.setPassword(passwordEncoder.encode(doctor.getPassword()));

                Doctor savedDoctor = doctorRepository.save(doctor);
                savedDoctor.setPassword(null);

                return new ResponseEntity<>(savedDoctor, HttpStatus.CREATED);
        }

        // ================= READ WITH FILTERS =================
        @GetMapping
        public ResponseEntity<List<Doctor>> getAllDoctors(
                        @RequestParam(required = false) String name,
                        @RequestParam(required = false) String specialization,
                        @RequestParam(required = false) Integer minExperience,
                        @RequestParam(required = false) Integer maxExperience,
                        @RequestParam(required = false) String qualification,
                        @RequestParam(required = false) String gender,
                        @RequestParam(required = false) String hospitalName,
                        @RequestParam(required = false) Double minFee,
                        @RequestParam(required = false) Double maxFee,
                        @RequestParam(required = false) Double minRating,
                        @RequestParam(required = false) String availability,
                        @RequestParam(required = false) String address) {

                List<Doctor> doctors = doctorRepository.findAll();

                List<Doctor> filteredDoctors = doctors.stream()

                                .filter(d -> name == null ||
                                                (d.getName() != null &&
                                                                d.getName().toLowerCase().contains(name.toLowerCase())))

                                .filter(d -> specialization == null ||
                                                (d.getSpecialization() != null &&
                                                                d.getSpecialization().toLowerCase().contains(
                                                                                specialization.toLowerCase())))

                                .filter(d -> minExperience == null ||
                                                (d.getExperience() != null &&
                                                                d.getExperience() >= minExperience))

                                .filter(d -> maxExperience == null ||
                                                (d.getExperience() != null &&
                                                                d.getExperience() <= maxExperience))

                                .filter(d -> qualification == null ||
                                                (d.getQualification() != null &&
                                                                d.getQualification().stream()
                                                                                .anyMatch(q -> q.equalsIgnoreCase(
                                                                                                qualification))))

                                .filter(d -> gender == null ||
                                                (d.getGender() != null &&
                                                                d.getGender().equalsIgnoreCase(gender)))

                                .filter(d -> hospitalName == null ||
                                                (d.getHospitalName() != null &&
                                                                d.getHospitalName().toLowerCase()
                                                                                .contains(hospitalName.toLowerCase())))

                                .filter(d -> minFee == null ||
                                                (d.getConsultationFee() != null &&
                                                                d.getConsultationFee() >= minFee))

                                .filter(d -> maxFee == null ||
                                                (d.getConsultationFee() != null &&
                                                                d.getConsultationFee() <= maxFee))

                                .filter(d -> minRating == null ||
                                                (d.getRating() != null &&
                                                                d.getRating() >= minRating))

                                .filter(d -> availability == null ||
                                                (d.getAvailability() != null &&
                                                                d.getAvailability().equalsIgnoreCase(availability)))

                                .filter(d -> address == null ||
                                                (d.getAddress() != null &&
                                                                d.getAddress().toLowerCase()
                                                                                .contains(address.toLowerCase())))

                                .collect(Collectors.toList());

                return new ResponseEntity<>(filteredDoctors, HttpStatus.OK);
        }

        // ================= READ BY ID =================
        @GetMapping("/{id}")
        public ResponseEntity<Doctor> getDoctorById(@PathVariable String id) {
                Optional<Doctor> doctor = doctorRepository.findById(id);
                return doctor.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
        }

        // ================= auth nby phone and password =================
        @PostMapping("/login")
        public ResponseEntity<?> authDoctor(@RequestBody LoginRequest request) {

                Optional<Doctor> doctor = doctorRepository.findByPhone(request.getPhone());

                if (doctor.isPresent() &&
                                passwordEncoder.matches(request.getPassword(), doctor.get().getPassword())) {

                        Doctor loggedInDoctor = doctor.get();

                        LoginResponse response = new LoginResponse(
                                        "Login Successful",
                                        loggedInDoctor.getId(),
                                        loggedInDoctor.getName(),
                                        "DOCTOR");

                        return ResponseEntity.ok(response);

                }

                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                .body("Invalid phone or password");
        }

        // ================= UPDATE =================
        @PutMapping("/{doctorId}")
        public ResponseEntity<Doctor> updateDoctor(
                        @PathVariable String doctorId,
                        @RequestBody Doctor doctor) {

                return doctorRepository.findById(doctorId)
                                .map(existing -> {

                                        existing.setName(doctor.getName());
                                        existing.setSpecialization(doctor.getSpecialization());
                                        existing.setExperience(doctor.getExperience());
                                        existing.setQualification(doctor.getQualification());
                                        existing.setGender(doctor.getGender());
                                        existing.setPhone(doctor.getPhone());
                                        existing.setEmail(doctor.getEmail());
                                        existing.setConsultationFee(doctor.getConsultationFee());
                                        existing.setAvailability(doctor.getAvailability());
                                        existing.setHospitalName(doctor.getHospitalName());
                                        existing.setRating(doctor.getRating());
                                        existing.setAddress(doctor.getAddress());

                                        Doctor updated = doctorRepository.save(existing);
                                        return new ResponseEntity<>(updated, HttpStatus.OK);
                                })
                                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
        }

        // ================= DELETE =================
        @DeleteMapping("/{doctorId}")
        public ResponseEntity<HttpStatus> deleteDoctor(@PathVariable String doctorId) {
                try {
                        doctorRepository.deleteById(doctorId);
                        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
                } catch (Exception e) {
                        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
                }
        }

        @PostMapping("/reset-password")
        public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {

                try {

                        System.out.println("Incoming request: " + request.getEmail());

                        if (request.getEmail() == null ||
                                        request.getPhone() == null ||
                                        request.getNewPassword() == null) {

                                return ResponseEntity.badRequest().body("Missing required fields");
                        }

                        Optional<Doctor> doctorOptional = doctorRepository.findByEmailAndPhone(
                                        request.getEmail(),
                                        request.getPhone());

                        if (!doctorOptional.isPresent()) {

                                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                                .body("Invalid email or phone");
                        }

                        Doctor doctor = doctorOptional.get();

                        doctor.setPassword(
                                        passwordEncoder.encode(request.getNewPassword()));

                        doctorRepository.save(doctor);

                        return ResponseEntity.ok("Password reset successful");

                } catch (Exception e) {
                        e.printStackTrace();
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                        .body("Error: " + e.getMessage());
                }
        }

        @PutMapping("/reset-password")
        public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {

                String phone = request.get("phone");
                String email = request.get("email");
                String newPassword = request.get("newPassword");

                if (phone == null || email == null || newPassword == null) {
                        return ResponseEntity.badRequest().body("Missing required fields");
                }

                Optional<Doctor> optionalDoctor = doctorRepository.findByPhone(phone);

                if (!optionalDoctor.isPresent()) {
                        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                        .body("Doctor not found");
                }

                Doctor doctor = optionalDoctor.get();

                if (!doctor.getEmail().trim().equalsIgnoreCase(email.trim())) {
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                        .body("Email does not match");
                }

                doctor.setPassword(passwordEncoder.encode(newPassword));
                doctorRepository.save(doctor);

                return ResponseEntity.ok("Password reset successful");
        }

        @GetMapping("/by-doctor-id/{doctorId}")
        public ResponseEntity<Doctor> getByDoctorId(@PathVariable String doctorId) {

                Optional<Doctor> doctor = doctorRepository.findByDoctorId(doctorId);

                return doctor
                                .map(d -> new ResponseEntity<>(d, HttpStatus.OK))
                                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
        }

}
