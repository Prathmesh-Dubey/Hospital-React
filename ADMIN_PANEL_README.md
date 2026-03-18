# Hospital Management System - Admin Panel

A modern, SaaS-style admin panel built with Spring Boot and Thymeleaf for managing hospital operations including patients, doctors, clinics, medicines, and tests.

## 📋 Features

### Core Features
- ✅ **Patient Management** - Add, Update, Delete, and Search patients
- ✅ **Doctor Management** - Manage doctors with specialization, experience, and availability
- ✅ **Clinic Management** - Create and manage clinic information and services
- ✅ **Dashboard** - Real-time statistics and quick actions
- ✅ **Advanced Filtering** - Search and filter records by multiple criteria
- ✅ **Responsive Design** - Works seamlessly on desktop, tablet, and mobile

### API Features (from clinic.json)
- Doctor Availability Management
- Patient Details Management
- Medicines Management
- Tests Management
- Advanced filtering with multiple parameters

## 🏗️ Project Structure

```
src/
├── main/
│   ├── java/
│   │   └── com/example/springcrud/
│   │       ├── controller/
│   │       │   ├── WebController.java (Updated with routes)
│   │       │   ├── PatientController.java
│   │       │   ├── DoctorController.java
│   │       │   ├── ClinicController.java
│   │       │   └── ...
│   │       ├── model/
│   │       ├── repository/
│   │       └── SpringCrudApplication.java
│   └── resources/
│       ├── templates/
│       │   ├── admin/
│       │   │   ├── dashboard.html (Main dashboard)
│       │   │   ├── patients.html (Patient CRUD)
│       │   │   ├── doctors.html (Doctor CRUD)
│       │   │   ├── clinics.html (Clinic CRUD)
│       │   │   ├── medicines.html (Coming soon)
│       │   │   ├── tests.html (Coming soon)
│       │   │   └── profile.html (Admin profile)
│       │   ├── layouts/
│       │   │   └── base.html (Base layout template)
│       │   └── index.html (Original landing page)
│       ├── static/
│       │   ├── css/
│       │   │   └── admin-style.css (Admin panel styles)
│       │   └── js/
│       │       └── admin/
│       │           └── common.js (Shared utilities)
│       └── application.properties
```

## 🚀 Getting Started

### Prerequisites
- Java 8+
- Maven 3.6+
- MongoDB (running locally or configured in application.properties)
- Spring Boot 3.2.1

### Installation

1. **Clone the repository**
   ```bash
   cd /Users/chedo/Documents/hospital_CRUD
   ```

2. **Build the project**
   ```bash
   mvn clean build
   ```

3. **Run the application**
   ```bash
   mvn spring-boot:run
   ```

4. **Access the admin panel**
   - Open browser and navigate to: `http://localhost:8080/admin`
   - Dashboard: `http://localhost:8080/admin`
   - Patients: `http://localhost:8080/admin/patients`
   - Doctors: `http://localhost:8080/admin/doctors`
   - Clinics: `http://localhost:8080/admin/clinics`

## 📱 Admin Panel Routes

| Route | Description | Status |
|-------|-------------|--------|
| `/admin` | Main dashboard | ✅ Complete |
| `/admin/patients` | Patient management | ✅ Complete |
| `/admin/doctors` | Doctor management | ✅ Complete |
| `/admin/clinics` | Clinic management | ✅ Complete |
| `/admin/medicines` | Medicines management | 🔄 Placeholder |
| `/admin/tests` | Tests management | 🔄 Placeholder |
| `/admin/profile` | Admin profile | ✅ Complete |

## 🎯 Patient Management Features

### Add Patient
- Patient ID
- Full Name
- Date of Birth
- Gender (Male/Female/Other)
- Phone Number
- Email Address
- Residential Address
- Emergency Contact
- Blood Group (O+, O-, A+, A-, B+, B-, AB+, AB-)
- Height (cm)
- Weight (kg)
- Allergies
- Chronic Diseases
- Current Medications

### Patient Filters
- Patient ID
- Full Name
- Gender
- Blood Group
- Phone Number
- Email Address

### Patient Actions
- ✅ Create new patient
- ✅ View all patients
- ✅ Edit patient details
- ✅ Delete patient
- ✅ Search and filter patients

## 👨‍⚕️ Doctor Management Features

### Add Doctor
- Doctor ID
- Full Name
- Specialization
- Experience (years)
- Qualification (MBBS, MD, etc.)
- Gender
- Phone
- Email
- Consultation Fee
- Availability Status
- Hospital Name
- Address
- Rating (0-5)

### Doctor Filters
- Name
- Specialization
- Gender
- Hospital
- Experience Range
- Consultation Fee Range
- Rating

### Doctor Actions
- ✅ Create new doctor
- ✅ View all doctors
- ✅ Edit doctor details
- ✅ Delete doctor
- ✅ Advanced filtering

## 🏥 Clinic Management Features

### Add Clinic
- Clinic ID
- Clinic Name
- Clinic Type (OPD/Hospital/Clinic)
- Registration Number
- Status (Active/Closed)
- Phone & Email
- Address (City, State, Pincode, Country)
- Opening & Closing Times
- Departments (comma-separated)
- Services (OPD, Lab, Pharmacy, etc.)
- Appointment Required (Yes/No)

### Clinic Filters
- Clinic Name
- Status
- City

### Clinic Actions
- ✅ Create new clinic
- ✅ View all clinics
- ✅ Edit clinic details
- ✅ Delete clinic
- ✅ Filter by status and location

## 📊 Dashboard Features

- **Real-time Statistics**
  - Total Patients count
  - Total Doctors count
  - Total Clinics count
  - Active Records count

- **Quick Actions**
  - Add Patient
  - Add Doctor
  - Add Clinic
  - View Schedule

- **System Information**
  - API Base URL
  - Database Type
  - Last Updated Timestamp
  - Version

## 🎨 UI/UX Features

### Design Elements
- Modern gradient navbar
- Responsive sidebar navigation
- Card-based dashboard
- Modal dialogs for CRUD operations
- DataTables for displaying records
- Bootstrap 5 styling
- Font Awesome icons

### Features
- Real-time search and filtering
- Responsive design (Desktop, Tablet, Mobile)
- Toast notifications for actions
- Loading indicators
- Status badges
- Action buttons (Edit, Delete)
- Pagination for large datasets

## 🔗 API Integration

All admin panel pages communicate with the backend REST APIs:

### Patient API
```
POST   /api/patients              - Create patient
GET    /api/patients              - Get all patients (with filters)
GET    /api/patients/{id}         - Get patient by ID
PUT    /api/patients/{id}         - Update patient
DELETE /api/patients/{id}         - Delete patient
```

### Doctor API
```
POST   /api/doctors               - Create doctor
GET    /api/doctors               - Get all doctors (with filters)
GET    /api/doctors/{id}          - Get doctor by ID
PUT    /api/doctors/{id}          - Update doctor
DELETE /api/doctors/{id}          - Delete doctor
```

### Clinic API
```
POST   /api/clinics               - Create clinic
GET    /api/clinics               - Get all clinics
GET    /api/clinics/{id}          - Get clinic by ID
PUT    /api/clinics/{id}          - Update clinic
DELETE /api/clinics/{id}          - Delete clinic
```

### Additional APIs
```
/api/medicines                     - Medicines management
/api/medicines-tests              - Tests management
/api/doctor-availability          - Doctor availability management
/api/details                       - Patient details management
```

## 📋 Technology Stack

- **Backend Framework**: Spring Boot 3.2.1
- **Template Engine**: Thymeleaf
- **Frontend Framework**: Bootstrap 5
- **HTTP Client**: Axios
- **Icons**: Font Awesome 6.4
- **Tables**: DataTables 1.13
- **Database**: MongoDB
- **Build Tool**: Maven

## 🎓 Usage Examples

### Creating a Patient via Admin Panel

1. Navigate to `/admin/patients`
2. Click "Add New Patient" button
3. Fill in patient details:
   - Patient ID: PAT-1001
   - Full Name: John Doe
   - Gender: Male
   - Blood Group: O+
   - Phone: 9876543210
   - Email: john@example.com
   - And other details...
4. Click "Save Patient"

### Searching for Patients

1. Go to Patients page
2. Use filter fields:
   - Patient ID search
   - Name search
   - Gender filter
   - Blood Group search
3. Results update in real-time

### Managing Doctors

1. Navigate to `/admin/doctors`
2. Add new doctors with specialization
3. Edit doctor details
4. View all doctors with advanced filters
5. Delete doctors if needed

## 🛠️ Development Notes

### Adding New Features

1. **Create new page template** in `src/main/resources/templates/admin/`
2. **Add route** in `WebController.java`
3. **Create JavaScript functions** for API calls
4. **Style using** `admin-style.css`

### Common JavaScript Functions

Located in `/js/admin/common.js`:

```javascript
// API calls
apiRequest(method, endpoint, data)
getById(endpoint, id)
create(endpoint, data)
update(endpoint, id, data)
deleteItem(endpoint, id)

// Utilities
showAlert(message, type, duration)
formatDate(dateString)
formatDateTime(dateString)
debounce(func, wait)
exportTableToCSV(tableId, filename)
```

## 📝 Form Validation

All forms include:
- Required field validation
- Email format validation
- Phone number validation
- Numeric range validation
- Error messages

## 🔒 Security Considerations

- Add authentication middleware
- Implement authorization checks
- Validate all inputs server-side
- Use CSRF tokens for form submissions
- Implement rate limiting
- Add audit logging

## 🐛 Troubleshooting

### Issue: Admin panel not loading
- Check if MongoDB is running
- Verify application.properties configuration
- Check browser console for errors

### Issue: API calls failing
- Ensure backend is running on port 8080
- Check CORS configuration
- Verify MongoDB connection

### Issue: Styles not loading
- Clear browser cache
- Check CSS file path
- Verify static resources directory

## 📖 Additional Resources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Thymeleaf Documentation](https://www.thymeleaf.org/)
- [Bootstrap 5 Docs](https://getbootstrap.com/docs/5.3/)
- [MongoDB Documentation](https://docs.mongodb.com/)

## 🎉 Features Roadmap

- [ ] Medicines Management UI
- [ ] Tests Management UI
- [ ] Doctor Availability Calendar
- [ ] Patient Details Management
- [ ] Admin Authentication & Authorization
- [ ] Email Notifications
- [ ] Report Generation (PDF/Excel)
- [ ] Data Export/Import
- [ ] Advanced Analytics & Charts
- [ ] Multi-language Support

## 📞 Support

For issues or questions, refer to:
- Check API documentation in `clinic.json`
- Review console logs for errors
- Verify database connections
- Check Spring Boot application logs

## 📄 License

This project is part of the Hospital Management System.

---

**Last Updated**: February 9, 2026
**Version**: 1.0.0
