package com.example.springcrud.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
public class patWebController {

    // ================= LANDING PAGE =================
    @GetMapping("/patient")
    public String Login() {
        return "Login";
    }

    @GetMapping("/patient/patientRegister")
    public String adminpatientRegister(Model model) {
        model.addAttribute("pageTitle", "patient Register");
        model.addAttribute("activeTab", "patientRegister");
        return "admin/patient-register";
    }

    @GetMapping("/patient/dashboard")
    public String adminpatientDashboard(Model model) {
        model.addAttribute("pageTitle", "patient Dashboard");
        model.addAttribute("activeTab", "patientDashboard");
        return "patient/patDashboard";
    }

    @GetMapping("/patient/doctors")
    public String patientDoctorsPage() {
        return "patient/patDoctor";
    }

    @GetMapping("/patient/clinics")
    public String patientClinicsPage() {
        return "patient/patClinic";
    }

    @GetMapping("/patient/addTest")
    public String patientAddTestPage() {
        return "patient/patAddTest";
    }

    @GetMapping("/patient/profile")
    public String patientProfilePage() {
        return "patient/patProfile";
    }

    @GetMapping("/patient/medTest")
    public String patientMedTestPage() {
        return "patient/patTest";
    }

    @GetMapping("/patient/tests/{testId}")
    public String viewTestPage(@PathVariable String testId) {
        return "patient/patViewTest"; // your HTML file name
    }
    @GetMapping("/patient/prescriptions")
    public String patientPrescriptionsPage() {
        return "patient/patPrescription";
    }

    @GetMapping("/patient/prescriptions/{prescriptionId}")
    public String viewPrescriptionPage(@PathVariable String prescriptionId) {
        return "patient/patViewPrescription";
    }
}