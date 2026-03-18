import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { prescriptionApi, doctorApi, patientApi } from "../../services/api";
import { Card, Button } from "../UI";

export const PrescriptionDetail = () => {
    const { prescriptionId } = useParams();
    const navigate = useNavigate();

    const [data, setData] = useState<any>(null);
    const [doctor, setDoctor] = useState<any>(null);
    const [patient, setPatient] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [prescriptionId]);

    const fetchData = async () => {
        try {
            const res = await prescriptionApi.getById(prescriptionId!);
            const p = res.data;

            setData(p);

            const doctorId = p.currentDoctor?.doctorId;
            const patientId = p.patient?.patientId;

            let doctorData = null;
            let patientData = null;

            console.log("Prescription:", p);
            console.log("Doctor ID:", doctorId);
            console.log("Patient ID:", patientId);

            // ✅ DOCTOR (Mongo _id)
            if (doctorId) {
                try {
                    const docRes = await doctorApi.getById(doctorId);
                    doctorData = docRes.data;
                } catch (e) {
                    console.error("Doctor fetch failed", e);
                }
            }

            // ✅ PATIENT (business ID)
            if (patientId) {
                try {
                    const patRes = await patientApi.getByPatientId(patientId);
                    patientData = patRes.data;
                } catch (e) {
                    console.error("Patient fetch failed", e);
                }
            }

            setDoctor(doctorData);
            setPatient(patientData);

        } catch (err) {
            console.error("Prescription fetch failed", err);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (d: any) =>
        d ? new Date(d).toLocaleDateString() : "-";

    if (loading) {
        return <div className="text-center py-10">Loading...</div>;
    }

    if (!data) {
        return <div className="text-center text-red-500">Prescription not found</div>;
    }

    return (
        <div className="max-w-5xl mx-auto py-8 space-y-6">

            {/* ACTIONS */}
            <div className="flex justify-end gap-3">
                <Button onClick={() => window.print()}>Print</Button>
                <Button variant="secondary" onClick={() => navigate(-1)}>
                    Back
                </Button>
            </div>

            <Card className="p-8 border-t-8 border-emerald-500">

                {/* HEADER */}
                <div className="flex justify-between border-b pb-4">
                    <div>
                        <h2 className="text-xl font-bold">
                            Dr. {doctor?.name || "-"}
                        </h2>
                        <p className="text-slate-500">
                            {doctor?.specialization || "Physician"}
                        </p>
                    </div>

                    <div className="text-right text-sm">
                        <p>{doctor?.phone}</p>
                        <p>{doctor?.email}</p>
                    </div>
                </div>

                {/* PATIENT */}
                <div className="bg-emerald-50 p-4 rounded mt-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-slate-400">Patient</p>
                            <p className="font-bold">{patient?.fullName}</p>
                        </div>
                        <div>
                            <p className="text-slate-400">Blood</p>
                            <p>{patient?.bloodGroup}</p>
                        </div>
                        <div>
                            <p className="text-slate-400">Phone</p>
                            <p>{patient?.phone}</p>
                        </div>
                        <div>
                            <p className="text-slate-400">Email</p>
                            <p>{patient?.emailAddress}</p>
                        </div>
                    </div>
                </div>

                {/* BASIC INFO */}
                <div className="mt-6">
                    <h3 className="font-semibold text-emerald-600">Basic Info</h3>
                    <p>ID: {data.prescriptionId}</p>
                    <p>Date: {formatDate(data.createdDate)}</p>
                    <p>Status: {data.recordStatus}</p>
                </div>

                {/* DIAGNOSIS */}
                <div className="mt-6">
                    <h3 className="font-semibold text-emerald-600">Diagnosis</h3>
                    <p>{data.diagnosis?.provisionalDiagnosis}</p>
                    <p>{data.diagnosis?.confirmedDiagnosis}</p>
                    <p>ICD: {data.diagnosis?.icdCode}</p>
                </div>

                {/* MEDICATIONS */}
                <div className="mt-6">
                    <h3 className="font-semibold text-emerald-600">Medications</h3>
                    {data.medications?.length ? (
                        data.medications.map((m: any, i: number) => (
                            <p key={i}>
                                {m.medicineName} ({m.medicineId})
                            </p>
                        ))
                    ) : (
                        <p>No medications</p>
                    )}
                </div>

                {/* PROCEDURES */}
                <div className="mt-6">
                    <h3 className="font-semibold text-emerald-600">Procedures</h3>
                    {data.procedures?.map((p: any, i: number) => (
                        <p key={i}>
                            {p.procedureName} - {p.sessions}
                        </p>
                    ))}
                </div>

                {/* FOLLOW UP */}
                <div className="mt-6">
                    <h3 className="font-semibold text-emerald-600">Follow Up</h3>
                    <p>
                        {data.followUp?.followUpRequired
                            ? "Yes"
                            : "No"}
                    </p>
                </div>
            </Card>
        </div>
    );
};