const EducationLoan = (() => {
  let activeTab = 'form'; // 'form' or 'list'
  let listSearch = '';
  let listCountry = '';
  let listStatus = '';

  const COUNTRIES = [
    { code: 'India', flag: '🇮🇳', name: 'India' },
    { code: 'USA', flag: '🇺🇸', name: 'USA' },
    { code: 'Canada', flag: '🇨🇦', name: 'Canada' },
    { code: 'UK', flag: '🇬🇧', name: 'UK' },
    { code: 'France', flag: '🇫🇷', name: 'France' },
    { code: 'Others', flag: '🌐', name: 'Others.' }
  ];

  const DEFAULT_EDU_ROWS = [
    { exam: '10th / SSC', year: '2019', marks: '88%', school: 'St. Joseph Higher Secondary School' },
    { exam: '12th / HSC', year: '2021', marks: '85%', school: 'Kendriya Vidyalaya' },
    { exam: 'Graduation / Degree', year: '2025', marks: '78%', school: 'Anna University (B.Tech CSE)' },
    { exam: 'Post Graduation', year: '', marks: '', school: '' }
  ];

  const escapeHtml = (s) =>
    String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  function getList() {
    let items = DB.get('education_loans');
    if (!items || !items.length) {
      items = [
        {
          id: 'CG-EDU-2026-0001',
          date: '2026-11-06',
          consultancyName: 'Apex Overseas Education',
          loanAmount: '₹ 45,00,000',
          studentName: 'Karthik S',
          fatherName: 'Sundaramoorthy K',
          motherName: 'Lakshmi S',
          dob: '2003-05-14',
          gender: 'Male',
          currentAddress: '42, 2nd Main Road, Gandhi Nagar, Adyar',
          currentPincode: '600020',
          permAddress: '42, 2nd Main Road, Gandhi Nagar, Adyar',
          permPincode: '600020',
          residenceType: 'Self Owned',
          monthlyRent: '',
          maritalStatus: 'Single',
          mobile: '9876543210',
          email: 'karthik.s@gmail.com',
          education: [
            { exam: '10th / SSC', year: '2019', marks: '92%', school: 'DAV Senior Secondary School' },
            { exam: '12th / HSC', year: '2021', marks: '89%', school: 'DAV Senior Secondary School' },
            { exam: 'B.Tech IT', year: '2025', marks: '8.4 CGPA', school: 'Anna University, Chennai' }
          ],
          entranceTest: 'GRE',
          entranceScore: '324 (Q:168, V:156, AWA:4.5)',
          degreeA: 'B.Tech in Information Technology',
          degreeB: 'Minor in Artificial Intelligence',
          degreeC: '',
          admissionStatus: 'Confirmed',
          courseDuration: '2 Years',
          university: 'Northeastern University, Boston',
          courseName: 'MS in Computer Science',
          country: 'USA',
          otherCountry: '',
          crmStatus: 'Under Process'
        },
        {
          id: 'CG-EDU-2026-0002',
          date: '2026-11-05',
          consultancyName: 'Global Edutech Partners',
          loanAmount: '₹ 32,00,000',
          studentName: 'Sanjay M',
          fatherName: 'Manickam P',
          motherName: 'Sarada M',
          dob: '2002-11-20',
          gender: 'Male',
          currentAddress: '15/B, Lake View Road, Nungambakkam',
          currentPincode: '600034',
          permAddress: '15/B, Lake View Road, Nungambakkam',
          permPincode: '600034',
          residenceType: 'Self Owned',
          monthlyRent: '',
          maritalStatus: 'Single',
          mobile: '9367788991',
          email: 'sanjay.m@outlook.com',
          education: [
            { exam: '10th / SSC', year: '2018', marks: '86%', school: 'St. John Matric School' },
            { exam: '12th / HSC', year: '2020', marks: '84%', school: 'St. John Matric School' },
            { exam: 'B.E. Mechanical', year: '2024', marks: '7.9 CGPA', school: 'PSG College of Technology' }
          ],
          entranceTest: 'IELTS',
          entranceScore: '7.5 Bands (L:8, R:7.5, W:7, S:7.5)',
          degreeA: 'Bachelor of Engineering in Mechanical',
          degreeB: '',
          degreeC: '',
          admissionStatus: 'Confirmed',
          courseDuration: '2 Years',
          university: 'University of Windsor',
          courseName: 'Master of Engineering (Automotive)',
          country: 'Canada',
          otherCountry: '',
          crmStatus: 'Sanctioned'
        },
        {
          id: 'CG-EDU-2026-0003',
          date: '2026-11-04',
          consultancyName: 'Direct Walk-in',
          loanAmount: '₹ 50,00,000',
          studentName: 'Vignesh P',
          fatherName: 'Ponnusamy R',
          motherName: 'Meenakshi P',
          dob: '2003-08-09',
          gender: 'Male',
          currentAddress: 'Flat 302, Green Acre Apts, Velachery',
          currentPincode: '600042',
          permAddress: '9, South Car Street, Madurai',
          permPincode: '625001',
          residenceType: 'Rented',
          monthlyRent: '22,000',
          maritalStatus: 'Single',
          mobile: '9500144112',
          email: 'vignesh.p@gmail.com',
          education: [
            { exam: '10th / SSC', year: '2019', marks: '90%', school: 'TVS Higher Secondary School' },
            { exam: '12th / HSC', year: '2021', marks: '87%', school: 'TVS Higher Secondary School' },
            { exam: 'B.Sc Data Science', year: '2025', marks: '8.1 CGPA', school: 'Loyola College, Chennai' }
          ],
          entranceTest: 'TOEFL',
          entranceScore: '105 (R:28, L:27, S:24, W:26)',
          degreeA: 'B.Sc in Data Science & Statistics',
          degreeB: '',
          degreeC: '',
          admissionStatus: 'Awaited',
          courseDuration: '1 Year',
          university: 'University of Manchester',
          courseName: 'MSc Data Science & Analytics',
          country: 'UK',
          otherCountry: '',
          crmStatus: 'Under Process'
        }
      ];
      DB.set('education_loans', items);
    }
    return items;
  }

  function saveList(items) {
    DB.set('education_loans', items);
  }

  function nextEnquiryId() {
    const list = getList();
    const maxNum = list.reduce((m, item) => {
      const parts = (item.id || '').split('-');
      const num = parseInt(parts[parts.length - 1], 10);
      return !isNaN(num) && num > m ? num : m;
    }, 0);
    return `CG-EDU-${new Date().getFullYear()}-${String(maxNum + 1).padStart(4, '0')}`;
  }

  function renderView() {
    const items = getList();
    return `
      <div class="edu-wrap">
        <div class="edu-head-bar">
          <div class="title-group">
            <h1>
              <svg class="i" style="width:28px;height:28px;color:var(--orange)"><use href="#i-file"/></svg>
              Student Details for Education Loan
            </h1>
            <p>Student Profile, Academic History, Target University & Study Abroad Loan Enquiry Form</p>
          </div>
          <div class="edu-tabs">
            <button type="button" class="edu-tab-btn ${activeTab === 'form' ? 'active' : ''}" data-edu-tab="form">
              + New Loan Enquiry
            </button>
            <button type="button" class="edu-tab-btn ${activeTab === 'list' ? 'active' : ''}" data-edu-tab="list">
              All Enquiries (${items.length})
            </button>
          </div>
        </div>

        ${activeTab === 'form' ? renderForm() : renderEnquiriesTable()}
      </div>
    `;
  }

  function renderForm(existingData = null) {
    const today = new Date().toISOString().slice(0, 10);
    const d = existingData || {
      date: today,
      consultancyName: '',
      loanAmount: '',
      studentName: '',
      fatherName: '',
      motherName: '',
      dob: '',
      gender: 'Male',
      currentAddress: '',
      currentPincode: '',
      permAddress: '',
      permPincode: '',
      residenceType: 'Self Owned',
      monthlyRent: '',
      maritalStatus: 'Single',
      mobile: '',
      email: '',
      entranceTest: 'GRE',
      entranceScore: '',
      degreeA: '',
      degreeB: '',
      degreeC: '',
      admissionStatus: 'Confirmed',
      courseDuration: '2 Years',
      university: '',
      courseName: '',
      country: 'USA',
      otherCountry: ''
    };

    return `
      <form id="eduLoanForm" novalidate>
        <!-- 1. GENERAL / ENQUIRY HEADER DETAILS -->
        <div class="sec-card">
          <div class="sec-title">
            <span class="sec-num orange">★</span>
            <div>
              <h3>STUDENT DETAILS FOR EDUCATION LOAN</h3>
              <small class="muted">Application date, consultancy / referral partner, and requested loan amount</small>
            </div>
            <span class="sec-badge">Step 1 of 4</span>
          </div>

          <div class="fgrid">
            <label>
              Date: *
              <input type="date" name="enquiryDate" id="enquiryDate" value="${escapeHtml(d.date || today)}" required>
              <small data-err="enquiryDate"></small>
            </label>

            <label>
              Consultancy Name:
              <input type="text" name="consultancyName" id="consultancyName" list="consultancyList" placeholder="e.g. Apex Overseas / Direct Walk-in" value="${escapeHtml(d.consultancyName)}">
              <datalist id="consultancyList">
                <option value="Direct Walk-in">
                <option value="Apex Overseas Education">
                <option value="Global Edutech Partners">
                <option value="IDP Education">
                <option value="Study Metro Consultants">
                <option value="Canam Overseas">
                <option value="Y-Axis Study Abroad">
              </datalist>
              <small data-err="consultancyName"></small>
            </label>

            <label>
              Loan Amount: *
              <div class="input-pre">
                <span class="pre">₹</span>
                <input type="text" name="loanAmount" id="loanAmount" placeholder="e.g. 35,00,000" value="${escapeHtml(d.loanAmount)}" required>
              </div>
              <div class="quick-chips">
                <button type="button" class="quick-chip" data-amt="15,00,000">₹15 Lakhs</button>
                <button type="button" class="quick-chip" data-amt="25,00,000">₹25 Lakhs</button>
                <button type="button" class="quick-chip" data-amt="35,00,000">₹35 Lakhs</button>
                <button type="button" class="quick-chip" data-amt="50,00,000">₹50 Lakhs</button>
                <button type="button" class="quick-chip" data-amt="75,00,000">₹75 Lakhs</button>
              </div>
              <small data-err="loanAmount"></small>
            </label>
          </div>
        </div>

        <!-- 2. STUDENT DETAILS -->
        <div class="sec-card">
          <div class="sec-title">
            <span class="sec-num">A</span>
            <div>
              <h3>STUDENT DETAILS</h3>
              <small class="muted">Primary applicant identity, family, residence and contact information</small>
            </div>
            <span class="sec-badge">Step 2 of 4</span>
          </div>

          <div class="fgrid">
            <label>
              Name: *
              <input type="text" name="studentName" id="studentName" placeholder="Student's Full Name" value="${escapeHtml(d.studentName)}" required>
              <small data-err="studentName"></small>
            </label>

            <label>
              Father's Name: *
              <input type="text" name="fatherName" id="fatherName" placeholder="Father's Full Name" value="${escapeHtml(d.fatherName)}" required>
              <small data-err="fatherName"></small>
            </label>

            <label>
              Mother's Name:
              <input type="text" name="motherName" id="motherName" placeholder="Mother's Full Name" value="${escapeHtml(d.motherName)}">
              <small data-err="motherName"></small>
            </label>

            <label>
              Date of Birth:
              <input type="date" name="dob" id="dob" value="${escapeHtml(d.dob)}">
              <small data-err="dob"></small>
            </label>

            <div>
              <span style="display:block;font-weight:600;font-size:13px;margin-bottom:6px">Gender:</span>
              <div class="choice-row">
                ${['Male', 'Female', 'Other'].map(g => `
                  <label class="choice-card blue-check ${d.gender === g ? 'checked' : ''}">
                    <input type="radio" name="gender" value="${g}" ${d.gender === g ? 'checked' : ''}>
                    <span class="c-icon">✓</span>
                    ${g}
                  </label>
                `).join('')}
              </div>
            </div>

            <div>
              <span style="display:block;font-weight:600;font-size:13px;margin-bottom:6px">Marital Status:</span>
              <div class="choice-row">
                ${['Single', 'Married', 'Other'].map(m => `
                  <label class="choice-card ${d.maritalStatus === m ? 'checked' : ''}">
                    <input type="radio" name="maritalStatus" value="${m}" ${d.maritalStatus === m ? 'checked' : ''}>
                    <span class="c-icon">✓</span>
                    ${m}
                  </label>
                `).join('')}
              </div>
            </div>

            <label>
              10 Mobile No: *
              <div class="input-pre">
                <span class="pre">+91</span>
                <input type="tel" name="mobile" id="mobile" maxlength="10" placeholder="10-digit mobile number" value="${escapeHtml(d.mobile)}" required>
              </div>
              <small data-err="mobile"></small>
            </label>

            <label>
              E-mail ID: *
              <input type="email" name="email" id="email" placeholder="student.name@example.com" value="${escapeHtml(d.email)}" required>
              <small data-err="email"></small>
            </label>

            <div>
              <span style="display:block;font-weight:600;font-size:13px;margin-bottom:6px">Current Residence:</span>
              <div class="choice-row">
                <label class="choice-card square ${d.residenceType === 'Self Owned' ? 'checked' : ''}">
                  <input type="radio" name="residenceType" value="Self Owned" ${d.residenceType === 'Self Owned' ? 'checked' : ''}>
                  <span class="c-icon">✓</span>
                  ☑ Self Owned
                </label>
                <label class="choice-card square ${d.residenceType === 'Rented' ? 'checked' : ''}">
                  <input type="radio" name="residenceType" value="Rented" ${d.residenceType === 'Rented' ? 'checked' : ''}>
                  <span class="c-icon">✓</span>
                  ☐ Rented @
                </label>
              </div>
              <div id="rentAmountWrap" style="margin-top:8px;${d.residenceType === 'Rented' ? '' : 'display:none'}">
                <input type="text" name="monthlyRent" id="monthlyRent" placeholder="Monthly Rent amount (e.g. ₹18,000)" value="${escapeHtml(d.monthlyRent || '')}">
              </div>
            </div>

            <!-- Addresses -->
            <label class="wide">
              Current Residential Address:
              <textarea name="currentAddress" id="currentAddress" rows="2" placeholder="House/Flat No, Street, Landmark, City, State">${escapeHtml(d.currentAddress)}</textarea>
              <small data-err="currentAddress"></small>
            </label>

            <label>
              Pincode:
              <input type="text" name="currentPincode" id="currentPincode" maxlength="6" placeholder="e.g. 600020" value="${escapeHtml(d.currentPincode)}">
              <small data-err="currentPincode"></small>
            </label>

            <div class="wide">
              <div class="sync-box">
                <input type="checkbox" id="sameAddressCheck">
                <label for="sameAddressCheck" style="cursor:pointer;font-weight:600;display:inline">
                  Same as Current Residential Address (Check to auto-copy address & pincode)
                </label>
              </div>
            </div>

            <label class="wide">
              7. Permanent Residential Address:
              <textarea name="permAddress" id="permAddress" rows="2" placeholder="Permanent House/Flat No, Street, Town/City, District, State">${escapeHtml(d.permAddress)}</textarea>
              <small data-err="permAddress"></small>
            </label>

            <label>
              Permanent Pincode:
              <input type="text" name="permPincode" id="permPincode" maxlength="6" placeholder="e.g. 600020" value="${escapeHtml(d.permPincode)}">
              <small data-err="permPincode"></small>
            </label>
          </div>
        </div>

        <!-- 3. 12 Educational Details -->
        <div class="sec-card">
          <div class="sec-title">
            <span class="sec-num">B</span>
            <div>
              <h3>12 Educational Details</h3>
              <small class="muted">Academic track record, entrance examination score and degrees obtained</small>
            </div>
            <span class="sec-badge">Step 3 of 4</span>
          </div>

          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
            <span style="font-weight:700;font-size:13.5px;color:var(--navy)">Academic Qualification Table</span>
            <button type="button" class="btn ghost small" id="addEduRowBtn" style="padding:6px 12px;font-size:12px">
              + Add Qualification Row
            </button>
          </div>

          <div class="edu-tbl-wrap">
            <table class="edu-table" id="eduTable">
              <thead>
                <tr>
                  <th style="width:25%">EXAM/COURSE</th>
                  <th style="width:18%">YEAR COMPLETED</th>
                  <th style="width:18%">MARKS (%)</th>
                  <th style="width:33%">SCHOOL/COLLEGE/UNIVERSITY</th>
                  <th style="width:6%"></th>
                </tr>
              </thead>
              <tbody id="eduTbody">
                ${(d.education && d.education.length ? d.education : DEFAULT_EDU_ROWS).map((row, idx) => `
                  <tr>
                    <td><input type="text" class="edu-exam" value="${escapeHtml(row.exam)}" placeholder="e.g. 10th / Degree"></td>
                    <td><input type="text" class="edu-year" value="${escapeHtml(row.year)}" placeholder="e.g. 2021"></td>
                    <td><input type="text" class="edu-marks" value="${escapeHtml(row.marks)}" placeholder="e.g. 85%"></td>
                    <td><input type="text" class="edu-school" value="${escapeHtml(row.school)}" placeholder="School/College/University"></td>
                    <td>
                      <button type="button" class="tbl-row-del" title="Remove row" onclick="this.closest('tr').remove()">×</button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <!-- Entrance Test Section -->
          <div class="entrance-box">
            <h4>
              <svg class="i sm" style="color:var(--orange)"><use href="#i-check"/></svg>
              Entrance Test
            </h4>
            <div class="fgrid">
              <label>
                NAME OF ENTRANCE TEST:
                <select name="entranceTest" id="entranceTest">
                  <option value="None" ${d.entranceTest === 'None' ? 'selected' : ''}>None / Not Applicable</option>
                  <option value="GRE" ${d.entranceTest === 'GRE' ? 'selected' : ''}>GRE</option>
                  <option value="IELTS" ${d.entranceTest === 'IELTS' ? 'selected' : ''}>IELTS</option>
                  <option value="TOEFL" ${d.entranceTest === 'TOEFL' ? 'selected' : ''}>TOEFL</option>
                  <option value="PTE" ${d.entranceTest === 'PTE' ? 'selected' : ''}>PTE</option>
                  <option value="Duolingo" ${d.entranceTest === 'Duolingo' ? 'selected' : ''}>Duolingo</option>
                  <option value="GMAT" ${d.entranceTest === 'GMAT' ? 'selected' : ''}>GMAT</option>
                  <option value="SAT" ${d.entranceTest === 'SAT' ? 'selected' : ''}>SAT</option>
                  <option value="Other" ${d.entranceTest === 'Other' ? 'selected' : ''}>Other Entrance Test</option>
                </select>
              </label>

              <label>
                SCORE:
                <input type="text" name="entranceScore" id="entranceScore" placeholder="e.g. GRE 322 or IELTS 7.5 Band" value="${escapeHtml(d.entranceScore)}">
                <small data-err="entranceScore"></small>
              </label>
            </div>
          </div>

          <!-- Degree Names a, b, c -->
          <div style="margin-top:16px">
            <span style="font-weight:700;font-size:13px;color:var(--navy);display:block;margin-bottom:8px">
              NAME OF DEGREE:
            </span>
            <div class="degree-list">
              <div class="degree-item">
                <span class="badge-prefix">a)</span>
                <input type="text" name="degreeA" placeholder="Degree Name (e.g. B.Tech Computer Science)" value="${escapeHtml(d.degreeA)}">
              </div>
              <div class="degree-item">
                <span class="badge-prefix">b)</span>
                <input type="text" name="degreeB" placeholder="Degree Name (optional)" value="${escapeHtml(d.degreeB)}">
              </div>
              <div class="degree-item">
                <span class="badge-prefix">c)</span>
                <input type="text" name="degreeC" placeholder="Degree Name (optional)" value="${escapeHtml(d.degreeC)}">
              </div>
            </div>
          </div>
        </div>

        <!-- 4. B COURSE DETAILS -->
        <div class="sec-card">
          <div class="sec-title">
            <span class="sec-num">C</span>
            <div>
              <h3>B COURSE DETAILS</h3>
              <small class="muted">Admission status, study destination, university and proposed course details</small>
            </div>
            <span class="sec-badge">Step 4 of 4</span>
          </div>

          <div class="fgrid">
            <div>
              <span style="display:block;font-weight:600;font-size:13px;margin-bottom:6px">1. Admission Status:</span>
              <div class="choice-row">
                <label class="choice-card square ${d.admissionStatus === 'Confirmed' ? 'checked' : ''}">
                  <input type="radio" name="admissionStatus" value="Confirmed" ${d.admissionStatus === 'Confirmed' ? 'checked' : ''}>
                  <span class="c-icon">✓</span>
                  ☑ Confirmed
                </label>
                <label class="choice-card square ${d.admissionStatus === 'Awaited' ? 'checked' : ''}">
                  <input type="radio" name="admissionStatus" value="Awaited" ${d.admissionStatus === 'Awaited' ? 'checked' : ''}>
                  <span class="c-icon">✓</span>
                  ☐ Awaited
                </label>
              </div>
            </div>

            <label>
              2. Course Duration:
              <input type="text" name="courseDuration" id="courseDuration" placeholder="e.g. 2 Years / 24 Months" value="${escapeHtml(d.courseDuration)}" list="durationList">
              <datalist id="durationList">
                <option value="1 Year">
                <option value="18 Months">
                <option value="2 Years">
                <option value="3 Years">
                <option value="4 Years">
              </datalist>
              <small data-err="courseDuration"></small>
            </label>

            <label class="wide">
              3. University/College: *
              <input type="text" name="university" id="university" placeholder="e.g. Northeastern University, Boston / University of Toronto" value="${escapeHtml(d.university)}" required>
              <small data-err="university"></small>
            </label>

            <label class="wide">
              Name of the Course: *
              <input type="text" name="courseName" id="courseName" placeholder="e.g. Master of Science in Computer Science / MBA" value="${escapeHtml(d.courseName)}" required>
              <small data-err="courseName"></small>
            </label>

            <div class="wide">
              <span style="display:block;font-weight:600;font-size:13px;margin-bottom:6px">Country: *</span>
              <div class="choice-row">
                ${COUNTRIES.map(c => `
                  <label class="choice-card blue-check ${d.country === c.code ? 'checked' : ''}" style="padding:10px 18px">
                    <input type="radio" name="country" value="${c.code}" ${d.country === c.code ? 'checked' : ''}>
                    <span class="c-icon">✓</span>
                    <span>${c.flag} ${c.name}</span>
                  </label>
                `).join('')}
              </div>
              <div id="otherCountryWrap" style="margin-top:10px;${d.country === 'Others' ? '' : 'display:none'}">
                <input type="text" name="otherCountry" id="otherCountry" placeholder="Please specify country name (e.g. Germany, Australia, Ireland, New Zealand)" value="${escapeHtml(d.otherCountry || '')}">
              </div>
              <small data-err="country"></small>
            </div>
          </div>
        </div>

        <!-- SUBMIT BAR -->
        <div class="edu-submit-bar">
          <div class="summary-pill">
            <svg class="i sm" style="color:var(--orange)"><use href="#i-shield"/></svg>
            <span>All student details are saved into <b>Capital Grow CRM</b></span>
          </div>
          <div class="actions">
            <button type="button" class="btn ghost" id="resetEduBtn">Reset Form</button>
            <button type="submit" class="btn primary" id="submitEduBtn" style="min-width:240px">
              <svg class="i"><use href="#i-check"/></svg>
              Submit Education Loan Enquiry
            </button>
          </div>
        </div>
      </form>
    `;
  }

  function renderEnquiriesTable() {
    let items = getList();

    if (listSearch) {
      const q = listSearch.toLowerCase();
      items = items.filter(
        i =>
          (i.id + i.studentName + i.mobile + i.university + i.courseName + (i.consultancyName || '')).toLowerCase().includes(q)
      );
    }

    if (listCountry) {
      items = items.filter(i => i.country === listCountry);
    }

    if (listStatus) {
      items = items.filter(i => (i.crmStatus || 'Under Process') === listStatus);
    }

    return `
      <div class="card">
        <div class="toolbar">
          <input class="grow" id="eduListSearch" placeholder="Search by Enquiry ID, Student Name, Mobile, University..." value="${escapeHtml(listSearch)}">
          <select id="eduListCountryFilter">
            <option value="">All Countries</option>
            ${COUNTRIES.map(c => `<option value="${c.code}" ${listCountry === c.code ? 'selected' : ''}>${c.name}</option>`).join('')}
          </select>
          <select id="eduListStatusFilter">
            <option value="">All CRM Statuses</option>
            <option value="Under Process" ${listStatus === 'Under Process' ? 'selected' : ''}>Under Process</option>
            <option value="Sanctioned" ${listStatus === 'Sanctioned' ? 'selected' : ''}>Sanctioned</option>
            <option value="Follow-up Due" ${listStatus === 'Follow-up Due' ? 'selected' : ''}>Follow-up Due</option>
          </select>
          <button type="button" class="btn primary small" id="eduNewFromListBtn" style="padding:10px 16px">+ New Loan Enquiry</button>
        </div>

        ${
          items.length
            ? `
          <div class="tbl-wrap rcards">
            <table>
              <thead>
                <tr>
                  <th>Enquiry ID</th>
                  <th>Date</th>
                  <th>Student Name</th>
                  <th>Mobile</th>
                  <th>Country & Course</th>
                  <th>University</th>
                  <th>Loan Amount</th>
                  <th>Admission</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${items
                  .map(
                    item => `
                  <tr>
                    <td data-l="Enquiry ID"><b style="color:var(--blue)">${escapeHtml(item.id)}</b></td>
                    <td data-l="Date">${escapeHtml(item.date)}</td>
                    <td data-l="Student Name"><b>${escapeHtml(item.studentName)}</b><small class="muted" style="display:block">${escapeHtml(item.consultancyName || 'Direct')}</small></td>
                    <td data-l="Mobile">${escapeHtml(item.mobile)}</td>
                    <td data-l="Country & Course">
                      <span class="pill blue" style="font-size:11.5px;padding:2px 8px">${escapeHtml(item.country)}</span>
                      <small style="display:block;margin-top:2px;max-width:200px;overflow:hidden;text-overflow:ellipsis">${escapeHtml(item.courseName)}</small>
                    </td>
                    <td data-l="University"><small><b>${escapeHtml(item.university)}</b></small></td>
                    <td data-l="Loan Amount"><b style="color:var(--orange)">${escapeHtml(item.loanAmount)}</b></td>
                    <td data-l="Admission">
                      <span class="pill ${item.admissionStatus === 'Confirmed' ? 'green' : 'amber'}" style="font-size:11.5px">
                        ${item.admissionStatus === 'Confirmed' ? '✓ Confirmed' : '⌛ Awaited'}
                      </span>
                    </td>
                    <td data-l="Actions">
                      <div class="acts-c">
                        <button class="ib" title="View & Print Slip" data-view-edu="${item.id}">👁</button>
                        <button class="ib del" title="Delete" data-del-edu="${item.id}">🗑</button>
                      </div>
                    </td>
                  </tr>
                `
                  )
                  .join('')}
              </tbody>
            </table>
          </div>
        `
            : `
          <div class="empty">
            <h2>No Education Loan enquiries found</h2>
            <p>Try adjusting your search filters or create a new student loan enquiry.</p>
            <br>
            <button class="btn primary" id="eduEmptyNewBtn">+ Create New Loan Enquiry</button>
          </div>
        `
        }
      </div>
    `;
  }

  function renderSlipModal(id) {
    const item = getList().find(x => x.id === id);
    if (!item) {
      return `
        <div class="card empty">
          <h2>Enquiry not found</h2>
          <a class="btn primary" href="#education-loan">Back to Education Loan</a>
        </div>
      `;
    }

    return `
      <div class="edu-wrap">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
          <a class="link" href="#education-loan">← Back to Education Loans</a>
          <div style="display:flex;gap:10px">
            <button type="button" class="btn ghost" onclick="window.print()">
              🖨 Print / Download Slip
            </button>
            <a class="btn primary" href="#education-loan">Done</a>
          </div>
        </div>

        <div class="card slip-wrap" id="printableSlip">
          <div class="slip-header">
            <div>
              <img src="assets/logo.png" alt="Capital Grow" style="height:44px;object-fit:contain">
              <h2 style="font-size:20px;color:var(--navy);margin-top:6px">STUDENT DETAILS FOR EDUCATION LOAN</h2>
              <p class="muted small">Capital Grow Overseas Education Loan Advisory & Processing</p>
            </div>
            <div style="text-align:right">
              <span class="pill blue" style="font-size:13px;padding:6px 14px;font-weight:700">${escapeHtml(item.id)}</span>
              <small class="muted" style="display:block;margin-top:6px">Date: <b>${escapeHtml(item.date)}</b></small>
            </div>
          </div>

          <div class="slip-grid">
            <div class="slip-field">
              <small>Consultancy Name</small>
              <b>${escapeHtml(item.consultancyName || 'Direct Walk-in')}</b>
            </div>
            <div class="slip-field">
              <small>Loan Amount</small>
              <b style="color:var(--orange);font-size:16px">${escapeHtml(item.loanAmount)}</b>
            </div>
          </div>

          <h3 style="font-size:15px;color:var(--navy);margin:16px 0 8px;border-bottom:1.5px solid var(--bd);padding-bottom:6px">
            STUDENT DETAILS
          </h3>
          <div class="slip-grid">
            <div class="slip-field"><small>Name</small><b>${escapeHtml(item.studentName)}</b></div>
            <div class="slip-field"><small>Father's Name</small><b>${escapeHtml(item.fatherName)}</b></div>
            <div class="slip-field"><small>Mother's Name</small><b>${escapeHtml(item.motherName || '-')}</b></div>
            <div class="slip-field"><small>Date of Birth</small><b>${escapeHtml(item.dob || '-')}</b></div>
            <div class="slip-field"><small>Gender</small><b>${escapeHtml(item.gender)}</b></div>
            <div class="slip-field"><small>Marital Status</small><b>${escapeHtml(item.maritalStatus)}</b></div>
            <div class="slip-field"><small>10 Mobile No</small><b>+91 ${escapeHtml(item.mobile)}</b></div>
            <div class="slip-field"><small>E-mail ID</small><b>${escapeHtml(item.email)}</b></div>
            <div class="slip-field"><small>Current Residence</small><b>${escapeHtml(item.residenceType)}${item.monthlyRent ? ' (Rent: ₹' + item.monthlyRent + ')' : ''}</b></div>
            <div class="slip-field"><small>Current Residential Address & Pincode</small><b>${escapeHtml(item.currentAddress)} - ${escapeHtml(item.currentPincode)}</b></div>
            <div class="slip-field" style="grid-column:1/-1"><small>7. Permanent Residential Address & Pincode</small><b>${escapeHtml(item.permAddress)} - ${escapeHtml(item.permPincode)}</b></div>
          </div>

          <h3 style="font-size:15px;color:var(--navy);margin:16px 0 8px;border-bottom:1.5px solid var(--bd);padding-bottom:6px">
            12 EDUCATIONAL DETAILS
          </h3>
          <table class="slip-table">
            <thead>
              <tr>
                <th>EXAM/COURSE</th>
                <th>YEAR COMPLETED</th>
                <th>MARKS (%)</th>
                <th>SCHOOL/COLLEGE/UNIVERSITY</th>
              </tr>
            </thead>
            <tbody>
              ${(item.education || [])
                .filter(e => e.exam || e.school)
                .map(
                  e => `
                <tr>
                  <td><b>${escapeHtml(e.exam)}</b></td>
                  <td>${escapeHtml(e.year || '-')}</td>
                  <td>${escapeHtml(e.marks || '-')}</td>
                  <td>${escapeHtml(e.school || '-')}</td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>

          <div class="slip-grid" style="margin-top:10px">
            <div class="slip-field"><small>NAME OF ENTRANCE TEST</small><b>${escapeHtml(item.entranceTest || 'None')}</b></div>
            <div class="slip-field"><small>SCORE</small><b>${escapeHtml(item.entranceScore || 'Awaited / N/A')}</b></div>
            <div class="slip-field" style="grid-column:1/-1">
              <small>NAME OF DEGREE</small>
              <b>a) ${escapeHtml(item.degreeA || '-')}</b>
              ${item.degreeB ? `<br><b>b) ${escapeHtml(item.degreeB)}</b>` : ''}
              ${item.degreeC ? `<br><b>c) ${escapeHtml(item.degreeC)}</b>` : ''}
            </div>
          </div>

          <h3 style="font-size:15px;color:var(--navy);margin:16px 0 8px;border-bottom:1.5px solid var(--bd);padding-bottom:6px">
            B COURSE DETAILS
          </h3>
          <div class="slip-grid">
            <div class="slip-field"><small>Country</small><b>${escapeHtml(item.country === 'Others' ? item.otherCountry : item.country)}</b></div>
            <div class="slip-field"><small>1. Admission Status</small><b>${item.admissionStatus === 'Confirmed' ? '☑ Confirmed' : '☐ Awaited'}</b></div>
            <div class="slip-field"><small>2. Course Duration</small><b>${escapeHtml(item.courseDuration || '-')}</b></div>
            <div class="slip-field"><small>3. University/College</small><b>${escapeHtml(item.university)}</b></div>
            <div class="slip-field" style="grid-column:1/-1"><small>Name of the Course</small><b style="color:var(--blue);font-size:15px">${escapeHtml(item.courseName)}</b></div>
          </div>

          <div style="margin-top:24px;padding-top:16px;border-top:1px dashed var(--bd);display:flex;justify-content:space-between;color:var(--tx2);font-size:12px">
            <span>Generated via Capital Grow CRM</span>
            <span>Applicant / Counselor Sign: ___________________</span>
          </div>
        </div>
      </div>
    `;
  }

  function bindEvents() {
    // Tab switching
    document.querySelectorAll('[data-edu-tab]').forEach(btn => {
      btn.onclick = () => {
        activeTab = btn.dataset.eduTab;
        const v = document.getElementById('view');
        if (v) {
          v.innerHTML = renderView();
          bindEvents();
        }
      };
    });

    const newFromListBtn = document.getElementById('eduNewFromListBtn');
    if (newFromListBtn) {
      newFromListBtn.onclick = () => {
        activeTab = 'form';
        const v = document.getElementById('view');
        if (v) {
          v.innerHTML = renderView();
          bindEvents();
        }
      };
    }

    const emptyNewBtn = document.getElementById('eduEmptyNewBtn');
    if (emptyNewBtn) {
      emptyNewBtn.onclick = () => {
        activeTab = 'form';
        const v = document.getElementById('view');
        if (v) {
          v.innerHTML = renderView();
          bindEvents();
        }
      };
    }

    // Search and filters for enquiry list
    const searchInp = document.getElementById('eduListSearch');
    if (searchInp) {
      searchInp.oninput = e => {
        listSearch = e.target.value;
        const v = document.getElementById('view');
        v.innerHTML = renderView();
        bindEvents();
        const ref = document.getElementById('eduListSearch');
        if (ref) {
          ref.focus();
          ref.setSelectionRange(ref.value.length, ref.value.length);
        }
      };
    }

    const countryFilter = document.getElementById('eduListCountryFilter');
    if (countryFilter) {
      countryFilter.onchange = e => {
        listCountry = e.target.value;
        const v = document.getElementById('view');
        v.innerHTML = renderView();
        bindEvents();
      };
    }

    const statusFilter = document.getElementById('eduListStatusFilter');
    if (statusFilter) {
      statusFilter.onchange = e => {
        listStatus = e.target.value;
        const v = document.getElementById('view');
        v.innerHTML = renderView();
        bindEvents();
      };
    }

    // View slip button
    document.querySelectorAll('[data-view-edu]').forEach(btn => {
      btn.onclick = () => {
        route(['education-loan', 'view', btn.dataset.viewEdu]);
      };
    });

    // Delete enquiry button
    document.querySelectorAll('[data-del-edu]').forEach(btn => {
      btn.onclick = async () => {
        const id = btn.dataset.delEdu;
        if (await confirmBox('Delete Education Loan Enquiry?', `Permanently remove record ${id}?`)) {
          const updated = getList().filter(x => x.id !== id);
          saveList(updated);
          toast('Enquiry deleted');
          const v = document.getElementById('view');
          if (v) {
            v.innerHTML = renderView();
            bindEvents();
          }
        }
      };
    });

    // Form specific events
    const form = document.getElementById('eduLoanForm');
    if (!form) return;

    // Quick Loan Amount Chips
    document.querySelectorAll('.quick-chip').forEach(chip => {
      chip.onclick = () => {
        const amt = chip.dataset.amt;
        const inp = document.getElementById('loanAmount');
        if (inp) {
          inp.value = amt;
          inp.dispatchEvent(new Event('input'));
        }
      };
    });

    // Radio choice change handlers
    form.querySelectorAll('input[type="radio"]').forEach(radio => {
      radio.addEventListener('change', () => {
        form.querySelectorAll(`input[type="radio"][name="${radio.name}"]`).forEach(r => {
          r.closest('.choice-card')?.classList.toggle('checked', r.checked);
        });

        if (radio.name === 'residenceType') {
          const rentWrap = document.getElementById('rentAmountWrap');
          if (rentWrap) {
            rentWrap.style.display = radio.value === 'Rented' ? 'block' : 'none';
          }
        }

        if (radio.name === 'country') {
          const otherWrap = document.getElementById('otherCountryWrap');
          if (otherWrap) {
            otherWrap.style.display = radio.value === 'Others' ? 'block' : 'none';
          }
        }
      });
    });

    // Same as Current Address Sync
    const sameCheck = document.getElementById('sameAddressCheck');
    const curAddr = document.getElementById('currentAddress');
    const curPin = document.getElementById('currentPincode');
    const permAddr = document.getElementById('permAddress');
    const permPin = document.getElementById('permPincode');

    if (sameCheck && curAddr && permAddr) {
      sameCheck.onchange = () => {
        if (sameCheck.checked) {
          permAddr.value = curAddr.value;
          permPin.value = curPin.value;
          permAddr.setAttribute('readonly', 'true');
          permPin.setAttribute('readonly', 'true');
          permAddr.style.backgroundColor = '#F8FAFC';
          permPin.style.backgroundColor = '#F8FAFC';
        } else {
          permAddr.removeAttribute('readonly');
          permPin.removeAttribute('readonly');
          permAddr.style.backgroundColor = '';
          permPin.style.backgroundColor = '';
        }
      };

      curAddr.addEventListener('input', () => {
        if (sameCheck.checked) permAddr.value = curAddr.value;
      });
      curPin.addEventListener('input', () => {
        if (sameCheck.checked) permPin.value = curPin.value;
      });
    }

    // Add row to education table
    const addEduRowBtn = document.getElementById('addEduRowBtn');
    const eduTbody = document.getElementById('eduTbody');
    if (addEduRowBtn && eduTbody) {
      addEduRowBtn.onclick = () => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><input type="text" class="edu-exam" placeholder="Exam / Course"></td>
          <td><input type="text" class="edu-year" placeholder="Year"></td>
          <td><input type="text" class="edu-marks" placeholder="Marks %"></td>
          <td><input type="text" class="edu-school" placeholder="School/College/University"></td>
          <td><button type="button" class="tbl-row-del" title="Remove row">×</button></td>
        `;
        tr.querySelector('.tbl-row-del').onclick = () => tr.remove();
        eduTbody.appendChild(tr);
      };
    }

    // Reset Form
    const resetBtn = document.getElementById('resetEduBtn');
    if (resetBtn) {
      resetBtn.onclick = async () => {
        if (await confirmBox('Reset Form?', 'All unsaved form fields will be cleared.')) {
          form.reset();
          activeTab = 'form';
          route(['education-loan']);
        }
      };
    }

    // Form Submission
    form.onsubmit = e => {
      e.preventDefault();
      handleSubmit(form);
    };
  }

  function handleSubmit(form) {
    const formData = new FormData(form);
    const errors = {};

    const studentName = formData.get('studentName')?.trim();
    const fatherName = formData.get('fatherName')?.trim();
    const mobile = formData.get('mobile')?.trim();
    const email = formData.get('email')?.trim();
    const loanAmount = formData.get('loanAmount')?.trim();
    const university = formData.get('university')?.trim();
    const courseName = formData.get('courseName')?.trim();
    const country = formData.get('country');
    const otherCountry = formData.get('otherCountry')?.trim();
    const currentPincode = formData.get('currentPincode')?.trim();

    if (!studentName) errors.studentName = 'Please enter the student full name.';
    if (!fatherName) errors.fatherName = "Please enter father's name.";
    if (!mobile || !/^[6-9]\d{9}$/.test(mobile)) errors.mobile = 'Enter a valid 10-digit mobile number.';
    if (email && !/^\S+@\S+\.\S+$/.test(email)) errors.email = 'Enter a valid email address.';
    if (!loanAmount) errors.loanAmount = 'Please enter required loan amount.';
    if (!university) errors.university = 'Please enter university/college.';
    if (!courseName) errors.courseName = 'Please enter name of the course.';
    if (country === 'Others' && !otherCountry) errors.country = 'Please specify country name.';
    if (currentPincode && !/^\d{6}$/.test(currentPincode)) errors.currentPincode = 'Pincode must be 6 digits.';

    // Display error messages
    form.querySelectorAll('[data-err]').forEach(el => {
      el.textContent = errors[el.dataset.err] || '';
      el.style.color = '#d12d33';
      el.style.fontSize = '12px';
      el.style.fontWeight = '600';
      el.style.marginTop = '4px';
      el.style.display = errors[el.dataset.err] ? 'block' : 'none';
    });

    if (Object.keys(errors).length > 0) {
      toast('Please complete all highlighted mandatory fields.', 'err');
      const firstErr = form.querySelector('[data-err]:not(:empty)');
      if (firstErr) {
        firstErr.parentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Collect Education Rows
    const education = [];
    form.querySelectorAll('#eduTbody tr').forEach(tr => {
      const exam = tr.querySelector('.edu-exam')?.value?.trim();
      const year = tr.querySelector('.edu-year')?.value?.trim();
      const marks = tr.querySelector('.edu-marks')?.value?.trim();
      const school = tr.querySelector('.edu-school')?.value?.trim();
      if (exam || school || marks) {
        education.push({ exam, year, marks, school });
      }
    });

    const newEnquiryId = nextEnquiryId();
    const newRecord = {
      id: newEnquiryId,
      date: formData.get('enquiryDate') || new Date().toISOString().slice(0, 10),
      consultancyName: formData.get('consultancyName') || 'Direct Walk-in',
      loanAmount: loanAmount.startsWith('₹') ? loanAmount : '₹ ' + loanAmount,
      studentName,
      fatherName,
      motherName: formData.get('motherName') || '',
      dob: formData.get('dob') || '',
      gender: formData.get('gender') || 'Male',
      currentAddress: formData.get('currentAddress') || '',
      currentPincode,
      permAddress: formData.get('permAddress') || '',
      permPincode: formData.get('permPincode') || '',
      residenceType: formData.get('residenceType') || 'Self Owned',
      monthlyRent: formData.get('monthlyRent') || '',
      maritalStatus: formData.get('maritalStatus') || 'Single',
      mobile,
      email,
      education,
      entranceTest: formData.get('entranceTest') || 'None',
      entranceScore: formData.get('entranceScore') || '',
      degreeA: formData.get('degreeA') || '',
      degreeB: formData.get('degreeB') || '',
      degreeC: formData.get('degreeC') || '',
      admissionStatus: formData.get('admissionStatus') || 'Confirmed',
      courseDuration: formData.get('courseDuration') || '2 Years',
      university,
      courseName,
      country: country || 'USA',
      otherCountry: otherCountry || '',
      crmStatus: 'Under Process'
    };

    // Save into Education Loans store
    const list = getList();
    list.unshift(newRecord);
    saveList(list);

    // Sync into Customers Store so CRM Dashboard & Customers module show this enquiry!
    const customers = DB.get('customers', []);
    const existingCustIdx = customers.findIndex(c => c.mobile === mobile);
    const targetCountry = country === 'Others' ? otherCountry : country;

    const customerRecord = {
      id: `CG-${new Date().getFullYear()}-${String(customers.length + 1249).padStart(5, '0')}`,
      name: studentName,
      mobile: mobile,
      email: email,
      type: 'Education Loan',
      status: 'Under Process',
      followup: '15 Nov 2026',
      emp: 'Meena R',
      country: targetCountry,
      univ: university,
      course: courseName,
      adm: newRecord.admissionStatus === 'Confirmed' ? 'Offer Received' : 'Applied',
      gender: newRecord.gender,
      pin: currentPincode,
      address: newRecord.currentAddress,
      highest: newRecord.degreeA || (education.length ? education[education.length - 1].exam : ''),
      refName: newRecord.consultancyName,
      src: newRecord.consultancyName.includes('Direct') ? 'Walk-in' : 'Referral',
      created: newRecord.date,
      remarks: `Education Loan enquiry for ${courseName} at ${university} (${targetCountry}). Loan amount requested: ${newRecord.loanAmount}. Father: ${fatherName}.`
    };

    if (existingCustIdx >= 0) {
      customers[existingCustIdx] = { ...customers[existingCustIdx], ...customerRecord, id: customers[existingCustIdx].id };
    } else {
      customers.unshift(customerRecord);
    }
    DB.set('customers', customers);

    toast(`Education Loan Enquiry Submitted! ID: ${newEnquiryId}`, 'ok');

    // Route to View Slip
    activeTab = 'list';
    location.hash = `education-loan/view/${newEnquiryId}`;
  }

  function route(parts) {
    const v = document.getElementById('view');
    if (!v) return;

    if (parts[1] === 'view' && parts[2]) {
      v.innerHTML = renderSlipModal(parts[2]);
    } else {
      if (!parts[1]) activeTab = 'form';
      v.innerHTML = renderView();
      bindEvents();
    }
  }

  return {
    route,
    renderView
  };
})();
