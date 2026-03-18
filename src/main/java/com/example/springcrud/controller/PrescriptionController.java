package com.example.springcrud.controller;

import com.example.springcrud.model.Prescription;
import com.example.springcrud.repository.PrescriptionRepository;
import com.example.springcrud.service.SequenceGeneratorService;

import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/prescriptions")
@CrossOrigin(origins = "*")
public class PrescriptionController {

    private final PrescriptionRepository repository;
    private final MongoTemplate mongoTemplate;
    private final SequenceGeneratorService sequenceGenerator;

    public PrescriptionController(
            PrescriptionRepository repository,
            MongoTemplate mongoTemplate,
            SequenceGeneratorService sequenceGenerator) {

        this.repository = repository;
        this.mongoTemplate = mongoTemplate;
        this.sequenceGenerator = sequenceGenerator;
    }

    // =============================
    // FILTERED GET
    // =============================
    @GetMapping
    public ResponseEntity<List<Prescription>> getFilteredPrescriptions(

            @RequestParam(required = false) String recordStatus,
            @RequestParam(required = false) Boolean doctorChangeAllowed,
            @RequestParam(required = false) String patientId,
            @RequestParam(required = false) String doctorId,
            @RequestParam(required = false) String severity,
            @RequestParam(required = false) String icdCode,
            @RequestParam(required = false) String treatmentStatus,
            @RequestParam(required = false) Boolean followUpRequired,

            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate treatmentStartFrom,

            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate treatmentStartTo,

            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime createdFrom,

            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime createdTo) {

        Query query = new Query();

        if (recordStatus != null) {
            query.addCriteria(Criteria.where("recordStatus").is(recordStatus));
        }

        if (doctorChangeAllowed != null) {
            query.addCriteria(Criteria.where("doctorChangeAllowed").is(doctorChangeAllowed));
        }

        if (patientId != null) {
            query.addCriteria(Criteria.where("patient.patientId").is(patientId));
        }

        if (doctorId != null) {
            query.addCriteria(Criteria.where("currentDoctor.doctorId").is(doctorId));
        }

        if (severity != null) {
            query.addCriteria(Criteria.where("diagnosis.severity").is(severity));
        }

        if (icdCode != null) {
            query.addCriteria(Criteria.where("diagnosis.icdCode").is(icdCode));
        }

        if (treatmentStatus != null) {
            query.addCriteria(Criteria.where("treatmentTimeline.treatmentStatus").is(treatmentStatus));
        }

        if (followUpRequired != null) {
            query.addCriteria(Criteria.where("followUp.followUpRequired").is(followUpRequired));
        }

        if (treatmentStartFrom != null && treatmentStartTo != null) {
            query.addCriteria(Criteria.where("treatmentTimeline.treatmentStartDate")
                    .gte(treatmentStartFrom)
                    .lte(treatmentStartTo));
        }

        if (createdFrom != null && createdTo != null) {
            query.addCriteria(Criteria.where("createdDate")
                    .gte(createdFrom)
                    .lte(createdTo));
        }

        List<Prescription> results = mongoTemplate.find(query, Prescription.class);

        return ResponseEntity.ok(results);
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<Prescription>> getPrescriptionsByDoctor(
            @PathVariable String doctorId) {

        Query query = new Query();
        query.addCriteria(Criteria.where("currentDoctor.doctorId").is(doctorId));

        List<Prescription> prescriptions = mongoTemplate.find(query, Prescription.class);

        return ResponseEntity.ok(prescriptions);
    }

    @GetMapping("/doctor/{doctorId}/patients/{patientId}")
    public ResponseEntity<List<Prescription>> getDoctorPatientPrescriptions(
            @PathVariable String doctorId,
            @PathVariable String patientId) {

        Query query = new Query();
        query.addCriteria(
                Criteria.where("currentDoctor.doctorId").is(doctorId)
                        .and("patient.patientId").is(patientId));

        List<Prescription> prescriptions = mongoTemplate.find(query, Prescription.class);

        return ResponseEntity.ok(prescriptions);
    }

    @PostMapping("/doctor/{doctorId}")
    public ResponseEntity<Prescription> createPrescriptionForDoctor(
            @PathVariable String doctorId,
            @RequestBody Prescription prescription) {

        // Set doctor automatically
        Prescription.Doctor doctor = new Prescription.Doctor();
        doctor.setDoctorId(doctorId);
        prescription.setCurrentDoctor(doctor);

        long seq = sequenceGenerator.generateSequence("prescription_sequence");
        String formattedId = String.format("PRS-%03d", seq);
        prescription.setPrescriptionId(formattedId);

        prescription.setCreatedDate(LocalDateTime.now());
        Prescription saved = repository.save(prescription);

        return ResponseEntity.ok(saved);
    }

    @PostMapping("/doctor/{doctorId}/patients/{patientId}")
    public ResponseEntity<Prescription> createPrescriptionForDoctorAndPatient(
            @PathVariable String doctorId,
            @PathVariable String patientId,
            @RequestBody Prescription prescription) {

        // Set doctor
        Prescription.Doctor doctor = new Prescription.Doctor();
        doctor.setDoctorId(doctorId);
        prescription.setCurrentDoctor(doctor);

        // Set patient
        Prescription.Patient patient = new Prescription.Patient();
        patient.setPatientId(patientId);
        prescription.setPatient(patient);

        long seq = sequenceGenerator.generateSequence("prescription_sequence");
        String formattedId = String.format("PRS-%03d", seq);
        prescription.setPrescriptionId(formattedId);

        prescription.setCreatedDate(LocalDateTime.now());
        Prescription saved = repository.save(prescription);

        return ResponseEntity.ok(saved);
    }

    @GetMapping("/patients/{patientId}")
    public ResponseEntity<List<Prescription>> getPrescriptionsByPatient(
            @PathVariable String patientId) {

        Query query = new Query();

        query.addCriteria(
                Criteria.where("patient.patientId").is(patientId));

        List<Prescription> prescriptions = mongoTemplate.find(query, Prescription.class);

        return ResponseEntity.ok(prescriptions);
    }
    // =============================
    // NORMAL CRUD BELOW
    // =============================

    @GetMapping("/{prescriptionId}")
    public ResponseEntity<Prescription> getPrescriptionByPrescriptionId(
            @PathVariable String prescriptionId) {

        return repository.findByPrescriptionId(prescriptionId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Prescription> createPrescription(
            @RequestBody Prescription prescription) {

        long seq = sequenceGenerator.generateSequence("prescription_sequence");

        String formattedId = String.format("PRS-%03d", seq);
        prescription.setPrescriptionId(formattedId);
        prescription.setCreatedDate(LocalDateTime.now());

        Prescription saved = repository.save(prescription);

        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{prescriptionId}")
    public ResponseEntity<Prescription> updatePrescription(
            @PathVariable String prescriptionId,
            @RequestBody Prescription updatedPrescription) {

        return repository.findByPrescriptionId(prescriptionId)
                .map(existing -> {
                    updatedPrescription.setId(existing.getId()); // preserve Mongo _id
                    updatedPrescription.setPrescriptionId(existing.getPrescriptionId());
                    return ResponseEntity.ok(repository.save(updatedPrescription));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/patients-safe/{patientId}")
    public ResponseEntity<List<Prescription>> getPrescriptionsByPatientSafe(
            @PathVariable String patientId) {

        Query query = new Query();

        query.addCriteria(
                Criteria.where("patient").ne(null)
                        .and("patient.patientId").is(patientId));

        List<Prescription> prescriptions = mongoTemplate.find(query, Prescription.class);

        return ResponseEntity.ok(prescriptions);
    }

    @DeleteMapping("/{prescriptionId}")
    public ResponseEntity<Void> deletePrescription(
            @PathVariable String prescriptionId) {

        if (!repository.existsByPrescriptionId(prescriptionId)) {
            return ResponseEntity.notFound().build();
        }

        repository.deleteByPrescriptionId(prescriptionId);
        return ResponseEntity.noContent().build();
    }
}