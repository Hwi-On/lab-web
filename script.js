/**
 * ====================================================================
 * [PART 0] 로컬 스토리지 키 및 기본 설정 관리
 * ====================================================================
 */
const ADMIN_PASSWORD = 'admin1234!';

const STORE_KEYS = {
  HOME_HERO: 'lab_data_home_hero',
  RESEARCH_AREAS: 'lab_data_research_areas',
  DIRECTOR: 'lab_data_director',
  EDUCATION: 'lab_data_education',
  EXPERIENCE: 'lab_data_experience',
  CURRENT: 'lab_data_current',
  ALUMNI: 'lab_data_alumni',
  PUB: 'lab_publications_data',
  LABLIFE: 'lab_data_lablife',
  NOTICE: 'lab_data_notice',
  NEWS: 'lab_data_news'
};

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
  if (navbar) navbar.classList.add('menu-open');
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
  // 1. 관리자 페이지용 햄버거 메뉴 제어
  if (window.location.pathname.includes('admin')) {
    const navbarEl = document.querySelector('.navbar');
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
        if (navbarEl) navbarEl.classList.toggle('mobile-open');
        backdrop.classList.toggle('active');
      });

      backdrop.addEventListener('click', () => {
        if (navbarEl) navbarEl.classList.remove('mobile-open');
        backdrop.classList.remove('active');
      });

      const mobileMenuLinks = document.querySelectorAll('.admin-mobile-menu a');
      mobileMenuLinks.forEach(link => {
        link.addEventListener('click', () => {
          if (navbarEl) navbarEl.classList.remove('mobile-open');
          const backdrop = document.querySelector('.mobile-backdrop');
          if (backdrop) backdrop.classList.remove('active');
        });
      });
    }
  }
  // 2. 일반 방문자 페이지용 햄버거 메뉴 제어
  else {
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
        navbar.classList.toggle('mobile-open');
        backdrop.classList.toggle('active');
      });

      backdrop.addEventListener('click', () => {
        navbar.classList.remove('mobile-open');
        backdrop.classList.remove('active');
      });
    }

    const mobileMenuLinks = document.querySelectorAll('.main-menu a');
    mobileMenuLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navbar) navbar.classList.remove('mobile-open');
        const backdrop = document.querySelector('.mobile-backdrop');
        if (backdrop) backdrop.classList.remove('active');
      });
    });
  }

  // [검색바 커스텀 셀렉트 드롭다운 토글 및 선택 제어]
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

  // Current 탭 커스텀 롤 셀렉트(div/ul/li) 이벤트 바인딩 (존재할 경우)
  const roleToggle = document.getElementById('admCurRoleToggle');
  const roleOptions = document.getElementById('admCurRoleOptions');
  const roleLabel = document.getElementById('admCurRoleLabel');
  const roleHiddenInput = document.getElementById('admCurRole');
  if (roleToggle && roleOptions) {
    roleToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      roleOptions.style.display = roleOptions.style.display === 'block' ? 'none' : 'block';
    });
    roleOptions.querySelectorAll('li').forEach(li => {
      li.addEventListener('click', () => {
        const val = li.getAttribute('data-value');
        if (roleLabel) roleLabel.textContent = li.textContent;
        if (roleHiddenInput) roleHiddenInput.value = val;
        roleOptions.style.display = 'none';
      });
    });
    document.addEventListener('click', () => {
      if (roleOptions) roleOptions.style.display = 'none';
    });
  }
});

/**
 * ====================================================================
 * [PART 2] 데이터 저장/조회 및 파일 변환 유틸리티 함수
 * ====================================================================
 */
const DEFAULT_HOME_HERO = {
  badge: "RESEARCH FIELD / AFFILIATION",
  title: "Pioneering Future Discoveries<br>&amp; Translational Research",
  desc: "연구실의 핵심 연구 비전 및 목표를 소개하는 메인 소개 문구가 작성될 공간입니다."
};

const DEFAULT_RESEARCH_AREAS = [
  { id: 1, tag: "DOMAIN 01", heading: "주요 연구 분야 01", detail: "연구 분야에 대한 핵심 메커니즘 개요가 기재될 공간입니다." },
  { id: 2, tag: "DOMAIN 02", heading: "주요 연구 분야 02", detail: "세부 프로젝트 및 분석 플랫폼 등에 대한 설명이 기재될 공간입니다." },
  { id: 3, tag: "DOMAIN 03", heading: "주요 연구 분야 03", detail: "전임상 평가 모델 및 중개 치료 기술 개발과 관련된 연구 내용입니다." }
];

const DEFAULT_DIRECTOR = {
  nameKo: "교수님 성함",
  nameEn: "Professor Name, Ph.D.",
  position: "Principal Investigator",
  email: "professor@univ.ac.kr",
  tel: "",
  office: "",
  greeting: "",
  image: ""
};

function getStored(key, defaultVal) {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(defaultVal));
    return defaultVal;
  }
  return JSON.parse(data);
}

function setStored(key, val) {
  localStorage.setItem(key, JSON.stringify(val));
}

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
  return String(str).replace(/[&<>'"]/g, 
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
 * [PART 3] 통합 관리자(Admin) 제어 클래스
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
    this.renderAll();
  }

  initAuth() {
    const isAuth = sessionStorage.getItem('lab_admin_authenticated') === 'true';
    const authAuthLinkMobile = document.getElementById('adminAuthLinkMobile');
    const logoutLinkMobile = document.getElementById('adminLogoutLinkMobile');
    const loginBtnDesktop = document.getElementById('adminLoginBtnDesktop');

    if (isAuth) {
      this.authBox.style.display = 'none';
      this.panelBox.style.display = 'block';
      if (this.logoutBtn) this.logoutBtn.style.display = 'inline-block';
      if (loginBtnDesktop) loginBtnDesktop.style.display = 'none';
      
      if (authAuthLinkMobile) authAuthLinkMobile.style.display = 'none';
      if (logoutLinkMobile) logoutLinkMobile.style.display = 'block';
    } else {
      if (loginBtnDesktop) loginBtnDesktop.style.display = 'inline-flex';
      if (authAuthLinkMobile) {
        authAuthLinkMobile.textContent = 'Login';
        authAuthLinkMobile.setAttribute('href', '#adminAuthBox');
        authAuthLinkMobile.style.display = 'block';
      }
      if (logoutLinkMobile) logoutLinkMobile.style.display = 'none';
    }

    if (this.loginForm) {
      this.loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const pwd = document.getElementById('adminPasswordInput').value.trim();
        if (pwd === ADMIN_PASSWORD) {
          sessionStorage.setItem('lab_admin_authenticated', 'true');
          this.authBox.style.display = 'none';
          this.panelBox.style.display = 'block';
          if (this.logoutBtn) this.logoutBtn.style.display = 'inline-block';
          if (loginBtnDesktop) loginBtnDesktop.style.display = 'none';
          if (authAuthLinkMobile) authAuthLinkMobile.style.display = 'none';
          if (logoutLinkMobile) logoutLinkMobile.style.display = 'block';
          this.renderAll();
        } else {
          alert('비밀번호가 올바르지 않습니다.');
        }
      });
    }

    const handleLogout = () => {
      sessionStorage.removeItem('lab_admin_authenticated');
      location.reload();
    };

    if (this.logoutBtn) {
      this.logoutBtn.addEventListener('click', handleLogout);
    }
    if (logoutLinkMobile) {
      logoutLinkMobile.addEventListener('click', (e) => {
        e.preventDefault();
        handleLogout();
      });
    }
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
    const heroForm = document.getElementById('formAdminHomeHero');
    if (heroForm) {
      heroForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const heroData = {
          badge: document.getElementById('admHomeBadge').value.trim(),
          title: document.getElementById('admHomeTitle').value.trim(),
          desc: document.getElementById('admHomeDesc').value.trim()
        };
        setStored(STORE_KEYS.HOME_HERO, heroData);
        alert('홈 화면 히어로 배너 정보가 저장되었습니다.');
      });
    }

    const resForm = document.getElementById('formAdminResearchItem');
    const btnCancelRes = document.getElementById('btnCancelRes');
    const researchFormTitle = document.getElementById('researchFormTitle');

    if (resForm) {
      resForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const list = getStored(STORE_KEYS.RESEARCH_AREAS, DEFAULT_RESEARCH_AREAS);

        if (this.editResId) {
          const idx = list.findIndex(item => item.id === this.editResId);
          if (idx !== -1) {
            list[idx].tag = document.getElementById('admResTag').value.trim();
            list[idx].heading = document.getElementById('admResHeading').value.trim();
            list[idx].detail = document.getElementById('admResDetail').value.trim();
          }
          this.editResId = null;
          resForm.querySelector('button[type="submit"]').textContent = '연구 분야 추가하기';
          if (researchFormTitle) researchFormTitle.textContent = '+ 주요 연구 분야 (Research Areas) 추가';
          if (btnCancelRes) btnCancelRes.style.display = 'none';
          alert('연구 분야 항목이 수정되었습니다.');
        } else {
          list.push({
            id: Date.now(),
            tag: document.getElementById('admResTag').value.trim(),
            heading: document.getElementById('admResHeading').value.trim(),
            detail: document.getElementById('admResDetail').value.trim()
          });
          alert('연구 분야 항목이 추가되었습니다.');
        }

        setStored(STORE_KEYS.RESEARCH_AREAS, list);
        resForm.reset();
        this.renderResearchAreas();
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

    const dirForm = document.getElementById('formAdminDirector');
    if (dirForm) {
      dirForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const imgBase64 = await convertFileToBase64('admDirImg');
        const oldData = getStored(STORE_KEYS.DIRECTOR, DEFAULT_DIRECTOR);
        const dirData = {
          nameKo: document.getElementById('admDirNameKo').value.trim(),
          nameEn: document.getElementById('admDirNameEn').value.trim(),
          position: document.getElementById('admDirPosition').value.trim(),
          email: document.getElementById('admDirEmail').value.trim(),
          tel: document.getElementById('admDirTel').value.trim(),
          office: document.getElementById('admDirOffice').value.trim(),
          greeting: document.getElementById('admDirGreeting').value.trim(),
          image: imgBase64 || oldData.image || ''
        };
        setStored(STORE_KEYS.DIRECTOR, dirData);
        alert('Director 기본 정보가 저장되었습니다.');
      });
    }

    const eduForm = document.getElementById('formAdminEdu');
    const btnCancelEdu = document.getElementById('btnCancelEdu');
    if (eduForm) {
      eduForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const list = getStored(STORE_KEYS.EDUCATION, []);
        if (this.editEduId) {
          const idx = list.findIndex(item => item.id === this.editEduId);
          if (idx !== -1) {
            list[idx].period = document.getElementById('admEduPeriod').value.trim();
            list[idx].degree = document.getElementById('admEduDegree').value.trim();
            list[idx].inst = document.getElementById('admEduInst').value.trim();
          }
          this.editEduId = null;
          eduForm.querySelector('button[type="submit"]').textContent = '학력 추가하기';
          if (btnCancelEdu) btnCancelEdu.style.display = 'none';
          alert('학력 정보가 수정되었습니다.');
        } else {
          list.push({
            id: Date.now(),
            period: document.getElementById('admEduPeriod').value.trim(),
            degree: document.getElementById('admEduDegree').value.trim(),
            inst: document.getElementById('admEduInst').value.trim()
          });
          alert('학력 정보가 추가되었습니다.');
        }
        setStored(STORE_KEYS.EDUCATION, list);
        eduForm.reset();
        this.renderEdu();
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

    const expForm = document.getElementById('formAdminExp');
    const btnCancelExp = document.getElementById('btnCancelExp');
    if (expForm) {
      expForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const list = getStored(STORE_KEYS.EXPERIENCE, []);
        if (this.editExpId) {
          const idx = list.findIndex(item => item.id === this.editExpId);
          if (idx !== -1) {
            list[idx].category = document.getElementById('admExpCategory').value;
            list[idx].period = document.getElementById('admExpPeriod').value.trim();
            list[idx].degree = document.getElementById('admExpDegree').value.trim();
            list[idx].inst = document.getElementById('admExpInst').value.trim();
          }
          this.editExpId = null;
          expForm.querySelector('button[type="submit"]').textContent = '이력 추가하기';
          if (btnCancelExp) btnCancelExp.style.display = 'none';
          alert('이력 정보가 수정되었습니다.');
        } else {
          list.push({
            id: Date.now(),
            category: document.getElementById('admExpCategory').value,
            period: document.getElementById('admExpPeriod').value.trim(),
            degree: document.getElementById('admExpDegree').value.trim(),
            inst: document.getElementById('admExpInst').value.trim()
          });
          alert('이력 정보가 추가되었습니다.');
        }
        setStored(STORE_KEYS.EXPERIENCE, list);
        expForm.reset();
        this.renderExp();
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

    const curForm = document.getElementById('formAdminCurrent');
    if (curForm) {
      curForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const imgBase64 = await convertFileToBase64('admCurImg');
        const list = getStored(STORE_KEYS.CURRENT, []);
        const roleHidden = document.getElementById('admCurRole');
        const roleVal = roleHidden ? roleHidden.value : 'Postdoctoral Researcher';

        if (this.editCurrentId) {
          const idx = list.findIndex(item => item.id === this.editCurrentId);
          if (idx !== -1) {
            list[idx].role = roleVal;
            list[idx].name = document.getElementById('admCurName').value.trim();
            list[idx].topic = '';
            list[idx].tags = document.getElementById('admCurTags').value.trim();
            list[idx].email = document.getElementById('admCurEmail').value.trim();
            if (imgBase64) list[idx].image = imgBase64;
          }
          this.editCurrentId = null;
          curForm.querySelector('button[type="submit"]').textContent = '연구원 추가하기';
          alert('연구원 정보가 수정되었습니다.');
        } else {
          list.unshift({
            id: Date.now(),
            role: roleVal,
            name: document.getElementById('admCurName').value.trim(),
            topic: '',
            tags: document.getElementById('admCurTags').value.trim(),
            email: document.getElementById('admCurEmail').value.trim(),
            image: imgBase64
          });
          alert('연구원이 추가되었습니다.');
        }
        setStored(STORE_KEYS.CURRENT, list);
        curForm.reset();
        const roleLabel = document.getElementById('admCurRoleLabel');
        if (roleLabel) roleLabel.textContent = 'Postdoctoral Researcher (박사후 연구원)';
        if (roleHidden) roleHidden.value = 'Postdoctoral Researcher';
        this.renderCurrent();
      });
    }

    const alumForm = document.getElementById('formAdminAlumni');
    if (alumForm) {
      alumForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const imgBase64 = await convertFileToBase64('admAlumImg');
        const list = getStored(STORE_KEYS.ALUMNI, []);
        if (this.editAlumniId) {
          const idx = list.findIndex(item => item.id === this.editAlumniId);
          if (idx !== -1) {
            list[idx].year = document.getElementById('admAlumYear').value.trim();
            list[idx].name = document.getElementById('admAlumName').value.trim();
            list[idx].degree = document.getElementById('admAlumDegree').value;
            list[idx].topic = '';
            list[idx].tags = document.getElementById('admAlumTags').value.trim();
            list[idx].email = document.getElementById('admAlumEmail').value.trim();
            if (imgBase64) list[idx].image = imgBase64;
          }
          this.editAlumniId = null;
          alumForm.querySelector('button[type="submit"]').textContent = '졸업생 추가하기';
          alert('졸업생 정보가 수정되었습니다.');
        } else {
          list.unshift({
            id: Date.now(),
            year: document.getElementById('admAlumYear').value.trim(),
            name: document.getElementById('admAlumName').value.trim(),
            degree: document.getElementById('admAlumDegree').value,
            topic: '',
            tags: document.getElementById('admAlumTags').value.trim(),
            email: document.getElementById('admAlumEmail').value.trim(),
            image: imgBase64
          });
          alert('졸업생이 추가되었습니다.');
        }
        setStored(STORE_KEYS.ALUMNI, list);
        alumForm.reset();
        this.renderAlumni();
      });
    }

    const pubForm = document.getElementById('formAdminPub');
    if (pubForm) {
      pubForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const list = getStored(STORE_KEYS.PUB, []);
        const rawDate = document.getElementById('admPubYear').value.trim();
        const formattedDate = rawDate ? rawDate.replace(/-/g, '.') : new Date().toISOString().substring(0, 10).replace(/-/g, '.');

        if (this.editPubId) {
          const idx = list.findIndex(item => item.id === this.editPubId);
          if (idx !== -1) {
            list[idx].type = document.getElementById('admPubType').value;
            list[idx].title = document.getElementById('admPubTitle').value.trim();
            list[idx].authors = document.getElementById('admPubAuthors').value.trim();
            list[idx].journal = document.getElementById('admPubJournal').value.trim();
            list[idx].year = formattedDate;
            list[idx].link = document.getElementById('admPubLink').value.trim() || '#';
          }
          this.editPubId = null;
          pubForm.querySelector('button[type="submit"]').textContent = '등록하기';
          alert('항목이 수정되었습니다.');
        } else {
          list.unshift({
            id: Date.now(),
            type: document.getElementById('admPubType').value,
            title: document.getElementById('admPubTitle').value.trim(),
            authors: document.getElementById('admPubAuthors').value.trim(),
            journal: document.getElementById('admPubJournal').value.trim(),
            year: formattedDate,
            link: document.getElementById('admPubLink').value.trim() || '#'
          });
          alert('항목이 등록되었습니다.');
        }
        setStored(STORE_KEYS.PUB, list);
        pubForm.reset();
        this.renderPub();
      });
    }

    const lifeForm = document.getElementById('formAdminLabLife');
    if (lifeForm) {
      lifeForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const imgsArray = await convertFilesToMultipleBase64('admLifeImgs');
        const list = getStored(STORE_KEYS.LABLIFE, []);
        if (this.editLabLifeId) {
          const idx = list.findIndex(item => item.id === this.editLabLifeId);
          if (idx !== -1) {
            list[idx].date = document.getElementById('admLifeDate').value.replace(/-/g, '.');
            list[idx].title = document.getElementById('admLifeTitle').value.trim();
            list[idx].desc = document.getElementById('admLifeDesc').value.trim();
            if (imgsArray.length > 0) list[idx].images = imgsArray;
          }
          this.editLabLifeId = null;
          lifeForm.querySelector('button[type="submit"]').textContent = '활동 등록하기';
          alert('Lab Life 활동이 수정되었습니다.');
        } else {
          list.unshift({
            id: Date.now(),
            date: document.getElementById('admLifeDate').value.replace(/-/g, '.'),
            title: document.getElementById('admLifeTitle').value.trim(),
            desc: document.getElementById('admLifeDesc').value.trim(),
            images: imgsArray,
            views: 0
          });
          alert('Lab Life 활동이 등록되었습니다.');
        }
        setStored(STORE_KEYS.LABLIFE, list);
        lifeForm.reset();
        this.renderLabLife();
      });
    }

    const notForm = document.getElementById('formAdminNotice');
    if (notForm) {
      notForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const imgsArray = await convertFilesToMultipleBase64('admNotImgs');
        const list = getStored(STORE_KEYS.NOTICE, []);
        if (this.editNoticeId) {
          const idx = list.findIndex(item => item.id === this.editNoticeId);
          if (idx !== -1) {
            list[idx].date = document.getElementById('admNotDate').value.replace(/-/g, '.');
            list[idx].title = document.getElementById('admNotTitle').value.trim();
            list[idx].desc = document.getElementById('admNotDesc').value.trim();
            if (imgsArray.length > 0) list[idx].images = imgsArray;
          }
          this.editNoticeId = null;
          notForm.querySelector('button[type="submit"]').textContent = '공지 등록하기';
          alert('공지사항이 수정되었습니다.');
        } else {
          list.unshift({
            id: Date.now(),
            date: document.getElementById('admNotDate').value.replace(/-/g, '.'),
            title: document.getElementById('admNotTitle').value.trim(),
            desc: document.getElementById('admNotDesc').value.trim(),
            images: imgsArray,
            views: 0
          });
          alert('공지사항이 등록되었습니다.');
        }
        setStored(STORE_KEYS.NOTICE, list);
        notForm.reset();
        this.renderNotice();
      });
    }

    const newsForm = document.getElementById('formAdminNews');
    if (newsForm) {
      newsForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const imgsArray = await convertFilesToMultipleBase64('admNewsImgs');
        const list = getStored(STORE_KEYS.NEWS, []);
        if (this.editNewsId) {
          const idx = list.findIndex(item => item.id === this.editNewsId);
          if (idx !== -1) {
            list[idx].category = 'NEWS';
            list[idx].date = document.getElementById('admNewsDate').value.replace(/-/g, '.');
            list[idx].title = document.getElementById('admNewsTitle').value.trim();
            list[idx].desc = document.getElementById('admNewsDesc').value.trim();
            if (imgsArray.length > 0) list[idx].images = imgsArray;
          }
          this.editNewsId = null;
          newsForm.querySelector('button[type="submit"]').textContent = '뉴스 게시하기';
          alert('뉴스가 수정되었습니다.');
        } else {
          list.unshift({
            id: Date.now(),
            category: 'NEWS',
            date: document.getElementById('admNewsDate').value.replace(/-/g, '.'),
            title: document.getElementById('admNewsTitle').value.trim(),
            desc: document.getElementById('admNewsDesc').value.trim(),
            images: imgsArray,
            views: 0
          });
          alert('뉴스가 등록되었습니다.');
        }
        setStored(STORE_KEYS.NEWS, list);
        newsForm.reset();
        this.renderNews();
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

  renderHomeHeroForm() {
    const data = getStored(STORE_KEYS.HOME_HERO, DEFAULT_HOME_HERO);
    if (!document.getElementById('admHomeBadge')) return;
    document.getElementById('admHomeBadge').value = data.badge || '';
    document.getElementById('admHomeTitle').value = data.title || '';
    document.getElementById('admHomeDesc').value = data.desc || '';
  }

  renderResearchAreas() {
    const list = getStored(STORE_KEYS.RESEARCH_AREAS, DEFAULT_RESEARCH_AREAS);
    const tbody = document.getElementById('tableBodyResearch');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (list.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:15px; color:#94a3b8;">등록된 연구 분야가 없습니다.</td></tr>';
      return;
    }

    list.forEach((item) => {
      const actualIdx = list.findIndex(x => x.id === item.id);
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><span class="tag-chip">${escapeHtml(item.tag)}</span></td>
        <td><strong>${escapeHtml(item.heading)}</strong></td>
        <td>${escapeHtml(item.detail)}</td>
        <td style="text-align:center; display:flex; gap:6px; justify-content:center;">
          <button class="btn-edit-res" data-id="${item.id}" style="background:#e0f2fe; color:#0284c7; border:1px solid #bae6fd; padding:5px 10px; border-radius:4px; font-size:0.78rem; font-weight:700; cursor:pointer;">수정</button>
          <button class="btn-delete-item" data-idx="${actualIdx}">삭제</button>
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

    this.attachDelete(tbody, STORE_KEYS.RESEARCH_AREAS, () => this.renderResearchAreas());
  }

  renderDirectorForm() {
    const data = getStored(STORE_KEYS.DIRECTOR, DEFAULT_DIRECTOR);
    if (!document.getElementById('admDirNameKo')) return;
    document.getElementById('admDirNameKo').value = data.nameKo || '';
    document.getElementById('admDirNameEn').value = data.nameEn || '';
    document.getElementById('admDirPosition').value = data.position || '';
    document.getElementById('admDirEmail').value = data.email || '';
    document.getElementById('admDirTel').value = data.tel || '';
    document.getElementById('admDirOffice').value = data.office || '';
    document.getElementById('admDirGreeting').value = data.greeting || '';
  }

  renderEdu() {
    const list = getStored(STORE_KEYS.EDUCATION, []);
    const tbody = document.getElementById('tableBodyEdu');
    if (!tbody) return;
    tbody.innerHTML = '';
    if (list.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:15px; color:#94a3b8;">등록된 학력이 없습니다.</td></tr>';
      return;
    }
    list.slice().reverse().forEach((item, idx) => {
      const actualIdx = list.length - 1 - idx;
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${escapeHtml(item.period)}</td>
        <td><strong>${escapeHtml(item.degree)}</strong></td>
        <td>${escapeHtml(item.inst)}</td>
        <td style="text-align:center; display:flex; gap:6px; justify-content:center;">
          <button class="btn-edit-edu" data-id="${item.id}" style="background:#e0f2fe; color:#0284c7; border:1px solid #bae6fd; padding:5px 10px; border-radius:4px; font-size:0.78rem; font-weight:700; cursor:pointer;">수정</button>
          <button class="btn-delete-item" data-idx="${actualIdx}">삭제</button>
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

    this.attachDelete(tbody, STORE_KEYS.EDUCATION, () => this.renderEdu());
  }

  renderExp() {
    const list = getStored(STORE_KEYS.EXPERIENCE, []);
    const tbody = document.getElementById('tableBodyExp');
    if (!tbody) return;
    tbody.innerHTML = '';
    if (list.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:15px; color:#94a3b8;">등록된 경력 및 활동이 없습니다.</td></tr>';
      return;
    }
    list.slice().reverse().forEach((item, idx) => {
      const actualIdx = list.length - 1 - idx;
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><span class="tag-chip">${escapeHtml(item.category || '경력 (Experience)')}</span></td>
        <td>${escapeHtml(item.period)}</td>
        <td><strong>${escapeHtml(item.degree)}</strong></td>
        <td>${escapeHtml(item.inst)}</td>
        <td style="text-align:center; display:flex; gap:6px; justify-content:center;">
          <button class="btn-edit-exp" data-id="${item.id}" style="background:#e0f2fe; color:#0284c7; border:1px solid #bae6fd; padding:5px 10px; border-radius:4px; font-size:0.78rem; font-weight:700; cursor:pointer;">수정</button>
          <button class="btn-delete-item" data-idx="${actualIdx}">삭제</button>
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

    this.attachDelete(tbody, STORE_KEYS.EXPERIENCE, () => this.renderExp());
  }

  renderCurrent() {
    const list = getStored(STORE_KEYS.CURRENT, []);
    const tbody = document.getElementById('tableBodyCurrent');
    if (!tbody) return;
    tbody.innerHTML = '';
    if (list.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:20px; color:#94a3b8;">등록된 연구원이 없습니다.</td></tr>';
      return;
    }
    list.forEach((item, idx) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><span class="profile-role-tag">${escapeHtml(item.role)}</span></td>
        <td><strong>${escapeHtml(item.name)}</strong></td>
        <td>${escapeHtml(item.tags || '-')}</td>
        <td style="text-align:center; display:flex; gap:6px; justify-content:center;">
          <button class="btn-edit-item" data-id="${item.id}" style="background:#e0f2fe; color:#0284c7; border:1px solid #bae6fd; padding:5px 10px; border-radius:4px; font-size:0.78rem; font-weight:700; cursor:pointer;">수정</button>
          <button class="btn-delete-item" data-idx="${idx}">삭제</button>
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

    this.attachDelete(tbody, STORE_KEYS.CURRENT, () => this.renderCurrent());
  }

  renderAlumni() {
    const list = getStored(STORE_KEYS.ALUMNI, []);
    const tbody = document.getElementById('tableBodyAlumni');
    if (!tbody) return;
    tbody.innerHTML = '';
    if (list.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:20px; color:#94a3b8;">등록된 졸업생이 없습니다.</td></tr>';
      return;
    }
    list.forEach((item, idx) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="text-align:center; font-weight:700;">${escapeHtml(item.year)}</td>
        <td><strong>${escapeHtml(item.name)}</strong> (${escapeHtml(item.degree)})</td>
        <td>${escapeHtml(item.tags || '-')}</td>
        <td style="text-align:center; display:flex; gap:6px; justify-content:center;">
          <button class="btn-edit-item" data-id="${item.id}" style="background:#e0f2fe; color:#0284c7; border:1px solid #bae6fd; padding:5px 10px; border-radius:4px; font-size:0.78rem; font-weight:700; cursor:pointer;">수정</button>
          <button class="btn-delete-item" data-idx="${idx}">삭제</button>
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

    this.attachDelete(tbody, STORE_KEYS.ALUMNI, () => this.renderAlumni());
  }

  renderPub() {
    const list = getStored(STORE_KEYS.PUB, []);
    const tbody = document.getElementById('tableBodyPub');
    if (!tbody) return;
    tbody.innerHTML = '';
    if (list.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:20px; color:#94a3b8;">등록된 항목이 없습니다.</td></tr>';
      return;
    }
    const sortedList = list.slice().sort((a, b) => parseCustomDate(b.year, b.id) - parseCustomDate(a.year, a.id));

    sortedList.forEach((item) => {
      const actualIdx = list.findIndex(x => x.id === item.id);
      const typeLabel = item.type === 'patent' ? 'Patent' : 'Paper';
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="text-align:center;"><span class="pub-type-badge ${item.type || 'paper'}">${typeLabel}</span></td>
        <td><strong>${formatTitle(item.title)}</strong><br><span style="font-size:0.82rem; color:#64748b;">${formatTitle(item.authors)} &bull; <em>${escapeHtml(item.journal)}</em></span></td>
        <td style="text-align:center;">${escapeHtml(item.year)}</td>
        <td style="text-align:center; display:flex; gap:6px; justify-content:center;">
          <button class="btn-edit-item" data-id="${item.id}" style="background:#e0f2fe; color:#0284c7; border:1px solid #bae6fd; padding:5px 10px; border-radius:4px; font-size:0.78rem; font-weight:700; cursor:pointer;">수정</button>
          <button class="btn-delete-item" data-idx="${actualIdx}">삭제</button>
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

    this.attachDelete(tbody, STORE_KEYS.PUB, () => this.renderPub());
  }

  renderLabLife() {
    const list = getStored(STORE_KEYS.LABLIFE, []);
    const tbody = document.getElementById('tableBodyLabLife');
    if (!tbody) return;
    tbody.innerHTML = '';
    if (list.length === 0) {
      tbody.innerHTML = '<tr><td colspan="3" style="text-align:center; padding:20px; color:#94a3b8;">등록된 활동이 없습니다.</td></tr>';
      return;
    }
    list.forEach((item, idx) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="text-align:center;">${escapeHtml(item.date)}</td>
        <td><strong>${escapeHtml(item.title)}</strong></td>
        <td style="text-align:center; display:flex; gap:6px; justify-content:center;">
          <button class="btn-edit-item" data-id="${item.id}" style="background:#e0f2fe; color:#0284c7; border:1px solid #bae6fd; padding:5px 10px; border-radius:4px; font-size:0.78rem; font-weight:700; cursor:pointer;">수정</button>
          <button class="btn-delete-item" data-idx="${idx}">삭제</button>
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

    this.attachDelete(tbody, STORE_KEYS.LABLIFE, () => this.renderLabLife());
  }

  renderNotice() {
    const list = getStored(STORE_KEYS.NOTICE, []);
    const tbody = document.getElementById('tableBodyNotice');
    if (!tbody) return;
    tbody.innerHTML = '';
    if (list.length === 0) {
      tbody.innerHTML = '<tr><td colspan="3" style="text-align:center; padding:20px; color:#94a3b8;">등록된 공지사항이 없습니다.</td></tr>';
      return;
    }
    list.forEach((item, idx) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="text-align:center;">${escapeHtml(item.date)}</td>
        <td><strong>${escapeHtml(item.title)}</strong></td>
        <td style="text-align:center; display:flex; gap:6px; justify-content:center;">
          <button class="btn-edit-item" data-id="${item.id}" style="background:#e0f2fe; color:#0284c7; border:1px solid #bae6fd; padding:5px 10px; border-radius:4px; font-size:0.78rem; font-weight:700; cursor:pointer;">수정</button>
          <button class="btn-delete-item" data-idx="${idx}">삭제</button>
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

    this.attachDelete(tbody, STORE_KEYS.NOTICE, () => this.renderNotice());
  }

  renderNews() {
    const list = getStored(STORE_KEYS.NEWS, []);
    const tbody = document.getElementById('tableBodyNews');
    if (!tbody) return;
    tbody.innerHTML = '';
    if (list.length === 0) {
      tbody.innerHTML = '<tr><td colspan="3" style="text-align:center; padding:20px; color:#94a3b8;">등록된 뉴스가 없습니다.</td></tr>';
      return;
    }
    list.forEach((item, idx) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="text-align:center;">${escapeHtml(item.date)}</td>
        <td><strong>${escapeHtml(item.title)}</strong></td>
        <td style="text-align:center; display:flex; gap:6px; justify-content:center;">
          <button class="btn-edit-item" data-id="${item.id}" style="background:#e0f2fe; color:#0284c7; border:1px solid #bae6fd; padding:5px 10px; border-radius:4px; font-size:0.78rem; font-weight:700; cursor:pointer;">수정</button>
          <button class="btn-delete-item" data-idx="${idx}">삭제</button>
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

    this.attachDelete(tbody, STORE_KEYS.NEWS, () => this.renderNews());
  }

  attachDelete(tbody, storeKey, callback) {
    tbody.querySelectorAll('.btn-delete-item').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.getAttribute('data-idx'), 10);
        if (confirm('선택한 항목을 삭제하시겠습니까?')) {
          const list = getStored(storeKey, []);
          list.splice(idx, 1);
          setStored(storeKey, list);
          callback();
        }
      });
    });
  }
}

/**
 * ====================================================================
 * [PART 4] 일반 방문자용 공통 페이지 데이터 동기화 엔진 (안전 렌더링)
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
  shortNameEls.forEach((el) => {
    el.textContent = labConfig.shortName;
  });

  const fullNameEls = document.querySelectorAll('.logo-desc, .footer-brand-sub');
  fullNameEls.forEach((el) => {
    el.textContent = labConfig.fullName;
  });

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

function syncPublicPagesInternal() {
  const homeBadgeEl = document.getElementById('homeHeroBadge');
  if (homeBadgeEl) {
    const heroData = getStored(STORE_KEYS.HOME_HERO, DEFAULT_HOME_HERO);
    homeBadgeEl.textContent = heroData.badge;
    const homeTitleEl = document.getElementById('homeHeroTitle');
    if (homeTitleEl) homeTitleEl.innerHTML = heroData.title;
    const homeDescEl = document.getElementById('homeHeroDesc');
    if (homeDescEl) homeDescEl.textContent = heroData.desc;
  }

  const homeResearchGrid = document.getElementById('homeResearchGrid');
  if (homeResearchGrid) {
    const researchList = getStored(STORE_KEYS.RESEARCH_AREAS, DEFAULT_RESEARCH_AREAS);
    homeResearchGrid.innerHTML = '';
    if (researchList.length === 0) {
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

  const homeBoardBox = document.getElementById('homeBoardContainer');
  if (homeBoardBox) {
    const notices = getStored(STORE_KEYS.NOTICE, []).map(n => ({ ...n, originType: 'notice' }));
    const news = getStored(STORE_KEYS.NEWS, []).map(w => ({ ...w, originType: 'news' }));
    const combined = [...notices, ...news].sort((a, b) => parseCustomDate(b.date, b.id) - parseCustomDate(a.date, a.id));
    const recentThree = combined.slice(0, 3);
    homeBoardBox.innerHTML = '';
    if (recentThree.length === 0) {
      homeBoardBox.innerHTML = '<div class="empty-state-card"><p>등록된 게시물이 없습니다.</p></div>';
    } else {
      recentThree.forEach((item, idx) => {
        const isNews = item.originType === 'news';
        const tagText = isNews ? 'News' : 'Notice';
        const tagClass = isNews ? 'notice-tag news-tag' : 'notice-tag';
        const box = document.createElement('article');
        box.className = 'notice-box'; box.style.cursor = 'pointer';
        box.innerHTML = `<span class="${tagClass}">${escapeHtml(tagText)}</span><h3 class="notice-title">${escapeHtml(item.title)}</h3><div class="notice-desc">${formatDesc(item.desc || '')}</div><span class="notice-date">${escapeHtml(item.date || '')}</span>`;
        box.addEventListener('click', () => { location.href = `view.html?type=${item.originType}&id=${item.id !== undefined ? item.id : idx}`; });
        homeBoardBox.appendChild(box);
      });
    }
  }

  const homePubBox = document.getElementById('homePubContainer');
  if (homePubBox) {
    const allPubs = getStored(STORE_KEYS.PUB, []);
    const sortedPubs = allPubs.sort((a, b) => parseCustomDate(b.year, b.id) - parseCustomDate(a.year, a.id));
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

  const dirNameKo = document.querySelector('.pi-name');
  if (dirNameKo) {
    const dir = getStored(STORE_KEYS.DIRECTOR, DEFAULT_DIRECTOR);
    dirNameKo.textContent = dir.nameKo || '';
    const dirNameEn = document.querySelector('.pi-eng-name');
    if (dirNameEn) dirNameEn.textContent = dir.nameEn || '';
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
    const cvSections = document.querySelectorAll('.cv-section');
    if (cvSections && cvSections.length > 0) {
      cvSections.forEach((section) => {
        const titleEl = section.querySelector('.cv-title');
        const wrap = section.querySelector('.edu-timeline-wrap');
        if (!titleEl || !wrap) return;
        const titleText = titleEl.textContent.trim();
        if (titleText.includes('Education')) {
          const eduList = getStored(STORE_KEYS.EDUCATION, []);
          wrap.innerHTML = '';
          if (eduList.length === 0) {
            wrap.innerHTML = '<div class="empty-state-card" style="padding:20px; font-size:0.9rem;"><p>등록된 학력 정보가 없습니다.</p></div>';
          } else {
            eduList.slice().reverse().forEach(item => {
              const row = document.createElement('div'); row.className = 'edu-row';
              row.innerHTML = `<div class="edu-period"><span class="edu-badge">${escapeHtml(item.period)}</span></div><div class="edu-details"><span class="edu-degree">${escapeHtml(item.degree)}</span><span class="edu-sep">/</span><span class="edu-institution">${escapeHtml(item.inst)}</span></div>`;
              wrap.appendChild(row);
            });
          }
        } else if (titleText.includes('Experience') || titleText.includes('Professional')) {
          const expList = getStored(STORE_KEYS.EXPERIENCE, []);
          wrap.innerHTML = '';
          if (expList.length === 0) {
            wrap.innerHTML = '<div class="empty-state-card" style="padding:20px; font-size:0.9rem;"><p>등록된 경력 및 활동 정보가 없습니다.</p></div>';
          } else {
            expList.slice().reverse().forEach(item => {
              const row = document.createElement('div'); row.className = 'edu-row';
              row.innerHTML = `<div class="edu-period"><span class="edu-badge">${escapeHtml(item.period)}</span></div><div class="edu-details"><span class="edu-degree" style="font-weight: 600 !important;">${escapeHtml(item.degree)}</span><span class="edu-sep">/</span><span class="edu-institution">${escapeHtml(item.inst)}</span></div>`;
              wrap.appendChild(row);
            });
          }
        }
      });
    }
  }

  // Current / Trainee 2단 렌더링
  const cResearcher = document.getElementById('containerResearcher');
  const cTrainee = document.getElementById('containerTrainee');
  if (cResearcher || cTrainee) {
    const list = getStored(STORE_KEYS.CURRENT, []);
    if (cResearcher) cResearcher.innerHTML = '';
    if (cTrainee) cTrainee.innerHTML = '';
    const traineeList = list.filter(m => (m.role || '').includes('교육생') || (m.role || '').toLowerCase().includes('trainee'));
    const researcherList = list.filter(m => !traineeList.includes(m));
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

  // Alumni 연도별 렌더링
  const alumniMainContainer = document.getElementById('alumniContainer');
  if (alumniMainContainer) {
    const list = getStored(STORE_KEYS.ALUMNI, []);
    alumniMainContainer.innerHTML = '';
    if (list.length === 0) { alumniMainContainer.innerHTML = '<div class="empty-state-card"><p>등록된 졸업생이 없습니다.</p></div>'; return; }
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

  // Lab Life 렌더링
  const lablifeContainer = document.getElementById('lablifeListContainer');
  if (lablifeContainer) {
    const list = getStored(STORE_KEYS.LABLIFE, []);
    lablifeContainer.innerHTML = '';
    if (list.length === 0) { lablifeContainer.innerHTML = '<div class="empty-state-card" style="grid-column: 1 / -1;"><p>등록된 Lab Life 활동이 없습니다.</p></div>'; }
    else {
      list.forEach((item, idx) => {
        const card = document.createElement('article'); card.className = 'lablife-card clickable-card';
        let thumbImg = (item.images && item.images.length > 0) ? `<img src="${item.images[0]}" alt="사진" style="width:100%; height:100%; object-fit:contain;" />` : (item.image ? `<img src="${item.image}" alt="사진" style="width:100%; height:100%; object-fit:contain;" />` : `<div class="img-placeholder">No Image</div>`);
        card.innerHTML = `<div class="lablife-img-frame">${thumbImg}</div><div class="lablife-content"><span class="lablife-date">${escapeHtml(item.date)}</span><h3 class="lablife-title">${escapeHtml(item.title)}</h3><div class="lablife-desc">${formatDesc(item.desc || '')}</div></div>`;
        card.addEventListener('click', () => { location.href = `view.html?type=lablife&id=${item.id !== undefined ? item.id : idx}`; });
        lablifeContainer.appendChild(card);
      });
    }
  }

  // Notice 렌더링
  const noticeTbody = document.getElementById('noticeTableBody');
  if (noticeTbody) {
    const list = getStored(STORE_KEYS.NOTICE, []);
    const sortedList = list.slice().sort((a, b) => parseCustomDate(b.date, b.id) - parseCustomDate(a.date, a.id));
    noticeTbody.innerHTML = '';
    if (sortedList.length === 0) { noticeTbody.innerHTML = '<tr><td colspan="3" style="text-align: center; padding: 40px; color: #475569;">등록된 공지사항이 없습니다.</td></tr>'; }
    else {
      sortedList.forEach((item, idx) => {
        const tr = document.createElement('tr'); tr.className = 'notice-row clickable-row';
        tr.innerHTML = `<td style="text-align:center;">${sortedList.length - idx}</td><td class="notice-title-cell"><span class="board-link">${escapeHtml(item.title)}</span></td><td style="text-align:center;">${escapeHtml(item.date)}</td>`;
        tr.addEventListener('click', () => { location.href = `view.html?type=notice&id=${item.id !== undefined ? item.id : idx}`; });
        noticeTbody.appendChild(tr);
      });
    }
  }

  // News 렌더링
  const newsContainer = document.getElementById('newsListContainer');
  if (newsContainer) {
    const list = getStored(STORE_KEYS.NEWS, []);
    const sortedList = list.slice().sort((a, b) => parseCustomDate(b.date, b.id) - parseCustomDate(a.date, a.id));
    newsContainer.innerHTML = '';
    if (sortedList.length === 0) { newsContainer.innerHTML = '<div class="empty-state-card" style="grid-column: 1 / -1;"><p>등록된 뉴스가 없습니다.</p></div>'; }
    else {
      sortedList.forEach((item, idx) => {
        const card = document.createElement('article'); card.className = 'lablife-card clickable-card';
        let thumbImg = (item.images && item.images.length > 0) ? `<img src="${item.images[0]}" alt="사진" style="width:100%; height:100%; object-fit:contain;" />` : (item.image ? `<img src="${item.image}" alt="사진" style="width:100%; height:100%; object-fit:contain;" />` : `<div class="img-placeholder">No Image</div>`);
        card.innerHTML = `<div class="lablife-img-frame">${thumbImg}</div><div class="lablife-content"><span class="lablife-date">${escapeHtml(item.date)}</span><h3 class="lablife-title">${escapeHtml(item.title)}</h3><div class="lablife-desc">${formatDesc(item.desc || '')}</div></div>`;
        card.addEventListener('click', () => { location.href = `view.html?type=news&id=${item.id !== undefined ? item.id : idx}`; });
        newsContainer.appendChild(card);
      });
    }
  }

  // View 상세 렌더링
  const viewTitle = document.getElementById('viewTitle');
  if (viewTitle) {
    const params = new URLSearchParams(location.search);
    const type = params.get('type');
    const id = params.get('id');
    let storeKey = STORE_KEYS.NOTICE, catName = 'NOTICE';
    if (type === 'news') { storeKey = STORE_KEYS.NEWS; catName = 'NEWS'; }
    if (type === 'lablife') { storeKey = STORE_KEYS.LABLIFE; catName = 'LAB LIFE'; }
    let list = getStored(storeKey, []);
    let itemIndex = list.findIndex(x => (x.id !== undefined && x.id.toString() === id));
    if (itemIndex === -1) itemIndex = parseInt(id, 10);
    const item = list[itemIndex];
    if (item) {
      item.views = (item.views || 0) + 1; setStored(storeKey, list);
      document.getElementById('viewPageCategory').textContent = catName;
      document.getElementById('viewBadge').textContent = item.category || catName;
      document.getElementById('viewTitle').textContent = item.title;
      document.getElementById('viewDate').textContent = item.date;
      document.getElementById('viewViews').textContent = item.views;
      document.getElementById('viewContent').innerHTML = formatDesc(item.desc || '');
      const galleryBox = document.getElementById('viewImagesGallery');
      const allImgs = [];
      if (item.images && item.images.length > 0) allImgs.push(...item.images);
      else if (item.image) allImgs.push(item.image);
      if (allImgs.length > 0 && galleryBox) {
        galleryBox.innerHTML = '';
        allImgs.forEach(src => { let wrapper = document.createElement('div'); wrapper.className = 'view-single-img-wrap'; wrapper.innerHTML = `<img src="${src}" alt="이미지" />`; galleryBox.appendChild(wrapper); });
        galleryBox.style.display = 'block';
      }
    } else {
      viewTitle.textContent = '해당 게시물을 찾을 수 없습니다.';
      const c = document.getElementById('viewContent'); if(c) c.textContent = '삭제되었거나 잘못된 접근입니다.';
    }
  }
}

/**
 * ====================================================================
 * [PART 5] 논문 및 특허 전용 검색 및 페이징 뷰어 클래스
 * ====================================================================
 */
class DedicatedPubViewer {
  constructor({ targetType, containerId, paginationId, selectId, searchInputId, searchBtnId }) {
    this.targetType = targetType;
    this.container = document.getElementById(containerId);
    this.paginationContainer = document.getElementById(paginationId);
    this.selectEl = document.getElementById(selectId);
    this.searchInput = document.getElementById(searchInputId);
    this.searchBtn = document.getElementById(searchBtnId);
    this.itemsPerPage = 10;
    this.currentPage = 1;

    if (!this.container) return;

    const allItems = getStored(STORE_KEYS.PUB, []);
    const filteredBase = allItems.filter(item => (item.type || 'paper') === this.targetType);
    this.baseList = filteredBase.sort((a, b) => parseCustomDate(b.year, b.id) - parseCustomDate(a.year, a.id));
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
    const filterType = this.selectEl ? this.selectEl.value : 'all';
    if (!keyword) {
      this.filteredList = [...this.baseList];
    } else {
      this.filteredList = this.baseList.filter((item) => {
        const title = (item.title || '').toLowerCase();
        const author = (item.authors || '').toLowerCase();
        const journal = (item.journal || '').toLowerCase();
        if (filterType === 'title') return title.includes(keyword);
        if (filterType === 'author') return author.includes(keyword);
        if (filterType === 'journal') return journal.includes(keyword);
        return title.includes(keyword) || author.includes(keyword) || journal.includes(keyword) || (item.year || '').includes(keyword);
      });
    }
    this.currentPage = 1;
    this.render();
  }

  render() {
    this.container.innerHTML = '';
    const emptyMsg = this.targetType === 'patent' ? '등록된 특허가 없습니다.' : '등록된 논문이 없습니다.';
    if (this.baseList.length === 0) { this.container.innerHTML = `<div class="empty-state-card"><p>${emptyMsg}</p></div>`; if (this.paginationContainer) this.paginationContainer.innerHTML = ''; return; }
    if (this.filteredList.length === 0) { this.container.innerHTML = '<div class="empty-state-card"><p>검색 조건과 일치하는 항목이 없습니다.</p></div>'; if (this.paginationContainer) this.paginationContainer.innerHTML = ''; return; }

    const totalPages = Math.ceil(this.filteredList.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const pagedItems = this.filteredList.slice(startIndex, startIndex + this.itemsPerPage);

    pagedItems.forEach((pub) => {
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
      this.container.appendChild(article);
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
 * [PART 6] 일반 게시판 및 목록 검색/페이징 컨트롤러 클래스
 * ====================================================================
 */
class GenericListController {
  constructor({ containerId, itemSelector, titleSelector, descSelector, selectId, searchInputId, searchBtnId, paginationId, itemsPerPage = 10 }) {
    this.containerId = containerId; this.container = document.getElementById(containerId);
    this.selectEl = document.getElementById(selectId); this.searchInput = document.getElementById(searchInputId);
    this.searchBtn = document.getElementById(searchBtnId); this.paginationContainer = document.getElementById(paginationId);
    this.itemSelector = itemSelector; this.titleSelector = titleSelector; this.descSelector = descSelector;
    this.itemsPerPage = itemsPerPage; this.currentPage = 1;
    if (!this.container) return;
    setTimeout(() => { this.container = document.getElementById(this.containerId); this.init(); }, 60);
  }
  init() {
    if (!this.container) return;
    if (this.searchInput) { this.searchInput.addEventListener('input', () => { this.currentPage = 1; this.render(); }); }
    if (this.selectEl) { this.selectEl.addEventListener('change', () => { this.currentPage = 1; this.render(); }); }
    if (this.searchBtn) { this.searchBtn.addEventListener('click', () => { this.currentPage = 1; this.render(); }); }
    this.render();
  }
  render() {
    if (!this.container) return;
    const allItems = Array.from(this.container.querySelectorAll(this.itemSelector));
    if (allItems.length === 0) return;
    const keyword = (this.searchInput ? this.searchInput.value.trim().toLowerCase() : '').replace(/\s+/g, '');
    const filtered = allItems.filter((item) => {
      if (!keyword) return true;
      const text = item.textContent.trim().toLowerCase().replace(/\s+/g, '');
      return text.includes(keyword);
    });
    allItems.forEach(i => i.style.display = 'none');
    this.container.querySelectorAll('.empty-state-card').forEach(el => el.remove());
    if (filtered.length === 0) {
      const msg = document.createElement('div'); msg.className = 'empty-state-card'; msg.style.gridColumn = '1/-1'; msg.innerHTML = '<p>검색 조건과 일치하는 항목이 없습니다.</p>';
      this.container.appendChild(msg); return;
    }
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const currentSlice = filtered.slice(startIndex, startIndex + this.itemsPerPage);
    currentSlice.forEach(item => { item.style.display = item.tagName === 'TR' ? 'table-row' : 'flex'; });
    this.renderPagination(filtered.length);
  }
  renderPagination(totalCount) {
    if (!this.paginationContainer) return;
    this.paginationContainer.innerHTML = '';
    const totalPages = Math.ceil(totalCount / this.itemsPerPage);
    if (totalPages <= 1) return;
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
 * [PART 7] 웹페이지 구동 메인 초기화 루틴
 * ====================================================================
 */
document.addEventListener('DOMContentLoaded', () => {
  syncPublicPages();
  new UnifiedAdminApp();
  const topBtn = document.getElementById('scrollTopBtn');
  if (topBtn) topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  new DedicatedPubViewer({ targetType: 'paper', containerId: 'pubListContainer', paginationId: 'pubPagination', selectId: 'searchSelectValue', searchInputId: 'pubSearchInput', searchBtnId: 'pubSearchBtn' });
  new DedicatedPubViewer({ targetType: 'patent', containerId: 'patentListContainer', paginationId: 'patentPagination', selectId: 'searchSelectValue', searchInputId: 'patentSearchInput', searchBtnId: 'patentSearchBtn' });
  if (document.getElementById('lablifeListContainer')) {
    new GenericListController({ containerId: 'lablifeListContainer', itemSelector: '.lablife-card', titleSelector: '.lablife-title', descSelector: '.lablife-desc', selectId: 'searchSelectValue', searchInputId: 'lablifeSearchInput', searchBtnId: 'lablifeSearchBtn', paginationId: 'lablifePagination', itemsPerPage: 6 });
  }
  if (document.getElementById('noticeTableBody')) {
    new GenericListController({ containerId: 'noticeTableBody', itemSelector: '.notice-row', titleSelector: '.board-link', descSelector: '.board-link', selectId: 'searchSelectValue', searchInputId: 'noticeSearchInput', searchBtnId: 'noticeSearchBtn', paginationId: 'noticePagination', itemsPerPage: 10 });
  }
  if (document.getElementById('newsListContainer')) {
    new GenericListController({ containerId: 'newsListContainer', itemSelector: '.lablife-card', titleSelector: '.lablife-title', descSelector: '.lablife-desc', selectId: 'searchSelectValue', searchInputId: 'newsSearchInput', searchBtnId: 'newsSearchBtn', paginationId: 'newsPagination', itemsPerPage: 6 });
  }
});