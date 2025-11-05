// Student Registration System
// Add, edit, delete students and store data in localStorage

// -------------------- Element Selection --------------------
const form = document.getElementById('studentForm');
const nameInput = document.getElementById('name');
const idInput = document.getElementById('studentId');
const emailInput = document.getElementById('email');
const contactInput = document.getElementById('contact');
const studentsTbody = document.getElementById('studentsTbody');
const submitBtn = document.getElementById('submitBtn');
const clearAllBtn = document.getElementById('clearAll');
const editingIndexInput = document.getElementById('editingIndex');
const tableWrapper = document.getElementById('tableWrapper');

// Error messages
const nameError = document.getElementById('nameError');
const idError = document.getElementById('idError');
const emailError = document.getElementById('emailError');
const contactError = document.getElementById('contactError');

const STORAGE_KEY = 'student_records_data';
let students = [];

// -------------------- Validation --------------------
function validateForm() {
  let valid = true;

  nameError.textContent = '';
  idError.textContent = '';
  emailError.textContent = '';
  contactError.textContent = '';

  const nameVal = nameInput.value.trim();
  if (!/^[A-Za-z ]{2,}$/.test(nameVal)) {
    nameError.textContent = 'Enter a valid name (letters and spaces only).';
    valid = false;
  }

  const idVal = idInput.value.trim();
  if (!/^[0-9]+$/.test(idVal)) {
    idError.textContent = 'Student ID must be numeric.';
    valid = false;
  }

  const emailVal = emailInput.value.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
    emailError.textContent = 'Enter a valid email address.';
    valid = false;
  }

  const contactVal = contactInput.value.trim();
  if (!/^\d{10,}$/.test(contactVal)) {
    contactError.textContent = 'Contact must be numeric and at least 10 digits.';
    valid = false;
  }

  return valid;
}

// -------------------- LocalStorage --------------------
function saveToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
}

function loadFromStorage() {
  const data = localStorage.getItem(STORAGE_KEY);
  students = data ? JSON.parse(data) : [];
}

// -------------------- Render Table --------------------
function renderTable() {
  studentsTbody.innerHTML = '';

  if (students.length === 0) {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td colspan="6" style="text-align:center;color:var(--secondary);padding:20px;">No students registered yet.</td>`;
    studentsTbody.appendChild(tr);
  } else {
    students.forEach((student, index) => {
      const tr = document.createElement('tr');
      tr.classList.add('enter-anim');
      tr.innerHTML = `
        <td>${index + 1}</td>
        <td>${student.name}</td>
        <td>${student.studentId}</td>
        <td>${student.email}</td>
        <td>${student.contact}</td>
        <td>
          <button class="small-btn small-edit" data-index="${index}" data-action="edit">Edit</button>
          <button class="small-btn small-delete" data-index="${index}" data-action="delete">Delete</button>
        </td>
      `;
      studentsTbody.appendChild(tr);
    });
  }
}

// -------------------- CRUD Operations --------------------
function addStudent(data) {
  students.push(data);
  saveToStorage();
  renderTable();
}

function updateStudent(index, data) {
  students[index] = data;
  saveToStorage();
  renderTable();
}

function deleteStudent(index) {
  if (confirm('Are you sure you want to delete this record?')) {
    students.splice(index, 1);
    saveToStorage();
    renderTable();
  }
}

function clearAll() {
  if (confirm('This will permanently delete all records. Continue?')) {
    students = [];
    saveToStorage();
    renderTable();
  }
}

// -------------------- Event Listeners --------------------
form.addEventListener('submit', (e) => {
  e.preventDefault();

  if (!validateForm()) return;

  const newStudent = {
    name: nameInput.value.trim(),
    studentId: idInput.value.trim(),
    email: emailInput.value.trim(),
    contact: contactInput.value.trim(),
  };

  const editIndex = parseInt(editingIndexInput.value, 10);

  if (editIndex >= 0) {
    updateStudent(editIndex, newStudent);
    submitBtn.textContent = 'Add Student';
    editingIndexInput.value = -1;
  } else {
    addStudent(newStudent);
  }

  form.reset();
});

form.addEventListener('reset', () => {
  setTimeout(() => {
    nameError.textContent = '';
    idError.textContent = '';
    emailError.textContent = '';
    contactError.textContent = '';
    editingIndexInput.value = -1;
    submitBtn.textContent = 'Add Student';
  }, 50);
});

studentsTbody.addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;

  const index = parseInt(btn.getAttribute('data-index'), 10);
  const action = btn.getAttribute('data-action');

  if (action === 'edit') {
    const s = students[index];
    nameInput.value = s.name;
    idInput.value = s.studentId;
    emailInput.value = s.email;
    contactInput.value = s.contact;
    editingIndexInput.value = index;
    submitBtn.textContent = 'Save Changes';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else if (action === 'delete') {
    deleteStudent(index);
  }
});

clearAllBtn.addEventListener('click', clearAll);

// -------------------- Initialize --------------------
function init() {
  loadFromStorage();
  renderTable();
}

init();
