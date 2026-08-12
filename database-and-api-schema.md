# منصة المتفوقين — مخطط قاعدة البيانات وتوثيق الـ APIs (مسودة تخطيطية)

> ملاحظة: هذا مخطط تصميمي (Blueprint) لمرحلة بناء الباك-إند الفعلي. لتنفيذه بشكل حقيقي، يحتاج فريق تطوير Backend، سيرفر (Laravel/Node)، وقاعدة بيانات مُدارة (MySQL/PostgreSQL) مع حساب استضافة سحابية (AWS/Bunny Stream/Firebase).

## الجداول الرئيسية (Database Schema)

**users** — id, name, email, phone, password_hash, role(student/teacher/parent/admin), device_id, is_active, created_at

**students** — id, user_id(FK), grade(4primary..3prep), parent_id(FK→users), xp_points, coins, streak_days

**teachers** — id, user_id(FK), subjects[], bio

**parents** — id, user_id(FK), children[](FK→students)

**subjects** — id, name(علوم/كيمياء), grade

**units** — id, subject_id(FK), grade, title, order

**lessons** — id, unit_id(FK), title, video_url, pdf_url, duration_seconds, order

**assignments** — id, lesson_id(FK), title, due_date, max_score

**submissions** — id, assignment_id(FK), student_id(FK), file_url, score, submitted_at

**exams** — id, unit_id(FK), title, duration_minutes, total_marks, type(quiz/midterm/final)

**questions** — id, exam_id(FK), type(mcq/true_false/fill/matching/drag_drop/image/video), difficulty, body, options[], correct_answer, explanation

**exam_attempts** — id, exam_id(FK), student_id(FK), score, started_at, submitted_at, answers(json)

**attendance** — id, student_id(FK), lesson_id(FK), date, status(present/absent)

**achievements** — id, student_id(FK), badge_code, earned_at

**subscriptions** — id, student_id(FK), plan(free/term/yearly), status, start_date, end_date

**payments** — id, subscription_id(FK), amount, method(vodafone_cash/fawry/instapay/visa), status, transaction_ref

**coupons** — id, code, discount_percent, valid_until, usage_limit

**notifications** — id, user_id(FK), title, body, channel(push/sms/email/whatsapp), read_at

**support_tickets** — id, user_id(FK), subject, status(open/in_progress/resolved), created_at

**security_logs** — id, user_id(FK), action, ip_address, device, created_at

---

## نقاط الـ API الأساسية (REST Endpoints)

```
Auth
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/refresh-token
POST   /api/auth/2fa/verify

Students
GET    /api/students/:id/dashboard
GET    /api/students/:id/progress
GET    /api/students/:id/achievements

Lessons
GET    /api/grades/:grade/units
GET    /api/units/:id/lessons
GET    /api/lessons/:id            (يُرجع رابط فيديو مشفّر مؤقت + ملاحظات)

Assignments & Exams
GET    /api/exams/:id/questions
POST   /api/exams/:id/submit
GET    /api/students/:id/exam-results

Teacher
POST   /api/teacher/lessons        (رفع فيديو/PDF)
POST   /api/teacher/questions      (إضافة لبنك الأسئلة)
GET    /api/teacher/analytics

Parent
GET    /api/parents/:id/children
GET    /api/children/:id/monthly-report

Payments
POST   /api/payments/checkout
POST   /api/payments/webhook       (تأكيد من فوري/فودافون كاش/إنستاباي)

Admin
GET    /api/admin/users
GET    /api/admin/analytics
POST   /api/admin/coupons
```

---

## الخطوات التالية للتنفيذ الفعلي

1. اختيار الاستضافة (VPS أو AWS) وإعداد بيئة Laravel أو Node.js.
2. إنشاء قاعدة البيانات فعليًا من هذا المخطط (Migration files).
3. ربط بوابات الدفع المصرية (تحتاج تسجيل تجاري حقيقي لدى فوري/فودافون كاش/إنستاباي).
4. إعداد تخزين الفيديو المشفّر (Bunny Stream أو AWS + CloudFront مع DRM بسيط).
5. بناء تطبيقات الموبايل بـ Flutter تستهلك نفس الـ APIs.
6. دمج OpenAI API للمساعد الذكي (Backend proxy وليس مباشرة من التطبيق لحماية المفتاح).
