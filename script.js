const gradePoints = {
    'A': 4.00,
    '-A': 3.75,
    '+B': 3.50,
    'B': 3.00,
    '-B': 2.75,
    '+C': 2.50,
    'C': 2.00,
    '-C': 1.75,
    '+D': 1.50,
    'D': 1.25,
    '-D': 1.00,
    'F': 0.50
};

const isFirstSemesterSelect = document.getElementById('isFirstSemester');
const previousDataSection = document.getElementById('previousDataSection');
const courseCountSelect = document.getElementById('courseCount');
const coursesContainer = document.getElementById('coursesContainer');
const calculateButton = document.getElementById('calculateButton');
const resetButton = document.getElementById('resetButton');
const resultSection = document.getElementById('resultSection');

let courses = [];

function updateCoursesUI() {
    const count = parseInt(courseCountSelect.value);
    coursesContainer.innerHTML = '';
    courses = [];

    for (let i = 1; i <= count; i++) {
        const courseDiv = document.createElement('div');
        courseDiv.classList.add('course');
        courseDiv.innerHTML = `
        <h3>
          <span class="course-name">المادة ${i}</span>
          <input type="text" class="course-name-input hidden" placeholder="أدخل اسم المادة">
        </h3>
        <label><i class="fas fa-tag"></i> رمز المادة:</label>
        <select class="course-code">
          <option value="أ">A</option>
          <option value="-A">-A</option>
          <option value="+B">+B</option>
          <option value="B">B</option>
          <option value="-B">-B</option>
          <option value="+C">+C</option>
          <option value="C">C</option>
          <option value="-C">-C</option>
          <option value="+D">+D</option>
          <option value="D">D</option>
          <option value="-D">-D</option>
          <option value="F">F</option>
        </select>
  
        <label><i class="fas fa-clock"></i> عدد الساعات:</label>
        <select class="course-hours">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3" selected>3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
         

        </select>
  
        <div class="repeated-course hidden">
          <label><i class="fas fa-redo-alt"></i> هل المادة معادة؟</label>
          <select class="course-repeated">
            <option value="no">لا</option>
            <option value="yes">نعم</option>
          </select>
  
          <div class="old-course hidden">
            <label><i class="fas fa-tag"></i> رمز المادة القديمة:</label>
            <select class="old-course-code">
              <option value="+C">+C</option>
              <option value="C">C</option>
              <option value="-C">-C</option>
              <option value="+D">+D</option>
              <option value="D">D</option>
              <option value="-D">-D</option>
              <option value="F">F</option>
            </select>
          </div>
        </div>
      `;
        coursesContainer.appendChild(courseDiv);

        const repeatedDiv = courseDiv.querySelector('.repeated-course');
        const repeatedSelect = courseDiv.querySelector('.course-repeated');
        const oldCourseDiv = courseDiv.querySelector('.old-course');

        repeatedSelect.addEventListener('change', () => {
            if (repeatedSelect.value === 'yes') {
                oldCourseDiv.classList.remove('hidden');
            } else {
                oldCourseDiv.classList.add('hidden');
            }
        });

        courses.push({
            name: courseDiv.querySelector('.course-name'), // تخزين اسم المادة
            code: courseDiv.querySelector('.course-code'),
            hours: courseDiv.querySelector('.course-hours'),
            repeated: repeatedSelect,
            oldCode: courseDiv.querySelector('.old-course-code')
        });
    }

    toggleRepeatedOptions();
    enableCourseNameEditing();
}

function toggleRepeatedOptions() {
    const isFirstSemester = isFirstSemesterSelect.value === 'yes';
    const repeatedDivs = document.querySelectorAll('.repeated-course');

    repeatedDivs.forEach(div => {
        if (isFirstSemester) {
            div.classList.add('hidden');
        } else {
            div.classList.remove('hidden');
        }
    });
}

function calculateGPA() {
  const isFirstSemester = isFirstSemesterSelect.value === 'yes';
  let previousGPA = parseFloat(document.getElementById('previousGPA').value) || 0;
  let previousHours = parseInt(document.getElementById('previousHours').value) || 0;

  if (isFirstSemester) {
      previousGPA = 0;
      previousHours = 0;
  } else {
      if (isNaN(previousGPA) || previousGPA < 0.5 || previousGPA > 4.0) {
          alert('يرجى إدخال معدل تراكمي صحيح بين 0.5 و 4.0.');
          return;
      }

      if (isNaN(previousHours) || previousHours <= 0) {
          alert('يرجى إدخال عدد ساعات منجزة صحيح أكبر من صفر.');
          return;
      }
  }

  let totalPoints = previousGPA * previousHours;
  let totalHours = previousHours;
  let semesterPoints = 0;
  let semesterHours = 0;

  const newCourses = [];

  for (const course of courses) {
      const hours = parseInt(course.hours.value);
      const grade = course.code.value;
      const repeated = course.repeated.value === 'yes';
      const oldCode = course.oldCode.value;
      const courseName = course.name.textContent;

      if (isNaN(hours) || hours <= 0) {
          alert('يرجى إدخال عدد ساعات صحيح لكل مادة.');
          return;
      }

      const gradeValue = gradePoints[grade];
      if (gradeValue === undefined) {
          alert('يرجى إدخال رمز مادة صحيح.');
          return;
      }

      if (repeated) {
          const oldGradeValue = gradePoints[oldCode];
          if (oldGradeValue === undefined) {
              alert('يرجى إدخال رمز مادة قديمة صحيح.');
              return;
          }

          // التحقق من أن ساعات المادة المعادة لا تتجاوز الساعات التراكمية القديمة
          if (hours > previousHours) {
              alert('ساعات المادة المعادة يجب أن تكون أقل من أو تساوي الساعات التراكمية القديمة.');
              return;
          }

          if (gradeValue > oldGradeValue) {
              totalPoints -= oldGradeValue * hours;
              totalPoints += gradeValue * hours;
              totalHours += 0;
              semesterPoints += gradeValue * hours;
              semesterHours += hours;
          }
      } else {
          totalPoints += gradeValue * hours;
          totalHours += hours;
          semesterPoints += gradeValue * hours;
          semesterHours += hours;
      }

      newCourses.push({
          name: courseName,
          code: grade,
          hours: hours,
          gradeValue: gradeValue,
          oldCode: repeated ? oldCode : ''
      });
  }

  const newGPA = totalPoints / totalHours;
  const semesterGPA = semesterPoints / semesterHours;

  if (newGPA < 0.50 || newGPA > 4.00) {
      alert('حدث خطأ في الحساب. يرجى التأكد من صحة البيانات المدخلة.');
      return;
  }

  displayResult(newGPA, totalHours, newCourses, previousGPA, previousHours, semesterGPA, semesterHours);
  resetButton.classList.remove('hidden');
}


function displayResult(newGPA, totalHours, newCourses, previousGPA, previousHours, semesterGPA, semesterHours) {
    const isFirstSemester = isFirstSemesterSelect.value === 'yes'; // تحقق مما إذا كان الفصل الأول
    const gpaCategory = getGPACategory(newGPA);

    // فحص وجود مواد معادة
    const hasRepeatedCourses = newCourses.some(course => course.oldCode !== '');

    let resultHTML = `
    <h2>نتائج الحساب</h2>
    <p><strong>المعدل التراكمي الجديد:</strong> <span class="gpa-value">${newGPA.toFixed(2)}</span></p>
    <p><strong>التقدير:</strong> <span class="category">${gpaCategory}</span></p>
    <p><strong>الساعات التراكمية:</strong> ${totalHours}</p>
    <table>
      <thead>
        <tr>
          <th>اسم المادة</th>
          <th>رمز المادة</th>
          ${hasRepeatedCourses ? '<th>رمز المادة القديمة</th>' : ''}
          <th> الساعات</th>
          <th>علامة المادة</th>
        </tr>
      </thead>
      <tbody>
  `;

    newCourses.forEach(course => {
        resultHTML += `
      <tr>
        <td>${course.name}</td>
        <td>${course.code}</td>
        ${hasRepeatedCourses ? `<td>${course.oldCode || '-'}</td>` : ''}
        <td>${course.hours}</td>
        <td>${course.gradeValue.toFixed(2)}</td>
      </tr>
    `;
    });

    resultHTML += `
      </tbody>
    </table>
  `;

    // إخفاء المعدل التراكمي القديم والساعات التراكمية القديمة إذا كان الفصل الأول
    if (!isFirstSemester) {
        resultHTML += `
      <table>
        <thead>
          <tr>
            <th>المعدل التراكمي القديم</th>
            <th> الساعات التراكمية القديمة</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${previousGPA.toFixed(2)}</td>
            <td>${previousHours}</td>
          </tr>
        </tbody>
      </table>
    `;
    }

  

    // إخفاء المعدل الفصلي والساعات الفصلية إذا كان الفصل الأول
    if (!isFirstSemester) {
        resultHTML += `
      <table>
        <thead>
          <tr>
            <th>المعدل الفصلي</th>
            <th> الساعات الفصلية</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${semesterGPA.toFixed(2)}</td>
            <td>${semesterHours}</td>
          </tr>
        </tbody>
      </table>
    `;
    }

    function adjustForScreenSize() {
      const screenWidth = window.innerWidth;
      const resultSection = document.getElementById('resultSection');
  
      if (resultSection) {
          if (screenWidth < 600) {
              resultSection.style.fontSize = '8px';
          } else if (screenWidth < 900) {
              resultSection.style.fontSize = '10px';
          } else {
              resultSection.style.fontSize = '12px';
          }
      }
  }
  
  // استدعاء الدالة عند تحميل الصفحة وتغيير حجم النافذة
  window.addEventListener('load', adjustForScreenSize);
  window.addEventListener('resize', adjustForScreenSize);

    resultSection.innerHTML = resultHTML;
    resultSection.classList.remove('hidden');
}



function getGPACategory(gpa) {
    if (gpa >= 3.65 && gpa <= 4.00) return 'امتياز';
    if (gpa >= 3.00 && gpa <= 3.64) return 'جيد جداً';
    if (gpa >= 2.50 && gpa <= 2.99) return 'جيد';
    if (gpa >= 2.00 && gpa <= 2.49) return 'مقبول';
    if (gpa >= 0.50 && gpa <= 1.99) return 'ضعيف';
}


function resetForm() {
    isFirstSemesterSelect.value = 'yes';
    previousDataSection.classList.add('hidden');
    document.getElementById('previousGPA').value = '';
    document.getElementById('previousHours').value = '';
    courseCountSelect.value = '4';
    updateCoursesUI();
    resultSection.classList.add('hidden');
    resetButton.classList.add('hidden');
}

function enableCourseNameEditing() {
    const courseNames = document.querySelectorAll('.course-name');

    courseNames.forEach(courseName => {
        courseName.addEventListener('click', () => {
            const courseNameInput = courseName.nextElementSibling;
            courseName.classList.add('hidden');
            courseNameInput.classList.remove('hidden');
            courseNameInput.focus();

            courseNameInput.addEventListener('blur', () => {
                if (courseNameInput.value.trim() !== '') {
                    courseName.textContent = courseNameInput.value;
                }
                courseName.classList.remove('hidden');
                courseNameInput.classList.add('hidden');
            });

            courseNameInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    if (courseNameInput.value.trim() !== '') {
                        courseName.textContent = courseNameInput.value;
                    }
                    courseName.classList.remove('hidden');
                    courseNameInput.classList.add('hidden');
                }
            });
        });
    });
}


// معالجة الأحداث
isFirstSemesterSelect.addEventListener('change', () => {
    if (isFirstSemesterSelect.value === 'yes') {
        previousDataSection.classList.add('hidden');
    } else {
        previousDataSection.classList.remove('hidden');
    }
    toggleRepeatedOptions();
});

courseCountSelect.addEventListener('change', updateCoursesUI);

calculateButton.addEventListener('click', calculateGPA);
resetButton.addEventListener('click', resetForm);

updateCoursesUI();
