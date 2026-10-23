// Builds the instructional design document (.docx).
// Run: python tools/mockups/gen_mockups.py && python tools/design-doc/charts.py && npm install docx && node tools/design-doc/design_doc.js
// Then export to PDF (e.g. LibreOffice: soffice --headless --convert-to pdf) and copy it to samples/.
const fs = require('fs');
const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell,
  WidthType, ShadingType, ImageRun, PageBreak, LevelFormat, Footer, PageNumber, BorderStyle, TableOfContents,
  Header } = require('docx');
const sizeOf = (p) => { const b = fs.readFileSync(p); return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) }; };

const ACC = '5B4A8B', MUTED = '666666', FONT = 'Calibri';
const path = require('path');
const M = path.join(__dirname, '../mockups/out/'), B = path.join(__dirname, 'out/');
fs.mkdirSync(B, { recursive: true });

// ---------- helpers ----------
const runs = (t, o = {}) => {
  // supports **bold** inline
  const parts = t.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  return parts.map(p => p.startsWith('**') ? new TextRun({ text: p.slice(2, -2), bold: true, ...o }) : new TextRun({ text: p, ...o }));
};
const P = (t, o = {}) => new Paragraph({ children: runs(t, o.run || {}), spacing: { after: 120, line: 276 }, ...o.para });
const H1 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun(t)], pageBreakBefore: true });
const H2 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun(t)] });
const H3 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun(t)] });
const BL = (t, level = 0) => new Paragraph({ numbering: { reference: 'bul', level }, children: runs(t), spacing: { after: 60 } });
const NL = (t, ref = 'num', level = 0) => new Paragraph({ numbering: { reference: ref, level }, children: runs(t), spacing: { after: 60 } });
const CAP = (t) => new Paragraph({ children: [new TextRun({ text: t, italics: true, size: 18, color: MUTED })], spacing: { after: 200 } });
const IMG = (path, widthPx, align = AlignmentType.CENTER) => {
  const s = sizeOf(path); const w = Math.min(widthPx, 624); const h = Math.round(w * s.h / s.w);
  return new Paragraph({ alignment: align, spacing: { before: 80, after: 80 },
    children: [new ImageRun({ type: 'png', data: fs.readFileSync(path), transformation: { width: w, height: h },
      altText: { title: 'figure', description: path.split('/').pop(), name: 'figure' } })] });
};
const border = { style: BorderStyle.SINGLE, size: 4, color: 'BFBFBF' };
const borders = { top: border, bottom: border, left: border, right: border };
const cell = (content, width, opts = {}) => new TableCell({
  borders, width: { size: width, type: WidthType.DXA },
  shading: opts.fill ? { fill: opts.fill, type: ShadingType.CLEAR, color: 'auto' } : undefined,
  margins: { top: 70, bottom: 70, left: 110, right: 110 },
  children: (Array.isArray(content) ? content : [content]).map(c => typeof c === 'string'
    ? new Paragraph({ children: runs(c, opts.head ? { bold: true, color: 'FFFFFF' } : {}), spacing: { after: 40 } }) : c),
});
const TABLE = (widths, header, rows) => new Table({
  width: { size: widths.reduce((a, b) => a + b, 0), type: WidthType.DXA }, columnWidths: widths,
  rows: [new TableRow({ tableHeader: true, children: header.map((h, i) => cell(h, widths[i], { fill: ACC, head: true })) }),
    ...rows.map((r, ri) => new TableRow({ cantSplit: true, children: r.map((c, i) => cell(c, widths[i], { fill: ri % 2 ? 'F3F1F8' : undefined })) }))],
});
const SP = () => new Paragraph({ children: [], spacing: { after: 60 } });
const CALL = (title, body) => new Table({
  width: { size: 9360, type: WidthType.DXA }, columnWidths: [9360],
  rows: [new TableRow({ cantSplit: true, children: [new TableCell({
    borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE },
      left: { style: BorderStyle.SINGLE, size: 24, color: ACC } },
    shading: { fill: 'F3F1F8', type: ShadingType.CLEAR, color: 'auto' }, width: { size: 9360, type: WidthType.DXA },
    margins: { top: 120, bottom: 120, left: 200, right: 200 },
    children: [new Paragraph({ children: [new TextRun({ text: title, bold: true, color: ACC })], spacing: { after: 60 } }),
      ...body.map(b => new Paragraph({ children: runs(b), spacing: { after: 60 } }))] })] })],
});

// ---------- content ----------
const kids = [];
// Cover
kids.push(
  new Paragraph({ children: [], spacing: { before: 2400 } }),
  new Paragraph({ children: [new TextRun({ text: 'INSTRUCTIONAL DESIGN DOCUMENT', color: ACC, bold: true, size: 22, characterSpacing: 40 })], spacing: { after: 200 } }),
  new Paragraph({ children: [new TextRun({ text: 'Locating the Correct Course ID', size: 56, bold: true, color: '222222' })], spacing: { after: 120 } }),
  new Paragraph({ children: [new TextRun({ text: 'A self-paced eLearning module for curriculum alignment and content development specialists', size: 28, color: '444444' })], spacing: { after: 600 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: ACC, space: 12 } } }),
  new Paragraph({ children: [new TextRun({ text: 'Bailey Tucker', size: 26, bold: true })], spacing: { after: 60 } }),
  new Paragraph({ children: [new TextRun({ text: 'Front-end analysis · Task analysis · Objectives & assessment · Instructional strategy · Formative evaluation plan', size: 20, color: MUTED })], spacing: { after: 60 } }),
  new Paragraph({ children: [new TextRun({ text: 'Originally developed for EDET 722, Instructional Design, University of South Carolina (Fall 2022). Revised for portfolio use.', size: 20, color: MUTED })], spacing: { after: 1600 } }),
  CALL('Confidentiality note', [
    'This project was designed for a real team at an education technology company. To protect that organization, its name, internal system names, location codes, and staff names have been removed or generalized. All system screenshots in this document are recreated mock-ups populated with fictional data; no proprietary screens or records are shown.',
  ]),
);

// Project at a glance
kids.push(H1('Project at a Glance'));
kids.push(TABLE([2300, 7060], ['Element', 'Summary'], [
  ['Performance problem', 'A newly formed alignment and content team started work in the wrong course nearly 30% of the time in one sprint because they selected an incorrect Course Identification Number (CID) from a catalog of 150,000+ course records.'],
  ['Consequences', 'Rework on alignment projects, failed alignment reviews, and content edits applied to courses that live students and teachers were using.'],
  ['Audience', 'Six remote, degreed, state-certified educators (ages 30–55) working as curriculum alignment and content development specialists.'],
  ['Solution', 'A 15–20 minute self-paced, menu-driven eLearning module (branching PowerPoint) with a job-aid checklist, narrated screencast demonstrations, immediate-feedback practice, and a posttest.'],
  ['Design model', 'Morrison, Ross, Kalman & Kemp model (Designing Effective Instruction), organized across the ADDIE phases.'],
  ['My role', 'Sole instructional designer and subject matter expert: needs assessment, analysis, objectives, assessment, strategy, prototype development, and evaluation planning.'],
  ['Deliverables', 'This design document and an interactive eLearning prototype (provided separately).'],
]));
kids.push(SP(), H2('Contents'));
[['1', 'Needs Assessment'], ['2', 'Goal, Learner, and Contextual Analysis'], ['3', 'Task Analysis'], ['4', 'Performance Objectives and Assessment Items'],
 ['5', 'Instructional Strategy and Design Plan'], ['6', 'Formative Evaluation Plan'], ['A', 'Appendix A: Needs Assessment Survey'],
 ['B', 'Appendix B: Assessment Exhibits (mock-ups)'], ['C', 'Appendix C: Evaluation Instruments'], ['', 'References']]
  .forEach(([n, t]) => kids.push(new Paragraph({ children: [new TextRun({ text: n ? `${n}   ` : '', bold: true, color: ACC }), new TextRun(t)], spacing: { after: 60 } })));

// 1 Needs assessment
kids.push(H1('1  Needs Assessment'));
kids.push(H2('Purpose'));
kids.push(P('Every course the company offers is assigned a unique Course Identification Number (CID), and more than 150,000 CIDs exist in the course system. Some courses are built for a single state\'s standards, others are shared across many locations, and CIDs can change from one school year to the next. Together, these factors make it difficult to identify the right CID for two core tasks the team performs:'));
kids.push(BL('**Alignment projects**, which analyze a course against a state\'s standards. Using the wrong CID means the work must be redone or the alignment fails review.'));
kids.push(BL('**Gap-filling projects**, which add or create content to close gaps found during alignment. Using the wrong CID means changes land in a live course students and teachers are using, while the intended course is left unchanged.'));
kids.push(P('Observation of the team showed that work began with an incorrect CID nearly **30% of the time** during the previous sprint. The needs assessment set out to confirm whether training was the right intervention and, if so, what it should cover.'));
kids.push(H2('Process'));
kids.push(P('An eight-item Google Forms survey (Appendix A) was sent to six of the seven members of the newly formed team, and follow-up interviews were held with team members. The survey targeted felt, expressed, and anticipated needs (Morrison et al., 2019):'));
kids.push(BL('Questions 1–2: tenure with the company and time spent regularly locating CIDs'));
kids.push(BL('Questions 3–5: 0–5 Likert-scale ratings of confidence, perceived value of training, and willingness to complete a 15-minute self-paced module'));
kids.push(BL('Questions 6–7: multiple-choice preferences for content and format'));
kids.push(BL('Question 8: open-ended thoughts and feelings about locating CIDs'));
kids.push(P('Responses were summarized with mean, median, mode, and sample standard deviation. With six respondents, the statistics are descriptive and are read alongside interview and observation data rather than on their own.'));
kids.push(H2('Results'));
kids.push(TABLE([3960, 1350, 1350, 1350, 1350], ['Question', 'Mean', 'Median', 'Mode', 'SD'], [
  ['Q1  Tenure with company (years)', '2.5', '1.6', '1.5 / 1.6', '2.2'],
  ['Q2  Time regularly locating CIDs (months)', '6.5', '3', '3', '8.6'],
  ['Q3  Confidence locating the correct CID (0–5)', '3.0', '3', '3', '1.4'],
  ['Q4  "More, targeted training would help" (0–5)', '3.8', '4', '4 / 5', '1.2'],
  ['Q5  Willingness to take a 15-minute training (0–5)', '4.3', '4.5', '5', '0.8'],
]));
kids.push(CAP('Table 1. Descriptive statistics for survey items 1–5 (n = 6).'));
kids.push(IMG(B + 'fig_likert.png', 624));
kids.push(CAP('Figure 1. Distribution of Likert responses for Q3–Q5.'));
kids.push(IMG(B + 'fig_choice.png', 624));
kids.push(CAP('Figure 2. Content and format preferences (Q6–Q7).'));
kids.push(P('Five of six respondents had been locating CIDs for only about three months. Open-ended responses (lightly edited to remove names and internal tool names) reinforced the numbers:'));
['"I would like more training on locating CIDs."',
 '"I feel pretty confident, but only because a colleague took time to train me … it is not something I do very often and I would love more documentation. Others could benefit from the same kind of training I received."',
 '"I could use [the learning platform] to look for the most recently updated course in a given state, but I\'d be nervous about whether that CID was correct."',
 '"An overview or refresher every six months to a year would be helpful."',
 '"I think more practice is what I need, so maybe the training can include some examples that we need to go and find."']
  .forEach(q => kids.push(BL(q)));
kids.push(H2('Recommendations'));
kids.push(P('Training is warranted. Two-thirds of the team rated their confidence at 3 or below (Q3), and five of six said targeted training **paired with documentation** would help most (Q7). Every respondent was willing or extremely willing to complete a short self-paced module (Q5), and five of six wanted to learn **both** search methods (Q6). Interviews confirmed a 15–20 minute module would fit within current workloads.'));
kids.push(CALL('Design decisions driven by the data', [
  '**Short and self-paced** (Q5, interviews): target 15–20 minutes of instruction, delivered asynchronously to a remote team.',
  '**Both tools** (Q6): teach the Course Manager search and the Course Metadata Report.',
  '**Training plus a job aid** (Q7): build the module around a reusable CID Checklist learners keep after training.',
  '**Practice with real-feeling examples** (Q8): each topic ends with a "find the CID" practice item with immediate feedback.',
]));

// 2 Analysis
kids.push(H1('2  Goal, Learner, and Contextual Analysis'));
kids.push(H2('Goal Analysis'));
kids.push(P('**Aim:** Learners will locate the correct CID needed for an alignment or gap-filling project, building both skill and confidence.'));
kids.push(P('An initial list of eleven candidate goals was generated, then refined in three passes against one question: is this a direct step in locating the correct CID?'));
kids.push(TABLE([2200, 7160], ['Pass', 'Change and rationale'], [
  ['Initial list (11)', 'Brainstormed every skill related to finding CIDs, including tool documentation, course lists, and historical CID lookups.'],
  ['First refinement (8)', 'Merged the two "use the documentation" goals into the matching tool goals, since documentation would be embedded in the module. Removed "find an older CID from prior years" as an infrequent edge case.'],
  ['Ranking', 'Ordered remaining goals by the sequence an expert follows on the job: decide what you need, then search, then verify.'],
  ['Second refinement (5)', 'Descoped "review company content course list" and "review vendor content course list" (ranked 7–8): useful reference, but not part of the locating process. Folded "determine the content/vendor of a course" into the checklist, where it became checklist item 2.'],
]));
kids.push(CAP('Table 2. Goal refinement.'));
kids.push(P('**Final instructional goals**'));
['Utilize a checklist of questions to answer before searching for a CID',
 'Locate a CID using the Course Manager tool',
 'Determine a base course vs. a linked course in the Course Manager tool',
 'Locate a CID using a Course Metadata Report (CMR)',
 'Determine a base course vs. a linked course in a Course Metadata Report'].forEach(g => kids.push(NL(g, 'goals')));
kids.push(H2('Learner Analysis'));
kids.push(P('**General characteristics.** Six adult learners on a fully remote curriculum alignment and content development team, distributed across six states. The team rarely faces customers directly, but produces teacher-facing alignment documentation and creates or updates course content used by students and teachers.'));
kids.push(P('**Academic background.** All hold at least a bachelor\'s degree in a content area or education; four hold master\'s degrees in Education or Special Education. All hold active state teaching certifications.'));
kids.push(P('**Personal and social characteristics.** Mid-career professionals aged 30–55 (average about 35); this is not an entry-level team. Survey and interview data show high motivation to build the skill. They already understand standards alignment deeply; what is new is the course system and its data model.'));
kids.push(P('**Entry skills assumed.** Learners can log in to the course system, navigate it comfortably, and have the permissions needed to run searches and reports.'));
kids.push(H2('Contextual Analysis'));
kids.push(P('**Orienting context.** Learners are motivated by a clear payoff: mastering this skill improves team flow and self-sufficiency and removes a dependency on another team. The module should state that payoff up front (avoid rework, prevent changes to the wrong live course).'));
kids.push(P('**Instructional context.** Because the team is remote and working inside active sprints, the module is delivered online as a self-paced, menu-driven PowerPoint that can be completed between tasks and revisited as needed.'));
kids.push(P('**Transfer context.** The module should be released just before sprint and user-story planning so learners apply the checklist immediately on real tickets. Fast application helps the new skill transfer to the job and shows the efficiency gains right away.'));

// 3 Task analysis
kids.push(H1('3  Task Analysis'));
kids.push(P('The analysis combines a **procedural** analysis (the observable steps an expert follows) with a **topical** analysis (the concepts and facts needed to make the right decisions inside those steps). Screens shown are mock-ups with fictional data.'));
kids.push(H2('I. Complete the CID Checklist before searching (procedural)'));
kids.push(NL('Determine the school year the course is needed for (current or upcoming).', 'ta1'));
kids.push(NL('Determine the content source of the course (company-developed, vendor, legacy, or new curriculum).', 'ta1'));
kids.push(NL('Identify whether the project needs a base course or a linked course (or a state-specific base course).', 'ta1'));
kids.push(H2('II. Locate a CID using the Course Manager (procedural, with topical support)'));
kids.push(P('**a. Set the search parameters.**'));
[['Search Text', 'Enter all or part of a course name or display name.'],
 ['Curriculum', 'Leave as "Any." Changing it searches the wrong subset and returns inaccurate results.'],
 ['Subject Area', 'Leave as "Any." It can be narrowed, but courses may be filtered out if they are tagged to an unexpected subject.'],
 ['School Year', 'Select the year(s) identified on the checklist.'],
 ['Include Linked Courses?', 'Check to return linked copies of base courses.'],
 ['Managed At', 'Always set to the organization root so the correct catalog is searched.'],
 ['Available At (additional filters)', '"Any location" returns every course for the selected year; "Specific location" limits results. Courses are tagged to individual schools, not states, so expand the location tree and select the specific school.']]
  .forEach(([k, v]) => kids.push(BL(`**${k}:** ${v}`)));
kids.push(IMG(M + 'cm_form.png', 470));
kids.push(CAP('Figure 3. Course Manager search parameters (mock-up).'));
kids.push(P('**b. Analyze the results against the checklist to select the correct CID** (demonstrated in a narrated screencast).'));
kids.push(P('**c. Distinguish base and linked courses (topical).** If the Base Course ID column is empty, the course is a base course. If the column shows a CID, the course is a linked copy of that base course.'));
const pair = new Table({ width: { size: 9360, type: WidthType.DXA }, columnWidths: [4680, 4680], rows: [new TableRow({ children: [
  new TableCell({ borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } }, width: { size: 4680, type: WidthType.DXA }, children: [IMG(M + 'cm_math6_base.png', 290), new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Base courses: Base Course ID is blank', italics: true, size: 18, color: MUTED })] })] }),
  new TableCell({ borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } }, width: { size: 4680, type: WidthType.DXA }, children: [IMG(M + 'cm_math6_linked.png', 290), new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Linked courses: Base Course ID points to the base', italics: true, size: 18, color: MUTED })] })] }),
] })] });
kids.push(pair, CAP('Figure 4. Base vs. linked courses in Course Manager results (mock-up).'));
kids.push(H2('III. Locate a CID using a Course Metadata Report (topical and procedural)'));
kids.push(P('**a. Choose the report type (topical).** A **full** report (Available At: Any location) pulls every active course at every location. A **specific-location** report pulls only the locations selected.'));
kids.push(P('**b. Run the report (procedural).**'));
['**School Year(s):** select every school year needed.',
 '**Output Type:** leave as "Generate report in Excel." The inline option adds rich-text and cost data that is out of scope for this task.',
 '**Managed At:** leave at the organization root. The report will not run otherwise.',
 '**Available At:** choose Any location or a specific location (expand the location tree to individual schools).',
 'Select **Generate Report**.'].forEach(s => kids.push(NL(s, 'ta3')));
kids.push(IMG(M + 'cmr_form_gen.png', 470));
kids.push(CAP('Figure 5. Course Metadata Report settings (mock-up).'));
kids.push(P('**c. Filter the spreadsheet to find the CID** by location, school year, subject, and grade (demonstrated in a screencast).'));
kids.push(P('**d. Analyze results against the checklist,** using the Base Course ID column to separate base and linked courses, exactly as in the Course Manager.'));

// 4 Objectives & assessment
kids.push(H1('4  Performance Objectives and Assessment Items'));
kids.push(P('Each goal maps to one performance objective, classified with Merrill\'s content–performance matrix as used in Morrison et al. (2019). Each objective has two posttest items. Items referencing exhibits use the mock-ups in Appendix B.'));
const O = (g, o, cls, items) => [g + '\n' + o, cls, items];
const objRows = [
  ['**Goal 1:** Utilize the CID Checklist', '**Objective 1:** Given a list of characteristics, the learner will identify the characteristics of the CID Checklist correctly.', 'Concept / Recall',
    ['1. Which characteristic is NOT part of the CID Checklist?  a. School year  b. Content  c. Base/linked  **d. Retired ✓**', '2. True/False: Course content is a characteristic on the CID Checklist. **(True)**']],
  ['**Goal 2:** Locate a CID in Course Manager', '**Objective 2:** Given a set of course characteristics and the CID Checklist, the learner will identify the correct CID in a Course Manager results screen with 100% accuracy.', 'Procedure / Application',
    ['1. Using Exhibit 1, which CID is correct for the 22/23 Math 6 A course at Virtual School 07?  a. 345  b. 456  **c. 432 ✓**  d. 678', '2. Using Exhibit 3, which CID is correct for the 23/24 American Government course for Arkansas?  a. 134567  **b. 141123 ✓**  c. 156743  d. 121311']],
  ['**Goal 3:** Base vs. linked in Course Manager', '**Objective 3:** Given Course Manager search results, the learner will classify base and linked courses with 100% accuracy.', 'Concept / Application',
    ['1. Using Exhibit 1, which two courses are linked courses?  **a. 345 and 456 ✓**  b. 789 and 432  c. 432 and 678  d. 789 and 901', '2. True/False: A course with a CID in the Base Course ID column is a base course. **(False)**']],
  ['**Goal 4:** Locate a CID in a CMR', '**Objective 4:** Given a set of course characteristics and the CID Checklist, the learner will identify the correct CID in a Course Metadata Report with 100% accuracy.', 'Procedure / Application',
    ['1. Using Exhibit 4, which CID is correct for the 23/24 Geography and Society course for Utah?  **a. 141140 ✓**  b. 114504  c. 154672  d. 140347', '2. Using Exhibit 2, which CIDs are the 22/23 Texas State History 7 A/B base courses?  a. 905 and 765  b. 587 and 586  c. 905 and 894  **d. 583 and 584 ✓**']],
  ['**Goal 5:** Base vs. linked in a CMR', '**Objective 5:** Given Course Metadata Report results, the learner will classify base and linked courses with 100% accuracy.', 'Concept / Application',
    ['1. True/False: If the Base Course ID column is blank, the course is a base course. **(True)**', '2. Using Exhibit 2, which is NOT a linked course?  a. 905  **b. 894 ✓**  c. 586  d. 587']],
];
kids.push(TABLE([3000, 1500, 4860], ['Goal and performance objective', 'Classification', 'Assessment items (✓ = key)'],
  objRows.map(([g, o, c, it]) => [[new Paragraph({ children: runs(g), spacing: { after: 60 } }), new Paragraph({ children: runs(o), spacing: { after: 40 } })], c,
    it.map(i => new Paragraph({ children: runs(i), spacing: { after: 80 } }))])));
kids.push(CAP('Table 3. Objectives, classifications, and posttest items.'));

// 5 Strategy
kids.push(H1('5  Instructional Strategy and Design Plan'));
kids.push(H2('Sequencing Strategy'));
kids.push(P('The module uses **task-expertise sequencing** (English & Reigeluth, as described in Morrison et al., 2019), moving from the simplest task to the most complex. Learners first get the CID Checklist, the decision framework used in every later task. They then apply it in the simpler, form-based Course Manager tool (locate, then verify base vs. linked) before repeating the same pattern in the more complex Course Metadata Report, where they must also filter a large spreadsheet. Repeating the locate-then-verify pattern across both tools builds a consistent mental model and gives learners spaced practice applying the checklist.'));
kids.push(H2('Preinstructional Strategies'));
kids.push(P('Two preinstructional strategies orient learners. **Objectives** are shown up front so learners can see how each topic connects to the posttest; Morrison et al. (2019) note that the orienting effect of objectives grows when learners see test items linked directly to them. An **overview** explains what the module covers, why it matters (saved time, no edits to the wrong course), who it is for, and how long it takes.'));
kids.push(H2('Instructional Plan by Objective'));
const plan = [
  ['1', 'Integration: present the CID Checklist with a definition of each item.', 'Elaboration: learners paraphrase each checklist item and when to use it.', 'Which list of characteristics is the correct CID Checklist? (**c. School Year, Content, and Base/Link Course**)'],
  ['2', 'Demonstration: narrated screencast locating a CID in Course Manager from a set of characteristics; annotated screen of search parameters.', 'Elaboration: learners open Course Manager and apply the checklist to their own searches.', 'Which CID is correct for the 23/24 American Government course for Nevada? (**a. 140998**)'],
  ['3', 'Demonstration: screencast and annotated screens contrasting base and linked courses in Course Manager results.', 'Elaboration: learners run searches and identify base vs. linked courses.', 'Which CID is the national base course for 23/24 American Government? (**a. 140627**)'],
  ['4', 'Demonstration: screencasts running a CMR and filtering it by location, year, subject, and grade.', 'Elaboration: learners download a CMR and practice filtering with the checklist.', 'Which CID is correct for the 23/24 Economics course for Colorado? (**b. 117486**)'],
  ['5', 'Demonstration: screencast and annotated report contrasting base and linked courses in a CMR.', 'Elaboration: learners identify base vs. linked courses in their own report.', 'Which CID is the national base course for 23/24 Geography and Society? (**d. 149418**)'],
];
kids.push(TABLE([700, 3020, 2600, 3040], ['Obj.', 'Initial presentation', 'Generative strategy', 'Practice item (feedback branch)'], plan));
kids.push(CAP('Table 4. Initial presentation, generative strategy, and practice for each objective. Every practice item branches to "Correct" or "Try again" feedback.'));
kids.push(H2('Design Plan Matrix'));
kids.push(TABLE([2000, 3360, 1000, 1100, 1900], ['Sequence', 'Description', 'Obj.', 'Time', 'Strategy'], [
  ['Preinstructional', 'Navigation, overview, objectives, course map', '—', '1 min', 'Orienting'],
  ['Topic 1', 'CID Checklist', '1', '2 min', 'Integration → Elaboration → Practice'],
  ['Topic 2', 'Locate a CID in Course Manager', '2', '5 min', 'Demonstration → Elaboration → Practice'],
  ['Topic 3', 'Base vs. linked in Course Manager', '3', '3 min', 'Demonstration → Elaboration → Practice'],
  ['Topic 4', 'Locate a CID in a CMR', '4', '5 min', 'Demonstration → Elaboration → Practice'],
  ['Topic 5', 'Base vs. linked in a CMR', '5', '3 min', 'Demonstration → Elaboration → Practice'],
  ['Summary + posttest', 'Recap; online posttest (Google Forms)', '1–5', '5 min', 'Assessment'],
]));
kids.push(CAP('Table 5. Design plan matrix (about 19 minutes of instruction plus a 5-minute posttest).'));

// 6 Formative evaluation
kids.push(H1('6  Formative Evaluation Plan'));
kids.push(H2('Purpose'));
kids.push(P('The evaluation will determine whether the prototype adequately teaches learners to locate the correct CID and whether the module should be expanded or offered to other teams as new-hire training or a refresher.'));
kids.push(H2('Audience'));
kids.push(P('Results are for the stakeholders who manage the learners and own training decisions: the Manager of Course Management, the Product Owner for Content and Alignment, the Director of Course Operations, and the Director of Digital Product Management. The product owner and course operations director decide whether the prototype needs to be expanded for this team. The digital product management director, who oversees training for course management staff, decides whether to extend it to other teams.'));
kids.push(H2('Evaluation Questions'));
['To what degree are the learning objectives achieved?', 'Is the content sufficient?', 'Does the content need to be expanded?', 'Can or should the module be offered to additional teams?']
  .forEach(q => kids.push(NL(q, 'eq')));
kids.push(H2('Resources'));
kids.push(P('Prototype copy; computers; six team members (1–2 for one-to-one trials, 2–3 for small-group trials, all six for the field trial); stakeholder access; one additional subject matter expert (SME); and five instruments: SME Notes Form, Observation Notes Form, Interview Protocol, Attitude Survey, and Posttest.'));
kids.push(H2('Evidence, Data Gathering, and Analysis'));
kids.push(TABLE([1900, 2400, 2560, 2500], ['Instrument', 'Who / when', 'What it captures', 'Analysis'], [
  ['SME Notes Form', '1 additional SME, during SME review', 'Likert and open-ended review of content accuracy and alignment to objectives', 'Comments synthesized into a narrative of required revisions'],
  ['Observation Notes Form', 'Designer, during one-to-one and small-group trials', 'Observed issues, questions, and time to complete, by page and objective', 'Issues organized by objective and page; narrative summary'],
  ['Interview Protocol', 'One-to-one and small-group participants', 'Likert and open-ended items on design, layout, and expectations', 'Mean per Likert item with histograms; themed comments'],
  ['Attitude Survey', 'Trial participants and field trial', 'Layout, flow, practice items, content, and post-module confidence', 'Mean and frequency distribution with histograms; themed comments'],
  ['Posttest', 'All learners', 'Mastery of Objectives 1–5 (10 items)', 'Item-level percent correct and frequency distribution to find content gaps; total-score mean and distribution'],
]));
kids.push(CAP('Table 6. Evaluation instruments mapped to evidence and analysis.'));
kids.push(H2('Evaluation Schedule'));
kids.push(TABLE([1700, 1700, 1960, 2000, 1000, 1000], ['Stage', 'Version', 'Timeframe', 'Purpose', 'Testers', 'Instruments'], [
  ['SME review', 'Prototype', '1 day review + 2 days revision', 'Content validity', '1 SME', 'SME Notes'],
  ['One-to-one trials', 'Revision 1', '1 day + 2 days revision', 'First impressions; find obvious errors', '1–2', 'Observation, Interview, Attitude'],
  ['Small-group trials', 'Revision 2', '1 day + 2 days revision', 'Identify strengths and weaknesses', '2–3', 'Observation, Interview, Attitude'],
  ['Field trial', 'Revised unit', '1 day to complete', 'Assess the product in its real context', '6', 'Attitude, Posttest'],
]));
kids.push(CAP('Table 7. Formative evaluation schedule.'));
kids.push(H2('Reporting'));
kids.push(P('Findings will go to stakeholders as a written report and, where schedules allow, a short presentation after revisions are made. The presentation will emphasize the attitude survey and posttest results, and the written report also serves as documentation if a meeting cannot be scheduled.'));

// Appendices
kids.push(H1('Appendix A: Needs Assessment Survey'));
['How long have you worked for the company? (Please provide years and months if possible.)',
 'How long have you regularly been searching for CIDs?',
 'How confident are you in your ability to locate the correct CIDs needed for alignment or gap analysis work?  (0 = Not confident … 5 = Very confident)',
 'How much do you agree with this statement: "More, targeted training would help build my confidence in locating correct CIDs."  (0 = Do not agree … 5 = Strongly agree)',
 'How willing are you to complete a 15-minute self-paced training to build and refine CID-locating skills?  (0 = Not willing … 5 = Extremely willing)',
 'Which process would you like to learn more about?  (A) Locating CIDs via the Course Manager search tool  (B) Locating CIDs via metadata reports  (C) Both A and B',
 'Which statement do you think is more accurate?  (A) More documentation will help improve my confidence  (B) More, targeted training will help improve my confidence  (C) More, targeted training with documentation will help improve my confidence',
 'Please share any thoughts or feelings about locating the correct CIDs for alignment or gap-filling work.'].forEach(q => kids.push(NL(q, 'survey')));

kids.push(H1('Appendix B: Assessment Exhibits'));
kids.push(P('Recreated mock-ups with fictional data, used by the posttest items in Section 4.', { run: { italics: true, color: MUTED } }));
kids.push(H3('Exhibit 1. Course Manager search results: Math 6 (22/23, Virtual School 07)'));
kids.push(IMG(M + 'cm_math6_full.png', 430));
kids.push(H3('Exhibit 2. Course Metadata Report extract: state history courses'));
kids.push(IMG(M + 'cmr_tx.png', 624));
kids.push(new Paragraph({ children: [new PageBreak()] }));
kids.push(H3('Exhibit 3. Course Manager search results: American Government (23/24)'));
kids.push(IMG(M + 'cm_amgov.png', 400));
kids.push(H3('Exhibit 4. Course Metadata Report extract: Geography and Society (23/24)'));
kids.push(IMG(M + 'cmr_geo.png', 624));

kids.push(H1('Appendix C: Evaluation Instruments'));
kids.push(P('The SME Notes Form, Interview Protocol, Attitude Survey, and Posttest were built as Google Forms (the posttest uses the items in Table 3). The Observation Notes Form used during one-to-one and small-group trials is reproduced below.'));
kids.push(H3('Observation Notes Form: Locating a CID Learning Module'));
kids.push(P('Name: ______________________    Date: ______________    Time to complete module: ____________'));
kids.push(P('Trial type (circle):   One-to-One Trial   /   Small-Group Trial'));
kids.push(TABLE([1200, 900, 3560, 900, 2800], ['Objective', 'Page #', 'Observation / question', 'By (L/O)', 'Improvement / answer'],
  Array.from({ length: 7 }, () => ['', '', '', 'L  /  O', ''])));
kids.push(CAP('L = Learner; O = Observer.'));

kids.push(new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun('References')], pageBreakBefore: true }));
kids.push(new Paragraph({ indent: { left: 720, hanging: 720 }, children: [new TextRun('Morrison, G. R., Ross, S. M., Morrison, J. R., & Kalman, H. K. (2019). '), new TextRun({ text: 'Designing effective instruction', italics: true }), new TextRun(' (8th ed.). Wiley.')] }));

// ---------- document ----------
const numCfg = (ref, fmt = LevelFormat.DECIMAL, text = '%1.') => ({ reference: ref, levels: [{ level: 0, format: fmt, text, alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 540, hanging: 300 } } } }] });
const doc = new Document({
  creator: 'Bailey Tucker', title: 'Instructional Design Document: Locating the Correct Course ID',
  styles: {
    default: { document: { run: { font: FONT, size: 22 } } },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 36, bold: true, color: ACC, font: FONT }, paragraph: { spacing: { before: 0, after: 200 }, outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 26, bold: true, color: '333333', font: FONT }, paragraph: { keepNext: true, spacing: { before: 260, after: 100 }, outlineLevel: 1 } },
      { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 22, bold: true, color: ACC, font: FONT }, paragraph: { keepNext: true, spacing: { before: 200, after: 80 }, outlineLevel: 2 } },
    ],
  },
  numbering: { config: [
    { reference: 'bul', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 540, hanging: 270 } } } }] },
    numCfg('num'), numCfg('goals'), numCfg('ta1'), numCfg('ta3'), numCfg('eq'), numCfg('survey'),
  ] },
  sections: [{
    properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } }, titlePage: true },
    footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [
      new TextRun({ text: 'Bailey Tucker  ·  Instructional Design Document: Locating the Correct Course ID  ·  ', size: 16, color: MUTED }),
      new TextRun({ children: [PageNumber.CURRENT], size: 16, color: MUTED })] })] }) },
    children: kids,
  }],
});
Packer.toBuffer(doc).then(b => { fs.writeFileSync(path.join(B, 'Tucker_ID_Design_Document_Locating_Course_ID.docx'), b); console.log('written'); });
