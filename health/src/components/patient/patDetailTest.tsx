import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, FlaskConical, FileText, Clock, Stethoscope, User } from 'lucide-react';

// ✅ USE YOUR API INSTANCE (not raw axios like a rebel without a cause)
import { medicalTestApi, doctorApi, patientApi } from '../../services/api';

interface MedicalTest {
    testId: string;
    testName: string;
    category: string;
    price: number;
    description: string;
    history: string;
    resultStatus: string;
    doctorId: string;
    patientId: string;
}

interface Doctor {
    name: string;
    phone: string;
    email: string;
}

interface Patient {
    fullName: string;
    phone: string;
    emailAddress: string;
}

export const PatientTestDetail: React.FC = () => {
    const navigate = useNavigate();
    const { testId } = useParams<{ testId: string }>();

    const [test, setTest] = useState<MedicalTest | null>(null);
    const [doctor, setDoctor] = useState<Doctor | null>(null);
    const [patient, setPatient] = useState<Patient | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        if (testId) loadReportDetails();
    }, [testId]);

    const loadReportDetails = async () => {
        setIsLoading(true);
        try {
            if (!testId) throw new Error("No testId");

            // ✅ Get test data
            const testResponse = await medicalTestApi.getByTestId(testId);
            const testData: MedicalTest =
                testResponse.data.data || testResponse.data;

            if (!testData || !testData.testId) {
                throw new Error("Invalid test data");
            }

            setTest(testData);

            // ✅ Get doctor
            if (testData.doctorId) {
                try {
                    const doctorRes = await doctorApi.getById(testData.doctorId);
                    setDoctor(doctorRes.data.data || doctorRes.data);
                } catch (e) {
                    console.warn("Doctor load failed", e);
                }
            }

            // ✅ Get patient
            if (testData.patientId) {
                try {
                    const patientRes = await patientApi.getByPatientId(testData.patientId);
                    setPatient(patientRes.data.data || patientRes.data);
                } catch (e) {
                    console.warn("Patient load failed", e);
                }
            }

        } catch (error: any) {
            console.error("FULL ERROR:", error.response || error);
            setNotFound(true);
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Completed': return { badge: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' };
            case 'Pending': return { badge: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' };
            default: return { badge: 'bg-slate-100 text-slate-500', dot: 'bg-slate-400' };
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center py-24">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
            </div>
        );
    }

    if (notFound || !test || !test.testId) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-center">
                <FlaskConical size={40} className="mb-4 text-red-400" />
                <h3 className="text-lg font-semibold text-slate-700 mb-1">Report Not Found</h3>
                <p className="text-sm text-slate-400 max-w-xs">
                    We couldn't locate this test record. It may have been removed or the ID is incorrect.
                </p>
                <button
                    onClick={() => navigate(-1)}
                    className="mt-6 px-5 py-2 text-sm font-medium border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 transition"
                >
                    Go Back
                </button>
            </div>
        );
    }

    const statusStyle = getStatusStyle(test.resultStatus);

    return (
        <div className="space-y-6 max-w-4xl">

            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <FlaskConical size={22} className="text-emerald-600" />
                        Test Report
                        <span className="text-slate-400 font-normal text-lg">#{test.testId}</span>
                    </h1>
                    <p className="text-slate-500 mt-0.5">Your medical test details and results.</p>
                </div>
            </div>

            {/* Test Info */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
                    <h2 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <FlaskConical size={15} className="text-emerald-600" />
                        Test Information
                    </h2>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${statusStyle.badge}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                        {test.resultStatus || 'Unknown'}
                    </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y divide-slate-100">
                    <InfoCell label="Test ID" value={test.testId} />
                    <InfoCell label="Test Name" value={test.testName} />
                    <InfoCell label="Category" value={test.category} />
                    <InfoCell label="Price" value={`₹${test.price ?? '0.00'}`} />
                </div>
            </div>

            {/* Description & History */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card title="Description" icon={<FileText size={15} className="text-blue-500" />}>
                    {test.description || 'No description available.'}
                </Card>

                <Card title="History" icon={<Clock size={15} className="text-amber-500" />}>
                    {test.history || 'No history recorded.'}
                </Card>
            </div>

            {/* Doctor & Patient */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card title="Attending Doctor" icon={<Stethoscope size={15} className="text-emerald-600" />}>
                    <InfoRow label="Name" value={doctor?.name || 'Not Assigned'} />
                    <InfoRow label="Phone" value={doctor?.phone} />
                    <InfoRow label="Email" value={doctor?.email} />
                </Card>

                <Card title="Patient Details" icon={<User size={15} className="text-blue-500" />}>
                    <InfoRow label="Name" value={patient?.fullName} />
                    <InfoRow label="Phone" value={patient?.phone} />
                    <InfoRow label="Email" value={patient?.emailAddress} />
                </Card>
            </div>

        </div>
    );
};

const Card: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
            {icon}
            <h2 className="text-sm font-semibold text-slate-700">{title}</h2>
        </div>
        <div className="px-6 py-4 text-sm text-slate-600">
            {children}
        </div>
    </div>
);

const InfoCell: React.FC<{ label: string; value?: string }> = ({ label, value }) => (
    <div className="px-6 py-4">
        <p className="text-xs text-slate-400 mb-1">{label}</p>
        <p className="text-sm font-semibold text-slate-800">{value || '—'}</p>
    </div>
);

const InfoRow: React.FC<{ label: string; value?: string }> = ({ label, value }) => (
    <div className="flex items-center justify-between py-2">
        <span className="text-xs text-slate-400 w-24">{label}</span>
        <span className="text-sm text-slate-700 font-medium text-right">{value || '—'}</span>
    </div>
);