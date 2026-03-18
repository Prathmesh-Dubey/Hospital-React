import React, { useEffect, useState } from 'react';
import { Card, Button, Input } from '../UI';
import { clinicApi } from '../../services/api';
import { Clinic } from '../../types';
import { Plus, Search, MapPin, Building2, Trash2, Edit2, Users } from 'lucide-react';
import { useNavigate } from "react-router-dom";

export const ClinicList: React.FC = () => {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const fetchClinics = async () => {
    try {
      const response = await clinicApi.getAll();
      console.log("Fetched clinics:", response.data);
      setClinics(response.data);
    } catch (error) {
      console.error("Failed to fetch clinics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClinics();
  }, []);

  const handleEditClinic = (clinicId: string) => {
    console.log("Editing clinic:", clinicId);

    navigate(`/clinics/edit/${clinicId}`);
  };
  // DELETE USING clinicId
  const handleDeleteClinic = async (clinicId: string) => {
    console.log("Deleting clinic:", clinicId);

    const confirmDelete = window.confirm(
      `Delete clinic ${clinicId}?`
    );

    if (!confirmDelete) return;

    try {
      const response = await clinicApi.delete(clinicId);

      console.log("Delete response:", response);

      // remove clinic from UI
      setClinics((prev) =>
        prev.filter((clinic) => clinic.clinicId !== clinicId)
      );

      alert("Clinic deleted successfully");

    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete clinic");
    }
  };

  const filteredClinics = clinics.filter(
    (clinic) =>
      clinic.clinicName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clinic.address.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Clinics Management
          </h1>
          <p className="text-slate-500">
            View and manage all registered clinics
          </p>
        </div>

        <Button
          onClick={() => navigate("/clinics/new")}
          className="flex items-center"
        >
          <Plus size={18} className="mr-2" />
          Add New Clinic
        </Button>
      </div>

      <Card className="p-4">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <Input
            className="pl-10"
            placeholder="Search by name or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </Card>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        </div>
      ) : (

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {filteredClinics.map((clinic) => (

            <Card
              key={clinic.clinicId}
              className="p-6 hover:shadow-md transition-shadow"
            >

              <div className="flex justify-between items-start mb-4">

                <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                  <Building2 className="text-purple-600" size={24} />
                </div>

                <div className="flex space-x-2">

                  <button
                    onClick={() => handleEditClinic(clinic.clinicId)}
                    className="p-2 text-slate-400 hover:text-emerald-600 transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>

                  <button
                    onClick={() => handleDeleteClinic(clinic.clinicId)}
                    className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>

                </div>
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-1">
                {clinic.clinicName}
              </h3>

              <p className="text-sm text-slate-500 mb-4">
                {clinic.clinicType}
              </p>

              <div className="space-y-2 mb-6">

                <div className="flex items-center text-sm text-slate-600">
                  <MapPin size={14} className="mr-2 text-slate-400" />
                  {clinic.address.city}, {clinic.address.state}
                </div>

                <div className="flex items-center text-sm text-slate-600">
                  <Users size={14} className="mr-2 text-slate-400" />
                  {clinic.departments.length} Departments
                </div>

              </div>

              <div className="flex flex-wrap gap-2">

                {clinic.services.slice(0, 3).map((service, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-medium rounded-lg"
                  >
                    {service}
                  </span>
                ))}

                {clinic.services.length > 3 && (
                  <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-medium rounded-lg">
                    +{clinic.services.length - 3} more
                  </span>
                )}

              </div>

            </Card>

          ))}

        </div>

      )}
    </div>
  );
};