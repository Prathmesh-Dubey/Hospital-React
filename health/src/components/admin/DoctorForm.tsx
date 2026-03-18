import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doctorApi } from "../../services/api";
import { Button, Input, Card } from "../UI"; // Adjust import path as needed

export const DoctorForm = () => {
    const { doctorId } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(doctorId);

    const [doctor, setDoctor] = useState<any>({
        name: "",
        specialization: "",
        experience: 0,
        gender: "",
        qualification: "",
        phone: "",
        email: "",
        consultationFee: 0,
        availability: "",
        hospitalName: "",
        address: "",
        password: ""
    });

    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isEdit) {
            fetchDoctor();
        }
    }, []);

    const fetchDoctor = async () => {
        try {
            const res = await doctorApi.getById(doctorId!);
            setDoctor({ ...res.data, qualification: res.data.qualification?.join(", ") || "" });
        } catch (error) {
            console.error("Failed to fetch doctor details", error);
        }
    };

    const handleSubmit = async (e: any) => {

        e.preventDefault();
        setIsSaving(true);

        try {

            const payload: any = {
                ...doctor,
                experience: Number(doctor.experience),
                consultationFee: Number(doctor.consultationFee),
                qualification: doctor.qualification
                    ? doctor.qualification.split(",").map((q: string) => q.trim())
                    : []
            };

            // remove password when editing
            if (isEdit) {
                delete payload.password;
                await doctorApi.update(doctorId!, payload);
                alert("Doctor Updated");
            } else {
                await doctorApi.create(payload);
                alert("Doctor Created");
            }

            navigate("/doctors");

        } catch (error) {
            console.error(error);
            alert("Error saving doctor");
        } finally {
            setIsSaving(false);
        }
    };

    // Reusable styling classes mapping to your UI system
    const selectClasses = "flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";
    const labelClasses = "block text-sm font-medium text-slate-700 mb-1.5";
    const sectionHeaderClasses = "text-xs font-bold text-emerald-600 uppercase tracking-wider border-b border-slate-100 pb-2 mb-4 mt-8 first:mt-0";

    return (
        <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">

                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-slate-900">
                        {isEdit ? "Edit Doctor Profile" : "Register New Doctor"}
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Fill in the details below to {isEdit ? "update" : "create"} the doctor's record in the system.
                    </p>
                </div>

                <Card className="p-6 md:p-8">
                    <form onSubmit={handleSubmit}>

                        {/* PERSONAL INFORMATION */}
                        <h2 className={sectionHeaderClasses}>Personal Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                            <div>
                                <label className={labelClasses}>Full Name</label>
                                <Input
                                    value={doctor.name}
                                    onChange={e => setDoctor({ ...doctor, name: e.target.value })}
                                    placeholder="e.g. Dr. Jane Smith"
                                    required
                                />
                            </div>

                            <div>
                                <label className={labelClasses}>Gender</label>
                                <select
                                    className={selectClasses}
                                    value={doctor.gender}
                                    onChange={e => setDoctor({ ...doctor, gender: e.target.value })}
                                    required
                                >
                                    <option value="" disabled>Select Gender</option>
                                    <option value="MALE">Male</option>
                                    <option value="FEMALE">Female</option>
                                    <option value="OTHER">Other</option>
                                </select>
                            </div>
                        </div>

                        {/* PROFESSIONAL DETAILS */}
                        <h2 className={sectionHeaderClasses}>Professional Details</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
                            <div>
                                <label className={labelClasses}>Specialization</label>
                                <Input
                                    value={doctor.specialization}
                                    onChange={e => setDoctor({ ...doctor, specialization: e.target.value })}
                                    placeholder="e.g. Cardiologist"
                                    required
                                />
                            </div>

                            <div>
                                <label className={labelClasses}>Qualification</label>
                                <Input
                                    value={doctor.qualification}
                                    onChange={e => setDoctor({ ...doctor, qualification: e.target.value })}
                                    placeholder="e.g. MBBS, MD"
                                    required
                                />
                            </div>

                            <div>
                                <label className={labelClasses}>Experience (Years)</label>
                                <Input
                                    type="number"
                                    min="0"
                                    value={doctor.experience}
                                    onChange={e => setDoctor({ ...doctor, experience: Number(e.target.value) })}
                                    placeholder="0"
                                    required
                                />
                            </div>

                            <div>
                                <label className={labelClasses}>Consultation Fee ($)</label>
                                <Input
                                    type="number"
                                    min="0"
                                    value={doctor.consultationFee}
                                    onChange={e => setDoctor({ ...doctor, consultationFee: Number(e.target.value) })}
                                    placeholder="e.g. 150"
                                    required
                                />
                            </div>
                        </div>

                        {/* CONTACT & LOCATION */}
                        <h2 className={sectionHeaderClasses}>Contact & Location</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                            <div>
                                <label className={labelClasses}>Phone Number</label>
                                <Input
                                    type="tel"
                                    value={doctor.phone}
                                    onChange={e => setDoctor({ ...doctor, phone: e.target.value })}
                                    placeholder="+1 (555) 000-0000"
                                    required
                                />
                            </div>

                            <div>
                                <label className={labelClasses}>Email Address</label>
                                <Input
                                    type="email"
                                    value={doctor.email}
                                    onChange={e => setDoctor({ ...doctor, email: e.target.value })}
                                    placeholder="doctor@example.com"
                                    required
                                />
                            </div>
                            {!isEdit && (
                                <div>
                                    <label className={labelClasses}>Password</label>
                                    <Input
                                        type="password"
                                        value={doctor.password}
                                        onChange={e => setDoctor({ ...doctor, password: e.target.value })}
                                        placeholder="Enter login password"
                                        required
                                    />
                                </div>
                            )}

                            <div className="md:col-span-2">
                                <label className={labelClasses}>Hospital / Clinic Name</label>
                                <Input
                                    value={doctor.hospitalName}
                                    onChange={e => setDoctor({ ...doctor, hospitalName: e.target.value })}
                                    placeholder="Primary practice location"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className={labelClasses}>Full Address</label>
                                <Input
                                    value={doctor.address}
                                    onChange={e => setDoctor({ ...doctor, address: e.target.value })}
                                    placeholder="Street, City, Zip"
                                />
                            </div>
                        </div>

                        {/* AVAILABILITY */}
                        <h2 className={sectionHeaderClasses}>Status</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                            <div>
                                <label className={labelClasses}>Current Availability</label>
                                <select
                                    className={selectClasses}
                                    value={doctor.availability}
                                    onChange={e => setDoctor({ ...doctor, availability: e.target.value })}
                                    required
                                >
                                    <option value="" disabled>Select Status</option>
                                    <option value="AVAILABLE">Available</option>
                                    <option value="NOT_AVAILABLE">Not Available</option>
                                </select>
                            </div>
                        </div>

                        {/* ACTION BUTTONS */}
                        <div className="flex flex-col-reverse sm:flex-row justify-end items-center gap-3 pt-6 border-t border-slate-200">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => navigate("/doctors")}
                                className="w-full sm:w-auto"
                                disabled={isSaving}
                            >
                                Cancel
                            </Button>

                            <Button
                                type="reset"
                                variant="outline"
                                className="w-full sm:w-auto"
                                disabled={isSaving}
                                onClick={() => setDoctor({
                                    name: "", specialization: "", experience: 0, gender: "", qualification: "",
                                    phone: "", email: "", consultationFee: 0, availability: "", hospitalName: "", address: ""
                                })}
                            >
                                Clear Form
                            </Button>

                            <Button
                                type="submit"
                                variant="primary"
                                isLoading={isSaving}
                                className="w-full sm:w-auto"
                            >
                                {isEdit ? "Save Changes" : "Create Doctor"}
                            </Button>
                        </div>

                    </form>
                </Card>
            </div>
        </div>
    );
};