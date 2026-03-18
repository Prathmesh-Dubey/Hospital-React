package com.example.springcrud.controller;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.example.springcrud.model.LoginRequest;
import com.example.springcrud.model.LoginResponse;
import com.example.springcrud.model.Patient;
import com.example.springcrud.repository.PatientRepository;
import com.example.springcrud.service.SequenceGeneratorService;

@RestController
@RequestMapping("/api/patients")
@CrossOrigin(origins = "*")  
public class PatientController {

        @Autowired
        private SequenceGeneratorService sequenceGeneratorService;

        @Autowired
        private PatientRepository patientRepository;

        @Autowired
        private BCryptPasswordEncoder passwordEncoder;

        // CREATE
        @PostMapping
        public ResponseEntity<Patient> createPatient(@RequestBody Patient patient) {

                patient.setId(null);

                long seq = sequenceGeneratorService.generateSequence("patient_sequence");
                patient.setPatientId("PAT-" + (1000 + seq));

                // 🔐 HASH PASSWORD BEFORE SAVING
                patient.setPassword(passwordEncoder.encode(patient.getPassword()));

                Patient savedPatient = patientRepository.save(patient);

                savedPatient.setPassword(null); // never return password

                return new ResponseEntity<>(savedPatient, HttpStatus.CREATED);
        }

        @PostMapping("/doctor/{doctorId}")
        public ResponseEntity<Patient> createPatient(
                        @PathVariable String doctorId,
                        @RequestBody Patient patient) {

                patient.setId(null);

                long seq = sequenceGeneratorService.generateSequence("patient_sequence");
                patient.setPatientId("PAT-" + (1000 + seq));

                // Assign doctorId automatically
                patient.setDoctorIds(Collections.singletonList(doctorId));

                // Hash password
                patient.setPassword(passwordEncoder.encode(patient.getPassword()));

                Patient savedPatient = patientRepository.save(patient);

                savedPatient.setPassword(null);

                return new ResponseEntity<>(savedPatient, HttpStatus.CREATED);
        }

        @GetMapping("/doctor/{doctorId}")
        public ResponseEntity<List<Patient>> getPatientsByDoctor(@PathVariable String doctorId) {
                List<Patient> patients = patientRepository.findByDoctorIdsContaining(doctorId);
                return ResponseEntity.ok(patients);
        }

        // READ - Get patient by patientId
        @GetMapping("/by-patient-id/{patientId}")
        public ResponseEntity<Patient> getByPatientId(@PathVariable String patientId) {

                return patientRepository.findByPatientId(patientId)
                                .map(p -> new ResponseEntity<>(p, HttpStatus.OK))
                                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
        }

        // READ - Get all patients (with filters)
        @GetMapping
        public ResponseEntity<List<Patient>> getAllPatients(
                        @RequestParam(required = false) String patientId,
                        @RequestParam(required = false) String fullName,
                        @RequestParam(required = false) String gender,
                        @RequestParam(required = false) String bloodGroup,
                        @RequestParam(required = false) String phone,
                        @RequestParam(required = false) String emailAddress) {

                String nameFilter = (fullName == null) ? "" : fullName.trim().toLowerCase();
                String patientIdFilter = (patientId == null) ? "" : patientId.trim().toLowerCase();
                String bloodFilter = (bloodGroup == null) ? "" : bloodGroup.trim().replace(" ", "+").toUpperCase();
                String phoneFilter = (phone == null) ? "" : phone.trim();
                String emailFilter = (emailAddress == null) ? "" : emailAddress.trim().toLowerCase();

                List<Patient> patients = patientRepository.findAll();

                List<Patient> filteredPatients = patients.stream()

                                .filter(p -> patientIdFilter.isEmpty() ||
                                                (p.getPatientId() != null &&
                                                                p.getPatientId().toLowerCase()
                                                                                .contains(patientIdFilter)))

                                .filter(p -> fullName == null || fullName.trim().isEmpty() ||
                                                (p.getFullName() != null &&
                                                                p.getFullName().toLowerCase()
                                                                                .contains(nameFilter)))

                                .filter(p -> gender == null || gender.trim().isEmpty() ||
                                                (p.getGender() != null &&
                                                                gender.equalsIgnoreCase(p.getGender())))

                                .filter(p -> bloodFilter.isEmpty() ||
                                                (p.getBloodGroup() != null &&
                                                                p.getBloodGroup()
                                                                                .trim()
                                                                                .replace(" ", "+")
                                                                                .toUpperCase()
                                                                                .equals(bloodFilter)))

                                .filter(p -> phoneFilter.isEmpty() ||
                                                (p.getPhone() != null &&
                                                                p.getPhone().replace(" ", "")
                                                                                .replace("-", "")
                                                                                .contains(phoneFilter.replace(" ", "")
                                                                                                .replace("-", ""))))

                                .filter(p -> emailFilter.isEmpty() ||
                                                (p.getEmailAddress() != null &&
                                                                p.getEmailAddress().toLowerCase()
                                                                                .contains(emailFilter)))

                                .collect(Collectors.toList());

                return new ResponseEntity<>(filteredPatients, HttpStatus.OK);
        }

        @PutMapping("/reset-password")
        public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {

                String phone = request.get("phone");
                String email = request.get("email");
                String newPassword = request.get("newPassword");

                Optional<Patient> optionalPatient = patientRepository.findByPhone(phone);

                if (!optionalPatient.isPresent()) {
                        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                        .body("User not found");
                }

                Patient patient = optionalPatient.get();

                if (!patient.getEmailAddress().equalsIgnoreCase(email)) {
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                        .body("Email does not match");
                }

                patient.setPassword(passwordEncoder.encode(newPassword));
                patientRepository.save(patient);

                return ResponseEntity.ok("Password reset successful");
        }

        @DeleteMapping("/delete-by-filters")
        public ResponseEntity<?> deleteByFilters(
                        @RequestParam(required = false) String patientId,
                        @RequestParam(required = false) String fullName,
                        @RequestParam(required = false) String gender,
                        @RequestParam(required = false) String bloodGroup,
                        @RequestParam(required = false) String phone,
                        @RequestParam(required = false) String emailAddress) {

                String patientIdFilter = (patientId == null) ? "" : patientId.trim().toLowerCase();
                String nameFilter = (fullName == null) ? "" : fullName.trim().toLowerCase();
                String genderFilter = (gender == null) ? "" : gender.trim().toLowerCase();
                String bloodFilter = (bloodGroup == null) ? "" : bloodGroup.trim().replace(" ", "").toUpperCase();
                String phoneFilter = (phone == null) ? "" : phone.trim().replace(" ", "").replace("-", "");
                String emailFilter = (emailAddress == null) ? "" : emailAddress.trim().toLowerCase();

                if (patientIdFilter.isEmpty() && nameFilter.isEmpty() &&
                                genderFilter.isEmpty() && bloodFilter.isEmpty() &&
                                phoneFilter.isEmpty() && emailFilter.isEmpty()) {

                        return ResponseEntity.badRequest()
                                        .body("At least one filter must be applied.");
                }

                List<Patient> patients = patientRepository.findAll();

                List<Patient> filteredPatients = patients.stream()

                                .filter(p -> patientIdFilter.isEmpty() ||
                                                (p.getPatientId() != null &&
                                                                p.getPatientId().toLowerCase()
                                                                                .contains(patientIdFilter)))

                                .filter(p -> nameFilter.isEmpty() ||
                                                (p.getFullName() != null &&
                                                                p.getFullName().toLowerCase().contains(nameFilter)))

                                .filter(p -> genderFilter.isEmpty() ||
                                                (p.getGender() != null &&
                                                                p.getGender().toLowerCase().equals(genderFilter)))

                                .filter(p -> bloodFilter.isEmpty() ||
                                                (p.getBloodGroup() != null &&
                                                                p.getBloodGroup().replace(" ", "")
                                                                                .toUpperCase().contains(bloodFilter)))

                                .filter(p -> phoneFilter.isEmpty() ||
                                                (p.getPhone() != null &&
                                                                p.getPhone().replace(" ", "")
                                                                                .replace("-", "")
                                                                                .contains(phoneFilter)))

                                .filter(p -> emailFilter.isEmpty() ||
                                                (p.getEmailAddress() != null &&
                                                                p.getEmailAddress().toLowerCase()
                                                                                .contains(emailFilter)))

                                .collect(Collectors.toList());

                if (filteredPatients.isEmpty()) {
                        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                        .body("No matching patients found.");
                }

                patientRepository.deleteAll(filteredPatients);

                return ResponseEntity.ok(filteredPatients.size() + " patient(s) deleted.");
        }

        // READ - Get patient by Mongo _id
        @GetMapping("/{id}")
        public ResponseEntity<Patient> getPatientById(@PathVariable String id) {
                Optional<Patient> patient = patientRepository.findById(id);
                return patient.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
        }

        @GetMapping("/doctor/{doctorId}/filter")
        public ResponseEntity<List<Patient>> filterDoctorPatients(
                        @PathVariable String doctorId,
                        @RequestParam(required = false) String patientId,
                        @RequestParam(required = false) String fullName,
                        @RequestParam(required = false) String gender,
                        @RequestParam(required = false) String bloodGroup,
                        @RequestParam(required = false) String phone,
                        @RequestParam(required = false) String emailAddress) {

                List<Patient> patients = patientRepository.findByDoctorIdsContaining(doctorId);

                List<Patient> filtered = patients.stream()

                                .filter(p -> patientId == null || patientId.trim().isEmpty() ||
                                                (p.getPatientId() != null &&
                                                                p.getPatientId().toLowerCase()
                                                                                .contains(patientId.toLowerCase())))

                                .filter(p -> fullName == null || fullName.trim().isEmpty() ||
                                                (p.getFullName() != null &&
                                                                p.getFullName().toLowerCase()
                                                                                .contains(fullName.toLowerCase())))

                                .filter(p -> gender == null || gender.trim().isEmpty() ||
                                                (p.getGender() != null &&
                                                                p.getGender().equalsIgnoreCase(gender)))

                                .filter(p -> bloodGroup == null || bloodGroup.trim().isEmpty() ||
                                                (p.getBloodGroup() != null &&
                                                                p.getBloodGroup().replace(" ", "")
                                                                                .equalsIgnoreCase(bloodGroup
                                                                                                .replace(" ", ""))))

                                .filter(p -> phone == null || phone.trim().isEmpty() ||
                                                (p.getPhone() != null &&
                                                                p.getPhone().replace(" ", "").replace("-", "")
                                                                                .contains(phone.replace(" ", "")
                                                                                                .replace("-", ""))))

                                .filter(p -> emailAddress == null || emailAddress.trim().isEmpty() ||
                                                (p.getEmailAddress() != null &&
                                                                p.getEmailAddress().toLowerCase()
                                                                                .contains(emailAddress.toLowerCase())))

                                .collect(Collectors.toList());

                return ResponseEntity.ok(filtered);
        }

        // UPDATE (DetailsController style)

        @PostMapping("/login")
        public ResponseEntity<?> loginPatient(@RequestBody LoginRequest request) {

                Optional<Patient> patient = patientRepository.findByPhone(request.getPhone());

                if (patient.isPresent() &&
                                passwordEncoder.matches(request.getPassword(), patient.get().getPassword())) {

                        Patient loggedInPatient = patient.get();

                        LoginResponse response = new LoginResponse(
                                        "Login Successful",
                                        loggedInPatient.getPatientId(),
                                        loggedInPatient.getFullName(),
                                        "PATIENT");

                        return ResponseEntity.ok(response);
                }

                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                .body("Invalid credentials");
        }

        // DELETE
        @DeleteMapping("/{id}")
        public ResponseEntity<HttpStatus> deletePatient(@PathVariable String id) {
                try {
                        patientRepository.deleteById(id);
                        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
                } catch (Exception e) {
                        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
                }
        }

        @PutMapping("/change-password")
        public ResponseEntity<?> changePassword(@RequestBody Map<String, String> request) {

                String userId = request.get("userId");
                String phone = request.get("phone");
                String email = request.get("email");
                String newPassword = request.get("newPassword");

                if (userId == null || phone == null || email == null || newPassword == null) {
                        return ResponseEntity.badRequest().body("Missing required fields");
                }

                Optional<Patient> optionalPatient = patientRepository.findByPatientId(userId);

                if (!optionalPatient.isPresent()) {
                        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Patient not found");
                }

                Patient patient = optionalPatient.get();

                if (!patient.getPhone().equals(phone) ||
                                !patient.getEmailAddress().equalsIgnoreCase(email)) {

                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                        .body("Phone or Email does not match");
                }

                patient.setPassword(passwordEncoder.encode(newPassword));
                patientRepository.save(patient);

                return ResponseEntity.ok("Password updated successfully");
        }

        @PutMapping("/{patientId}/assign-doctor/{doctorId}")
        public ResponseEntity<?> assignDoctor(
                        @PathVariable String patientId,
                        @PathVariable String doctorId) {

                Optional<Patient> optionalPatient = patientRepository.findByPatientId(patientId);

                if (!optionalPatient.isPresent()) {
                        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Patient not found");
                }

                Patient patient = optionalPatient.get();

                if (patient.getDoctorIds() == null) {
                        patient.setDoctorIds(new ArrayList<>());
                }

                if (!patient.getDoctorIds().contains(doctorId)) {
                        patient.getDoctorIds().add(doctorId);
                        patientRepository.save(patient);
                }

                return ResponseEntity.ok("Doctor assigned successfully");
        }

        @PutMapping("/by-patient-id/{patientId}")
        public ResponseEntity<Patient> updateByPatientId(
                        @PathVariable String patientId,
                        @RequestBody Patient updatedData) {

                Optional<Patient> optional = patientRepository.findByPatientId(patientId);

                if (!optional.isPresent()) {
                        return ResponseEntity.notFound().build();
                }

                Patient patient = optional.get();

                patient.setFullName(updatedData.getFullName());
                patient.setDateOfBirth(updatedData.getDateOfBirth());
                patient.setGender(updatedData.getGender());
                patient.setPhone(updatedData.getPhone());
                patient.setEmailAddress(updatedData.getEmailAddress());
                patient.setResidentialAddress(updatedData.getResidentialAddress());
                patient.setEmergencyContact(updatedData.getEmergencyContact());
                patient.setBloodGroup(updatedData.getBloodGroup());
                patient.setAllergies(updatedData.getAllergies());
                patient.setChronicDiseases(updatedData.getChronicDiseases());
                patient.setCurrentMedications(updatedData.getCurrentMedications());
                patient.setHeight(updatedData.getHeight());
                patient.setWeight(updatedData.getWeight());

                Patient saved = patientRepository.save(patient);
                saved.setPassword(null);

                return ResponseEntity.ok(saved);
        }

        @PutMapping("/{id}")
        public ResponseEntity<Patient> updatePatient(
                        @PathVariable String id,
                        @RequestBody Patient updatedData) {

                Optional<Patient> optional = patientRepository.findById(id);

                if (!optional.isPresent()) {
                        return ResponseEntity.notFound().build();
                }

                Patient patient = optional.get();

                patient.setFullName(updatedData.getFullName());
                patient.setDateOfBirth(updatedData.getDateOfBirth());
                patient.setGender(updatedData.getGender());
                patient.setPhone(updatedData.getPhone());
                patient.setEmailAddress(updatedData.getEmailAddress());
                patient.setResidentialAddress(updatedData.getResidentialAddress());
                patient.setEmergencyContact(updatedData.getEmergencyContact());
                patient.setBloodGroup(updatedData.getBloodGroup());
                patient.setAllergies(updatedData.getAllergies());
                patient.setChronicDiseases(updatedData.getChronicDiseases());
                patient.setCurrentMedications(updatedData.getCurrentMedications());
                patient.setHeight(updatedData.getHeight());
                patient.setWeight(updatedData.getWeight());

                Patient saved = patientRepository.save(patient);
                saved.setPassword(null);

                return ResponseEntity.ok(saved);
        }
}
