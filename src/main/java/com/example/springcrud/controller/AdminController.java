package com.example.springcrud.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.example.springcrud.model.Admin;
import com.example.springcrud.model.ChangePasswordRequest;
import com.example.springcrud.model.LoginRequest;
import com.example.springcrud.model.LoginResponse;
import com.example.springcrud.model.ResetPasswordRequest;
import com.example.springcrud.repository.AdminRepository;

@RestController
@RequestMapping("/api/admins")
@CrossOrigin(origins = "*")
public class AdminController {

        @Autowired
        private BCryptPasswordEncoder passwordEncoder;

        @Autowired
        private AdminRepository adminRepository;

        // ================= CREATE =================

        @PostMapping
        public ResponseEntity<Admin> createAdmin(@RequestBody Admin admin) {

                // 🔐 HASH PASSWORD BEFORE SAVING
                admin.setPassword(passwordEncoder.encode(admin.getPassword()));

                admin.setCreatedAt(LocalDateTime.now());
                admin.setUpdatedAt(LocalDateTime.now());

                Admin savedAdmin = adminRepository.save(admin);

                // Never return password
                savedAdmin.setPassword(null);

                return new ResponseEntity<>(savedAdmin, HttpStatus.CREATED);
        }

        // ================= READ WITH FILTERS =================
        @GetMapping
        public ResponseEntity<List<Admin>> getAllAdmins(
                        @RequestParam(required = false) String username,
                        @RequestParam(required = false) String email,
                        @RequestParam(required = false) String role,
                        @RequestParam(required = false) String status,

                        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime createdAfter,

                        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime createdBefore,

                        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime lastLoginAfter,

                        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime lastLoginBefore) {

                List<Admin> admins = adminRepository.findAll();

                List<Admin> filteredAdmins = admins.stream()

                                // username (partial, case-insensitive)
                                .filter(a -> username == null ||
                                                (a.getUsername() != null &&
                                                                a.getUsername().toLowerCase()
                                                                                .contains(username.toLowerCase())))

                                // email (exact)
                                .filter(a -> email == null ||
                                                (a.getEmail() != null &&
                                                                a.getEmail().equalsIgnoreCase(email)))

                                // role
                                .filter(a -> role == null ||
                                                (a.getRole() != null &&
                                                                a.getRole().equalsIgnoreCase(role)))

                                // status
                                .filter(a -> status == null ||
                                                (a.getStatus() != null &&
                                                                a.getStatus().equalsIgnoreCase(status)))

                                // createdAt >= createdAfter
                                .filter(a -> createdAfter == null ||
                                                (a.getCreatedAt() != null &&
                                                                a.getCreatedAt().isAfter(createdAfter)))

                                // createdAt <= createdBefore
                                .filter(a -> createdBefore == null ||
                                                (a.getCreatedAt() != null &&
                                                                a.getCreatedAt().isBefore(createdBefore)))

                                // lastLoginAt >= lastLoginAfter
                                .filter(a -> lastLoginAfter == null ||
                                                (a.getLastLoginAt() != null &&
                                                                a.getLastLoginAt().isAfter(lastLoginAfter)))

                                // lastLoginAt <= lastLoginBefore
                                .filter(a -> lastLoginBefore == null ||
                                                (a.getLastLoginAt() != null &&
                                                                a.getLastLoginAt().isBefore(lastLoginBefore)))

                                .collect(Collectors.toList());

                filteredAdmins.forEach(a -> a.setPassword(null));

                return new ResponseEntity<>(filteredAdmins, HttpStatus.OK);

        }

        // ================= READ BY ID =================
        @GetMapping("/{id}")
        public ResponseEntity<Admin> getAdminById(@PathVariable String id) {

                Optional<Admin> adminOptional = adminRepository.findById(id);

                if (!adminOptional.isPresent()) {
                        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
                }

                Admin admin = adminOptional.get();
                admin.setPassword(null);

                return new ResponseEntity<>(admin, HttpStatus.OK);
        }

        @GetMapping("/profile/{id}")
        public ResponseEntity<?> getAdminProfile(@PathVariable String id) {

                Optional<Admin> adminOptional = adminRepository.findById(id);

                if (!adminOptional.isPresent()) {
                        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                        .body("Admin not found");
                }

                Admin admin = adminOptional.get();
                admin.setPassword(null); // NEVER expose password

                return ResponseEntity.ok(admin);
        }

        @PostMapping("/change-password")
        public ResponseEntity<?> changePassword(
                        @RequestBody ChangePasswordRequest request) {

                Optional<Admin> adminOptional = adminRepository.findById(request.getAdminId());

                if (!adminOptional.isPresent()) {
                        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                        .body("Admin not found");
                }

                Admin admin = adminOptional.get();

                if (!passwordEncoder.matches(
                                request.getOldPassword(),
                                admin.getPassword())) {

                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                        .body("Old password incorrect");
                }

                admin.setPassword(
                                passwordEncoder.encode(request.getNewPassword()));
                admin.setUpdatedAt(LocalDateTime.now());

                adminRepository.save(admin);

                return ResponseEntity.ok("Password changed successfully");
        }

        @PostMapping("/reset-password")
        public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {

                if (request.getEmail() == null ||
                                request.getPhone() == null ||
                                request.getNewPassword() == null) {

                        return ResponseEntity.badRequest().body("Missing required fields");
                }

                Optional<Admin> adminOptional = adminRepository.findByEmailAndPhone(
                                request.getEmail(),
                                request.getPhone());

                if (!adminOptional.isPresent()) {
                        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                        .body("Invalid email or phone");
                }

                Admin admin = adminOptional.get();

                admin.setPassword(
                                passwordEncoder.encode(request.getNewPassword()));
                admin.setUpdatedAt(LocalDateTime.now());

                adminRepository.save(admin);

                return ResponseEntity.ok("Admin password reset successful");
        }

        // ================= UPDATE =================
        @PutMapping("/{id}")
        public ResponseEntity<Admin> updateAdmin(
                        @PathVariable String id,
                        @RequestBody Admin admin) {

                Optional<Admin> adminOptional = adminRepository.findById(id);

                if (adminOptional.isPresent()) {
                        Admin existing = adminOptional.get();

                        existing.setUsername(admin.getUsername());
                        existing.setEmail(admin.getEmail());
                        existing.setRole(admin.getRole());
                        existing.setStatus(admin.getStatus());
                        existing.setUpdatedAt(LocalDateTime.now());

                        Admin updatedAdmin = adminRepository.save(existing);
                        updatedAdmin.setPassword(null); // <-- HERE

                        return new ResponseEntity<>(updatedAdmin, HttpStatus.OK);

                } else {
                        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
                }
        }

        @PostMapping("/login")
        public ResponseEntity<?> loginAdmin(@RequestBody LoginRequest request) {

                Optional<Admin> admin = adminRepository.findByPhone(request.getPhone());

                if (admin.isPresent() &&
                                passwordEncoder.matches(request.getPassword(), admin.get().getPassword())) {

                        Admin loggedInAdmin = admin.get();

                        LoginResponse response = new LoginResponse(
                                        "Login Successful",
                                        loggedInAdmin.getId(), // use ID, not phone
                                        loggedInAdmin.getUsername(),
                                        "ADMIN");

                        return ResponseEntity.ok(response);
                }

                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                .body("Invalid credentials");
        }

        // ================= DELETE =================
        @DeleteMapping("/{id}")
        public ResponseEntity<HttpStatus> deleteAdmin(@PathVariable String id) {
                try {
                        adminRepository.deleteById(id);
                        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
                } catch (Exception e) {
                        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
                }
        }
}
