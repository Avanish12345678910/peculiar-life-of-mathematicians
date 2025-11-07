# Firebase Setup Instructions

To make the dynamic mathematician submissions work, you need to set up a Firebase project. Follow these steps:

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter project name: **mathematicians-db** (or any name you prefer)
4. Click "Continue"
5. Disable Google Analytics (optional, not needed for this project)
6. Click "Create project"
7. Wait for project creation, then click "Continue"

## Step 2: Register Your Web App

1. In your Firebase project dashboard, click the **Web** icon (</>)
2. Enter app nickname: **Mathematicians Website**
3. Check "Also set up Firebase Hosting" (optional)
4. Click "Register app"
5. You'll see your Firebase configuration - **COPY THIS!** It looks like:

```javascript
const firebaseConfig = {
  apiKey: "AIza...your-actual-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123..."
};
```

## Step 3: Set Up Firestore Database

1. In the left sidebar, click **Build** → **Firestore Database**
2. Click "Create database"
3. Choose "Start in **test mode**" (for development)
4. Click "Next"
5. Select your Cloud Firestore location (choose closest to your users)
6. Click "Enable"

## Step 4: Configure Security Rules (Important!)

1. In Firestore Database, click on the **Rules** tab
2. Replace the rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /mathematicians/{document} {
      // Allow anyone to read
      allow read: if true;
      // Allow anyone to create, but with validation
      allow create: if request.resource.data.name is string 
                    && request.resource.data.name.size() > 0
                    && request.resource.data.name.size() <= 100
                    && request.resource.data.description is string
                    && request.resource.data.description.size() > 0
                    && request.resource.data.description.size() <= 2000;
      // Don't allow updates or deletes from public
      allow update, delete: if false;
    }
  }
}
```

3. Click "Publish"

## Step 5: Update Your Website Code

1. Open `index.html` in your editor
2. Find the Firebase configuration section (around line 10-25)
3. Replace the placeholder config with YOUR actual config from Step 2:

```javascript
const firebaseConfig = {
    apiKey: "YOUR-ACTUAL-API-KEY",
    authDomain: "YOUR-PROJECT.firebaseapp.com",
    projectId: "YOUR-PROJECT-ID",
    storageBucket: "YOUR-PROJECT.appspot.com",
    messagingSenderId: "YOUR-SENDER-ID",
    appId: "YOUR-APP-ID"
};
```

## Step 6: Test Locally

1. Save `index.html`
2. Open your local server (http://localhost:8000)
3. Try submitting a mathematician through the form
4. Refresh the page - the submitted mathematician should appear!

## Step 7: Deploy to GitHub Pages

1. Commit and push your changes:
   ```bash
   git add index.html script.js FIREBASE_SETUP.md
   git commit -m "Add Firebase integration for dynamic submissions"
   git push origin main
   ```

2. Your GitHub Actions will automatically deploy the site
3. Enable GitHub Pages in repository settings (Source: GitHub Actions)

## Verify It's Working

1. Go to Firebase Console → Firestore Database
2. You should see a "mathematicians" collection
3. When someone submits through the form, new documents will appear here
4. All visitors will see the same submissions in real-time!

## Important Notes

- **Test mode** security rules expire after 30 days. Update rules before expiration.
- The current rules allow anyone to submit but prevent deletion/updates
- All submissions are public and visible to everyone
- You can view/moderate submissions in the Firebase Console

## Cost

Firebase free tier includes:
- 50,000 reads/day
- 20,000 writes/day
- 1GB storage

This is more than enough for a personal website!
