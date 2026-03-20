import React, { useEffect, useState } from 'react';
import { clinicApi } from '../../services/api';
import { Clinic } from '../../types';
import { Search, MapPin, Building2, Phone, Mail, Clock, RefreshCw, Users } from 'lucide-react';

// Cycle through accent colors per clinic for visual distinction
const ACCENT_COLORS = [
  { bar: '#7F77DD', tag: { bg: '#EEEDFE', text: '#534AB7' } },
  { bar: '#1D9E75', tag: { bg: '#E1F5EE', text: '#0F6E56' } },
  { bar: '#378ADD', tag: { bg: '#E6F1FB', text: '#185FA5' } },
  { bar: '#D85A30', tag: { bg: '#FAECE7', text: '#993C1D' } },
  { bar: '#BA7517', tag: { bg: '#FAEEDA', text: '#854F0B' } },
];

const getAccent = (index: number) => ACCENT_COLORS[index % ACCENT_COLORS.length];

const getStatusStyle = (status: string): React.CSSProperties => {
  switch ((status || '').toUpperCase()) {
    case 'ACTIVE':   return { color: '#1D9E75' };
    case 'INACTIVE': return { color: '#E24B4A' };
    case 'PENDING':  return { color: '#BA7517' };
    default:         return { color: '#888780' };
  }
};

const getStatusDotColor = (status: string): string => {
  switch ((status || '').toUpperCase()) {
    case 'ACTIVE':   return '#1D9E75';
    case 'INACTIVE': return '#E24B4A';
    case 'PENDING':  return '#BA7517';
    default:         return '#888780';
  }
};

export const PatClinicList: React.FC = () => {
  const [clinics, setClinics]       = useState<Clinic[]>([]);
  const [isLoading, setIsLoading]   = useState(true);
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

  useEffect(() => { fetchClinics(); }, []);

  const clinicTypes = [...new Set(clinics.map(c => c.clinicType).filter(Boolean))];
  const cities      = [...new Set(clinics.map(c => c.address?.city).filter(Boolean))];

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

  const selectStyle: React.CSSProperties = {
    width: '100%',
    padding: '9px 14px',
    fontSize: '13px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    outline: 'none',
    background: '#fff',
    color: '#475569',
    cursor: 'pointer',
    appearance: 'none' as any,
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
    paddingRight: '32px',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

      {/* Header */}
      <div>
        <h1 style={{ fontSize: '22px', fontWeight: 600, color: '#0f172a', margin: 0 }}>Clinics</h1>
        <p style={{ fontSize: '13px', color: '#94a3b8', margin: '4px 0 0' }}>Browse all registered clinics</p>
      </div>

      {/* Filters */}
      <div style={{
        background: '#fff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '14px 16px',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1fr auto',
          gap: '10px',
          alignItems: 'center',
        }}>
          {/* Search */}
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search by name, city, email or phone..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px 9px 34px',
                fontSize: '13px',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                outline: 'none',
                color: '#334155',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <select value={filterType} onChange={e => setFilterType(e.target.value)} style={selectStyle}>
            <option value="">All Types</option>
            {clinicTypes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>

          <select value={filterCity} onChange={e => setFilterCity(e.target.value)} style={selectStyle}>
            <option value="">All Cities</option>
            {cities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={selectStyle}>
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="PENDING">Pending</option>
          </select>

          <button
            onClick={resetFilters}
            title="Reset filters"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '38px', height: '38px',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              background: '#fff',
              color: '#64748b',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* States */}
      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '48px 0' }}>
          <div style={{
            width: '28px', height: '28px',
            border: '2px solid #e2e8f0',
            borderTopColor: '#7F77DD',
            borderRadius: '50%',
            animation: 'spin 0.7s linear infinite',
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : filteredClinics.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '64px 0', color: '#cbd5e1' }}>
          <Building2 size={34} style={{ marginBottom: '10px' }} />
          <p style={{ fontSize: '13px', margin: 0 }}>No clinics found.</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '14px',
        }}>
          {filteredClinics.map((clinic, index) => {
            const accent = getAccent(index);
            const depts  = clinic.departments || [];
            const svcs   = clinic.services || [];

            return (
              <div
                key={clinic.clinicId}
                style={{
                  background: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  display: 'flex',
                  overflow: 'hidden',
                  transition: 'border-color 0.15s, box-shadow 0.15s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = '#cbd5e1';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = '#e2e8f0';
                  (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                }}
              >
                {/* Accent bar */}
                <div style={{ width: '4px', background: accent.bar, flexShrink: 0 }} />

                {/* Content */}
                <div style={{ flex: 1, padding: '14px 15px' }}>

                  {/* Name + status */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a', lineHeight: 1.3, marginRight: '8px' }}>
                      {clinic.clinicName}
                    </span>
                    {clinic.status && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0, marginTop: '2px' }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: getStatusDotColor(clinic.status) }} />
                        <span style={{ fontSize: '11px', fontWeight: 500, ...getStatusStyle(clinic.status) }}>
                          {clinic.status.charAt(0) + clinic.status.slice(1).toLowerCase()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Type + city */}
                  <div style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.07em', color: '#94a3b8', marginBottom: '12px' }}>
                    {[clinic.clinicType, clinic.address?.city, clinic.address?.state].filter(Boolean).join(' · ').toUpperCase()}
                  </div>

                  {/* Info rows */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
                    {(clinic.address?.city || clinic.address?.state) && (
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '7px', fontSize: '12px', color: '#475569' }}>
                        <span style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#94a3b8', minWidth: '42px', paddingTop: '1px', flexShrink: 0 }}>Loc</span>
                        {clinic.address.city}{clinic.address.state ? `, ${clinic.address.state}` : ''}
                      </div>
                    )}
                    {clinic.contact?.phone && (
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '7px', fontSize: '12px', color: '#475569' }}>
                        <span style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#94a3b8', minWidth: '42px', paddingTop: '1px', flexShrink: 0 }}>Phone</span>
                        {clinic.contact.phone}
                      </div>
                    )}
                    {clinic.contact?.email && (
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '7px', fontSize: '12px', color: '#475569' }}>
                        <span style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#94a3b8', minWidth: '42px', paddingTop: '1px', flexShrink: 0 }}>Email</span>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{clinic.contact.email}</span>
                      </div>
                    )}
                    {(clinic.openingTime || clinic.closingTime) && (
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '7px', fontSize: '12px', color: '#475569' }}>
                        <span style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#94a3b8', minWidth: '42px', paddingTop: '1px', flexShrink: 0 }}>Hours</span>
                        {clinic.openingTime || '—'} – {clinic.closingTime || '—'}
                      </div>
                    )}
                  </div>

                  {/* Divider */}
                  <div style={{ borderTop: '1px solid #f1f5f9', marginBottom: '10px' }} />

                  {/* Departments + Services tags */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                    {depts.length > 0 ? (
                      depts.map((dept: any, i: number) => (
                        <span key={i} style={{
                          fontSize: '11px', padding: '3px 9px', borderRadius: '20px',
                          background: accent.tag.bg, color: accent.tag.text, fontWeight: 500,
                        }}>
                          {typeof dept === 'string' ? dept : dept.name || dept.departmentName || dept}
                        </span>
                      ))
                    ) : null}
                    {svcs.slice(0, 3).map((svc: string, i: number) => (
                      <span key={i} style={{
                        fontSize: '11px', padding: '3px 9px', borderRadius: '20px',
                        background: '#f8fafc', color: '#64748b', fontWeight: 500,
                        border: '1px solid #e2e8f0',
                      }}>
                        {svc}
                      </span>
                    ))}
                    {svcs.length > 3 && (
                      <span style={{
                        fontSize: '11px', padding: '3px 9px', borderRadius: '20px',
                        background: '#f8fafc', color: '#94a3b8', fontWeight: 500,
                        border: '1px solid #e2e8f0',
                      }}>
                        +{svcs.length - 3} more
                      </span>
                    )}
                    {depts.length === 0 && svcs.length === 0 && (
                      <span style={{ fontSize: '11px', color: '#cbd5e1' }}>No departments</span>
                    )}
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

      {!isLoading && filteredClinics.length > 0 && (
        <p style={{ fontSize: '12px', color: '#cbd5e1', textAlign: 'right', margin: 0 }}>
          Showing {filteredClinics.length} of {clinics.length} clinics
        </p>
      )}

    </div>
  );
};