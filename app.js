/* =========================================================
   STATE MANAGEMENT & CORE LOGIC
   ========================================================= */
const state = {
  activePage: 'home',
  role: 'lead',
  visits: [
    { id: 'V-2026-001', date: '2026-09-20', governorate: 'محافظة مسقط', wilayat: 'بوشر', factoriesCount: 3, status: 'scheduled' },
    { id: 'V-2026-002', date: '2026-09-22', governorate: 'محافظة شمال الباطنة', wilayat: 'صحار', factoriesCount: 5, status: 'visited' },
  ]
};

const pageSubtitles = {
  home: 'نظرة عامة على أداء الزيارات الميدانية للفريق',
  calendar: 'الجدول الزمني والتأريخ الميداني للزيارات',
  archive: 'أرشيف وتقارير الزيارات الميدانية المعتمدة',
  approval: 'منصة مراجعة واعتماد التوصيات والتقارير',
  companies: 'دليل المنشآت الصناعية المسجلة',
  team: 'إدارة وتوزيع أعضاء الفريق الفني'
};

const pageTitles = {
  home: 'الرئيسية',
  calendar: 'التقويم الميداني',
  archive: 'أرشيف الزيارات',
  approval: 'اعتماد التقارير',
  companies: 'دليل الشركات',
  team: 'إدارة الفريق'
};

// التبديل بين الصفحات (Router)
function navigateTo(pageId) {
  state.activePage = pageId;

  // تحديث أزرار التنقل
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.toggle('is-active', btn.dataset.page === pageId);
  });

  // تحديث ظهور الصفحات
  document.querySelectorAll('.page').forEach(page => {
    page.hidden = (page.id !== `page-${pageId}`);
  });

  // تحديث العناوين
  document.getElementById('pageTitle').textContent = pageTitles[pageId] || '';
  document.getElementById('pageSubtitle').textContent = pageSubtitles[pageId] || '';

  renderPageData();
}

// تبديل النمط حسب ساعات اليوم تلقائياً
function autoThemeByTime() {
  const hour = new Date().getHours();
  if (hour >= 18 || hour < 6) {
    document.body.classList.remove('theme-day');
    document.body.classList.add('theme-night');
  } else {
    document.body.classList.remove('theme-night');
    document.body.classList.add('theme-day');
  }
}

// عرض البيانات وتحديث الواجهة
function renderPageData() {
  if (state.activePage === 'home') {
    renderHomeKPIs();
    renderVisitsTable();
  }
}

function renderHomeKPIs() {
  const scheduled = state.visits.filter(v => v.status === 'scheduled').length;
  const completed = state.visits.filter(v => v.status === 'visited').length;
  const totalFactories = state.visits.reduce((acc, curr) => acc + curr.factoriesCount, 0);

  document.getElementById('kpiScheduled').textContent = scheduled;
  document.getElementById('kpiCompleted').textContent = completed;
  document.getElementById('kpiFactories').textContent = totalFactories;
}

function renderVisitsTable() {
  const tbody = document.getElementById('visitsTableBody');
  if (!tbody) return;

  if (state.visits.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 20px;">لا توجد زيارات مسجلة حالياً</td></tr>`;
    return;
  }

  tbody.innerHTML = state.visits.map(v => `
    <tr>
      <td style="font-family: var(--font-mono); font-weight:bold;">${v.id}</td>
      <td>${v.date}</td>
      <td>${v.governorate} — ${v.wilayat}</td>
      <td>${v.factoriesCount} مصانع</td>
      <td><span class="badge ${v.status === 'visited' ? 'badge-completed' : ''}">${v.status === 'visited' ? 'تمت الزيارة' : 'مجدولة'}</span></td>
      <td>
        <button class="btn btn-primary" style="padding:4px 8px; font-size:0.72rem;" onclick="viewVisitDetails('${v.id}')">التفاصيل</button>
      </td>
    </tr>
  `).join('');
}

function switchRole(role) {
  state.role = role;
  console.log(`تم تغيير الصفة إلى: ${role}`);
}

function openNewVisitModal() {
  alert('نافذة إضافة زيارة جديدة قيد التطوير الميداني.');
}

function viewVisitDetails(id) {
  alert(`عرض تفاصيل الزيرة: ${id}`);
}

// تهيئة التطبيق عند التحميل
document.addEventListener('DOMContentLoaded', () => {
  autoThemeByTime();
  navigateTo('home');
});