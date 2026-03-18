package com.example.springcrud.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "prescriptions")
public class Prescription {

    @Id
    private String id;
    @Indexed(unique = true)
    private String prescriptionId;
    private String recordStatus;

    private LocalDateTime createdDate;
    private Boolean doctorChangeAllowed;

    private Patient patient;
    private Doctor currentDoctor;

    private Diagnosis diagnosis;
    private TreatmentTimeline treatmentTimeline;

    private List<Medication> medications;
    private List<Procedure> procedures;
    private List<Investigation> investigations;

    private List<DoctorAssignment> previousDoctors;

    private FollowUp followUp;
    private Audit audit;

    // ---------- INNER CLASSES ----------

    public static class DoctorAssignment {

        private Doctor doctor;
        private LocalDate assignedFrom;
        private LocalDate assignedTo;
        private String changeReason;
        private String changedBy; // PATIENT / ADMIN / SYSTEM
        private Boolean active;

        // Fixed: Removed getters/setters for fields that do not exist in this inner
        // class

        public Doctor getDoctor() {
            return doctor;
        }

        public void setDoctor(Doctor doctor) {
            this.doctor = doctor;
        }

        public LocalDate getAssignedFrom() {
            return assignedFrom;
        }

        public void setAssignedFrom(LocalDate assignedFrom) {
            this.assignedFrom = assignedFrom;
        }

        public LocalDate getAssignedTo() {
            return assignedTo;
        }

        public void setAssignedTo(LocalDate assignedTo) {
            this.assignedTo = assignedTo;
        }

        public String getChangeReason() {
            return changeReason;
        }

        public void setChangeReason(String changeReason) {
            this.changeReason = changeReason;
        }

        public String getChangedBy() {
            return changedBy;
        }

        public void setChangedBy(String changedBy) {
            this.changedBy = changedBy;
        }

        public Boolean getActive() {
            return active;
        }

        public void setActive(Boolean active) {
            this.active = active;
        }
    }

    public static class Patient {
        private String patientId;

        public String getPatientId() {
            return patientId;
        }

        public void setPatientId(String patientId) {
            this.patientId = patientId;
        }
    }

    public static class Contact {
        private String phone;
        private String email;

        public String getPhone() {
            return phone;
        }

        public void setPhone(String phone) {
            this.phone = phone;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }
    }

    public static class Doctor {
        private String doctorId;

        public String getDoctorId() {
            return doctorId;
        }

        public void setDoctorId(String doctorId) {
            this.doctorId = doctorId;
        }
    }

    public static class Hospital {
        private String hospitalId;
        private String name;

        public String getHospitalId() {
            return hospitalId;
        }

        public void setHospitalId(String hospitalId) {
            this.hospitalId = hospitalId;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }
    }

    public static class Diagnosis {
        private String provisionalDiagnosis;
        private String confirmedDiagnosis;
        private String icdCode;
        private String severity;

        public String getProvisionalDiagnosis() {
            return provisionalDiagnosis;
        }

        public void setProvisionalDiagnosis(String provisionalDiagnosis) {
            this.provisionalDiagnosis = provisionalDiagnosis;
        }

        public String getConfirmedDiagnosis() {
            return confirmedDiagnosis;
        }

        public void setConfirmedDiagnosis(String confirmedDiagnosis) {
            this.confirmedDiagnosis = confirmedDiagnosis;
        }

        public String getIcdCode() {
            return icdCode;
        }

        public void setIcdCode(String icdCode) {
            this.icdCode = icdCode;
        }

        public String getSeverity() {
            return severity;
        }

        public void setSeverity(String severity) {
            this.severity = severity;
        }
    }

    public static class TreatmentTimeline {
        private LocalDate treatmentStartDate;
        private LocalDate expectedCompletionDate;
        private LocalDate actualCompletionDate;
        private String treatmentStatus;
        private String remarks;

        public LocalDate getTreatmentStartDate() {
            return treatmentStartDate;
        }

        public void setTreatmentStartDate(LocalDate treatmentStartDate) {
            this.treatmentStartDate = treatmentStartDate;
        }

        public LocalDate getExpectedCompletionDate() {
            return expectedCompletionDate;
        }

        public void setExpectedCompletionDate(LocalDate expectedCompletionDate) {
            this.expectedCompletionDate = expectedCompletionDate;
        }

        public LocalDate getActualCompletionDate() {
            return actualCompletionDate;
        }

        public void setActualCompletionDate(LocalDate actualCompletionDate) {
            this.actualCompletionDate = actualCompletionDate;
        }

        public String getTreatmentStatus() {
            return treatmentStatus;
        }

        public void setTreatmentStatus(String treatmentStatus) {
            this.treatmentStatus = treatmentStatus;
        }

        public String getRemarks() {
            return remarks;
        }

        public void setRemarks(String remarks) {
            this.remarks = remarks;
        }
    }

    public static class Medication {
        private String medicineId;
        private String medicineName;

        public String getMedicineId() {
            return medicineId;
        }

        public void setMedicineId(String medicineId) {
            this.medicineId = medicineId;
        }

        public String getMedicineName() {
            return medicineName;
        }

        public void setMedicineName(String medicineName) {
            this.medicineName = medicineName;
        }

    }

    public static class Procedure {
        private String procedureName;
        private LocalDate startDate;
        private LocalDate endDate;
        private Integer sessions;
        private String outcome;

        public String getProcedureName() {
            return procedureName;
        }

        public void setProcedureName(String procedureName) {
            this.procedureName = procedureName;
        }

        public LocalDate getStartDate() {
            return startDate;
        }

        public void setStartDate(LocalDate startDate) {
            this.startDate = startDate;
        }

        public LocalDate getEndDate() {
            return endDate;
        }

        public void setEndDate(LocalDate endDate) {
            this.endDate = endDate;
        }

        public Integer getSessions() {
            return sessions;
        }

        public void setSessions(Integer sessions) {
            this.sessions = sessions;
        }

        public String getOutcome() {
            return outcome;
        }

        public void setOutcome(String outcome) {
            this.outcome = outcome;
        }
    }

    public static class Investigation {
        private String testName;

        public String getTestName() {
            return testName;
        }

        public void setTestName(String testName) {
            this.testName = testName;
        }
    }

    public static class FollowUp {
        private Boolean followUpRequired;
        private LocalDate followUpDate;
        private String notes;

        public Boolean getFollowUpRequired() {
            return followUpRequired;
        }

        public void setFollowUpRequired(Boolean followUpRequired) {
            this.followUpRequired = followUpRequired;
        }

        public LocalDate getFollowUpDate() {
            return followUpDate;
        }

        public void setFollowUpDate(LocalDate followUpDate) {
            this.followUpDate = followUpDate;
        }

        public String getNotes() {
            return notes;
        }

        public void setNotes(String notes) {
            this.notes = notes;
        }
    }

    public static class Audit {
        private LocalDateTime createdAt;
        private LocalDateTime lastUpdatedAt;
        private String createdBy;

        public LocalDateTime getCreatedAt() {
            return createdAt;
        }

        public void setCreatedAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
        }

        public LocalDateTime getLastUpdatedAt() {
            return lastUpdatedAt;
        }

        public void setLastUpdatedAt(LocalDateTime lastUpdatedAt) {
            this.lastUpdatedAt = lastUpdatedAt;
        }

        public String getCreatedBy() {
            return createdBy;
        }

        public void setCreatedBy(String createdBy) {
            this.createdBy = createdBy;
        }
    }

    // ---------- ROOT GETTERS & SETTERS ----------

    public String getPrescriptionId() {
        return prescriptionId;
    }

    public void setPrescriptionId(String prescriptionId) {
        this.prescriptionId = prescriptionId;
    }

    public String getRecordStatus() {
        return recordStatus;
    }

    public void setRecordStatus(String recordStatus) {
        this.recordStatus = recordStatus;
    }

    // Fixed: Added missing getter/setter
    public Boolean getDoctorChangeAllowed() {
        return doctorChangeAllowed;
    }

    public void setDoctorChangeAllowed(Boolean doctorChangeAllowed) {
        this.doctorChangeAllowed = doctorChangeAllowed;
    }

    public Patient getPatient() {
        return patient;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }

    // Fixed: Corrected name to match field 'currentDoctor'
    public Doctor getCurrentDoctor() {
        return currentDoctor;
    }

    public void setCurrentDoctor(Doctor currentDoctor) {
        this.currentDoctor = currentDoctor;
    }

    public Diagnosis getDiagnosis() {
        return diagnosis;
    }

    public void setDiagnosis(Diagnosis diagnosis) {
        this.diagnosis = diagnosis;
    }

    public TreatmentTimeline getTreatmentTimeline() {
        return treatmentTimeline;
    }

    public void setTreatmentTimeline(TreatmentTimeline treatmentTimeline) {
        this.treatmentTimeline = treatmentTimeline;
    }

    public List<Medication> getMedications() {
        return medications;
    }

    public void setMedications(List<Medication> medications) {
        this.medications = medications;
    }

    public List<Procedure> getProcedures() {
        return procedures;
    }

    public void setProcedures(List<Procedure> procedures) {
        this.procedures = procedures;
    }

    public List<Investigation> getInvestigations() {
        return investigations;
    }

    public void setInvestigations(List<Investigation> investigations) {
        this.investigations = investigations;
    }

    // Fixed: Added missing getter/setter
    public List<DoctorAssignment> getPreviousDoctors() {
        return previousDoctors;
    }

    public void setPreviousDoctors(List<DoctorAssignment> previousDoctors) {
        this.previousDoctors = previousDoctors;
    }

    public FollowUp getFollowUp() {
        return followUp;
    }

    public void setFollowUp(FollowUp followUp) {
        this.followUp = followUp;
    }

    public Audit getAudit() {
        return audit;
    }

    public void setAudit(Audit audit) {
        this.audit = audit;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public LocalDateTime getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(LocalDateTime createdDate) {
        this.createdDate = createdDate;
    }
}