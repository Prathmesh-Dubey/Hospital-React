package com.example.springcrud.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.springcrud.model.Medicines;
import com.example.springcrud.repository.MedicinesRepository;

@RestController
@RequestMapping("/api/medicines")
@CrossOrigin(origins = "*")  
public class MedicinesController {

    @Autowired
    private MedicinesRepository medicinesRepository;

    // CREATE
    @PostMapping
    public Medicines save(@RequestBody Medicines medicine) {

        medicine.setId(null); // ensure new

        Medicines saved = medicinesRepository.save(medicine);

        saved.setMedId("MED-" + saved.getId().substring(saved.getId().length() - 4));

        return medicinesRepository.save(saved);
    }

    // READ - Get all medicines (with optional filters)
    @GetMapping
    public ResponseEntity<List<Medicines>> getAllMedicines(
            @RequestParam(required = false) String doctorId,
            @RequestParam(required = false) String patientId,
            @RequestParam(required = false) String name) {

        if (doctorId != null && patientId != null) {
            return ResponseEntity.ok(
                    medicinesRepository.findByDoctorIdAndPatientId(doctorId, patientId));
        }

        if (doctorId != null) {
            return ResponseEntity.ok(
                    medicinesRepository.findByDoctorId(doctorId));
        }
        if (name != null) {
            return ResponseEntity.ok(
                    medicinesRepository.findByMedicineNameContainingIgnoreCase(name));
        }

        return ResponseEntity.ok(medicinesRepository.findAll());
    }

    // READ - Get medicine by Mongo _id
    @GetMapping("/{id}")
    public ResponseEntity<Medicines> getMedicineById(@PathVariable String id) {
        Optional<Medicines> medicine = medicinesRepository.findById(id);
        return medicine.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping("/doctor/{doctorId}/patients/{patientId}")
    public ResponseEntity<Medicines> createMedicineForPatient(
            @PathVariable String doctorId,
            @PathVariable String patientId,
            @RequestBody Medicines medicine) {

        medicine.setId(null);

        medicine.setDoctorId(doctorId);
        medicine.setPatientId(patientId);

        medicine.setMedId("MED-" + System.currentTimeMillis());

        Medicines saved = medicinesRepository.save(medicine);

        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<Medicines>> getMedicinesByDoctor(
            @PathVariable String doctorId) {

        List<Medicines> medicines = medicinesRepository.findByDoctorId(doctorId);

        return ResponseEntity.ok(medicines);
    }

    @GetMapping("/doctor/{doctorId}/patients/{patientId}")
    public ResponseEntity<List<Medicines>> getDoctorPatientMedicines(
            @PathVariable String doctorId,
            @PathVariable String patientId) {

        List<Medicines> medicines = medicinesRepository.findByDoctorIdAndPatientId(doctorId, patientId);

        return ResponseEntity.ok(medicines);
    }

    @GetMapping("/patients/{patientId}")
    public ResponseEntity<List<Medicines>> getMedicinesByPatient(
            @PathVariable String patientId) {

        List<Medicines> medicines = medicinesRepository.findByPatientId(patientId);

        return ResponseEntity.ok(medicines);
    }

    // UPDATE (DetailsController style)
    @PutMapping("/{id}")
    public ResponseEntity<Medicines> updateMedicine(
            @PathVariable String id,
            @RequestBody Medicines medicine) {

        Optional<Medicines> medicineOptional = medicinesRepository.findById(id);

        if (medicineOptional.isPresent()) {

            Medicines medicineToUpdate = medicineOptional.get();

            // DO NOT change medId
            // DO NOT change id

            medicineToUpdate.setMedicineName(medicine.getMedicineName());
            medicineToUpdate.setCompanyName(medicine.getCompanyName());
            medicineToUpdate.setRecordStatus(medicine.getRecordStatus());
            medicineToUpdate.setDoctorChangeAllowed(medicine.getDoctorChangeAllowed());
            medicineToUpdate.setDosage(medicine.getDosage());
            medicineToUpdate.setRoute(medicine.getRoute());
            medicineToUpdate.setFrequency(medicine.getFrequency());
            medicineToUpdate.setDuration(medicine.getDuration());
            medicineToUpdate.setExpiryDate(medicine.getExpiryDate());
            medicineToUpdate.setPrice(medicine.getPrice());
            medicineToUpdate.setStartDate(medicine.getStartDate());
            medicineToUpdate.setEndDate(medicine.getEndDate());
            medicineToUpdate.setSpecialInstructions(medicine.getSpecialInstructions());

            Medicines updatedMedicine = medicinesRepository.save(medicineToUpdate);

            return new ResponseEntity<>(updatedMedicine, HttpStatus.OK);

        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteMedicine(@PathVariable String id) {
        try {
            medicinesRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
