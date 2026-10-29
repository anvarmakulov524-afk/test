# Контейнеры — урок и кабинет учителя

Файлы: `index.html` (ученики), `teacher.html` (учитель), `app.js`, `shim.js`, `config.js`.

## 1. Firebase (бесплатно, 5 минут)
1. https://console.firebase.google.com → Add project.
2. Build → Firestore Database → Create database → **Start in test mode**.
3. Вкладка Rules, вставьте и нажмите Publish:
```
rules_version = '2';
service cloud.firestore { match /databases/{db}/documents {
  match /lesson/{d} { allow read, write: if true; }
  match /students/{d} { allow read, write: if true; }
} }
```
4. Project settings → General → Your apps → Web (`</>`) → скопируйте `projectId` и `apiKey`.
5. Впишите их в `config.js`. Пароль учителя — там же (`teacherPassword`).

## 2. GitHub Pages
1. github.com → New repository (например `lesson`), Public.
2. Add file → Upload files: загрузите все 5 файлов.
3. Settings → Pages → Branch `main`, папка `/ (root)` → Save.
4. Через минуту: ученикам `https://ВАШ_ЛОГИН.github.io/lesson/`, вам `.../teacher.html`.

Без заполненного `config.js` сайт работает только на одном устройстве (WhatsApp-отчёты).
Пароль учителя проверяется в браузере и учебную страницу защищает лишь от случайных заходов, не от взлома.
