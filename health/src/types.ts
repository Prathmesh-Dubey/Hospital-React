export interface Admin {
  id?: string;
  username: string;
  email: string;
  phone: string;
  role: 'ADMIN' | 'SUPER_ADMIN';
  status: 'ACTIVE' | 'INACTIVE';
  password?: string;
}

export interface Clinic {
  id?: string;
  clinicId?: string;
  clinicName: string;
  clinicType: string;
  status: string;
  appointmentRequired: boolean;
  address: {
    city: string;
    state: string;
  };
  departments: string[];
  services: string[];
}

export interface Doctor {
  id?: string;
  doctorId?: string;
  name: string;
  specialization: string;
  experience: number;
  qualification: string[];
  gender: string;
  phone: string;
  email: string;
  password?: string;
  consultationFee: number;
  availability: string;
  hospitalName: string;
  rating: number;
  address: string;
}

export interface Patient {
  id?: string;
  patientId?: string;
  fullName: string;
  password?: string;
  dateOfBirth: string;
  gender: string;
  phone: string;
  emailAddress: string;
  residentialAddress: string;
  emergencyContact?: {
    name: string;
    relation: string;
    phone: string;
  };
  bloodGroup: string;
  allergies: string[];
  chronicDiseases: string[];
  currentMedications: string[];
  height: number;
  weight: number;
}

export interface Medicine {
  id?: string;
  doctorId: string;
  patientId: string;
  medicineName: string;
  companyName: string;
  recordStatus: string;
  doctorChangeAllowed: boolean;
  dosage: string;
  route: string;
  frequency: string;
  duration: string;
  expiryDate: string;
  price: number;
  startDate: string;
  endDate: string;
  specialInstructions: string;
}

export interface MedicalTest {
  id?: string;
  testId?: string;
  patientId: string;
  doctorId: string;
  testName: string;
  category: string;
  price: number;
  description: string;
  resultStatus: string;
  history: string[];
}

export interface Prescription {
  id?: string;
  prescriptionId?: string;
  patient: {
    patientId: string;
  };
  currentDoctor?: {
    doctorId: string;
  };
  recordStatus: string;
  doctorChangeAllowed: boolean;
  diagnosis: {
    severity: string;
    icdCode: string;
  };
  treatmentTimeline: {
    treatmentStatus: string;
    treatmentStartDate: string;
  };
  followUp: {
    followUpRequired: boolean;
  };
}

export type UserRole = 'ADMIN' | 'DOCTOR' | 'PATIENT';

export interface AuthState {
  user: any | null;
  role: UserRole | null;
  token: string | null;
}
