/**
 * MGM University – Institute of Information and Communication Technology (IICT)
 * Verified Information Seed Dataset — v2
 *
 * Each entry includes:
 *   - programs[]: specific programs this applies to (empty = all programs / institution-wide)
 *   - department: owning department
 *   - academicYear: the year this data is valid for
 *   - authorityLevel: source trust (0-100)
 *
 * IMPORTANT: Do NOT change fee amounts, faculty names, or eligibility criteria
 * without updating the corresponding verified source document.
 */

const verifiedKnowledgeBase = [

  // ────────────────────────────────────────────────────────────────
  // INSTITUTION-LEVEL INFORMATION
  // ────────────────────────────────────────────────────────────────

  {
    title: "MGMU IICT Overview & General Information",
    category: "GENERAL",
    programs: [],
    department: "All",
    academicYear: "2026-27",
    authorityLevel: 65,
    content: "MGM University's Institute of Information and Communication Technology (IICT) is a premier engineering and technology institute located in Chhatrapati Sambhajinagar (formerly Aurangabad), Maharashtra. IICT offers state-of-the-art undergraduate (B.Tech, BCA), postgraduate (M.Tech, MCA), and doctoral (Ph.D.) programs focused on Computer Science, IT, Artificial Intelligence, and Software Engineering. It emphasizes industry-aligned curriculum, research, modern labs, and placement support.",
    source: "MGMU IICT Official Brochure",
    sourceUrl: "https://mgmu.ac.in/iict",
    verified: true,
    lastUpdated: "2026-10-01",
    tags: ["overview", "about", "location", "university", "mgmu", "iict", "address", "general"]
  },

  {
    title: "MGMU IICT Location and Contact Details",
    category: "CONTACT",
    programs: [],
    department: "Administration",
    academicYear: "2026-27",
    authorityLevel: 70,
    content: "Address: MGM Campus, N-6, CIDCO, Chhatrapati Sambhajinagar (Aurangabad) – 431003, Maharashtra, India.\nContact Phone: +91-240-2480490 / +91-9422704944\nEmail: iict@mgmu.ac.in / admissions@mgmu.ac.in\nOfficial Website: https://mgmu.ac.in/iict\nWorking Hours: Monday to Saturday, 9:30 AM to 5:30 PM.",
    source: "MGMU IICT Contact Directory",
    sourceUrl: "https://mgmu.ac.in/contact",
    verified: true,
    lastUpdated: "2026-10-01",
    tags: ["contact", "phone", "email", "address", "location", "map", "office", "working hours", "number"]
  },

  {
    title: "Programs Offered at MGMU IICT",
    category: "COURSES",
    programs: [],
    department: "All",
    academicYear: "2026-27",
    authorityLevel: 72,
    content: "MGMU IICT offers the following academic degree programs:\n1. B.Tech Computer Science & Engineering (CSE) — 4 Years, Intake: 120\n2. B.Tech Information Technology (IT) — 4 Years, Intake: 60\n3. B.Tech Artificial Intelligence & Data Science (AI & DS) — 4 Years, Intake: 60\n4. B.Tech Software Engineering — 4 Years, Intake: 60\n5. Bachelor of Computer Applications (BCA) — 3 Years, Intake: 60\n6. Master of Computer Applications (MCA) — 2 Years, Intake: 60\n7. M.Tech Computer Science & Engineering — 2 Years, Intake: 18\n8. Ph.D. in Computer Science and Engineering / IT",
    source: "MGMU IICT Academic Handbook 2026",
    sourceUrl: "https://mgmu.ac.in/iict/courses",
    verified: true,
    lastUpdated: "2026-10-01",
    tags: ["courses", "programs", "btech", "mca", "bca", "mtech", "phd", "degrees", "offered", "available", "list"]
  },

  // ────────────────────────────────────────────────────────────────
  // FEE STRUCTURE (authoritative — Finance Committee source)
  // ────────────────────────────────────────────────────────────────

  {
    title: "Fee Structure — Academic Year 2026-27 (All Programs)",
    category: "FEES",
    programs: ["B.Tech CSE", "B.Tech IT", "B.Tech AI & DS", "B.Tech Software Engg", "BCA", "MCA", "M.Tech CSE"],
    department: "All",
    academicYear: "2026-27",
    authorityLevel: 100,
    content: "Annual Tuition Fee Structure at MGMU IICT (Academic Year 2026-27):\n• B.Tech Computer Science & Engineering (CSE): ₹1,40,000 per year\n• B.Tech Information Technology (IT): ₹1,35,000 per year\n• B.Tech Artificial Intelligence & Data Science (AI & DS): ₹1,45,000 per year\n• B.Tech Software Engineering: ₹1,40,000 per year\n• Bachelor of Computer Applications (BCA): ₹65,000 per year\n• Master of Computer Applications (MCA): ₹95,000 per year\n• M.Tech Computer Science & Engineering: ₹85,000 per year\n\nAdditional charges (all programs):\n• Security deposit: ₹5,000 (fully refundable at the end of the program)\n• Examination fee: ₹2,500 per semester\n\nInstallment facility is available for the annual tuition fee upon approval by the Finance Office. Contact admissions@mgmu.ac.in for the installment schedule.",
    source: "MGMU Finance & Fee Regulation Committee",
    sourceUrl: "https://mgmu.ac.in/iict/fee-structure",
    verified: true,
    lastUpdated: "2026-09-30",
    tags: ["fee", "fees", "tuition", "cost", "annual fee", "fee structure", "installment", "btech fee", "mca fee", "bca fee", "mtech fee", "2026-27"]
  },

  // ────────────────────────────────────────────────────────────────
  // PROGRAM DETAILS: B.Tech CSE
  // ────────────────────────────────────────────────────────────────

  {
    title: "B.Tech Computer Science & Engineering (CSE) — Program Details",
    category: "COURSES",
    programs: ["B.Tech CSE"],
    department: "Computer Science & Engineering",
    academicYear: "2026-27",
    authorityLevel: 88,
    content: "Program: B.Tech Computer Science & Engineering (CSE)\nDuration: 4 Years (8 Semesters)\nAnnual Intake: 120 students\nAnnual Tuition Fee: ₹1,40,000 per year\n\nEligibility:\n• Passed 10+2 (HSC) with Physics, Mathematics, and Chemistry/Computer Science\n• Minimum aggregate: 45% (General category) / 40% (Reserved category under Maharashtra reservation)\n• Valid score in MHT-CET or JEE Main is required\n\nCurriculum Highlights:\nData Structures & Algorithms, Database Management Systems, Operating Systems, Computer Networks, Computer Architecture, Discrete Mathematics, Web Development, Cloud Computing, Cyber Security, Artificial Intelligence, Machine Learning, Software Engineering, and final-year project.\n\nProgram Outcome: Graduates are eligible for software engineering, data science, cloud architecture, and other technology roles.",
    source: "MGMU IICT Admission Brochure",
    sourceUrl: "https://mgmu.ac.in/iict/btech-cse",
    verified: true,
    lastUpdated: "2026-09-15",
    tags: ["btech", "cse", "computer science", "eligibility", "fee", "intake", "syllabus", "curriculum", "b.tech cse", "btech-cse"]
  },

  // ────────────────────────────────────────────────────────────────
  // PROGRAM DETAILS: B.Tech IT
  // ────────────────────────────────────────────────────────────────

  {
    title: "B.Tech Information Technology (IT) — Program Details",
    category: "COURSES",
    programs: ["B.Tech IT"],
    department: "Information Technology",
    academicYear: "2026-27",
    authorityLevel: 88,
    content: "Program: B.Tech Information Technology (IT)\nDuration: 4 Years (8 Semesters)\nAnnual Intake: 60 students\nAnnual Tuition Fee: ₹1,35,000 per year\n\nEligibility:\n• Passed 10+2 (HSC) with Physics, Mathematics, and Chemistry/Computer Science\n• Minimum aggregate: 45% (General category) / 40% (Reserved category)\n• Valid MHT-CET or JEE Main score required\n\nCurriculum Highlights:\nInformation Systems, Software Development, Networking & Security, Cloud Services, Mobile App Development, Full-Stack Engineering, Enterprise IT Management.\n\nProgram Outcome: Graduates work in network administration, software development, IT consulting, and enterprise technology roles.",
    source: "MGMU IICT Course Catalogue",
    sourceUrl: "https://mgmu.ac.in/iict/btech-it",
    verified: true,
    lastUpdated: "2026-09-15",
    tags: ["btech", "it", "information technology", "eligibility", "fee", "intake", "b.tech it", "btech-it"]
  },

  // ────────────────────────────────────────────────────────────────
  // PROGRAM DETAILS: B.Tech AI & DS
  // ────────────────────────────────────────────────────────────────

  {
    title: "B.Tech Artificial Intelligence & Data Science (AI & DS) — Program Details",
    category: "COURSES",
    programs: ["B.Tech AI & DS"],
    department: "AI & Data Science",
    academicYear: "2026-27",
    authorityLevel: 88,
    content: "Program: B.Tech Artificial Intelligence & Data Science (AI & DS)\nDuration: 4 Years (8 Semesters)\nAnnual Intake: 60 students\nAnnual Tuition Fee: ₹1,45,000 per year\n\nEligibility:\n• Passed 10+2 (HSC) with Physics, Mathematics, and Chemistry\n• Minimum aggregate: 45% (General category) / 40% (Reserved category)\n• Valid MHT-CET or JEE Main score required\n\nCurriculum Highlights:\nMachine Learning, Deep Learning, Neural Networks, Natural Language Processing (NLP), Computer Vision, Big Data Analytics, Data Warehousing, Cloud AI, Python for Data Science, and capstone projects.\n\nProgram Outcome: Graduates pursue roles in AI research, ML engineering, data science, analytics, and AI product development.",
    source: "MGMU IICT Course Catalogue",
    sourceUrl: "https://mgmu.ac.in/iict/btech-aids",
    verified: true,
    lastUpdated: "2026-09-15",
    tags: ["btech", "ai", "data science", "artificial intelligence", "aids", "machine learning", "fee", "intake", "eligibility", "b.tech ai"]
  },

  // ────────────────────────────────────────────────────────────────
  // PROGRAM DETAILS: MCA
  // ────────────────────────────────────────────────────────────────

  {
    title: "Master of Computer Applications (MCA) — Program Details",
    category: "COURSES",
    programs: ["MCA"],
    department: "Computer Applications",
    academicYear: "2026-27",
    authorityLevel: 87,
    content: "Program: Master of Computer Applications (MCA)\nDuration: 2 Years (4 Semesters)\nAnnual Intake: 60 students\nAnnual Tuition Fee: ₹95,000 per year\n\nEligibility:\n• Passed BCA, B.Sc in Computer Science / IT, or equivalent undergraduate degree\n• Minimum aggregate: 50% (General category) / 45% (Reserved category)\n• Valid MAH-MCA-CET or MGMU Entrance Test score required\n\nCurriculum Highlights:\nAdvanced Software Engineering, Cloud Architecture, Mobile Application Development, Enterprise Database Management, Web Services, Data Structures, Operating Systems, and industry project.\n\nProgram Outcome: MCA graduates are sought for software development, cloud engineering, application architecture, and IT project management roles.",
    source: "MGMU IICT PG Prospectus",
    sourceUrl: "https://mgmu.ac.in/iict/mca",
    verified: true,
    lastUpdated: "2026-09-20",
    tags: ["mca", "master of computer applications", "postgraduate", "eligibility", "fees", "intake", "mah-mca-cet", "mca fee"]
  },

  // ────────────────────────────────────────────────────────────────
  // PROGRAM DETAILS: BCA
  // ────────────────────────────────────────────────────────────────

  {
    title: "Bachelor of Computer Applications (BCA) — Program Details",
    category: "COURSES",
    programs: ["BCA"],
    department: "Computer Applications",
    academicYear: "2026-27",
    authorityLevel: 87,
    content: "Program: Bachelor of Computer Applications (BCA)\nDuration: 3 Years (6 Semesters)\nAnnual Intake: 60 students\nAnnual Tuition Fee: ₹65,000 per year\n\nEligibility:\n• Passed 10+2 (HSC) in any stream — Science, Commerce, or Arts\n• Minimum aggregate: 45% (General category) / 40% (Reserved category)\n• No entrance exam required (direct merit-based admission)\n\nCurriculum Highlights:\nC, C++, Java, Python, Web Technologies (HTML/CSS/JS), Database Systems (MySQL), Application Development, Software Testing, and final-year project.\n\nProgram Outcome: BCA graduates can pursue careers in web development, application support, IT operations, or continue to MCA.",
    source: "MGMU IICT UG Prospectus",
    sourceUrl: "https://mgmu.ac.in/iict/bca",
    verified: true,
    lastUpdated: "2026-09-20",
    tags: ["bca", "bachelor of computer applications", "undergraduate", "eligibility", "fees", "intake", "bca fee"]
  },

  // ────────────────────────────────────────────────────────────────
  // PROGRAM DETAILS: M.Tech CSE
  // ────────────────────────────────────────────────────────────────

  {
    title: "M.Tech Computer Science & Engineering — Program Details",
    category: "COURSES",
    programs: ["M.Tech CSE"],
    department: "Computer Science & Engineering",
    academicYear: "2026-27",
    authorityLevel: 87,
    content: "Program: M.Tech Computer Science & Engineering\nDuration: 2 Years (4 Semesters)\nAnnual Intake: 18 students\nAnnual Tuition Fee: ₹85,000 per year\n\nEligibility:\n• Passed B.Tech/B.E. in Computer Science, IT, or equivalent engineering degree\n• Minimum aggregate: 55% (General category) / 50% (Reserved category)\n• Valid GATE score preferred; MGMU Entrance Test also accepted\n\nCurriculum Highlights:\nAdvanced Algorithms, Research Methodology, Machine Learning, Distributed Systems, High Performance Computing, and thesis research.\n\nProgram Outcome: M.Tech graduates pursue research, academic positions, or senior engineering roles.",
    source: "MGMU IICT Academic Handbook 2026",
    sourceUrl: "https://mgmu.ac.in/iict/mtech",
    verified: true,
    lastUpdated: "2026-09-15",
    tags: ["mtech", "m.tech", "postgraduate engineering", "eligibility", "fee", "intake", "gate", "mtech cse"]
  },

  // ────────────────────────────────────────────────────────────────
  // ADMISSION PROCESS
  // ────────────────────────────────────────────────────────────────

  {
    title: "Admission Process & How to Apply — MGMU IICT 2026-27",
    category: "ADMISSION",
    programs: [],
    department: "All",
    academicYear: "2026-27",
    authorityLevel: 95,
    content: "Admission Process for MGMU IICT (Academic Year 2026-27):\n\nStep 1 — Online Application:\nRegister on the official MGM University admissions portal at https://mgmu.ac.in/admissions and fill the online application form.\n\nStep 2 — Entrance Exam Score Submission:\nSubmit valid scores from MHT-CET, JEE Main (for B.Tech programs), MAH-MCA-CET or MGMU Entrance Test (for MCA), or GATE / MGMU test (for M.Tech).\n\nStep 3 — Merit List & Counseling:\nMerit lists are prepared based on entrance exam scores and qualifying exam marks. Shortlisted candidates are called for document verification and counseling rounds.\n\nStep 4 — Document Verification:\nOriginal certificates are verified at the MGMU IICT Admission Office during the counseling session.\n\nStep 5 — Seat Allotment & Fee Payment:\nPay the tuition fee (or first installment) online or via Demand Draft to confirm your allotted seat.\n\nFor admission queries, contact admissions@mgmu.ac.in or call +91-240-2480490.",
    source: "MGMU Admission Cell 2026-27",
    sourceUrl: "https://mgmu.ac.in/admissions",
    verified: true,
    lastUpdated: "2026-10-02",
    tags: ["admission", "process", "apply", "steps", "counseling", "merit list", "portal", "registration", "how to apply", "entrance exam", "admission process"]
  },

  // ────────────────────────────────────────────────────────────────
  // DOCUMENTS REQUIRED
  // ────────────────────────────────────────────────────────────────

  {
    title: "Documents Required for MGMU IICT Admission",
    category: "DOCUMENTS",
    programs: [],
    department: "All",
    academicYear: "2026-27",
    authorityLevel: 90,
    content: "Mandatory documents required during MGMU IICT admission document verification:\n1. 10th (SSC) Marksheet & Passing Certificate\n2. 12th (HSC) Marksheet & Passing Certificate (or Diploma Marksheet for lateral entry)\n3. MHT-CET / JEE Main / MAH-MCA-CET / GATE Scorecard (as applicable)\n4. School/College Leaving Certificate (LC / Transfer Certificate)\n5. Domicile Certificate & Nationality Certificate (Maharashtra domicile required for state quota seats)\n6. Caste Certificate, Caste Validity Certificate & Non-Creamy Layer Certificate (for OBC/VJNT/SBC/SC/ST applicants)\n7. Income Certificate issued by competent authority (required for scholarship applicants)\n8. Aadhaar Card (mandatory)\n9. Passport-sized photographs — 4 copies\n10. Migration Certificate (required for candidates from non-Maharashtra state boards)\n\nNote: Bring both originals and self-attested photocopies of all documents.",
    source: "MGMU IICT Admission Office Checklist",
    sourceUrl: "https://mgmu.ac.in/admissions/documents",
    verified: true,
    lastUpdated: "2026-09-25",
    tags: ["documents", "checklist", "certificates", "marksheet", "caste", "domicile", "required documents", "admission documents", "papers needed", "what documents"]
  },

  // ────────────────────────────────────────────────────────────────
  // FACULTY & ACADEMIC LEADERSHIP
  // ────────────────────────────────────────────────────────────────

  {
    title: "Faculty & HOD Details — MGMU IICT",
    category: "FACULTY",
    programs: [],
    department: "All",
    academicYear: "2026-27",
    authorityLevel: 85,
    content: "Key Academic Leadership & Faculty at MGMU IICT:\n\n• Dr. Sharad G. Bhartiya\n  Designation: Director / Dean, IICT\n  Qualification: Ph.D. in Computer Engineering\n  Experience: 25+ years\n  Expertise: High Performance Computing, Educational Leadership\n  Email: director.iict@mgmu.ac.in\n\n• Dr. Vijaya B. Musande\n  Designation: Professor & Head of Department (HOD) — Computer Science & Engineering (CSE)\n  Qualification: Ph.D. in Computer Science\n  Experience: 20+ years\n  Expertise: Machine Learning, Image Processing, Pattern Recognition\n  Email: hod.cse@mgmu.ac.in\n\n• Prof. Swapnil A. Gaikwad\n  Designation: Assistant Professor & HOD — Information Technology (IT)\n  Qualification: M.Tech in Information Technology\n  Experience: 12 years\n  Expertise: Java Programming, Full-Stack Web Development, Cloud Infrastructure\n  Email: sgaikwad@mgmu.ac.in\n\n• Dr. Abhay E. Wagh\n  Designation: Professor — AI & Data Science\n  Qualification: Ph.D. in AI & Robotics\n  Experience: 18 years\n  Expertise: Deep Learning, Natural Language Processing, Robotics\n  Email: awagh@mgmu.ac.in\n\n• Dr. Pallavi M. Deshmukh\n  Designation: Associate Professor — MCA Program\n  Qualification: Ph.D. in Computer Science\n  Experience: 15 years\n  Expertise: Database Management Systems, Software Engineering\n  Email: pdeshmukh@mgmu.ac.in\n\n• Prof. Rahul S. Kulkarni\n  Designation: Assistant Professor & Training & Placement Officer (TPO)\n  Qualification: M.Tech in CSE\n  Experience: 10 years\n  Expertise: Data Structures, System Design, Corporate Relations\n  Email: tpo.iict@mgmu.ac.in",
    source: "MGMU IICT Faculty Directory",
    sourceUrl: "https://mgmu.ac.in/iict/faculty",
    verified: true,
    lastUpdated: "2026-10-01",
    tags: ["faculty", "hod", "head of department", "dean", "director", "teachers", "professors", "staff", "who teaches", "dr.", "cse faculty", "it faculty", "mca faculty"]
  },

  // ────────────────────────────────────────────────────────────────
  // SCHOLARSHIPS
  // ────────────────────────────────────────────────────────────────

  {
    title: "Scholarships & Financial Aid — MGMU IICT",
    category: "SCHOLARSHIP",
    programs: [],
    department: "All",
    academicYear: "2026-27",
    authorityLevel: 80,
    content: "Available Scholarships & Financial Aid at MGMU IICT:\n\n1. Rajarshi Chhatrapati Shahu Maharaj Shikshan Shulkh Shishavrutti Yojna (EBC Scholarship)\n   • Eligibility: Maharashtra domicile students with annual family income up to ₹8,00,000\n   • Benefit: 50% tuition fee waiver per year\n   • How to apply: Apply through the Maharashtra government portal (mahadbt.maharashtra.gov.in)\n\n2. Government Post-Matric Scholarship (MahaDBT)\n   • Eligibility: SC, ST, VJNT, SBC, and OBC category students registered on the MahaDBT portal\n   • Benefit: Full or partial fee reimbursement based on category and income\n   • How to apply: Register and apply on mahadbt.maharashtra.gov.in\n\n3. MGMU Merit Scholarship\n   • Eligibility: Top rankers in MGMU CET or MHT-CET at time of admission\n   • Benefit: Up to 25% tuition fee concession per academic year\n   • Conditions: Minimum required academic performance must be maintained each year\n\n4. Sports & Defence Concession\n   • Eligibility: National-level sports achievers and wards of defence personnel\n   • Benefit: Special financial assistance (amount determined case-by-case by the scholarship committee)\n\nFor scholarship queries, contact the MGMU Student Welfare Cell at welfare@mgmu.ac.in.",
    source: "MGMU Student Welfare Cell",
    sourceUrl: "https://mgmu.ac.in/scholarships",
    verified: true,
    lastUpdated: "2026-09-20",
    tags: ["scholarship", "scholarships", "ebc", "mahadbt", "merit scholarship", "financial aid", "concession", "fee waiver", "government scholarship", "obc", "sc", "st"]
  },

  // ────────────────────────────────────────────────────────────────
  // CAMPUS FACILITIES & HOSTEL
  // ────────────────────────────────────────────────────────────────

  {
    title: "Campus Facilities — MGMU IICT",
    category: "FACILITIES",
    programs: [],
    department: "All",
    academicYear: "2026-27",
    authorityLevel: 75,
    content: "MGMU IICT Campus Facilities:\n\n• Central Library: Over 45,000 technical books, e-journals (IEEE, Springer, ACM Digital Library), and digital reading rooms.\n\n• Computer Laboratories: Modern labs equipped with high-performance Intel Core i7/i9 computers, high-speed fiber internet, and specialized AI/NVIDIA GPU workstations.\n\n• Sports & Fitness: Gymnasium, Olympic-standard swimming pool, cricket ground, football turf, badminton courts, and basketball courts.\n\n• Transport: Fleet of university buses operating across major city routes in Chhatrapati Sambhajinagar.\n\n• Wi-Fi: High-speed campus-wide Wi-Fi connectivity.\n\n• Cafeteria/Canteen: On-campus cafeteria serving hygienic food and snacks.\n\n• Medical Facility: On-campus health center with qualified medical staff.",
    source: "MGM Campus Facilities Handbook",
    sourceUrl: "https://mgmu.ac.in/facilities",
    verified: true,
    lastUpdated: "2026-09-10",
    tags: ["facilities", "campus", "library", "labs", "sports", "transport", "bus", "gym", "wifi", "canteen", "infrastructure", "computer lab"]
  },

  {
    title: "Hostel & Accommodation — MGMU IICT",
    category: "HOSTEL",
    programs: [],
    department: "All",
    academicYear: "2026-27",
    authorityLevel: 75,
    content: "MGMU IICT Hostel Facilities:\n\n• Separate hostels for Boys and Girls\n• 24/7 security and biometric entry systems\n• Wi-Fi in all rooms and common areas\n• Study rooms and reading halls available\n• Hygienic mess facility with vegetarian and non-vegetarian options\n• Approximate Hostel Fee: ₹65,000 per year (inclusive of mess/food charges)\n  — Note: This is an approximate figure. Exact hostel fee may vary by room type and is confirmed at the time of allotment by the hostel administration office.\n\nFor hostel admission and fee details, contact the MGMU Hostel Administration: hostel@mgmu.ac.in",
    source: "MGM Campus Facilities Handbook",
    sourceUrl: "https://mgmu.ac.in/facilities/hostel",
    verified: true,
    lastUpdated: "2026-09-10",
    tags: ["hostel", "accommodation", "mess", "stay", "residence", "room", "hostel fee", "boys hostel", "girls hostel", "dormitory"]
  },

  // ────────────────────────────────────────────────────────────────
  // PLACEMENTS
  // ────────────────────────────────────────────────────────────────

  {
    title: "Placements & Career Support — MGMU IICT",
    category: "PLACEMENT",
    programs: [],
    department: "All",
    academicYear: "2026-27",
    authorityLevel: 80,
    content: "MGMU IICT Training & Placement Cell (TPO):\n\nKey Recruiting Companies (recent years): TCS, Infosys, Wipro, Capgemini, Persistent Systems, Cognizant, Tech Mahindra, L&T Infotech, Hexaware, and others.\n\nPlacement Statistics (as reported by the MGMU IICT TPO for recent batches):\n• Average Salary Package: ₹4.5 LPA to ₹6.5 LPA\n• Highest Package (reported): Up to ₹12.0 LPA\n\nPre-Placement Training:\nThe TPO conducts pre-placement training from the 6th semester onward, covering:\n• Aptitude & Reasoning\n• Data Structures & Algorithms\n• System Design\n• Mock Technical Interviews\n• Mock HR Interviews\n\nFor internship and placement opportunities, contact the TPO at tpo.iict@mgmu.ac.in.",
    source: "MGMU IICT TPO Report 2026",
    sourceUrl: "https://mgmu.ac.in/iict/placements",
    verified: true,
    lastUpdated: "2026-09-18",
    tags: ["placement", "placements", "jobs", "tpo", "salary", "package", "highest package", "average salary", "companies", "tcs", "infosys", "wipro", "recruitment", "internship", "career"]
  },

  // ────────────────────────────────────────────────────────────────
  // EXAMINATION SYSTEM
  // ────────────────────────────────────────────────────────────────

  {
    title: "Examination System & Academic Calendar — MGMU IICT",
    category: "EXAM",
    programs: [],
    department: "All",
    academicYear: "2026-27",
    authorityLevel: 75,
    content: "MGMU IICT follows the Semester Pattern with Choice-Based Credit System (CBCS):\n\nEvaluation Pattern (per subject):\n• In-Semester Evaluation (ISE): 30 marks (assignments, presentations, attendance)\n• Mid-Semester Examination (MSE): 20 marks\n• End-Semester Examination (ESE): 50 marks\n• Total: 100 marks per subject\n\nExamination Schedule (typical academic calendar):\n• Odd Semester (July–November):\n  - Mid-Sem Exam: September\n  - End-Sem Exam: November / December\n• Even Semester (January–May):\n  - Mid-Sem Exam: February\n  - End-Sem Exam: April / May\n\nResults: Declared within 30 days of exam completion on the MGMU student ERP portal (https://mgmu.ac.in/erp).\n\nNote: Exact exam dates are announced by the MGMU Examination Controller. Check official notices at https://mgmu.ac.in/examinations.",
    source: "MGMU Examination Controller Notice",
    sourceUrl: "https://mgmu.ac.in/examinations",
    verified: true,
    lastUpdated: "2026-09-05",
    tags: ["exam", "examination", "timetable", "schedule", "result", "cbcs", "mid sem", "end sem", "evaluation", "marks", "grade", "credit"]
  }
];

// ─── Mock Courses (used by the Course model in DB) ────────────────────────────
const mockCourses = [
  {
    code: "BTECH-CSE",
    name: "B.Tech Computer Science & Engineering",
    department: "Computer Science & Engineering",
    duration: "4 Years (8 Semesters)",
    eligibility: "10+2 with PCM minimum 45% aggregate (40% reserved) + MHT-CET/JEE Main score",
    fees: 140000,
    intake: 120,
    description: "Core computer science program covering algorithms, software engineering, cloud computing, and AI."
  },
  {
    code: "BTECH-IT",
    name: "B.Tech Information Technology",
    department: "Information Technology",
    duration: "4 Years (8 Semesters)",
    eligibility: "10+2 with PCM minimum 45% aggregate (40% reserved) + MHT-CET/JEE Main score",
    fees: 135000,
    intake: 60,
    description: "Industry-focused program in network architecture, web apps, and enterprise IT management."
  },
  {
    code: "BTECH-AIDS",
    name: "B.Tech Artificial Intelligence & Data Science",
    department: "AI & Data Science",
    duration: "4 Years (8 Semesters)",
    eligibility: "10+2 with PCM minimum 45% aggregate (40% reserved) + MHT-CET/JEE Main score",
    fees: 145000,
    intake: 60,
    description: "Specialized branch in machine learning, deep neural networks, computer vision, and big data."
  },
  {
    code: "MCA",
    name: "Master of Computer Applications",
    department: "Computer Applications",
    duration: "2 Years (4 Semesters)",
    eligibility: "Passed BCA or B.Sc CS/IT with min 50% (45% reserved) + MAH-MCA-CET",
    fees: 95000,
    intake: 60,
    description: "Advanced post-graduate software development and cloud technologies program."
  },
  {
    code: "BCA",
    name: "Bachelor of Computer Applications",
    department: "Computer Applications",
    duration: "3 Years (6 Semesters)",
    eligibility: "10+2 in any stream (Science/Commerce/Arts) with min 45% (40% reserved)",
    fees: 65000,
    intake: 60,
    description: "Foundational computer applications program focusing on web, mobile, and DB programming."
  }
];

// ─── Mock Faculty (used by the Faculty model in DB) ───────────────────────────
const mockFaculty = [
  {
    name: "Dr. Sharad G. Bhartiya",
    designation: "Director / Dean",
    department: "Administration & IICT",
    qualification: "Ph.D. in Computer Engineering",
    email: "director.iict@mgmu.ac.in",
    experience: "25+ Years",
    expertise: "High Performance Computing, Educational Leadership"
  },
  {
    name: "Dr. Vijaya B. Musande",
    designation: "Professor & HOD",
    department: "Computer Science & Engineering",
    qualification: "Ph.D. in Computer Science",
    email: "hod.cse@mgmu.ac.in",
    experience: "20+ Years",
    expertise: "Machine Learning, Image Processing, Pattern Recognition"
  },
  {
    name: "Prof. Swapnil A. Gaikwad",
    designation: "Assistant Professor & HOD",
    department: "Information Technology",
    qualification: "M.Tech in Information Technology",
    email: "sgaikwad@mgmu.ac.in",
    experience: "12 Years",
    expertise: "Java Programming, Full Stack Web Development, Cloud Infrastructure"
  },
  {
    name: "Dr. Abhay E. Wagh",
    designation: "Professor",
    department: "AI & Data Science",
    qualification: "Ph.D. in AI & Robotics",
    email: "awagh@mgmu.ac.in",
    experience: "18 Years",
    expertise: "Deep Learning, Natural Language Processing, Robotics"
  },
  {
    name: "Dr. Pallavi M. Deshmukh",
    designation: "Associate Professor",
    department: "Computer Applications (MCA)",
    qualification: "Ph.D. in Computer Science",
    email: "pdeshmukh@mgmu.ac.in",
    experience: "15 Years",
    expertise: "Database Management Systems, Software Engineering"
  },
  {
    name: "Prof. Rahul S. Kulkarni",
    designation: "Assistant Professor & TPO",
    department: "Training & Placement Cell",
    qualification: "M.Tech in CSE",
    email: "tpo.iict@mgmu.ac.in",
    experience: "10 Years",
    expertise: "Data Structures, System Design, Corporate Relations"
  }
];

module.exports = {
  verifiedKnowledgeBase,
  mockCourses,
  mockFaculty
};
