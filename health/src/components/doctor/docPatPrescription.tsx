import React, { useEffect, useState } from "react";
import { Card, Button, Input } from "../UI";
import { prescriptionApi } from "../../services/api";
import { Prescription } from "../../types";
import {
  Plus,
  Search,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  Pill,
  Stethoscope
} from "lucide-react";

export const DoctorPrescriptionList: React.FC = () => {

  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const doctorId = localStorage.getItem("doctorId");

  useEffect(() => {

    const fetchPrescriptions = async () => {

      try {

        if (!doctorId) {
          console.error("Doctor not logged in");
          return;
        }

        const response = await prescriptionApi.getByDoctor(doctorId);

        setPrescriptions(response.data);

      } catch (err) {

        console.error("Failed to fetch prescriptions", err);

      } finally {

        setIsLoading(false);

      }

    };

    fetchPrescriptions();

  }, [doctorId]);


  const getStatusIcon = (status: string) => {
    switch (status?.toUpperCase()) {
      case "ACTIVE":
        return <CheckCircle className="text-emerald-600" size={18} />;
      case "PENDING":
        return <Clock className="text-yellow-600" size={18} />;
      case "COMPLETED":
        return <CheckCircle className="text-blue-600" size={18} />;
      default:
        return <AlertCircle className="text-slate-600" size={18} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case "ACTIVE":
        return "bg-emerald-50 text-emerald-700";
      case "PENDING":
        return "bg-yellow-50 text-yellow-700";
      case "COMPLETED":
        return "bg-blue-50 text-blue-700";
      default:
        return "bg-slate-50 text-slate-700";
    }
  };

  const formatDate = (date: string | Date | undefined) => {

    if (!date) return "N/A";

    try {
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
      });
    } catch {
      return "N/A";
    }

  };


  const filteredPrescriptions = prescriptions.filter(p =>
    p.prescriptionId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.diagnosis?.icdCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.patient?.patientId?.toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (

    <div className="space-y-8">

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Prescriptions
          </h1>
          <p className="text-slate-500">
            Manage all patient prescriptions
          </p>
        </div>

        <Button className="flex items-center">
          <Plus size={18} className="mr-2" />
          Create Prescription
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
            placeholder="Search by prescription ID, ICD code, or patient ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

        </div>

      </Card>


      {isLoading ? (

        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        </div>

      ) : filteredPrescriptions.length === 0 ? (

        <Card className="p-12 text-center">
          <FileText size={32} className="mx-auto text-slate-400 mb-2" />
          <p className="text-slate-500">No prescriptions found</p>
        </Card>

      ) : (

        <div className="space-y-6">

          {filteredPrescriptions.map((prescription) => (

            <Card
              key={prescription.id}
              className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
            >

              <div className="flex justify-between items-center pb-4 border-b border-slate-200">

                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Prescription #{prescription.prescriptionId}
                  </h3>

                  <p className="text-sm text-slate-500">
                    Patient: {prescription.patient?.patientId} | Created:{" "}
                    {formatDate(prescription.createdDate)}
                  </p>

                </div>

                <div className="flex items-center gap-2">

                  {getStatusIcon(prescription.recordStatus)}

                  <span
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusColor(
                      prescription.recordStatus
                    )}`}
                  >
                    {prescription.recordStatus}
                  </span>

                </div>

              </div>


              <div className="mt-4 pt-4">

                <h4 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
                  <Stethoscope size={16} />
                  Diagnosis
                </h4>

                <p className="text-sm text-slate-700">
                  {prescription.diagnosis?.confirmedDiagnosis || "N/A"}
                </p>

              </div>


              {prescription.medications?.length > 0 && (

                <div className="mt-4 pt-4 border-t border-slate-200">

                  <h4 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
                    <Pill size={16} />
                    Medications
                  </h4>

                  {prescription.medications.map((m, i) => (

                    <p key={i} className="text-sm text-slate-700">
                      • {m.medicineName}
                    </p>

                  ))}

                </div>

              )}

            </Card>

          ))}

        </div>

      )}

    </div>

  );

};