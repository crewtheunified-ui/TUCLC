const SUPABASE_URL = 'https://wdiiftvtmtvsokdgyqmr.supabase.co';
const SUPABASE_KEY = 'sb_publishable_RphPgkyVKZkZeIgklmt8hQ__W3aGPiX';

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

const classes = [
  'Play',
  'Nursery',
  'Class One',
  'Class Two',
  'Class Three',
  'Class Four',
  'Class Five',
  'Class Six',
  'Class Seven',
  'Class Eight'
];

/* =========================
   HELPERS
========================= */

const esc = (value) =>
  String(value ?? '').replace(/[&<>"']/g, (m) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }[m]));

function toast(message) {
  const box = document.getElementById('toast');

  if (!box) {
    alert(message);
    return;
  }

  box.textContent = message;
  box.style.display = 'block';

  clearTimeout(window.__toastTimer);

  window.__toastTimer = setTimeout(() => {
    box.style.display = 'none';
  }, 2600);
}

/* =========================
   CLASS NORMALIZATION
========================= */

function normalizeClass(value) {
  const x = String(value ?? '')
    .trim()
    .toLowerCase();

  const map = {
    play: 'Play',
    nursery: 'Nursery',

    one: 'Class One',
    'class one': 'Class One',

    two: 'Class Two',
    'class two': 'Class Two',

    three: 'Class Three',
    'class three': 'Class Three',

    four: 'Class Four',
    'class four': 'Class Four',

    five: 'Class Five',
    'class five': 'Class Five',

    six: 'Class Six',
    'class six': 'Class Six',

    seven: 'Class Seven',
    'class seven': 'Class Seven',

    eight: 'Class Eight',
    'class eight': 'Class Eight'
  };

  return map[x] || String(value ?? '').trim();
}

/* =========================
   CLASS GRID
========================= */

function renderClasses(students) {

  const grid =
    document.getElementById('classesGrid');

  if (!grid) return;

  const counts =
    Object.fromEntries(
      classes.map(c => [c, 0])
    );

  (students || []).forEach(student => {

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

  grid.innerHTML =
    classes.map(className => `

      <a
        class="class"
        href="students.html?class=${encodeURIComponent(className)}"
      >

        <strong>
          ${esc(className)}
        </strong>

        <span>
          ${counts[className]} জন শিক্ষার্থী
        </span>

        <small>
          শিক্ষার্থীদের তথ্য দেখতে ক্লিক করুন →
        </small>

      </a>

    `).join('');
}

/* =========================
   TEACHERS
========================= */

function renderTeachers(teachers) {

  const target =
    document.getElementById('teacherPublic');

  if (!target) return;

  if (!teachers || !teachers.length) {

    target.innerHTML = `
      <div class="card">
        <h3>
          শিক্ষক তথ্য শীঘ্রই প্রকাশ হবে
        </h3>
      </div>
    `;

    return;
  }

  target.innerHTML =
    teachers.slice(0, 8).map(teacher => `

      <article class="card teacher-card">

        ${
          teacher.photo_url
            ? `
              <img
                src="${esc(teacher.photo_url)}"
                alt="${esc(teacher.name)}"
                style="
                  width:110px;
                  height:110px;
                  object-fit:cover;
                  border-radius:50%;
                  margin:auto;
                  display:block
                "
              >
            `
            : `
              <div class="teacherImg">
                👨‍🏫
              </div>
            `
        }

        <h3>
          ${esc(teacher.name)}
        </h3>

        <p>
          <b>
            ${esc(
              teacher.designation ||
              teacher.subject ||
              'Teacher'
            )}
          </b>
        </p>

        <small>
          ${esc(teacher.qualification || '')}
        </small>

        ${
          teacher.bio
            ? `
              <p>
                ${esc(teacher.bio)}
              </p>
            `
            : ''
        }

      </article>

    `).join('');
}

/* =========================
   NOTICES
========================= */

function renderNotices(notices) {

  const target =
    document.getElementById('noticePublic');

  if (!target) return;

  if (!notices || !notices.length) {

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
    notices.map(notice => `

      <a
        class="card notice-card"
        href="notice.html?id=${encodeURIComponent(notice.id)}"
      >

        <div class="notice-date">
          ${esc(notice.notice_date || '')}
        </div>

        <div>

          <h3>
            ${esc(notice.title)}
          </h3>

          <p>
            সম্পূর্ণ নোটিশ দেখতে ক্লিক করুন →
          </p>

        </div>

      </a>

    `).join('');
}

/* =========================
   GALLERY
========================= */

function renderGallery(images) {

  const target =
    document.getElementById('galleryPublic');

  if (!target) return;

  if (!images || !images.length) {

    target.innerHTML = `
      <div class="card">
        <h3>
          ফটো গ্যালারি শীঘ্রই যুক্ত হবে।
        </h3>
      </div>
    `;

    return;
  }

  target.innerHTML =
    images.map(image => `

      <figure
        class="gallery-card"
        data-image="${esc(image.image_url)}"
        data-title="${esc(image.title || '')}"
      >

        <img
          src="${esc(image.image_url)}"
          alt="${esc(image.title || 'TUCLC Gallery')}"
          loading="lazy"
        >

        <figcaption>

          <strong>
            ${esc(image.title || '')}
          </strong>

          ${
            image.caption
              ? `
                <small>
                  ${esc(image.caption)}
                </small>
              `
              : ''
          }

        </figcaption>

      </figure>

    `).join('');

  document
    .querySelectorAll('.gallery-card')
    .forEach(card => {

      card.addEventListener(
        'click',
        () => {
          openLightbox(
            card.dataset.image,
            card.dataset.title
          );
        }
      );

    });
}

/* =========================
   LIGHTBOX
========================= */

function openLightbox(src, title) {

  let box =
    document.getElementById(
      'galleryLightbox'
    );

  if (!box) {

    box =
      document.createElement('div');

    box.id =
      'galleryLightbox';

    box.innerHTML = `

      <div class="lightbox-inner">

        <button
          type="button"
          class="lightbox-close"
          aria-label="Close"
        >
          ×
        </button>

        <img
          id="lightboxImage"
          alt=""
        >

        <h3
          id="lightboxTitle"
        ></h3>

      </div>

    `;

    box.addEventListener(
      'click',
      event => {

        if (
          event.target === box ||
          event.target.classList.contains(
            'lightbox-close'
          )
        ) {
          box.style.display = 'none';
        }

      }
    );

    document.body.appendChild(box);
  }

  box.querySelector(
    '#lightboxImage'
  ).src = src;

  box.querySelector(
    '#lightboxTitle'
  ).textContent = title || '';

  box.style.display = 'flex';
}

/* =========================
   RESULT SEARCH
========================= */

async function searchResult() {

  const query =
    (
      document.getElementById(
        'resultSearch'
      )?.value || ''
    )
      .trim()
      .toLowerCase();

  const out =
    document.getElementById(
      'resultOut'
    );

  if (!out) return;

  if (!query) {

    toast(
      'Student ID অথবা Roll দিন।'
    );

    return;
  }

  out.innerHTML = `
    <div class="card">
      ফলাফল খোঁজা হচ্ছে...
    </div>
  `;

  const [
    studentsResult,
    resultsResult
  ] = await Promise.all([

    supabase
      .from('students')
      .select(
        'student_id,name,class_name,roll,batch'
      ),

    supabase
      .from('exam_results')
      .select('*')
      .eq(
        'published',
        true
      )
      .order(
        'exam_date',
        {
          ascending: false
        }
      )

  ]);

  if (
    studentsResult.error ||
    resultsResult.error
  ) {

    console.error(
      studentsResult.error ||
      resultsResult.error
    );

    out.innerHTML = `
      <div class="card">
        ফলাফল লোড করতে সমস্যা হয়েছে।
      </div>
    `;

    return;
  }

  const students =
    studentsResult.data || [];

  const results =
    resultsResult.data || [];

  const student =
    students.find(
      s =>
        String(
          s.student_id || ''
        ).toLowerCase() === query ||

        String(
          s.roll || ''
        ).toLowerCase() === query
    );

  const studentId =
    student?.student_id || query;

  const matches =
    results.filter(
      result =>
        String(
          result.student_id || ''
        ).toLowerCase() ===
        String(studentId).toLowerCase()
    );

  if (!matches.length) {

    out.innerHTML = `
      <div class="card">
        এই Student ID/Roll-এর কোনো
        প্রকাশিত ফলাফল পাওয়া যায়নি।
      </div>
    `;

    return;
  }

  const latest =
    matches[0];

  out.innerHTML = `

    <div class="card">

      <h3>
        🏆
        ${esc(
          student?.name ||
          latest.student_id
        )}
      </h3>

      <p>

        Student ID:
        <b>
          ${esc(
            student?.student_id ||
            latest.student_id
          )}
        </b>

        • Roll:
        <b>
          ${esc(
            student?.roll ||
            '—'
          )}
        </b>

        • Class:
        <b>
          ${esc(
            student?.class_name ||
            '—'
          )}
        </b>

      </p>

      <p>

        Exam:
        <b>
          ${esc(latest.exam_name)}
        </b>

        ${
          latest.exam_date
            ? `
              • Date:
              ${esc(latest.exam_date)}
            `
            : ''
        }

      </p>

      <p>

        Total:
        <b>
          ${esc(
            latest.obtained_marks ??
            '—'
          )}
          /
          ${esc(
            latest.total_marks ??
            '—'
          )}
        </b>

        •

        Percentage:
        <b>
          ${esc(
            latest.percentage ??
            '—'
          )}%
        </b>

        •

        Grade:
        <b>
          ${esc(
            latest.grade ??
            '—'
          )}
        </b>

        •

        Rank:
        <b>
          ${esc(
            latest.rank ??
            '—'
          )}
        </b>

      </p>

      ${
        Array.isArray(
          latest.subjects
        ) &&
        latest.subjects.length

          ? `

            <div class="tableWrap">

              <table class="table">

                <thead>

                  <tr>

                    <th>
                      Subject
                    </th>

                    <th>
                      Full
                    </th>

                    <th>
                      Marks
                    </th>

                  </tr>

                </thead>

                <tbody>

                  ${
                    latest.subjects
                      .map(
                        subject => `

                          <tr>

                            <td>
                              ${esc(
                                subject.subject
                              )}
                            </td>

                            <td>
                              ${esc(
                                subject.full
                              )}
                            </td>

                            <td>
                              <b>
                                ${esc(
                                  subject.mark
                                )}
                              </b>
                            </td>

                          </tr>

                        `
                      )
                      .join('')
                  }

                </tbody>

              </table>

            </div>

          `

          : ''
      }

      ${
        latest.teacher_comment
          ? `
            <p>
              ${esc(
                latest.teacher_comment
              )}
            </p>
          `
          : ''
      }

      ${
        matches.length > 1
          ? `

            <hr>

            <h4>
              আগের প্রকাশিত ফলাফল
            </h4>

            ${matches
              .slice(1)
              .map(
                result => `

                  <p>

                    <b>
                      ${esc(
                        result.exam_name
                      )}
                    </b>

                    —
                    ${esc(
                      result.percentage ??
                      '—'
                    )}%

                    •
                    ${esc(
                      result.grade ??
                      '—'
                    )}

                  </p>

                `
              )
              .join('')}

          `
          : ''
      }

    </div>

  `;
}

/* =========================
   ADMISSION
========================= */

function saveAdmissionForm(event) {

  event.preventDefault();

  const form =
    event.currentTarget;

  const formData =
    new FormData(form);

  const row =
    Object.fromEntries(
      formData.entries()
    );

  if (
    !row.applicant_name ||
    !row.phone ||
    !row.class_name
  ) {

    toast(
      'নাম, মোবাইল ও শ্রেণি দিন।'
    );

    return;
  }

  supabase
    .from('admissions')
    .insert({

      applicant_name:
        row.applicant_name.trim(),

      class_name:
        row.class_name.trim(),

      guardian_name:
        (
          row.guardian_name ||
          ''
        ).trim() || null,

      phone:
        row.phone.trim(),

      email:
        (
          row.email ||
          ''
        ).trim() || null,

      message:
        (
          row.message ||
          ''
        ).trim() || null

    })
    .then(({ error }) => {

      if (error) {

        toast(
          error.message
        );

        return;
      }

      form.reset();

      toast(
        'ভর্তি আবেদন সফলভাবে পাঠানো হয়েছে।'
      );

    });
}

/* =========================
   PUBLIC DATA LOAD
========================= */

async function loadPublic() {

  const year =
    document.getElementById(
      'year'
    );

  if (year) {

    year.textContent =
      new Date().getFullYear();

  }

  const [
    settingsRes,
    studentsRes,
    teachersRes,
    noticesRes,
    galleryRes
  ] = await Promise.all([

    supabase
      .from('site_settings')
      .select('*')
      .limit(1)
      .maybeSingle(),

    supabase
      .from('students')
      .select(
        'student_id,name,class_name,roll,batch'
      ),

    supabase
      .from('teachers')
      .select('*')
      .order(
        'created_at',
        {
          ascending: false
        }
      )
      .limit(8),

    supabase
      .from('notices')
      .select('*')
      .eq(
        'published',
        true
      )
      .order(
        'notice_date',
        {
          ascending: false
        }
      )
      .limit(6),

    supabase
      .from('gallery_images')
      .select('*')
      .order(
        'event_date',
        {
          ascending: false
        }
      )
      .order(
        'created_at',
        {
          ascending: false
        }
      )
      .limit(12)

  ]);

  const settings =
    settingsRes.data;

  const students =
    studentsRes.data || [];

  const teachers =
    teachersRes.data || [];

  const notices =
    noticesRes.data || [];

  const gallery =
    galleryRes.data || [];

  if (settings) {

    const phone =
      document.getElementById(
        'phoneText'
      );

    const email =
      document.getElementById(
        'emailText'
      );

    const tagline =
      document.getElementById(
        'tagline'
      );

    if (phone) {

      phone.textContent =
        settings.phone ||
        '01570-228971';

    }

    if (email) {

      email.textContent =
        settings.email ||
        'crewtheunified@gmail.com';

    }

    if (tagline) {

      tagline.textContent =
        settings.hero_subtitle ||
        'শিক্ষা, শৃঙ্খলা ও সাফল্যের পথে একসাথে';

    }

  }

  const studentCount =
    document.getElementById(
      'studentCount'
    );

  const teacherCount =
    document.getElementById(
      'teacherCount'
    );

  if (studentCount) {

    studentCount.textContent =
      `${students.length}+`;

  }

  if (teacherCount) {

    teacherCount.textContent =
      `${teachers.length}+`;

  }

  renderClasses(
    students
  );

  renderTeachers(
    teachers
  );

  renderNotices(
    notices
  );

  renderGallery(
    gallery
  );
}

/* =========================
   START
========================= */

document.addEventListener(
  'DOMContentLoaded',
  () => {

    const admissionForm =
      document.getElementById(
        'admissionForm'
      );

    if (admissionForm) {

      admissionForm.addEventListener(
        'submit',
        saveAdmissionForm
      );

    }

    loadPublic()
      .catch(error => {

        console.error(
          'TUCLC load error:',
          error
        );

      });

  }
);
