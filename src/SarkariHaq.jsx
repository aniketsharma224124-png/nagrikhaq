import { useState } from "react";

// ══════════════════════════════════════════
//  COMPLETE SCHEME DATABASE (60+ schemes)
// ══════════════════════════════════════════
const ALL_SCHEMES = [
  // ── HOUSING ──
  {
    id: "pmay_g", emoji: "🏠", name: "PM Awas Yojana – Gramin", amount: "₹1,20,000", cat: "Housing", priority: "HIGH",
    desc: "Housing subsidy for BPL/low-income rural families to build a pucca house.",
    steps: ["Visit Gram Panchayat and ask for PMAY-G registration form.", "Fill form with Aadhaar, bank account and family details.", "Submit with documents to Gram Pradhan / Gram Sevak.", "Name verified against SECC-2011 list.", "₹40,000 released in 3 instalments to your bank.", "Upload geo-tagged photos at each construction stage via AwaasSoft app."],
    docs: ["Aadhaar card", "BPL ration card", "Bank passbook", "Passport photo", "Income certificate", "Land document or NOC"],
    link: "pmayg.nic.in", helpline: "1800-11-6446", timeline: "45–90 days after approval",
    rejection: "Bank not linked to Aadhaar (fix first). Name mismatch in Aadhaar vs ration card.",
    cond: (d) => ["bpl", "low"].includes(d.income) && d.area === "rural"
  },

  {
    id: "pmay_u", emoji: "🏙️", name: "PM Awas Yojana – Urban", amount: "₹2,67,000", cat: "Housing", priority: "HIGH",
    desc: "Housing subsidy for urban poor / EWS / LIG families to buy or build a house in cities.",
    steps: ["Visit nearest Urban Local Body (ULB) or Municipal Corporation office.", "Fill PMAY-U application form or apply at pmaymis.gov.in.", "Select benefit type: Credit Linked Subsidy or Direct Subsidy.", "Submit documents. Bank processes home loan with subsidy.", "Subsidy credited to loan account — reduces EMI."],
    docs: ["Aadhaar card", "Income certificate", "Bank passbook", "Property documents", "Marriage certificate if joint", "Caste certificate if SC/ST/OBC"],
    link: "pmaymis.gov.in", helpline: "1800-11-3377", timeline: "Subsidy credited within 3–6 months",
    rejection: "Family must not own a pucca house anywhere in India. Any family member owning a house = ineligible.",
    cond: (d) => ["bpl", "low", "mid"].includes(d.income) && d.area === "urban"
  },

  // ── HEALTH ──
  {
    id: "pmjay", emoji: "🏥", name: "Ayushman Bharat PM-JAY", amount: "₹5,00,000/year", cat: "Health", priority: "HIGH",
    desc: "Free health insurance ₹5 lakh/year at empanelled hospitals. Covers pre-existing diseases from day 1.",
    steps: ["Check eligibility at pmjay.gov.in or call 14555.", "Visit nearest CSC or district hospital with Aadhaar + ration card.", "Get Ayushman card free — never pay anyone for this.", "Show card at empanelled hospital when admitted.", "Hospital bills government directly — you pay zero."],
    docs: ["Aadhaar card", "Ration card", "Mobile linked to Aadhaar"],
    link: "pmjay.gov.in", helpline: "14555", timeline: "Card same day at CSC",
    rejection: "Not in SECC list? Apply via State Health Agency — states have expanded beneficiary list.",
    cond: (d) => ["bpl", "low"].includes(d.income)
  },

  {
    id: "jsy", emoji: "🤰", name: "Janani Suraksha Yojana", amount: "₹1,400 cash", cat: "Health", priority: "HIGH",
    desc: "Cash incentive for pregnant women choosing institutional delivery. Reduces maternal mortality.",
    steps: ["Register pregnancy at nearest government health centre / ASHA worker.", "ASHA worker helps register and tracks pregnancy.", "Deliver at government hospital or accredited private hospital.", "Cash of ₹1,400 (rural) / ₹1,000 (urban) transferred to bank within 7 days."],
    docs: ["Aadhaar card", "Bank passbook", "BPL card", "Mother-child protection card"],
    link: "nhm.gov.in", helpline: "104", timeline: "Cash within 7 days of delivery",
    rejection: "Must deliver at registered institution. Home delivery not eligible.",
    cond: (d) => ["bpl", "low"].includes(d.income)
  },

  {
    id: "aushadhi", emoji: "💊", name: "PM Jan Aushadhi Scheme", amount: "50–90% cheaper", cat: "Health", priority: "MEDIUM",
    desc: "Quality generic medicines at 50–90% lower price. Same CDSCO standards as branded medicines.",
    steps: ["Find nearest Kendra: janaushadhi.gov.in → Store Locator.", "Show doctor's prescription at Jan Aushadhi store.", "Ask for generic equivalent — same molecule, same quality.", "BP medicine ₹180 branded = ₹12 at Jan Aushadhi."],
    docs: ["Doctor's prescription"],
    link: "janaushadhi.gov.in", helpline: "1800-180-8080", timeline: "Immediate at store",
    rejection: "No application needed. Just visit the store.",
    cond: () => true
  },

  // ── FARMING ──
  {
    id: "pmkisan", emoji: "💰", name: "PM Kisan Samman Nidhi", amount: "₹6,000/year", cat: "Farming", priority: "HIGH",
    desc: "₹2,000 every 4 months directly in bank for farmers. No middleman. eKYC mandatory.",
    steps: ["Visit pmkisan.gov.in → New Farmer Registration.", "Enter Aadhaar, state, land and bank details.", "Do eKYC at pmkisan.gov.in → Farmers Corner → eKYC.", "Patwari verifies land records. ₹2,000 credited every 4 months."],
    docs: ["Aadhaar card", "Land record (Khasra/Khatauni)", "Bank passbook with IFSC", "Mobile linked to Aadhaar"],
    link: "pmkisan.gov.in", helpline: "155261", timeline: "First instalment in 2–3 months",
    rejection: "Land in father's name — transfer first. eKYC not done — do it immediately.",
    cond: (d) => d.land === "yes" || d.occupation === "farmer"
  },

  {
    id: "pmfby", emoji: "🌾", name: "PM Fasal Bima Yojana", amount: "2% premium only", cat: "Farming", priority: "HIGH",
    desc: "Crop insurance — you pay 2%, govt pays 95%+. Covers drought, flood, pest, post-harvest losses.",
    steps: ["Apply before: July 31 (Kharif) / December 31 (Rabi).", "KCC holders: auto-enrolled at bank.", "Non-loanee: visit CSC or pmfby.gov.in.", "Pay 2% premium. Govt pays rest.", "Crop damage: report within 72 hours via 14447."],
    docs: ["Aadhaar", "Land record", "Bank passbook", "Sowing certificate from Patwari", "Crop details"],
    link: "pmfby.gov.in", helpline: "14447", timeline: "Claims in 60 days of verification",
    rejection: "Not reporting damage within 72 hours = claim rejected. Set phone reminder immediately after any crop damage.",
    cond: (d) => d.occupation === "farmer" || d.land === "yes"
  },

  {
    id: "kcc", emoji: "🌾", name: "Kisan Credit Card (KCC)", amount: "Up to ₹3L @ 4%", cat: "Farming", priority: "HIGH",
    desc: "Agricultural credit at only 4% interest. Govt subsidises 5%. No collateral below ₹1.6 lakh.",
    steps: ["Visit nationalised bank / cooperative bank / RRB.", "Ask for KCC application form.", "Submit land details, crop info, documents.", "Bank must issue KCC within 14 days (RBI mandate).", "Repay after harvest. Revolving credit — reuse each year."],
    docs: ["Aadhaar", "Land record (Khasra/7-12)", "Bank passbook", "2 passport photos", "No dues certificate"],
    link: "nabard.org", helpline: "1800-200-0104", timeline: "KCC in 14 days (RBI mandated)",
    rejection: "Bank delaying beyond 14 days? File complaint at banking ombudsman — RBI directive.",
    cond: (d) => d.occupation === "farmer" || d.land === "yes"
  },

  {
    id: "soil", emoji: "🌿", name: "Soil Health Card Scheme", amount: "Free testing", cat: "Farming", priority: "LOW",
    desc: "Free soil testing + personalised fertiliser recommendation. Saves 20% input cost, 15% yield increase.",
    steps: ["Visit Krishi Vigyan Kendra (KVK) or Agriculture Department.", "Submit soil sample (4–5 spots, 6 inches deep, 500gm total).", "Government lab tests in 15–30 days.", "Get Soil Health Card with NPK levels and fertiliser recommendation."],
    docs: ["Aadhaar", "Land record (Khasra number)", "Mobile number"],
    link: "soilhealth.dac.gov.in", helpline: "1800-180-1551", timeline: "Card in 30–45 days",
    rejection: "No rejection. Available to all farmers with land.",
    cond: (d) => d.land === "yes" || d.occupation === "farmer"
  },

  {
    id: "kusum", emoji: "🔋", name: "PM KUSUM Solar Pump", amount: "60% subsidy", cat: "Farming", priority: "MEDIUM",
    desc: "60% govt subsidy on solar irrigation pump. Also earn by selling extra solar power to DISCOM.",
    steps: ["Apply on state KUSUM portal (each state has separate link).", "Select pump capacity: 1 HP to 10 HP.", "Pay only 10% — Centre 30% + State 30% + bank loan covers rest.", "Vendor installs within 90 days.", "Bonus: sell extra power at ₹3–4/unit."],
    docs: ["Aadhaar", "Land record", "Bank passbook", "Electricity bill", "Application form"],
    link: "mnre.gov.in", helpline: "1800-180-3333", timeline: "Installation in 90 days",
    rejection: "Limited budget — apply at start of financial year (April). First-come-first-served.",
    cond: (d) => d.land === "yes" || d.occupation === "farmer"
  },

  // ── INCOME & EMPLOYMENT ──
  {
    id: "mgnrega", emoji: "🏗️", name: "MGNREGA Job Guarantee", amount: "100 days @ ₹220–330/day", cat: "Employment", priority: "HIGH",
    desc: "Legal right to 100 days paid work/year. Govt MUST provide work within 15 days — legally binding.",
    steps: ["Visit Gram Panchayat. Register for Job Card (Form-1).", "Job Card issued free.", "Submit written work application to GP when needed.", "Work must be given within 15 days — your legal right.", "Wages to bank within 15 days of completion.", "Track at nrega.nic.in using Job Card number."],
    docs: ["Aadhaar", "Ration card", "Bank passbook", "Passport photo", "Age proof"],
    link: "nrega.nic.in", helpline: "1800-111-555", timeline: "Work in 15 days. Wages in 15 days.",
    rejection: "Name in another household's card? Check nrega.nic.in → correct at Gram Panchayat.",
    cond: (d) => ["bpl", "low"].includes(d.income) || d.occupation === "laborer"
  },

  {
    id: "pmegp", emoji: "🏭", name: "PM Employment Generation Programme", amount: "15–35% subsidy", cat: "Employment", priority: "HIGH",
    desc: "Up to 35% capital subsidy for starting new manufacturing or service business. Max loan ₹25 lakh (mfg) / ₹10 lakh (service).",
    steps: ["Apply at kviconline.gov.in → PMEGP e-portal.", "Fill application with business plan and personal details.", "Interview by District Level Task Force (DLTF).", "Loan sanctioned by bank. Subsidy (15–35%) credited after 3 years of regular repayment.", "Get EDP (Entrepreneurship Development Programme) training."],
    docs: ["Aadhaar", "PAN card", "8th pass certificate (minimum)", "Project report", "Caste certificate if applicable", "Bank passbook"],
    link: "kviconline.gov.in", helpline: "1800-3000-0034", timeline: "Loan in 3–6 months",
    rejection: "Weak project report = rejection. Visit District Industries Centre (DIC) — they help prepare it free.",
    cond: (d) => d.occupation === "business" || d.occupation === "unemployed" || d.occupation === "selfemployed"
  },

  {
    id: "mudra", emoji: "💼", name: "PM Mudra Yojana", amount: "Up to ₹10 lakh", cat: "Business", priority: "HIGH",
    desc: "Collateral-free business loans: Shishu (₹50K), Kishore (₹5L), Tarun (₹10L) at low interest rates.",
    steps: ["Visit any bank, MFI or NBFC. Ask for MUDRA loan.", "Choose category: Shishu/Kishore/Tarun based on loan amount.", "Fill loan application with business plan.", "No collateral required.", "MUDRA card issued — use like credit card for business expenses."],
    docs: ["Aadhaar", "PAN card", "Business address proof", "Business plan or existing revenue proof", "Bank statement 6 months", "Caste/community certificate if applicable"],
    link: "mudra.org.in", helpline: "1800-180-1111", timeline: "Loan in 7–15 days (Shishu) to 30 days",
    rejection: "Common: (1) No business plan. (2) Wrong category. (3) Bad credit history. Write business description clearly — what product/service, who are customers, expected revenue.",
    cond: (d) => d.occupation === "business" || d.occupation === "selfemployed"
  },

  {
    id: "standup", emoji: "🚀", name: "Stand Up India Scheme", amount: "₹10L–₹1 Crore", cat: "Business", priority: "HIGH",
    desc: "Bank loan ₹10 lakh to ₹1 crore for SC/ST and women entrepreneurs starting new business.",
    steps: ["Register at standupmitra.in and check eligibility.", "Prepare business plan (format at portal).", "Apply through any scheduled commercial bank.", "Bank appraises plan — loan sanctioned at competitive rates.", "Repayment: 7 years with 18-month moratorium."],
    docs: ["Aadhaar", "Caste certificate", "Business plan", "Bank statements", "PAN card", "Project report"],
    link: "standupmitra.in", helpline: "1800-180-1111", timeline: "Loan in 90 days",
    rejection: "Business plan is key. Get help from District Industries Centre free of cost.",
    cond: (d) => d.cb5 || d.gender === "female"
  },

  // ── SAVINGS & PENSION ──
  {
    id: "ssy", emoji: "👧", name: "Sukanya Samridhi Yojana", amount: "8.2% return", cat: "Girl Child", priority: "HIGH",
    desc: "Govt-backed savings for daughters under 10. Highest safe return in India. 100% tax-free.",
    steps: ["Visit Post Office or authorised bank (SBI/PNB/BoB).", "Open SSY account. Min ₹250/year, max ₹1.5L/year.", "Account matures when daughter turns 21.", "50% withdrawal allowed at daughter's age 18 for education.", "8.2% compounded annually — beats all FDs."],
    docs: ["Daughter's birth certificate", "Parent Aadhaar", "Parent PAN", "Passport photos", "Address proof"],
    link: "indiapost.gov.in", helpline: "1800-266-6868", timeline: "Account opened same day",
    rejection: "Daughter must be below 10 years. Max 2 daughters per family.",
    cond: (d) => d.daughter === "yes"
  },

  {
    id: "apy", emoji: "👴", name: "Atal Pension Yojana", amount: "₹1,000–5,000/month", cat: "Pension", priority: "MEDIUM",
    desc: "Guaranteed monthly pension after 60. Govt contributes 50% for 5 years (pre-2015 enrollees).",
    steps: ["Visit bank with savings account.", "Fill APY enrolment form.", "Choose pension: ₹1K/2K/3K/4K/5K/month.", "Premium auto-debited monthly. ₹42/month at age 18 for ₹1K pension.", "Nominee gets corpus if subscriber dies before 60."],
    docs: ["Aadhaar", "Savings bank account", "Mobile number"],
    link: "npscra.nsdl.co.in", helpline: "1800-110-069", timeline: "Active immediately. Pension at 60.",
    rejection: "Cannot enrol if income tax payer. Age 18–40 only.",
    cond: (d) => d.income !== "high"
  },

  {
    id: "nps", emoji: "💹", name: "National Pension Scheme (NPS)", amount: "Market-linked returns", cat: "Pension", priority: "MEDIUM",
    desc: "Retirement savings with tax benefits. ₹50,000 additional deduction under 80CCD(1B). Low fund management charges.",
    steps: ["Open NPS account at any PoP (Point of Presence — bank branch) or at eNPS portal.", "Choose Tier-1 (pension) + Tier-2 (withdrawal) account.", "Min contribution ₹500/year.", "Invest in equity/bonds mix based on risk appetite.", "Partial withdrawal allowed after 3 years for emergencies."],
    docs: ["Aadhaar", "PAN card", "Bank passbook", "Passport photo"],
    link: "enps.nsdl.com", helpline: "1800-110-708", timeline: "Account in 1–2 days online",
    rejection: "No rejection. Open to all Indian citizens 18–70.",
    cond: () => true
  },

  // ── EDUCATION & SCHOLARSHIPS ──
  {
    id: "nsp", emoji: "📚", name: "National Scholarship Portal (NSP)", amount: "₹10,000–75,000/year", cat: "Education", priority: "HIGH",
    desc: "Central govt scholarships for SC/ST/OBC/minority students. Pre-matric + post-matric + top class.",
    steps: ["Register at scholarships.gov.in with Aadhaar.", "Select scholarship matching your category + course.", "Fill application with marks, income, bank details.", "Upload documents. Deadline: October 31 every year.", "Amount credited to bank in 3–4 months."],
    docs: ["Aadhaar", "Last marksheet", "Income certificate (below ₹2.5L)", "Bank in student's name", "Caste certificate", "Bonafide certificate"],
    link: "scholarships.gov.in", helpline: "0120-6619540", timeline: "3–4 months after application",
    rejection: "(1) Income cert expired. (2) Bank not in student's name. (3) Applied after Oct 31. Apply early.",
    cond: (d) => d.cb4
  },

  {
    id: "pm_internship", emoji: "💻", name: "PM Internship Scheme", amount: "₹5,000/month stipend", cat: "Education", priority: "HIGH",
    desc: "1-year internship at top 500 Indian companies for youth 21–24 years. ₹5,000/month + ₹6,000 one-time grant.",
    steps: ["Register at pminternship.mca.gov.in with Aadhaar.", "Browse internship opportunities from top companies.", "Apply to up to 5 companies.", "Selected candidates get ₹4,500 from company + ₹500 DBT = ₹5,000/month.", "₹6,000 one-time grant for incidental expenses."],
    docs: ["Aadhaar", "Bank account", "Educational certificates", "Mobile number"],
    link: "pminternship.mca.gov.in", helpline: "1800-11-0001", timeline: "Starts within 1–2 months of selection",
    rejection: "Only for age 21–24. Annual family income below ₹8 lakh. Not in full-time education.",
    cond: (d) => d.cb4
  },

  {
    id: "vidyalakshmi", emoji: "🎓", name: "Vidya Lakshmi Education Loan", amount: "Up to ₹6.5 lakh (collateral-free)", cat: "Education", priority: "HIGH",
    desc: "Education loans up to ₹6.5 lakh without collateral. Subsidised interest for economically weaker students.",
    steps: ["Register at vidyalakshmi.co.in.", "Apply to multiple banks simultaneously from one portal.", "Select course + institution.", "For loans above ₹4 lakh, government pays interest during study period (CSIS subsidy).", "Repayment starts 1 year after completing course."],
    docs: ["Aadhaar", "PAN", "Mark sheets", "Admission letter", "Income certificate", "Bank passbook", "Co-applicant's income proof"],
    link: "vidyalakshmi.co.in", helpline: "1800-267-7575", timeline: "Loan in 15–30 days",
    rejection: "Admission at recognised institution mandatory. Co-applicant (parent) required.",
    cond: (d) => d.cb4
  },

  {
    id: "disability_sch", emoji: "♿", name: "Scholarship for Persons with Disability", amount: "₹35,000/year", cat: "Education", priority: "HIGH",
    desc: "Central scholarship for students with 40%+ disability for school and higher education.",
    steps: ["Get Disability Certificate from govt hospital (40%+ disability).", "Register at scholarships.gov.in.", "Select Scholarship for Students with Disabilities.", "Upload certificate + marks + bank details.", "Apply before October 31."],
    docs: ["Aadhaar", "Disability certificate 40%+ from govt hospital", "Last marksheet", "Income certificate", "Bank in student's name", "Bonafide certificate"],
    link: "scholarships.gov.in", helpline: "0120-6619540", timeline: "3–4 months",
    rejection: "Private hospital certificate NOT accepted. Must be govt hospital CMO.",
    cond: (d) => d.cb2
  },

  // ── SOCIAL WELFARE ──
  {
    id: "widow_pension", emoji: "🎖️", name: "Widow Pension (IGNWPS)", amount: "₹500–1,500/month", cat: "Social", priority: "HIGH",
    desc: "Monthly pension for widows aged 40–79 from BPL. Most states add ₹200–1,200 extra.",
    steps: ["Visit Gram Panchayat (rural) or Ward Office (urban).", "Get IGNWPS application form.", "Submit to BDO via Gram Pradhan.", "BDO verifies. Pension credited monthly after approval.", "States add top-up: UP ₹1,000/month total, Maharashtra ₹1,400/month."],
    docs: ["Aadhaar", "Husband's death certificate", "BPL ration card", "Bank passbook", "Age proof", "Income certificate", "Photo"],
    link: "nsap.nic.in", helpline: "011-23382012", timeline: "60–90 days after approval",
    rejection: "Income above ₹48,000/year = rejected. Ensure income certificate shows below limit.",
    cond: (d) => d.cb3
  },

  {
    id: "old_age", emoji: "👵", name: "Old Age Pension (IGNOAPS)", amount: "₹200–500/month + state", cat: "Social", priority: "HIGH",
    desc: "Monthly pension for seniors 60+ from BPL. States match: UP ₹1,000/month, Maharashtra ₹1,200/month.",
    steps: ["Visit Gram Panchayat or Municipal Ward Office.", "Fill IGNOAPS application form.", "Submit to Block Social Welfare Officer.", "Field verification done. Pension credited monthly."],
    docs: ["Aadhaar", "Age proof", "BPL ration card", "Bank passbook", "Income certificate", "Photo"],
    link: "nsap.nic.in", helpline: "011-23382012", timeline: "60–90 days after approval",
    rejection: "Age unverifiable from Aadhaar? Get age certificate from govt hospital CMO.",
    cond: (d) => d.cb1 && ["bpl", "low"].includes(d.income)
  },

  {
    id: "disability_pension", emoji: "♿", name: "Disability Pension (IGNDPS)", amount: "₹300–500/month", cat: "Social", priority: "HIGH",
    desc: "Monthly pension for persons with 80%+ disability aged 18–59 from BPL families.",
    steps: ["Get 80%+ Disability Certificate from CMO/SADM.", "Visit Gram Panchayat or Ward Office with application.", "Submit to BDO/District Social Welfare Officer.", "After verification, pension credited monthly."],
    docs: ["Aadhaar", "Disability certificate 80%+ from govt hospital", "BPL ration card", "Bank passbook", "Age proof"],
    link: "nsap.nic.in", helpline: "011-23382012", timeline: "60–90 days",
    rejection: "Disability must be 80%+ for central pension. Check state scheme — many states give pension at 40%+.",
    cond: (d) => d.cb2 && ["bpl", "low"].includes(d.income)
  },

  // ── ENERGY & UTILITIES ──
  {
    id: "ujjwala", emoji: "🍳", name: "PM Ujjwala Yojana 2.0", amount: "Free LPG + ₹1,600", cat: "Energy", priority: "MEDIUM",
    desc: "Free LPG connection + first cylinder free + ₹1,600 equipment deposit waiver for BPL women.",
    steps: ["Visit LPG distributor (HP Gas / Indane / Bharat Gas).", "Ask for 'Ujjwala 2.0 connection' specifically.", "Fill Form KYC-1. No deposit for BPL families.", "Connection issued in 7–15 days. First cylinder free.", "Subsidy credited to bank via PAHAL/DBTL."],
    docs: ["Aadhaar", "BPL ration card", "Bank passbook", "Self-declaration no existing LPG", "Photo"],
    link: "pmuy.gov.in", helpline: "1800-233-3555", timeline: "7–15 working days",
    rejection: "Another household member has LPG connection = refused. Check family connections first.",
    cond: (d) => ["bpl", "low"].includes(d.income)
  },

  {
    id: "solar_rooftop", emoji: "☀️", name: "PM Surya Ghar (Solar Rooftop)", amount: "₹30,000–78,000 subsidy", cat: "Energy", priority: "MEDIUM",
    desc: "Free solar panels on rooftop — 300 units free electricity/month. Excess sold to DISCOM.",
    steps: ["Register at pmsuryaghar.gov.in with Aadhaar.", "Apply online — select your DISCOM (electricity board).", "Get technical feasibility from local DISCOM.", "Approved vendor installs panels.", "Subsidy credited to bank after installation.", "Net metering enables selling excess power."],
    docs: ["Aadhaar", "Electricity bill", "Property ownership proof", "Bank passbook", "Photo of rooftop"],
    link: "pmsuryaghar.gov.in", helpline: "1800-180-3333", timeline: "Installation in 30–60 days",
    rejection: "Rental property needs landlord NOC. Roof must have unobstructed south-facing space.",
    cond: (d) => d.house === "yes"
  },

  // ── WOMEN SPECIFIC ──
  {
    id: "mahila_samriddhi", emoji: "👩‍💼", name: "Mahila Samriddhi Yojana", amount: "4% interest loan", cat: "Women", priority: "MEDIUM",
    desc: "Low-interest micro-credit for women from SC communities to start self-employment ventures.",
    steps: ["Apply through District Social Welfare Officer.", "Join a self-help group (SHG) of 10–20 women.", "Group applies collectively for loan.", "Loan at 4% interest — below market rate.", "Repayment flexible — 24 months."],
    docs: ["Aadhaar", "Caste certificate (SC)", "BPL ration card", "Bank passbook", "Business plan"],
    link: "socialjustice.gov.in", helpline: "1800-11-2001", timeline: "Loan in 30–60 days",
    rejection: "Must be SC woman. SHG formation mandatory.",
    cond: (d) => d.cb5 && d.gender === "female"
  },

  {
    id: "balika_anudan", emoji: "👶", name: "Balika Anudan Yojana", amount: "₹2,000 at birth", cat: "Girl Child", priority: "MEDIUM",
    desc: "Cash benefit at birth of girl child for BPL families. Encourages girl child birth and registration.",
    steps: ["Register birth at local Civil Registration office.", "Visit Gram Panchayat with birth certificate.", "Fill Balika Anudan application.", "Cash transferred to mother's bank account within 30 days."],
    docs: ["Birth certificate of girl child", "Mother's Aadhaar", "BPL ration card", "Bank passbook"],
    link: "wcd.nic.in", helpline: "1091", timeline: "30 days after birth registration",
    rejection: "Birth must be registered within 21 days. BPL status mandatory.",
    cond: (d) => d.daughter === "yes" && ["bpl", "low"].includes(d.income)
  },

  // ── SKILL & ENTREPRENEUR ──
  {
    id: "vishwakarma", emoji: "🔨", name: "PM Vishwakarma Yojana", amount: "₹3L loan + ₹15,000 toolkit", cat: "Skill", priority: "HIGH",
    desc: "For traditional craftsmen (carpenter, blacksmith, potter, tailor etc.) — free training, toolkit grant ₹15,000, loan at 5%.",
    steps: ["Register at pmvishwakarma.gov.in with Aadhaar.", "Verify caste-based craft/occupation.", "Get basic training (5 days) + advanced training (15 days) with ₹500/day stipend.", "Receive PM Vishwakarma certificate + toolkit grant ₹15,000.", "Apply for collateral-free loan ₹1 lakh → ₹2 lakh → ₹3 lakh at 5% interest."],
    docs: ["Aadhaar", "Ration card", "Bank passbook", "Mobile number", "Caste/occupation proof"],
    link: "pmvishwakarma.gov.in", helpline: "18002677777", timeline: "Training + loan in 60–90 days",
    rejection: "18 traditional trades only (carpenter, tailor, potter, cobbler, barber, blacksmith, goldsmith etc.). Family member in same trade must not have availed in past 5 years.",
    cond: (d) => d.occupation === "selfemployed" || d.occupation === "laborer"
  },

  {
    id: "pmkvy", emoji: "🎓", name: "PM Kaushal Vikas Yojana (PMKVY)", amount: "Free training + ₹8,000", cat: "Skill", priority: "HIGH",
    desc: "Free skill training in 300+ job roles with government certification and placement assistance.",
    steps: ["Visit nearest PMKVY training centre at skillindia.gov.in → Training Centre Locator.", "Enrol in desired skill course (IT, healthcare, construction, retail etc.).", "Complete training (typically 3–6 months).", "Appear for assessment. Get National Skills Qualification Framework (NSQF) certificate.", "₹8,000 reward on certification + placement assistance."],
    docs: ["Aadhaar", "Bank passbook", "Educational certificates", "Mobile number", "Passport photo"],
    link: "skillindia.gov.in", helpline: "1800-123-9626", timeline: "Training 3–6 months. Reward immediately after.",
    rejection: "Age 15–45. Must complete training and clear assessment.",
    cond: () => true
  },

  {
    id: "deen_dayal", emoji: "🤝", name: "Deen Dayal Upadhyaya Grameen Kaushalya", amount: "Free training + job placement", cat: "Skill", priority: "MEDIUM",
    desc: "Free residential skill training for rural youth 15–35 years with guaranteed job placement at ₹10,000+/month.",
    steps: ["Enrol through District Programme Coordinator (DPC) — contact block office.", "Application open throughout the year.", "Residential training (3–12 months depending on trade).", "Mandatory job placement. Salary ≥ ₹10,000/month.", "Post-placement support for 12 months."],
    docs: ["Aadhaar", "Age proof", "Educational proof", "BPL ration card (priority for BPL)", "Mobile number"],
    link: "ddugky.gov.in", helpline: "1800-3000-0034", timeline: "Training 3–12 months. Job after completion.",
    rejection: "Must be rural youth 15–35. Not applicable to urban residents.",
    cond: (d) => d.area === "rural" && ["bpl", "low", "mid"].includes(d.income)
  },

  // ── BANKING & INSURANCE ──
  {
    id: "jandhan", emoji: "🔵", name: "PM Jan Dhan Yojana", amount: "₹2L insurance + ₹10K OD", cat: "Banking", priority: "MEDIUM",
    desc: "Zero balance account with free ₹2 lakh accident insurance and ₹10,000 overdraft after 6 months.",
    steps: ["Visit any nationalised bank with Aadhaar.", "Ask specifically for Jan Dhan account.", "No minimum balance ever required.", "Get free RuPay card with ₹2L accident insurance.", "After 6 months good transactions, apply for ₹10,000 overdraft.", "Link Aadhaar to receive all DBT benefits."],
    docs: ["Aadhaar (sufficient alone as ID + address proof)", "Passport photo"],
    link: "pmjdy.gov.in", helpline: "1800-11-0001", timeline: "Account same day. RuPay card in 7–10 days.",
    rejection: "Bank refuses? Complain to banking ombudsman. Every Indian has legal right to Jan Dhan account.",
    cond: () => true
  },

  {
    id: "jjby", emoji: "🛡️", name: "Jeevan Jyoti Bima Yojana", amount: "₹2 lakh life cover @ ₹436/year", cat: "Insurance", priority: "HIGH",
    desc: "Life insurance ₹2 lakh on death for just ₹436/year (₹1.2/day). No medical exam. Auto-debit from bank.",
    steps: ["Visit bank or apply online via bank's netbanking.", "Give consent for auto-debit of ₹436/year.", "Coverage starts immediately for age 18–50.", "On death (any reason), family gets ₹2 lakh.", "Renewable every year. Can be linked to Jan Dhan account."],
    docs: ["Aadhaar", "Bank account", "Nominee details"],
    link: "jansuraksha.gov.in", helpline: "1800-180-1111", timeline: "Immediate coverage",
    rejection: "Age must be 18–50. Bank account with auto-debit facility required.",
    cond: () => true
  },

  {
    id: "pmsby", emoji: "🦺", name: "PM Suraksha Bima Yojana", amount: "₹2 lakh accident cover @ ₹20/year", cat: "Insurance", priority: "HIGH",
    desc: "Accident insurance ₹2 lakh for just ₹20/year (less than 6 paise/day). Auto-debit from bank.",
    steps: ["Visit bank or apply online.", "Give consent for ₹20/year auto-debit.", "Coverage for accidental death + full disability ₹2L.", "Partial disability ₹1L.", "Renewable annually."],
    docs: ["Aadhaar", "Bank account", "Nominee details"],
    link: "jansuraksha.gov.in", helpline: "1800-180-1111", timeline: "Immediate coverage",
    rejection: "Age 18–70. Bank account required.",
    cond: () => true
  },

  // ── TRIBAL / SC / ST ──
  {
    id: "tribal_loan", emoji: "🏞️", name: "Tribal Development Corp Loan", amount: "Subsidised loans up to ₹2L", cat: "Tribal", priority: "MEDIUM",
    desc: "Special loans with 50–100% interest subsidy for Scheduled Tribe families through State Tribal Development Corps.",
    steps: ["Visit nearest State Tribal Development Corporation office.", "Check specific state schemes — each state has different programs.", "Apply with ST certificate + project plan.", "Loan at heavily subsidised rate or interest-free."],
    docs: ["Aadhaar", "ST certificate", "Bank passbook", "Income certificate", "Project plan"],
    link: "tribal.gov.in", helpline: "011-23382505", timeline: "30–90 days depending on state",
    rejection: "ST certificate must be from authorised govt officer. Recent certificate preferred.",
    cond: (d) => d.cb5
  },

  // ── DIGITAL & STARTUP ──
  {
    id: "startup_india", emoji: "🚀", name: "Startup India Scheme", amount: "Tax exemption + funding access", cat: "Business", priority: "MEDIUM",
    desc: "DPIIT recognition gives tax benefits (3 years), patent fast-track, government tender preference.",
    steps: ["Register startup at startupindia.gov.in → Apply for DPIIT recognition.", "Submit incorporation docs + innovation description.", "Recognition in 3–5 working days.", "Get income tax exemption for 3 years.", "Access Startup India Seed Fund (up to ₹20 lakh grant).", "Join state startup ecosystem for additional support."],
    docs: ["Incorporation certificate", "PAN", "Aadhaar of founders", "Brief on innovation/product", "Bank passbook"],
    link: "startupindia.gov.in", helpline: "1800-115-565", timeline: "DPIIT recognition in 3–5 days",
    rejection: "Must be a company/LLP/partnership — not sole proprietorship. Must be innovative, not a replication.",
    cond: (d) => d.occupation === "business"
  },

  {
    id: "udyam", emoji: "🏭", name: "Udyam Registration (MSME)", amount: "Free certification + benefits", cat: "Business", priority: "HIGH",
    desc: "Free MSME registration giving access to priority sector loans, govt tender preference, delayed payment protection.",
    steps: ["Visit udyamregistration.gov.in.", "Enter Aadhaar number. Auto-fill from ITR data.", "No documents to upload — fully paperless.", "Certificate issued immediately.", "Benefits: priority loans, 1% interest subvention, govt tender reserved quota."],
    docs: ["Aadhaar", "PAN", "Bank details"],
    link: "udyamregistration.gov.in", helpline: "1800-111-955", timeline: "Certificate issued immediately",
    rejection: "No rejection. Self-declaration based. All businesses with turnover up to ₹250 crore eligible.",
    cond: (d) => d.occupation === "business" || d.occupation === "selfemployed"
  },
];

const STUDENT_SCHEMES = [
  { name: "PM Internship Scheme", amount: "₹5,000/month", desc: "1-year internship at top 500 companies with stipend.", link: "pminternship.mca.gov.in" },
  { name: "National Scholarship Portal", amount: "₹10K–75K/year", desc: "Scholarships for SC/ST/OBC/minority students.", link: "scholarships.gov.in" },
  { name: "Vidya Lakshmi Education Loan", amount: "Up to ₹6.5L", desc: "Collateral-free education loan from multiple banks.", link: "vidyalakshmi.co.in" },
  { name: "PM YASASVI Scholarship", amount: "₹75,000–1,25,000/year", desc: "For OBC/EBC/DNT students in class 9–12 and higher.", link: "scholarships.gov.in" },
  { name: "AICTE Pragati Scholarship (Girls)", amount: "₹50,000/year", desc: "For girl students in AICTE-approved technical institutions.", link: "aicte-india.org" },
  { name: "AICTE Saksham Scholarship", amount: "₹50,000/year", desc: "For differently-abled students in technical education.", link: "aicte-india.org" },
  { name: "PM KVY Skill Training", amount: "Free + ₹8,000", desc: "Free skill training with NSQF certification and job placement.", link: "skillindia.gov.in" },
  { name: "PM Ustaad (Minority Skill)", amount: "Free training", desc: "Skill training for traditional crafts by minority artisans.", link: "minorityaffairs.gov.in" },
  { name: "Ishan Uday (NE Region)", amount: "₹5,400–7,800/month", desc: "Special scholarship for students from North-East India.", link: "scholarships.gov.in" },
  { name: "INSPIRE Scholarship (Science)", amount: "₹80,000/year", desc: "For top 1% science students pursuing BSc/BS/Int MSc.", link: "online-inspire.gov.in" },
];

const HIDDEN_SCHEMES = [
  { emoji: "🔨", name: "PM Vishwakarma Yojana", amount: "₹3L loan + ₹15K toolkit", desc: "For 18 traditional crafts — carpenter, tailor, potter, blacksmith, cobbler etc.", tag: "NEW 2023" },
  { emoji: "☀️", name: "PM Surya Ghar Yojana", amount: "₹30K–78K subsidy + free power", desc: "Free solar panels on your rooftop — 300 units free electricity every month.", tag: "NEW 2024" },
  { emoji: "💻", name: "PM Internship Scheme", amount: "₹5,000/month stipend", desc: "Paid internship at top 500 companies for youth 21–24 years.", tag: "NEW 2024" },
  { emoji: "🌾", name: "PM KUSUM Solar Pump", amount: "60% subsidy", desc: "Solar irrigation pump with 60% govt subsidy. Sell extra power to DISCOM.", tag: "FARMING" },
  { emoji: "💼", name: "PM Mudra Yojana", amount: "Up to ₹10 lakh", desc: "Collateral-free business loans for small businesses and self-employed.", tag: "BUSINESS" },
  { emoji: "🏭", name: "PMEGP Subsidy", amount: "15–35% capital subsidy", desc: "Start a manufacturing or service business with govt capital subsidy.", tag: "BUSINESS" },
  { emoji: "🏞️", name: "Udyam MSME Registration", amount: "Free + priority loans", desc: "Free MSME registration gives priority sector loans and payment protection.", tag: "FREE" },
  { emoji: "🛡️", name: "PM Suraksha Bima", amount: "₹2L accident cover @₹20/year", desc: "Accident insurance ₹2 lakh for just ₹20 per year. Must-have for everyone.", tag: "INSURANCE" },
  { emoji: "💊", name: "Jan Aushadhi Kendra", amount: "50–90% cheaper medicines", desc: "Generic medicines at fraction of branded price. 10,000+ stores across India.", tag: "HEALTH" },
  { emoji: "🌿", name: "Soil Health Card", amount: "Free + yield increase 15%", desc: "Free soil testing and fertiliser recommendation. Most farmers don't know this exists.", tag: "FARMING" },
  { emoji: "🎓", name: "INSPIRE Science Scholarship", amount: "₹80,000/year", desc: "For top 1% science students in 11th, 12th and BSc/MSc programs.", tag: "EDUCATION" },
  { emoji: "🚀", name: "Startup India Seed Fund", amount: "Up to ₹20 lakh grant", desc: "Grant funding for early-stage startups from DPIIT-recognised startups.", tag: "STARTUP" },
  { emoji: "🤝", name: "DDU-GKY Rural Skill", amount: "Free training + job ₹10K+/month", desc: "Residential skill training for rural youth with guaranteed job placement.", tag: "SKILL" },
  { emoji: "🏠", name: "PM Awas Urban Credit Subsidy", amount: "₹2,67,000 subsidy", desc: "Housing subsidy for urban families — EWS/LIG income groups applying for home loan.", tag: "HOUSING" },
  { emoji: "📚", name: "PM YASASVI Scholarship", amount: "₹75K–1.25L/year", desc: "For OBC/EBC/DNT students from class 9 to postgraduate level.", tag: "EDUCATION" },
];

const STATES = ["Andhra Pradesh", "Assam", "Bihar", "Chhattisgarh", "Delhi", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Odisha", "Punjab", "Rajasthan", "Tamil Nadu", "Telangana", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Other"];
const RZP_KEY = import.meta.env.VITE_RAZORPAY_KEY || "rzp_test_YourTestKeyHere";

// ══════════════════════════════════════════
//  PDF BUILDER (full 25+ page report)
// ══════════════════════════════════════════
function buildPDF(report) {
  const { data, schemes } = report;
  const today = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
  const allDocs = [...new Set(schemes.flatMap(s => s.docs || []))];
  const highPri = schemes.filter(s => s.priority === "HIGH");
  const totalAmt = report.total;

  const schemeCards = schemes.map((s, i) => `
    <div class="sblock">
      <div class="shead">
        <span class="snum">${i + 1}</span>
        <span class="stitle">${s.emoji} ${s.name}</span>
        <span class="scat">${s.cat || ""}</span>
        <span class="samount">${s.amount}</span>
        <span class="pbadge ${s.priority === "HIGH" ? "ph" : "pm"}">${s.priority}</span>
      </div>
      <p class="sdesc">${s.desc}</p>
      <div class="twocol">
        <div>
          <div class="sh4">✅ Step-by-Step Application Process</div>
          <ol>${(s.steps || []).map(st => `<li>${st}</li>`).join("")}</ol>
        </div>
        <div>
          <div class="sh4">📂 Documents Required</div>
          <ul>${(s.docs || []).map(d => `<li>${d}</li>`).join("")}</ul>
          <div class="ibox">
            <div class="ir"><b>🔗 Official Website:</b> <span class="lnk">${s.link || ""}</span></div>
            <div class="ir"><b>📞 Helpline:</b> ${s.helpline || "N/A"}</div>
            <div class="ir"><b>⏱ Timeline:</b> ${s.timeline || "Check portal"}</div>
          </div>
        </div>
      </div>
      <div class="rbox"><b>⚠️ Common Rejection Reasons — Avoid These:</b><br/>${s.rejection || "Follow instructions carefully."}</div>
    </div>`).join("");

  const priList = highPri.map((s, i) => `
    <div class="prow">
      <div class="pnum">${i + 1}</div>
      <div><strong>${s.emoji} ${s.name}</strong><br/><span>${s.amount} · ${s.link || ""} · ☎ ${s.helpline || ""}</span></div>
    </div>`).join("") || "<p>Apply all schemes in the order listed in Section 2.</p>";

  const docGrid = allDocs.map(d => `<div class="docbox"><div class="dch">☐</div><span>${d}</span></div>`).join("");

  const calData = [
    { m: "Jan–Mar", items: ["📋 File ITR, check 80C deductions", "🌾 Rabi crop insurance claim deadline", "🎓 NSP scholarship renewal by March 31", "📊 PM Kisan eKYC renewal if expired"] },
    { m: "Apr–Jun", items: ["💰 PM Kisan 1st instalment (April)", "🌱 Apply KCC before Kharif season", "☀️ KUSUM solar applications open (April)", "🎓 NSP scholarship window opens"] },
    { m: "Jul–Sep", items: ["🌾 Kharif crop insurance deadline: July 31", "📚 NSP deadline: October 31 — apply early", "💰 PM Kisan 2nd instalment (August)", "🔨 PM Vishwakarma new batch registrations"] },
    { m: "Oct–Dec", items: ["🎓 NSP last date: October 31 (STRICT)", "🌾 Rabi crop insurance: December 31", "💰 PM Kisan 3rd instalment (December)", "👵 Pension annual life verification due", "☀️ PM Surya Ghar winter installations"] },
  ];
  const calendar = calData.map(c => `<div class="cbox"><div class="cmo">${c.m}</div><ul>${c.items.map(i => `<li>${i}</li>`).join("")}</ul></div>`).join("");

  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"/>
<title>NagrikHaq Report — ${data.name}</title>
<style>
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:Arial,sans-serif;color:#111827;font-size:13px;line-height:1.6;background:#fff;}
@media print{.np{display:none!important;}.pb{page-break-before:always;}body{font-size:11.5px;}}
.np{background:#FF6B00;color:#fff;padding:12px 24px;display:flex;justify-content:space-between;align-items:center;position:sticky;top:0;z-index:100;}
.pb2{background:#fff;color:#FF6B00;border:none;padding:9px 22px;border-radius:7px;font-weight:800;cursor:pointer;font-size:14px;}
.page{max-width:800px;margin:0 auto;padding:20px 24px;}
.cover{background:#0A1628;border-radius:12px;padding:32px;text-align:center;margin-bottom:20px;color:#fff;}
.clogo{font-size:24px;font-weight:900;color:#FF6B00;letter-spacing:1px;}
.csub{font-size:11px;color:rgba(255,255,255,0.45);margin:4px 0 18px;}
.cname{font-size:26px;font-weight:900;color:#fff;margin:8px 0;}
.cmeta{display:flex;justify-content:center;gap:24px;flex-wrap:wrap;font-size:12px;color:rgba(255,255,255,0.55);}
.bhero{background:#138808;border-radius:12px;padding:24px;text-align:center;margin-bottom:20px;color:#fff;}
.blbl{font-size:10px;letter-spacing:2px;text-transform:uppercase;opacity:.8;margin-bottom:6px;}
.bamt{font-size:46px;font-weight:900;line-height:1;color:#fff;}
.bsub{font-size:13px;opacity:.8;margin-top:8px;color:#fff;}
.stoc{background:#F9FAFB;border:1px solid #E5E7EB;border-radius:10px;padding:18px;margin-bottom:6px;}
.stoc h3{font-weight:800;font-size:15px;margin-bottom:10px;color:#111827;}
.tocrow{display:flex;gap:10px;padding:6px 0;border-bottom:1px solid #F3F4F6;font-size:13px;color:#111827;}
.tocnum{color:#FF6B00;font-weight:700;}
.sec{font-size:17px;font-weight:800;color:#111827;margin:26px 0 12px;padding-bottom:7px;border-bottom:3px solid #FF6B00;}
.prow{display:flex;align-items:flex-start;gap:12px;padding:11px 0;border-bottom:1px solid #F3F4F6;}
.pnum{width:28px;height:28px;border-radius:50%;background:#FF6B00;color:#fff;font-weight:900;font-size:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.prow div strong{display:block;font-size:14px;color:#111827;margin-bottom:2px;}
.prow div span{font-size:12px;color:#4B5563;}
.sblock{border:1px solid #D1D5DB;border-radius:10px;padding:18px;margin-bottom:16px;page-break-inside:avoid;}
.shead{display:flex;align-items:center;gap:7px;flex-wrap:wrap;margin-bottom:8px;}
.snum{width:24px;height:24px;border-radius:50%;background:#FF6B00;color:#fff;font-weight:900;font-size:11px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.stitle{font-weight:800;font-size:14px;color:#111827;flex:1;}
.scat{font-size:10px;background:#E5E7EB;color:#374151;padding:2px 7px;border-radius:4px;}
.samount{font-weight:700;color:#138808;font-size:12px;white-space:nowrap;}
.pbadge{font-size:10px;font-weight:700;padding:2px 8px;border-radius:100px;}
.ph{background:#FEE2E2;color:#DC2626;}.pm{background:#FFF3E8;color:#FF6B00;}
.sdesc{color:#374151;font-size:12.5px;margin-bottom:12px;}
.twocol{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:11px;}
@media(max-width:580px){.twocol{grid-template-columns:1fr;}}
.sh4{font-size:11px;font-weight:700;color:#111827;margin-bottom:7px;text-transform:uppercase;letter-spacing:.5px;}
ol,ul{padding-left:15px;}
li{font-size:12px;color:#374151;line-height:1.75;}
.ibox{background:#F3F4F6;border-radius:7px;padding:10px;margin-top:10px;}
.ir{font-size:11.5px;color:#374151;line-height:1.8;}
.lnk{color:#1D4ED8;}
.rbox{background:#FFF7ED;border-left:4px solid #FF6B00;padding:10px 13px;font-size:12px;color:#374151;line-height:1.6;}
.rbox b{color:#92400E;}
.docgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:9px;margin-top:10px;}
.docbox{background:#F9FAFB;border:1px solid #D1D5DB;border-radius:7px;padding:9px;display:flex;align-items:flex-start;gap:7px;font-size:12px;color:#374151;}
.dch{width:17px;height:17px;border:2px solid #138808;border-radius:3px;flex-shrink:0;font-size:10px;display:flex;align-items:center;justify-content:center;}
.calgrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:11px;margin-top:10px;}
.cbox{background:#F9FAFB;border:1px solid #D1D5DB;border-radius:9px;padding:13px;}
.cmo{font-weight:700;font-size:13px;color:#FF6B00;margin-bottom:7px;}
.cbox li{font-size:11.5px;line-height:1.85;color:#374151;}
.gstep{display:flex;gap:11px;padding:11px 0;border-bottom:1px solid #F3F4F6;}
.gnum{width:26px;height:26px;border-radius:50%;background:#111827;color:#fff;font-weight:900;font-size:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.gt{font-size:12.5px;color:#374151;line-height:1.65;flex:1;}
.gt strong{color:#111827;}
.wk{background:#F9FAFB;border-radius:9px;padding:13px;margin-bottom:11px;border-left:4px solid #FF6B00;}
.wk h4{font-size:13px;font-weight:700;color:#FF6B00;margin-bottom:7px;}
.wk li{font-size:12.5px;line-height:2;color:#374151;}
.astep{background:#FFF7ED;border:1px solid #FED7AA;border-radius:7px;padding:11px;margin-bottom:7px;font-size:12.5px;color:#374151;line-height:1.65;}
.astep strong{color:#92400E;}
.cscgrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:11px;margin-top:11px;}
.cscbox{background:#F9FAFB;border:1px solid #D1D5DB;border-radius:9px;padding:13px;}
.cscbox h4{font-size:12px;font-weight:700;color:#FF6B00;margin-bottom:7px;text-transform:uppercase;}
.cscbox p{font-size:12px;line-height:1.8;color:#374151;}
.ftop{background:#111827;color:rgba(255,255,255,0.6);text-align:center;padding:16px;border-radius:10px;margin-top:22px;font-size:11px;line-height:1.9;}
.ftop strong{color:#FF6B00;}
.tc{display:flex;height:4px;width:90px;margin:8px auto 0;}
.tipbox{background:#F0FFF4;border:1px solid #86EFAC;border-radius:9px;padding:13px;margin-top:12px;font-size:12.5px;color:#374151;line-height:1.65;}
.tipbox strong{color:#166534;}
.warnbox{background:#FFF7ED;border:1px solid #FED7AA;border-radius:9px;padding:13px;margin-top:12px;font-size:12.5px;color:#374151;line-height:1.65;}
.warnbox strong{color:#92400E;}
.cscinfo{background:#EFF6FF;border:1px solid #93C5FD;border-radius:10px;padding:16px;margin-bottom:12px;}
.cscinfo h3{font-size:15px;font-weight:800;color:#1E40AF;margin-bottom:8px;}
.cscinfo p{font-size:12.5px;color:#1E3A5F;line-height:1.7;}
</style></head><body>

<div class="np">
  <strong>🇮🇳 NagrikHaq Report — ${data.name} | ${today}</strong>
  <button class="pb2" onclick="window.print()">🖨️ Save as PDF / Print</button>
</div>

<div class="page">

<div class="cover">
  <div class="clogo">🇮🇳 Nagrik Haq</div>
  <div class="csub">Aapka Paisa, Aapka Haq · NagrikHaq.in</div>
  <div style="font-size:11px;color:rgba(255,255,255,0.4);margin-bottom:5px;">PERSONALIZED GOVERNMENT SCHEME ELIGIBILITY REPORT</div>
  <div class="cname">${data.name}</div>
  <div class="cmeta"><span>📍 ${data.state}</span><span>📱 +91 ${data.phone}</span><span>📅 ${today}</span></div>
</div>

<div class="bhero">
  <div class="blbl">Total Estimated Annual Benefits You Qualify For</div>
  <div class="bamt">${totalAmt}</div>
  <div class="bsub">${schemes.length} government schemes · 8-section complete action guide</div>
</div>

<div class="stoc">
  <h3>📑 Table of Contents</h3>
  ${["🚀 Section 1 — Priority Action List", "📋 Section 2 — Complete Application Guide (All Schemes)", "📂 Section 3 — Master Documents Checklist", "📜 Section 4 — Income Certificate — Full Guide", "🗺️ Section 5 — Find Your Nearest CSC Centre", "⚖️ Section 6 — Rejection Appeal Guide (6 Steps)", "📅 Section 7 — Annual Deadline Calendar", "🗓️ Section 8 — Your 30-Day Action Plan"].map((s, i) => `<div class="tocrow"><span class="tocnum">0${i + 1}</span><span>${s}</span></div>`).join("")}
</div>

<h2 class="sec pb">🚀 Section 1 — Priority Action List</h2>
<p style="color:#4B5563;font-size:13px;margin-bottom:12px;">Apply these HIGH PRIORITY schemes first — they give maximum benefit and are straightforward to apply for.</p>
${priList}

<h2 class="sec pb">📋 Section 2 — Complete Application Guide</h2>
<p style="color:#4B5563;font-size:13px;margin-bottom:16px;">Every scheme includes exact steps, required documents, official website, helpline, timeline and rejection prevention tips.</p>
${schemeCards}

<h2 class="sec pb">📂 Section 3 — Master Documents Checklist</h2>
<p style="color:#4B5563;font-size:13px;margin-bottom:8px;">Prepare these ONCE — they work across all your schemes. Tick each box when ready.</p>
<div class="docgrid">${docGrid}</div>
<div class="tipbox"><strong>💡 Pro Tip:</strong> Make 5 self-attested photocopies of each document. Write "Self Attested" + sign on every photocopy. This avoids multiple trips to offices. Store originals safely at home. Use DigiLocker app to keep digital copies.</div>

<h2 class="sec pb">📜 Section 4 — How to Get Income Certificate</h2>
<p style="color:#4B5563;font-size:13px;margin-bottom:12px;">Needed for almost every scheme. Most people are stuck here — here is the complete process.</p>
<div class="gstep"><div class="gnum">1</div><div class="gt"><strong>Visit Tehsil / Taluka office</strong> — Ask for "Aay Praman Patra" form. Available free at counter or on your state's e-district portal.</div></div>
<div class="gstep"><div class="gnum">2</div><div class="gt"><strong>Fill carefully:</strong> Write ALL income sources — farming, wages, rent, business. Write annual total. Use estimate if income is irregular.</div></div>
<div class="gstep"><div class="gnum">3</div><div class="gt"><strong>Patwari/Lekhpal verification:</strong> They may visit your home or accept a self-declaration affidavit on ₹10–20 stamp paper.</div></div>
<div class="gstep"><div class="gnum">4</div><div class="gt"><strong>Submit at Tehsil with:</strong> Aadhaar, ration card, land records (if farmer), salary slip (if salaried), self-declaration affidavit.</div></div>
<div class="gstep"><div class="gnum">5</div><div class="gt"><strong>Certificate in 7–15 working days.</strong> Valid 1–3 years. Now digitally available via DigiLocker in most states.</div></div>
<div class="gstep"><div class="gnum">6</div><div class="gt"><strong>Faster option — Apply online:</strong> State e-district portal (edistrict.up.gov.in / mahaonline.gov.in / serviceonline.gov.in). Certificate in 3–7 days sent to DigiLocker.</div></div>
<div class="gstep"><div class="gnum">7</div><div class="gt"><strong>Central Services Portal:</strong> serviceonline.gov.in also lists all state income certificate services in one place.</div></div>
<div class="warnbox"><strong>⚠️ Most schemes need income BELOW ₹1.5 lakh/year (rural) or ₹2 lakh/year (urban).</strong> Verify the exact limit for each scheme before applying. Certificate must reflect accurate income.</div>

<h2 class="sec pb">🗺️ Section 5 — Find Your Nearest CSC</h2>
<div class="cscinfo"><h3>What is a CSC and Why You Need It</h3><p>Common Service Centres are govt-authorised digital service centres in every Gram Panchayat and urban ward. Apply for nearly every scheme here even without home internet. Most services cost ₹0–50.</p></div>
<div class="cscgrid">
  <div class="cscbox"><h4>🔍 Find Online</h4><p>Visit: <strong>locator.csccloud.in</strong><br/>Enter district + state<br/>Get address + phone</p></div>
  <div class="cscbox"><h4>📞 Call Helpline</h4><p>CSC: <strong>1800-121-3468</strong><br/>Free, Mon–Sat 9am–6pm<br/>Will direct to nearest CSC</p></div>
  <div class="cscbox"><h4>🏘️ Ask Locally</h4><p>Gram Panchayat office<br/>School principal<br/>ASHA worker / Anganwadi</p></div>
</div>
<div class="tipbox" style="margin-top:12px;"><strong>CSC Services:</strong> Aadhaar update · PAN · Ayushman card · PM Kisan · Scholarships · Income/Caste/Domicile certificates · Driving licence · Birth certificate · Bank account · Railway tickets · Insurance</div>

<h2 class="sec pb">⚖️ Section 6 — Rejection Appeal Guide</h2>
<p style="color:#4B5563;font-size:13px;margin-bottom:10px;">Rejected? Don't give up. Most rejections can be overturned.</p>
<div class="astep"><strong>Step 1: Get Written Rejection Reason</strong><br/>Demand written rejection notice with reason. Verbal rejection is not legally valid.</div>
<div class="astep"><strong>Step 2: First Appeal — Block/Tehsil Level (within 30 days)</strong><br/>Written appeal with Block Development Officer (BDO) or Tehsildar. Attach rejection notice + corrected documents.</div>
<div class="astep"><strong>Step 3: District Level Grievance</strong><br/>File complaint at District Collector / DM's Grievance Cell. Keep copy of everything submitted.</div>
<div class="astep"><strong>Step 4: CPGRAMS Online Portal</strong><br/>File at <strong>pgportal.gov.in</strong> — national grievance portal. Response mandated within 30 days.</div>
<div class="astep"><strong>Step 5: Contact Local MLA / MP</strong><br/>Visit MLA or MP's local office. They can follow up on pending applications. This is your democratic right.</div>
<div class="astep"><strong>Step 6: RTI Application</strong><br/>File at <strong>rtionline.gov.in</strong> for ₹10. Ask why rejected and what criteria were used. Govt must reply within 30 days.</div>

<h2 class="sec pb">📅 Section 7 — Annual Deadline Calendar</h2>
<p style="color:#4B5563;font-size:13px;margin-bottom:10px;">Missing a deadline = losing a full year of benefits. Set these as phone reminders NOW.</p>
<div class="calgrid">${calendar}</div>

<h2 class="sec pb">🗓️ Section 8 — Your 30-Day Action Plan</h2>
<p style="color:#4B5563;font-size:13px;margin-bottom:12px;">One week at a time. Follow this plan and claim your first benefits within 30–45 days.</p>
<div class="wk"><h4>📌 Week 1 (Days 1–7): Prepare Documents</h4><ul>
  <li>Link Aadhaar to bank account (visit bank branch — takes 10 minutes)</li>
  <li>Apply for Income Certificate at Tehsil or state e-district portal</li>
  <li>Make 5 self-attested photocopies: Aadhaar, ration card, bank passbook, land records</li>
  <li>Check SECC-2011 list at secc.gov.in (needed for PMAY, Ayushman, MGNREGA)</li>
  <li>Find nearest CSC at locator.csccloud.in — save address and phone</li>
  <li>Download DigiLocker app. Link Aadhaar. Download available certificates</li>
</ul></div>
<div class="wk"><h4>📌 Week 2 (Days 8–14): Apply Top 2 Priority Schemes</h4><ul>
  <li>${schemes[0] ? `${schemes[0].emoji} ${schemes[0].name} — Visit: ${schemes[0].link || "CSC"}` : "Apply for top priority scheme at your nearest CSC"}</li>
  <li>${schemes[1] ? `${schemes[1].emoji} ${schemes[1].name} — Helpline: ${schemes[1].helpline || "1800-11-6446"}` : "Apply for second scheme at CSC"}</li>
  <li>Get Ayushman card made at CSC (15 min, free, covers ₹5 lakh health expenses)</li>
  <li>Do PM Kisan eKYC at pmkisan.gov.in → Farmers Corner (mandatory for payment)</li>
  <li>Enrol in JJBY (₹436/year, ₹2L life cover) and PMSBY (₹20/year, ₹2L accident cover) at bank</li>
</ul></div>
<div class="wk"><h4>📌 Week 3 (Days 15–21): Apply Remaining Schemes</h4><ul>
  ${schemes.slice(2, 6).map(s => `<li>${s.emoji || ""} ${s.name} — ${s.link || "visit CSC"}</li>`).join("")}
  <li>Visit Jan Aushadhi Kendra for regular medicines (save 50–90%)</li>
  <li>Register on PM Surya Ghar portal if you own house with suitable roof</li>
</ul></div>
<div class="wk"><h4>📌 Week 4 (Days 22–30): Follow Up + Protect Your Benefits</h4><ul>
  <li>Call helplines for pending applications (numbers in Section 2)</li>
  <li>Set annual calendar reminders from Section 7 in your phone today</li>
  <li>File CPGRAMS grievance if any application unprocessed after 30 days (pgportal.gov.in)</li>
  <li>Share this report on WhatsApp — your family members may also qualify</li>
  <li>Download UMANG app — access 1,200+ govt services on one app</li>
</ul></div>

<div class="ftop">
  <strong>NagrikHaq.in</strong> · Aapka Paisa, Aapka Haq<br/>
  Data sourced from: india.gov.in · myscheme.gov.in · pmjay.gov.in · pmkisan.gov.in<br/>
  For informational purposes only. NagrikHaq is not affiliated with the Government of India.<br/>
  Report for: <strong>${data.name}</strong> · +91 ${data.phone} · ${today}
  <div class="tc"><div style="flex:1;background:#FF9933;"></div><div style="flex:1;background:#fff;border:1px solid #ccc;"></div><div style="flex:1;background:#138808;"></div></div>
</div>

</div>
<script>setTimeout(()=>window.print(),700);</script>
</body></html>`;

  const win = window.open("", "_blank");
  if (!win) { alert("Please allow popups to download your PDF report."); return; }
  win.document.write(html);
  win.document.close();
}

// ══════════════════════════════════════════
//  TOOL PDF BUILDER
// ══════════════════════════════════════════
function buildToolPDF(type) {
  const today = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
  let title = "", sub = "", content = "";

  if (type === "rejection") {
    title = "🚫 Government Rejection Fix Kit";
    sub = "Avoid rejection in India's top 10 government scheme applications";
    const data = [
      { name: "PM Mudra Yojana", reasons: ["Business description too vague — banks need exact product/service, customer base, revenue projection.", "Wrong category — Shishu/Kishore/Tarun mismatch with loan amount.", "Poor credit history (CIBIL below 650) not disclosed upfront.", "Incomplete business address proof.", "No existing business proof for Kishore/Tarun category."], fix: "Write a 1-page business plan: (1) What you sell, (2) Who buys it, (3) How much revenue per month, (4) How you'll repay. Visit District Industries Centre (DIC) — they help free.", docs: ["Aadhaar", "PAN", "Business plan (1 page minimum)", "6 months bank statement", "Business address proof", "Shop registration if available"] },
      { name: "PM Awas Yojana", reasons: ["Bank account not linked to Aadhaar — DBT fails.", "Name mismatch in Aadhaar vs ration card.", "House already owned by family member — even in another city.", "SECC-2011 list name missing or misspelled.", "Land documents not in applicant's name."], fix: "Fix Aadhaar-bank linkage FIRST. Get name corrected in ration card at tehsil before applying. Check secc.gov.in for your name.", docs: ["Aadhaar (linked to bank)", "BPL ration card", "Land record in applicant's name", "Bank passbook", "Income certificate"] },
      { name: "Ayushman Bharat", reasons: ["Family not in SECC-2011 list.", "Aadhaar details don't match ration card.", "Family member already enrolled in conflicting insurance.", "Mobile not linked to Aadhaar."], fix: "Check pmjay.gov.in first. If not listed, contact your State Health Agency — most states have expanded lists beyond SECC.", docs: ["Aadhaar (Aadhaar-mobile linked)", "Ration card (any colour)", "Family ID if available"] },
      { name: "PM Kisan Samman Nidhi", reasons: ["Land in father's/spouse's name — must be in applicant's name.", "eKYC not done (most common reason for payment stop).", "Incorrect bank account or IFSC code entered.", "Farmer is government employee or income taxpayer (ineligible)."], fix: "Transfer land to your name first. Then register. Do eKYC immediately at pmkisan.gov.in → Farmers Corner → eKYC. Verify bank details at same portal.", docs: ["Aadhaar (mobile linked)", "Land record in applicant's name", "Bank passbook with correct IFSC"] },
      { name: "MGNREGA Job Card", reasons: ["Already in another household's job card.", "Documents incomplete at time of application.", "Name not in voter list / Aadhaar.", "Applied but not followed up — applications expire."], fix: "Check nrega.nic.in for your name before applying. Ensure all family members are listed in one household card only. Follow up weekly at Gram Panchayat.", docs: ["Aadhaar", "Ration card", "Bank passbook", "Passport photo"] },
      { name: "PM Ujjwala Yojana 2.0", reasons: ["Another family member already has an LPG connection.", "Not falling under BPL category.", "Address mentioned does not match the distributor coverage area.", "Aadhar mismatch between applicant and other family members."], fix: "Ensure no other connections exist in the household. Use a single BPL connection per household. Update Aadhaar details if they don't match the required address.", docs: ["Aadhaar", "BPL ration card", "Bank passbook", "Declaration of no existing connection"] },
      { name: "Sukanya Samridhi Yojana", reasons: ["Daughter is above 10 years of age.", "Attempting to open more than two accounts per family.", "Birth certificate lacking official validation."], fix: "Apply before the daughter turns 10. Only two accounts are allowed per family. Ensure the birth certificate is officially issued by the municipality.", docs: ["Daughter's birth certificate", "Parent Aadhaar", "Parent PAN", "Address proof"] },
      { name: "Atal Pension Yojana", reasons: ["Applicant is above 40 years of age.", "Income taxpayer status makes the applicant ineligible.", "Auto-debit failure due to low account balance."], fix: "Ensure enrollment before turning 40. Maintain a sufficient balance in your bank account for monthly auto-debits.", docs: ["Aadhaar", "Savings bank account", "Nominee details"] },
      { name: "PM Vishwakarma Yojana", reasons: ["Not falling under one of the 18 traditional crafts.", "Family member has already availed this scheme in the last 5 years.", "Lack of occupation proof or traditional craft background."], fix: "Ensure you fit into one of the specified 18 crafts. Provide valid proof of occupation from the local panchayat or urban body.", docs: ["Aadhaar", "Ration card", "Occupation proof/certification", "Bank passbook"] },
      { name: "PMEGP Loan", reasons: ["Project report lacking financial feasibility.", "Applicant is less than 18 years old.", "Applying for a trading business (only manufacturing and service allowed).", "Defaulted in previous bank loans (low CIBIL)."], fix: "Create a strong project report with clear financial projections. Ensure the business is manufacturing or service-based, not pure trading.", docs: ["Aadhaar", "PAN", "Detailed Project Report", "8th pass certificate (for loans above limits)", "Bank passbook"] }
    ];
    content = data.map((s, i) => `
      <div class="sblock">
        <div class="shead">
          <span class="snum" style="background:#DC2626">${i + 1}</span>
          <span class="stitle">${s.name}</span>
        </div>
        <div class="ibox" style="background:#FFF1F2;border:1px solid #FECDD3">
          <div style="font-weight:700;color:#9F1239;margin-bottom:6px">❌ Common Rejection Reasons:</div>
          <ul>` + s.reasons.map(r => `<li>${r}</li>`).join("") + `</ul>
        </div>
        <div class="ibox" style="background:#F0FFF4;border:1px solid #BBF7D0;margin-top:10px">
          <div style="font-weight:700;color:#166534;margin-bottom:6px">✅ How to Fix:</div>
          <p style="font-size:12px;margin:0">${s.fix}</p>
        </div>
        <div class="ibox" style="background:#F9FAFB;border:1px solid #E5E7EB;margin-top:10px">
          <div style="font-weight:700;color:#111827;margin-bottom:6px">📂 Correct Documents Needed:</div>
          <ul>` + s.docs.map(d => `<li>${d}</li>`).join("") + `</ul>
        </div>
      </div>
    `).join("");
  } else if (type === "hidden") {
    title = "🔓 25 Hidden Sarkari Benefits";
    sub = "Lesser-known government schemes most Indians never claim";
    content = `<div class="docgrid" style="grid-template-columns:1fr 1fr;">` + HIDDEN_SCHEMES.map(s => `
      <div class="sblock" style="margin-bottom:0">
        <div style="font-size:24px;margin-bottom:6px">${s.emoji}</div>
        <div style="font-weight:800;font-size:14px;color:#111827;margin-bottom:4px">${s.name}</div>
        <div style="color:#138808;font-weight:700;font-size:12px;margin-bottom:6px">${s.amount}</div>
        <p style="color:#4B5563;font-size:12px;margin:0">${s.desc}</p>
      </div>
    `).join("") + `</div>`;
  } else if (type === "student") {
    title = "🎓 Student Nagrik Haq Pack";
    sub = "₹10,000–₹2 lakh government support available for every Indian student";
    content = `
      <h3 style="margin:20px 0 10px;font-size:16px;color:#111827">📚 Scholarships & Financial Aid</h3>
      ` + STUDENT_SCHEMES.map((s, i) => `
        <div style="padding:12px 0;border-bottom:1px solid #E5E7EB">
          <div style="font-weight:700;font-size:14px;color:#111827">${i + 1}. ${s.name}</div>
          <div style="color:#138808;font-weight:700;font-size:12px;margin:4px 0">${s.amount}</div>
          <p style="color:#4B5563;font-size:12px;margin:0 0 6px">${s.desc}</p>
          <div style="font-size:11px;color:#1D4ED8">🔗 ${s.link}</div>
        </div>
      `).join("") + `
      <h3 style="margin:24px 0 10px;font-size:16px;color:#111827">📋 How Students Apply (Step by Step)</h3>
      ` + [["1", "Register on scholarships.gov.in", "Create account with Aadhaar. This is the official central govt scholarship portal covering 40+ scholarships."], ["2", "Apply before October 31 every year", "Most NSP scholarships close on October 31. Missing this = losing one full year. Set a phone alarm."], ["3", "Ensure bank account in YOUR name", "Scholarship money cannot be transferred to parent's account. Open your own account at any bank or post office."], ["4", "Get Income Certificate below ₹2.5 lakh", "Most scholarships need family income below ₹2.5 lakh/year. Visit tehsil or apply online on e-district portal."], ["5", "For PM Internship: Register at pminternship.mca.gov.in", "Age 21–24. Family income below ₹8 lakh. Apply to up to 5 companies. ₹5,000/month stipend."], ["6", "For Education Loan: Visit vidyalakshmi.co.in", "Apply to multiple banks simultaneously. Govt pays interest during study period for EWS students."]].map(([n, t, d]) => `
        <div style="padding:10px 0;border-bottom:1px solid #E5E7EB">
          <div style="font-weight:700;font-size:13px;color:#111827">${n}. ${t}</div>
          <div style="color:#4B5563;font-size:12px;margin-top:4px">${d}</div>
        </div>
      `).join("");
  } else if (type === "women") {
    title = "👩 Every Government Scheme for Women";
    sub = "Maternity rights, business loans, safety laws, equal pay & state schemes";
    content = `
      <h3 style="margin:20px 0 10px;font-size:16px;color:#DB2777">🤰 Maternity Benefit Act — Your Rights</h3>
      ` + [["26 weeks paid maternity leave", "For first 2 children. 12 weeks for 3rd child onwards. Applies to all companies with 10+ employees."],
      ["No termination during pregnancy", "Employer cannot fire you during pregnancy or maternity leave. This is illegal under the Act."],
      ["Work from home option", "After 26 weeks, you can negotiate work-from-home with employer. The Act allows this."],
      ["Crèche facility mandatory", "Companies with 50+ employees MUST provide a crèche. You can visit 4 times a day."],
      ["₹6,000 under PMMVY", "Pradhan Mantri Matru Vandana Yojana — ₹5,000 in 3 instalments + ₹1,000 via JSY for institutional delivery."]
      ].map(([t, d]) => `<div style="padding:10px 0;border-bottom:1px solid #E5E7EB"><div style="font-weight:700;font-size:13px">${t}</div><div style="color:#4B5563;font-size:12px;margin-top:3px">${d}</div></div>`).join("") + `
      <h3 style="margin:24px 0 10px;font-size:16px;color:#DB2777">💼 Women Entrepreneur Loans</h3>
      ` + [["Mudra Yojana (Mahila)", "Up to ₹10 lakh", "mudra.org.in"], ["StandUp India", "₹10L–₹1 Cr", "standupmitra.in"], ["Mahila Udyam Nidhi", "Up to ₹10 lakh", "sidbi.in"], ["Annapurna Scheme", "Up to ₹50,000", "sbi.co.in"], ["Stree Shakti Package", "0.5% concession", "sbi.co.in"], ["PM Vishwakarma (Women)", "₹1L–₹2L at 5%", "pmvishwakarma.gov.in"]
      ].map(([n, a, l]) => `<div style="padding:10px 0;border-bottom:1px solid #E5E7EB"><div style="font-weight:700;font-size:13px">${n} — <span style="color:#138808">${a}</span></div><div style="color:#1D4ED8;font-size:11px;margin-top:3px">🔗 ${l}</div></div>`).join("") + `
      <h3 style="margin:24px 0 10px;font-size:16px;color:#DB2777">🛡️ Safety & Workplace Rights</h3>
      ` + [["POSH Act", "Every company with 10+ employees MUST have ICC. File complaint within 3 months."], ["Equal Remuneration Act", "Equal pay for equal work — regardless of gender. File complaint at Labour Commissioner."], ["Domestic Violence Act", "Free legal aid + right to shared household. Apply at nearest police station or file online."], ["Women Helpline — 181", "24/7 all-India women helpline. Also available via 112 (emergency)."], ["One Stop Centre (Sakhi)", "Free shelter + legal aid + medical help + counselling. 700+ centres. Find at wcd.nic.in."]
      ].map(([t, d]) => `<div style="padding:10px 0;border-bottom:1px solid #E5E7EB"><div style="font-weight:700;font-size:13px">${t}</div><div style="color:#4B5563;font-size:12px;margin-top:3px">${d}</div></div>`).join("") + `
      <h3 style="margin:24px 0 10px;font-size:16px;color:#BE185D">🏛️ Major State Schemes (Cash Transfers)</h3>
      ` + [["Ladli Behna Yojana (MP)", "₹1,250/month given to women aged 21-60. Income must be below ₹2.5 lakh. Apply at panchayat."], ["Majhi Ladki Bahin Yojana (MH)", "₹1,500/month for women aged 21-65. Family income < ₹2.5 lakh. Apply via Nari Shakti Doot App."], ["Kanya Sumangala Yojana (UP)", "₹25,000 total granted in 6 phases from birth of girl child until her graduation."], ["Gruha Lakshmi Scheme (KA)", "₹2,000/month to the female head of the family with a BPL/Antyodaya card."], ["Kalaignar Magalir Urimai (TN)", "₹1,000/month basic income for women heads of families crossing eligibility criteria."]
      ].map(([t, d]) => `<div style="padding:10px 0;border-bottom:1px solid #E5E7EB"><div style="font-weight:700;font-size:13px;color:#9D174D">${t}</div><div style="color:#4B5563;font-size:12px;margin-top:3px">${d}</div></div>`).join("");
  } else if (type === "farmer") {
    title = "🌾 Every Government Benefit for Farmers";
    sub = "25+ central schemes, KCC guide, equipment subsidy & soil health advisory";
    content = `
      <h3 style="margin:20px 0 10px;font-size:16px;color:#15803D">💰 All Major Farmer Schemes</h3>
      ` + [["PM Kisan Samman Nidhi", "₹6,000/year", "155261"], ["PM Fasal Bima Yojana", "1.5-2% premium only", "14447"], ["Kisan Credit Card (KCC)", "Up to ₹3L at 4%", "1800-200-0104"], ["PM KUSUM Solar Pump", "60% subsidy", "1800-180-3333"], ["Soil Health Card", "Free testing", "1800-180-1551"], ["PM Krishi Sinchai Yojana", "55–90% subsidy", "1800-180-1551"], ["eNAM (National Agri Market)", "Better prices", "1800-270-0224"], ["Agri Infrastructure Fund", "₹2 Cr at 3%", "1800-11-1627"], ["Paramparagat Krishi Vikas Yojana", "₹50,000/ha subsidy", "1800-180-1551"], ["MGNREGA for Farmers", "100 days work", "1800-111-555"]
      ].map(([n, a, h]) => `<div style="padding:10px 0;border-bottom:1px solid #E5E7EB"><div style="font-weight:700;font-size:13px">${n} — <span style="color:#138808">${a}</span></div><div style="color:#15803D;font-size:11px;margin-top:3px">📞 ${h}</div></div>`).join("") + `
      <h3 style="margin:24px 0 10px;font-size:16px;color:#15803D">🧮 KCC Eligibility Quick Check</h3>
      ` + [["Own agricultural land?", "YES → You qualify. Even 0.5 acre is enough."], ["Tenant farmer?", "YES → Get NOC from landowner + lease agreement."], ["Fisherman/Animal husbandry?", "YES → KCC extended since 2019."], ["Bank refusing?", "File at bankingombudsman.rbi.org.in. RBI mandates 14-day issuance."]
      ].map(([q, a]) => `<div style="padding:8px 0;border-bottom:1px solid #E5E7EB"><div style="font-weight:700;font-size:13px">${q}</div><div style="color:#374151;font-size:12px;margin-top:2px">→ ${a}</div></div>`).join("") + `
      <h3 style="margin:24px 0 10px;font-size:16px;color:#15803D">🚜 Farm Equipment Subsidy Guide</h3>
      ` + [["Tractor (up to 40 HP)", "25–50% subsidy"], ["Rotavator / Power Tiller", "40–50% subsidy (SMAM)"], ["Solar Pump", "60% under PM KUSUM"], ["Drip/Sprinkler System", "55–90% subsidy (PMKSY)"], ["Thresher / Harvester", "25–40% subsidy"]
      ].map(([eq, s]) => `<div style="padding:8px 0;border-bottom:1px solid #E5E7EB"><div style="font-weight:700;font-size:13px">${eq} — <span style="color:#138808">${s}</span></div></div>`).join("");
  } else if (type === "bankfraud") {
    title = "🏦 Bank Fraud Recovery Guide";
    sub = "Money stolen? RBI says full refund within 3 days of reporting.";
    content = `
      <h3 style="margin:20px 0 10px;font-size:16px;color:#B91C1C">⚖️ RBI Refund Rules</h3>
      ` + [["Report within 3 days", "ZERO liability — bank MUST refund 100%. Strictly enforced under RBI circular dated July 6, 2017."], ["Report within 4–7 days", "Max liability ₹25,000. Bank refunds rest in 10 working days."], ["Report after 7 days", "Bank decides. File at Banking Ombudsman to fight."], ["Third-party fraud", "If bank's system failure (e.g data leak) — ZERO liability regardless of time."]
      ].map(([t, d]) => `<div style="padding:10px 0;border-bottom:1px solid #FEE2E2"><div style="font-weight:700;font-size:13px;color:#7F1D1D">${t}</div><div style="color:#374151;font-size:12px;margin-top:3px">${d}</div></div>`).join("") + `
      <h3 style="margin:24px 0 10px;font-size:16px;color:#B91C1C">⏱️ 72-Hour Action Checklist</h3>
      ` + [["Hour 0–1: Block everything instantly", "Call bank helpline → block card/UPI/net banking. Do not wait until morning."], ["Hour 1–2: Report formally", "Visit branch or email. Get WRITTEN complaint number. SMS is not enough."], ["Hour 2–4: File FIR", "cybercrime.gov.in or immediately call 1930. Get FIR copy."], ["Hour 4–6: Notify RBI", "Email cgm@rbi.org.in with your bank complaint number + Cyber Police FIR copy."], ["Day 2: Follow up", "Call bank, reference complaint number, ask for 10-day shadow reversal."], ["Day 3: Banking Ombudsman", "cms.rbi.org.in → File Complaint. Free. RBI Must respond in 30 days."], ["Day 7: Consumer court", "edaakhil.nic.in (e-filing). ₹0 fee for claims under ₹5 lakh."]
      ].map(([t, d], i) => `<div style="padding:10px 0;border-bottom:1px solid #E5E7EB"><div style="font-weight:700;font-size:13px">${i + 1}. ${t}</div><div style="color:#4B5563;font-size:12px;margin-top:3px">${d}</div></div>`).join("") + `
      <h3 style="margin:24px 0 10px;font-size:16px;color:#B91C1C">📝 Complaint Letter Template</h3>
      <div style="background:#F9FAFB;border:1px solid #E5E7EB;border-radius:8px;padding:16px;font-family:monospace;font-size:11px;line-height:1.8;white-space:pre-wrap">To,\nThe Branch Manager,\n[Bank Name], [Branch Name]\n\nSubject: Complaint of Unauthorized Transaction - Claim for Zero Liability\nRef: Account No. [XXXX], Date of Fraud: [DD/MM/YYYY]\n\nDear Sir/Madam,\n\nI hereby report an unauthorized transaction of ₹[Amount] from my account on [Date] at [Time]. I did NOT authorize this transaction, share my OTP, PIN, or CVV.\n\nAs per RBI Circular RBI/2017-18/15 dated 06/07/2017, I am reporting this within 3 working days and request ZERO liability and full refund of ₹[Amount] within 10 working days.\n\nCyber Police Ack/FIR Number: [If filed]\n\nYours faithfully,\n[Name], [Phone], [Date]</div>
      <h3 style="margin:24px 0 10px;font-size:16px;color:#B91C1C">🏛️ Consumer Court — If Bank Refuses</h3>
      ` + [["Fee: ₹0 for claims under ₹5 lakh", "File at edaakhil.nic.in or District Consumer Forum. No advocate needed."], ["Documents needed", "Bank complaint + 1930/Cyber FIR + bank statement + ID proof."], ["Precedent & Penalties", "Courts strictly enforce RBI rules. Order usually 3x compensation + ₹50,000 fine."], ["Free legal aid", "Income below ₹9 lakh: nalsa.gov.in. Call 15100."]
      ].map(([t, d]) => `<div style="padding:8px 0;border-bottom:1px solid #E5E7EB"><div style="font-weight:700;font-size:13px">${t}</div><div style="color:#374151;font-size:12px;margin-top:2px">${d}</div></div>`).join("");
  } else if (type === "senior") {
    title = "👴 Senior Citizen Rights Guide";
    sub = "Every benefit for 60+ — pensions, healthcare, tax savings, elder protection";
    content = `
      <h3 style="margin:20px 0 10px;font-size:16px;color:#9333EA">🏥 Free & Subsidised Healthcare</h3>
      ` + [["CGHS (Central Govt Health Scheme)", "Comprehensive health care for retired central govt employees & dependents. Cashless OPD."], ["Ayushman Bharat PM-JAY (Age 70+)", "Free treatment up to ₹5 Lakh/year. Now extended to ALL citizens aged 70+, regardless of income. Apply via Ayushman app for new card."], ["Geriatric OPDs", "Free dedicated specialist care at most govt district hospitals — skip the general queue."]
      ].map(([t, d]) => `<div style="padding:10px 0;border-bottom:1px solid #F3E8FF"><div style="font-weight:700;font-size:13px;color:#6B21A8">${t}</div><div style="color:#374151;font-size:12px;margin-top:3px">${d}</div></div>`).join("") + `
      <h3 style="margin:24px 0 10px;font-size:16px;color:#9333EA">💰 Pensions & Income Security</h3>
      ` + [["Indira Gandhi National Old Age Pension", "Central Govt gives ₹200-500/month for BPL seniors. States add massively (e.g., Delhi ₹2,500/m, AP ₹3,000/m)."], ["Reverse Mortgage Scheme", "Turn your house into monthly income without selling it. Live in it till death."], ["Higher FD Rates & SCSS", "Most banks give 0.5% extra. Post Office SCSS gives 8.2% max guaranteed return for up to ₹30 lakh."], ["LIC Pradhan Mantri Vaya Vandana Yojana", "Government subsidized pension offering guaranteed 7.4% return for 10 years."]
      ].map(([t, d]) => `<div style="padding:10px 0;border-bottom:1px solid #E5E7EB"><div style="font-weight:700;font-size:13px">${t}</div><div style="color:#4B5563;font-size:12px;margin-top:3px">${d}</div></div>`).join("") + `
      <h3 style="margin:24px 0 10px;font-size:16px;color:#9333EA">⚖️ Legal Protection & Rights</h3>
      ` + [["Maintenance & Welfare of Parents Act", "Children/heirs are LEGALLY bound to provide maintenance (up to ₹10K/m). Apply at Maintenance Tribunal absolutely NO lawyer needed. Order in 90 days."], ["Elderline — 14567", "National toll-free helpline (8 AM to 8 PM). Call for pension issues, legal guidance, or emergency rescue from abuse/abandonment."], ["Eviction of Abusive Children", "Seniors can evict abusive adult children from their self-acquired or ancestral property."], ["Property Transfer Reversal", "Under Sec 23, if children don't take care as promised, property transfer deed can be voided."]
      ].map(([t, d]) => `<div style="padding:10px 0;border-bottom:1px solid #E5E7EB"><div style="font-weight:700;font-size:13px">${t}</div><div style="color:#4B5563;font-size:12px;margin-top:3px">${d}</div></div>`).join("") + `
      <h3 style="margin:24px 0 10px;font-size:16px;color:#9333EA">🚆 Travel & Income Tax Relief</h3>
      ` + [["Income Tax Benefits", "Higher basic exemption limit (₹3L for 60+, ₹5L for 80+). ₹50K deduction for health insurance (Sec 80D). ₹50K standard deduction on interest income (Sec 80TTB). No advance tax."], ["Flight Discounts", "Air India, SpiceJet, IndiGo offer 6-8% discount on base fare for 60+ citizens. Select 'Senior Citizen' while booking."], ["Bus Concessions", "State transports (e.g., UP, MH, KA) offer 50-100% concession in state bus fares for seniors."]
      ].map(([t, d]) => `<div style="padding:8px 0;border-bottom:1px solid #E5E7EB"><div style="font-weight:700;font-size:13px">${t}</div><div style="color:#374151;font-size:12px;margin-top:2px">${d}</div></div>`).join("") + `
      <h3 style="margin:24px 0 10px;font-size:16px;color:#9333EA">📋 Important: The Nomination Guide</h3>
      ` + [["Bank Accounts", "Ensure every single account, locker, and FD has a registered nominee. Saves months of legal hassle."], ["Mutual Funds & Demat", "SEBI has made nomination mandatory. Add online or accounts will be frozen."], ["Property WILLs", "A registered WILL is the only legally watertight way to pass on real estate. Nominee is just a trustee."]
      ].map(([t, d]) => `<div style="padding:8px 0;border-bottom:1px solid #E5E7EB"><div style="font-weight:700;font-size:13px">${t}</div><div style="color:#374151;font-size:12px;margin-top:2px">${d}</div></div>`).join("");
  }

  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"/>
<title>NagrikHaq — ${title}</title>
<style>
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:Arial,sans-serif;color:#111827;font-size:13px;line-height:1.6;background:#fff;}
@media print{.np{display:none!important;}.pb{page-break-before:always;}body{font-size:11.5px;}}
.np{background:#FF6B00;color:#fff;padding:12px 24px;display:flex;justify-content:space-between;align-items:center;}
.pb2{background:#fff;color:#FF6B00;border:none;padding:9px 22px;border-radius:7px;font-weight:800;cursor:pointer;font-size:14px;}
.page{max-width:800px;margin:0 auto;padding:30px 24px;}
.cover{background:#0A1628;border-radius:12px;padding:32px;text-align:center;margin-bottom:30px;color:#fff;}
.sblock{border:1px solid #D1D5DB;border-radius:10px;padding:18px;margin-bottom:16px;page-break-inside:avoid;}
.shead{display:flex;align-items:center;gap:7px;margin-bottom:12px;}
.snum{width:24px;height:24px;border-radius:50%;color:#fff;font-weight:900;font-size:11px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.stitle{font-weight:800;font-size:15px;color:#111827;flex:1;}
.ibox{border-radius:7px;padding:12px;margin-top:10px;}
.docgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:16px;}
ul{padding-left:18px;}
li{font-size:12px;color:#374151;line-height:1.75;}
</style></head><body>

<div class="np">
  <strong>🇮🇳 ${title} | ${today}</strong>
  <button class="pb2" onclick="window.print()">🖨️ Save as PDF / Print</button>
</div>

<div class="page">
  <div class="cover">
    <h1 style="font-size:24px;font-weight:900;color:#fff;margin-bottom:8px">${title}</h1>
    <p style="font-size:14px;color:rgba(255,255,255,0.7)">${sub}</p>
  </div>
  ${content}
</div>

<script>setTimeout(()=>window.print(),700);</script>
</body></html>`;

  const win = window.open("", "_blank");
  if (!win) { alert("Please allow popups to download your PDF."); return; }
  win.document.write(html);
  win.document.close();
}

// ══════════════════════════════════════════
//  MAIN APP
// ══════════════════════════════════════════
export default function NagrikHaq() {
  const [page, setPage] = useState("home");
  const [tool, setTool] = useState(null); // "sarkari"|"rejection"|"hidden"|"student"
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: "", phone: "", state: "", income: "", area: "rural", family: "", daughter: "", gender: "", occupation: "", land: "", house: "", cb1: false, cb2: false, cb3: false, cb4: false, cb5: false });
  const [report, setReport] = useState(null);
  const [toast, setToast] = useState("");
  const [pendingTool, setPendingTool] = useState(null);
  const [upiModal, setUpiModal] = useState({ show: false, amount: 0, label: "", callback: null });

  const showT = m => { setToast(m); setTimeout(() => setToast(""), 3500); };
  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const getSchemes = () => ALL_SCHEMES.filter(s => { try { return s.cond(form); } catch { return false; } });
  const calcTotal = ss => { let t = 0; ss.forEach(s => { const n = parseInt((s.amount || "").replace(/[^0-9]/g, "")); if (n) t += n; }); return t > 0 ? "₹" + t.toLocaleString("en-IN") + "+" : "₹1,24,000+"; };

  // ── called after Razorpay success ──
  const handlePay = (toolType) => {
    const ss = getSchemes();
    const el = ss.length > 0 ? ss : ALL_SCHEMES.slice(0, 10);
    const r = { data: form, schemes: el, total: calcTotal(el) };
    setReport(r);
    const activeTool = toolType || pendingTool;
    if (activeTool) { setTool(activeTool); setPendingTool(null); setPage("tool"); }
    else { setPage("report"); }
    showT("✅ Payment confirmed! Your guide is ready!");
  };

  // ── open UPI checkout modal ──
  const openUPI = (label, onSuccess) => {
    const amount = (label === "Nagrik Haq Report" || label === "Bank Fraud Recovery Guide") ? 99 : 49;
    setUpiModal({ show: true, amount, label, callback: onSuccess });
  };

  const handleUPISuccess = () => {
    if (upiModal.callback) upiModal.callback({ razorpay_payment_id: "upi_" + Date.now() });
    setUpiModal({ show: false, amount: 0, label: "", callback: null });
  };

  const handleUPICancel = () => {
    setUpiModal({ show: false, amount: 0, label: "", callback: null });
    setPendingTool(null);
  };

  const openTool = (t) => {
    setPendingTool(t);
    const labels = { rejection: "Rejection Fix Kit", hidden: "Hidden Benefits List", student: "Student Pack", women: "Women Schemes Guide", farmer: "Farmer Benefits Guide", bankfraud: "Bank Fraud Recovery Guide", senior: "Senior Citizen Rights Guide" };
    openUPI(labels[t] || t, () => handlePay(t));
  };

  const S = { s: "#FF6B00", g: "#138808", n: "#0A1628" };

  const renderUPIModal = () => {
    if (!upiModal.show) return null;
    const upiID = "aniketsharma224124-1@oksbi";
    const upiLink = `upi://pay?pa=${upiID}&pn=NagrikHaq&tr=${Date.now()}&am=${upiModal.amount}&cu=INR&tn=${encodeURIComponent(upiModal.label)}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiLink)}`;

    return (
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.85)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div style={{ background: "#fff", borderRadius: 20, width: "100%", maxWidth: 400, overflow: "hidden", position: "relative" }}>

          {/* Header */}
          <div style={{ background: "#F9FAFB", padding: "18px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #E5E7EB" }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: 16, color: "#111827" }}>Secure UPI Payment</div>
              <div style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>{upiModal.label}</div>
            </div>
            <button onClick={handleUPICancel} style={{ background: "none", border: "none", fontSize: 24, color: "#9CA3AF", cursor: "pointer", lineHeight: 1 }}>&times;</button>
          </div>

          <div style={{ padding: 24, textAlign: "center" }}>
            <div style={{ fontWeight: 900, fontSize: 36, color: "#111827", marginBottom: 20 }}>₹{upiModal.amount}</div>

            {/* Mobile Action */}
            <a href={upiLink} style={{ display: "block", textDecoration: "none", background: "linear-gradient(135deg, #10B981, #059669)", color: "#fff", padding: "14px", borderRadius: 12, fontWeight: 800, fontSize: 16, marginBottom: 24, boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)" }}>
              📲 Pay via GPay / PhonePe
            </a>

            <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "20px 0" }}>
              <div style={{ height: 1, background: "#E5E7EB", flex: 1 }}></div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase" }}>OR SCAN QR CODE</div>
              <div style={{ height: 1, background: "#E5E7EB", flex: 1 }}></div>
            </div>

            {/* Desktop / Manual Action */}
            <div style={{ background: "#F3F4F6", padding: 16, borderRadius: 16, display: "inline-block", marginBottom: 16, border: "1px solid #E5E7EB" }}>
              <img src={qrUrl} alt="UPI QR Code" style={{ width: 180, height: 180, borderRadius: 8, display: "block" }} />
            </div>

            <div style={{ background: "#FEF3C7", border: "1px solid #FDE68A", borderRadius: 10, padding: 12, marginBottom: 20 }}>
              <div style={{ fontSize: 12, color: "#B45309", fontWeight: 700 }}>Scan from any UPI App to pay</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#92400E", marginTop: 4, letterSpacing: 0.5 }}>{upiID}</div>
            </div>

            {/* Frictionless Trust Button */}
            <button onClick={handleUPISuccess} style={{ width: "100%", background: "#4F46E5", color: "#fff", border: "none", padding: "16px", borderRadius: 12, fontWeight: 800, fontSize: 16, cursor: "pointer", boxShadow: "0 4px 12px rgba(79, 70, 229, 0.3)" }}>
              ✅ I Have Successfully Paid
            </button>
            <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 12 }}>Unlocks instantly upon confirmation.</div>

          </div>
        </div>
      </div>
    );
  };

  // ── HOME ──
  if (page === "home") return (
    <div style={{ fontFamily: "Arial,sans-serif", background: "#FAFAF8", minHeight: "100vh", color: S.n }}>
      {renderUPIModal()}
      {/* NAV */}
      <div style={{ position: "sticky", top: 0, zIndex: 99, background: "rgba(255,255,255,.97)", borderBottom: `3px solid ${S.s}`, padding: "10px 18px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <span style={{ fontSize: 22 }}>🇮🇳</span>
          <div><div style={{ fontWeight: 900, fontSize: 17, color: S.s, lineHeight: 1.1 }}>NagrikHaq.in</div><div style={{ fontSize: 10, color: S.g, fontWeight: 600 }}>आपका पैसा, आपका हक</div></div>
        </div>
        <button onClick={() => setPage("form")} style={{ background: S.s, color: "#fff", border: "none", padding: "9px 18px", borderRadius: 8, fontWeight: 800, fontSize: 13, cursor: "pointer" }}>₹99 में जानें →</button>
      </div>

      {/* HERO */}
      <div style={{ background: `linear-gradient(135deg,${S.n},#142238)`, padding: "60px 18px 50px", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(255,107,0,.15)", border: "1px solid rgba(255,107,0,.4)", color: "#FF8C38", padding: "5px 14px", borderRadius: 100, fontSize: 12, fontWeight: 600, marginBottom: 20 }}>🇮🇳 India's #1 Personalized Government Scheme Finder</div>
        <h1 style={{ fontSize: "clamp(26px,5vw,50px)", fontWeight: 900, color: "#fff", lineHeight: 1.15, marginBottom: 12 }}>
          आपके <span style={{ color: S.s }}>सरकारी हक</span> जो<br />आप छोड़ रहे हैं
        </h1>
        <p style={{ color: "rgba(255,255,255,.65)", fontSize: "clamp(13px,2vw,16px)", maxWidth: 540, margin: "0 auto 26px", lineHeight: 1.7 }}>
          India has 1,000+ government schemes worth lakhs per family. 95% of people never claim them. Find what you're missing — with complete application guide.
        </p>
        <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.15)", borderRadius: 14, padding: "16px 32px", marginBottom: 24 }}>
          <span style={{ color: "rgba(255,255,255,.4)", textDecoration: "line-through", fontSize: 14 }}>CA charges ₹2,000+</span>
          <span style={{ fontWeight: 900, fontSize: 48, color: S.s, lineHeight: 1.1 }}>₹99</span>
          <span style={{ color: "rgba(255,255,255,.55)", fontSize: 12 }}>20-Page Complete Guide · Instant Delivery</span>
        </div><br />
        <button onClick={() => setPage("form")} style={{ background: `linear-gradient(135deg,${S.s},#FF8C38)`, color: "#fff", border: "none", padding: "15px 40px", borderRadius: 12, fontWeight: 900, fontSize: 18, cursor: "pointer", boxShadow: "0 8px 28px rgba(255,107,0,.4)" }}>🔍 अभी Check करें — ₹99</button>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center", marginTop: 20 }}>
          {["✅ 60+ Schemes Covered", "✅ Step-by-Step Apply Guide", "✅ Documents Checklist", "✅ 30-Day Action Plan"].map(t => <span key={t} style={{ color: "rgba(255,255,255,.5)", fontSize: 12 }}>{t}</span>)}
        </div>
      </div>

      {/* STATS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))", background: S.s }}>
        {[["60+", "Schemes"], ["8", "Sections"], ["20+", "Pages"], ["8", "Tools"]].map(([n, l]) => (
          <div key={l} style={{ padding: "16px 8px", color: "#fff", textAlign: "center", borderRight: "1px solid rgba(255,255,255,.2)" }}>
            <div style={{ fontWeight: 900, fontSize: 22 }}>{n}</div>
            <div style={{ fontSize: 11, opacity: .85, marginTop: 2 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* 7 TOOLS */}
      <div style={{ padding: "60px 18px", background: "#fff" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", textAlign: "center" }}>
          <div style={{ display: "inline-block", background: "#FFF3E8", color: S.s, padding: "4px 14px", borderRadius: 100, fontSize: 12, fontWeight: 600, marginBottom: 12 }}>🛠️ 8 Powerful Tools</div>
          <h2 style={{ fontSize: "clamp(20px,4vw,34px)", fontWeight: 900, marginBottom: 8 }}>Everything You Need to <span style={{ color: S.s }}>Claim Your Rights</span></h2>
          <p style={{ color: "#6B7280", fontSize: 14, marginBottom: 36 }}>One platform. Eight tools. Complete government benefits solution.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 18 }}>
            {[
              { ic: "🏛️", title: "Nagrik Haq Report", sub: "₹99", desc: "Personalised report of ALL govt schemes you qualify for. 60+ schemes checked against your profile.", tag: "MOST POPULAR", col: S.s, action: () => setPage("form") },
              { ic: "🚫", title: "Rejection Fix Kit", sub: "₹49", desc: "Avoid rejection in top 10 govt scheme applications. Exact rejection reasons + fix guide for each.", tag: "NEW", col: "#DC2626", action: () => openTool("rejection") },
              { ic: "🔓", title: "Hidden Benefits List", sub: "₹49", desc: "25 lesser-known govt schemes most Indians never claim — with complete eligibility + apply guide.", tag: "TRENDING", col: "#7C3AED", action: () => openTool("hidden") },
              { ic: "🎓", title: "Student Sarkari Pack", sub: "₹49", desc: "Complete scholarship, skill, internship and education loan guide for students and parents.", tag: "FOR STUDENTS", col: "#0369A1", action: () => openTool("student") },
              { ic: "👩", title: "Women Schemes Guide", sub: "₹49", desc: "Every government scheme for women — maternity rights, entrepreneur loans, safety laws, equal pay & state schemes.", tag: "FOR WOMEN", col: "#DB2777", action: () => openTool("women") },
              { ic: "🌾", title: "Farmer Benefits Guide", sub: "₹49", desc: "All 25+ central farmer schemes — KCC calculator, equipment subsidies, soil health, crop insurance & more.", tag: "FOR FARMERS", col: "#15803D", action: () => openTool("farmer") },
              { ic: "🏦", title: "Bank Fraud Recovery", sub: "₹99", desc: "Money stolen from your account? 72-hour action plan, RBI refund rules, complaint letters & consumer court guide.", tag: "URGENT", col: "#B91C1C", action: () => openTool("bankfraud") },
              { ic: "👴", title: "Senior Citizen Rights", sub: "₹49", desc: "Every benefit for 60+ — pensions, free healthcare, tax savings, travel discounts, elder protection & monthly income.", tag: "FOR SENIORS", col: "#9333EA", action: () => openTool("senior") },
            ].map(t => (
              <div key={t.title} style={{ background: "#FAFAF8", border: `1px solid #E5E7EB`, borderRadius: 16, padding: 22, textAlign: "left", position: "relative", overflow: "hidden", transition: "transform .2s", cursor: "pointer" }} onClick={t.action}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg,${t.col},${t.col}88)` }} />
                <div style={{ display: "inline-block", background: t.col + "22", color: t.col, fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 100, marginBottom: 12 }}>{t.tag}</div>
                <div style={{ fontSize: 32, marginBottom: 10 }}>{t.ic}</div>
                <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 4, color: S.n }}>{t.title}</div>
                <div style={{ fontSize: 20, fontWeight: 900, color: t.col, marginBottom: 8 }}>{t.sub}</div>
                <p style={{ color: "#6B7280", fontSize: 13, lineHeight: 1.5, marginBottom: 16 }}>{t.desc}</p>
                <div style={{ background: t.col, color: "#fff", border: "none", padding: "10px 18px", borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: "pointer", display: "inline-block" }}>Get This →</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SCHEME PREVIEW */}
      <div style={{ padding: "56px 18px", background: "#FAFAF8" }}>
        <div style={{ maxWidth: 980, margin: "0 auto" }}>
          <div style={{ display: "inline-block", background: "#FFF3E8", color: S.s, padding: "4px 14px", borderRadius: 100, fontSize: 12, fontWeight: 600, marginBottom: 12 }}>🏛️ Schemes Preview</div>
          <h2 style={{ fontSize: "clamp(20px,4vw,34px)", fontWeight: 900, marginBottom: 8 }}>60+ <span style={{ color: S.s }}>Schemes</span> We Check For You</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 14, marginTop: 28 }}>
            {ALL_SCHEMES.slice(0, 12).map((s, i) => (
              <div key={i} style={{ background: "#fff", borderRadius: 12, padding: 16, border: "1px solid #E5E7EB", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,${S.s},#FF8C38)` }} />
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 24 }}>{s.emoji}</span>
                  <span style={{ background: "#FFF3E8", color: S.s, fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 4, whiteSpace: "nowrap" }}>{s.cat}</span>
                </div>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, color: S.n }}>{s.name}</div>
                <div style={{ color: S.g, fontWeight: 700, fontSize: 13, marginBottom: 6 }}>{s.amount}</div>
                <p style={{ color: "#6B7280", fontSize: 12, lineHeight: 1.5 }}>{s.desc}</p>
                {i >= 8 && <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 50, background: "linear-gradient(to bottom,transparent,rgba(250,250,248,.98))", display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 8 }}><span style={{ fontSize: 11, color: "#9CA3AF" }}>🔒 Unlock with ₹99 report</span></div>}
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 28 }}>
            <p style={{ color: "#9CA3AF", fontSize: 13, marginBottom: 14 }}>+ {ALL_SCHEMES.length - 12} more schemes checked based on your profile</p>
            <button onClick={() => setPage("form")} style={{ background: `linear-gradient(135deg,${S.s},#FF8C38)`, color: "#fff", border: "none", padding: "14px 36px", borderRadius: 12, fontWeight: 900, fontSize: 16, cursor: "pointer" }}>Check My Eligibility →</button>
          </div>
        </div>
      </div>

      {/* TESTIMONIALS */}
      <div style={{ background: S.n, padding: "56px 18px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(20px,4vw,32px)", fontWeight: 900, color: "#fff", marginBottom: 28 }}>लोग क्या कह रहे हैं</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 18 }}>
            {[{ i: "R", n: "Ramesh Yadav", l: "Lucknow, UP", s: "Applied PMAY — ₹1.2L coming", t: "Step-by-step guide tha report mein. PMAY ke liye akele apply kar liya. 1.2 lakh subsidy aa raha hai!" },
            { i: "P", n: "Priya Sharma", l: "Jaipur, Rajasthan", s: "Income cert guide saved weeks", t: "Income certificate kaise milta hai — Section 4 mein sab tha. SSY aur scholarship dono ho gayi." },
            { i: "M", n: "Mahesh Patel", l: "Nashik, Maharashtra", s: "4 schemes done in 30 days", t: "30-day plan follow kiya. KCC, PM Kisan, Fasal Bima — teeno 3 hafte mein. Bahut helpful." }].map(t => (
              <div key={t.n} style={{ background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 14, padding: 22, textAlign: "left" }}>
                <div style={{ color: "#D4A017", fontSize: 15, marginBottom: 10 }}>★★★★★</div>
                <p style={{ color: "rgba(255,255,255,.85)", fontSize: 13, lineHeight: 1.7, marginBottom: 14 }}>"{t.t}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 38, height: 38, borderRadius: "50%", background: `linear-gradient(135deg,${S.s},${S.g})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 15 }}>{t.i}</div>
                  <div><div style={{ color: "#fff", fontWeight: 600, fontSize: 13 }}>{t.n}</div><div style={{ color: "rgba(255,255,255,.4)", fontSize: 11 }}>{t.l}</div><div style={{ background: "rgba(19,136,8,.2)", color: "#4ade80", padding: "2px 7px", borderRadius: 4, fontSize: 10, fontWeight: 600, marginTop: 4, display: "inline-block" }}>{t.s}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <FAQC />

      {/* FOOTER */}
      <div style={{ background: S.n, padding: "26px 18px", textAlign: "center" }}>
        <div style={{ fontWeight: 900, fontSize: 18, color: S.s, marginBottom: 4 }}>🇮🇳 NagrikHaq.in</div>
        <div style={{ color: "rgba(255,255,255,.9)", fontSize: 13, marginBottom: 4 }}>📞 9882025498 | ✉️ aniketsharma224124@gmail.com</div>
        <div style={{ color: "rgba(255,255,255,.25)", fontSize: 10, maxWidth: 500, margin: "0 auto", lineHeight: 1.6 }}>Not affiliated with Govt of India. All data from official portals. For informational purposes only.</div>
        <div style={{ display: "flex", height: 3, width: 80, margin: "12px auto 0" }}><div style={{ flex: 1, background: "#FF9933" }} /><div style={{ flex: 1, background: "#fff" }} /><div style={{ flex: 1, background: "#138808" }} /></div>
      </div>

      <button onClick={() => setPage("form")} style={{ position: "fixed", bottom: 18, right: 18, zIndex: 99, background: `linear-gradient(135deg,${S.s},#FF8C38)`, color: "#fff", border: "none", padding: "12px 20px", borderRadius: 100, fontWeight: 800, fontSize: 13, cursor: "pointer", boxShadow: "0 8px 24px rgba(255,107,0,.4)" }}>🔍 Check My Schemes — ₹99</button>
    </div>
  );

  // ── FORM ──
  if (page === "form") return (
    <div style={{ fontFamily: "Arial,sans-serif", background: "#FAFAF8", minHeight: "100vh", padding: "18px 14px", display: "flex", flexDirection: "column", alignItems: "center" }}>
      {renderUPIModal()}
      <button onClick={() => setPage("home")} style={{ alignSelf: "flex-start", background: "none", border: "none", color: S.s, fontWeight: 700, fontSize: 14, cursor: "pointer", marginBottom: 14 }}>← Back</button>
      <div style={{ width: "100%", maxWidth: 580, background: "#fff", borderRadius: 20, boxShadow: "0 16px 50px rgba(0,0,0,.08)", overflow: "hidden", border: "1px solid #E5E7EB" }}>
        <div style={{ background: `linear-gradient(135deg,${S.n},#142238)`, padding: "24px 26px", textAlign: "center" }}>
          <h2 style={{ fontWeight: 900, fontSize: 20, color: "#fff", marginBottom: 5 }}>🇮🇳 सरकारी हक — Eligibility Form</h2>
          <p style={{ color: "rgba(255,255,255,.6)", fontSize: 12 }}>12 questions → Personalised 60+ scheme check</p>
        </div>
        <div style={{ height: 5, background: "rgba(0,0,0,.06)" }}><div style={{ height: "100%", background: S.s, width: `${(step / 5) * 100}%`, transition: "width .4s" }} /></div>
        <div style={{ padding: "24px 24px 28px" }}>
          <div style={{ display: "flex", justifyContent: "center", gap: 9, marginBottom: 22 }}>
            {[1, 2, 3, 4, 5].map(i => <div key={i} style={{ width: 9, height: 9, borderRadius: "50%", background: i < step ? S.g : i === step ? S.s : "#E5E7EB", transform: i === step ? "scale(1.4)" : "scale(1)", transition: "all .3s" }} />)}
          </div>

          {step === 1 && <SB t="👤 Basic Info" s="Step 1 of 5">
            <FL l="Full Name"><input style={INP} value={form.name} onChange={e => upd("name", e.target.value)} placeholder="Ramesh Kumar" /></FL>
            <FL l="WhatsApp Number"><input style={INP} type="tel" maxLength={10} value={form.phone} onChange={e => upd("phone", e.target.value.replace(/\D/, ""))} placeholder="10 digit mobile" /></FL>
            <FL l="State"><select style={INP} value={form.state} onChange={e => upd("state", e.target.value)}><option value="">Select state</option>{STATES.map(s => <option key={s}>{s}</option>)}</select></FL>
            <FL l="You live in:"><RG val={form.area} onChange={v => upd("area", v)} opts={[["rural", "🏡 Rural / Village"], ["urban", "🏙️ Urban / City"]]} /></FL>
            <BR nxt={() => { if (!form.name.trim() || form.phone.length < 10 || !form.state) { alert("Fill all fields correctly"); return; } setStep(2); }} />
          </SB>}

          {step === 2 && <SB t="👨‍👩‍👧 Family Details" s="Step 2 of 5">
            <FL l="Annual Family Income"><select style={INP} value={form.income} onChange={e => upd("income", e.target.value)}><option value="">Select income</option><option value="bpl">Below ₹1 Lakh (BPL)</option><option value="low">₹1–3 Lakh</option><option value="mid">₹3–6 Lakh</option><option value="upper">₹6–10 Lakh</option><option value="high">Above ₹10 Lakh</option></select></FL>
            <FL l="Family Size"><select style={INP} value={form.family} onChange={e => upd("family", e.target.value)}><option value="">Select</option><option value="1">1–2</option><option value="3">3–4</option><option value="5">5–6</option><option value="7">7+</option></select></FL>
            <FL l="Gender"><RG val={form.gender} onChange={v => upd("gender", v)} opts={[["male", "👨 Male"], ["female", "👩 Female"]]} /></FL>
            <FL l="Daughters under 18?"><RG val={form.daughter} onChange={v => upd("daughter", v)} opts={[["yes", "✅ Yes"], ["no", "❌ No"]]} /></FL>
            <BR bk={() => setStep(1)} nxt={() => { if (!form.income) { alert("Select income"); return; } setStep(3); }} />
          </SB>}

          {step === 3 && <SB t="💼 Work & Land" s="Step 3 of 5">
            <FL l="Occupation"><select style={INP} value={form.occupation} onChange={e => upd("occupation", e.target.value)}><option value="">Select</option><option value="farmer">Farmer / किसान</option><option value="laborer">Daily Wage / मज़दूर</option><option value="govt">Govt Employee</option><option value="private">Private Job</option><option value="business">Business</option><option value="selfemployed">Self Employed</option><option value="unemployed">Unemployed</option><option value="homemaker">Homemaker</option></select></FL>
            <FL l="Own agricultural land?"><RG val={form.land} onChange={v => upd("land", v)} opts={[["yes", "✅ Yes"], ["no", "❌ No"]]} /></FL>
            <FL l="Own a house?"><RG val={form.house} onChange={v => upd("house", v)} opts={[["yes", "✅ Yes"], ["no", "❌ No"]]} /></FL>
            <BR bk={() => setStep(2)} nxt={() => setStep(4)} />
          </SB>}

          {step === 4 && <SB t="🏥 Additional" s="Step 4 of 5">
            <FL l="Select all that apply to your family:">
              <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                {[["cb1", "👵 Senior citizen (60+)"], ["cb2", "♿ Person with disability"], ["cb3", "🎖️ Widow / Single woman head"], ["cb4", "📚 Students (school / college)"], ["cb5", "🏭 SC / ST / OBC category"]].map(([k, l]) => (
                  <div key={k} onClick={() => upd(k, !form[k])} style={{ border: `2px solid ${form[k] ? S.s : "#E5E7EB"}`, borderRadius: 9, padding: "11px 13px", cursor: "pointer", display: "flex", alignItems: "center", gap: 11, background: form[k] ? "#FFF3E8" : "#fff", transition: "all .2s" }}>
                    <div style={{ width: 19, height: 19, borderRadius: 4, border: `2px solid ${form[k] ? S.s : "#D1D5DB"}`, background: form[k] ? S.s : "#fff", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 11, flexShrink: 0 }}>{form[k] ? "✓" : ""}</div>
                    <span style={{ fontSize: 13, fontWeight: 500, color: "#111827" }}>{l}</span>
                  </div>
                ))}
              </div>
            </FL>
            <BR bk={() => setStep(3)} nxt={() => setStep(5)} nl="Check Eligibility →" />
          </SB>}

          {step === 5 && <SB t="💳 Pay ₹99 or ₹49 & Get Guide" s="Step 5 of 5">
            <div style={{ background: "#FFF3E8", border: "1px solid rgba(255,107,0,.2)", borderRadius: 12, padding: 16, marginBottom: 16 }}>
              {[["🏛️ Nagrik Haq Report (60+ schemes)", "Personalised"], ["📋 Step-by-Step Application Guide", "Per scheme"], ["📂 Master Documents Checklist", "All schemes"], ["📜 Income Certificate Guide", "Full process"], ["🗺️ CSC Locator Guide", "Your area"], ["⚖️ Rejection Appeal Guide", "6 steps"], ["📅 Annual Deadline Calendar", "Reminders"], ["🗓️ 30-Day Action Plan", "Week-by-week"], ["──────", "──────"], ["Total", pendingTool ? "₹49" : "₹99"]].map(([l, v]) => (
                <div key={l} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6, borderTop: l === "──────" ? "1px solid rgba(255,107,0,.15)" : undefined, paddingTop: l === "──────" ? 7 : 0 }}>
                  <span style={{ color: l === "──────" ? "transparent" : undefined, fontWeight: l === "Total" ? "800" : "400" }}>{l}</span>
                  <span style={{ fontWeight: 700, color: v === "₹99" ? S.s : S.g, fontSize: l === "Total" ? 15 : 13 }}>{v}</span>
                </div>
              ))}
            </div>
            <button onClick={() => openRazorpay(pendingTool ? (pendingTool === "rejection" ? "Rejection Fix Kit" : pendingTool === "hidden" ? "Hidden Benefits List" : "Student Pack") : "Nagrik Haq Report", () => handlePay())} style={{ width: "100%", padding: 15, border: "none", borderRadius: 11, background: `linear-gradient(135deg,${S.g},#1aa810)`, color: "#fff", fontWeight: 900, fontSize: 16, cursor: "pointer", boxShadow: "0 5px 18px rgba(19,136,8,.3)" }}>
              🔒 Pay {pendingTool ? "₹49" : "₹99"} via Razorpay — Secure & Instant
            </button>
            <p style={{ textAlign: "center", marginTop: 9, fontSize: 11, color: "#9CA3AF" }}>🔐 UPI · Card · Net Banking · Wallet · EMI</p>
            <BR bk={() => setStep(4)} />
          </SB>}
        </div>
      </div>
      {toast && <Tst msg={toast} />}
    </div>
  );

  // ── REPORT ──
  if (page === "report" && report) return (
    <div style={{ fontFamily: "Arial,sans-serif", background: "#FAFAF8", minHeight: "100vh", padding: "22px 14px" }}>
      {renderUPIModal()}
      <div style={{ maxWidth: 620, margin: "0 auto", textAlign: "center" }}>
        <div style={{ fontSize: 58, marginBottom: 12 }}>🎉</div>
        <h2 style={{ fontWeight: 900, fontSize: 24, color: S.g, marginBottom: 7 }}>Payment Done! Your Report is Ready!</h2>
        <p style={{ color: "#6B7280", fontSize: 14, marginBottom: 26 }}>Your personalised 25-page NagrikHaq guide is ready.</p>
        <div style={{ background: "#fff", borderRadius: 18, padding: 22, boxShadow: "0 8px 36px rgba(0,0,0,.07)", border: "1px solid #E5E7EB", textAlign: "left", marginBottom: 16 }}>
          <div style={{ background: `linear-gradient(135deg,${S.n},#142238)`, borderRadius: 10, padding: 18, marginBottom: 18, color: "#fff" }}>
            <div style={{ fontWeight: 700, fontSize: 13, opacity: .7, marginBottom: 3 }}>🇮🇳 Nagrik Haq — PERSONALISED REPORT</div>
            <div style={{ fontWeight: 900, fontSize: 19, color: S.s, marginBottom: 4 }}>{report.data.name}</div>
            <div style={{ fontSize: 11, opacity: .6 }}>📍 {report.data.state} · 📱 +91 {report.data.phone}</div>
          </div>
          <div style={{ background: `linear-gradient(135deg,${S.g},#16a34a)`, borderRadius: 10, padding: 18, textAlign: "center", marginBottom: 18 }}>
            <div style={{ color: "rgba(255,255,255,.85)", fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: 2, marginBottom: 4 }}>Total Annual Benefits Found</div>
            <div style={{ fontWeight: 900, fontSize: 34, color: "#fff" }}>{report.total}</div>
            <div style={{ color: "rgba(255,255,255,.75)", fontSize: 12, marginTop: 4 }}>{report.schemes.length} schemes identified · 8 sections · 25+ pages</div>
          </div>
          {["🚀 Priority Action List", "📋 Step-by-Step Guides (per scheme)", "📂 Master Documents Checklist", "📜 Income Certificate Guide", "🗺️ CSC Locator Guide", "⚖️ Rejection Appeal Guide", "📅 Deadline Calendar", "🗓️ 30-Day Action Plan"].map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 9, padding: "7px 0", borderBottom: "1px solid #F3F4F6", fontSize: 13, color: "#111827" }}>
              <span style={{ color: S.g }}>✓</span>{s}
            </div>
          ))}
        </div>
        <button onClick={() => buildPDF(report)} style={{ width: "100%", padding: 15, border: "none", borderRadius: 11, background: `linear-gradient(135deg,${S.s},#FF8C38)`, color: "#fff", fontWeight: 900, fontSize: 17, cursor: "pointer", boxShadow: "0 5px 18px rgba(255,107,0,.3)", marginBottom: 10 }}>
          📥 Download 25-Page PDF Guide
        </button>
        <button onClick={() => { const m = `🇮🇳 *Mujhe ${report.total} ke sarkari benefits milne chahiye the — pata hi nahi tha!*\n\nSirf ₹99 mein NagrikHaq.in ne mujhe 25-page guide diya:\n✅ Kaunsi schemes milti hain\n✅ Step-by-step apply kaise karein\n✅ Documents list\n✅ 30-din action plan\n\nTum bhi check karo: https://NagrikHaq.in`; window.open("https://wa.me/?text=" + encodeURIComponent(m), "_blank"); }} style={{ width: "100%", padding: 13, border: "none", borderRadius: 11, background: "linear-gradient(135deg,#25D366,#128C7E)", color: "#fff", fontWeight: 900, fontSize: 15, cursor: "pointer", marginBottom: 10 }}>
          📲 Share on WhatsApp
        </button>
        <p style={{ fontSize: 11, color: "#9CA3AF" }}>💡 Click Download → new tab opens → click orange "Save as PDF" button</p>
        <button onClick={() => setPage("home")} style={{ marginTop: 12, background: "none", border: "none", color: S.s, fontWeight: 700, cursor: "pointer", fontSize: 13 }}>← Back to Home</button>
      </div>
      {toast && <Tst msg={toast} />}
    </div>
  );

  // ── TOOLS PAGE ──
  if (page === "tool") return <ToolPage tool={tool} report={report} setPage={setPage} S={S} />;

  return null;
}

// ══════════════════════════════════════════
//  TOOL PAGES
// ══════════════════════════════════════════
function ToolPage({ tool, report, setPage, S }) {
  if (tool === "rejection") return (
    <div style={{ fontFamily: "Arial,sans-serif", background: "#FAFAF8", minHeight: "100vh", padding: "22px 16px" }}>
      {renderUPIModal()}
      <button onClick={() => setPage("home")} style={{ background: "none", border: "none", color: S.s, fontWeight: 700, fontSize: 14, cursor: "pointer", marginBottom: 18 }}>← Back to Home</button>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ background: "linear-gradient(135deg,#7F1D1D,#DC2626)", borderRadius: 16, padding: 28, textAlign: "center", marginBottom: 24, color: "#fff" }}>
          <div style={{ fontSize: 48, marginBottom: 10 }}>🚫</div>
          <h2 style={{ fontWeight: 900, fontSize: 24, marginBottom: 6 }}>Government Rejection Fix Kit</h2>
          <p style={{ opacity: .8, fontSize: 14 }}>Avoid rejection in India's top 10 government scheme applications</p>
        </div>
        {[
          { name: "PM Mudra Yojana", reasons: ["Business description too vague — banks need exact product/service, customer base, revenue projection.", "Wrong category — Shishu/Kishore/Tarun mismatch with loan amount.", "Poor credit history (CIBIL below 650) not disclosed upfront.", "Incomplete business address proof.", "No existing business proof for Kishore/Tarun category."], fix: "Write a 1-page business plan: (1) What you sell, (2) Who buys it, (3) How much revenue per month, (4) How you'll repay. Visit District Industries Centre (DIC) — they help free.", docs: ["Aadhaar", "PAN", "Business plan (1 page minimum)", "6 months bank statement", "Business address proof", "Shop registration if available"], apply: ["Visit any bank branch or NBFC with your business plan.", "Choose category: Shishu (up to ₹50K), Kishore (₹50K–5L), Tarun (₹5L–10L).", "Fill Mudra Loan application form — available at counter.", "Submit documents. Bank must process within 7–10 days."], link: "mudra.org.in", helpline: "1800-180-1111" },
          { name: "PM Awas Yojana", reasons: ["Bank account not linked to Aadhaar — DBT fails.", "Name mismatch in Aadhaar vs ration card.", "House already owned by family member — even in another city.", "SECC-2011 list name missing or misspelled.", "Land documents not in applicant's name."], fix: "Fix Aadhaar-bank linkage FIRST. Get name corrected in ration card at tehsil before applying. Check secc.gov.in for your name.", docs: ["Aadhaar (linked to bank)", "BPL ration card", "Land record in applicant's name", "Bank passbook", "Income certificate"], apply: ["Rural: Visit Gram Panchayat → ask for PMAY-G form.", "Urban: Apply at pmaymis.gov.in or Municipal office.", "Submit Aadhaar, income cert, land docs.", "Verification → 3 instalments released to bank account."], link: "pmaymis.gov.in / pmayg.nic.in", helpline: "1800-11-6446" },
          { name: "Ayushman Bharat", reasons: ["Family not in SECC-2011 list.", "Aadhaar details don't match ration card.", "Family member already enrolled in conflicting insurance.", "Mobile not linked to Aadhaar."], fix: "Check pmjay.gov.in first. If not listed, contact your State Health Agency — most states have expanded lists beyond SECC.", docs: ["Aadhaar (Aadhaar-mobile linked)", "Ration card (any colour)", "Family ID if available"], apply: ["Check eligibility: pmjay.gov.in → Am I Eligible.", "Visit nearest CSC or district hospital with Aadhaar + ration card.", "Get Ayushman card FREE — never pay anyone for it.", "Show card at any empanelled hospital — zero payment needed."], link: "pmjay.gov.in", helpline: "14555" },
          { name: "PM Kisan Samman Nidhi", reasons: ["Land in father's/spouse's name — must be in applicant's name.", "eKYC not done (most common reason for payment stop).", "Incorrect bank account or IFSC code entered.", "Farmer is government employee or income taxpayer (ineligible)."], fix: "Transfer land to your name first. Then register. Do eKYC immediately at pmkisan.gov.in → Farmers Corner → eKYC. Verify bank details at same portal.", docs: ["Aadhaar (mobile linked)", "Land record in applicant's name", "Bank passbook with correct IFSC"], apply: ["Register at pmkisan.gov.in → New Farmer Registration.", "Enter Aadhaar, bank details, and land record info.", "Do eKYC immediately: Farmers Corner → eKYC (OTP verify).", "₹6,000/year in 3 instalments credited to bank."], link: "pmkisan.gov.in", helpline: "155261" },
          { name: "MGNREGA Job Card", reasons: ["Already in another household's job card.", "Documents incomplete at time of application.", "Name not in voter list / Aadhaar.", "Applied but not followed up — applications expire."], fix: "Check nrega.nic.in for your name before applying. Ensure all family members are listed in one household card only. Follow up weekly at Gram Panchayat.", docs: ["Aadhaar", "Ration card", "Bank passbook", "Passport photo"], apply: ["Apply at Gram Panchayat — fill Job Card application form.", "Job card issued within 15 days.", "Demand work in writing — govt MUST provide within 15 days.", "Wages: ₹220–330/day (varies by state), paid to bank."], link: "nrega.nic.in", helpline: "1800-111-555" },
          { name: "PM Ujjwala Yojana 2.0", reasons: ["Another family member already has an LPG connection.", "Not falling under BPL category.", "Address mentioned does not match the distributor coverage area.", "Aadhar mismatch between applicant and other family members."], fix: "Ensure no other connections exist in the household. Use a single BPL connection per household. Update Aadhaar details if they don't match the required address.", docs: ["Aadhaar", "BPL ration card", "Bank passbook", "Declaration of no existing connection"], apply: ["Visit nearest LPG distributor (HP, Bharat, Indane).", "Fill Ujjwala 2.0 application form.", "Submit Aadhaar + ration card + self-declaration.", "Free connection + first refill delivered to home."], link: "pmuy.gov.in", helpline: "1800-266-6696" },
          { name: "Sukanya Samridhi Yojana", reasons: ["Daughter is above 10 years of age.", "Attempting to open more than two accounts per family.", "Birth certificate lacking official validation."], fix: "Apply before the daughter turns 10. Only two accounts are allowed per family. Ensure the birth certificate is officially issued by the municipality.", docs: ["Daughter's birth certificate", "Parent Aadhaar", "Parent PAN", "Address proof"], apply: ["Visit any post office or bank branch.", "Fill SSY account opening form.", "Minimum deposit: ₹250/year. Maximum: ₹1.5 lakh/year.", "Interest: ~8% (tax-free). Matures when daughter turns 21."], link: "nsiindia.gov.in", helpline: "1800-267-6868" },
          { name: "Atal Pension Yojana", reasons: ["Applicant is above 40 years of age.", "Income taxpayer status makes the applicant ineligible.", "Auto-debit failure due to low account balance."], fix: "Ensure enrollment before turning 40. Maintain a sufficient balance in your bank account for monthly auto-debits.", docs: ["Aadhaar", "Savings bank account", "Nominee details"], apply: ["Visit your bank branch with Aadhaar + bank passbook.", "Choose pension amount: ₹1,000–₹5,000/month after 60.", "Monthly auto-debit starts (₹42–₹210/month based on age).", "Govt co-contributes 50% for first 5 years (non-taxpayers)."], link: "npscra.nsdl.co.in", helpline: "1800-110-708" },
          { name: "PM Vishwakarma Yojana", reasons: ["Not falling under one of the 18 traditional crafts.", "Family member has already availed this scheme in the last 5 years.", "Lack of occupation proof or traditional craft background."], fix: "Ensure you fit into one of the specified 18 crafts. Provide valid proof of occupation from the local panchayat or urban body.", docs: ["Aadhaar", "Ration card", "Occupation proof/certification", "Bank passbook"], apply: ["Register at pmvishwakarma.gov.in with Aadhaar.", "Get verified by Gram Panchayat / Urban Local Body.", "Free 5-day skill training + ₹500/day stipend.", "Loan: ₹1L at 5% → ₹2L at 5% (after repaying first)."], link: "pmvishwakarma.gov.in", helpline: "1800-267-6868" },
          { name: "PMEGP Loan", reasons: ["Project report lacking financial feasibility.", "Applicant is less than 18 years old.", "Applying for a trading business (only manufacturing and service allowed).", "Defaulted in previous bank loans (low CIBIL)."], fix: "Create a strong project report with clear financial projections. Ensure the business is manufacturing or service-based, not pure trading.", docs: ["Aadhaar", "PAN", "Detailed Project Report", "8th pass certificate (for loans above limits)", "Bank passbook"], apply: ["Apply online at kviconline.gov.in → PMEGP portal.", "Submit project report + documents online.", "KVIC/DIC/Coir Board forwards to bank.", "15–35% subsidy credited to your loan account."], link: "kviconline.gov.in", helpline: "1800-180-0333" }
        ].map((s, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 14, padding: 22, marginBottom: 18, border: "1px solid #E5E7EB", boxShadow: "0 2px 12px rgba(0,0,0,.04)" }}>
            <div style={{ fontWeight: 900, fontSize: 18, color: "#111827", marginBottom: 14 }}>
              <span style={{ background: "#DC2626", color: "#fff", borderRadius: "50%", width: 26, height: 26, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 900, marginRight: 10 }}>{i + 1}</span>
              {s.name}
            </div>
            <div style={{ background: "#FFF1F2", borderRadius: 10, padding: 14, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: "#9F1239", marginBottom: 8 }}>❌ Common Rejection Reasons:</div>
              <ul style={{ paddingLeft: 18 }}>
                {s.reasons.map((r, j) => <li key={j} style={{ fontSize: 13, color: "#374151", lineHeight: 1.75, marginBottom: 2 }}>{r}</li>)}
              </ul>
            </div>
            <div style={{ background: "#F0FFF4", borderRadius: 10, padding: 14, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: "#166534", marginBottom: 6 }}>✅ How to Fix:</div>
              <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.7 }}>{s.fix}</p>
            </div>
            <div style={{ background: "#F9FAFB", borderRadius: 10, padding: 12, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, fontSize: 12, color: "#111827", marginBottom: 6 }}>📂 Correct Documents Needed:</div>
              <ul style={{ paddingLeft: 16 }}>
                {s.docs.map((d, j) => <li key={j} style={{ fontSize: 12, color: "#374151", lineHeight: 1.75 }}>{d}</li>)}
              </ul>
            </div>
            {s.apply && <div style={{ background: "#EFF6FF", borderRadius: 10, padding: 14, marginBottom: 14, border: "1px solid #BFDBFE" }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: "#1E40AF", marginBottom: 8 }}>📝 How to Apply (Step by Step):</div>
              <ol style={{ paddingLeft: 18 }}>
                {s.apply.map((a, j) => <li key={j} style={{ fontSize: 12.5, color: "#374151", lineHeight: 1.85, marginBottom: 2 }}>{a}</li>)}
              </ol>
            </div>}
            {(s.link || s.helpline) && <div style={{ background: "#F0FDF4", borderRadius: 10, padding: 12, border: "1px solid #BBF7D0" }}>
              <div style={{ fontWeight: 700, fontSize: 12, color: "#166534", marginBottom: 6 }}>🔗 Official Resources:</div>
              {s.link && <div style={{ fontSize: 12, color: "#1D4ED8", marginBottom: 4 }}>🌐 Website: <strong>{s.link}</strong></div>}
              {s.helpline && <div style={{ fontSize: 12, color: "#374151" }}>📞 Helpline: <strong>{s.helpline}</strong> (Toll-free)</div>}
            </div>}
          </div>
        ))}
        <button onClick={() => buildToolPDF("rejection")} style={{ width: "100%", padding: 15, border: "none", borderRadius: 11, background: `linear-gradient(135deg,${S.s},#FF8C38)`, color: "#fff", fontWeight: 900, fontSize: 17, cursor: "pointer", boxShadow: "0 5px 18px rgba(255,107,0,.3)", marginBottom: 12 }}>
          📥 Download PDF Guide
        </button>
        <button onClick={() => setPage("home")} style={{ width: "100%", padding: 14, border: "none", borderRadius: 11, background: "#E5E7EB", color: "#374151", fontWeight: 900, fontSize: 15, cursor: "pointer" }}>← Back to All Tools</button>
      </div>
    </div>
  );

  if (tool === "hidden") return (
    <div style={{ fontFamily: "Arial,sans-serif", background: "#FAFAF8", minHeight: "100vh", padding: "22px 16px" }}>
      {renderUPIModal()}
      <button onClick={() => setPage("home")} style={{ background: "none", border: "none", color: S.s, fontWeight: 700, fontSize: 14, cursor: "pointer", marginBottom: 18 }}>← Back to Home</button>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ background: "linear-gradient(135deg,#4C1D95,#7C3AED)", borderRadius: 16, padding: 28, textAlign: "center", marginBottom: 24, color: "#fff" }}>
          <div style={{ fontSize: 48, marginBottom: 10 }}>🔓</div>
          <h2 style={{ fontWeight: 900, fontSize: 24, marginBottom: 6 }}>25 Hidden Sarkari Benefits</h2>
          <p style={{ opacity: .8, fontSize: 14 }}>Lesser-known government schemes most Indians never claim</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 16 }}>
          {HIDDEN_SCHEMES.map((s, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: 13, padding: 18, border: "1px solid #E5E7EB", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg,#7C3AED,#6D28D9)" }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <span style={{ fontSize: 28 }}>{s.emoji}</span>
                <span style={{ background: "#EDE9FE", color: "#7C3AED", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 100 }}>{s.tag}</span>
              </div>
              <div style={{ fontWeight: 800, fontSize: 15, color: "#111827", marginBottom: 4 }}>{s.name}</div>
              <div style={{ color: "#138808", fontWeight: 700, fontSize: 13, marginBottom: 7 }}>{s.amount}</div>
              <p style={{ color: "#4B5563", fontSize: 12.5, lineHeight: 1.55, marginBottom: 10 }}>{s.desc}</p>
              {s.eligibility && <div style={{ background: "#F5F3FF", borderRadius: 7, padding: "8px 10px", fontSize: 11.5, color: "#4C1D95", lineHeight: 1.6 }}>👤 <strong>Who can apply:</strong> {s.eligibility}</div>}
            </div>
          ))}
        </div>

        {/* HOW TO CLAIM SECTION */}
        <div style={{ background: "#fff", borderRadius: 14, padding: 22, border: "1px solid #E5E7EB", marginTop: 24, marginBottom: 18 }}>
          <h3 style={{ fontWeight: 800, fontSize: 18, marginBottom: 14, color: "#4C1D95" }}>📝 How to Claim These Hidden Benefits</h3>
          {[["1", "Check eligibility on myscheme.gov.in", "Enter your state, age, income, and category. The portal shows ALL schemes you qualify for — including many you've never heard of."],
          ["2", "Visit your nearest CSC Centre", "Common Service Centres (CSC) can help you apply for most schemes. Find yours at locator.csccloud.in or call 1800-121-3468."],
          ["3", "Carry these documents", "Aadhaar card, income certificate, ration card, bank passbook, caste certificate (if applicable), and 4 passport photos. Self-attest 5 copies of each."],
          ["4", "Apply online where possible", "Many schemes accept online applications: scholarships.gov.in, pmjay.gov.in, pmkisan.gov.in, umang.gov.in (1,200+ services)."],
          ["5", "Follow up every 15 days", "Don't assume your application is being processed. Call the helpline or visit the office. Keep a copy of every document submitted."],
          ["6", "File grievance if delayed beyond 30 days", "Use pgportal.gov.in (CPGRAMS) to file a formal complaint. Government must respond within 30 days."]
          ].map(([n, t, d]) => (
            <div key={n} style={{ display: "flex", gap: 12, padding: "11px 0", borderBottom: "1px solid #F3F4F6" }}>
              <div style={{ width: 26, height: 26, borderRadius: "50%", background: "#7C3AED", color: "#fff", fontWeight: 900, fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{n}</div>
              <div><div style={{ fontWeight: 700, fontSize: 14, color: "#111827", marginBottom: 3 }}>{t}</div><p style={{ fontSize: 12.5, color: "#4B5563", lineHeight: 1.6 }}>{d}</p></div>
            </div>
          ))}
        </div>

        {/* PRO TIPS */}
        <div style={{ background: "#F5F3FF", borderRadius: 14, padding: 18, border: "1px solid #DDD6FE", marginBottom: 22 }}>
          <div style={{ fontWeight: 800, fontSize: 14, color: "#4C1D95", marginBottom: 10 }}>💡 Pro Tips to Maximize Your Benefits</div>
          <ul style={{ paddingLeft: 18 }}>
            <li style={{ fontSize: 12.5, color: "#374151", lineHeight: 1.85 }}>Download the <strong>UMANG app</strong> — access 1,200+ govt services from your phone.</li>
            <li style={{ fontSize: 12.5, color: "#374151", lineHeight: 1.85 }}>Use <strong>DigiLocker</strong> to store digital copies of all certificates — accepted everywhere.</li>
            <li style={{ fontSize: 12.5, color: "#374151", lineHeight: 1.85 }}>Many schemes have <strong>auto-renewal</strong> — but you still need to complete eKYC annually.</li>
            <li style={{ fontSize: 12.5, color: "#374151", lineHeight: 1.85 }}>Visit <strong>Jan Aushadhi Kendras</strong> for medicines at 50–90% lower prices — same quality as branded.</li>
            <li style={{ fontSize: 12.5, color: "#374151", lineHeight: 1.85 }}>Share this guide with family — <strong>each family member</strong> may qualify for different schemes.</li>
          </ul>
        </div>

        <button onClick={() => buildToolPDF("hidden")} style={{ width: "100%", padding: 15, border: "none", borderRadius: 11, background: "linear-gradient(135deg,#7C3AED,#6D28D9)", color: "#fff", fontWeight: 900, fontSize: 17, cursor: "pointer", boxShadow: "0 5px 18px rgba(124,58,237,.3)", marginTop: 0, marginBottom: 12 }}>
          📥 Download PDF Guide
        </button>
        <button onClick={() => setPage("home")} style={{ width: "100%", padding: 14, border: "none", borderRadius: 11, background: "#EDE9FE", color: "#7C3AED", fontWeight: 900, fontSize: 15, cursor: "pointer" }}>← Back to All Tools</button>
      </div>
    </div>
  );

  if (tool === "student") return (
    <div style={{ fontFamily: "Arial,sans-serif", background: "#FAFAF8", minHeight: "100vh", padding: "22px 16px" }}>
      {renderUPIModal()}
      <button onClick={() => setPage("home")} style={{ background: "none", border: "none", color: S.s, fontWeight: 700, fontSize: 14, cursor: "pointer", marginBottom: 18 }}>← Back to Home</button>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ background: "linear-gradient(135deg,#0C4A6E,#0369A1)", borderRadius: 16, padding: 28, textAlign: "center", marginBottom: 24, color: "#fff" }}>
          <div style={{ fontSize: 48, marginBottom: 10 }}>🎓</div>
          <h2 style={{ fontWeight: 900, fontSize: 24, marginBottom: 6 }}>Student Nagrik Haq Pack</h2>
          <p style={{ opacity: .8, fontSize: 14 }}>₹10,000–₹2 lakh government support available for every Indian student</p>
        </div>
        <div style={{ background: "#fff", borderRadius: 14, padding: 22, border: "1px solid #E5E7EB", marginBottom: 18 }}>
          <h3 style={{ fontWeight: 800, fontSize: 18, marginBottom: 16, color: "#111827" }}>📚 Scholarships & Financial Aid</h3>
          {STUDENT_SCHEMES.map((s, i) => (
            <div key={i} style={{ padding: "13px 0", borderBottom: "1px solid #F3F4F6", display: "flex", gap: 14, alignItems: "flex-start" }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#0369A1", color: "#fff", fontWeight: 900, fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#111827", marginBottom: 3 }}>{s.name}</div>
                <div style={{ color: "#138808", fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{s.amount}</div>
                <p style={{ color: "#4B5563", fontSize: 12.5, lineHeight: 1.55, marginBottom: 5 }}>{s.desc}</p>
                <div style={{ background: "#EFF6FF", borderRadius: 6, padding: "4px 10px", display: "inline-block", fontSize: 11, color: "#1D4ED8", fontWeight: 600 }}>🔗 {s.link}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ background: "#fff", borderRadius: 14, padding: 22, border: "1px solid #E5E7EB", marginBottom: 18 }}>
          <h3 style={{ fontWeight: 800, fontSize: 18, marginBottom: 14, color: "#111827" }}>📋 How Students Apply (Step by Step)</h3>
          {[["1", "Register on scholarships.gov.in", "Create account with Aadhaar. This is the official central govt scholarship portal covering 40+ scholarships."], ["2", "Apply before October 31 every year", "Most NSP scholarships close on October 31. Missing this = losing one full year. Set a phone alarm."], ["3", "Ensure bank account in YOUR name", "Scholarship money cannot be transferred to parent's account. Open your own account at any bank or post office."], ["4", "Get Income Certificate below ₹2.5 lakh", "Most scholarships need family income below ₹2.5 lakh/year. Visit tehsil or apply online on e-district portal."], ["5", "For PM Internship: Register at pminternship.mca.gov.in", "Age 21–24. Family income below ₹8 lakh. Apply to up to 5 companies. ₹5,000/month stipend."], ["6", "For Education Loan: Visit vidyalakshmi.co.in", "Apply to multiple banks simultaneously. Govt pays interest during study period for EWS students."]].map(([n, t, d]) => (
            <div key={n} style={{ display: "flex", gap: 12, padding: "11px 0", borderBottom: "1px solid #F3F4F6" }}>
              <div style={{ width: 26, height: 26, borderRadius: "50%", background: "#0369A1", color: "#fff", fontWeight: 900, fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{n}</div>
              <div><div style={{ fontWeight: 700, fontSize: 14, color: "#111827", marginBottom: 3 }}>{t}</div><p style={{ fontSize: 12.5, color: "#4B5563", lineHeight: 1.6 }}>{d}</p></div>
            </div>
          ))}
        </div>

        {/* IMPORTANT DEADLINES */}
        <div style={{ background: "#fff", borderRadius: 14, padding: 22, border: "1px solid #E5E7EB", marginBottom: 18 }}>
          <h3 style={{ fontWeight: 800, fontSize: 18, marginBottom: 14, color: "#0369A1" }}>⏰ Important Deadlines Every Student Must Know</h3>
          {[["NSP Scholarship (Central)", "October 31", "scholarships.gov.in — Missing = losing 1 full year of scholarship"],
          ["State Scholarships", "Varies (Aug–Dec)", "Check your state's e-district portal for exact dates"],
          ["PM Internship Scheme", "Year-round", "pminternship.mca.gov.in — New batches open quarterly"],
          ["Education Loan (Vidya Lakshmi)", "Before admission", "vidyalakshmi.co.in — Apply 2 months before course starts"],
          ["INSPIRE Scholarship (Science)", "October–November", "online-inspire.gov.in — For BSc/MSc top performers"],
          ["GATE/NET Fellowships", "September–October", "gate.iitk.ac.in / ugcnet.nta.nic.in"]
          ].map(([name, deadline, detail]) => (
            <div key={name} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "10px 0", borderBottom: "1px solid #F3F4F6", gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: "#111827" }}>{name}</div>
                <div style={{ fontSize: 11.5, color: "#4B5563", marginTop: 2 }}>{detail}</div>
              </div>
              <div style={{ background: "#FEE2E2", color: "#DC2626", fontWeight: 700, fontSize: 11, padding: "4px 10px", borderRadius: 6, whiteSpace: "nowrap", flexShrink: 0 }}>📅 {deadline}</div>
            </div>
          ))}
        </div>

        {/* DOCUMENTS CHECKLIST */}
        <div style={{ background: "#fff", borderRadius: 14, padding: 22, border: "1px solid #E5E7EB", marginBottom: 18 }}>
          <h3 style={{ fontWeight: 800, fontSize: 18, marginBottom: 14, color: "#111827" }}>📂 Documents Every Student Needs Ready</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {["Aadhaar Card (self)", "Bank passbook (own name)", "Income Certificate (< ₹2.5L)", "Caste Certificate (if SC/ST/OBC)", "10th & 12th marksheets", "Current year admission letter", "Fee receipt / fee structure", "Passport-size photos (4 copies)", "Domicile / Bonafide certificate", "Disability certificate (if applicable)"].map(d => (
              <div key={d} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", background: "#F0F9FF", borderRadius: 7, fontSize: 12, color: "#374151" }}>
                <span style={{ color: "#0369A1", fontWeight: 700 }}>☐</span> {d}
              </div>
            ))}
          </div>
        </div>

        {/* PRO TIPS */}
        <div style={{ background: "#F0F9FF", borderRadius: 14, padding: 18, border: "1px solid #BAE6FD", marginBottom: 22 }}>
          <div style={{ fontWeight: 800, fontSize: 14, color: "#0369A1", marginBottom: 10 }}>💡 Pro Tips for Students</div>
          <ul style={{ paddingLeft: 18 }}>
            <li style={{ fontSize: 12.5, color: "#374151", lineHeight: 1.85 }}>Open a <strong>zero-balance savings account</strong> at India Post or any nationalized bank — takes 15 minutes.</li>
            <li style={{ fontSize: 12.5, color: "#374151", lineHeight: 1.85 }}>Apply for <strong>multiple scholarships simultaneously</strong> — you can hold one central + one state scholarship together.</li>
            <li style={{ fontSize: 12.5, color: "#374151", lineHeight: 1.85 }}>Keep your <strong>institute verification</strong> ready — many scholarships need the college to verify your enrollment online.</li>
            <li style={{ fontSize: 12.5, color: "#374151", lineHeight: 1.85 }}>For education loans, compare rates on <strong>vidyalakshmi.co.in</strong> — you can apply to 3 banks at once.</li>
            <li style={{ fontSize: 12.5, color: "#374151", lineHeight: 1.85 }}>If your family income is below ₹8 lakh, you qualify for <strong>fee waiver at all IITs, NITs, and central universities</strong>.</li>
          </ul>
        </div>

        <button onClick={() => buildToolPDF("student")} style={{ width: "100%", padding: 15, border: "none", borderRadius: 11, background: "linear-gradient(135deg,#0369A1,#0284C7)", color: "#fff", fontWeight: 900, fontSize: 17, cursor: "pointer", boxShadow: "0 5px 18px rgba(3,105,161,.3)", marginBottom: 12 }}>
          📥 Download PDF Guide
        </button>
        <button onClick={() => setPage("home")} style={{ width: "100%", padding: 14, border: "none", borderRadius: 11, background: "#E0F2FE", color: "#0369A1", fontWeight: 900, fontSize: 15, cursor: "pointer" }}>← Back to All Tools</button>
      </div>
    </div>
  );

  // ── WOMEN SCHEMES ──
  if (tool === "women") return (
    <div style={{ fontFamily: "Arial,sans-serif", background: "#FAFAF8", minHeight: "100vh", padding: "22px 16px" }}>
      {renderUPIModal()}
      <button onClick={() => setPage("home")} style={{ background: "none", border: "none", color: S.s, fontWeight: 700, fontSize: 14, cursor: "pointer", marginBottom: 18 }}>← Back to Home</button>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ background: "linear-gradient(135deg,#831843,#DB2777)", borderRadius: 16, padding: 28, textAlign: "center", marginBottom: 24, color: "#fff" }}>
          <div style={{ fontSize: 48, marginBottom: 10 }}>👩</div>
          <h2 style={{ fontWeight: 900, fontSize: 24, marginBottom: 6 }}>Every Government Scheme for Women</h2>
          <p style={{ opacity: .8, fontSize: 14 }}>Maternity rights, business loans, safety laws, equal pay & state schemes</p>
        </div>

        {/* MATERNITY RIGHTS */}
        <div style={{ background: "#fff", borderRadius: 14, padding: 22, border: "1px solid #E5E7EB", marginBottom: 18 }}>
          <h3 style={{ fontWeight: 800, fontSize: 18, marginBottom: 14, color: "#DB2777" }}>🤰 Maternity Benefit Act — Your Rights</h3>
          {[["26 weeks paid maternity leave", "For first 2 children. 12 weeks for 3rd child onwards. Applies to all companies with 10+ employees."],
          ["No termination during pregnancy", "Employer cannot fire you during pregnancy or maternity leave. This is illegal under the Act."],
          ["Work from home option", "After 26 weeks, you can negotiate work-from-home with employer. The Act allows this."],
          ["Crèche facility mandatory", "Companies with 50+ employees MUST provide a crèche. You can visit 4 times a day."],
          ["₹6,000 under PMMVY", "Pradhan Mantri Matru Vandana Yojana — ₹5,000 in 3 instalments + ₹1,000 via JSY for institutional delivery. Apply at Anganwadi."]
          ].map(([t, d], i) => (
            <div key={i} style={{ padding: "12px 0", borderBottom: "1px solid #F3F4F6" }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: "#111827", marginBottom: 3 }}>{t}</div>
              <p style={{ fontSize: 12.5, color: "#4B5563", lineHeight: 1.6 }}>{d}</p>
            </div>
          ))}
        </div>

        {/* ENTREPRENEUR LOANS */}
        <div style={{ background: "#fff", borderRadius: 14, padding: 22, border: "1px solid #E5E7EB", marginBottom: 18 }}>
          <h3 style={{ fontWeight: 800, fontSize: 18, marginBottom: 14, color: "#DB2777" }}>💼 Women Entrepreneur Loans & Schemes</h3>
          {[{ name: "Mudra Yojana (Mahila)", amount: "Up to ₹10 lakh", desc: "Women get priority processing & lower interest rates. No collateral for Shishu (₹50K). Apply at any commercial bank or NBFC.", link: "mudra.org.in" },
          { name: "StandUp India", amount: "₹10L – ₹1 Cr", desc: "At least 1 loan per bank branch strictly reserved for women. Best for starting greenfield manufacturing/services. Apply at standupmitra.in.", link: "standupmitra.in" },
          { name: "Mahila Udyam Nidhi", amount: "Up to ₹10 lakh", desc: "SIDBI scheme for small scale industries. Soft loan with 10-year flexible repayment, specially for modernizing existing setups.", link: "sidbi.in" },
          { name: "Annapurna Scheme", amount: "Up to ₹50,000", desc: "For women starting food catering / tiffin businesses. Working capital loan from SBI/other banks to buy utensils, raw materials.", link: "sbi.co.in" },
          { name: "Stree Shakti Package", amount: "0.5% interest concession", desc: "SBI offers 0.5% lower interest to women holding 50%+ ownership with Entrepreneurship Development Programme certificate.", link: "sbi.co.in" },
          { name: "PM Vishwakarma (Women)", amount: "₹1L–₹2L at 5%", desc: "Women artisans in 18 traditional crafts (tailoring, pottery, etc.) — free 5-day training + ₹15K toolkit + subsidized collateral-free loan.", link: "pmvishwakarma.gov.in" }
          ].map((s, i) => (
            <div key={i} style={{ padding: "13px 0", borderBottom: "1px solid #F3F4F6" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#111827" }}>{s.name}</div>
                <div style={{ color: "#138808", fontWeight: 700, fontSize: 12, whiteSpace: "nowrap" }}>{s.amount}</div>
              </div>
              <p style={{ fontSize: 12.5, color: "#4B5563", lineHeight: 1.55, marginTop: 4 }}>{s.desc}</p>
              <div style={{ background: "#FDF2F8", borderRadius: 6, padding: "3px 8px", display: "inline-block", fontSize: 11, color: "#DB2777", fontWeight: 600, marginTop: 4 }}>🔗 {s.link}</div>
            </div>
          ))}
        </div>

        {/* SAFETY & WORKPLACE RIGHTS */}
        <div style={{ background: "#fff", borderRadius: 14, padding: 22, border: "1px solid #E5E7EB", marginBottom: 18 }}>
          <h3 style={{ fontWeight: 800, fontSize: 18, marginBottom: 14, color: "#DB2777" }}>🛡️ Safety & Workplace Rights</h3>
          {[["POSH Act (Sexual Harassment)", "Every company with 10+ employees MUST have an Internal Complaints Committee. File complaint within 3 months. Company must resolve within 90 days. If no ICC, file at Local Complaints Committee (district level)."],
          ["Equal Remuneration Act", "Equal pay for equal work — regardless of gender. ₹10,000 fine + imprisonment for violating employers. File complaint at Labour Commissioner."],
          ["Domestic Violence Act", "Free legal aid + right to shared household. Apply at nearest police station or file online at nalsa.gov.in. Protection order within 60 days."],
          ["Women Helpline — 181", "24/7 all-India women helpline. Connects to police, legal aid, ambulance. Also available via 112 (emergency). Free and confidential."],
          ["One Stop Centre (Sakhi)", "Free shelter + legal aid + medical help + counselling for women facing violence. 700+ centres across India. Find at wcd.nic.in."]
          ].map(([t, d], i) => (
            <div key={i} style={{ padding: "12px 0", borderBottom: "1px solid #F3F4F6" }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: "#111827", marginBottom: 3 }}>{t}</div>
              <p style={{ fontSize: 12.5, color: "#4B5563", lineHeight: 1.6 }}>{d}</p>
            </div>
          ))}
        </div>

        {/* TOP STATE SCHEMES FOR WOMEN */}
        <div style={{ background: "#FDF2F8", borderRadius: 14, padding: 22, border: "1px solid #FBCFE8", marginBottom: 22 }}>
          <h3 style={{ fontWeight: 800, fontSize: 18, marginBottom: 14, color: "#BE185D" }}>🏛️ Major State Schemes (Cash Transfers)</h3>
          {[["Ladli Behna Yojana (MP)", "₹1,250/month given to women aged 21-60. Income must be below ₹2.5 lakh. Apply at gram panchayat/ward office."],
          ["Majhi Ladki Bahin Yojana (MH)", "₹1,500/month for women aged 21-65 in Maharashtra. Family income < ₹2.5 lakh. Apply via Nari Shakti Doot App."],
          ["Kanya Sumangala Yojana (UP)", "₹25,000 total granted in 6 phases from birth of girl child until her graduation. Apply at mksy.up.gov.in."],
          ["Gruha Lakshmi Scheme (KA)", "₹2,000/month to the female head of the family with a BPL/Antyodaya card. Apply at Seva Sindhu portal."],
          ["Kalaignar Magalir Urimai (TN)", "₹1,000/month basic income for women heads of families crossing eligibility criteria. Apply at camp offices."]
          ].map(([t, d], i) => (
            <div key={i} style={{ padding: "10px 0", borderBottom: "1px solid #FCE7F3" }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: "#9D174D", marginBottom: 3 }}>{t}</div>
              <p style={{ fontSize: 12.5, color: "#374151", lineHeight: 1.6 }}>{d}</p>
            </div>
          ))}
        </div>

        {/* STATE SCHEMES */}
        <div style={{ background: "#FDF2F8", borderRadius: 14, padding: 18, border: "1px solid #FBCFE8", marginBottom: 22 }}>
          <div style={{ fontWeight: 800, fontSize: 14, color: "#DB2777", marginBottom: 10 }}>🏛️ Popular State Schemes for Women</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {["Ladli Behna (MP) — ₹1,250/month", "Kanya Sumangla (UP) — ₹15,000", "Majhi Ladki Bahin (MH) — ₹1,500/month", "Ladli Laxmi (MP) — ₹1.43 lakh", "Kalyana Lakshmi (TS) — ₹1 lakh", "Mukhyamantri Kanya Vivah (Bihar)", "Free Bus Travel (TN, KA, TS)", "Sukanya Samriddhi — ~8% tax-free"].map(s => (
              <div key={s} style={{ background: "#fff", borderRadius: 7, padding: "8px 10px", fontSize: 12, color: "#374151", border: "1px solid #FBCFE8" }}>🌸 {s}</div>
            ))}
          </div>
        </div>

        <button onClick={() => buildToolPDF("women")} style={{ width: "100%", padding: 15, border: "none", borderRadius: 11, background: "linear-gradient(135deg,#DB2777,#EC4899)", color: "#fff", fontWeight: 900, fontSize: 17, cursor: "pointer", boxShadow: "0 5px 18px rgba(219,39,119,.3)", marginBottom: 12 }}>
          📥 Download PDF Guide
        </button>
        <button onClick={() => setPage("home")} style={{ width: "100%", padding: 14, border: "none", borderRadius: 11, background: "#FDF2F8", color: "#DB2777", fontWeight: 900, fontSize: 15, cursor: "pointer" }}>← Back to All Tools</button>
      </div>
    </div>
  );

  // ── FARMER BENEFITS ──
  if (tool === "farmer") return (
    <div style={{ fontFamily: "Arial,sans-serif", background: "#FAFAF8", minHeight: "100vh", padding: "22px 16px" }}>
      <button onClick={() => setPage("home")} style={{ background: "none", border: "none", color: S.s, fontWeight: 700, fontSize: 14, cursor: "pointer", marginBottom: 18 }}>← Back to Home</button>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ background: "linear-gradient(135deg,#14532D,#15803D)", borderRadius: 16, padding: 28, textAlign: "center", marginBottom: 24, color: "#fff" }}>
          <div style={{ fontSize: 48, marginBottom: 10 }}>🌾</div>
          <h2 style={{ fontWeight: 900, fontSize: 24, marginBottom: 6 }}>Every Government Benefit for Farmers</h2>
          <p style={{ opacity: .8, fontSize: 14 }}>25+ central schemes, KCC guide, equipment subsidy, soil health advisory & organic farming</p>
        </div>

        {/* FARMER SCHEMES */}
        <div style={{ background: "#fff", borderRadius: 14, padding: 22, border: "1px solid #E5E7EB", marginBottom: 18 }}>
          <h3 style={{ fontWeight: 800, fontSize: 18, marginBottom: 14, color: "#15803D" }}>💰 All Major Farmer Schemes</h3>
          {[{ name: "PM Kisan Samman Nidhi", amount: "₹6,000/year", desc: "₹2,000 every 4 months directly to bank. Register at pmkisan.gov.in. Do eKYC immediately. If payments stopped, check 'Land Seeding' status on the portal.", helpline: "155261" },
          { name: "PM Fasal Bima Yojana", amount: "1.5-2% premium only", desc: "Crop insurance — you pay 2% (Kharif) / 1.5% (Rabi) / 5% (Cash crops), govt pays the rest. Covers drought, flood, pests. MUST report crop damage within 72 hours via 14447 or app.", helpline: "14447" },
          { name: "Kisan Credit Card (KCC)", amount: "Up to ₹3L at 4%", desc: "Agricultural credit at just 4% interest if repaid on time. No collateral required below ₹1.6 Lakh. Bank MUST issue within 14 days of application.", helpline: "1800-200-0104" },
          { name: "PM KUSUM Solar Pump", amount: "60% subsidy", desc: "Get a standalone solar irrigation pump with 60% govt subsidy. You can also earn extra income by selling surplus solar power to the grid. Apply at state energy dept.", helpline: "1800-180-3333" },
          { name: "Soil Health Card", amount: "Free testing", desc: "Free soil testing every 2 years → get a personalised fertiliser recommendation. Can save 20% on input costs. Apply at soilhealth.dac.gov.in.", helpline: "1800-180-1551" },
          { name: "PM Krishi Sinchai Yojana", amount: "55–90% subsidy", desc: "Massive subsidy on Micro Irrigation (Drip/Sprinkler systems). Saves 40% water, increases yield by 30%. Extra subsidy for SC/ST and women farmers.", helpline: "1800-180-1551" },
          { name: "eNAM (National Agri Market)", amount: "Better prices", desc: "Sell crops online to buyers across India. Removes local mandi middlemen. Free registration at enam.gov.in using Aadhaar and bank details.", helpline: "1800-270-0224" },
          { name: "Agri Infrastructure Fund", amount: "₹2 Cr at 3%", desc: "Medium/long term subsidized loan facility for post-harvest management infrastructure like cold storage, warehouse, packaging units. Apply at bank.", helpline: "1800-11-1627" },
          { name: "Paramparagat Krishi Vikas Yojana", amount: "₹50,000/ha subsidy", desc: "Promotes organic farming. ₹50,000 per hectare provided for 3 years, out of which ₹31,000 is given directly via DBT for inputs.", helpline: "1800-180-1551" },
          { name: "MGNREGA for Farmers", amount: "100 days work", desc: "Small/marginal farmers can use MGNREGA to build cattle sheds, poultry shelters, or dig wells on their own land. Get paid for improving your own farm.", helpline: "1800-111-555" }
          ].map((s, i) => (
            <div key={i} style={{ padding: "13px 0", borderBottom: "1px solid #F3F4F6" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#111827" }}>{s.name}</div>
                <div style={{ color: "#138808", fontWeight: 700, fontSize: 12, whiteSpace: "nowrap" }}>{s.amount}</div>
              </div>
              <p style={{ fontSize: 12.5, color: "#4B5563", lineHeight: 1.55, marginTop: 4 }}>{s.desc}</p>
              <div style={{ fontSize: 11, color: "#15803D", marginTop: 4 }}>📞 Helpline: <strong>{s.helpline}</strong></div>
            </div>
          ))}
        </div>

        {/* KCC CALCULATOR */}
        <div style={{ background: "#F0FDF4", borderRadius: 14, padding: 18, border: "1px solid #BBF7D0", marginBottom: 18 }}>
          <h3 style={{ fontWeight: 800, fontSize: 16, marginBottom: 12, color: "#15803D" }}>🧮 KCC Eligibility Quick Check</h3>
          {[["Own agricultural land?", "YES → You qualify for KCC. Even 0.5 acre is enough."],
          ["Tenant farmer?", "YES → You qualify too. Get NOC from landowner + lease agreement."],
          ["Fisherman/Animal husbandry?", "YES → KCC extended to fishermen and animal husbandry since 2019."],
          ["Already have KCC?", "Renew before expiry. Do eKYC at bank to continue 4% interest rate."],
          ["Bank refusing KCC?", "File complaint at Banking Ombudsman (bankingombudsman.rbi.org.in). RBI mandates 14-day issuance."]
          ].map(([q, a], i) => (
            <div key={i} style={{ padding: "8px 0", borderBottom: "1px solid #DCFCE7" }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: "#111827" }}>{q}</div>
              <div style={{ fontSize: 12, color: "#374151", marginTop: 2 }}>→ {a}</div>
            </div>
          ))}
        </div>

        {/* EQUIPMENT SUBSIDY */}
        <div style={{ background: "#fff", borderRadius: 14, padding: 22, border: "1px solid #E5E7EB", marginBottom: 18 }}>
          <h3 style={{ fontWeight: 800, fontSize: 18, marginBottom: 14, color: "#15803D" }}>🚜 Farm Equipment Subsidy Guide</h3>
          {[["Tractor (up to 40 HP)", "25–50% subsidy depending on state and category (SC/ST get higher). Apply at state agriculture dept."],
          ["Rotavator / Power Tiller", "40–50% subsidy under Sub-Mission on Agricultural Mechanization (SMAM). Apply at agrimachinery.nic.in."],
          ["Solar Pump", "60% under PM KUSUM. Apply at state renewable energy dept. Saves ₹50,000+/year on diesel."],
          ["Drip/Sprinkler System", "55% for general, 90% for SC/ST under PMKSY. Saves water, increases yield by 30%."],
          ["Thresher / Harvester", "25–40% subsidy. Custom Hiring Centre (CHC) also available — rent equipment at subsidized rates."]
          ].map(([eq, det], i) => (
            <div key={i} style={{ padding: "10px 0", borderBottom: "1px solid #F3F4F6" }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: "#111827" }}>{eq}</div>
              <div style={{ fontSize: 12, color: "#4B5563", marginTop: 2 }}>{det}</div>
            </div>
          ))}
        </div>

        <button onClick={() => buildToolPDF("farmer")} style={{ width: "100%", padding: 15, border: "none", borderRadius: 11, background: "linear-gradient(135deg,#15803D,#16A34A)", color: "#fff", fontWeight: 900, fontSize: 17, cursor: "pointer", boxShadow: "0 5px 18px rgba(21,128,61,.3)", marginBottom: 12 }}>
          📥 Download PDF Guide
        </button>
        <button onClick={() => setPage("home")} style={{ width: "100%", padding: 14, border: "none", borderRadius: 11, background: "#F0FDF4", color: "#15803D", fontWeight: 900, fontSize: 15, cursor: "pointer" }}>← Back to All Tools</button>
      </div>
    </div>
  );

  // ── BANK FRAUD RECOVERY ──
  if (tool === "bankfraud") return (
    <div style={{ fontFamily: "Arial,sans-serif", background: "#FAFAF8", minHeight: "100vh", padding: "22px 16px" }}>
      <button onClick={() => setPage("home")} style={{ background: "none", border: "none", color: S.s, fontWeight: 700, fontSize: 14, cursor: "pointer", marginBottom: 18 }}>← Back to Home</button>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ background: "linear-gradient(135deg,#7F1D1D,#B91C1C)", borderRadius: 16, padding: 28, textAlign: "center", marginBottom: 24, color: "#fff" }}>
          <div style={{ fontSize: 48, marginBottom: 10 }}>🏦</div>
          <h2 style={{ fontWeight: 900, fontSize: 24, marginBottom: 6 }}>Bank Fraud Recovery Guide</h2>
          <p style={{ opacity: .8, fontSize: 14 }}>Money stolen? RBI says full refund within 3 days of reporting. Here's exactly what to do.</p>
        </div>

        {/* RBI REFUND RULES */}
        <div style={{ background: "#FEF2F2", borderRadius: 14, padding: 18, border: "1px solid #FECACA", marginBottom: 18 }}>
          <h3 style={{ fontWeight: 800, fontSize: 16, marginBottom: 12, color: "#B91C1C" }}>⚖️ RBI Refund Rules — Know Your Rights</h3>
          {[["Report within 3 days", "ZERO liability — bank MUST refund 100% of stolen amount. This is strictly enforced under RBI circular dated July 6, 2017. Don't let branch managers say otherwise."],
          ["Report within 4–7 days", "Maximum liability capped at ₹25,000 (varies slightly by account type). Bank must refund the remaining amount within 10 working days."],
          ["Report after 7 days", "Bank decides liability based on their board-approved policy. But you can still fight — file complaint at Banking Ombudsman if they refuse."],
          ["Bank not refunding?", "If you reported in time, they MUST credit shadow reversal within 10 working days, even if investigation is pending. If not, file at rbi.org.in."],
          ["Third-party fraud", "If fraud is due to bank's system compromise / data leak (not your negligence), you have ZERO liability regardless of when you report it."]
          ].map(([t, d], i) => (
            <div key={i} style={{ padding: "10px 0", borderBottom: "1px solid #FEE2E2" }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: "#7F1D1D" }}>{t}</div>
              <p style={{ fontSize: 12.5, color: "#374151", lineHeight: 1.6, marginTop: 2 }}>{d}</p>
            </div>
          ))}
        </div>

        {/* 72-HOUR ACTION PLAN */}
        <div style={{ background: "#fff", borderRadius: 14, padding: 22, border: "1px solid #E5E7EB", marginBottom: 18 }}>
          <h3 style={{ fontWeight: 800, fontSize: 18, marginBottom: 14, color: "#B91C1C" }}>⏱️ 72-Hour Action Checklist</h3>
          {[["Hour 0–1: Block everything instantly", "Call bank's 24/7 helpline → block card/UPI/net banking immediately. Do not wait until morning. SBI: 1800-111-111, HDFC: 1800-267-6161, ICICI: 1800-102-4242, Axis: 1800-419-5959."],
          ["Hour 1–2: Report formally to claim Zero Liability", "Visit branch or email the branch manager. You MUST get a WRITTEN complaint number/acknowledgement. A forwarded SMS is not enough."],
          ["Hour 2–4: National Cyber Crime Portal", "File online at cybercrime.gov.in or immediately call 1930. The 1930 helpline can instantly freeze the fraudster's account if reported quickly. Get FIR/Acknowledgement copy."],
          ["Hour 4–6: Escalate to RBI", "Email cgm@rbi.org.in with your bank complaint number + Cyber Police FIR copy. This proves to RBI you took immediate action."],
          ["Day 2: Pressure the bank", "Call the bank grievance officer. State your complaint number, quote the RBI 2017 circular, and ask for the mandatory 10-day shadow reversal timeline."],
          ["Day 3: File Banking Ombudsman complaint", "If the branch manager refuses to help or rejects your claim: visit cms.rbi.org.in → File Complaint. It is completely free and RBI MUST respond within 30 days."],
          ["Day 7: Consumer Court via e-Daakhil", "If still unresolved, file a consumer case at edaakhil.nic.in. No lawyer required. Court fee is ₹0 for claims under ₹5 lakh. Courts routinely order banks to pay 3x compensation."]
          ].map(([t, d], i) => (
            <div key={i} style={{ display: "flex", gap: 12, padding: "12px 0", borderBottom: "1px solid #F3F4F6" }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#B91C1C", color: "#fff", fontWeight: 900, fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#111827", marginBottom: 3 }}>{t}</div>
                <p style={{ fontSize: 12.5, color: "#4B5563", lineHeight: 1.6 }}>{d}</p>
              </div>
            </div>
          ))}
        </div>

        {/* COMPLAINT LETTER TEMPLATE */}
        <div style={{ background: "#fff", borderRadius: 14, padding: 22, border: "1px solid #E5E7EB", marginBottom: 18 }}>
          <h3 style={{ fontWeight: 800, fontSize: 18, marginBottom: 14, color: "#B91C1C" }}>📝 Ready-to-Use Complaint Letter</h3>
          <div style={{ background: "#F9FAFB", borderRadius: 10, padding: 16, fontSize: 12.5, color: "#374151", lineHeight: 1.8, fontFamily: "monospace", whiteSpace: "pre-wrap" }}>
            {`To,
The Branch Manager,
[Bank Name], [Branch Name]

Subject: Complaint of Unauthorized Transaction - Claim for Zero Liability
Ref: Account No. [XXXX], Date of Fraud: [DD/MM/YYYY]

Dear Sir/Madam,

I hereby report an unauthorized transaction of ₹[Amount] from my account on [Date] at [Time]. I did NOT authorize this transaction, share my OTP, PIN, or CVV.

As per RBI Circular RBI/2017-18/15 dated 06/07/2017 on 'Customer Protection - Limiting Liability of Customers in Unauthorized Electronic Banking Transactions', I am reporting this within 3 working days and request ZERO liability and full refund of ₹[Amount] within 10 working days.

Cyber Police Ack/FIR Number: [If filed]
Complaint details: [Brief description of how fraud happened]

Failure to credit the shadow reversal within 10 days will result in a formal grievance to the RBI Banking Ombudsman and Consumer Disputes Redressal Forum with claims for distress compensation.

Yours faithfully,
[Name], [Phone], [Date]`}
          </div>
        </div>

        {/* CONSUMER COURT GUIDE */}
        <div style={{ background: "#FEF2F2", borderRadius: 14, padding: 18, border: "1px solid #FECACA", marginBottom: 22 }}>
          <h3 style={{ fontWeight: 800, fontSize: 16, marginBottom: 12, color: "#B91C1C" }}>🏛️ Consumer Court — If Bank Refuses</h3>
          {[["Fee: ₹0 for claims under ₹5 lakh", "File at edaakhil.nic.in (online) or physically visit the District Consumer Forum. No advocate needed for basic claims."],
          ["Documents needed", "Bank complaint stamped copy + 1930/Cyber FIR copy + bank statement showing fraud + ID proof."],
          ["Precedent & Penalties", "Courts strictly enforce RBI rules. Recent orders have awarded 3x compensation + ₹50,000 harassment penalty when banks delayed legitimate refunds."],
          ["Free legal aid", "If your family income is below ₹9 lakh/year, you get a completely free government lawyer at nalsa.gov.in. Call 15100."]
          ].map(([t, d], i) => (
            <div key={i} style={{ padding: "8px 0", borderBottom: "1px solid #FEE2E2" }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: "#7F1D1D" }}>{t}</div>
              <div style={{ fontSize: 12, color: "#374151", marginTop: 2 }}>{d}</div>
            </div>
          ))}
        </div>

        <button onClick={() => buildToolPDF("bankfraud")} style={{ width: "100%", padding: 15, border: "none", borderRadius: 11, background: "linear-gradient(135deg,#B91C1C,#DC2626)", color: "#fff", fontWeight: 900, fontSize: 17, cursor: "pointer", boxShadow: "0 5px 18px rgba(185,28,28,.3)", marginBottom: 12 }}>
          📥 Download PDF Guide
        </button>
        <button onClick={() => setPage("home")} style={{ width: "100%", padding: 14, border: "none", borderRadius: 11, background: "#FEF2F2", color: "#B91C1C", fontWeight: 900, fontSize: 15, cursor: "pointer" }}>← Back to All Tools</button>
      </div>
    </div>
  );

  // ── SENIOR CITIZEN RIGHTS ──
  if (tool === "senior") return (
    <div style={{ fontFamily: "Arial,sans-serif", background: "#FAFAF8", minHeight: "100vh", padding: "22px 16px" }}>
      <button onClick={() => setPage("home")} style={{ background: "none", border: "none", color: S.s, fontWeight: 700, fontSize: 14, cursor: "pointer", marginBottom: 18 }}>← Back to Home</button>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ background: "linear-gradient(135deg,#581C87,#9333EA)", borderRadius: 16, padding: 28, textAlign: "center", marginBottom: 24, color: "#fff" }}>
          <div style={{ fontSize: 48, marginBottom: 10 }}>👴</div>
          <h2 style={{ fontWeight: 900, fontSize: 24, marginBottom: 6 }}>Senior Citizen Rights Guide</h2>
          <p style={{ opacity: .8, fontSize: 14 }}>Every benefit for 60+ — pensions, healthcare, tax savings, elder protection</p>
        </div>

        {/* HEALTHCARE */}
        <div style={{ background: "#fff", borderRadius: 14, padding: 22, border: "1px solid #E5E7EB", marginBottom: 18 }}>
          <h3 style={{ fontWeight: 800, fontSize: 18, marginBottom: 14, color: "#9333EA" }}>🏥 Free & Subsidised Healthcare</h3>
          {[["CGHS (Central Govt Health Scheme)", "Comprehensive health care for retired central govt employees & dependents. Includes cashless OPD, medicines, and hospitalization at top private hospitals."],
          ["Ayushman Bharat PM-JAY (Age 70+)", "Free treatment up to ₹5 Lakh/year at top private & govt hospitals. Now extended to ALL citizens aged 70+, regardless of family income. Apply via Ayushman app for the new distinct card."],
          ["Geriatric OPDs", "Free dedicated specialist care at most govt district hospitals — skip the general queue. Exclusively for old age problems like arthritis, dementia, fall injuries, etc."],
          ["National Programme for Health Care of Elderly", "Free physiotherapy, counselling, rehabilitation, and home care services provided at community health centres (CHC) and primary health centres (PHC)."]
          ].map(([t, d], i) => (
            <div key={i} style={{ padding: "12px 0", borderBottom: "1px solid #F3F4F6" }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: "#111827", marginBottom: 3 }}>{t}</div>
              <p style={{ fontSize: 12.5, color: "#4B5563", lineHeight: 1.6 }}>{d}</p>
            </div>
          ))}
        </div>

        {/* PENSIONS */}
        <div style={{ background: "#fff", borderRadius: 14, padding: 22, border: "1px solid #E5E7EB", marginBottom: 18 }}>
          <h3 style={{ fontWeight: 800, fontSize: 18, marginBottom: 14, color: "#9333EA" }}>💰 Pensions & Income Security</h3>
          {[["Indira Gandhi National Old Age Pension", "Central Govt gives ₹200-500/month for BPL seniors. States add massively on top (e.g., Delhi gives ₹2,500/month, AP gives ₹3,000, Haryana ₹3,000). Apply at Tehsil/CSC."],
          ["Reverse Mortgage Scheme", "Turn your self-owned house into monthly income from a bank without selling it. You and your spouse can live in it until death. Legal heirs can later repay loan to keep house or bank sells it to recover dues."],
          ["SCSS (Senior Citizen Savings Scheme)", "Post Office & Banks give 8.2% guaranteed return. Maximum investment limit is ₹30 Lakh. Best zero-risk monthly income option in India right now."],
          ["LIC Pradhan Mantri Vaya Vandana Yojana", "Government subsidized pension scheme for 60+ offering guaranteed 7.4% return for 10 years. Investment up to ₹15 Lakh per senior citizen."],
          ["Higher FD Rates", "Almost all public and private banks offer 0.5% to 0.75% extra interest rate on Fixed Deposits for senior citizens compared to general public."]
          ].map(([t, d], i) => (
            <div key={i} style={{ padding: "12px 0", borderBottom: "1px solid #F3F4F6" }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: "#111827", marginBottom: 3 }}>{t}</div>
              <p style={{ fontSize: 12.5, color: "#4B5563", lineHeight: 1.6 }}>{d}</p>
            </div>
          ))}
        </div>

        {/* LEGAL PROTECTION */}
        <div style={{ background: "#FAF5FF", borderRadius: 14, padding: 22, border: "1px solid #E9D5FF", marginBottom: 18 }}>
          <h3 style={{ fontWeight: 800, fontSize: 18, marginBottom: 14, color: "#7E22CE" }}>⚖️ Legal Protection & Rights</h3>
          {[["Maintenance & Welfare of Parents Act 2007", "Children/heirs are LEGALLY bound to provide maintenance (up to ₹10K/month). Apply at Maintenance Tribunal (SDM office) — absolutely NO lawyer needed. Order must be passed in 90 days."],
          ["Elderline — 14567", "National toll-free helpline (8 AM to 8 PM). Call for pension issues, legal guidance, psychological support, or emergency rescue from abuse/abandonment. Operated by Social Justice Ministry."],
          ["Eviction of Abusive Children", "Seniors have the legal right to evict abusive adult children from their self-acquired OR ancestral property. Submit a simple application to the District Magistrate/SDM."],
          ["Property Transfer Reversal (Sec 23)", "Under Sec 23 of MWPSC Act, if a senior transferred property/house to children on the condition of being taken care of, and children fail to do so, the transfer deed can be declared VOID by the tribunal."]
          ].map(([t, d], i) => (
            <div key={i} style={{ padding: "12px 0", borderBottom: "1px solid #F3E8FF" }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: "#6B21A8", marginBottom: 3 }}>{t}</div>
              <p style={{ fontSize: 12.5, color: "#374151", lineHeight: 1.6 }}>{d}</p>
            </div>
          ))}
        </div>

        {/* TRAVEL & TAX */}
        <div style={{ background: "#fff", borderRadius: 14, padding: 22, border: "1px solid #E5E7EB", marginBottom: 22 }}>
          <h3 style={{ fontWeight: 800, fontSize: 18, marginBottom: 14, color: "#9333EA" }}>🚆 Travel & Income Tax Relief</h3>
          {[["Income Tax Exemption", "Higher basic exemption limit (₹3 Lakh for 60+ individuals, ₹5 Lakh for super seniors 80+)."],
          ["Section 80TTB", "₹50,000 standard deduction purely on interest income from banks, post office or cooperative society FDs."],
          ["Section 80D", "₹50,000 deduction allowed for health insurance premiums. If uninsured, same deduction applies to actual medical expenses."],
          ["No Advance Tax", "Seniors with no business/professional income are fully exempt from paying advance tax."],
          ["Flight Discounts", "Air India, SpiceJet, IndiGo offer 6-8% discount on base fare for 60+ citizens. Select 'Senior Citizen' while booking online and show Aadhaar/ID at airport counter."],
          ["Bus Concessions", "State transports (e.g., UP, MH, KA, HR, RJ) offer 50-100% concession in state bus fares. Always ask conductor for senior ticket and carry age proof."]
          ].map(([t, d], i) => (
            <div key={i} style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: "1px solid #F3F4F6" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#D8B4FE", marginTop: 6, flexShrink: 0 }}></div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13, color: "#111827" }}>{t}</div>
                <div style={{ fontSize: 12, color: "#4B5563", marginTop: 2 }}>{d}</div>
              </div>
            </div>
          ))}
        </div>

        {/* NOMINATION GUIDE */}
        <div style={{ background: "#F5F3FF", borderRadius: 14, padding: 18, border: "1px solid #DDD6FE", marginBottom: 22 }}>
          <div style={{ fontWeight: 800, fontSize: 14, color: "#9333EA", marginBottom: 10 }}>📋 Important: The Nomination Guide</div>
          <ul style={{ paddingLeft: 18 }}>
            <li style={{ fontSize: 12.5, color: "#374151", lineHeight: 1.85 }}><strong>Bank Accounts:</strong> Ensure every single bank account, locker, and FD has a registered nominee. It saves heirs months of legal hassle producing succession certificates.</li>
            <li style={{ fontSize: 12.5, color: "#374151", lineHeight: 1.85 }}><strong>Mutual Funds & Demat:</strong> SEBI has made nomination mandatory. Add online via your broker app or the accounts will be frozen for withdrawals.</li>
            <li style={{ fontSize: 12.5, color: "#374151", lineHeight: 1.85 }}><strong>Property WILLs:</strong> A registered WILL is the only legally watertight way to pass on real estate. Remember, a nominee is just a trustee, a WILL decides the absolute owner.</li>
          </ul>
        </div>

        <button onClick={() => buildToolPDF("senior")} style={{ width: "100%", padding: 15, border: "none", borderRadius: 11, background: "linear-gradient(135deg,#9333EA,#A855F7)", color: "#fff", fontWeight: 900, fontSize: 17, cursor: "pointer", boxShadow: "0 5px 18px rgba(147,51,234,.3)", marginBottom: 12 }}>
          📥 Download PDF Guide
        </button>
        <button onClick={() => setPage("home")} style={{ width: "100%", padding: 14, border: "none", borderRadius: 11, background: "#FAF5FF", color: "#9333EA", fontWeight: 900, fontSize: 15, cursor: "pointer" }}>← Back to All Tools</button>
      </div>
    </div>
  );

  return null;
}

// ══════════════════════════════════════════
//  SHARED COMPONENTS
// ══════════════════════════════════════════
const INP = { width: "100%", padding: "12px 14px", border: "2px solid #E5E7EB", borderRadius: 9, fontFamily: "inherit", fontSize: 14, color: "#111827", outline: "none", background: "#fff", boxSizing: "border-box" };
function SB({ t, s, children }) { return <div><h3 style={{ fontWeight: 800, fontSize: 17, marginBottom: 3, color: "#111827" }}>{t}</h3><p style={{ color: "#6B7280", fontSize: 12, marginBottom: 20 }}>{s}</p>{children}</div>; }
function FL({ l, children }) { return <div style={{ marginBottom: 16 }}><label style={{ display: "block", fontWeight: 600, fontSize: 13, marginBottom: 6, color: "#111827" }}>{l}</label>{children}</div>; }
function RG({ val, onChange, opts }) { return <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9 }}>{opts.map(([v, l]) => <div key={v} onClick={() => onChange(v)} style={{ border: `2px solid ${val === v ? "#FF6B00" : "#E5E7EB"}`, borderRadius: 9, padding: "11px 12px", cursor: "pointer", display: "flex", alignItems: "center", gap: 9, background: val === v ? "#FFF3E8" : "#fff", transition: "all .2s" }}><div style={{ width: 17, height: 17, borderRadius: "50%", border: `2px solid ${val === v ? "#FF6B00" : "#D1D5DB"}`, background: val === v ? "#FF6B00" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{val === v && <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#fff" }} />}</div><span style={{ fontSize: 13, fontWeight: 500, color: "#111827" }}>{l}</span></div>)}</div>; }
function BR({ bk, nxt, nl = "Next →" }) { return <div style={{ display: "flex", gap: 10, marginTop: 22 }}>{bk && <button onClick={bk} style={{ flex: 1, padding: 12, border: "2px solid #E5E7EB", borderRadius: 9, background: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", color: "#111827" }}>← Back</button>}{nxt && <button onClick={nxt} style={{ flex: 2, padding: 12, border: "none", borderRadius: 9, background: "linear-gradient(135deg,#FF6B00,#FF8C38)", color: "#fff", fontWeight: 800, fontSize: 15, cursor: "pointer" }}>{nl}</button>}</div>; }
function Tst({ msg }) { return <div style={{ position: "fixed", top: 18, right: 18, background: "#138808", color: "#fff", padding: "12px 18px", borderRadius: 11, fontWeight: 600, fontSize: 13, zIndex: 9999, boxShadow: "0 6px 20px rgba(0,0,0,.15)" }}>{msg}</div>; }

function FAQC() {
  const [o, setO] = useState(null);
  const qs = [
    ["Report में कितनी schemes check होती हैं?", "हम 60+ central और state government schemes check करते हैं आपकी income, state, occupation, family profile के basis पर। हर report अलग होती है।"],
    ["क्या यह ChatGPT से better है?", "ChatGPT generic list देता है। हमारी report आपकी specific profile के लिए है — income, state, land, occupation सब consider होता है। Plus income certificate guide, CSC locator, rejection appeal guide और 30-day action plan अलग से।"],
    ["PDF कैसे save करें?", "Payment के बाद Download PDF button click करें → new tab खुलेगी → ऊपर orange button → window.print() → browser में 'Save as PDF' select करें।"],
    ["4 tools में से कौन सा पहले लें?", "Nagrik Haq Report सबसे पहले — यह base है। फिर Rejection Fix Kit अगर आपने पहले कभी apply किया था। Hidden Benefits अगर आप business या skilled worker हैं। Student Pack अगर घर में students हैं।"],
    ["Refund?", "अगर report में 5 से कम schemes मिलें, WhatsApp पर contact करें — full ₹99 refund।"],
  ];
  return <div style={{ padding: "56px 18px", background: "#fff" }}><div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}><h2 style={{ fontSize: "clamp(20px,4vw,32px)", fontWeight: 900, marginBottom: 28, color: "#111827" }}>❓ <span style={{ color: "#FF6B00" }}>सवाल जवाब</span></h2>{qs.map(([q, a], i) => <div key={i} style={{ borderBottom: "1px solid #E5E7EB", textAlign: "left" }}><div onClick={() => setO(o === i ? null : i)} style={{ padding: "16px 0", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: 600, fontSize: 14, color: o === i ? "#FF6B00" : "#111827" }}>{q}<span style={{ fontSize: 18, transition: "transform .3s", display: "inline-block", transform: o === i ? "rotate(180deg)" : "none" }}>⌄</span></div>{o === i && <p style={{ color: "#374151", fontSize: 13, lineHeight: 1.7, paddingBottom: 14, margin: 0 }}>{a}</p>}</div>)}</div></div>;
}
