/*
 * Programmer: Rishamay Lumaban
 * Student ID: 25-1407-939
 */

// Hardcoded CSV content (now uses Lab 1-3 instead of Email/Gender/City/Country)
const csvData = `ID,First Name,Last Name,Lab1,Lab2,Lab3,Grade
1,John,Doe,78,82,88,85
2,Jane,Smith,90,94,92,92
3,Bob,Johnson,70,75,72,72
4,Alice,Williams,85,88,90,88`;

let students = [];

// Parse CSV into objects
csvData.split('\n').slice(1).forEach(line => {
    const [id, firstName, lastName, lab1, lab2, lab3, grade] = line.split(',');
    students.push({ id, firstName, lastName, lab1, lab2, lab3, grade });
});

// Render table
function render() {
    const tbody = document.querySelector('#studentTable tbody');
    tbody.innerHTML = '';
    students.forEach((s, index) => {
        tbody.innerHTML += `
            <tr>
                <td>${s.id}</td>
                <td>${s.firstName}</td>
                <td>${s.lastName}</td>
                <td>${s.lab1}</td>
                <td>${s.lab2}</td>
                <td>${s.lab3}</td>
                <td>${s.grade}</td>
                <td><button onclick="deleteRecord(${index})">Delete</button></td>
            </tr>
        `;
    });
}

// Add new record
function addRecord() {
    const id = document.getElementById('id').value;
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const lab1 = document.getElementById('lab1').value;
    const lab2 = document.getElementById('lab2').value;
    const lab3 = document.getElementById('lab3').value;
    const grade = document.getElementById('grade').value;

    if (id && firstName && lastName && grade) {
        students.push({ id, firstName, lastName, lab1, lab2, lab3, grade });
        document.getElementById('recordForm').reset();
        render();
    } else {
        alert('Please fill all required fields!');
    }
}

// Delete record
function deleteRecord(index) {
    students.splice(index, 1);
    render();
}

// Initial render
render();
