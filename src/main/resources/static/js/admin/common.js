/**
 * Common Admin Panel JavaScript Utilities
 */

// API Base URL
const API_BASE_URL = 'http://localhost:8080/api';

/**
 * Show toast/alert message
 * @param {string} message - Message to display
 * @param {string} type - Alert type (success, danger, warning, info)
 * @param {number} duration - Duration in milliseconds
 */
function showAlert(message, type = 'info', duration = 5000) {
    const alertHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            <i class="fas fa-${getAlertIcon(type)} me-2"></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    const container = document.getElementById('alertContainer');
    if (container) {
        container.insertAdjacentHTML('beforeend', alertHTML);
        setTimeout(() => {
            document.querySelector('.alert')?.remove();
        }, duration);
    }
}

/**
 * Get alert icon based on type
 */
function getAlertIcon(type) {
    const icons = {
        'success': 'check-circle',
        'danger': 'exclamation-circle',
        'warning': 'exclamation-triangle',
        'info': 'info-circle'
    };
    return icons[type] || 'bell';
}

/**
 * Format date string
 * @param {string} dateString - Date string to format
 * @returns {string} - Formatted date
 */
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

/**
 * Format datetime string
 * @param {string} dateString - Date string to format
 * @returns {string} - Formatted datetime
 */
function formatDateTime(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * Debounce function for search inputs
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Validate email format
 */
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Validate phone number format
 */
function isValidPhone(phone) {
    const re = /^[0-9]{10,}$/;
    return re.test(phone.replace(/\D/g, ''));
}

/**
 * Convert string to title case
 */
function toTitleCase(str) {
    if (!str) return '';
    return str.toLowerCase().split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

/**
 * Get status badge HTML
 */
function getStatusBadge(status) {
    const badgeClass = {
        'ACTIVE': 'bg-success',
        'INACTIVE': 'bg-danger',
        'PENDING': 'bg-warning',
        'COMPLETED': 'bg-info',
        'AVAILABLE': 'bg-success',
        'NOT_AVAILABLE': 'bg-danger'
    }[status] || 'bg-secondary';
    
    return `<span class="badge ${badgeClass}">${status}</span>`;
}

/**
 * Convert FormData to JSON object
 */
function formDataToJson(formData) {
    const json = {};
    for (let [key, value] of formData.entries()) {
        if (json[key]) {
            if (!Array.isArray(json[key])) {
                json[key] = [json[key]];
            }
            json[key].push(value);
        } else {
            json[key] = value;
        }
    }
    return json;
}

/**
 * Confirm delete action
 */
function confirmDelete(itemName = 'this item') {
    return confirm(`Are you sure you want to delete ${itemName}?`);
}

/**
 * Get initials from name
 */
function getInitials(name) {
    if (!name) return '?';
    return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
}

/**
 * Generate random color
 */
function getRandomColor() {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'];
    return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * API request with error handling
 */
async function apiRequest(method, endpoint, data = null) {
    try {
        const config = {
            method: method,
            url: `${API_BASE_URL}${endpoint}`,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        if (data) {
            config.data = data;
        }

        const response = await axios(config);
        return { success: true, data: response.data };
    } catch (error) {
        const message = error.response?.data?.message || 
                       error.response?.data?.error || 
                       error.message ||
                       'An error occurred';
        return { success: false, error: message };
    }
}

/**
 * Get by ID helper function
 */
async function getById(endpoint, id) {
    return apiRequest('GET', `${endpoint}/${id}`);
}

/**
 * Create helper function
 */
async function create(endpoint, data) {
    return apiRequest('POST', endpoint, data);
}

/**
 * Update helper function
 */
async function update(endpoint, id, data) {
    return apiRequest('PUT', `${endpoint}/${id}`, data);
}

/**
 * Delete helper function
 */
async function deleteItem(endpoint, id) {
    if (!confirmDelete()) return { success: false };
    return apiRequest('DELETE', `${endpoint}/${id}`);
}

/**
 * Format currency
 */
function formatCurrency(amount) {
    if (!amount) return '$0.00';
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

/**
 * Format blood group
 */
function formatBloodGroup(group) {
    return group ? group.replace(' ', '') : 'N/A';
}

/**
 * Get medical status badge
 */
function getMedicalStatusBadge(status) {
    const badges = {
        'ACTIVE': '<span class="badge bg-success">Active</span>',
        'INACTIVE': '<span class="badge bg-danger">Inactive</span>',
        'PENDING': '<span class="badge bg-warning">Pending</span>',
        'COMPLETED': '<span class="badge bg-info">Completed</span>',
        'AVAILABLE': '<span class="badge bg-success">Available</span>',
        'NOT_AVAILABLE': '<span class="badge bg-danger">Not Available</span>',
        'APPROVED': '<span class="badge bg-success">Approved</span>',
        'REJECTED': '<span class="badge bg-danger">Rejected</span>',
        'ONGOING': '<span class="badge bg-primary">Ongoing</span>'
    };
    return badges[status] || `<span class="badge bg-secondary">${status}</span>`;
}

/**
 * Show loading state
 */
function showLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = '<div class="text-center py-4"><div class="spinner"></div><p class="text-muted">Loading...</p></div>';
    }
}

/**
 * Clear input field
 */
function clearInput(inputId) {
    const input = document.getElementById(inputId);
    if (input) input.value = '';
}

/**
 * Clear form
 */
function clearForm(formId) {
    const form = document.getElementById(formId);
    if (form) form.reset();
}

/**
 * Export table to CSV
 */
function exportTableToCSV(tableId, filename = 'export.csv') {
    const table = document.getElementById(tableId);
    if (!table) return;

    let csv = [];
    
    // Get headers
    const headers = table.querySelectorAll('thead th');
    let headerRow = [];
    headers.forEach(header => {
        headerRow.push(header.textContent.trim());
    });
    csv.push(headerRow.join(','));

    // Get rows
    const rows = table.querySelectorAll('tbody tr');
    rows.forEach(row => {
        let rowData = [];
        const cells = row.querySelectorAll('td');
        cells.forEach((cell, index) => {
            if (index < cells.length - 1) { // Skip action column
                rowData.push('"' + cell.textContent.trim().replace(/"/g, '""') + '"');
            }
        });
        csv.push(rowData.join(','));
    });

    // Download
    const csvContent = csv.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}

/**
 * Print page/element
 */
function printElement(elementId) {
    const element = document.getElementById(elementId);
    if (!element) return;

    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write(element.innerHTML);
    printWindow.document.close();
    printWindow.print();
}

// Initialize tooltips on document ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Bootstrap tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
});
