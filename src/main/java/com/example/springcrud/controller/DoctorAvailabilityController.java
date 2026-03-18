package com.example.springcrud.controller;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.springcrud.model.DoctorAvailability;
import com.example.springcrud.repository.DoctorAvailabilityRepository;

@RestController
@RequestMapping("/api/doctor-availability")
@CrossOrigin(origins = "*")  
public class DoctorAvailabilityController {

    @Autowired
    private DoctorAvailabilityRepository availabilityRepository;

    // CREATE
    @PostMapping
    public ResponseEntity<DoctorAvailability> createAvailability(
            @RequestBody DoctorAvailability availability) {

        DoctorAvailability savedAvailability = availabilityRepository.save(availability);
        return new ResponseEntity<>(savedAvailability, HttpStatus.CREATED);
    }
    
    // READ - Get all availability (with optional filters)
    @GetMapping
    public ResponseEntity<List<DoctorAvailability>> getAllAvailability(
            @RequestParam(required = false) String doctorId,
            @RequestParam(required = false) String day,
            @RequestParam(required = false) Boolean available
    ) {

        List<DoctorAvailability> availabilityList = availabilityRepository.findAll();

        List<DoctorAvailability> filteredList = availabilityList.stream()
                .filter(a -> doctorId == null ||
                        (a.getDoctorId() != null && doctorId.equalsIgnoreCase(a.getDoctorId())))
                .filter(a -> day == null ||
                        (a.getDay() != null && day.equalsIgnoreCase(a.getDay())))
                .filter(a -> available == null ||
                        (a.getAvailable() != null && a.getAvailable().equals(available)))
                .collect(Collectors.toList());

        return new ResponseEntity<>(filteredList, HttpStatus.OK);
    }

    // READ - Get availability by Mongo _id
    @GetMapping("/{id}")
    public ResponseEntity<DoctorAvailability> getAvailabilityById(@PathVariable String id) {
        Optional<DoctorAvailability> availability = availabilityRepository.findById(id);
        return availability.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                           .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // UPDATE (DetailsController style)
    @PutMapping("/{id}")
    public ResponseEntity<DoctorAvailability> updateAvailability(
            @PathVariable String id,
            @RequestBody DoctorAvailability availability
    ) {

        Optional<DoctorAvailability> availabilityOptional = availabilityRepository.findById(id);

        if (availabilityOptional.isPresent()) {
            DoctorAvailability availabilityToUpdate = availabilityOptional.get();

            availabilityToUpdate.setDoctorId(availability.getDoctorId());
            availabilityToUpdate.setDay(availability.getDay());
            availabilityToUpdate.setStartTime(availability.getStartTime());
            availabilityToUpdate.setEndTime(availability.getEndTime());
            availabilityToUpdate.setAvailable(availability.getAvailable());

            DoctorAvailability updatedAvailability =
                    availabilityRepository.save(availabilityToUpdate);

            return new ResponseEntity<>(updatedAvailability, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteAvailability(@PathVariable String id) {
        try {
            availabilityRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
