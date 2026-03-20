import React, { useEffect, useState } from 'react';
import { Card, Input } from '../UI';
import { clinicApi } from '../../services/api';
import { Clinic } from '../../types';
import { Search, MapPin, Building2, Users, Phone, Mail, Clock, RefreshCw } from 'lucide-react';

export const DocClinicList: React.FC = () => {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterCity, setFilterCity] = useState('');

  const fetchClinics = async () => {
    try {
      const response = await clinicApi.getAll();
      setClinics(response.data);
    } catch (error) {
      console.error('Failed to fetch clinics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClinics();
  }, []);

  const clinicTypes = [...new Set(clinics.map(c => c.clinicType).filter(Boolean))];
  const cities = [...new Set(clinics.map(c => c.address?.city).filter(Boolean))];

  const resetFilters = () => {
    setSearchTerm('');
    setFilterType('');
    setFilterStatus('');
    setFilterCity('');
  };

  const filteredClinics = clinics.filter(clinic => {
    const matchSearch =
      clinic.clinicName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clinic.address?.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clinic.contact?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clinic.contact?.phone?.includes(searchTerm);
    const matchType   = !filterType   || clinic.clinicType === filterType;
    const matchStatus = !filterStatus || (clinic.status || '').toLowerCase() === filterStatus.toLowerCase();
    const matchCity   = !filterCity   || clinic.address?.city === filterCity;
    return matchSearch && matchType && matchStatus && matchCity;
  });

  const getStatusStyle = (status: string) => {
    switch ((status || '').toUpperCase()) {
      case 'ACTIVE':   return 'bg-emerald-100 text-emerald-700';
      case 'INACTIVE': return 'bg-red-100 text-red-600';
      case 'PENDING':  return 'bg-amber-100 text-amber-700';
      default:         return 'bg-slate-100 text-slate-500';
    }
  };

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Clinics</h1>
        <p className="text-slate-500">Browse all registered clinics</p>
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">

          <div className="relative md:col-span-2">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, city, email or phone..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 hover:border-slate-400 transition"
            />
          </div>

          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-slate-700 hover:border-slate-400 transition"
          >
            <option value="">All Types</option>
            {clinicTypes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>

          <select
            value={filterCity}
            onChange={e => setFilterCity(e.target.value)}
            className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-slate-700 hover:border-slate-400 transition"
          >
            <option value="">All Cities</option>
            {cities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <div className="flex gap-3">
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="flex-1 px-4 py-2.5 text-sm border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-slate-700 hover:border-slate-400 transition"
            >
              <option value="">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="PENDING">Pending</option>
            </select>
            <button
              onClick={resetFilters}
              className="px-3 py-2.5 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 transition"
              title="Reset filters"
            >
              <RefreshCw size={15} />
            </button>
          </div>

        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
        </div>
      ) : filteredClinics.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-slate-400">
          <Building2 size={36} className="mb-3" />
          <p className="text-sm">No clinics found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClinics.map(clinic => (
            <div
              key={clinic.clinicId}
              className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow"
            >
              {/* Top row */}
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center shrink-0">
                  <Building2 className="text-purple-600" size={22} />
                </div>
                {clinic.status && (
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusStyle(clinic.status)}`}>
                    {clinic.status}
                  </span>
                )}
              </div>

              {/* Name + type */}
              <h3 className="text-base font-bold text-slate-900 mb-0.5">{clinic.clinicName}</h3>
              <p className="text-xs text-slate-500 mb-4">{clinic.clinicType}</p>

              {/* Details */}
              <div className="space-y-2 text-sm text-slate-600 border-t border-slate-100 pt-4">

                <div className="flex items-center gap-2">
                  <MapPin size={13} className="text-slate-400 shrink-0" />
                  <span>{clinic.address?.city}, {clinic.address?.state}</span>
                </div>

                {clinic.contact?.phone && (
                  <div className="flex items-center gap-2">
                    <Phone size={13} className="text-slate-400 shrink-0" />
                    <span>{clinic.contact.phone}</span>
                  </div>
                )}

                {clinic.contact?.email && (
                  <div className="flex items-center gap-2">
                    <Mail size={13} className="text-slate-400 shrink-0" />
                    <span className="truncate">{clinic.contact.email}</span>
                  </div>
                )}

                {(clinic.openingTime || clinic.closingTime) && (
                  <div className="flex items-center gap-2">
                    <Clock size={13} className="text-slate-400 shrink-0" />
                    <span>
                      {clinic.openingTime || '—'} – {clinic.closingTime || '—'}
                    </span>
                  </div>
                )}

                <div className="flex items-start gap-2">
                  <Users size={13} className="text-slate-400 shrink-0 mt-0.5" />
                  <div className="flex flex-wrap gap-1">
                    {clinic.departments?.length > 0 ? (
                      clinic.departments.map((dept: any, i: number) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-purple-50 text-purple-700 text-[10px] font-medium rounded-md"
                        >
                          {typeof dept === 'string' ? dept : dept.name || dept.departmentName || dept}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400 text-xs">No departments</span>
                    )}
                  </div>
                </div>

              </div>

              {/* Services */}
              {clinic.services?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-slate-100">
                  {clinic.services.slice(0, 3).map((service, i) => (
                    <span key={i} className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-medium rounded-lg">
                      {service}
                    </span>
                  ))}
                  {clinic.services.length > 3 && (
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-medium rounded-lg">
                      +{clinic.services.length - 3} more
                    </span>
                  )}
                </div>
              )}

            </div>
          ))}
        </div>
      )}

      {!isLoading && filteredClinics.length > 0 && (
        <p className="text-xs text-slate-400 text-right">
          Showing {filteredClinics.length} of {clinics.length} clinics
        </p>
      )}

    </div>
  );
};