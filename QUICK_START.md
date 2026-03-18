# 🚀 Quick Start Guide - Hospital Admin Panel

## ⚡ 5-Minute Setup

### Step 1: Start the Application
```bash
cd /Users/chedo/Documents/hospital_CRUD
mvn spring-boot:run
```

The application will start on `http://localhost:8080`

### Step 2: Access the Admin Panel
Open your browser and go to:
```
http://localhost:8080/admin
```

## 📍 Navigation

### Main Sections
- **Dashboard** (`/admin`) - Overview and quick actions
- **Patients** (`/admin/patients`) - Manage patient records
- **Doctors** (`/admin/doctors`) - Manage doctor profiles
- **Clinics** (`/admin/clinics`) - Manage clinic information
- **Profile** (`/admin/profile`) - Admin settings and information

## 🎯 Common Tasks

### Add a New Patient

1. Click **"Add New Patient"** button on the Patients page
2. Fill in the required fields:
   ```
   Patient ID:      PAT-001
   Full Name:       John Smith
   Date of Birth:   1990-05-15
   Gender:          Male
   Phone:           9876543210
   Email:           john@example.com
   Address:         123 Main St, City
   Blood Group:     O+
   ```
3. Click **"Save Patient"**

### Search Patients

1. Go to Patients page
2. Use the filter fields:
   - Search by Patient ID
   - Search by Name
   - Filter by Gender
   - Filter by Blood Group
3. Results update automatically

### Add a New Doctor

1. Click **"Add New Doctor"** button on the Doctors page
2. Fill in details:
   ```
   Doctor ID:       DOC-101
   Full Name:       Dr. Smith
   Specialization:  Cardiology
   Experience:      10 years
   Phone:           9876543210
   Email:           doctor@hospital.com
   Hospital:        City Hospital
   Consultation Fee: 500
   Availability:    Available
   ```
3. Click **"Save Doctor"**

### Add a New Clinic

1. Click **"Add New Clinic"** button on the Clinics page
2. Fill in details:
   ```
   Clinic ID:       CLN-001
   Clinic Name:     City Clinic
   Type:            HOSPITAL
   Status:          ACTIVE
   Phone:           02567890
   Email:           clinic@hospital.com
   City:            New York
   Services:        OPD, Lab, Pharmacy
   ```
3. Click **"Save Clinic"**

## 📊 Dashboard Overview

The dashboard displays:
- **Total Patients** - Count of all registered patients
- **Total Doctors** - Count of all doctors in the system
- **Total Clinics** - Count of all clinics
- **Active Records** - Combined active records count

Quick action buttons:
- Add Patient
- Add Doctor
- Add Clinic
- View Schedule

## 🔍 Advanced Filtering

### Patient Filters
- **Patient ID**: Exact ID match
- **Full Name**: Partial name search
- **Gender**: Dropdown selection
- **Blood Group**: Blood group filter

### Doctor Filters
- **Name**: Doctor name search
- **Specialization**: Medical specialty
- **Gender**: Male/Female
- **Hospital**: Hospital name
- **Experience Range**: Min/Max years
- **Fee Range**: Consultation fee range
- **Rating**: Doctor rating

### Clinic Filters
- **Clinic Name**: Search by name
- **Status**: Active/Closed
- **City**: Location filter

## 📱 Responsive Design

The admin panel works on:
- ✅ Desktop (full features)
- ✅ Tablet (optimized layout)
- ✅ Mobile (touch-friendly)

## 🔧 Troubleshooting

### Page Not Loading?
```
1. Check if MongoDB is running
2. Verify application is running on port 8080
3. Clear browser cache (Ctrl+Shift+Del)
4. Check browser console for errors (F12)
```

### Data Not Saving?
```
1. Check network tab in developer tools
2. Verify MongoDB connection
3. Check Java console for errors
4. Ensure all required fields are filled
```

### Styles Look Broken?
```
1. Hard refresh browser (Ctrl+F5)
2. Check if CSS files are loading (F12 -> Network)
3. Verify static resources directory
```

## 📝 Form Requirements

### Patient Form
- ✅ Patient ID (required)
- ✅ Full Name (required)
- ✅ Date of Birth (required)
- ✅ Gender (required)
- ✅ Phone Number (required)
- ✅ Email (required, valid email)
- ✅ Address (required)
- ✅ Emergency Contact (required)
- ✅ Blood Group (required)
- ⚠️ Height (optional)
- ⚠️ Weight (optional)

### Doctor Form
- ✅ Doctor ID (required)
- ✅ Name (required)
- ✅ Specialization (required)
- ✅ Experience (required)
- ✅ Gender (required)
- ✅ Phone (required)
- ✅ Email (required)
- ✅ Hospital (required)
- ✅ Consultation Fee (required)
- ✅ Availability (required)
- ⚠️ Qualification (optional)

### Clinic Form
- ✅ Clinic ID (required)
- ✅ Clinic Name (required)
- ✅ Type (required)
- ✅ Status (required)
- ✅ Phone (required)
- ✅ Email (required)
- ✅ Address Details (required)
- ⚠️ Opening/Closing Times (optional)

## 🎨 UI Tips

1. **Color Coding**
   - Blue = Primary actions (add, save)
   - Green = Success states
   - Red = Danger/Delete actions
   - Yellow = Warnings

2. **Status Badges**
   - Green badge = Active/Available
   - Red badge = Inactive/Unavailable
   - Yellow badge = Pending

3. **Icons**
   - 👤 Users/Patients
   - 👨‍⚕️ Doctors
   - 🏥 Clinics/Buildings
   - 💊 Medicines
   - 🧪 Tests

## 🔗 API Endpoints (Reference)

All pages communicate with these endpoints:

```
Patient Management:
  GET    /api/patients
  POST   /api/patients
  GET    /api/patients/{id}
  PUT    /api/patients/{id}
  DELETE /api/patients/{id}

Doctor Management:
  GET    /api/doctors
  POST   /api/doctors
  GET    /api/doctors/{id}
  PUT    /api/doctors/{id}
  DELETE /api/doctors/{id}

Clinic Management:
  GET    /api/clinics
  POST   /api/clinics
  GET    /api/clinics/{id}
  PUT    /api/clinics/{id}
  DELETE /api/clinics/{id}
```

## 📞 Need Help?

1. Check the detailed README: `ADMIN_PANEL_README.md`
2. Review API docs: `clinic.json`
3. Check browser console for errors (F12)
4. Verify MongoDB is running
5. Check Spring Boot logs

## 🎓 Next Steps

1. ✅ Familiarize yourself with the dashboard
2. ✅ Create a test patient record
3. ✅ Create a test doctor record
4. ✅ Create a test clinic
5. ✅ Try searching and filtering
6. ✅ Edit and delete records
7. ✅ Explore advanced features

## 📚 Resources

- **API Documentation**: `clinic.json` (Postman format)
- **Detailed Guide**: `ADMIN_PANEL_README.md`
- **Backend Code**: `src/main/java/com/example/springcrud/`
- **Frontend Code**: `src/main/resources/templates/admin/`

---

**Happy Managing! 🎉**

For more information, refer to the comprehensive README: `ADMIN_PANEL_README.md`
