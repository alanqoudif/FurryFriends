# إعداد Firebase للتطبيق

## خطوات إعداد Firebase

### 1. تفعيل Authentication في Firebase Console

1. اذهب إلى [Firebase Console](https://console.firebase.google.com)
2. اختر مشروعك: `fir-init-functions-a2c26`
3. من القائمة الجانبية، اختر **Authentication**
4. اضغط على **Get Started**
5. اذهب إلى تبويب **Sign-in method**
6. فعّل **Email/Password**:
   - اضغط على **Email/Password**
   - فعّل **Enable**
   - اضغط **Save**

### 2. إعداد Firestore Database

1. من القائمة الجانبية، اختر **Firestore Database**
2. اضغط **Create database**
3. اختر **Start in test mode** (للاختبار)
4. اختر موقع قاعدة البيانات (مثل us-central1)
5. اضغط **Done**

### 3. إعداد قواعد Firestore (اختياري)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 4. التحقق من الإعدادات

تأكد من أن هذه الإعدادات صحيحة في `src/config/firebase.ts`:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyAG46eGfa1e53b2mdvdVoKqJ5F8KNH5KNc",
  authDomain: "fir-init-functions-a2c26.firebaseapp.com",
  projectId: "fir-init-functions-a2c26",
  storageBucket: "fir-init-functions-a2c26.firebasestorage.app",
  messagingSenderId: "210841521220",
  appId: "1:210841521220:web:32bc8ec55323153871c011",
  measurementId: "G-2HQWC4VN0T"
};
```

## استكشاف الأخطاء

### خطأ "Auth Configuration Not Found"
- تأكد من تفعيل Authentication في Firebase Console
- تأكد من صحة إعدادات Firebase
- تأكد من أن التطبيق متصل بالإنترنت

### خطأ "Firebase App Not Initialized"
- تأكد من استيراد Firebase بشكل صحيح
- تأكد من عدم وجود أخطاء في console

## اختبار التطبيق

1. شغل التطبيق: `npm start`
2. اذهب إلى صفحة إنشاء الحساب
3. أدخل بيانات صحيحة
4. اضغط "إنشاء الحساب"
5. يجب أن يعمل بدون أخطاء

## ملاحظات مهمة

- تأكد من أن Authentication مفعل في Firebase Console
- تأكد من أن Firestore Database منشأ
- تأكد من صحة إعدادات المشروع
