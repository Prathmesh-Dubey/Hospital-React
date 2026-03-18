package com.example.springcrud.controller;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.springcrud.model.MedicalTest;
import com.example.springcrud.repository.MedicalTestRepository;

@RestController
@RequestMapping("/api/medical-tests")
@CrossOrigin(origins = "*")  
public class MedicalTestController {

    private final MedicalTestRepository medicalTestRepository;

    public MedicalTestController(MedicalTestRepository medicalTestRepository) {
        this.medicalTestRepository = medicalTestRepository;
    }

    // ================= CREATE =================
    @PostMapping
    public ResponseEntity<MedicalTest> createMedicalTest(
            @RequestBody MedicalTest medicalTest) {

        // Generate readable unique Test ID
        medicalTest.setTestId(
                "MT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());

        MedicalTest savedTest = medicalTestRepository.save(medicalTest);
        return ResponseEntity.status(201).body(savedTest);
    }

    // ================= READ ALL =================
    @GetMapping
    public ResponseEntity<List<MedicalTest>> getAllMedicalTests(
            @RequestParam(required = false) String patientId,
            @RequestParam(required = false) String doctorId,
            @RequestParam(required = false) String testName,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String resultStatus) {

        List<MedicalTest> tests;

        if (patientId != null)
            tests = medicalTestRepository.findByPatientId(patientId);
        else if (doctorId != null)
            tests = medicalTestRepository.findByDoctorId(doctorId);
        else if (testName != null)
            tests = medicalTestRepository.findByTestNameContainingIgnoreCase(testName);
        else if (category != null)
            tests = medicalTestRepository.findByCategoryIgnoreCase(category);
        else if (resultStatus != null)
            tests = medicalTestRepository.findByResultStatusIgnoreCase(resultStatus);
        else
            tests = medicalTestRepository.findAll();

        return ResponseEntity.ok(tests);
    }

    @GetMapping("/patients/{patientId}")
    public ResponseEntity<List<MedicalTest>> getMedicalTestsByPatient(
            @PathVariable String patientId) {

        List<MedicalTest> tests = medicalTestRepository.findByPatientId(patientId);

        return ResponseEntity.ok(tests);
    }

    // ================= READ BY ID =================
    @GetMapping("/{id}")
    public ResponseEntity<MedicalTest> getMedicalTestById(@PathVariable String id) {
        return medicalTestRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/doctor/{doctorId}/patients/{patientId}")
    public ResponseEntity<MedicalTest> createMedicalTestByDoctorForPatient(
            @PathVariable String doctorId,
            @PathVariable String patientId,
            @RequestBody MedicalTest medicalTest) {

        medicalTest.setId(null);

        medicalTest.setDoctorId(doctorId);
        medicalTest.setPatientId(patientId);

        medicalTest.setTestId("MT-" +
                UUID.randomUUID().toString().substring(0, 8).toUpperCase());

        MedicalTest saved = medicalTestRepository.save(medicalTest);

        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping("/doctor/{doctorId}/patients/{patientId}")
    public ResponseEntity<List<MedicalTest>> getDoctorPatientMedicalTests(
            @PathVariable String doctorId,
            @PathVariable String patientId) {

        List<MedicalTest> tests = medicalTestRepository
                .findByDoctorIdAndPatientId(doctorId, patientId);

        return ResponseEntity.ok(tests);
    }

    // ================= UPDATE =================
    @PutMapping("/{id}")
    public ResponseEntity<MedicalTest> updateMedicalTest(
            @PathVariable String id,
            @RequestBody MedicalTest updatedTest) {

        Optional<MedicalTest> existingOptional = medicalTestRepository.findById(id);

        if (!existingOptional.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        MedicalTest existing = existingOptional.get();

        existing.setPatientId(updatedTest.getPatientId());
        existing.setDoctorId(updatedTest.getDoctorId());
        existing.setTestName(updatedTest.getTestName());
        existing.setCategory(updatedTest.getCategory());
        existing.setPrice(updatedTest.getPrice());
        existing.setDescription(updatedTest.getDescription());
        existing.setResultStatus(updatedTest.getResultStatus());
        existing.setHistory(updatedTest.getHistory());

        MedicalTest saved = medicalTestRepository.save(existing);

        return ResponseEntity.ok(saved);
    }

    // ================= DELETE =================
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMedicalTest(@PathVariable String id) {

        if (!medicalTestRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        medicalTestRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/doctor/{doctorId}")
    public ResponseEntity<MedicalTest> createMedicalTestByDoctor(
            @PathVariable String doctorId,
            @RequestBody MedicalTest medicalTest) {

        // Prevent overwriting existing ID
        medicalTest.setId(null);

        // Assign doctor automatically
        medicalTest.setDoctorId(doctorId);

        // Generate readable testId
        medicalTest.setTestId("MT-" +
                UUID.randomUUID().toString().substring(0, 8).toUpperCase());

        MedicalTest saved = medicalTestRepository.save(medicalTest);

        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<MedicalTest>> getMedicalTestsByDoctor(
            @PathVariable String doctorId) {

        List<MedicalTest> tests = medicalTestRepository.findByDoctorId(doctorId);

        return ResponseEntity.ok(tests);
    }

    @GetMapping("/test/{testId}")
    public ResponseEntity<MedicalTest> getByTestId(@PathVariable String testId) {

        Optional<MedicalTest> test = medicalTestRepository.findByTestId(testId);

        if (test.isPresent()) {
            return ResponseEntity.ok(test.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/patient/{patientId}/test/{testId}")
    public ResponseEntity<?> getPatientTest(
            @PathVariable String patientId,
            @PathVariable String testId) {

        Optional<MedicalTest> test = medicalTestRepository.findByTestIdAndPatientId(testId, patientId);

        if (!test.isPresent()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(test.get());
    }
}