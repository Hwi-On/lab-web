/**
 * ====================================================================
 * [PART 0] 기본 설정 및 Supabase 클라이언트 연결
 * ====================================================================
 */
const SUPABASE_URL = "https://qckjwpurukvqgwbqispo.supabase.co";
const SUPABASE_KEY = "sb_publishable_wLEpW0OXffcNvtEtVKTyng_ri4PQGRc";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

/**
 * ====================================================================
 * [PART 1] 네비게이션 드롭다운 및 모바일 햄버거 메뉴 제어
 * ====================================================================
 */
const navbar = document.querySelector('.navbar');
const mainLinks = document.querySelectorAll('.main-link');
const subMenuBg = document.querySelector('.sub-menu-bg');
const subLinks = document.querySelectorAll('.sub-links');

let closeTimer = null;

function openMenu() {
  clearTimeout(closeTimer);
  if (navbar && !window.location.pathname.includes('admin') && !window.location.pathname.includes('lab-admin')) {
    navbar.classList.add('menu-open');
  }
}

function closeMenu() {
  closeTimer = setTimeout(() => {
    if (navbar) navbar.classList.remove('menu-open');
  }, 120);
}

if (mainLinks.length > 0) {
  mainLinks.forEach((link) => {
    link.addEventListener('mouseenter', openMenu);
    link.addEventListener('mouseleave', closeMenu);
  });
}

if (subMenuBg) {
  subMenuBg.addEventListener('mouseenter', openMenu);
  subMenuBg.addEventListener('mouseleave', closeMenu);
}

if (subLinks.length > 0) {
  subLinks.forEach((sub) => {
    sub.addEventListener('mouseenter', openMenu);
    sub.addEventListener('mouseleave', closeMenu);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const navContainer = document.querySelector('.nav-container');
  if (navContainer && !document.querySelector('.mobile-menu-toggle')) {
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'mobile-menu-toggle';
    toggleBtn.innerHTML = '<span></span><span></span><span></span>';
    navContainer.appendChild(toggleBtn);

    const backdrop = document.createElement('div');
    backdrop.className = 'mobile-backdrop';
    document.body.appendChild(backdrop);

    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (navbar) navbar.classList.toggle('mobile-open');
      backdrop.classList.toggle('active');
    });

    backdrop.addEventListener('click', () => {
      if (navbar) navbar.classList.remove('mobile-open');
      backdrop.classList.remove('active');
    });
  }

  const mobileMenuLinks = document.querySelectorAll('.main-menu a, .admin-mobile-menu a');
  mobileMenuLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navbar) navbar.classList.remove('mobile-open');
      const backdrop = document.querySelector('.mobile-backdrop');
      if (backdrop) backdrop.classList.remove('active');
    });
  });

  const customToggle = document.getElementById('customSelectToggle');
  const customOptions = document.getElementById('customSelectOptions');
  const customLabel = document.getElementById('customSelectedLabel');
  const customValueInput = document.getElementById('searchSelectValue');

  if (customToggle && customOptions) {
    customToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = customOptions.style.display === 'block';
      customOptions.style.display = isOpen ? 'none' : 'block';
    });

    customOptions.querySelectorAll('li').forEach(li => {
      li.addEventListener('click', (e) => {
        e.stopPropagation();
        const val = li.getAttribute('data-value');
        const text = li.textContent.trim();
        if (customLabel) customLabel.textContent = text;
        if (customValueInput) {
          customValueInput.value = val;
          customValueInput.dispatchEvent(new Event('change', { bubbles: true }));
        }
        customOptions.querySelectorAll('li').forEach(el => el.classList.remove('selected'));
        li.classList.add('selected');
        customOptions.style.display = 'none';
      });
    });

    document.addEventListener('click', () => {
      customOptions.style.display = 'none';
    });
  }
});

/**
 * ====================================================================
 * [PART 2] 파일 변환 및 유틸리티 함수
 * ====================================================================
 */
function convertFileToBase64(fileInputId) {
  return new Promise((resolve) => {
    const fileInput = document.getElementById(fileInputId);
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
      resolve('');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = () => resolve('');
    reader.readAsDataURL(fileInput.files[0]);
  });
}

function convertFilesToMultipleBase64(fileInputId) {
  return new Promise((resolve) => {
    const fileInput = document.getElementById(fileInputId);
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
      resolve([]);
      return;
    }
    const files = Array.from(fileInput.files);
    const promises = files.map(file => {
      return new Promise((res) => {
        const reader = new FileReader();
        reader.onload = (e) => res(e.target.result);
        reader.onerror = () => res(null);
        reader.readAsDataURL(file);
      });
    });
    Promise.all(promises).then(results => resolve(results.filter(r => r !== null)));
  });
}

function escapeHtml(str) {
  return String(str || '').replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

function formatDesc(str) {
  if (!str) return '';
  return escapeHtml(str).replace(/\n/g, '<br>');
}

function formatTitle(str) {
  if (!str) return '';
  let safe = escapeHtml(str);
  safe = safe.replace(/\^(.+?)\^/g, '<sup>$1</sup>');
  safe = safe.replace(/~(.+?)~/g, '<sub>$1</sub>');
  return safe;
}

function parseCustomDate(dateStr, fallbackId) {
  if (!dateStr) return fallbackId || 0;
  const clean = String(dateStr).replace(/[^0-9]/g, '');
  if (clean.length >= 8) {
    const y = parseInt(clean.substring(0, 4), 10);
    const m = parseInt(clean.substring(4, 6), 10) - 1;
    const d = parseInt(clean.substring(6, 8), 10);
    const time = new Date(y, m, d).getTime();
    if (!isNaN(time)) return time;
  }
  if (clean.length >= 4) {
    const y = parseInt(clean.substring(0, 4), 10);
    const time = new Date(y, 0, 1).getTime();
    if (!isNaN(time)) return time;
  }
  return fallbackId || 0;
}

/**
 * ====================================================================
 * [PART 3] Supabase 연동형 통합 관리자(Admin) 클래스
 * ====================================================================
 */
class UnifiedAdminApp {
  constructor() {
    this.authBox = document.getElementById('adminAuthBox');
    this.panelBox = document.getElementById('adminPanelBox');
    this.loginForm = document.getElementById('adminLoginForm');
    this.logoutBtn = document.getElementById('adminLogoutBtn');

    this.editResId = null;
    this.editEduId = null;
    this.editExpId = null;
    this.editNoticeId = null;
    this.editNewsId = null;
    this.editCurrentId = null;
    this.editAlumniId = null;
    this.editPubId = null;
    this.editLabLifeId = null;

    if (!this.authBox) return;

    this.initAuth();
    this.initTabs();
    this.initForms();
  }

  initAuth() {
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        this.showAdminPanel();
      } else {
        this.showLoginForm();
      }
    });

    if (this.loginForm) {
      this.loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const emailInput = document.getElementById('adminEmailInput');
        const pwdInput = document.getElementById('adminPasswordInput');
        const email = emailInput ? emailInput.value.trim() : "";
        const pwd = pwdInput ? pwdInput.value.trim() : "";
        
        const { data, error } = await supabaseClient.auth.signInWithPassword({
          email: email,
          password: pwd
        });

        if (!error && data) {
          this.showAdminPanel();
        } else {
          alert('관리자 로그인 실패: 이메일 또는 비밀번호를 다시 확인해주세요.');
        }
      });
    }

    const handleLogout = async () => {
      await supabaseClient.auth.signOut();
      sessionStorage.removeItem('lab_admin_authenticated');
      this.showLoginForm();
      alert('로그아웃 되었습니다.');
    };

    if (this.logoutBtn) this.logoutBtn.addEventListener('click', handleLogout);
  }

  showAdminPanel() {
    sessionStorage.setItem('lab_admin_authenticated', 'true');
    if (this.authBox) this.authBox.style.display = 'none';
    if (this.panelBox) this.panelBox.style.display = 'block';
    if (this.logoutBtn) this.logoutBtn.style.display = 'inline-block';
    this.renderAll();
  }

  showLoginForm() {
    if (this.authBox) this.authBox.style.display = 'block';
    if (this.panelBox) this.panelBox.style.display = 'none';
    if (this.logoutBtn) this.logoutBtn.style.display = 'none';
  }

  initTabs() {
    const tabBtns = document.querySelectorAll('.admin-tab-btn');
    const tabContents = document.querySelectorAll('.admin-tab-content');

    tabBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        tabBtns.forEach((b) => b.classList.remove('active'));
        tabContents.forEach((c) => c.classList.remove('active'));

        btn.classList.add('active');
        const targetId = btn.getAttribute('data-tab');
        const targetContent = document.getElementById(targetId);
        if (targetContent) targetContent.classList.add('active');
      });
    });
  }

  initForms() {
    // 1. Home Hero
    const heroForm = document.getElementById('formAdminHomeHero');
    if (heroForm) {
      heroForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
          badge: document.getElementById('admHomeBadge').value.trim(),
          title: document.getElementById('admHomeTitle').value.trim(),
          desc: document.getElementById('admHomeDesc').value.trim()
        };
        const { error } = await supabaseClient.from('home_hero').upsert({ id: 1, ...payload });
        if (error) { alert('저장 실패: ' + error.message); return; }
        alert('홈 화면 히어로 배너 정보가 저장되었습니다.');
      });
    }

    // 2. Research Areas
    const resForm = document.getElementById('formAdminResearchItem');
    const btnCancelRes = document.getElementById('btnCancelRes');
    const researchFormTitle = document.getElementById('researchFormTitle');
    if (resForm) {
      resForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
          tag: document.getElementById('admResTag').value.trim(),
          heading: document.getElementById('admResHeading').value.trim(),
          detail: document.getElementById('admResDetail').value.trim()
        };

        if (this.editResId) {
          const { error } = await supabaseClient.from('home_research_areas').update(payload).eq('id', this.editResId);
          if (error) { alert('수정 실패: ' + error.message); return; }
          this.editResId = null;
          resForm.querySelector('button[type="submit"]').textContent = '연구 분야 추가하기';
          if (researchFormTitle) researchFormTitle.textContent = '+ 주요 연구 분야 (Research Areas) 추가';
          if (btnCancelRes) btnCancelRes.style.display = 'none';
          alert('연구 분야 항목이 수정되었습니다.');
        } else {
          const { error } = await supabaseClient.from('home_research_areas').insert([payload]);
          if (error) { alert('등록 실패: ' + error.message); return; }
          alert('연구 분야 항목이 추가되었습니다.');
        }
        resForm.reset();
        await this.renderResearchAreas();
      });

      if (btnCancelRes) {
        btnCancelRes.addEventListener('click', () => {
          this.editResId = null;
          resForm.reset();
          resForm.querySelector('button[type="submit"]').textContent = '연구 분야 추가하기';
          if (researchFormTitle) researchFormTitle.textContent = '+ 주요 연구 분야 (Research Areas) 추가';
          btnCancelRes.style.display = 'none';
        });
      }
    }

    // 3. Director Info
    const dirForm = document.getElementById('formAdminDirector');
    if (dirForm) {
      dirForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const imgBase64 = await convertFileToBase64('admDirImg');
        const payload = {
          name_ko: document.getElementById('admDirNameKo').value.trim(),
          name_en: document.getElementById('admDirNameEn').value.trim(),
          position: document.getElementById('admDirPosition').value.trim(),
          email: document.getElementById('admDirEmail').value.trim(),
          tel: document.getElementById('admDirTel').value.trim(),
          office: document.getElementById('admDirOffice').value.trim(),
          greeting: document.getElementById('admDirGreeting').value.trim()
        };
        if (imgBase64) payload.image = imgBase64;

        const { error } = await supabaseClient.from('director_info').upsert({ id: 1, ...payload });
        if (error) { alert('저장 실패: ' + error.message); return; }
        alert('Director 기본 정보가 저장되었습니다.');
      });
    }

    // 4. Education
    const eduForm = document.getElementById('formAdminEdu');
    const btnCancelEdu = document.getElementById('btnCancelEdu');
    if (eduForm) {
      eduForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
          period: document.getElementById('admEduPeriod').value.trim(),
          degree: document.getElementById('admEduDegree').value.trim(),
          inst: document.getElementById('admEduInst').value.trim()
        };
        if (this.editEduId) {
          const { error } = await supabaseClient.from('direcotr_education').update(payload).eq('id', this.editEduId);
          if (error) { alert('수정 실패: ' + error.message); return; }
          this.editEduId = null;
          eduForm.querySelector('button[type="submit"]').textContent = '학력 추가하기';
          if (btnCancelEdu) btnCancelEdu.style.display = 'none';
          alert('학력 정보가 수정되었습니다.');
        } else {
          const { error } = await supabaseClient.from('direcotr_education').insert([payload]);
          if (error) { alert('등록 실패: ' + error.message); return; }
          alert('학력 정보가 추가되었습니다.');
        }
        eduForm.reset();
        await this.renderEdu();
      });
      if (btnCancelEdu) {
        btnCancelEdu.addEventListener('click', () => {
          this.editEduId = null;
          eduForm.reset();
          eduForm.querySelector('button[type="submit"]').textContent = '학력 추가하기';
          btnCancelEdu.style.display = 'none';
        });
      }
    }

    // 5. Experience
    const expForm = document.getElementById('formAdminExp');
    const btnCancelExp = document.getElementById('btnCancelExp');
    if (expForm) {
      expForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
          category: document.getElementById('admExpCategory').value,
          period: document.getElementById('admExpPeriod').value.trim(),
          degree: document.getElementById('admExpDegree').value.trim(),
          inst: document.getElementById('admExpInst').value.trim()
        };
        if (this.editExpId) {
          const { error } = await supabaseClient.from('director_experience').update(payload).eq('id', this.editExpId);
          if (error) { alert('수정 실패: ' + error.message); return; }
          this.editExpId = null;
          expForm.querySelector('button[type="submit"]').textContent = '이력 추가하기';
          if (btnCancelExp) btnCancelExp.style.display = 'none';
          alert('이력 정보가 수정되었습니다.');
        } else {
          const { error } = await supabaseClient.from('director_experience').insert([payload]);
          if (error) { alert('등록 실패: ' + error.message); return; }
          alert('이력 정보가 추가되었습니다.');
        }
        expForm.reset();
        await this.renderExp();
      });
      if (btnCancelExp) {
        btnCancelExp.addEventListener('click', () => {
          this.editExpId = null;
          expForm.reset();
          expForm.querySelector('button[type="submit"]').textContent = '이력 추가하기';
          btnCancelExp.style.display = 'none';
        });
      }
    }

    // 6. Current Members
    const curForm = document.getElementById('formAdminCurrent');
    if (curForm) {
      curForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const imgBase64 = await convertFileToBase64('admCurImg');
        const roleHidden = document.getElementById('admCurRole');
        const roleVal = roleHidden ? roleHidden.value : 'Postdoctoral Researcher';
        const payload = {
          role: roleVal,
          name: document.getElementById('admCurName').value.trim(),
          tags: document.getElementById('admCurTags').value.trim(),
          email: document.getElementById('admCurEmail').value.trim()
        };
        if (imgBase64) payload.image = imgBase64;

        if (this.editCurrentId) {
          const { error } = await supabaseClient.from('current_members').update(payload).eq('id', this.editCurrentId);
          if (error) { alert('수정 실패: ' + error.message); return; }
          this.editCurrentId = null;
          curForm.querySelector('button[type="submit"]').textContent = '연구원 추가하기';
          alert('연구원 정보가 수정되었습니다.');
        } else {
          const { error } = await supabaseClient.from('current_members').insert([payload]);
          if (error) { alert('등록 실패: ' + error.message); return; }
          alert('연구원이 추가되었습니다.');
        }
        curForm.reset();
        await this.renderCurrent();
      });
    }

    // 7. Alumni
    const alumForm = document.getElementById('formAdminAlumni');
    if (alumForm) {
      alumForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const imgBase64 = await convertFileToBase64('admAlumImg');
        const payload = {
          year: document.getElementById('admAlumYear').value.trim(),
          name: document.getElementById('admAlumName').value.trim(),
          degree: document.getElementById('admAlumDegree').value,
          tags: document.getElementById('admAlumTags').value.trim(),
          email: document.getElementById('admAlumEmail').value.trim()
        };
        if (imgBase64) payload.image = imgBase64;

        if (this.editAlumniId) {
          const { error } = await supabaseClient.from('alumni_members').update(payload).eq('id', this.editAlumniId);
          if (error) { alert('수정 실패: ' + error.message); return; }
          this.editAlumniId = null;
          alumForm.querySelector('button[type="submit"]').textContent = '졸업생 추가하기';
          alert('졸업생 정보가 수정되었습니다.');
        } else {
          const { error } = await supabaseClient.from('alumni_members').insert([payload]);
          if (error) { alert('등록 실패: ' + error.message); return; }
          alert('졸업생이 추가되었습니다.');
        }
        alumForm.reset();
        await this.renderAlumni();
      });
    }

    // 8. Publications & Patents
    const pubForm = document.getElementById('formAdminPub');
    if (pubForm) {
      pubForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const rawDate = document.getElementById('admPubYear').value.trim();
        const formattedDate = rawDate ? rawDate.replace(/-/g, '.') : new Date().toISOString().substring(0, 10).replace(/-/g, '.');
        const payload = {
          type: document.getElementById('admPubType').value,
          title: document.getElementById('admPubTitle').value.trim(),
          authors: document.getElementById('admPubAuthors').value.trim(),
          journal: document.getElementById('admPubJournal').value.trim(),
          year: formattedDate,
          link: document.getElementById('admPubLink').value.trim() || '#'
        };

        if (this.editPubId) {
          const { error } = await supabaseClient.from('publications').update(payload).eq('id', this.editPubId);
          if (error) { alert('수정 실패: ' + error.message); return; }
          this.editPubId = null;
          pubForm.querySelector('button[type="submit"]').textContent = '등록하기';
          alert('항목이 수정되었습니다.');
        } else {
          const { error } = await supabaseClient.from('publications').insert([payload]);
          if (error) { alert('등록 실패: ' + error.message); return; }
          alert('항목이 등록되었습니다.');
        }
        pubForm.reset();
        await this.renderPub();
      });
    }

    // 9. Lab Life
    const lifeForm = document.getElementById('formAdminLabLife');
    if (lifeForm) {
      lifeForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const imgsArray = await convertFilesToMultipleBase64('admLifeImgs');
        const payload = {
          date: document.getElementById('admLifeDate').value.replace(/-/g, '.'),
          title: document.getElementById('admLifeTitle').value.trim(),
          desc: document.getElementById('admLifeDesc').value.trim()
        };
        if (imgsArray.length > 0) payload.images = imgsArray;

        if (this.editLabLifeId) {
          const { error } = await supabaseClient.from('lab_life').update(payload).eq('id', this.editLabLifeId);
          if (error) { alert('수정 실패: ' + error.message); return; }
          this.editLabLifeId = null;
          lifeForm.querySelector('button[type="submit"]').textContent = '활동 등록하기';
          alert('Lab Life 활동이 수정되었습니다.');
        } else {
          payload.views = 0;
          const { error } = await supabaseClient.from('lab_life').insert([payload]);
          if (error) { alert('등록 실패: ' + error.message); return; }
          alert('Lab Life 활동이 등록되었습니다.');
        }
        lifeForm.reset();
        await this.renderLabLife();
      });
    }

    // 10. Notices
    const notForm = document.getElementById('formAdminNotice');
    if (notForm) {
      notForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const imgsArray = await convertFilesToMultipleBase64('admNotImgs');
        const payload = {
          date: document.getElementById('admNotDate').value.replace(/-/g, '.'),
          title: document.getElementById('admNotTitle').value.trim(),
          desc: document.getElementById('admNotDesc').value.trim()
        };
        if (imgsArray.length > 0) payload.images = imgsArray;

        if (this.editNoticeId) {
          const { error } = await supabaseClient.from('notices').update(payload).eq('id', this.editNoticeId);
          if (error) { alert('수정 실패: ' + error.message); return; }
          this.editNoticeId = null;
          notForm.querySelector('button[type="submit"]').textContent = '공지 등록하기';
          alert('공지사항이 수정되었습니다.');
        } else {
          payload.views = 0;
          const { error } = await supabaseClient.from('notices').insert([payload]);
          if (error) { alert('등록 실패: ' + error.message); return; }
          alert('공지사항이 등록되었습니다.');
        }
        notForm.reset();
        await this.renderNotice();
      });
    }

    // 11. News
    const newsForm = document.getElementById('formAdminNews');
    if (newsForm) {
      newsForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const imgsArray = await convertFilesToMultipleBase64('admNewsImgs');
        const payload = {
          date: document.getElementById('admNewsDate').value.replace(/-/g, '.'),
          title: document.getElementById('admNewsTitle').value.trim(),
          desc: document.getElementById('admNewsDesc').value.trim()
        };
        if (imgsArray.length > 0) payload.images = imgsArray;

        if (this.editNewsId) {
          const { error } = await supabaseClient.from('news').update(payload).eq('id', this.editNewsId);
          if (error) { alert('수정 실패: ' + error.message); return; }
          this.editNewsId = null;
          newsForm.querySelector('button[type="submit"]').textContent = '뉴스 게시하기';
          alert('뉴스가 수정되었습니다.');
        } else {
          payload.views = 0;
          const { error } = await supabaseClient.from('news').insert([payload]);
          if (error) { alert('등록 실패: ' + error.message); return; }
          alert('뉴스가 등록되었습니다.');
        }
        newsForm.reset();
        await this.renderNews();
      });
    }
  }

  renderAll() {
    this.renderHomeHeroForm();
    this.renderResearchAreas();
    this.renderDirectorForm();
    this.renderEdu();
    this.renderExp();
    this.renderCurrent();
    this.renderAlumni();
    this.renderPub();
    this.renderLabLife();
    this.renderNotice();
    this.renderNews();
  }

  async renderHomeHeroForm() {
    const { data } = await supabaseClient.from('home_hero').select('*').eq('id', 1).single();
    if (!document.getElementById('admHomeBadge')) return;
    if (data) {
      document.getElementById('admHomeBadge').value = data.badge || '';
      document.getElementById('admHomeTitle').value = data.title || '';
      document.getElementById('admHomeDesc').value = data.desc || '';
    }
  }

  async renderResearchAreas() {
    const tbody = document.getElementById('tableBodyResearch');
    if (!tbody) return;
    const { data: list } = await supabaseClient.from('home_research_areas').select('*').order('id', { ascending: true });
    tbody.innerHTML = '';
    if (!list || list.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:15px; color:#94a3b8;">등록된 연구 분야가 없습니다.</td></tr>';
      return;
    }
    list.forEach((item) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><span class="tag-chip">${escapeHtml(item.tag)}</span></td>
        <td><strong>${escapeHtml(item.heading)}</strong></td>
        <td>${escapeHtml(item.detail)}</td>
        <td style="text-align:center; display:flex; gap:6px; justify-content:center;">
          <button class="btn-edit-res" data-id="${item.id}" style="background:#e0f2fe; color:#0284c7; border:1px solid #bae6fd; padding:5px 10px; border-radius:4px; font-size:0.78rem; font-weight:700; cursor:pointer;">수정</button>
          <button class="btn-delete-item" data-table="home_research_areas" data-id="${item.id}">삭제</button>
        </td>`;
      tbody.appendChild(tr);
    });

    tbody.querySelectorAll('.btn-edit-res').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(e.currentTarget.getAttribute('data-id'), 10);
        const item = list.find(x => x.id === id);
        if (item) {
          this.editResId = id;
          document.getElementById('admResTag').value = item.tag;
          document.getElementById('admResHeading').value = item.heading;
          document.getElementById('admResDetail').value = item.detail;
          document.querySelector('#formAdminResearchItem button[type="submit"]').textContent = '연구 분야 수정 완료';
          const resTitleEl = document.getElementById('researchFormTitle');
          if (resTitleEl) resTitleEl.textContent = '연구 분야 수정하기';
          const btnCancelRes = document.getElementById('btnCancelRes');
          if (btnCancelRes) btnCancelRes.style.display = 'inline-block';
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    });
    this.attachSupabaseDelete(tbody, 'home_research_areas', () => this.renderResearchAreas());
  }

  async renderDirectorForm() {
    const { data } = await supabaseClient.from('director_info').select('*').eq('id', 1).single();
    if (!document.getElementById('admDirNameKo')) return;
    if (data) {
      document.getElementById('admDirNameKo').value = data.name_ko || '';
      document.getElementById('admDirNameEn').value = data.name_en || '';
      document.getElementById('admDirPosition').value = data.position || '';
      document.getElementById('admDirEmail').value = data.email || '';
      document.getElementById('admDirTel').value = data.tel || '';
      document.getElementById('admDirOffice').value = data.office || '';
      document.getElementById('admDirGreeting').value = data.greeting || '';
    }
  }

  async renderEdu() {
    const tbody = document.getElementById('tableBodyEdu');
    if (!tbody) return;
    const { data: list } = await supabaseClient.from('direcotr_education').select('*').order('id', { ascending: true });
    tbody.innerHTML = '';
    if (!list || list.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:15px; color:#94a3b8;">등록된 학력이 없습니다.</td></tr>';
      return;
    }
    list.forEach((item) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${escapeHtml(item.period)}</td>
        <td><strong>${escapeHtml(item.degree)}</strong></td>
        <td>${escapeHtml(item.inst)}</td>
        <td style="text-align:center; display:flex; gap:6px; justify-content:center;">
          <button class="btn-edit-edu" data-id="${item.id}" style="background:#e0f2fe; color:#0284c7; border:1px solid #bae6fd; padding:5px 10px; border-radius:4px; font-size:0.78rem; font-weight:700; cursor:pointer;">수정</button>
          <button class="btn-delete-item" data-table="direcotr_education" data-id="${item.id}">삭제</button>
        </td>`;
      tbody.appendChild(tr);
    });

    tbody.querySelectorAll('.btn-edit-edu').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(e.currentTarget.getAttribute('data-id'), 10);
        const item = list.find(x => x.id === id);
        if (item) {
          this.editEduId = id;
          document.getElementById('admEduPeriod').value = item.period;
          document.getElementById('admEduDegree').value = item.degree;
          document.getElementById('admEduInst').value = item.inst;
          document.querySelector('#formAdminEdu button[type="submit"]').textContent = '학력 수정 완료';
          const btnCancelEdu = document.getElementById('btnCancelEdu');
          if (btnCancelEdu) btnCancelEdu.style.display = 'inline-block';
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    });
    this.attachSupabaseDelete(tbody, 'direcotr_education', () => this.renderEdu());
  }

  async renderExp() {
    const tbody = document.getElementById('tableBodyExp');
    if (!tbody) return;
    const { data: list } = await supabaseClient.from('director_experience').select('*').order('id', { ascending: true });
    tbody.innerHTML = '';
    if (!list || list.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:15px; color:#94a3b8;">등록된 경력 및 활동이 없습니다.</td></tr>';
      return;
    }
    list.forEach((item) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><span class="tag-chip">${escapeHtml(item.category || '경력 (Experience)')}</span></td>
        <td>${escapeHtml(item.period)}</td>
        <td><strong>${escapeHtml(item.degree)}</strong></td>
        <td>${escapeHtml(item.inst)}</td>
        <td style="text-align:center; display:flex; gap:6px; justify-content:center;">
          <button class="btn-edit-exp" data-id="${item.id}" style="background:#e0f2fe; color:#0284c7; border:1px solid #bae6fd; padding:5px 10px; border-radius:4px; font-size:0.78rem; font-weight:700; cursor:pointer;">수정</button>
          <button class="btn-delete-item" data-table="director_experience" data-id="${item.id}">삭제</button>
        </td>`;
      tbody.appendChild(tr);
    });

    tbody.querySelectorAll('.btn-edit-exp').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(e.currentTarget.getAttribute('data-id'), 10);
        const item = list.find(x => x.id === id);
        if (item) {
          this.editExpId = id;
          document.getElementById('admExpCategory').value = item.category || '경력 (Experience)';
          document.getElementById('admExpPeriod').value = item.period;
          document.getElementById('admExpDegree').value = item.degree;
          document.getElementById('admExpInst').value = item.inst;
          document.querySelector('#formAdminExp button[type="submit"]').textContent = '이력 수정 완료';
          const btnCancelExp = document.getElementById('btnCancelExp');
          if (btnCancelExp) btnCancelExp.style.display = 'inline-block';
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    });
    this.attachSupabaseDelete(tbody, 'director_experience', () => this.renderExp());
  }

  async renderCurrent() {
    const tbody = document.getElementById('tableBodyCurrent');
    if (!tbody) return;
    const { data: list } = await supabaseClient.from('current_members').select('*').order('id', { ascending: false });
    tbody.innerHTML = '';
    if (!list || list.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:20px; color:#94a3b8;">등록된 연구원이 없습니다.</td></tr>';
      return;
    }
    list.forEach((item) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><span class="profile-role-tag">${escapeHtml(item.role)}</span></td>
        <td><strong>${escapeHtml(item.name)}</strong></td>
        <td>${escapeHtml(item.tags || '-')}</td>
        <td style="text-align:center; display:flex; gap:6px; justify-content:center;">
          <button class="btn-edit-item" data-id="${item.id}" style="background:#e0f2fe; color:#0284c7; border:1px solid #bae6fd; padding:5px 10px; border-radius:4px; font-size:0.78rem; font-weight:700; cursor:pointer;">수정</button>
          <button class="btn-delete-item" data-table="current_members" data-id="${item.id}">삭제</button>
        </td>`;
      tbody.appendChild(tr);
    });

    tbody.querySelectorAll('.btn-edit-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(e.currentTarget.getAttribute('data-id'), 10);
        const item = list.find(x => x.id === id);
        if (item) {
          this.editCurrentId = id;
          const roleHidden = document.getElementById('admCurRole');
          if (roleHidden) roleHidden.value = item.role;
          document.getElementById('admCurName').value = item.name;
          document.getElementById('admCurTags').value = item.tags || '';
          document.getElementById('admCurEmail').value = item.email;
          document.querySelector('#formAdminCurrent button[type="submit"]').textContent = '연구원 수정 완료';
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    });
    this.attachSupabaseDelete(tbody, 'current_members', () => this.renderCurrent());
  }

  async renderAlumni() {
    const tbody = document.getElementById('tableBodyAlumni');
    if (!tbody) return;
    const { data: list } = await supabaseClient.from('alumni_members').select('*').order('id', { ascending: false });
    tbody.innerHTML = '';
    if (!list || list.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:20px; color:#94a3b8;">등록된 졸업생이 없습니다.</td></tr>';
      return;
    }
    list.forEach((item) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="text-align:center; font-weight:700;">${escapeHtml(item.year)}</td>
        <td><strong>${escapeHtml(item.name)}</strong> (${escapeHtml(item.degree)})</td>
        <td>${escapeHtml(item.tags || '-')}</td>
        <td style="text-align:center; display:flex; gap:6px; justify-content:center;">
          <button class="btn-edit-item" data-id="${item.id}" style="background:#e0f2fe; color:#0284c7; border:1px solid #bae6fd; padding:5px 10px; border-radius:4px; font-size:0.78rem; font-weight:700; cursor:pointer;">수정</button>
          <button class="btn-delete-item" data-table="alumni_members" data-id="${item.id}">삭제</button>
        </td>`;
      tbody.appendChild(tr);
    });

    tbody.querySelectorAll('.btn-edit-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(e.currentTarget.getAttribute('data-id'), 10);
        const item = list.find(x => x.id === id);
        if (item) {
          this.editAlumniId = id;
          document.getElementById('admAlumYear').value = item.year;
          document.getElementById('admAlumName').value = item.name;
          document.getElementById('admAlumDegree').value = item.degree;
          document.getElementById('admAlumTags').value = item.tags || '';
          document.getElementById('admAlumEmail').value = item.email;
          document.querySelector('#formAdminAlumni button[type="submit"]').textContent = '졸업생 수정 완료';
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    });
    this.attachSupabaseDelete(tbody, 'alumni_members', () => this.renderAlumni());
  }

  async renderPub() {
    const tbody = document.getElementById('tableBodyPub');
    if (!tbody) return;
    const { data: list } = await supabaseClient.from('publications').select('*');
    tbody.innerHTML = '';
    if (!list || list.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:20px; color:#94a3b8;">등록된 항목이 없습니다.</td></tr>';
      return;
    }
    const sortedList = list.slice().sort((a, b) => parseCustomDate(b.year, b.id) - parseCustomDate(a.year, a.id));

    sortedList.forEach((item) => {
      const typeLabel = item.type === 'patent' ? 'Patent' : 'Paper';
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="text-align:center;"><span class="pub-type-badge ${item.type || 'paper'}">${typeLabel}</span></td>
        <td><strong>${formatTitle(item.title)}</strong><br><span style="font-size:0.82rem; color:#64748b;">${formatTitle(item.authors)} &bull; <em>${escapeHtml(item.journal)}</em></span></td>
        <td style="text-align:center;">${escapeHtml(item.year)}</td>
        <td style="text-align:center; display:flex; gap:6px; justify-content:center;">
          <button class="btn-edit-item" data-id="${item.id}" style="background:#e0f2fe; color:#0284c7; border:1px solid #bae6fd; padding:5px 10px; border-radius:4px; font-size:0.78rem; font-weight:700; cursor:pointer;">수정</button>
          <button class="btn-delete-item" data-table="publications" data-id="${item.id}">삭제</button>
        </td>`;
      tbody.appendChild(tr);
    });

    tbody.querySelectorAll('.btn-edit-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(e.currentTarget.getAttribute('data-id'), 10);
        const item = list.find(x => x.id === id);
        if (item) {
          this.editPubId = id;
          document.getElementById('admPubType').value = item.type || 'paper';
          document.getElementById('admPubYear').value = (item.year || '').replace(/\./g, '-');
          document.getElementById('admPubTitle').value = item.title;
          document.getElementById('admPubAuthors').value = item.authors;
          document.getElementById('admPubJournal').value = item.journal;
          document.getElementById('admPubLink').value = item.link !== '#' ? item.link : '';
          document.querySelector('#formAdminPub button[type="submit"]').textContent = '수정 완료';
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    });
    this.attachSupabaseDelete(tbody, 'publications', () => this.renderPub());
  }

  async renderLabLife() {
    const tbody = document.getElementById('tableBodyLabLife');
    if (!tbody) return;
    const { data: list } = await supabaseClient.from('lab_life').select('*').order('id', { ascending: false });
    tbody.innerHTML = '';
    if (!list || list.length === 0) {
      tbody.innerHTML = '<tr><td colspan="3" style="text-align:center; padding:20px; color:#94a3b8;">등록된 활동이 없습니다.</td></tr>';
      return;
    }
    list.forEach((item) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="text-align:center;">${escapeHtml(item.date)}</td>
        <td><strong>${escapeHtml(item.title)}</strong></td>
        <td style="text-align:center; display:flex; gap:6px; justify-content:center;">
          <button class="btn-edit-item" data-id="${item.id}" style="background:#e0f2fe; color:#0284c7; border:1px solid #bae6fd; padding:5px 10px; border-radius:4px; font-size:0.78rem; font-weight:700; cursor:pointer;">수정</button>
          <button class="btn-delete-item" data-table="lab_life" data-id="${item.id}">삭제</button>
        </td>`;
      tbody.appendChild(tr);
    });

    tbody.querySelectorAll('.btn-edit-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(e.currentTarget.getAttribute('data-id'), 10);
        const item = list.find(x => x.id === id);
        if (item) {
          this.editLabLifeId = id;
          document.getElementById('admLifeDate').value = (item.date || '').replace(/\./g, '-');
          document.getElementById('admLifeTitle').value = item.title;
          document.getElementById('admLifeDesc').value = item.desc || '';
          document.querySelector('#formAdminLabLife button[type="submit"]').textContent = '활동 수정 완료';
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    });
    this.attachSupabaseDelete(tbody, 'lab_life', () => this.renderLabLife());
  }

  async renderNotice() {
    const tbody = document.getElementById('tableBodyNotice');
    if (!tbody) return;
    const { data: list } = await supabaseClient.from('notices').select('*').order('id', { ascending: false });
    tbody.innerHTML = '';
    if (!list || list.length === 0) {
      tbody.innerHTML = '<tr><td colspan="3" style="text-align:center; padding:20px; color:#94a3b8;">등록된 공지사항이 없습니다.</td></tr>';
      return;
    }
    list.forEach((item) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="text-align:center;">${escapeHtml(item.date)}</td>
        <td><strong>${escapeHtml(item.title)}</strong></td>
        <td style="text-align:center; display:flex; gap:6px; justify-content:center;">
          <button class="btn-edit-item" data-id="${item.id}" style="background:#e0f2fe; color:#0284c7; border:1px solid #bae6fd; padding:5px 10px; border-radius:4px; font-size:0.78rem; font-weight:700; cursor:pointer;">수정</button>
          <button class="btn-delete-item" data-table="notices" data-id="${item.id}">삭제</button>
        </td>`;
      tbody.appendChild(tr);
    });

    tbody.querySelectorAll('.btn-edit-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(e.currentTarget.getAttribute('data-id'), 10);
        const item = list.find(x => x.id === id);
        if (item) {
          this.editNoticeId = id;
          document.getElementById('admNotDate').value = (item.date || '').replace(/\./g, '-');
          document.getElementById('admNotTitle').value = item.title;
          document.getElementById('admNotDesc').value = item.desc || '';
          document.querySelector('#formAdminNotice button[type="submit"]').textContent = '공지 수정 완료';
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    });
    this.attachSupabaseDelete(tbody, 'notices', () => this.renderNotice());
  }

  async renderNews() {
    const tbody = document.getElementById('tableBodyNews');
    if (!tbody) return;
    const { data: list } = await supabaseClient.from('news').select('*').order('id', { ascending: false });
    tbody.innerHTML = '';
    if (!list || list.length === 0) {
      tbody.innerHTML = '<tr><td colspan="3" style="text-align:center; padding:20px; color:#94a3b8;">등록된 뉴스가 없습니다.</td></tr>';
      return;
    }
    list.forEach((item) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="text-align:center;">${escapeHtml(item.date)}</td>
        <td><strong>${escapeHtml(item.title)}</strong></td>
        <td style="text-align:center; display:flex; gap:6px; justify-content:center;">
          <button class="btn-edit-item" data-id="${item.id}" style="background:#e0f2fe; color:#0284c7; border:1px solid #bae6fd; padding:5px 10px; border-radius:4px; font-size:0.78rem; font-weight:700; cursor:pointer;">수정</button>
          <button class="btn-delete-item" data-table="news" data-id="${item.id}">삭제</button>
        </td>`;
      tbody.appendChild(tr);
    });

    tbody.querySelectorAll('.btn-edit-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(e.currentTarget.getAttribute('data-id'), 10);
        const item = list.find(x => x.id === id);
        if (item) {
          this.editNewsId = id;
          document.getElementById('admNewsDate').value = (item.date || '').replace(/\./g, '-');
          document.getElementById('admNewsTitle').value = item.title;
          document.getElementById('admNewsDesc').value = item.desc || '';
          document.querySelector('#formAdminNews button[type="submit"]').textContent = '뉴스 수정 완료';
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    });
    this.attachSupabaseDelete(tbody, 'news', () => this.renderNews());
  }

  attachSupabaseDelete(tbody, tableName, callback) {
    tbody.querySelectorAll('.btn-delete-item').forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        const id = parseInt(e.currentTarget.getAttribute('data-id'), 10);
        if (confirm('선택한 항목을 삭제하시겠습니까?')) {
          const { error } = await supabaseClient.from(tableName).delete().eq('id', id);
          if (error) {
            alert('삭제 실패: ' + error.message);
            return;
          }
          await callback();
        }
      });
    });
  }
}

/**
 * ====================================================================
 * [PART 4] 일반 방문자용 공통 페이지 데이터 동기화 엔진
 * ====================================================================
 */
function syncPublicPages() {
  const labConfig = {
    shortName: 'NCB-LAB',
    fullName: 'Neuro Chemical Biology',
    logoFileName: 'Symbol.png',
    researchTags: [
      'Neurochemistry',
      'Chemical Biology',
      'Molecular Neuroscience',
      'Translational Research'
    ]
  };

  document.title = labConfig.shortName;

  const logoMarks = document.querySelectorAll('.logo-mark, .footer-logo-mark');
  logoMarks.forEach((mark) => {
    mark.style.background = 'transparent';
    mark.style.border = 'none';
    mark.innerHTML = `<img src="${labConfig.logoFileName}" alt="Lab Symbol" style="width: 100%; height: 100%; object-fit: contain; display: block; border-radius: 8px;" />`;
  });

  const shortNameEls = document.querySelectorAll('.logo-title, .footer-brand-title');
  shortNameEls.forEach((el) => { el.textContent = labConfig.shortName; });

  const fullNameEls = document.querySelectorAll('.logo-desc, .footer-brand-sub');
  fullNameEls.forEach((el) => { el.textContent = labConfig.fullName; });

  const tagClouds = document.querySelectorAll('.footer-tag-cloud');
  tagClouds.forEach((cloud) => {
    cloud.innerHTML = '';
    labConfig.researchTags.forEach((tagName) => {
      const tagSpan = document.createElement('span'); 
      tagSpan.className = 'f-tag';
      tagSpan.textContent = tagName;
      cloud.appendChild(tagSpan);
    });
  });

  const copyrightEls = document.querySelectorAll('.copyright-text');
  copyrightEls.forEach((el) => {
    el.innerHTML = `&copy; 2026 ${labConfig.shortName}. All rights reserved.`;
  });

  syncPublicPagesInternal();
}

async function syncPublicPagesInternal() {
  // 1. Home Hero
  const homeBadgeEl = document.getElementById('homeHeroBadge');
  if (homeBadgeEl) {
    const { data: heroData } = await supabaseClient.from('home_hero').select('*').eq('id', 1).single();
    if (heroData) {
      homeBadgeEl.textContent = heroData.badge;
      const homeTitleEl = document.getElementById('homeHeroTitle');
      if (homeTitleEl) homeTitleEl.innerHTML = heroData.title;
      const homeDescEl = document.getElementById('homeHeroDesc');
      if (homeDescEl) homeDescEl.textContent = heroData.desc;
    }
  }

  // 2. Home Research Areas Grid
  const homeResearchGrid = document.getElementById('homeResearchGrid');
  if (homeResearchGrid) {
    const { data: researchList } = await supabaseClient.from('home_research_areas').select('*').order('id', { ascending: true });
    homeResearchGrid.innerHTML = '';
    if (!researchList || researchList.length === 0) {
      homeResearchGrid.innerHTML = '<div class="empty-state-card"><p>등록된 연구 분야가 없습니다.</p></div>';
    } else {
      researchList.forEach(item => {
        const card = document.createElement('div');
        card.className = 'modern-card';
        card.innerHTML = `<div class="card-tag">${escapeHtml(item.tag)}</div><h3 class="card-heading">${escapeHtml(item.heading)}</h3><p class="card-detail">${escapeHtml(item.detail)}</p>`;
        homeResearchGrid.appendChild(card);
      });
    }
  }

  // 3. Home Board (Notices + News)
  const homeBoardBox = document.getElementById('homeBoardContainer');
  if (homeBoardBox) {
    const { data: supabaseNotices } = await supabaseClient.from('notices').select('*').order('id', { ascending: false });
    const { data: supabaseNews } = await supabaseClient.from('news').select('*').order('id', { ascending: false });

    const notices = (supabaseNotices || []).map(n => ({ ...n, originType: 'notice' }));
    const news = (supabaseNews || []).map(w => ({ ...w, originType: 'news' }));
    const combined = [...notices, ...news].sort((a, b) => parseCustomDate(b.date, b.id) - parseCustomDate(a.date, a.id));
    const recentThree = combined.slice(0, 3);
    
    homeBoardBox.innerHTML = '';
    if (recentThree.length === 0) {
      homeBoardBox.innerHTML = '<div class="empty-state-card"><p>등록된 게시물이 없습니다.</p></div>';
    } else {
      recentThree.forEach((item) => {
        const isNews = item.originType === 'news';
        const tagText = isNews ? 'News' : 'Notice';
        const tagClass = isNews ? 'notice-tag news-tag' : 'notice-tag';
        const box = document.createElement('article');
        box.className = 'notice-box'; box.style.cursor = 'pointer';
        box.innerHTML = `<span class="${tagClass}">${escapeHtml(tagText)}</span><h3 class="notice-title">${escapeHtml(item.title)}</h3><div class="notice-desc">${formatDesc(item.desc || '')}</div><span class="notice-date">${escapeHtml(item.date || '')}</span>`;
        box.addEventListener('click', () => { location.href = `view.html?type=${item.originType}&id=${item.id}`; });
        homeBoardBox.appendChild(box);
      });
    }
  }

  // 4. Home Publications
  const homePubBox = document.getElementById('homePubContainer');
  if (homePubBox) {
    const { data: allPubs } = await supabaseClient.from('publications').select('*');
    const sortedPubs = (allPubs || []).sort((a, b) => parseCustomDate(b.year, b.id) - parseCustomDate(a.year, a.id));
    const papersOnly = sortedPubs.filter(p => (p.type || 'paper') === 'paper').slice(0, 5);
    homePubBox.innerHTML = '';
    if (papersOnly.length === 0) {
      homePubBox.innerHTML = '<div class="empty-state-card"><p>등록된 논문이 없습니다.</p></div>';
    } else {
      papersOnly.forEach(pub => {
        const card = document.createElement('article');
        card.className = 'pub-card'; card.style.cursor = 'pointer';
        card.innerHTML = `<div class="pub-info"><h3 class="pub-title">${formatTitle(pub.title)}</h3><div class="pub-meta"><span class="pub-authors">${formatTitle(pub.authors)}</span><span class="pub-journal">${escapeHtml(pub.journal)}</span><span class="pub-year">${escapeHtml(pub.year)}</span></div></div><a href="${escapeHtml(pub.link || '#')}" class="pub-link-icon" target="_blank" rel="noopener noreferrer"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></a>`;
        card.addEventListener('click', (e) => { if (!e.target.closest('.pub-link-icon') && pub.link && pub.link !== '#') window.open(pub.link, '_blank'); });
        homePubBox.appendChild(card);
      });
    }
  }

  // 5. Director Page
  const dirNameKo = document.querySelector('.pi-name');
  if (dirNameKo) {
    const { data: dir } = await supabaseClient.from('director_info').select('*').eq('id', 1).single();
    if (dir) {
      dirNameKo.textContent = dir.name_ko || '';
      const dirNameEn = document.querySelector('.pi-eng-name');
      if (dirNameEn) dirNameEn.textContent = dir.name_en || '';
      const dirPos = document.querySelector('.pi-position');
      if (dirPos) dirPos.textContent = dir.position || '';
      const dirText = document.querySelector('.cv-text');
      if (dirText) dirText.textContent = dir.greeting || '';
      const avatarPlaceholder = document.querySelector('.avatar-placeholder');
      if (avatarPlaceholder) {
        if (dir.image) {
          avatarPlaceholder.innerHTML = `<img src="${dir.image}" alt="프로필 사진" style="width:100%; height:100%; object-fit:cover; border-radius:10px;" />`;
        } else {
          avatarPlaceholder.innerHTML = `<span>Photo</span>`;
        }
      }
      const contactPillList = document.querySelector('.contact-pill-list');
      if (contactPillList) {
        contactPillList.innerHTML = '';
        let hasContact = false;
        if (dir.email) { contactPillList.innerHTML += `<div class="pill-row"><strong>E-mail</strong> <span>${escapeHtml(dir.email)}</span></div>`; hasContact = true; }
        if (dir.tel) { contactPillList.innerHTML += `<div class="pill-row"><strong>Tel</strong> <span>${escapeHtml(dir.tel)}</span></div>`; hasContact = true; }
        if (dir.office) { contactPillList.innerHTML += `<div class="pill-row"><strong>Office</strong> <span>${escapeHtml(dir.office)}</span></div>`; hasContact = true; }
        contactPillList.style.display = hasContact ? 'flex' : 'none';
      }
    }

    const cvSections = document.querySelectorAll('.cv-section');
    if (cvSections && cvSections.length > 0) {
      for (const section of cvSections) {
        const titleEl = section.querySelector('.cv-title');
        const wrap = section.querySelector('.edu-timeline-wrap');
        if (!titleEl || !wrap) continue;
        const titleText = titleEl.textContent.trim();

        if (titleText.includes('Education')) {
          const { data: eduList } = await supabaseClient.from('direcotr_education').select('*').order('id', { ascending: true });
          wrap.innerHTML = '';
          if (!eduList || eduList.length === 0) {
            wrap.innerHTML = '<div class="empty-state-card" style="padding:20px; font-size:0.9rem;"><p>등록된 학력 정보가 없습니다.</p></div>';
          } else {
            eduList.slice().reverse().forEach(item => {
              const row = document.createElement('div'); row.className = 'edu-row';
              row.innerHTML = `<div class="edu-period"><span class="edu-badge">${escapeHtml(item.period)}</span></div><div class="edu-details"><span class="edu-degree">${escapeHtml(item.degree)}</span><span class="edu-sep">/</span><span class="edu-institution">${escapeHtml(item.inst)}</span></div>`;
              wrap.appendChild(row);
            });
          }
        } else if (titleText.includes('Experience') || titleText.includes('Professional')) {
          const { data: expList } = await supabaseClient.from('director_experience').select('*').order('id', { ascending: true });
          wrap.innerHTML = '';
          if (!expList || expList.length === 0) {
            wrap.innerHTML = '<div class="empty-state-card" style="padding:20px; font-size:0.9rem;"><p>등록된 경력 및 활동 정보가 없습니다.</p></div>';
          } else {
            expList.slice().reverse().forEach(item => {
              const row = document.createElement('div'); row.className = 'edu-row';
              row.innerHTML = `<div class="edu-period"><span class="edu-badge">${escapeHtml(item.period)}</span></div><div class="edu-details"><span class="edu-degree" style="font-weight: 600 !important;">${escapeHtml(item.degree)}</span><span class="edu-sep">/</span><span class="edu-institution">${escapeHtml(item.inst)}</span></div>`;
              wrap.appendChild(row);
            });
          }
        }
      }
    }
  }

  // 6. Current Members Page
  const cResearcher = document.getElementById('containerResearcher');
  const cTrainee = document.getElementById('containerTrainee');
  if (cResearcher || cTrainee) {
    const { data: list } = await supabaseClient.from('current_members').select('*').order('id', { ascending: false });
    if (cResearcher) cResearcher.innerHTML = '';
    if (cTrainee) cTrainee.innerHTML = '';
    const safeList = list || [];
    const traineeList = safeList.filter(m => (m.role || '').includes('교육생') || (m.role || '').toLowerCase().includes('trainee'));
    const researcherList = safeList.filter(m => !traineeList.includes(m));

    const renderGroup = (arr, container) => {
      if (!container) return;
      if (arr.length === 0) { container.innerHTML = '<div class="empty-state-card" style="grid-column:1/-1;"><p>등록된 멤버가 없습니다.</p></div>'; return; }
      arr.forEach((m) => {
        const tagsArray = (m.tags || '').split(',').map(t => t.trim()).filter(t => t.length > 0);
        const tagsHtml = tagsArray.map(t => `<span class="tag-chip">${escapeHtml(t)}</span>`).join('');
        const photoHtml = m.image ? `<img src="${m.image}" alt="프로필 사진" style="width:100%; height:100%; object-fit:cover; border-radius:8px;" />` : `<span>Photo</span>`;
        const card = document.createElement('article'); card.className = 'profile-h-card';
        card.innerHTML = `<div class="profile-photo-square">${photoHtml}</div><div class="profile-info-side"><span class="profile-role-tag">${escapeHtml(m.role)}</span><h4 class="profile-name">${escapeHtml(m.name)}</h4><div class="profile-tags">${tagsHtml}</div><div class="profile-contact"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg><span>${escapeHtml(m.email)}</span></div></div>`;
        container.appendChild(card);
      });
    };
    renderGroup(researcherList, cResearcher);
    renderGroup(traineeList, cTrainee);
  }

  // 7. Alumni Page
  const alumniMainContainer = document.getElementById('alumniContainer');
  if (alumniMainContainer) {
    const { data: list } = await supabaseClient.from('alumni_members').select('*').order('year', { ascending: false });
    alumniMainContainer.innerHTML = '';
    if (!list || list.length === 0) { alumniMainContainer.innerHTML = '<div class="empty-state-card"><p>등록된 졸업생이 없습니다.</p></div>'; return; }
    const groupedByYear = {};
    list.forEach((a) => { const yr = a.year || 'Unknown'; if (!groupedByYear[yr]) groupedByYear[yr] = []; groupedByYear[yr].push(a); });
    const sortedYears = Object.keys(groupedByYear).sort((a, b) => b - a);
    sortedYears.forEach((year) => {
      const section = document.createElement('section'); section.className = 'member-category-section';
      const header = document.createElement('div'); header.className = 'category-header'; header.innerHTML = `<h3 class="category-title">Class of ${year}</h3>`; section.appendChild(header);
      const grid = document.createElement('div'); grid.className = 'profile-horizontal-grid';
      groupedByYear[year].forEach((a) => {
        const tagsArray = (a.tags || '').split(',').map(t => t.trim()).filter(t => t.length > 0);
        const tagsHtml = tagsArray.map(t => `<span class="tag-chip">${escapeHtml(t)}</span>`).join('');
        const photoHtml = a.image ? `<img src="${a.image}" alt="프로필 사진" style="width:100%; height:100%; object-fit:cover; border-radius:8px;" />` : `<span>Photo</span>`;
        const card = document.createElement('article'); card.className = 'profile-h-card';
        card.innerHTML = `<div class="profile-photo-square">${photoHtml}</div><div class="profile-info-side"><span class="profile-role-tag">${escapeHtml(a.degree)}</span><h4 class="profile-name">${escapeHtml(a.name)}</h4><div class="profile-tags">${tagsHtml}</div><div class="profile-contact"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg><span>${escapeHtml(a.email || 'alumni@univ.ac.kr')}</span></div></div>`;
        grid.appendChild(card);
      });
      section.appendChild(grid); alumniMainContainer.appendChild(section);
    });
  }

  // 8. View Detail Page
  const viewTitle = document.getElementById('viewTitle');
  if (viewTitle) {
    const params = new URLSearchParams(location.search);
    const type = params.get('type');
    const id = params.get('id');
    let tableName = 'notices';
    let catName = 'NOTICE';

    if (type === 'news') { tableName = 'news'; catName = 'NEWS'; }
    else if (type === 'lablife') { tableName = 'lab_life'; catName = 'LAB LIFE'; }

    const { data: item, error } = await supabaseClient.from(tableName).select('*').eq('id', id).single();
    if (error || !item) {
      viewTitle.textContent = '해당 게시물을 찾을 수 없습니다.';
      const c = document.getElementById('viewContent'); if(c) c.textContent = '삭제되었거나 잘못된 접근입니다.';
      return;
    }

    const newViews = (item.views || 0) + 1;
    await supabaseClient.from(tableName).update({ views: newViews }).eq('id', id);

    document.getElementById('viewPageCategory').textContent = catName;
    document.getElementById('viewBadge').textContent = catName;
    document.getElementById('viewTitle').textContent = item.title;
    document.getElementById('viewDate').textContent = item.date;
    document.getElementById('viewViews').textContent = newViews;
    document.getElementById('viewContent').innerHTML = formatDesc(item.desc || '');

    const galleryBox = document.getElementById('viewImagesGallery');
    const allImgs = [];
    if (item.images && item.images.length > 0) allImgs.push(...item.images);
    else if (item.image) allImgs.push(item.image);
    if (allImgs.length > 0 && galleryBox) {
      galleryBox.innerHTML = '';
      allImgs.forEach(src => { 
        let wrapper = document.createElement('div'); 
        wrapper.className = 'view-single-img-wrap'; 
        wrapper.innerHTML = `<img src="${src}" alt="이미지" />`; 
        galleryBox.appendChild(wrapper); 
      });
      galleryBox.style.display = 'block';
    }
  }
}

/**
 * ====================================================================
 * [PART 5] 게시판 및 논문/특허 전용 통합 검색 클래스
 * ====================================================================
 */
class DedicatedGenericViewer {
  constructor({ tableName, targetType, containerId, paginationId, selectId, searchInputId, searchBtnId, renderCardCallback }) {
    this.tableName = tableName;
    this.targetType = targetType;
    this.container = document.getElementById(containerId);
    this.paginationContainer = document.getElementById(paginationId);
    this.selectEl = document.getElementById(selectId);
    this.searchInput = document.getElementById(searchInputId);
    this.searchBtn = document.getElementById(searchBtnId);
    this.renderCardCallback = renderCardCallback;
    this.itemsPerPage = 10;
    this.currentPage = 1;

    if (!this.container) return;
    this.initAsyncData();
  }

  async initAsyncData() {
    let query = supabaseClient.from(this.tableName).select('*');
    const { data: allItems } = await query;
    let safeList = allItems || [];

    if (this.tableName === 'publications' && this.targetType) {
      safeList = safeList.filter(item => (item.type || 'paper') === this.targetType);
    }

    this.baseList = safeList.sort((a, b) => parseCustomDate(b.year || b.date, b.id) - parseCustomDate(a.year || a.date, a.id));
    this.filteredList = [...this.baseList];

    this.initEvents();
    this.render();
  }

  initEvents() {
    if (this.searchInput) {
      this.searchInput.addEventListener('input', () => this.filterData());
      this.searchInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') { e.preventDefault(); this.filterData(); } });
    }
    if (this.selectEl) this.selectEl.addEventListener('change', () => this.filterData());
    if (this.searchBtn) this.searchBtn.addEventListener('click', () => this.filterData());
  }

  filterData() {
    const keyword = this.searchInput ? this.searchInput.value.trim().toLowerCase() : '';
    const filterType = this.selectEl ? this.selectEl.value : 'title';

    if (!keyword) {
      this.filteredList = [...this.baseList];
    } else {
      this.filteredList = this.baseList.filter((item) => {
        const title = (item.title || '').toLowerCase();
        const author = (item.authors || item.desc || '').toLowerCase();
        const journal = (item.journal || '').toLowerCase();

        if (filterType === 'title') return title.includes(keyword);
        if (filterType === 'author') return author.includes(keyword);
        if (filterType === 'journal') return journal.includes(keyword);
        return title.includes(keyword) || author.includes(keyword) || journal.includes(keyword) || (item.year || item.date || '').includes(keyword);
      });
    }
    this.currentPage = 1;
    this.render();
  }

  render() {
    this.container.innerHTML = '';
    const emptyMsg = this.tableName === 'publications' ? (this.targetType === 'patent' ? '등록된 특허가 없습니다.' : '등록된 논문이 없습니다.') : '등록된 게시물이 없습니다.';
    
    const isTbody = this.container.tagName === 'TBODY';

    if (this.baseList.length === 0) { 
      if (isTbody) {
        this.container.innerHTML = `<tr><td colspan="3" style="text-align: center; padding: 40px; color: #475569;">${emptyMsg}</td></tr>`;
      } else {
        this.container.innerHTML = `<div class="empty-state-card" style="grid-column:1/-1;"><p>${emptyMsg}</p></div>`; 
      }
      if (this.paginationContainer) this.paginationContainer.innerHTML = ''; 
      return; 
    }
    if (this.filteredList.length === 0) { 
      if (isTbody) {
        this.container.innerHTML = `<tr><td colspan="3" style="text-align: center; padding: 40px; color: #475569;">검색 조건과 일치하는 항목이 없습니다.</td></tr>`;
      } else {
        this.container.innerHTML = '<div class="empty-state-card" style="grid-column:1/-1;"><p>검색 조건과 일치하는 항목이 없습니다.</p></div>'; 
      }
      if (this.paginationContainer) this.paginationContainer.innerHTML = ''; 
      return; 
    }

    const totalPages = Math.ceil(this.filteredList.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const pagedItems = this.filteredList.slice(startIndex, startIndex + this.itemsPerPage);

    pagedItems.forEach((item, idx) => {
      const globalIdx = this.filteredList.length - startIndex - idx;
      this.renderCardCallback(this.container, item, globalIdx);
    });

    this.renderPagination(totalPages);
  }

  renderPagination(totalPages) {
    if (!this.paginationContainer || totalPages <= 1) { if(this.paginationContainer) this.paginationContainer.innerHTML=''; return; }
    this.paginationContainer.innerHTML = '';
    for (let i = 1; i <= totalPages; i++) {
      const pageBtn = document.createElement('button');
      pageBtn.className = `page-btn num-btn ${this.currentPage === i ? 'active' : ''}`;
      pageBtn.textContent = i;
      pageBtn.addEventListener('click', () => { this.currentPage = i; this.render(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
      this.paginationContainer.appendChild(pageBtn);
    }
  }
}

/**
 * ====================================================================
 * [PART 6] 웹페이지 구동 메인 초기화 루틴
 * ====================================================================
 */
document.addEventListener('DOMContentLoaded', () => {
  syncPublicPages();
  new UnifiedAdminApp();
  
  const topBtn = document.getElementById('scrollTopBtn');
  if (topBtn) topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // 1. Publications
  new DedicatedGenericViewer({
    tableName: 'publications', targetType: 'paper',
    containerId: 'pubListContainer', paginationId: 'pubPagination',
    selectId: 'searchSelectValue', searchInputId: 'pubSearchInput', searchBtnId: 'pubSearchBtn',
    renderCardCallback: (container, pub) => {
      const article = document.createElement('article');
      article.className = 'pub-card';
      article.innerHTML = `
        <div class="pub-info">
          <h3 class="pub-title">${formatTitle(pub.title)}</h3>
          <div class="pub-meta">
            <span class="pub-authors">${formatTitle(pub.authors)}</span>
            <span class="pub-journal">${escapeHtml(pub.journal)}</span>
            <span class="pub-year">${escapeHtml(pub.year)}</span>
          </div>
        </div>
        <a href="${escapeHtml(pub.link || '#')}" class="pub-link-icon" target="_blank" rel="noopener noreferrer">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        </a>`;
      container.appendChild(article);
    }
  });

  // 2. Patents
  new DedicatedGenericViewer({
    tableName: 'publications', targetType: 'patent',
    containerId: 'patentListContainer', paginationId: 'patentPagination',
    selectId: 'searchSelectValue', searchInputId: 'patentSearchInput', searchBtnId: 'patentSearchBtn',
    renderCardCallback: (container, pub) => {
      const article = document.createElement('article');
      article.className = 'pub-card';
      article.innerHTML = `
        <div class="pub-info">
          <h3 class="pub-title">${formatTitle(pub.title)}</h3>
          <div class="pub-meta">
            <span class="pub-authors">${formatTitle(pub.authors)}</span>
            <span class="pub-journal">${escapeHtml(pub.journal)}</span>
            <span class="pub-year">${escapeHtml(pub.year)}</span>
          </div>
        </div>
        <a href="${escapeHtml(pub.link || '#')}" class="pub-link-icon" target="_blank" rel="noopener noreferrer">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        </a>`;
      container.appendChild(article);
    }
  });

  // 3. Lab Life
  new DedicatedGenericViewer({
    tableName: 'lab_life',
    containerId: 'lablifeListContainer', paginationId: 'lablifePagination',
    selectId: 'searchSelectValue', searchInputId: 'lablifeSearchInput', searchBtnId: 'lablifeSearchBtn',
    renderCardCallback: (container, item) => {
      const card = document.createElement('article'); 
      card.className = 'lablife-card clickable-card';
      let thumbImg = (item.images && item.images.length > 0) ? `<img src="${item.images[0]}" alt="사진" style="width:100%; height:100%; object-fit:contain;" />` : `<div class="img-placeholder">No Image</div>`;
      card.innerHTML = `<div class="lablife-img-frame">${thumbImg}</div><div class="lablife-content"><span class="lablife-date">${escapeHtml(item.date)}</span><h3 class="lablife-title">${escapeHtml(item.title)}</h3><div class="lablife-desc">${formatDesc(item.desc || '')}</div></div>`;
      card.addEventListener('click', () => { location.href = `view.html?type=lablife&id=${item.id}`; });
      container.appendChild(card);
    }
  });

  // 4. Notice
  new DedicatedGenericViewer({
    tableName: 'notices',
    containerId: 'noticeTableBody', paginationId: 'noticePagination',
    selectId: 'searchSelectValue', searchInputId: 'noticeSearchInput', searchBtnId: 'noticeSearchBtn',
    renderCardCallback: (container, item, displayNo) => {
      const tr = document.createElement('tr'); 
      tr.className = 'notice-row clickable-row';
      tr.innerHTML = `<td style="text-align:center;">${displayNo}</td><td class="notice-title-cell"><span class="board-link">${escapeHtml(item.title)}</span></td><td style="text-align:center;">${escapeHtml(item.date)}</td>`;
      tr.addEventListener('click', () => { location.href = `view.html?type=notice&id=${item.id}`; });
      container.appendChild(tr);
    }
  });

  // 5. News
  new DedicatedGenericViewer({
    tableName: 'news',
    containerId: 'newsListContainer', paginationId: 'newsPagination',
    selectId: 'searchSelectValue', searchInputId: 'newsSearchInput', searchBtnId: 'newsSearchBtn',
    renderCardCallback: (container, item) => {
      const card = document.createElement('article'); 
      card.className = 'lablife-card clickable-card';
      let thumbImg = (item.images && item.images.length > 0) ? `<img src="${item.images[0]}" alt="사진" style="width:100%; height:100%; object-fit:contain;" />` : `<div class="img-placeholder">No Image</div>`;
      card.innerHTML = `<div class="lablife-img-frame">${thumbImg}</div><div class="lablife-content"><span class="lablife-date">${escapeHtml(item.date)}</span><h3 class="lablife-title">${escapeHtml(item.title)}</h3><div class="lablife-desc">${formatDesc(item.desc || '')}</div></div>`;
      card.addEventListener('click', () => { location.href = `view.html?type=news&id=${item.id}`; });
      container.appendChild(card);
    }
  });
});