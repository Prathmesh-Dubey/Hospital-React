const API_URL = '/api/pets';

// DOM Elements Chedo
const petForm = document.getElementById('petForm');
const formTitle = document.getElementById('formTitle');
const submitBtn = document.getElementById('submitBtn');
const resetBtn = document.getElementById('resetBtn');
const tableContainer = document.getElementById('tableContainer');
const petsBody = document.getElementById('petsBody');
const loading = document.getElementById('loading');
const message = document.getElementById('message');
const emptyMessage = document.getElementById('emptyMessage');

let editingId = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadPets();
    petForm.addEventListener('submit', handleFormSubmit);
    resetBtn.addEventListener('click', resetForm);
});

// Load all pets
async function loadPets() {
    try {
        loading.style.display = 'block';
        tableContainer.style.display = 'none';
        emptyMessage.style.display = 'none';

        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Failed to fetch pets');
        }

        const pets = await response.json();
        loading.style.display = 'none';

        if (pets.length === 0) {
            emptyMessage.style.display = 'block';
            tableContainer.style.display = 'none';
        } else {
            emptyMessage.style.display = 'none';
            tableContainer.style.display = 'block';
            renderPets(pets);
        }
    } catch (error) {
        loading.style.display = 'none';
        showMessage('Error loading pets: ' + error.message, 'danger');
    }
}

// Render pets in table
function renderPets(pets) {
    petsBody.innerHTML = '';
    pets.forEach(pet => {
        const row = createPetRow(pet);
        petsBody.appendChild(row);
    });
}

// Create table row for a pet
function createPetRow(pet) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td><strong>${pet.id}</strong></td>
        <td>${pet.name}</td>
        <td>${pet.age}</td>
        <td>${pet.type}</td>
        <td>${pet.breed}</td>
        <td>${pet.gender}</td>
        <td>${pet.weight}</td>
        <td><strong>$${pet.price.toFixed(2)}</strong></td>
        <td>
            <div class="action-buttons">
                <button class="btn btn-edit btn-sm" onclick="editPet('${pet.id}')" title="Edit">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-delete btn-sm" onclick="deletePet('${pet.id}')" title="Delete">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </td>
    `;
    return row;
}

// Handle form submit
async function handleFormSubmit(e) {
    e.preventDefault();

    const petData = {
        name: document.getElementById('name').value,
        age: parseInt(document.getElementById('age').value),
        type: document.getElementById('type').value,
        breed: document.getElementById('breed').value,
        gender: document.getElementById('gender').value,
        weight: parseFloat(document.getElementById('weight').value),
        price: parseFloat(document.getElementById('price').value)
    };

    try {
        let response;
        if (editingId) {
            // Update existing pet
            response = await fetch(`${API_URL}/${editingId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(petData)
            });
        } else {
            // Create new pet
            response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(petData)
            });
        }

        if (!response.ok) {
            throw new Error('Failed to save pet');
        }

        showMessage(editingId ? '✓ Pet updated successfully!' : '✓ Pet added successfully!', 'success');
        resetForm();
        loadPets();
    } catch (error) {
        showMessage('✗ Error saving pet: ' + error.message, 'danger');
    }
}

// Edit pet
async function editPet(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch pet');
        }

        const pet = await response.json();

        // Populate form
        document.getElementById('name').value = pet.name;
        document.getElementById('age').value = pet.age;
        document.getElementById('type').value = pet.type;
        document.getElementById('breed').value = pet.breed;
        document.getElementById('gender').value = pet.gender;
        document.getElementById('weight').value = pet.weight;
        document.getElementById('price').value = pet.price;

        editingId = id;
        formTitle.innerHTML = '<i class="fas fa-edit"></i> Edit Pet';
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Update Pet';

        // Scroll to form
        petForm.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        showMessage('✗ Error loading pet: ' + error.message, 'danger');
    }
}

// Delete pet
async function deletePet(id) {
    if (confirm('Are you sure you want to delete this pet?')) {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete pet');
            }

            showMessage('✓ Pet deleted successfully!', 'success');
            loadPets();
        } catch (error) {
            showMessage('✗ Error deleting pet: ' + error.message, 'danger');
        }
    }
}

// Reset form
function resetForm() {
    petForm.reset();
    editingId = null;
    formTitle.innerHTML = '<i class="fas fa-plus-circle"></i> Add New Pet';
    submitBtn.innerHTML = '<i class="fas fa-save"></i> Add Pet';
    message.innerHTML = '';
}

// Show message using Bootstrap alerts
function showMessage(text, type) {
    const alertClass = type === 'success' ? 'alert-success' : 'alert-danger';
    message.innerHTML = `<div class="alert ${alertClass} alert-dismissible fade show" role="alert">
        ${text}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`;

    // Auto-dismiss after 4 seconds
    setTimeout(() => {
        const alert = message.querySelector('.alert');
        if (alert) {
            alert.remove();
        }
    }, 4000);
}
