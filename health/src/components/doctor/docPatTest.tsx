import React, { useEffect, useState } from 'react';
import { Card, Input } from '../UI';
import { patientApi } from '../../services/api';
import { Patient } from '../../types';
import { Search, Phone, User } from 'lucide-react';
import { useNavigate } from "react-router-dom";

export const PatTestList: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const fetchPatients = async () => {
    try {
      // Get current doctor ID from localStorage or auth context
      const doctorId = localStorage.getItem('doctorId');

      console.log('Doctor ID from storage:', doctorId);

      if (!doctorId) {
        console.error('Doctor ID not found in localStorage');
        setIsLoading(false);
        return;
      }

      // Fetch only patients added by this doctor
      const response = await patientApi.getPatientsByDoctor(doctorId);
      console.log('API Response:', response);
      console.log('Response Data:', response.data);

      // Handle both direct array and wrapped response
      const patientData = Array.isArray(response.data) ? response.data : response.data?.data || [];
      setPatients(patientData);
    } catch (err) {
      console.error('Failed to fetch patients:', err);
      console.error('Error details:', (err as any).response?.data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const filteredPatients = patients.filter(p =>
    p.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.emailAddress?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.phone?.includes(searchTerm)
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Patients Management</h1>
          <p className="text-slate-500">View and manage all registered patients</p>
        </div>
      </div>

      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <Input
            className="pl-10"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </Card>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        </div>
      ) : filteredPatients.length === 0 ? (
        <Card className="p-12 text-center">
          <User size={32} className="mx-auto text-slate-400 mb-2" />
          <p className="text-slate-500">No patients found</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPatients.map((patient) => (
            <Card key={patient.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-900">
                    {patient.fullName}
                  </h3>
                  <span className="inline-block px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs font-semibold mt-2">
                    {patient.gender}
                  </span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => navigate(`/doctor/patients/${patient.patientId}/prescriptions`)}
                    className="px-2 py-1 text-xs bg-emerald-100 text-emerald-700 rounded"
                  >
                    View Rx
                  </button>

                  <button
                    onClick={() => navigate(`/doctor/patients/${patient.patientId}/prescriptions/new`)}
                    className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded"
                  >
                    Add Rx
                  </button>
                </div>
              </div>

              <div className="space-y-3 text-sm text-slate-600 border-t border-slate-100 pt-4">
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-slate-400" />
                  <span>{patient.phone}</span>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">Email</p>
                  <p className="truncate">{patient.emailAddress}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <div>
                    <p className="text-xs text-slate-400">Blood Group</p>
                    <p className="font-semibold">{patient.bloodGroup}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Age</p>
                    <p className="font-semibold">
                      {patient.dateOfBirth
                        ? new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()
                        : "-"}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};