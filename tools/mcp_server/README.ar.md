# 🤖 دليل تثبيت وتشغيل خادم الـ MCP لمساعدي الذكاء الاصطناعي (Model Context Protocol)

<p align="center">
  <a href="./README.md">English</a> •
  <a href="./README.ar.md"><b>العربية</b></a>
</p>

> **ما هو خادم الـ MCP؟**  
> هو جسر برمجي يربط أدوات ومحررات الذكاء الاصطناعي (مثل **Cursor** و **Claude Desktop** و **Antigravity**) بمستودع **Code Review Framework** مباشرة.  
> بمجرد تثبيته، يتحول الذكاء الاصطناعي من مجرد نموذج لغوي عام إلى **مراجع معماري متخصص** يفحص كودك آلياً، ويبحث في الـ 89 فحصاً، ويصدر لك بطاقات التقييم والدرجات.

---

## 🚀 خطوات التثبيت في محررات وبوتات الذكاء الاصطناعي

اختر المحرر أو التطبيق الذي تستخدمه واتبع الخطوات البسيطة التالية:

---

### 1. الإعداد في محرر Cursor (الأكثر شيوعاً) 💻

#### الطريقة الأولى: من واجهة المحرر مباشرة (GUI)
1. افتح محرر **Cursor**.
2. اضغط على أيقونة الإعدادات (⚙️ **Settings**) في الزاوية العلوية، أو اضغط `Ctrl + Shift + J` (على Windows) أو `Cmd + Shift + J` (على Mac).
3. من القائمة الجانبية، اختر **Features** ثم انتقل إلى قسم **MCP**.
4. اضغط على زر **+ Add New MCP Server**.
5. املأ البيانات كالتالي:
   * **Name:** `code-review-framework`
   * **Type:** `command`
   * **Command:** 
     ```bash
     node D:/programming/code-review-framework/tools/mcp_server/index.js
     ```
     *(ملاحظة: استبدل المسار بالمسار الفعلي لمجلد المستودع على جهازك، مع استخدام الشرطة المائلة `/`)*.

#### الطريقة الثانية: عبر ملف الإعدادات المباشر (JSON)
افتح الملف التالي في أي محرر نصوص:
* **على ويندوز:** `%USERPROFILE%\.cursor\mcp.json`
* **على ماك ولينكس:** `~/.cursor/mcp.json`

وأضف داخله الإعداد التالي:
```json
{
  "mcpServers": {
    "code-review-framework": {
      "command": "node",
      "args": ["D:/programming/code-review-framework/tools/mcp_server/index.js"]
    }
  }
}
```

---

### 2. الإعداد في تطبيق Claude Desktop 🧠

افتح ملف إعدادات تطبيق Claude المكتبي:
* **على ويندوز:** اضغط `Win + R` واكتب:
  `%APPDATA%\Claude\claude_desktop_config.json`
* **على ماك:** 
  `~/Library/Application Support/Claude/claude_desktop_config.json`

أضف خادم الإطار داخل قسم `mcpServers`:
```json
{
  "mcpServers": {
    "code-review-framework": {
      "command": "node",
      "args": ["D:/programming/code-review-framework/tools/mcp_server/index.js"]
    }
  }
}
```
*(احفظ الملف وأعد تشغيل تطبيق Claude Desktop؛ ستظهر لك أيقونة المطرقة 🔨 بالأسفل وبداخلها أدوات الإطار)*.

---

### 3. الإعداد في Google Antigravity 🌌

في ملف إعدادات الوكلاء أو خوادم الـ MCP لديك:
```json
{
  "code-review-framework": {
    "command": "node",
    "args": ["D:/programming/code-review-framework/tools/mcp_server/index.js"]
  }
}
```

---

### 4. الإعداد في Windsurf أو VS Code (مع إضافة Continue) 🏄

في ملف إعدادات الـ MCP الخاص بإضافة Continue أو محرر Windsurf (`~/.codeium/windsurf/mcp_config.json`):
```json
{
  "mcpServers": {
    "code-review-framework": {
      "command": "node",
      "args": ["D:/programming/code-review-framework/tools/mcp_server/index.js"]
    }
  }
}
```

---

## 🧪 كيف تتأكد أن الخادم يعمل بنجاح؟

بعد حفظ الإعداد وإعادة تشغيل المحرر، افتح محادثة جديدة مع الذكاء الاصطناعي وجرب أن تسأله أي سؤال من الأسئلة التالية:

### تجربة 1: فحص نقطة محددة
> *"ما هي شروط فحص CHK-RES-0501 وما هو الكود السليم لمنع ثغرات الحقن؟"*  
> 👈 **النتيجة المتوقعة:** سيقوم الذكاء الاصطناعي باستدعاء أداة `get_checkpoint` ويجلب لك المواصفة الأصلية المعتمدة من المستودع فوراً!

### تجربة 2: البحث في المعايير
> *"ابحث لي في إطار CRF عن أي فحوصات تمنع تسريبات الذاكرة"*  
> 👈 **النتيجة المتوقعة:** سيستدعي أداة `search_checkpoints` ويعرض لك الفحوصات المتعلقة بـ Memory Leaks مثل `CHK-PERF-0301`.

### تجربة 3: مراجعة كود حي
> *"راجع لي هذه الدالة وأخبرني هل تجتاز معايير الـ Code Review Framework؟"*
```typescript
function divide(a, b) {
  try {
    return a / b;
  } catch (e) {}
}
```
> 👈 **النتيجة المتوقعة:** سيكتشف فوراً ابتلاع الخطأ الصامت مخالفاً لـ `CHK-RES-0102` وغياب الحماية من القسمة على صفر مخالفاً لـ `CHK-DOM-0203` ويعطيك تقريراً مطابقاً لمعايير المراجعة الرسمية!

---

## 🛠️ الأدوات البرمجية المتاحة للذكاء الاصطناعي في الخادم

| اسم الأداة (Tool) | ماذا تفعل؟ | المدخلات المطلوبة |
| :--- | :--- | :--- |
| `list_checkpoints` | تصفح الفحوصات بالكامل مع إمكانية الفلترة بالركيزة (01-06) أو المستوى (1-3) | `pillar`, `tier` |
| `get_checkpoint` | جلب تفاصيل الفحص الكاملة مع كود الـ Anti-Pattern والـ Canonical Pattern | `checkpoint_id` (مثل: `CHK-RES-0501`) |
| `search_checkpoints` | بحث ذكي بالكلمات الدلالية في الـ 89 فحصاً | `query` |
| `audit_code_snippet` | فحص برمجي سريع لأي جزء من الكود واكتشاف العيوب الحرجة | `code` |
| `calculate_grade` | حساب النسبة المئوية للامتثال وإصدار الدرجة النهائية (A+ إلى F) | `passed_count`, `na_count` |
