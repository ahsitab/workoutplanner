// Default data - Updated to match the provided detailed routine
const defaultData = {
    "Monday": [
        { time: "Morning", exercise: "Treadmill 10 min / Walk 10 min", setsReps: "-", meals: "2 eggs + 1 roti + lemon water" },
        { time: "Gym", exercise: "Push-Ups", setsReps: "3×12", meals: "Lunch: 150g rice + chicken + vegetables" },
        { time: "Gym", exercise: "Dumbbell Bench Press", setsReps: "3×10", meals: "Evening: 1 egg + 1 banana + green tea" },
        { time: "Gym", exercise: "Dumbbell Fly", setsReps: "3×12", meals: "Dinner: 100g rice + fish + vegetables" },
        { time: "Gym", exercise: "Tricep Dips", setsReps: "3×12", meals: "" }
    ],
    "Tuesday": [
        { time: "Morning", exercise: "Treadmill 10 min / Cycle 10 min", setsReps: "-", meals: "2 eggs + 1 roti + lemon water" },
        { time: "Gym", exercise: "Lat Pulldown / Pull-Ups", setsReps: "3×10", meals: "Lunch: 150g rice + fish + vegetables" },
        { time: "Gym", exercise: "Seated Row", setsReps: "3×10", meals: "Evening: 1 egg + 1 banana + green tea" },
        { time: "Gym", exercise: "Dumbbell Curl", setsReps: "3×12", meals: "Dinner: 100g rice + fish + vegetables" },
        { time: "Gym", exercise: "Hammer Curl", setsReps: "3×12", meals: "" }
    ],
    "Wednesday": [
        { time: "Morning", exercise: "Walk / Treadmill 10 min", setsReps: "-", meals: "2 eggs + 1 roti + lemon water" },
        { time: "Gym", exercise: "Squat", setsReps: "3×12", meals: "Lunch: 150g rice + lentils + vegetables" },
        { time: "Gym", exercise: "Lunges", setsReps: "3×12", meals: "Evening: 1 egg + 1 banana + green tea" },
        { time: "Gym", exercise: "Leg Press", setsReps: "3×12", meals: "Dinner: 100g rice + fish/chicken + vegetables" },
        { time: "Gym", exercise: "Plank", setsReps: "3×30 sec", meals: "" },
        { time: "Gym", exercise: "Leg Raise", setsReps: "3×12", meals: "" }
    ],
    "Thursday": [
        { time: "Morning", exercise: "Treadmill / Walk 10 min", setsReps: "-", meals: "2 eggs + 1 roti + lemon water" },
        { time: "Gym", exercise: "Shoulder Press", setsReps: "3×10", meals: "Lunch: 150g rice + chicken + vegetables" },
        { time: "Gym", exercise: "Lateral Raise", setsReps: "3×12", meals: "Evening: 1 egg + 1 banana + green tea" },
        { time: "Gym", exercise: "Front Raise", setsReps: "3×12", meals: "Dinner: 100g rice + fish/chicken + vegetables" },
        { time: "Gym", exercise: "Russian Twist", setsReps: "3×20", meals: "" }
    ],
    "Friday": [
        { time: "Morning", exercise: "Treadmill / Brisk Walk 10 min", setsReps: "-", meals: "2 eggs + 1 roti + lemon water" },
        { time: "Gym", exercise: "Push-Ups", setsReps: "2×12", meals: "Lunch: 150g rice + chicken/fish + vegetables" },
        { time: "Gym", exercise: "Squat", setsReps: "2×12", meals: "Evening: 1 egg + 1 banana + green tea" },
        { time: "Gym", exercise: "Plank", setsReps: "2×30 sec", meals: "Dinner: 100g rice + fish/chicken + vegetables" },
        { time: "Gym", exercise: "Dumbbell Curl", setsReps: "2×12", meals: "" },
        { time: "Gym", exercise: "Mountain Climber", setsReps: "2×20", meals: "" }
    ],
    "Saturday": [
        { time: "Morning", exercise: "Treadmill / Walk 15–20 min", setsReps: "-", meals: "2 eggs + 1 roti + lemon water" },
        { time: "Morning", exercise: "Light Stretching", setsReps: "-", meals: "Lunch: 150g rice + lentils/chicken + vegetables" },
        { time: "Morning", exercise: "Plank (optional)", setsReps: "2×30 sec", meals: "Evening: 1 egg + 1 banana + green tea" },
        { time: "", exercise: "-", setsReps: "-", meals: "Dinner: 100g rice + fish/chicken + vegetables" }
    ],
    "Sunday": [
        { time: "Day", exercise: "Rest + Light Stretching", setsReps: "-", meals: "All meals same as other days + plenty of water" }
    ]
};

// Load data from localStorage or use default
let workoutData = JSON.parse(localStorage.getItem('workoutData')) || { ...defaultData };

// DOM elements
const landingPage = document.getElementById('landing-page');
const detailPage = document.getElementById('detail-page');
const dayButtons = document.querySelectorAll('.day-btn');
const backBtn = document.getElementById('back-btn');
const dayTitle = document.getElementById('day-title');
const workoutDetails = document.getElementById('workout-details');

const exportBtn = document.getElementById('export-pdf');
const themeToggle = document.getElementById('theme-toggle');
const progressFill = document.getElementById('progress-fill');
const completedCount = document.getElementById('completed-count');
const totalCount = document.getElementById('total-count');

// Form elements (assuming they exist in HTML)
const form = document.getElementById('workout-form'); // Add this ID to the form in HTML
const daySelect = document.getElementById('day-select');
const timeInput = document.getElementById('time-input');
const exerciseInput = document.getElementById('exercise-input');
const setsRepsInput = document.getElementById('sets-reps-input');
const mealsInput = document.getElementById('meals-input');
const addBtn = document.getElementById('add-btn');
const editBtn = document.getElementById('edit-btn');
const deleteBtn = document.getElementById('delete-btn');
const cancelBtn = document.getElementById('cancel-btn');

// Current editing day
let currentDay = null;
let editingDay = null;
let editingIndex = null;
let editingType = null; // 'exercise' or 'meal'

// Theme management
let currentTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', currentTheme);

// Progress tracking
let completedEntries = JSON.parse(localStorage.getItem('completedEntries')) || {};

// Save to localStorage
function saveData() {
    localStorage.setItem('workoutData', JSON.stringify(workoutData));
}

// Export to PDF
exportBtn.addEventListener('click', () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Create a styled HTML element for PDF
    const pdfContainer = document.createElement('div');
    pdfContainer.style.cssText = `
        font-family: 'Roboto', Arial, sans-serif;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 20px;
        min-height: 100vh;
        color: #333;
    `;

    // Add header
    const header = document.createElement('div');
    header.style.cssText = `
        text-align: center;
        margin-bottom: 30px;
        background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
        color: white;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    `;
    header.innerHTML = `
        <h1 style="margin: 0; font-size: 2.5em; font-weight: 700; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">
            Weekly Workout Planner
        </h1>
        <p style="margin: 10px 0 0 0; font-size: 1.2em; opacity: 0.9;">
            Generated on ${new Date().toLocaleDateString()}
        </p>
    `;
    pdfContainer.appendChild(header);

    // Add workout cards
    const cardsContainer = document.createElement('div');
    cardsContainer.style.cssText = `
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 15px;
    `;

    for (const [day, data] of Object.entries(workoutData)) {
        const card = document.createElement('div');
        card.style.cssText = `
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            border-radius: 8px;
            padding: 15px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.1);
            position: relative;
            overflow: hidden;
            page-break-inside: avoid;
        `;

        // Add colored top border
        const topBorder = document.createElement('div');
        topBorder.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        `;
        card.appendChild(topBorder);

        let workoutList = '';
        if (Array.isArray(data)) {
            data.forEach((entry, index) => {
                workoutList += `
                    <div class="workout-entry" style="margin-bottom: 8px; padding-bottom: 8px; border-bottom: 1px solid #eee;">
                        <p style="margin: 3px 0; font-size: 0.8em; color: #555;"><strong>Time:</strong> ${entry.time || 'N/A'}</p>
                        <p style="margin: 3px 0; font-size: 0.8em; color: #555;"><strong>Exercise:</strong> ${entry.exercise || 'N/A'}</p>
                        <p style="margin: 3px 0; font-size: 0.8em; color: #555;"><strong>Sets × Reps:</strong> ${entry.setsReps || 'N/A'}</p>
                        <p style="margin: 3px 0; font-size: 0.8em; color: #555;"><strong>Meals:</strong> ${entry.meals || 'N/A'}</p>
                    </div>
                `;
            });
        } else {
            workoutList = `
                <p style="margin: 3px 0; font-size: 0.8em; color: #555;"><strong>Time:</strong> ${data.time || 'N/A'}</p>
                <p style="margin: 3px 0; font-size: 0.8em; color: #555;"><strong>Exercise:</strong> ${data.exercise || 'N/A'}</p>
                <p style="margin: 3px 0; font-size: 0.8em; color: #555;"><strong>Sets × Reps:</strong> ${data.setsReps || 'N/A'}</p>
                <p style="margin: 3px 0; font-size: 0.8em; color: #555;"><strong>Meals:</strong> ${data.meals || 'N/A'}</p>
            `;
        }

        card.innerHTML += `
            <h3 style="margin: 0 0 10px 0; color: #333; font-weight: 600; font-size: 1.2em;">${day}</h3>
            ${workoutList}
        `;
        cardsContainer.appendChild(card);
    }

    pdfContainer.appendChild(cardsContainer);

    // Add footer
    const footer = document.createElement('div');
    footer.style.cssText = `
        text-align: center;
        margin-top: 30px;
        padding: 15px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        font-size: 0.8em;
        color: rgba(255, 255, 255, 0.8);
    `;
    footer.innerHTML = `
        <p>Stay fit and healthy! 💪</p>
        <p>Generated by Weekly Workout Planner</p>
    `;
    pdfContainer.appendChild(footer);

    // Temporarily add to DOM for html2canvas
    document.body.appendChild(pdfContainer);

    html2canvas(pdfContainer, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#667eea'
    }).then(canvas => {
        document.body.removeChild(pdfContainer);

        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 295; // A4 height in mm
        const imgHeight = canvas.height * imgWidth / canvas.width;
        let heightLeft = imgHeight;

        let position = 0;

        doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            doc.addPage();
            doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        doc.save('weekly-workout-plan.pdf');
    });
});

// Page navigation functions
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.style.display = 'none';
    });
    document.getElementById(pageId).style.display = 'block';
}

// Show day details
function showDayDetails(day) {
    currentDay = day;
    dayTitle.textContent = day;
    daySelect.value = day; // Set the day in the form

    const exercisesContainer = document.getElementById('workout-exercises');
    const mealsContainer = document.getElementById('workout-meals');
    exercisesContainer.innerHTML = '';
    mealsContainer.innerHTML = '';

    // Group meals by category
    const mealCategories = {
        Breakfast: [],
        Lunch: [],
        Dinner: [],
        Snacks: []
    };

    const data = workoutData[day];
    if (Array.isArray(data)) {
        data.forEach((entry, index) => {
            // Check if it's an exercise or meal based on content
            const isExercise = entry.exercise && entry.exercise !== '-' && entry.exercise !== 'N/A';
            const isMeal = entry.meals && entry.meals !== '' && entry.meals !== 'N/A';

            if (isExercise) {
                const entryDiv = document.createElement('div');
                entryDiv.className = 'workout-entry';
                const entryKey = `${day}-${index}`;
                const isCompleted = completedEntries[entryKey];
                if (isCompleted) entryDiv.classList.add('completed');

                entryDiv.innerHTML = `
                    <input type="checkbox" class="checklist-checkbox" data-entry="${entryKey}" ${isCompleted ? 'checked' : ''}>
                    <h4>${entry.time || 'N/A'}</h4>
                    <p><strong>Exercise:</strong> ${entry.exercise || 'N/A'}</p>
                    <p><strong>Sets × Reps:</strong> ${entry.setsReps || 'N/A'}</p>
                    <div class="actions">
                        <button class="action-btn edit-entry-btn" data-index="${index}">Edit</button>
                        <button class="action-btn delete-entry-btn" data-index="${index}">Delete</button>
                    </div>
                `;
                exercisesContainer.appendChild(entryDiv);
            }

            if (isMeal) {
                let category = 'Snacks'; // Default
                if (entry.time === 'Lunch' || entry.meals.includes('Lunch:')) {
                    category = 'Lunch';
                } else if (entry.time === 'Dinner' || entry.meals.includes('Dinner:')) {
                    category = 'Dinner';
                } else if (entry.time === 'Morning' || entry.time === 'Breakfast' || entry.meals.includes('Breakfast:')) {
                    category = 'Breakfast';
                }
                mealCategories[category].push({ entry, index });
            }
        });
    } else {
        // Handle single entry (for backward compatibility)
        const isExercise = data.exercise && data.exercise !== '-' && data.exercise !== 'N/A';
        const isMeal = data.meals && data.meals !== '' && data.meals !== 'N/A';

        if (isExercise) {
            const entryDiv = document.createElement('div');
            entryDiv.className = 'workout-entry';
            const entryKey = `${day}-0`;
            const isCompleted = completedEntries[entryKey];
            if (isCompleted) entryDiv.classList.add('completed');

            entryDiv.innerHTML = `
                <input type="checkbox" class="checklist-checkbox" data-entry="${entryKey}" ${isCompleted ? 'checked' : ''}>
                <h4>${data.time || 'N/A'}</h4>
                <p><strong>Exercise:</strong> ${data.exercise || 'N/A'}</p>
                <p><strong>Sets × Reps:</strong> ${data.setsReps || 'N/A'}</p>
                <div class="actions">
                    <button class="action-btn edit-entry-btn" data-index="0">Edit</button>
                    <button class="action-btn delete-entry-btn" data-index="0">Delete</button>
                </div>
            `;
            exercisesContainer.appendChild(entryDiv);
        }

        if (isMeal) {
            let category = 'Snacks'; // Default
            if (data.meals.includes('Lunch:')) {
                category = 'Lunch';
            } else if (data.meals.includes('Dinner:')) {
                category = 'Dinner';
            } else if (data.time === 'Morning') {
                category = 'Breakfast';
            }
            mealCategories[category].push({ entry: data, index: 0 });
        }
    }

    // Render meals by category
    for (const [category, meals] of Object.entries(mealCategories)) {
        if (meals.length > 0) {
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'meal-category';
            categoryDiv.innerHTML = `<h4>${category}</h4>`;
            meals.forEach(({ entry, index }) => {
                const entryDiv = document.createElement('div');
                entryDiv.className = 'workout-entry';
                const entryKey = `${day}-${index}`;
                const isCompleted = completedEntries[entryKey];
                if (isCompleted) entryDiv.classList.add('completed');

                entryDiv.innerHTML = `
                    <input type="checkbox" class="checklist-checkbox" data-entry="${entryKey}" ${isCompleted ? 'checked' : ''}>
                    <p><strong>Meals:</strong> ${entry.meals || 'N/A'}</p>
                    <div class="actions">
                        <button class="action-btn edit-entry-btn" data-index="${index}">Edit</button>
                        <button class="action-btn delete-entry-btn" data-index="${index}">Delete</button>
                    </div>
                `;
                categoryDiv.appendChild(entryDiv);
            });
            mealsContainer.appendChild(categoryDiv);
        }
    }

    updateProgress();
    showPage('detail-page');
}

// Event listeners
dayButtons.forEach(button => {
    button.addEventListener('click', () => {
        const day = button.dataset.day;
        showDayDetails(day);
    });
});

backBtn.addEventListener('click', () => {
    showPage('landing-page');
});

// Handle add buttons for exercises and meals
document.addEventListener('click', (e) => {
    if (e.target.id === 'add-exercise-btn') {
        const exerciseForm = document.getElementById('exercise-form');
        exerciseForm.style.display = exerciseForm.style.display === 'none' ? 'block' : 'none';
    } else if (e.target.id === 'add-meal-btn') {
        const mealForm = document.getElementById('meal-form');
        mealForm.style.display = mealForm.style.display === 'none' ? 'block' : 'none';
    } else if (e.target.classList.contains('cancel-btn')) {
        // Hide the form when cancel is clicked
        const form = e.target.closest('.inline-form');
        if (form) {
            form.style.display = 'none';
        }
    }
});

// Handle inline form submissions
document.addEventListener('submit', (e) => {
    if (e.target.classList.contains('inline-form')) {
        e.preventDefault();
        const form = e.target;
        const isExerciseForm = form.querySelector('#exercise-name') !== null;

        if (isExerciseForm) {
            const time = document.getElementById('exercise-time').value.trim();
            const exercise = document.getElementById('exercise-name').value.trim();
            const setsReps = document.getElementById('exercise-sets').value.trim();

            if (exercise) {
                const newEntry = { time, exercise, setsReps, meals: '' };
                if (!workoutData[currentDay]) {
                    workoutData[currentDay] = [];
                }
                if (Array.isArray(workoutData[currentDay])) {
                    workoutData[currentDay].push(newEntry);
                } else {
                    workoutData[currentDay] = [workoutData[currentDay], newEntry];
                }
                saveData();
                showDayDetails(currentDay);
                form.reset();
                form.style.display = 'none';
            }
        } else {
            const time = document.getElementById('meal-time').value.trim();
            const meals = document.getElementById('meal-name').value.trim();

            if (meals) {
                const newEntry = { time, exercise: '', setsReps: '', meals };
                if (!workoutData[currentDay]) {
                    workoutData[currentDay] = [];
                }
                if (Array.isArray(workoutData[currentDay])) {
                    workoutData[currentDay].push(newEntry);
                } else {
                    workoutData[currentDay] = [workoutData[currentDay], newEntry];
                }
                saveData();
                showDayDetails(currentDay);
                form.reset();
                form.style.display = 'none';
            }
        }
    }
});

// Handle edit and delete for individual entries
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('edit-entry-btn')) {
        const index = parseInt(e.target.dataset.index);
        const data = Array.isArray(workoutData[currentDay]) ? workoutData[currentDay][index] : workoutData[currentDay];
        daySelect.value = currentDay;
        timeInput.value = data.time || '';
        exerciseInput.value = data.exercise || '';
        setsRepsInput.value = data.setsReps || '';
        mealsInput.value = data.meals || '';
        editingDay = currentDay;
        editingIndex = index;
        editingType = data.exercise ? 'exercise' : 'meal';
        toggleEditMode(true);
        // Show form section
        document.getElementById('form-section').style.display = 'block';
        document.getElementById('form-title').textContent = 'Edit Workout Entry';
        // Scroll to form section
        document.getElementById('form-section').scrollIntoView({ behavior: 'smooth' });
    } else if (e.target.classList.contains('delete-entry-btn')) {
        const index = parseInt(e.target.dataset.index);
        if (confirm(`Delete this workout entry?`)) {
            if (Array.isArray(workoutData[currentDay])) {
                workoutData[currentDay].splice(index, 1);
            } else {
                delete workoutData[currentDay];
            }
            saveData();
            showDayDetails(currentDay);
        }
    }
});

// Update form submission to handle arrays
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const day = daySelect.value;
    const time = timeInput.value.trim();
    const exercise = exerciseInput.value.trim();
    const setsReps = setsRepsInput.value.trim();
    const meals = mealsInput.value.trim();

    const newEntry = { time, exercise, setsReps, meals };

    if (editingDay) {
        if (Array.isArray(workoutData[editingDay])) {
            if (editingIndex !== null) {
                workoutData[editingDay][editingIndex] = newEntry;
            } else {
                workoutData[editingDay].push(newEntry);
            }
        } else {
            workoutData[editingDay] = [newEntry];
        }
        editingDay = null;
        editingIndex = null;
        editingType = null;
        document.getElementById('form-section').style.display = 'none';
        document.getElementById('form-title').textContent = 'Add/Edit Workout Entry';
        showDayDetails(day);
    } else {
        if (!workoutData[day]) {
            workoutData[day] = [];
        }
        if (Array.isArray(workoutData[day])) {
            workoutData[day].push(newEntry);
        } else {
            workoutData[day] = [workoutData[day], newEntry];
        }
        saveData();
        showDayDetails(day);
    }

    form.reset();
});

// Toggle edit mode
function toggleEditMode(isEditing) {
    if (isEditing) {
        addBtn.style.display = 'none';
        editBtn.style.display = 'inline-block';
        deleteBtn.style.display = 'inline-block';
    } else {
        addBtn.style.display = 'inline-block';
        editBtn.style.display = 'none';
        deleteBtn.style.display = 'none';
    }
}

// Handle cancel button
cancelBtn.addEventListener('click', () => {
    editingDay = null;
    editingIndex = null;
    editingType = null;
    document.getElementById('form-section').style.display = 'none';
    document.getElementById('form-title').textContent = 'Add/Edit Workout Entry';
    form.reset();
    toggleEditMode(false);
});

// Theme toggle
themeToggle.addEventListener('click', () => {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
});

// Checklist functionality
document.addEventListener('change', (e) => {
    if (e.target.classList.contains('checklist-checkbox')) {
        const entryKey = e.target.dataset.entry;
        completedEntries[entryKey] = e.target.checked;
        localStorage.setItem('completedEntries', JSON.stringify(completedEntries));
        updateProgress();
        // Update visual feedback
        const entryDiv = e.target.closest('.workout-entry');
        if (e.target.checked) {
            entryDiv.classList.add('completed');
        } else {
            entryDiv.classList.remove('completed');
        }
    }
});

// Update progress bar and counts
function updateProgress() {
    let totalEntries = 0;
    let completed = 0;

    for (const day in workoutData) {
        const data = workoutData[day];
        if (Array.isArray(data)) {
            data.forEach((entry, index) => {
                if (entry.exercise && entry.exercise !== '-' && entry.exercise !== 'N/A') {
                    totalEntries++;
                    if (completedEntries[`${day}-${index}`]) completed++;
                }
                if (entry.meals && entry.meals !== '' && entry.meals !== 'N/A') {
                    totalEntries++;
                    if (completedEntries[`${day}-${index}`]) completed++;
                }
            });
        } else {
            if (data.exercise && data.exercise !== '-' && data.exercise !== 'N/A') {
                totalEntries++;
                if (completedEntries[`${day}-0`]) completed++;
            }
            if (data.meals && data.meals !== '' && data.meals !== 'N/A') {
                totalEntries++;
                if (completedEntries[`${day}-0`]) completed++;
            }
        }
    }

    const progressPercentage = totalEntries > 0 ? (completed / totalEntries) * 100 : 0;
    progressFill.style.width = `${progressPercentage}%`;
    completedCount.textContent = completed;
    totalCount.textContent = totalEntries;
}

// Initial setup
showPage('landing-page');
updateProgress();
