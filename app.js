const SUPABASE_URL='https://wdiiftvtmtvsokdgyqmr.supabase.co';
const SUPABASE_KEY='sb_publishable_RphPgkyVKZkZeIgklmt8hQ__W3aGPiX';
const {createClient}=supabase;
const db=createClient(SUPABASE_URL,SUPABASE_KEY);

const classes=[
  'Play','Nursery','Class One','Class Two','Class Three',
  'Class Four','Class Five','Class Six','Class Seven','Class Eight'
];

const esc=s=>String(s??'').replace(
  /[&<>"']/g,
  m=>({
    '&':'&amp;',
    '<':'&lt;',
    '>':'&gt;',
    '"':'&quot;',
    "'":'&#039;'
  }[m])
);

function toast(t){
  const x=document.getElementById('toast');
  x.textContent=t;
  x.style.display='block';
  setTimeout(()=>x.style.display='none',2200);
}

async function load(){
  document.getElementById('year').textContent=new Date().getFullYear();

  document.getElementById('classesGrid').innerHTML=
    classes.map(c=>`
      <div class="class">
        <strong>${c}</strong>
        <span>Academic Program</span>
      </div>
    `).join('');

  try{
    const [s,t,n]=await Promise.all([
      db.from('students').select('id',{count:'exact',head:true}),
      db.from('teachers').select('id',{count:'exact',head:true}),
      db.from('notices')
        .select('*')
        .eq('published',true)
        .order('notice_date',{ascending:false})
        .limit(8)
    ]);

    document.getElementById('studentCount').textContent=
      (s.count||0)+'+';

    document.getElementById('teacherCount').textContent=
      (t.count||0)+'+';

    renderNotices(n.data||[]);

    const tr=await db
      .from('teachers')
      .select('name,subject,qualification,designation,photo_url')
      .order('created_at',{ascending:false})
      .limit(6);

    renderTeachers(tr.data||[]);

  }catch(e){
    console.error(e);
    renderNotices([]);
    renderTeachers([]);
  }
}

function renderTeachers(a){
  document.getElementById('teacherPublic').innerHTML=
    a.length
    ? a.map(t=>`
        <div class="card">
          <div class="teacherImg">👨‍🏫</div>
          <h3>${esc(t.name)}</h3>
          <p>
            <b>${esc(t.subject||t.designation||'Teacher')}</b>
          </p>
          <small>${esc(t.qualification||'')}</small>
        </div>
      `).join('')
    : `
      <div class="card">
        <h3>শিক্ষক তথ্য শীঘ্রই প্রকাশ হবে</h3>
      </div>
    `;
}

function renderNotices(a){
  document.getElementById('noticePublic').innerHTML=
    a.length
    ? a.map(n=>`
        <div class="card notice">
          <div class="date">
            ${esc(n.notice_date)}<br>📢
          </div>
          <div>
            <h3>${esc(n.title)}</h3>
            <p>${esc(n.body||'')}</p>
          </div>
        </div>
      `).join('')
    : `
      <div class="card">
        <h3>বর্তমানে কোনো প্রকাশিত নোটিশ নেই।</h3>
      </div>
    `;
}

async function searchResult(){
  const q=document
    .getElementById('resultSearch')
    .value
    .trim();

  if(!q){
    return toast('Student ID দিন');
  }

  const {data,error}=await db
    .from('exam_results')
    .select('*, students(name,class_name,roll,student_id)')
    .eq('published',true)
    .eq('student_id',q)
    .order('exam_date',{ascending:false});

  if(error){
    return toast(error.message);
  }

  document.getElementById('resultOut').innerHTML=
    data.length
    ? data.map(r=>`
        <div class="card" style="margin-top:15px">
          <h3>
            🎓 ${esc(r.students?.name||'Student')}
          </h3>

          <p>
            ID: <b>${esc(r.student_id)}</b>
            • Class: ${esc(r.students?.class_name||'')}
          </p>

          <p>
            Exam: <b>${esc(r.exam_name)}</b>
            • Date: ${esc(r.exam_date||'')}
          </p>

          <p>
            Total:
            <b>
              ${esc(r.obtained_marks??0)}/${esc(r.total_marks??0)}
            </b>

            • Percentage:
            <b>${esc(r.percentage??0)}%</b>

            • Grade:
            <b>${esc(r.grade||'-')}</b>

            • Rank:
            <b>${esc(r.rank||'-')}</b>
          </p>

          <p>
            Attendance:
            ${esc(r.attendance??'-')}%

            •
            ${esc(r.teacher_comment||'')}
          </p>
        </div>
      `).join('')
    : `
      <div class="card">
        এই Student ID-এর কোনো প্রকাশিত ফলাফল পাওয়া যায়নি।
      </div>
    `;
}

document
  .getElementById('admissionForm')
  .addEventListener('submit',async e=>{
    e.preventDefault();

    const f=new FormData(e.currentTarget);
    const x=Object.fromEntries(f.entries());

    const {error}=await db
      .from('admissions')
      .insert(x);

    if(error){
      return toast(error.message);
    }

    e.currentTarget.reset();

    toast('ভর্তি আবেদন সফলভাবে পাঠানো হয়েছে।');
  });

load();
