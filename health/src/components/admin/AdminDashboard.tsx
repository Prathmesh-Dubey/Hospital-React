import React, { useEffect, useState } from 'react';
import { Card } from '../UI';
import { adminApi, clinicApi, doctorApi, patientApi } from '../../services/api';
import { 
  Users, 
  Stethoscope, 
  Building2, 
  Activity,
  TrendingUp,
  Clock,
  CheckCircle2
} from 'lucide-react';

const StatCard: React.FC<{ icon: React.ReactNode, label: string, value: string | number, color: string }> = ({ icon, label, value, color }) => (
  <Card className="p-6">
    <div className="flex items-center justify-between mb-4">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color}`}>
        {icon}
      </div>
      <TrendingUp size={16} className="text-emerald-500" />
    </div>
    <p className="text-slate-500 text-sm font-medium">{label}</p>
    <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
  </Card>
);

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    admins: 0,
    clinics: 0,
    doctors: 0,
    patients: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [admins, clinics, doctors, patients] = await Promise.all([
          adminApi.getAll(),
          clinicApi.getAll(),
          doctorApi.getAll(),
          patientApi.getAll()
        ]);
        setStats({
          admins: admins.data.length || 0,
          clinics: clinics.data.length || 0,
          doctors: doctors.data.length || 0,
          patients: patients.data.length || 0
        });
      } catch (err) {
        console.error('Failed to fetch stats', err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Admin Overview</h1>
        <p className="text-slate-500">Manage your healthcare network efficiently...</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<Shield className="text-blue-600" />} 
          label="Total Admins" 
          value={stats.admins} 
          color="bg-blue-50" 
        />
        <StatCard 
          icon={<Building2 className="text-purple-600" />} 
          label="Clinics" 
          value={stats.clinics} 
          color="bg-purple-50" 
        />
        <StatCard 
          icon={<Stethoscope className="text-emerald-600" />} 
          label="Doctors" 
          value={stats.doctors} 
          color="bg-emerald-50" 
        />
        <StatCard 
          icon={<Users className="text-orange-600" />} 
          label="Patients" 
          value={stats.patients} 
          color="bg-orange-50" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Recent Activities</h3>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start space-x-4">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center mt-1">
                  <Clock size={14} className="text-slate-500" />
                </div>
                <div>
                  <p className="text-sm text-slate-900 font-medium">New clinic registered</p>
                  <p className="text-xs text-slate-500">City Health Clinic was added to the system</p>
                  <p className="text-[10px] text-slate-400 mt-1">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-6">System Health</h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CheckCircle2 size={20} className="text-emerald-500" />
                <span className="text-sm font-medium text-slate-700">API Server</span>
              </div>
              <span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-lg uppercase tracking-wider">Online</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CheckCircle2 size={20} className="text-emerald-500" />
                <span className="text-sm font-medium text-slate-700">Database</span>
              </div>
              <span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-lg uppercase tracking-wider">Connected</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CheckCircle2 size={20} className="text-emerald-500" />
                <span className="text-sm font-medium text-slate-700">Storage Service</span>
              </div>
              <span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-lg uppercase tracking-wider">Active</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

import { Shield } from 'lucide-react';
