/* =========================================================
   APPLICATION LOGIC & STATE MANAGEMENT
   ========================================================= */
const state = {
  activePage: 'home',
  role: 'lead',
  visits: [
    { id: 'V-2026-089', date: '2026-09-20', factory: 'مصنع الخليج للكابلات', gov: 'شمال الباطنة', wilayat: 'صحار', status: 'pending', notes: 'فحص خط الإنتاج الجديد للحصول على إعفاء المواد الخام' },
    { id: 'V-2026-088', date: '2026-09-22', factory: 'شركة الرائدة للصناعات البلاستيكية', gov: 'مسقط', wilayat: 'الروسيل', status: 'completed', notes: 'تم التأكد من مطابقة السجلات وتحديث نسبة التعمين' },
    { id: 'V-2026-087', date: '2026-09-25', factory: 'المصنع العُماني للتغليف', gov: 'الداخلية', wilayat: 'نزوى', status: 'pending', notes: 'مراجعة طلب التوسعة الجمركية' }
  ],
  team: [
    { name: 'م. أحمد المعمري', role: 'رئيس فريق التفتيش', visitsCount: 14 },
    { name: 'م. سارة البلوشية', role: 'مفتش فني أول', visitsCount: 18 },
    { name: 'م. خالد الهنائي', role: 'مدقق إعفاءات جمركية', visitsCount: 10 }
  ]
};

const pageSubtitles = {
  home: 'ملخص وأداء خطة الزيارات الميدانية',
  calendar: 'التقويم الزمني وتوزيع مواعيد الزيارات الميدانية',
  submission: 'تقديم ومعالجة طلبات الزيارات الميدانية والإعفاءات',
  reports: 'منظومة توليد واستخراج تقارير الزيارة الرسمية',
  archive: 'الأرشيف الرقمي للزيارات والتقارير المعتمدة',
  team: 'إدارة أعضاء الفريق والتوزيع الجغرافي للمهام'
};

const pageTitles = {
  home: 'الرئيسية',
  calendar: 'التقويم الميداني',
  submission: 'آلية التقديم',
  reports: 'توليد التقارير',
  archive: 'الأرشيف الرقمي',
  team: 'إدارة الفريق'
};

function navigateTo(pageId) {
  state.activePage = pageId;

  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.toggle('is-active', btn.dataset.page === pageId);
  });

  document.querySelectorAll('.page').forEach(page => {
    page.hidden = (page.id !== `page-${pageId}`);
  });

  document.getElementById('pageTitle').textContent = pageTitles[pageId] || '';
  document.getElementById('pageSubtitle').textContent = pageSubtitles[pageId] || '';

  renderActivePage();
}

function renderActivePage() {
  switch (state.activePage) {
    case 'home':
      renderHome();
      break;
    case 'calendar':
      renderCalendar();
      break;
    case 'reports':
      renderReports();
      break;
    case 'archive':
      renderArchive();
      break;
    case 'team':
      renderTeam();
      break;
  }
}

// 1. الرئيسية
function renderHome() {
  const body = document.getElementById('homeVisitsBody');
  body.innerHTML = state.visits.map(v => `
    <tr>
      <td style="font-family: var(--font-mono); font-weight:bold;">${v.id}</td>
      <td>${v.date}</td>
      <td>${v.gov} — ${v.wilayat}</td>
      <td>${v.factory}</td>
      <td><span class="badge ${v.status === 'completed' ? 'badge-success' : 'badge-pending'}">${v.status === 'completed' ? 'مكتملة' : 'قيد الانتظار'}</span></td>
      <td><button class="btn btn-secondary" onclick="navigateTo('reports')">استعراض التقرير</button></td>
    </tr>
  `).join('');
}

// 2. التقويم
function renderCalendar() {
  const grid = document.getElementById('calendarGrid');
  let daysHTML = '';
  for (let i = 1; i <= 30; i++) {
    const event = state.visits.find(v => parseInt(v.date.split('-')[2]) === i);
    daysHTML += `
      <div class="calendar-day">
        <div class="calendar-day-num">${i}</div>
        ${event ? `<div class="calendar-event">${event.factory.substring(0, 15)}...</div>` : ''}
      </div>
    `;
  }
  grid.innerHTML = daysHTML;
}

// 3. آلية التقديم
function handleFormSubmit(e) {
  e.preventDefault();
  const newVisit = {
    id: `V-2026-0${state.visits.length + 90}`,
    factory: document.getElementById('subFactory').value,
    gov: document.getElementById('subGov').value,
    wilayat: document.getElementById('subWilayat').value,
    date: document.getElementById('subDate').value,
    status: 'pending',
    notes: document.getElementById('subNotes').value
  };

  state.visits.unshift(newVisit);
  alert('تم تقديم الطلب وإدراجه في جدول الزيارات بنجاح!');
  document.getElementById('submissionForm').reset();
  navigateTo('home');
}

// 4. توليد التقارير
function renderReports() {
  const select = document.getElementById('reportVisitSelect');
  select.innerHTML = state.visits.map(v => `<option value="${v.id}">${v.id} — ${v.factory}</option>`).join('');
  if (state.visits.length > 0) generateReportPreview(state.visits[0].id);
}

function generateReportPreview(visitId) {
  const visit = state.visits.find(v => v.id === visitId);
  if (!visit) return;

  const details = document.getElementById('reportDetails');
  details.innerHTML = `
    <div><strong>رمز الزيارة:</strong> ${visit.id}</div>
    <div><strong>تاريخ الزيارة:</strong> ${visit.date}</div>
    <div><strong>اسم المنشأة:</strong> ${visit.factory}</div>
    <div><strong>المحافظة / الولاية:</strong> ${visit.gov} — ${visit.wilayat}</div>
    <div style="grid-column: span 2;"><strong>نتيجة الفحص الفني والملاحظات:</strong> ${visit.notes}</div>
  `;
}

// 5. الأرشفة
function renderArchive() {
  filterArchive();
}

function filterArchive() {
  const query = document.getElementById('archiveSearch').value.toLowerCase();
  const govFilter = document.getElementById('archiveGovFilter').value;
  const tbody = document.getElementById('archiveTableBody');

  const filtered = state.visits.filter(v => {
    const matchesSearch = v.factory.toLowerCase().includes(query) || v.id.toLowerCase().includes(query);
    const matchesGov = govFilter === 'ALL' || v.gov === govFilter;
    return matchesSearch && matchesGov;
  });

  tbody.innerHTML = filtered.map(v => `
    <tr>
      <td style="font-family: var(--font-mono);">${v.id}</td>
      <td>${v.date}</td>
      <td>${v.factory}</td>
      <td>${v.gov}</td>
      <td>${v.notes.substring(0, 30)}...</td>
      <td><span class="badge badge-success">مؤرشف معتمد</span></td>
    </tr>
  `).join('');
}

// 6. إدارة الفريق
function renderTeam() {
  const grid = document.getElementById('teamCardsGrid');
  grid.innerHTML = state.team.map(m => `
    <div class="team-card">
      <div class="team-avatar">${m.name.charAt(3)}</div>
      <h4>${m.name}</h4>
      <p style="font-size:0.75rem; color:var(--ink-soft);">${m.role}</p>
      <div style="margin-top:10px; font-size:0.8rem; font-weight:bold;">الزيارات المنجزة: ${m.visitsCount}</div>
    </div>
  `).join('');
}

function switchRole(role) {
  state.role = role;
}

document.addEventListener('DOMContentLoaded', () => {
  navigateTo('home');
});
