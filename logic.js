// Predefined subject sets
const subjectList = {
    arts: [
        { name: "ISLAMIYAT (COMPULSORY)", max: 100 },
        { name: "URDU", max: 75 },
        { name: "ENGLISH", max: 75 },
        { name: "GENERAL MATHEMATICS", max: 75 },
        { name: "GENERAL SCIENCE", max: 75 },
        { name: "HEALTH AND PHYSICAL EDUCATION", max: 60 },
        { name: "-", max: 0 },
        { name: "FOOD AND NUTRITION", max: 60 },
        { name: "TRANSLATION OF THE HOLY QURAN", max: 50 }
    ],
    science: [
        { name: "ISLAMIYAT (COMPULSORY)", max: 100 },
        { name: "URDU", max: 75 },
        { name: "ENGLISH", max: 75 },
        { name: "MATHEMATICS", max: 75 },
        { name: "PHYSICS", max: 75 },
        { name: "CHEMISTRY", max: 75 },
        { name: "-", max: 0 },
        { name: "COMPUTER SCIENCE", max: 75 },
        { name: "TRANSLATION OF THE HOLY QURAN", max: 50 }
    ]
};

// Dummy student object (will be overwritten from form)
let student = {
    rollNo: "",
    registrationNo: "",
    name: "",
    fatherName: "",
    institution: "",
    examName: "",
    subjects: []
};

// Function to calculate grade
function getGrade(percent) {
    if (percent >= 80) return "A+";
    if (percent >= 70) return "A";
    if (percent >= 60) return "B";
    if (percent >= 50) return "C";
    if (percent >= 40) return "D";
    return "F";
}

let subjectsContainer = document.getElementById("subjectsContainer");
let streamSelect = document.getElementById("streamSelect");

function renderSubjects(stream) {
    subjectsContainer.innerHTML = `<h3>Subjects & Marks</h3>`;
    subjectList[stream].forEach((subj, index) => {
        if( subj.name === "-") return; // Skip placeholder subjects
        subjectsContainer.innerHTML += `
          <label style="display: block; margin-top: 10px; font-size: 11px;">${subj.name} (Max: ${subj.max})</label>
          <input type="number" name="subject_${index}" max="${subj.max}" placeholder="Obtained Marks">
        `;
    });
}

// Initial load
document.addEventListener('DOMContentLoaded', function() {
    // Re-query in case this script is shared across pages
    subjectsContainer = document.getElementById('subjectsContainer');
    streamSelect = document.getElementById('streamSelect');

    // Only render subjects on the form page
    if (subjectsContainer) {
        renderSubjects('arts');
    }
    
    // Add form submit handler
    const form = document.getElementById('studentForm');
    if (form) {
        form.addEventListener('submit', buildStudentFromForm);
    }
    
    // Handle stream change if selector exists
    if (streamSelect) {
        streamSelect.addEventListener('change', e => {
            renderSubjects(e.target.value);
        });
    }
    
    // If we're on the result card page, render the result
    if (document.getElementById('tblMain')) {
        const savedResult = localStorage.getItem('studentResult');
        if (savedResult) {
            student = JSON.parse(savedResult);
            renderResult();
        }
    }
});

// Populate student object from form
function buildStudentFromForm(event) {
    event.preventDefault();
    
    const form = event.target;
    const stream = form.querySelector('select[name="stream"]').value;
    
    const subjects = subjectList[stream].map((subject, index) => {
        const input = form.querySelector(`input[name="subject_${index}"]`);
        const obtained = input ? input.value : "";
        return {
            name: subject.name,
            max: subject.max,
            obtained: obtained === "" ? "-" : parseInt(obtained)
        };
    });

    student = {
        rollNo: form.querySelector('input[name="rollNo"]').value,
        registrationNo: form.querySelector('input[name="registrationNo"]').value,
        name: form.querySelector('input[name="name"]').value,
        fatherName: form.querySelector('input[name="fatherName"]').value,
        institution: form.querySelector('input[name="institution"]').value,
        examName: form.querySelector('input[name="examName"]').value,
        stream: stream,
        subjects: subjects
    };

    // Save student data to localStorage
    localStorage.setItem('studentResult', JSON.stringify(student));
    
    // Open result card in a new tab
    window.open('resultCard.html', '_blank');
}

// Render result table
function renderResult() {
    // Fill top info
    document.getElementById("LblExamName").innerText = student.examName;
    document.getElementById("LblRollNo").innerText = student.rollNo;
    document.getElementById("lblRegistrationNo").innerText = student.registrationNo;
    document.getElementById("LblName").innerText = student.name;
    document.getElementById("LblFatherName").innerText = student.fatherName;
    document.getElementById("LblDistrictInstitution").innerText = student.institution;

    // Fill subjects
    let totalMax = 0, totalObtained = 0;
    student.subjects.forEach((subj, index) => {
        const i = index + 1;
        let percent, grade;
        if (subj.obtained === "-") {
            percent = "-";
            grade = "-";
        } else {
            percent = ((subj.obtained / subj.max) * 100).toFixed(2);
            grade = getGrade(percent);
            totalMax += subj.max;
            totalObtained += subj.obtained;
        }
        document.getElementById("LblPaper" + i).innerText = subj.name;
        document.getElementById("LblMaxMarks" + i).innerText = subj.max;
        document.getElementById("LblMarks" + i).innerText = subj.obtained;
        document.getElementById("LblPMarks" + i).innerText = percent;
        document.getElementById("LblPGrade" + i).innerText = grade;
    });

    // Overall
    const overallPercent = totalMax > 0 ? ((totalObtained / totalMax) * 100).toFixed(2) : 0;
    const overallGrade = getGrade(overallPercent);
    document.getElementById("lblGazres").innerText = `${totalObtained}/ ${overallGrade}`;
}

