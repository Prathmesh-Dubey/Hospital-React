package com.example.springcrud.controller;

import com.example.springcrud.model.Clinic;
import com.example.springcrud.repository.ClinicRepository;
import com.example.springcrud.service.SequenceGeneratorService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/clinics")
@CrossOrigin(origins = "*")  
public class ClinicController {

    
    @Autowired
    private SequenceGeneratorService sequenceGeneratorService;

    @Autowired
    private ClinicRepository clinicRepository;

    // ================= CREATE =================
    @PostMapping
    public ResponseEntity<Clinic> createClinic(@RequestBody Clinic clinic) {

        long seq = sequenceGeneratorService.generateSequence("clinic_sequence");

        clinic.setClinicId(String.format("CLINIC%03d", seq));

        Clinic savedClinic = clinicRepository.save(clinic);

        return new ResponseEntity<>(savedClinic, HttpStatus.CREATED);
    }

    // ================= GET WITH FILTERS =================
    @GetMapping
    public ResponseEntity<List<Clinic>> getClinics(
            @RequestParam(required = false) String clinicName,
            @RequestParam(required = false) String clinicType,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String service,
            @RequestParam(required = false) Boolean appointmentRequired) {

        List<Clinic> clinics = clinicRepository.findAll();

        if (clinicType != null && !clinicType.trim().isEmpty()) {
            String type = clinicType.trim().toLowerCase();
            clinics = clinics.stream()
                    .filter(c -> c.getClinicType() != null &&
                            c.getClinicType().toLowerCase().equals(type))
                    .collect(Collectors.toList());
        }

        if (status != null && !status.trim().isEmpty()) {
            String st = status.trim().toLowerCase();
            clinics = clinics.stream()
                    .filter(c -> c.getStatus() != null &&
                            c.getStatus().toLowerCase().equals(st))
                    .collect(Collectors.toList());
        }

        if (city != null && !city.trim().isEmpty()) {
            String ct = city.trim().toLowerCase();
            clinics = clinics.stream()
                    .filter(c -> c.getAddress() != null &&
                            c.getAddress().getCity() != null &&
                            c.getAddress().getCity().toLowerCase().contains(ct))
                    .collect(Collectors.toList());
        }

        if (department != null && !department.trim().isEmpty()) {
            String dept = department.trim().toLowerCase();
            clinics = clinics.stream()
                    .filter(c -> c.getDepartments() != null &&
                            c.getDepartments().stream()
                                    .anyMatch(d -> d.toLowerCase().contains(dept)))
                    .collect(Collectors.toList());
        }

        if (service != null && !service.trim().isEmpty()) {
            String srv = service.trim().toLowerCase();
            clinics = clinics.stream()
                    .filter(c -> c.getServices() != null &&
                            c.getServices().stream()
                                    .anyMatch(s -> s.toLowerCase().contains(srv)))
                    .collect(Collectors.toList());
        }

        if (appointmentRequired != null) {
            clinics = clinics.stream()
                    .filter(c -> appointmentRequired.equals(c.getAppointmentRequired()))
                    .collect(Collectors.toList());
        }

        if (clinicName != null && !clinicName.trim().isEmpty()) {
            String name = clinicName.trim().toLowerCase();
            clinics = clinics.stream()
                    .filter(c -> c.getClinicName() != null &&
                            c.getClinicName().toLowerCase().contains(name))
                    .collect(Collectors.toList());
        }

        return ResponseEntity.ok(clinics);
    }

    // ================= GET BY ID =================
    @GetMapping("/{clinicId}")
    public ResponseEntity<Clinic> getClinicById(@PathVariable String clinicId) {

        Optional<Clinic> clinic = clinicRepository.findByClinicId(clinicId);

        return clinic.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ================= UPDATE =================
    @PutMapping("/{clinicId}")
    public ResponseEntity<Clinic> updateClinic(
            @PathVariable String clinicId,
            @RequestBody Clinic updatedClinic) {

        return clinicRepository.findByClinicId(clinicId)
                .map(existing -> {

                    updatedClinic.setId(existing.getId()); // keep Mongo _id
                    updatedClinic.setClinicId(existing.getClinicId()); // keep business ID

                    if (updatedClinic.getAudit() != null) {
                        updatedClinic.getAudit().setUpdatedAt(LocalDateTime.now());
                    }

                    return ResponseEntity.ok(clinicRepository.save(updatedClinic));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // ================= DELETE =================
    @DeleteMapping("/{clinicId}")
    public ResponseEntity<Void> deleteClinic(@PathVariable String clinicId) {

        if (!clinicRepository.existsByClinicId(clinicId)) {
            return ResponseEntity.notFound().build();
        }

        clinicRepository.deleteByClinicId(clinicId);
        return ResponseEntity.noContent().build();
    }

}
