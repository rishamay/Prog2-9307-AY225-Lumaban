function computeGrades() {

    const attendance = Number(document.getElementById("attendance").value);
    const lab1 = Number(document.getElementById("lab1").value);
    const lab2 = Number(document.getElementById("lab2").value);
    const lab3 = Number(document.getElementById("lab3").value);

    const labAverage = (lab1 + lab2 + lab3) / 3;
    const classStanding = (attendance * 0.40) + (labAverage * 0.60);

    const requiredPass =
        (75 - (classStanding * 0.30)) / 0.70;

    const requiredExcellent =
        (100 - (classStanding * 0.30)) / 0.70;

    let remarks = "";

    if (requiredPass > 100) {
        remarks = "Passing is not achievable this prelim period.";
    } else if (requiredPass <= 0) {
        remarks = "You have already passed based on your Class Standing.";
    } else {
        remarks = "You need a good Prelim Exam performance.";
    }

    document.getElementById("output").innerHTML = `
        <strong>Lab Work Average:</strong> ${labAverage.toFixed(2)}<br>
        <strong>Class Standing:</strong> ${classStanding.toFixed(2)}<br><br>

        <strong>Required Prelim Exam:</strong><br>
        To Pass (75): ${requiredPass.toFixed(2)}<br>
        To Excellent (100): ${requiredExcellent.toFixed(2)}<br><br>

        <strong>Remarks:</strong> ${remarks}
    `;
}
