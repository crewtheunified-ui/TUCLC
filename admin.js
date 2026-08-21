const SUPABASE_URL = "https://wdiiftvtmtvsokdgyqmr.supabase.co";
const SUPABASE_KEY = "sb_publishable_RphPgkyVKZkZeIgklmt8hQ__W3aGPiX";

const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const ADMIN_EMAIL = "crewtheunified@gmail.com";

const esc = (v) =>
  String(v ?? "").replace(/[&<>"']/g, (m) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[m]));

function msg(t) {
  const x = document.getElementById("msg");
  if (x) {
    x.textContent = t;
    setTimeout(() => x.textContent = "", 3500);
  }
}

function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!email || !password) {
    msg("Email ও Password দিন।");
    return;
  }

  db.auth.signInWithPassword({ email, password }).then(async ({ data, error }) => {
    if (error) {
      msg(error.message);
      return;
    }

    if (data.user.email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      await db.auth.signOut();
      msg("এই account-এর Admin permission নেই।");
      return;
    }

    document.getElementById("login").hidden = true;
    document.getElementById("app").hidden = false;

    show("students");
  });
}

async function logout() {
  await db.auth.signOut();
  document.getElementById("app").hidden = true;
  document.getElementById("login").hidden = false;
  document.getElementById("password").value = "";
}

function show(type, button) {
  document.querySelectorAll(".tab").forEach(x => x.classList.remove("active"));
  if (button) button.classList.add("active");

  if (type === "students") studentsPage();
  if (type === "teachers") teachersPage();
  if (type === "results") resultsPage();
  if (type === "notices") noticesPage();
  if (type === "admissions") admissionsPage();
  if (type === "settings") settingsPage();
}

async function studentsPage() {
  const { data, error } = await db
    .from("students")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return msg(error.message);

  document.getElementById("content").innerHTML = `
    <div class="box">
      <h2>👨‍🎓 শিক্ষার্থী</h2>

      <form onsubmit="addStudent(event)" class="formgrid">
        <input id="sName" placeholder="শিক্ষার্থীর নাম" required>
        <input id="sId" placeholder="Student ID / Roll" required>
        <input id="sClass" placeholder="Class" required>
        <input id="sGuardian" placeholder="Guardian Name">
        <input id="sPhone" placeholder="Guardian Phone">
        <button class="btn primary" type="submit">+ শিক্ষার্থী যোগ করুন</button>
      </form>
    </div>

    <div class="box tablewrap">
      <table>
        <thead>
          <tr>
            <th>নাম</th>
            <th>ID/Roll</th>
            <th>Class</th>
            <th>Guardian</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${(data || []).map(x => `
            <tr>
              <td>${esc(x.name)}</td>
              <td>${esc(x.student_id)}</td>
              <td>${esc(x.class_name)}</td>
              <td>${esc(x.guardian_name)}</td>
              <td>
                <button class="btn danger"
                  onclick="deleteRow('students','${x.id}','studentsPage')">
                  Delete
                </button>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

async function addStudent(e) {
  e.preventDefault();

  const row = {
    name: document.getElementById("sName").value.trim(),
    student_id: document.getElementById("sId").value.trim(),
    class_name: document.getElementById("sClass").value.trim(),
    guardian_name: document.getElementById("sGuardian").value.trim(),
    guardian_phone: document.getElementById("sPhone").value.trim()
  };

  const { error } = await db.from("students").insert(row);

  if (error) {
    msg(error.message);
    return;
  }

  alert("শিক্ষার্থী সফলভাবে যোগ হয়েছে।");
  studentsPage();
}

async function teachersPage() {
  const { data, error } = await db
    .from("teachers")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return msg(error.message);

  document.getElementById("content").innerHTML = `
    <div class="box">
      <h2>👨‍🏫 শিক্ষক</h2>

      <form onsubmit="addTeacher(event)" class="formgrid">
        <input id="tName" placeholder="শিক্ষকের নাম" required>
        <input id="tSubject" placeholder="Subject">
        <input id="tQualification" placeholder="Qualification">
        <input id="tDesignation" placeholder="Designation">
        <input id="tPhoto" placeholder="Photo URL">
        <button class="btn primary" type="submit">+ শিক্ষক যোগ করুন</button>
      </form>
    </div>

    <div class="box tablewrap">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Subject</th>
            <th>Qualification</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${(data || []).map(x => `
            <tr>
              <td>${esc(x.name)}</td>
              <td>${esc(x.subject)}</td>
              <td>${esc(x.qualification)}</td>
              <td>
                <button class="btn danger"
                  onclick="deleteRow('teachers','${x.id}','teachersPage')">
                  Delete
                </button>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

async function addTeacher(e) {
  e.preventDefault();

  const row = {
    name: document.getElementById("tName").value.trim(),
    subject: document.getElementById("tSubject").value.trim(),
    qualification: document.getElementById("tQualification").value.trim(),
    designation: document.getElementById("tDesignation").value.trim(),
    photo_url: document.getElementById("tPhoto").value.trim()
  };

  const { error } = await db.from("teachers").insert(row);

  if (error) return msg(error.message);

  alert("শিক্ষক সফলভাবে যোগ হয়েছে।");
  teachersPage();
}

async function resultsPage() {
  const { data, error } = await db
    .from("exam_results")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return msg(error.message);

  document.getElementById("content").innerHTML = `
    <div class="box">
      <h2>📊 Exam Result</h2>

      <form onsubmit="addResult(event)" class="formgrid">
        <input id="rStudent" placeholder="Student ID" required>
        <input id="rExam" placeholder="Exam Name" required>
        <input id="rTotal" type="number" placeholder="Total Marks" required>
        <input id="rObtained" type="number" placeholder="Obtained Marks" required>
        <input id="rGrade" placeholder="Grade">
        <input id="rRank" placeholder="Rank">
        <textarea id="rComment" placeholder="Teacher Comment"></textarea>

        <select id="rPublished">
          <option value="true">Publish Result</option>
          <option value="false">Keep Hidden</option>
        </select>

        <button class="btn primary" type="submit">
          + Result প্রকাশ করুন
        </button>
      </form>
    </div>

    <div class="box tablewrap">
      <table>
        <thead>
          <tr>
            <th>Student ID</th>
            <th>Exam</th>
            <th>Marks</th>
            <th>Percentage</th>
            <th>Grade</th>
            <th>Published</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${(data || []).map(x => `
            <tr>
              <td>${esc(x.student_id)}</td>
              <td>${esc(x.exam_name)}</td>
              <td>${esc(x.obtained_marks)}/${esc(x.total_marks)}</td>
              <td>${esc(x.percentage)}%</td>
              <td>${esc(x.grade)}</td>
              <td>${x.published ? "Yes" : "No"}</td>
              <td>
                <button class="btn danger"
                  onclick="deleteRow('exam_results','${x.id}','resultsPage')">
                  Delete
                </button>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

async function addResult(e) {
  e.preventDefault();

  const total = Number(document.getElementById("rTotal").value);
  const obtained = Number(document.getElementById("rObtained").value);

  const percentage = total > 0
    ? Number(((obtained / total) * 100).toFixed(2))
    : 0;

  const row = {
    const rankValue = document.getElementById("rRank").value.trim();

const row = {
  student_id: document.getElementById("rStudent").value.trim(),
  exam_name: document.getElementById("rExam").value.trim(),
  total_marks: total,
  obtained_marks: obtained,
  percentage: percentage,
  grade: document.getElementById("rGrade").value.trim() || null,
  rank: rankValue === "" ? null : Number(rankValue),
  teacher_comment: document.getElementById("rComment").value.trim() || null,
  published: document.getElementById("rPublished").value === "true"
};

  const { error } = await db.from("exam_results").insert(row);

  if (error) return msg(error.message);

  alert("Exam Result সফলভাবে সংরক্ষণ হয়েছে।");
  resultsPage();
}

async function noticesPage() {
  const { data, error } = await db
    .from("notices")
    .select("*")
    .order("notice_date", { ascending: false });

  if (error) return msg(error.message);

  document.getElementById("content").innerHTML = `
    <div class="box">
      <h2>📢 Notices</h2>

      <form onsubmit="addNotice(event)" class="formgrid">
        <input id="nTitle" placeholder="Notice Title" required>
        <input id="nDate" type="date" required>
        <textarea id="nBody" placeholder="Notice details" required></textarea>

        <select id="nPublished">
          <option value="true">Publish</option>
          <option value="false">Draft</option>
        </select>

        <button class="btn primary" type="submit">
          + Notice প্রকাশ করুন
        </button>
      </form>
    </div>

    <div class="box tablewrap">
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Title</th>
            <th>Published</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${(data || []).map(x => `
            <tr>
              <td>${esc(x.notice_date)}</td>
              <td>${esc(x.title)}</td>
              <td>${x.published ? "Yes" : "No"}</td>
              <td>
                <button class="btn danger"
                  onclick="deleteRow('notices','${x.id}','noticesPage')">
                  Delete
                </button>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

async function addNotice(e) {
  e.preventDefault();

  const row = {
    title: document.getElementById("nTitle").value.trim(),
    notice_date: document.getElementById("nDate").value,
    body: document.getElementById("nBody").value.trim(),
    published: document.getElementById("nPublished").value === "true"
  };

  const { error } = await db.from("notices").insert(row);

  if (error) return msg(error.message);

  alert("Notice সফলভাবে প্রকাশ হয়েছে।");
  noticesPage();
}

async function admissionsPage() {
  const { data, error } = await db
    .from("admissions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return msg(error.message);

  document.getElementById("content").innerHTML = `
    <div class="box">
      <h2>📝 Online Admissions</h2>
      <p>Public website থেকে আসা admission applications এখানে দেখা যাবে।</p>
    </div>

    <div class="box tablewrap">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Class</th>
            <th>Guardian</th>
            <th>Email</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${(data || []).map(x => `
            <tr>
              <td>${esc(x.applicant_name)}</td>
              <td>${esc(x.phone)}</td>
              <td>${esc(x.class_name)}</td>
              <td>${esc(x.guardian_name)}</td>
              <td>${esc(x.email)}</td>
              <td>
                <button class="btn danger"
                  onclick="deleteRow('admissions','${x.id}','admissionsPage')">
                  Delete
                </button>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

async function settingsPage() {
  const { data, error } = await db
    .from("site_settings")
    .select("*")
    .limit(1)
    .maybeSingle();

  if (error) return msg(error.message);

  document.getElementById("content").innerHTML = `
    <div class="box">
      <h2>⚙️ Website Settings</h2>

      <form onsubmit="saveSettings(event)" class="formgrid">
        <input id="setName"
          value="${esc(data?.institution_name || "The Unified Crew Learning Center")}"
          placeholder="Institution Name">

        <input id="setPhone"
          value="${esc(data?.phone || "")}"
          placeholder="Phone">

        <input id="setEmail"
          value="${esc(data?.email || "")}"
          placeholder="Email">

        <textarea id="setTag"
          placeholder="Website tagline">${esc(data?.hero_subtitle || "")}</textarea>

        <button class="btn primary" type="submit">
          Save Website Settings
        </button>
      </form>
    </div>
  `;
}

async function saveSettings(e) {
  e.preventDefault();

  const row = {
    institution_name: document.getElementById("setName").value.trim(),
    phone: document.getElementById("setPhone").value.trim(),
    email: document.getElementById("setEmail").value.trim(),
    hero_subtitle: document.getElementById("setTag").value.trim(),
    updated_at: new Date().toISOString()
  };

  const { data: old } = await db
    .from("site_settings")
    .select("id")
    .limit(1)
    .maybeSingle();

  let result;

  if (old) {
    result = await db
      .from("site_settings")
      .update(row)
      .eq("id", old.id);
  } else {
    result = await db
      .from("site_settings")
      .insert(row);
  }

  if (result.error) return msg(result.error.message);

  alert("Website settings সংরক্ষণ হয়েছে।");
}

async function deleteRow(table, id, reloadFunction) {
  if (!confirm("আপনি কি সত্যিই এটি Delete করতে চান?")) return;

  const { error } = await db
    .from(table)
    .delete()
    .eq("id", id);

  if (error) {
    msg(error.message);
    return;
  }

  window[reloadFunction]();
}

async function checkSession() {
  const { data } = await db.auth.getSession();

  if (data.session && data.session.user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
    document.getElementById("login").hidden = true;
    document.getElementById("app").hidden = false;
    show("students");
  }
}

checkSession();
