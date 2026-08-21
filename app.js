const SUPABASE_URL = "https://wdiiftvtmtvsokdgyqmr.supabase.co";
const SUPABASE_KEY = "sb_publishable_RphPgkyVKZkZeIgklmt8hQ__W3aGPiX";

const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_KEY);

const classes = [
  "Play",
  "Nursery",
  "Class One",
  "Class Two",
  "Class Three",
  "Class Four",
  "Class Five",
  "Class Six",
  "Class Seven",
  "Class Eight"
];

const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (m) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[m]));

function toast(text) {
  const x = document.getElementById("toast");
  if (!x) return;

  x.textContent = text;
  x.style.display = "block";

  clearTimeout(window.__toastTimer);

  window.__toastTimer = setTimeout(() => {
    x.style.display = "none";
  }, 2500);
}

const classAlias = {
  play: "Play",
  nursery: "Nursery",
  one: "Class One",
  two: "Class Two",
  three: "Class Three",
  four: "Class Four",
  five: "Class Five",
  six: "Class Six",
  seven: "Class Seven",
  eight: "Class Eight",

  "class one": "Class One",
  "class two": "Class Two",
  "class three": "Class Three",
  "class four": "Class Four",
  "class five": "Class Five",
  "class six": "Class Six",
  "class seven": "Class Seven",
  "class eight": "Class Eight"
};

function normalizeClass(value) {
  const raw = String(value || "").trim().toLowerCase();
  return classAlias[raw] || String(value || "").trim();
}


/* =========================
   CLASS STUDENT MODAL
========================= */

function createStudentModal() {
  if (document.getElementById("studentClassModal")) return;

  const style = document.createElement("style");

  style.textContent = `
    #studentClassModal{
      display:none;
      position:fixed;
      inset:0;
      z-index:9999;
      background:rgba(5,25,45,.72);
      padding:20px;
      align-items:center;
      justify-content:center;
    }

    #studentClassModal .modalBox{
      width:min(1000px,100%);
      max-height:90vh;
      overflow:auto;
      background:#fff;
      border-radius:22px;
      padding:24px;
      box-shadow:0 25px 70px rgba(0,0,0,.25);
    }

    #studentClassModal .modalHead{
      display:flex;
      align-items:flex-start;
      justify-content:space-between;
      gap:15px;
      margin-bottom:20px;
    }

    #studentClassModal h2{
      margin:0;
    }

    #studentClassModal .closeBtn{
      border:0;
      width:40px;
      height:40px;
      border-radius:10px;
      background:#fee2e2;
      color:#d82732;
      font-size:24px;
      cursor:pointer;
    }

    #studentClassModal .countText{
      color:#617085;
      margin-top:5px;
    }

    #studentClassModal .studentTableWrap{
      overflow:auto;
      border:1px solid #e3edf5;
      border-radius:15px;
    }

    #studentClassModal table{
      width:100%;
      border-collapse:collapse;
      min-width:620px;
    }

    #studentClassModal th,
    #studentClassModal td{
      padding:12px;
      border-bottom:1px solid #e7eef4;
      text-align:left;
    }

    #studentClassModal th{
      background:#f4fbff;
      color:#10213b;
    }

    #studentClassModal .empty{
      text-align:center;
      padding:35px;
      background:#f8fcff;
      border-radius:14px;
      color:#617085;
    }

    .class.studentClickable{
      cursor:pointer;
      transition:.2s ease;
    }

    .class.studentClickable:hover{
      transform:translateY(-4px);
      box-shadow:0 12px 28px rgba(8,127,193,.12);
    }

    .classStudentCount{
      display:block;
      margin-top:6px;
      font-weight:700;
      color:#079447;
    }

    .classStudentAction{
      display:block;
      margin-top:4px;
      color:#087fc1;
      font-size:13px;
      font-weight:700;
    }
  `;

  document.head.appendChild(style);

  const modal = document.createElement("div");

  modal.id = "studentClassModal";

  modal.innerHTML = `
    <div class="modalBox">

      <div class="modalHead">

        <div>
          <h2 id="studentClassTitle">শ্রেণির শিক্ষার্থী</h2>
          <div id="studentClassCount" class="countText">
            তথ্য লোড হচ্ছে...
          </div>
        </div>

        <button
          class="closeBtn"
          onclick="closeClassStudents()"
        >
          ×
        </button>

      </div>

      <div id="studentClassBody"></div>

    </div>
  `;

  modal.addEventListener("click", function (e) {
    if (e.target === modal) {
      closeClassStudents();
    }
  });

  document.body.appendChild(modal);
}

window.closeClassStudents = function () {

  const modal =
    document.getElementById("studentClassModal");

  if (modal) {
    modal.style.display = "none";
  }
};


window.openClassStudents = async function (className) {

  createStudentModal();

  const modal =
    document.getElementById("studentClassModal");

  const title =
    document.getElementById("studentClassTitle");

  const count =
    document.getElementById("studentClassCount");

  const body =
    document.getElementById("studentClassBody");

  title.textContent =
    `${className} — শিক্ষার্থীদের তালিকা`;

  count.textContent =
    "শিক্ষার্থীদের তথ্য লোড হচ্ছে...";

  body.innerHTML = `
    <div class="empty">
      শিক্ষার্থীদের তথ্য লোড হচ্ছে...
    </div>
  `;

  modal.style.display = "flex";


  const { data, error } = await db
    .from("students")
    .select(
      "student_id,name,class_name,roll,batch,photo_url"
    )
    .eq("class_name", className)
    .order("roll", {
      ascending: true,
      nullsFirst: false
    })
    .order("name", {
      ascending: true
    });


  let students = data || [];


  /*
    Existing data যদি "three", "two" ইত্যাদি
    নামে থাকে তাহলে fallback matching।
  */

  if (!error && students.length === 0) {

    const { data: allStudents } = await db
      .from("students")
      .select(
        "student_id,name,class_name,roll,batch,photo_url"
      )
      .order("name", {
        ascending: true
      });

    students = (allStudents || []).filter(
      (student) =>
        normalizeClass(student.class_name) === className
    );
  }


  if (error && students.length === 0) {

    count.textContent =
      "Student information পাওয়া যায়নি";

    body.innerHTML = `
      <div class="empty">
        শিক্ষার্থীদের তথ্য load করতে সমস্যা হয়েছে।
      </div>
    `;

    console.error(error);

    return;
  }


  count.textContent =
    `মোট শিক্ষার্থী: ${students.length} জন`;


  if (!students.length) {

    body.innerHTML = `
      <div class="empty">
        এই শ্রেণিতে বর্তমানে কোনো শিক্ষার্থীর তথ্য নেই।
      </div>
    `;

    return;
  }


  body.innerHTML = `

    <div class="studentTableWrap">

      <table>

        <thead>

          <tr>

            <th>#</th>
            <th>Student Name</th>
            <th>Student ID</th>
            <th>Roll</th>
            <th>Batch</th>

          </tr>

        </thead>

        <tbody>

          ${students.map((student, index) => `

            <tr>

              <td>${index + 1}</td>

              <td>
                <strong>
                  ${esc(student.name)}
                </strong>
              </td>

              <td>
                ${esc(student.student_id)}
              </td>

              <td>
                ${esc(student.roll || "—")}
              </td>

              <td>
                ${esc(student.batch || "—")}
              </td>

            </tr>

          `).join("")}

        </tbody>

      </table>

    </div>

  `;
};


/* =========================
   CLASS GRID
========================= */

function renderClasses(students) {

  const grid =
    document.getElementById("classesGrid");

  if (!grid) return;


  const counts = {};

  classes.forEach((className) => {
    counts[className] = 0;
  });


  students.forEach((student) => {

    const className =
      normalizeClass(student.class_name);

    if (
      Object.prototype.hasOwnProperty.call(
        counts,
        className
      )
    ) {
      counts[className]++;
    }

  });


  grid.innerHTML = classes.map((className) => `

    <a
      href="students.html?class=${encodeURIComponent(className)}"
      class="class studentClickable"
      style="display:block;color:inherit"
    >

      <strong>
        ${esc(className)}
      </strong>

      <span
        class="classStudentCount"
        style="display:block;margin-top:6px;font-weight:700;color:var(--green)"
      >
        ${counts[className]} জন শিক্ষার্থী
      </span>

      <span
        style="display:block;margin-top:4px;color:var(--blue);font-size:13px;font-weight:700"
      >
        শিক্ষার্থীদের তথ্য দেখতে ক্লিক করুন →
      </span>

    </a>

  `).join("");
}


/* =========================
   TEACHERS
========================= */

function renderTeachers(teachers) {

  const target =
    document.getElementById("teacherPublic");

  if (!target) return;


  if (!teachers.length) {

    target.innerHTML = `
      <div class="card">
        <h3>শিক্ষক তথ্য শীঘ্রই প্রকাশ হবে</h3>
      </div>
    `;

    return;
  }


  target.innerHTML =
    teachers.map((teacher) => `

      <div class="card">

        <div class="teacherImg">
          👨‍🏫
        </div>

        <h3>
          ${esc(teacher.name)}
        </h3>

        <p>
          <b>
            ${esc(
              teacher.subject ||
              teacher.designation ||
              "Teacher"
            )}
          </b>
        </p>

        <small>
          ${esc(teacher.qualification || "")}
        </small>

      </div>

    `).join("");
}


/* =========================
   NOTICES
========================= */

function renderNotices(notices) {

  const target =
    document.getElementById("noticePublic");

  if (!target) return;


  if (!notices.length) {

    target.innerHTML = `
      <div class="card">
        <h3>
          বর্তমানে কোনো প্রকাশিত নোটিশ নেই।
        </h3>
      </div>
    `;

    return;
  }


  target.innerHTML =
    notices.map((notice) => `

      <div class="card notice">

        <div class="date">
          ${esc(notice.notice_date || "")}
          <br>
          📢
        </div>

        <div>

          <h3>
            ${esc(notice.title)}
          </h3>

          <p>
            ${esc(notice.body || "")}
          </p>

        </div>

      </div>

    `).join("");
}


/* =========================
   PUBLIC DATA LOAD
========================= */

async function load() {

  const year =
    document.getElementById("year");

  if (year) {
    year.textContent =
      new Date().getFullYear();
  }


  /*
    Students সহ সব public data
    একসাথে load
  */

  const [
    studentResult,
    teacherResult,
    noticeResult,
    settingsResult
  ] = await Promise.all([

    db
      .from("students")
      .select(
        "student_id,name,class_name,roll,batch,photo_url"
      ),

    db
      .from("teachers")
      .select(
        "name,subject,qualification,designation,photo_url"
      )
      .order(
        "created_at",
        {
          ascending: false
        }
      ),

    db
      .from("notices")
      .select("*")
      .eq(
        "published",
        true
      )
      .order(
        "notice_date",
        {
          ascending: false
        }
      )
      .limit(8),

    db
      .from("site_settings")
      .select("*")
      .limit(1)
      .maybeSingle()

  ]);


  const students =
    studentResult.data || [];

  const teachers =
    teacherResult.data || [];

  const notices =
    noticeResult.data || [];

  const settings =
    settingsResult.data;


  if (studentResult.error) {
    console.error(
      "Student Load Error:",
      studentResult.error
    );
  }


  if (settings) {

    const phoneText =
      document.getElementById(
        "phoneText"
      );

    const emailText =
      document.getElementById(
        "emailText"
      );

    const tagline =
      document.getElementById(
        "tagline"
      );


    if (phoneText) {
      phoneText.textContent =
        settings.phone ||
        "01570-228971";
    }

    if (emailText) {
      emailText.textContent =
        settings.email ||
        "crewtheunified@gmail.com";
    }

    if (tagline) {
      tagline.textContent =
        settings.hero_subtitle ||
        "Play থেকে Class Eight পর্যন্ত মানসম্মত শিক্ষা, নিয়মিত পরীক্ষা, Exam Result এবং শিক্ষার্থীর সার্বিক উন্নয়নের জন্য TUCLC।";
    }

  }


  const studentCount =
    document.getElementById(
      "studentCount"
    );

  const teacherCount =
    document.getElementById(
      "teacherCount"
    );


  if (studentCount) {
    studentCount.textContent =
      students.length + "+";
  }


  if (teacherCount) {
    teacherCount.textContent =
      teachers.length + "+";
  }


  /*
    এখানেই নতুন class system
  */

  renderClasses(students);


  renderTeachers(
    teachers
  );


  renderNotices(
    notices
  );
}


/* =========================
   EXAM RESULT SEARCH
========================= */

async function searchResult() {

  const input =
    document.getElementById(
      "resultSearch"
    );

  const output =
    document.getElementById(
      "resultOut"
    );

  if (!input || !output) return;


  const q =
    input.value.trim();


  if (!q) {

    toast(
      "Student ID দিন"
    );

    return;
  }


  output.innerHTML = `
    <div class="card">
      ফলাফল খোঁজা হচ্ছে...
    </div>
  `;


  const { data, error } =
    await db
      .from("exam_results")
      .select("*")
      .eq(
        "published",
        true
      );


  if (error) {

    output.innerHTML = `
      <div class="card">
        Result load করতে সমস্যা হয়েছে।
      </div>
    `;

    return;
  }


  const result =
    (data || []).find(
      (x) =>
        String(
          x.student_id
        ).toLowerCase() ===
        q.toLowerCase()
    );


  if (!result) {

    output.innerHTML = `
      <div class="card">
        এই Student ID-এর কোনো
        প্রকাশিত ফলাফল পাওয়া যায়নি।
      </div>
    `;

    return;
  }


  const { data: student } =
    await db
      .from("students")
      .select(
        "name,class_name"
      )
      .eq(
        "student_id",
        result.student_id
      )
      .maybeSingle();


  output.innerHTML = `

    <div class="card">

      <h3>
        🏆
        ${esc(
          student?.name ||
          result.student_id
        )}
      </h3>

      <p>

        Class:
        ${esc(
          student?.class_name ||
          ""
        )}

        •

        ID/Roll:
        <b>
          ${esc(
            result.student_id
          )}
        </b>

      </p>

      <p>

        Exam:
        <b>
          ${esc(result.exam_name)}
        </b>

      </p>

      <p>

        Total:
        <b>
          ${esc(
            result.obtained_marks || ""
          )}/
          ${esc(
            result.total_marks || ""
          )}
        </b>

        •

        Percentage:
        <b>
          ${esc(
            result.percentage ||
            "—"
          )}%
        </b>

        •

        Grade:
        <b>
          ${esc(
            result.grade ||
            "—"
          )}
        </b>

        •

        Rank:
        <b>
          ${esc(
            result.rank ||
            "—"
          )}
        </b>

      </p>

      <p>
        ${esc(
          result.teacher_comment ||
          ""
        )}
      </p>

    </div>

  `;
}


/* =========================
   ADMISSION
========================= */

async function saveAdmission() {

  const form =
    document.getElementById(
      "admissionForm"
    );

  if (!form) return;


  const formData =
    new FormData(form);


  const data =
    Object.fromEntries(
      formData.entries()
    );


  const { error } =
    await db
      .from("admissions")
      .insert(data);


  if (error) {

    toast(
      error.message
    );

    return;
  }


  form.reset();

  toast(
    "ভর্তি আবেদন সফলভাবে পাঠানো হয়েছে।"
  );
}


/* =========================
   MENU
========================= */

function toggleMenu() {

  const x =
    document.getElementById(
      "mobileMenu"
    );

  if (!x) return;

  x.style.display =
    x.style.display === "none"
      ? "block"
      : "none";
}


/* =========================
   INIT
========================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    createStudentModal();

    load();

    const admissionForm =
      document.getElementById(
        "admissionForm"
      );

    if (admissionForm) {

      admissionForm.addEventListener(
        "submit",
        (e) => {

          e.preventDefault();

          saveAdmission();

        }
      );

    }

  }
);
