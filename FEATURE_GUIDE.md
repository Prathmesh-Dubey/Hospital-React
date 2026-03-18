# 🎯 Admin Panel Feature Guide

## Table of Contents
1. [Dashboard](#dashboard)
2. [Patient Management](#patient-management)
3. [Doctor Management](#doctor-management)
4. [Clinic Management](#clinic-management)
5. [Advanced Features](#advanced-features)
6. [Keyboard Shortcuts](#keyboard-shortcuts)

---

## Dashboard

### Overview
The main dashboard provides a complete overview of the hospital system.

### Features
- **Real-time Statistics**
  - Total Patients count
  - Total Doctors count
  - Total Clinics count
  - Active Records count

- **Quick Actions**
  - Add Patient (redirect to patient form)
  - Add Doctor (redirect to doctor form)
  - Add Clinic (redirect to clinic form)
  - View Schedule

- **System Information**
  - API Base URL
  - Database Type
  - Current Date & Time
  - System Version

### Navigation
```
Click on Dashboard in sidebar → View overview
Click quick action buttons → Go to respective modules
```

---

## Patient Management

### Add New Patient

**Location**: `/admin/patients`

**Form Fields**:
```
Patient ID*           - Unique identifier (e.g., PAT-1001)
Full Name*           - Patient's complete name
Date of Birth*       - Select from date picker
Gender*              - Male / Female / Other
Phone Number*        - Contact number (10+ digits)
Email Address*       - Valid email format
Residential Address* - Complete address
Emergency Contact*   - Emergency contact number
Blood Group*         - O+, O-, A+, A-, B+, B-, AB+, AB-
Height               - Height in centimeters
Weight               - Weight in kilograms
Allergies            - Comma-separated list
Chronic Diseases     - Comma-separated list
Current Medications  - Comma-separated list
```

### Patient Operations

#### Create Patient
1. Navigate to `/admin/patients`
2. Click **"Add New Patient"** button
3. Fill all required fields (marked with *)
4. Click **"Save Patient"**
5. Success notification appears
6. Table refreshes with new patient

#### View Patients
- Patient list displays in DataTable format
- Shows: ID, Name, Gender, Blood Group, Phone, Email
- Pagination: 10 records per page
- Sortable columns (click header)

#### Edit Patient
1. Find patient in table
2. Click **"Edit"** button (blue button)
3. Modal opens with populated data
4. Modify required fields
5. Click **"Save Patient"**
6. Record updates in database

#### Delete Patient
1. Find patient in table
2. Click **"Delete"** button (red button)
3. Confirm deletion dialog appears
4. Click **OK** to confirm
5. Patient record is deleted
6. Table refreshes

### Patient Filters

#### Available Filters
- **Patient ID**: Search by exact ID match
- **Full Name**: Search by partial name (case-insensitive)
- **Gender**: Select from dropdown (Male, Female, Other)
- **Blood Group**: Enter blood group (O+, A+, B+, AB+, etc.)

#### How to Filter
1. Fill in one or more filter fields
2. Results update automatically
3. Click **"Reset"** button to clear all filters

#### Example Filter Combinations
- Search for all male patients with O+ blood group
- Search for patients with name containing "John"
- Find patient by exact ID match

---

## Doctor Management

### Add New Doctor

**Location**: `/admin/doctors`

**Form Fields**:
```
Doctor ID*          - Unique identifier (e.g., DOC-101)
Full Name*          - Doctor's complete name
Specialization*     - Medical specialty (e.g., Cardiology)
Experience*         - Years of experience (number)
Qualification       - Degrees (e.g., MBBS, MD, DM)
Gender*             - Male / Female / Other
Phone*              - Contact number
Email*              - Valid email address
Consultation Fee*   - Fee in rupees/dollars (decimal allowed)
Availability*       - Available / Not Available
Hospital Name*      - Associated hospital
Address*            - Doctor's address
Rating              - Rating 0-5 stars (decimal allowed)
```

### Doctor Operations

#### Create Doctor
1. Navigate to `/admin/doctors`
2. Click **"Add New Doctor"** button
3. Fill all required fields
4. Add qualifications (MBBS, MD, etc.)
5. Click **"Save Doctor"**
6. Success notification appears

#### View Doctors
- Doctor list with columns:
  - Doctor ID
  - Name
  - Specialization
  - Hospital
  - Phone
  - Rating (displayed as badge)
- Actions: Edit, Delete

#### Edit Doctor
1. Find doctor in table
2. Click **"Edit"** button
3. Modify details
4. Click **"Save Doctor"**
5. Changes are applied

#### Delete Doctor
1. Click **"Delete"** button
2. Confirm deletion
3. Doctor record is removed

### Doctor Filters

#### Available Filters
- **Name**: Search doctor name
- **Specialization**: Medical specialty
- **Gender**: Male/Female filter
- **Hospital**: Hospital name

#### Advanced Filters (via API)
- Experience range (minExperience, maxExperience)
- Consultation fee range (minFee, maxFee)
- Rating (minRating)
- Qualification matching

#### Example Searches
- Find all cardiologists available
- Search for doctors in "City Hospital"
- Find experienced doctors (10+ years)
- Filter by consultation fee range

---

## Clinic Management

### Add New Clinic

**Location**: `/admin/clinics`

**Form Fields**:
```
BASIC INFORMATION:
Clinic ID*           - Unique identifier
Clinic Name*         - Name of clinic/hospital
Clinic Type*         - OPD / HOSPITAL / CLINIC
Registration Number* - Government registration
Status*              - ACTIVE / CLOSED

CONTACT INFORMATION:
Phone*               - Contact phone number
Email*               - Contact email address

ADDRESS INFORMATION:
City*                - City name
State*               - State/Province name
Pincode*             - Postal code
Country*             - Country name

TIMINGS:
Opening Time         - Opening time (e.g., 09:00 AM)
Closing Time         - Closing time (e.g., 06:00 PM)
Appointment Required - Checkbox (Yes/No)

SERVICES:
Departments          - Services offered (comma-separated)
Services             - Additional services (comma-separated)
```

### Clinic Operations

#### Create Clinic
1. Navigate to `/admin/clinics`
2. Click **"Add New Clinic"** button
3. Fill all required fields
4. Add departments and services
5. Click **"Save Clinic"**
6. New clinic appears in list

#### View Clinics
- Clinic list displays with:
  - Clinic ID
  - Name
  - Type
  - City
  - Phone
  - Status (with badge - green/red)

#### Edit Clinic
1. Click **"Edit"** button
2. Modify clinic details
3. Update address/contact info
4. Click **"Save Clinic"**

#### Delete Clinic
1. Click **"Delete"** button
2. Confirm deletion
3. Clinic is removed from system

### Clinic Filters

#### Available Filters
- **Clinic Name**: Search by name
- **Status**: ACTIVE / CLOSED
- **City**: Filter by location

#### Example Searches
- Find all active clinics
- Search clinics in specific city
- Find all hospitals in region

---

## Advanced Features

### Data Table Features

#### Pagination
- 10 records per page by default
- Navigate using pagination controls
- Go to specific page

#### Sorting
- Click column header to sort
- Sort ascending/descending
- Multiple column sorting supported

#### Search
- Global search across all columns
- Case-insensitive matching
- Real-time results

### Modal Forms

#### Features
- Clean, organized form layout
- Responsive design
- Input validation
- Error message display
- Success/failure notifications

#### Form Validation
- Required field checking
- Email format validation
- Phone number validation
- Numeric range validation

### Notifications

#### Alert Types
- **Success** (Green)
  - Record created/updated/deleted
  - Filter applied
  
- **Error** (Red)
  - Validation failed
  - API error
  - Network error
  
- **Warning** (Yellow)
  - Confirmation required
  - Important notice

- **Info** (Blue)
  - General information
  - Tips and hints

#### Notification Behavior
- Auto-display on action
- Auto-dismiss after 5 seconds
- Manual close option (X button)

### Responsive Design

#### Desktop View
- Full sidebar navigation
- Multi-column tables
- Complete form layouts
- All features visible

#### Tablet View
- Collapsible sidebar
- Optimized table display
- Touch-friendly buttons
- Responsive modals

#### Mobile View
- Single-column layout
- Hamburger menu
- Stacked forms
- Full-width elements

---

## Keyboard Shortcuts

### Global Shortcuts
- `Ctrl + /` - Open help (planned)
- `Escape` - Close modal dialog
- `Ctrl + F5` - Hard refresh page

### Navigation Shortcuts (coming soon)
- `Alt + D` - Go to Dashboard
- `Alt + P` - Go to Patients
- `Alt + R` - Go to Doctors
- `Alt + C` - Go to Clinics

### Form Shortcuts (planned)
- `Ctrl + S` - Save form
- `Ctrl + Z` - Reset form
- `Tab` - Move to next field
- `Shift + Tab` - Move to previous field

---

## Data Entry Tips

### Best Practices

1. **Phone Numbers**
   - Store without special characters
   - Use 10-digit format
   - Include country code if needed

2. **Emails**
   - Use valid email format
   - Verify before saving
   - Check spelling

3. **IDs**
   - Use consistent format (PAT-001, DOC-001, etc.)
   - Make them searchable
   - Keep them unique

4. **Dates**
   - Use date picker for consistency
   - Follow YYYY-MM-DD format
   - Verify date is correct

5. **Lists**
   - Use comma-separated values
   - Add spaces after commas
   - Keep items simple

### Validation Rules

#### Patient Fields
- Patient ID: 3-20 characters
- Name: 2-100 characters
- Phone: 10+ digits
- Email: Valid email format
- Blood Group: Standard groups (O+, A-, etc.)

#### Doctor Fields
- Doctor ID: 3-20 characters
- Name: 2-100 characters
- Experience: 0-70 years
- Consultation Fee: 0-10000
- Rating: 0-5 (decimal)

#### Clinic Fields
- Clinic Name: 3-100 characters
- Pincode: 4-10 digits
- Registration: 5-20 characters

---

## Common Tasks

### Task: Add Patient and Doctor
1. Navigate to Patients page
2. Click "Add Patient" and fill form
3. Click "Add Doctor" and fill form
4. Both appear in respective dashboards

### Task: Search for Specific Patient
1. Go to Patients page
2. Enter patient name in filter
3. Results filter automatically
4. Click edit to modify if needed

### Task: Bulk View and Filter
1. Use multiple filters together
2. View combined results
3. Export to CSV (planned feature)

### Task: Update Multiple Records
1. Edit first record
2. Click Edit button
3. Modify details
4. Save and repeat for others

### Task: Create Clinic with Services
1. Go to Clinics page
2. Click "Add Clinic"
3. Fill basic information
4. Enter services: "OPD, Lab, Pharmacy"
5. Save clinic

---

## Troubleshooting Common Issues

### Form Won't Submit
**Solution**:
- Check all required fields (marked with *)
- Verify email format is correct
- Check phone number has 10+ digits
- Look for validation error messages

### Data Not Appearing
**Solution**:
- Refresh page (F5)
- Check if filter is active
- Verify database connection
- Check browser console for errors

### Modal Won't Close
**Solution**:
- Click the X button
- Press Escape key
- Refresh page if stuck

### Filters Not Working
**Solution**:
- Clear filter and re-enter
- Check for typos
- Use exact values for dropdowns
- Reset filters and try again

---

## Performance Tips

1. **Faster Navigation**
   - Use sidebar links instead of browser back button
   - Keep modal open for multiple entries

2. **Efficient Searching**
   - Use filters to narrow results
   - Combine multiple filters
   - Use exact IDs when searching

3. **Faster Data Entry**
   - Use Tab key to navigate form fields
   - Prepare data before entering
   - Use copy-paste for similar entries

4. **Better Results**
   - Sort table by relevant column
   - Use pagination to view specific pages
   - Keep browser cache clear

---

## Integration with APIs

### Patient API Flow
```
User enters data → Form validation → POST /api/patients
                    ↓
            Database storage → Table refresh
```

### Doctor API Flow
```
User clicks Add → Modal opens → Form filled → PUT /api/doctors/{id}
                                    ↓
                        Database update → Table refresh
```

### Clinic API Flow
```
GET /api/clinics → Data displayed in table → User edits
                        ↓
                    DELETE /api/clinics/{id}
```

---

## Security Notes

### What's Protected
- Form validation prevents invalid data
- Required fields prevent incomplete entries
- Email/phone validation ensures data quality

### Best Practices
- Don't share admin panel URL publicly
- Use strong credentials (future feature)
- Keep session active
- Logout when done (future feature)

---

## FAQ

**Q: Can I export data?**
A: Export feature is coming soon. Currently, you can view all data in tables.

**Q: How do I backup data?**
A: Database backups are handled by MongoDB. Contact admin for backup procedures.

**Q: Can I undo deletions?**
A: Once deleted, records are permanently removed. Use caution with delete operations.

**Q: How many records can I add?**
A: No limit imposed by the system. Performance depends on hardware.

**Q: Can multiple admins access simultaneously?**
A: Yes, the system supports concurrent access and real-time data sync.

---

## Getting Help

1. Check browser console (F12) for errors
2. Review documentation files
3. Verify data format matches requirements
4. Check API response in Network tab
5. Restart application if needed

---

**Last Updated**: February 9, 2026
**Version**: 1.0.0
