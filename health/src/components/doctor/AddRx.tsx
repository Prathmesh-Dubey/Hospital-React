import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { prescriptionApi } from "../../services/api";
import { Button, Input, Card } from "../UI"; // Adjust import path as needed
import { useLocation } from "react-router-dom";
import { useEffect } from "react";



export const AddRx = () => {
  const { patientId, prescriptionId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const editData = location.state?.prescription;
  const doctorId = localStorage.getItem("doctorId");


  const [medications, setMedications] = useState<any[]>([]);
  const [procedures, setProcedures] = useState<any[]>([]);
  const [investigations, setInvestigations] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditMode, setIsEditMode] = useState(!!editData);

  const [form, setForm] = useState<any>({
    provisionalDiagnosis: editData?.diagnosis?.provisionalDiagnosis || "",
    confirmedDiagnosis: editData?.diagnosis?.confirmedDiagnosis || "",
    icdCode: editData?.diagnosis?.icdCode || "",
    severity: editData?.diagnosis?.severity || "MILD",

    treatmentStartDate: editData?.treatmentTimeline?.treatmentStartDate || "",
    expectedCompletionDate: editData?.treatmentTimeline?.expectedCompletionDate || "",
    treatmentStatus: editData?.treatmentTimeline?.treatmentStatus || "ACTIVE",
    remarks: editData?.treatmentTimeline?.remarks || "",

    followUpRequired: editData?.followUp?.followUpRequired ?? true,
    followUpDate: editData?.followUp?.followUpDate || "",
    followUpNotes: editData?.followUp?.notes || ""


  });


  const addMedication = () => {
    const id = prompt("Medicine ID:");
    if (!id) return;
    const name = prompt("Medicine Name:");
    setMedications(prev => [...prev, { medicineId: id, medicineName: name }]);
  };

  const addProcedure = () => {
    const name = prompt("Procedure Name:");
    if (!name) return;
    setProcedures(prev => [...prev, { procedureName: name, sessions: 1 }]);
  };

  const addInvestigation = () => {
    const name = prompt("Test Name:");
    if (!name) return;
    setInvestigations(prev => [...prev, { testName: name }]);
  };

  const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    setIsSaving(true);

    try {
      if (!form.provisionalDiagnosis || !form.icdCode) {
        alert("Diagnosis and ICD Code are required");
        setIsSaving(false);
        return;
      }

      const payload = {
        recordStatus: "ACTIVE",
        doctorChangeAllowed: true,

        // ✅ IMPORTANT FOR UPDATE
        currentDoctor: {
          doctorId
        },

        patient: {
          patientId
        },

        diagnosis: {
          provisionalDiagnosis: form.provisionalDiagnosis,
          confirmedDiagnosis: form.confirmedDiagnosis,
          icdCode: form.icdCode,
          severity: form.severity
        },

        treatmentTimeline: {
          treatmentStartDate: form.treatmentStartDate,
          expectedCompletionDate: form.expectedCompletionDate,
          treatmentStatus: form.treatmentStatus,
          remarks: form.remarks
        },

        medications,
        procedures,
        investigations,

        followUp: {
          followUpRequired: form.followUpRequired,
          followUpDate: form.followUpDate,
          notes: form.followUpNotes
        }
      };

      console.log("Payload:", payload);

      // ✅ FIXED UPDATE LOGIC
      if (isEditMode && prescriptionId) {
        await prescriptionApi.update(prescriptionId, payload);
      } else {
        await prescriptionApi.createForDoctorAndPatient(
          doctorId!,
          patientId!,
          payload
        );
      }

      alert(
        isEditMode
          ? "Prescription Updated Successfully"
          : "Prescription Created Successfully"
      );

      navigate(`/doctor/patients/${patientId}/prescriptions`);

    } catch (err: any) {
      console.error("FULL ERROR:", err);
      console.error("RESPONSE:", err?.response?.data);

      alert(err?.response?.data?.message || "Failed to save prescription");
    } finally {
      setIsSaving(false);
    }
  };
  useEffect(() => {
    const loadData = async () => {

      // ✅ DO NOTHING IN CREATE MODE
      if (!isEditMode) return;

      let data = editData;

      // ✅ HANDLE REFRESH CASE
      if (!data && prescriptionId) {
        try {
          const res = await prescriptionApi.getById(prescriptionId);
          data = res.data;
        } catch {
          alert("Failed to load prescription");
          return;
        }
      }

      if (!data) return;

      // ✅ SET DATA
      setMedications(data.medications || []);
      setProcedures(data.procedures || []);
      setInvestigations(data.investigations || []);

      setForm({
        provisionalDiagnosis: data?.diagnosis?.provisionalDiagnosis || "",
        confirmedDiagnosis: data?.diagnosis?.confirmedDiagnosis || "",
        icdCode: data?.diagnosis?.icdCode || "",
        severity: data?.diagnosis?.severity || "MILD",

        treatmentStartDate: data?.treatmentTimeline?.treatmentStartDate || "",
        expectedCompletionDate: data?.treatmentTimeline?.expectedCompletionDate || "",
        treatmentStatus: data?.treatmentTimeline?.treatmentStatus || "ACTIVE",
        remarks: data?.treatmentTimeline?.remarks || "",

        followUpRequired: data?.followUp?.followUpRequired ?? true,
        followUpDate: data?.followUp?.followUpDate || "",
        followUpNotes: data?.followUp?.notes || ""
      });

    };

    loadData();
  }, [editData, prescriptionId, isEditMode]);

  // Reusable styling classes mapping to your UI system
  const selectClasses = "flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";
  const labelClasses = "block text-sm font-medium text-slate-700 mb-1.5";
  const sectionHeaderClasses = "text-xs font-bold text-emerald-600 uppercase tracking-wider border-b border-slate-100 pb-2 mb-4 mt-8 first:mt-0";

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">
            {isEditMode ? "Edit Prescription" : "Create Prescription"}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Fill out the diagnosis, treatment plan, and follow-up details.
          </p>
        </div>

        <Card className="p-6 md:p-8">

          {/* IDENTIFIERS */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8 bg-slate-100 p-4 rounded-xl border border-slate-200">
            <div className="flex-1">
              <span className="text-xs text-slate-500 uppercase font-semibold">Doctor ID</span>
              <p className="text-sm font-medium text-slate-900">{doctorId}</p>
            </div>
            <div className="flex-1">
              <span className="text-xs text-slate-500 uppercase font-semibold">Patient ID</span>
              <p className="text-sm font-medium text-slate-900">{patientId}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>

            {/* DIAGNOSIS */}
            <h2 className={sectionHeaderClasses}>Diagnosis Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
              <div>
                <label className={labelClasses}>Provisional Diagnosis</label>
                <Input
                  placeholder="e.g. Viral Fever"
                  value={form.provisionalDiagnosis}
                  onChange={e => setForm({ ...form, provisionalDiagnosis: e.target.value })}
                />
              </div>

              <div>
                <label className={labelClasses}>Confirmed Diagnosis</label>
                <Input
                  placeholder="e.g. Influenza A"
                  value={form.confirmedDiagnosis}
                  onChange={e => setForm({ ...form, confirmedDiagnosis: e.target.value })}
                />
              </div>

              <div>
                <label className={labelClasses}>ICD Code</label>
                <Input
                  placeholder="e.g. J10.1"
                  value={form.icdCode}
                  onChange={e => setForm({ ...form, icdCode: e.target.value })}
                />
              </div>

              <div>
                <label className={labelClasses}>Severity</label>
                <select
                  className={selectClasses}
                  value={form.severity}
                  onChange={e => setForm({ ...form, severity: e.target.value })}
                >
                  <option value="MILD">MILD</option>
                  <option value="MODERATE">MODERATE</option>
                  <option value="SEVERE">SEVERE</option>
                  <option value="CRITICAL">CRITICAL</option>
                </select>
              </div>
            </div>

            {/* TIMELINE */}
            <h2 className={sectionHeaderClasses}>Treatment Timeline</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
              <div>
                <label className={labelClasses}>Start Date</label>
                <Input
                  type="date"
                  value={form.treatmentStartDate?.split("T")[0] || ""}
                  onChange={e => setForm({ ...form, treatmentStartDate: e.target.value })}
                />
              </div>

              <div>
                <label className={labelClasses}>Expected Completion</label>
                <Input
                  type="date"
                  value={form.expectedCompletionDate?.split("T")[0] || ""}
                  onChange={e => setForm({ ...form, expectedCompletionDate: e.target.value })}
                />
              </div>

              <div>
                <label className={labelClasses}>Status</label>
                <select
                  className={selectClasses}
                  value={form.treatmentStatus}
                  onChange={e => setForm({ ...form, treatmentStatus: e.target.value })}
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="PENDING">PENDING</option>
                  <option value="COMPLETED">COMPLETED</option>
                </select>
              </div>

              <div>
                <label className={labelClasses}>Remarks</label>
                <Input
                  placeholder="Additional notes..."
                  value={form.remarks}
                  onChange={e => setForm({ ...form, remarks: e.target.value })}
                />
              </div>
            </div>

            {/* MEDICAL DIRECTIVES (Dynamic Lists) */}
            <h2 className={sectionHeaderClasses}>Medical Directives</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

              {/* MEDICATIONS */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-semibold text-slate-800">Medications</label>
                  <Button type="button" variant="outline" size="sm" onClick={addMedication}>
                    + Add
                  </Button>
                </div>
                <div className="space-y-2">
                  {medications.length === 0 && <p className="text-xs text-slate-400 italic">No medications added.</p>}
                  {medications.map((m, i) => (
                    <div key={i} className="text-sm bg-slate-50 border border-slate-100 px-3 py-2 rounded-lg text-slate-700">
                      {m.medicineName} <span className="text-xs text-slate-400 ml-1">({m.medicineId})</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* PROCEDURES */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-semibold text-slate-800">Procedures</label>
                  <Button type="button" variant="outline" size="sm" onClick={addProcedure}>
                    + Add
                  </Button>
                </div>
                <div className="space-y-2">
                  {procedures.length === 0 && <p className="text-xs text-slate-400 italic">No procedures added.</p>}
                  {procedures.map((p, i) => (
                    <div key={i} className="text-sm bg-slate-50 border border-slate-100 px-3 py-2 rounded-lg text-slate-700">
                      {p.procedureName}
                    </div>
                  ))}
                </div>
              </div>

              {/* INVESTIGATIONS */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-semibold text-slate-800">Investigations</label>
                  <Button type="button" variant="outline" size="sm" onClick={addInvestigation}>
                    + Add
                  </Button>
                </div>
                <div className="space-y-2">
                  {investigations.length === 0 && <p className="text-xs text-slate-400 italic">No tests added.</p>}
                  {investigations.map((i, idx) => (
                    <div key={idx} className="text-sm bg-slate-50 border border-slate-100 px-3 py-2 rounded-lg text-slate-700">
                      {i.testName}
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* FOLLOW UP */}
            <h2 className={sectionHeaderClasses}>Follow Up Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
              <div>
                <label className={labelClasses}>Follow-up Required?</label>
                <select
                  className={selectClasses}
                  value={form.followUpRequired.toString()}
                  onChange={e => setForm({ ...form, followUpRequired: e.target.value === "true" })}
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>

              <div>
                <label className={labelClasses}>Follow-up Date</label>
                <Input
                  type="date"
                  value={form.followUpDate?.split("T")[0] || ""}
                  disabled={!form.followUpRequired}
                  onChange={e => setForm({ ...form, followUpDate: e.target.value })}
                />
              </div>

              <div>
                <label className={labelClasses}>Notes</label>
                <Input
                  placeholder="Follow-up instructions"
                  value={form.followUpNotes}
                  disabled={!form.followUpRequired}
                  onChange={e => setForm({ ...form, followUpNotes: e.target.value })}
                />
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col-reverse sm:flex-row justify-end items-center gap-3 pt-6 border-t border-slate-200">
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate(-1)}
                className="w-full sm:w-auto"
                disabled={isSaving}
              >
                Cancel
              </Button>

              <Button type="submit" isLoading={isSaving}>
                {isEditMode ? "Update Prescription" : "Save Prescription"}
              </Button>
            </div>

          </form>
        </Card>
      </div>
    </div>
  );
};