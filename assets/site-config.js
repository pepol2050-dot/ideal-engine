// ============================================
// ملف الإعدادات — خطوتين بس ولازم تتعملوا:
// 1) حطي رابط ملف CSV المنشور من الشيت في SHEET_CSV_URL
// 2) حطي رابط الشيت العادي (اللي بتفتحيه للتعديل) في SHEET_EDIT_URL
// الشرح بالتفصيل في ملف GOOGLE-SHEETS-SETUP-AR.md
// ============================================
const SHEET_CSV_URL = "PASTE_PUBLISHED_CSV_LINK_HERE";
const SHEET_EDIT_URL = "PASTE_YOUR_GOOGLE_SHEET_LINK_HERE";

const STUDENT_PASSWORD = "10102020";
const TEACHER_PASSWORD = "511994";

// أسماء الـ500 مجموعة/فصل — عدّلي الأسماء دي براحتك
const TOTAL_GROUPS = 500;
const GROUP_LABELS = {};
for(let i = 1; i <= TOTAL_GROUPS; i++){
  GROUP_LABELS['group' + i] = 'المجموعة ' + i;
}
// مثال: GROUP_LABELS['group1'] = '4 ابتدائي - شعبة أ';

const GROUP_CODES = Object.keys(GROUP_LABELS);

// أسماء المعلمين الثلاثة
const TEACHER_LABELS = {
  teacher1: 'د. هدير يوسف',
  teacher2: 'المعلم الثاني',
  teacher3: 'المعلم الثالث'
};
const TEACHER_CODES = Object.keys(TEACHER_LABELS);

function gradeLabel(code){ return GROUP_LABELS[code] || code; }

// قارئ CSV بسيط (بيتعامل مع فواصل جوه علامات تنصيص)
function parseCSV(text){
  const rows = [];
  let row = [], field = '', inQuotes = false;
  for(let i = 0; i < text.length; i++){
    const c = text[i], next = text[i+1];
    if(inQuotes){
      if(c === '"' && next === '"'){ field += '"'; i++; }
      else if(c === '"'){ inQuotes = false; }
      else { field += c; }
    } else {
      if(c === '"'){ inQuotes = true; }
      else if(c === ','){ row.push(field); field = ''; }
      else if(c === '\n' || c === '\r'){
        if(field !== '' || row.length){ row.push(field); rows.push(row); row = []; field = ''; }
        if(c === '\r' && next === '\n') i++;
      } else { field += c; }
    }
  }
  if(field !== '' || row.length){ row.push(field); rows.push(row); }
  return rows;
}

async function fetchLibrary(){
  const res = await fetch(SHEET_CSV_URL + '&_=' + Date.now());
  if(!res.ok) throw new Error('تعذّر تحميل البيانات من الشيت');
  const text = await res.text();
  const rows = parseCSV(text);
  const [header, ...body] = rows;
  return body
    .filter(r => r.length >= 5 && r[0])
    .map(r => ({ grade: r[0].trim(), type: r[1].trim(), title: r[2].trim(), description: r[3].trim(), link: r[4].trim() }));
}
