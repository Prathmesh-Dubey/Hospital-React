import React from 'react';
import { Link } from 'react-router-dom';
import { Headphones, User, Mail, Phone, Info, ArrowLeft } from 'lucide-react';

export const ContactSupportPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-200 p-8">

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Headphones className="text-emerald-600 w-8 h-8" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">HMS Support Center</h1>
          <p className="text-slate-400 text-sm mt-1">Assistance for Doctors &amp; Patients</p>
        </div>

        {/* Need help with */}
        <div className="bg-slate-50 rounded-xl p-4 mb-5">
          <h2 className="text-sm font-semibold text-slate-700 mb-3">Need Help With:</h2>
          <ul className="space-y-1.5 text-sm text-slate-500">
            {[
              'Unable to login',
              'Forgot Password',
              'Forgot Doctor ID / Patient ID',
              'Account access issues',
              'Technical errors during registration',
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Contact box */}
        <div className="border border-slate-200 rounded-xl p-4 mb-5">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">Admin Support Contact</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                <User size={14} className="text-blue-500" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Name</p>
                <p className="font-medium text-slate-800">Prathmesh Dubey</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                <Mail size={14} className="text-blue-500" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Email</p>
                <a href="mailto:prathmdubey217@gmail.com"
                  className="font-medium text-emerald-600 hover:underline">
                  prathmdubey217@gmail.com
                </a>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                <Phone size={14} className="text-blue-500" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Phone</p>
                <a href="tel:9302622997"
                  className="font-medium text-slate-800 hover:text-emerald-600 transition">
                  9302622997
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Info alert */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-2">
            <Info size={15} className="text-blue-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-blue-700 mb-2">When contacting support, please provide:</p>
              <ul className="space-y-1 text-xs text-blue-600">
                {[
                  'Registered Phone Number',
                  'Registered Email Address',
                  'Your Role (Doctor / Patient)',
                  'Brief description of the issue',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-blue-400 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Back to login */}
        <Link
          to="/"
          className="flex items-center justify-center gap-2 w-full py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition"
        >
          <ArrowLeft size={16} />
          Back to Login
        </Link>

      </div>
    </div>
  );
};