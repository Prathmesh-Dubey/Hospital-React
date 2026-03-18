import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { clinicApi } from "../../services/api";
import { Button, Input, Card } from "../UI"; // Adjust import path as needed

export const ClinicForm = () => {
  const { clinicId } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(clinicId);

  const [clinic, setClinic] = useState<any>({
    clinicId: "",
    clinicName: "",
    clinicType: "CLINIC",
    registrationNumber: "",
    status: "ACTIVE",

    address: {
      city: "",
      pincode: "",
      state: "",
      country: ""
    },

    contact: {
      phone: "",
      email: ""
    },

    departments: [],
    services: [],

    doctors: [{
      doctorId: "",
      name: "",
      specialization: ""
    }],

    openingTime: "",
    closingTime: "",
    appointmentRequired: true
  });

  const [departmentsText, setDepartmentsText] = useState("");
  const [servicesText, setServicesText] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isEdit) loadClinic();
  }, []);

  const loadClinic = async () => {
    const res = await clinicApi.getById(clinicId!);
    const data = res.data;

    setClinic(data);
    setDepartmentsText(data.departments?.join(", "));
    setServicesText(data.services?.join(", "));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsSaving(true);

    const payload = {
      ...clinic,
      departments: departmentsText.split(",").map((d: string) => d.trim()),
      services: servicesText.split(",").map((s: string) => s.trim())
    };

    try {
      if (isEdit) {
        await clinicApi.update(clinicId!, payload);
        alert("Clinic Updated");
      } else {
        await clinicApi.create(payload);
        alert("Clinic Created");
      }
      navigate("/clinics");
    } catch (error) {
      console.error(error);
      alert("An error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  // Reusable select classes matching your Input component
  const selectClasses = "flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";
  // Reusable label classes
  const labelClasses = "block text-sm font-medium text-slate-700 mb-1.5";
  // Reusable section header classes
  const sectionHeaderClasses = "text-xs font-bold text-emerald-600 uppercase tracking-wider border-b border-slate-100 pb-2 mb-4 mt-8 first:mt-0";

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">
            {isEdit ? "Edit Clinic Profile" : "Register New Clinic"}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Fill in the details below to {isEdit ? "update" : "create"} the clinic record in the system.
          </p>
        </div>

        <Card className="p-6 md:p-8">
          <form onSubmit={handleSubmit}>
            
            {/* BASIC INFO */}
            <h2 className={sectionHeaderClasses}>Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-slate-50/50 p-4 rounded-xl border border-slate-100 mb-6">
              <div>
                <label className={labelClasses}>Clinic Name</label>
                <Input
                  value={clinic.clinicName}
                  onChange={e => setClinic({ ...clinic, clinicName: e.target.value })}
                  placeholder="Enter clinic name"
                />
              </div>

              <div>
                <label className={labelClasses}>Clinic Type</label>
                <select
                  className={selectClasses}
                  value={clinic.clinicType}
                  onChange={e => setClinic({ ...clinic, clinicType: e.target.value })}
                >
                  <option value="CLINIC">CLINIC</option>
                  <option value="OPD">OPD</option>
                  <option value="HOSPITAL">HOSPITAL</option>
                </select>
              </div>

              <div>
                <label className={labelClasses}>Registration Number</label>
                <Input
                  value={clinic.registrationNumber}
                  onChange={e => setClinic({ ...clinic, registrationNumber: e.target.value })}
                  placeholder="e.g. REG-123456"
                />
              </div>

              <div>
                <label className={labelClasses}>Status</label>
                <select
                  className={selectClasses}
                  value={clinic.status}
                  onChange={e => setClinic({ ...clinic, status: e.target.value })}
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="CLOSED">CLOSED</option>
                </select>
              </div>
            </div>

            {/* ADDRESS */}
            <h2 className={sectionHeaderClasses}>Address Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
              <div>
                <label className={labelClasses}>City</label>
                <Input
                  value={clinic.address.city}
                  onChange={e => setClinic({ ...clinic, address: { ...clinic.address, city: e.target.value } })}
                  placeholder="City"
                />
              </div>

              <div>
                <label className={labelClasses}>State</label>
                <Input
                  value={clinic.address.state}
                  onChange={e => setClinic({ ...clinic, address: { ...clinic.address, state: e.target.value } })}
                  placeholder="State"
                />
              </div>

              <div>
                <label className={labelClasses}>Pincode</label>
                <Input
                  value={clinic.address.pincode}
                  onChange={e => setClinic({ ...clinic, address: { ...clinic.address, pincode: e.target.value } })}
                  placeholder="Pincode / Zip"
                />
              </div>

              <div>
                <label className={labelClasses}>Country</label>
                <Input
                  value={clinic.address.country}
                  onChange={e => setClinic({ ...clinic, address: { ...clinic.address, country: e.target.value } })}
                  placeholder="Country"
                />
              </div>
            </div>

            {/* CONTACT & TAGS */}
            <h2 className={sectionHeaderClasses}>Contact & Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
              <div>
                <label className={labelClasses}>Phone Number</label>
                <Input
                  type="tel"
                  value={clinic.contact.phone}
                  onChange={e => setClinic({ ...clinic, contact: { ...clinic.contact, phone: e.target.value } })}
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <div>
                <label className={labelClasses}>Email Address</label>
                <Input
                  type="email"
                  value={clinic.contact.email}
                  onChange={e => setClinic({ ...clinic, contact: { ...clinic.contact, email: e.target.value } })}
                  placeholder="clinic@example.com"
                />
              </div>

              <div>
                <label className={labelClasses}>Departments</label>
                <Input
                  value={departmentsText}
                  onChange={e => setDepartmentsText(e.target.value)}
                  placeholder="General, Dental, Pediatrics"
                />
                <p className="text-xs text-slate-500 mt-1.5">Separate multiple with commas</p>
              </div>

              <div>
                <label className={labelClasses}>Services</label>
                <Input
                  value={servicesText}
                  onChange={e => setServicesText(e.target.value)}
                  placeholder="OPD, X-Ray, Blood Test"
                />
                <p className="text-xs text-slate-500 mt-1.5">Separate multiple with commas</p>
              </div>
            </div>

            {/* DOCTOR */}
            <h2 className={sectionHeaderClasses}>Primary Doctor Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 bg-slate-50/50 p-4 rounded-xl border border-slate-100 mb-6">
              <div>
                <label className={labelClasses}>Doctor ID</label>
                <Input
                  value={clinic.doctors[0]?.doctorId}
                  onChange={e => setClinic({ ...clinic, doctors: [{ ...clinic.doctors[0], doctorId: e.target.value }] })}
                  placeholder="DOC-001"
                />
              </div>

              <div>
                <label className={labelClasses}>Doctor Name</label>
                <Input
                  value={clinic.doctors[0]?.name}
                  onChange={e => setClinic({ ...clinic, doctors: [{ ...clinic.doctors[0], name: e.target.value }] })}
                  placeholder="Dr. John Doe"
                />
              </div>

              <div>
                <label className={labelClasses}>Specialization</label>
                <Input
                  value={clinic.doctors[0]?.specialization}
                  onChange={e => setClinic({ ...clinic, doctors: [{ ...clinic.doctors[0], specialization: e.target.value }] })}
                  placeholder="General Physician"
                />
              </div>
            </div>

            {/* TIMINGS */}
            <h2 className={sectionHeaderClasses}>Operating Hours & Rules</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
              <div>
                <label className={labelClasses}>Opening Time</label>
                <Input
                  type="time"
                  value={clinic.openingTime}
                  onChange={e => setClinic({ ...clinic, openingTime: e.target.value })}
                />
              </div>

              <div>
                <label className={labelClasses}>Closing Time</label>
                <Input
                  type="time"
                  value={clinic.closingTime}
                  onChange={e => setClinic({ ...clinic, closingTime: e.target.value })}
                />
              </div>

              <div>
                <label className={labelClasses}>Appointment Policy</label>
                <select
                  className={selectClasses}
                  value={clinic.appointmentRequired.toString()}
                  onChange={e => setClinic({ ...clinic, appointmentRequired: e.target.value === "true" })}
                >
                  <option value="true">Appointment Required</option>
                  <option value="false">Walk-in Allowed</option>
                </select>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col-reverse sm:flex-row justify-end items-center gap-3 pt-6 border-t border-slate-200">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => navigate("/clinics")}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              
              <Button 
                type="reset" 
                variant="outline"
                className="w-full sm:w-auto"
              >
                Clear Form
              </Button>

              <Button 
                type="submit" 
                variant="primary"
                isLoading={isSaving}
                className="w-full sm:w-auto"
              >
                {isEdit ? "Save Changes" : "Create Clinic"}
              </Button>
            </div>

          </form>
        </Card>
      </div>
    </div>
  );
};