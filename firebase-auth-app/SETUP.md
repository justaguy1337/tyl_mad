# Firebase Authentication App Setup Guide

## 🔥 Firebase Setup Instructions

### Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Enter a project name (e.g., "my-auth-app")
4. Follow the setup wizard (you can disable Google Analytics if you want)

### Step 2: Register Your App

1. In the Firebase Console, click the **Web** icon (`</>`) to add a web app
2. Give your app a nickname (e.g., "Auth App")
3. Click "Register app"
4. Copy the Firebase configuration object

### Step 3: Configure Your App

1. Open `firebaseConfig.js` in this project
2. Replace the placeholder values with your actual Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

### Step 4: Enable Authentication Methods

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Enable **Email/Password** authentication
3. Click "Save"

### Step 5: Install Dependencies

Run the following command in the terminal:

```bash
npm install firebase
```

Or if you prefer yarn:

```bash
yarn add firebase
```

### Step 6: Run the App

```bash
npm start
```

Then scan the QR code with Expo Go on your phone or press 'w' for web.

---

## 📱 Features Included

✅ **Email/Password Authentication**
- Sign up with email and password
- Sign in with existing credentials
- Password validation (min 6 characters)
- Error handling for common issues

✅ **Password Reset**
- Forgot password functionality
- Email-based password reset

✅ **User Profile**
- Display user information
- Show account details (ID, email, creation date, etc.)
- Sign out functionality

✅ **Form Validation**
- Email format validation
- Password matching for signup
- Empty field checks

✅ **Auth State Management**
- Persistent authentication state
- Auto-login on app restart
- Loading states

---

## 🔒 Google Sign-In Setup (Optional - Advanced)

For Google Sign-In, additional setup is required:

1. **Enable Google Sign-In in Firebase**
   - Go to Authentication → Sign-in method
   - Enable Google provider
   - Add your support email

2. **Install Additional Package**
   ```bash
   npx expo install @react-native-google-signin/google-signin
   ```

3. **Configure OAuth 2.0**
   - Get your OAuth credentials from Firebase
   - Add them to your app configuration

4. **Update the Code**
   - Implement the Google Sign-In flow
   - Handle the credential exchange

---

## 🛡️ Security Best Practices

1. **Never commit your `firebaseConfig.js` with real credentials to public repositories**
   - Add it to `.gitignore` if making the repo public
   - Use environment variables for production

2. **Set up Security Rules** in Firebase Console
   - Go to Firestore/Realtime Database → Rules
   - Configure appropriate read/write permissions

3. **Enable Email Verification** (optional)
   - Send verification emails to new users
   - Restrict access until email is verified

---

## 📝 Testing the App

### Test Email/Password Sign Up
1. Enter a valid email
2. Create a password (minimum 6 characters)
3. Confirm the password
4. Click "Sign Up"

### Test Email/Password Sign In
1. Use the credentials you created
2. Click "Sign In"

### Test Password Reset
1. Enter your email
2. Click "Forgot Password?"
3. Check your email for reset link

---

## 🐛 Troubleshooting

**Error: "Firebase: Error (auth/invalid-api-key)"**
- Check that you've replaced the placeholder API key with your actual one

**Error: "Firebase: Error (auth/network-request-failed)"**
- Check your internet connection
- Verify Firebase project is active

**Error: "Firebase: Error (auth/operation-not-allowed)"**
- Enable Email/Password authentication in Firebase Console

**App crashes on startup**
- Ensure you've run `npm install firebase`
- Check that firebaseConfig.js is properly formatted

---

## 📚 Additional Resources

- [Firebase Authentication Documentation](https://firebase.google.com/docs/auth)
- [Expo Firebase Guide](https://docs.expo.dev/guides/using-firebase/)
- [React Native Firebase](https://rnfirebase.io/)

---

## 🎓 For Your Assignment

This app demonstrates:
- ✅ User registration and authentication
- ✅ Login/Logout functionality
- ✅ Form validation
- ✅ Error handling
- ✅ State management
- ✅ User profile display
- ✅ Password reset functionality

Ready to submit! Just make sure to:
1. Set up your Firebase project
2. Update the configuration
3. Test all features
4. Take screenshots for documentation
