import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { patientApi } from "../../services/api";
import { Card, Input, Button } from "../UI";

export const PatientForm = () => {

    const { patientId } = useParams();
    const navigate = useNavigate();
    const role = localStorage.getItem("role");
    const doctorId = localStorage.getItem("doctorId");
    const isEdit = Boolean(patientId);

    const [patient, setPatient] = useState<any>({
        fullName: "",
        dateOfBirth: "",
        gender: "",
        bloodGroup: "",
        phone: "",
        emailAddress: "",
        residentialAddress: "",
        emergencyContact: "",
        height: "",
        weight: "",
        allergies: "",
        chronicDiseases: "",
        currentMedications: "",
        password: ""
    });

    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isEdit) fetchPatient();
    }, [patientId]);

    const fetchPatient = async () => {
        try {

            const res = await patientApi.getById(patientId!);

            setPatient({
                ...res.data,

                phone: res.data.phone || "",
                emailAddress: res.data.emailAddress || "",

                allergies: res.data.allergies?.join(", ") || "",
                chronicDiseases: res.data.chronicDiseases?.join(", ") || "",
                currentMedications: res.data.currentMedications?.join(", ") || ""
            });

        } catch (err) {
            console.error("Failed to load patient", err);
        }
    };

    const handleSubmit = async (e: any) => {

        e.preventDefault();
        setIsSaving(true);

        try {

            const payload: any = {
                ...patient,
                height: patient.height ? Number(patient.height) : null,
                weight: patient.weight ? Number(patient.weight) : null,
                allergies: patient.allergies
                    ? patient.allergies.split(",").map((a: string) => a.trim())
                    : [],
                chronicDiseases: patient.chronicDiseases
                    ? patient.chronicDiseases.split(",").map((d: string) => d.trim())
                    : [],
                currentMedications: patient.currentMedications
                    ? patient.currentMedications.split(",").map((m: string) => m.trim())
                    : []
            };

            if (isEdit) {

                delete payload.password;
                await patientApi.update(patientId!, payload);
                alert("Patient updated");

            } else {
                // Check if current user is a doctor
                const role = localStorage.getItem('role');
                const doctorId = localStorage.getItem('doctorId');

                if (role === "DOCTOR" && doctorId) {
                    await patientApi.createForDoctor(doctorId, payload);
                } else {
                    await patientApi.create(payload);
                }
                alert("Patient created");

            }

            // Redirect based on user role
            const role = localStorage.getItem('role');
            if (role === 'DOCTOR') {
                navigate("/doctor/patients");
            } else {
                navigate("/admin/patients");
            }

        } catch (error) {
            console.error(error);
            alert("Error saving patient");
        } finally {
            setIsSaving(false);
        }

    };

    const label = "block text-sm font-medium text-slate-700 mb-1";

    return (
        <div className="max-w-4xl mx-auto py-8">

            <h1 className="text-2xl font-bold mb-6">
                {isEdit ? "Edit Patient" : "Register New Patient"}
            </h1>

            <Card className="p-6">

                <form onSubmit={handleSubmit} className="space-y-6">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <div>
                            <label className={label}>Full Name</label>
                            <Input
                                value={patient.fullName}
                                onChange={e => setPatient({ ...patient, fullName: e.target.value })}
                                required
                            />
                        </div>

                        <div>
                            <label className={label}>Date of Birth</label>
                            <Input
                                type="date"
                                value={patient.dateOfBirth}
                                onChange={e => setPatient({ ...patient, dateOfBirth: e.target.value })}
                                required
                            />
                        </div>

                        <div>
                            <label className={label}>Gender</label>
                            <select
                                className="w-full border rounded-lg px-3 py-2"
                                value={patient.gender}
                                onChange={e => setPatient({ ...patient, gender: e.target.value })}
                                required
                            >
                                <option value="">Select Gender</option>
                                <option value="MALE">Male</option>
                                <option value="FEMALE">Female</option>
                                <option value="OTHER">Other</option>
                            </select>
                        </div>

                        <div>
                            <label className={label}>Blood Group</label>
                            <select
                                className="w-full border rounded-lg px-3 py-2"
                                value={patient.bloodGroup}
                                onChange={e => setPatient({ ...patient, bloodGroup: e.target.value })}
                                required
                            >
                                <option value="">Select Blood Group</option>
                                <option>O+</option>
                                <option>O-</option>
                                <option>A+</option>
                                <option>A-</option>
                                <option>B+</option>
                                <option>B-</option>
                                <option>AB+</option>
                                <option>AB-</option>
                            </select>
                        </div>

                        <div>
                            <label className={label}>Phone</label>
                            <Input
                                value={patient.phone}
                                onChange={e => setPatient({ ...patient, phone: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className={label}>Email</label>
                            <Input
                                type="email"
                                value={patient.emailAddress}
                                onChange={e => setPatient({ ...patient, emailAddress: e.target.value })}
                                required
                            />
                        </div>

                    </div>

                    <div>
                        <label className={label}>Residential Address</label>
                        <Input
                            value={patient.residentialAddress}
                            onChange={e => setPatient({ ...patient, residentialAddress: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <label className={label}>Emergency Contact</label>
                        <Input
                            value={patient.emergencyContact}
                            onChange={e => setPatient({ ...patient, emergencyContact: e.target.value })}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">

                        <div>
                            <label className={label}>Height (cm)</label>
                            <Input
                                type="number"
                                value={patient.height}
                                onChange={e => setPatient({ ...patient, height: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className={label}>Weight (kg)</label>
                            <Input
                                type="number"
                                value={patient.weight}
                                onChange={e => setPatient({ ...patient, weight: e.target.value })}
                            />
                        </div>

                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <div>
                            <label className={label}>Allergies</label>
                            <Input
                                value={patient.allergies}
                                onChange={e => setPatient({ ...patient, allergies: e.target.value })}
                                placeholder="comma separated"
                            />
                        </div>

                        <div>
                            <label className={label}>Chronic Diseases</label>
                            <Input
                                value={patient.chronicDiseases}
                                onChange={e => setPatient({ ...patient, chronicDiseases: e.target.value })}
                                placeholder="comma separated"
                            />
                        </div>

                    </div>

                    <div>
                        <label className={label}>Current Medications</label>
                        <Input
                            value={patient.currentMedications}
                            onChange={e => setPatient({ ...patient, currentMedications: e.target.value })}
                            placeholder="comma separated"
                        />
                    </div>

                    {!isEdit && (
                        <div>
                            <label className={label}>Password</label>
                            <Input
                                type="password"
                                value={patient.password}
                                onChange={e => setPatient({ ...patient, password: e.target.value })}
                                required
                            />
                        </div>
                    )}

                    <div className="flex justify-end pt-4 border-t">

                        <Button
                            type="submit"
                            variant="primary"
                            isLoading={isSaving}
                        >
                            {isEdit ? "Save Changes" : "Create Patient"}
                        </Button>

                    </div>

                </form>

            </Card>

        </div>
    );
};