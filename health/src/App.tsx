import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './components/LoginPage';
import { DashboardLayout } from './components/DashboardLayout';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ClinicList } from './components/admin/ClinicList';
import { DoctorDashboard } from './components/doctor/DoctorDashboard';
import { PatientDashboard } from './components/admin/PatientDashboard';
import { DoctorList } from './components/admin/DoctorList';
import { PatientList } from './components/admin/PatientList';
import { ClinicForm } from './components/admin/ClinicForm';
import { DoctorForm } from './components/admin/DoctorForm';
import { PatientForm } from "./components/admin/PatientForm";
import { PatientList as DoctorPatientList } from "./components/doctor/docPatient";
import { DoctorPatientPrescriptionList } from "./components/doctor/DoctorPatientPrescriptionList";
import { PrescriptionDetail } from "./components/doctor/docDetailedRx";
import { AddRx } from "./components/doctor/AddRx";
import { PatTestList } from './components/doctor/docPatTest';
import { MedicineList } from './components/doctor/docMedicine';
import { AddMedicine } from './components/doctor/docAddMedicine';
import { MedicalTestPatientList } from './components/doctor/doc-medicalTest';

const ProtectedRoute: React.FC<{ children: React.ReactNode, allowedRole: string }> = ({ children, allowedRole }) => {
  const role = localStorage.getItem('role');
  const user = localStorage.getItem('user');

  if (!user || role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute allowedRole="ADMIN">
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/clinics" element={
          <ProtectedRoute allowedRole="ADMIN">
            <ClinicList />
          </ProtectedRoute>
        } />
        <Route path="/clinics/new" element={<ClinicForm />} />
        <Route path="/clinics/edit/:clinicId" element={<ClinicForm />} />


        <Route path="/admin/doctors" element={
          <ProtectedRoute allowedRole="ADMIN">
            <DoctorList />
          </ProtectedRoute>
        } />
        <Route path="/doctors/new" element={<DoctorForm />} />
        <Route path="/doctors/edit/:doctorId" element={<DoctorForm />} />


        <Route path="/admin/patients" element={
          <ProtectedRoute allowedRole="ADMIN">
            <PatientList />
          </ProtectedRoute>} />
        <Route path="/patients/new" element={<PatientForm />} />
        <Route path="/patients/edit/:patientId" element={<PatientForm />} />

        <Route path="/admin/admins" element={
          <ProtectedRoute allowedRole="ADMIN">
            <div className="p-8"><h1 className="text-2xl font-bold">Admins Management</h1><p className="text-slate-500">Coming soon...</p></div>
          </ProtectedRoute>
        } />





        {/* Doctor Routes */}
        <Route path="/doctor/dashboard" element={
          <ProtectedRoute allowedRole="DOCTOR">
            <DoctorDashboard />
          </ProtectedRoute>
        } />
        <Route path="/doctor/patients" element={
          <ProtectedRoute allowedRole="DOCTOR">
            <DoctorPatientList />
          </ProtectedRoute>
        } />
        <Route
          path="/doctor/prescriptions"
          element={
            <ProtectedRoute allowedRole="DOCTOR">
              <PatTestList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/patients/:patientId/prescriptions"
          element={
            <ProtectedRoute allowedRole="DOCTOR">
              <DoctorPatientPrescriptionList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctor/prescriptions/:prescriptionId"
          element={
            <ProtectedRoute allowedRole="DOCTOR">
              <PrescriptionDetail />
            </ProtectedRoute>
          }
        />

        <Route path="/doctor/patients/:patientId/prescriptions/new" element={
          <ProtectedRoute allowedRole="DOCTOR">
            <AddRx />
          </ProtectedRoute>
        } />
        <Route path="/doctor/prescriptions/new/:patientId" element={
          <AddRx />} />

        <Route path="/doctor/prescriptions/edit/:prescriptionId/:patientId" element={
          <ProtectedRoute allowedRole="DOCTOR">
            <AddRx />
          </ProtectedRoute>
        } />

        <Route path="/doctor/prescriptions/edit/:prescriptionId/:patientId" element={
          <ProtectedRoute allowedRole="DOCTOR">
            <AddRx />
          </ProtectedRoute>
        } />

        <Route path="/doctor/medicines" element={
          <ProtectedRoute allowedRole="DOCTOR">
            <MedicineList />
          </ProtectedRoute>
        } />
        <Route path="/doctor/addMedicine" element={
          <ProtectedRoute allowedRole="DOCTOR">
            <AddMedicine />
          </ProtectedRoute>} />
        <Route path="/doctor/tests" element={
          <ProtectedRoute allowedRole="DOCTOR">
            <MedicalTestPatientList />
          </ProtectedRoute>
        } />






        {/* Patient Routes */}
        <Route path="/patient/dashboard" element={
          <ProtectedRoute allowedRole="PATIENT">
            <PatientDashboard />
          </ProtectedRoute>
        } />

        <Route path="/patient/doctors" element={
          <ProtectedRoute allowedRole="PATIENT">
            <DoctorList />
          </ProtectedRoute>
        } />
        <Route path="/patient/prescriptions" element={
          <ProtectedRoute allowedRole="PATIENT">
          </ProtectedRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}