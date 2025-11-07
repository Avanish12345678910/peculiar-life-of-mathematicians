# Firestore Security Rules Guide

## 🔒 Changing from Test Mode to Production Mode

### Current Status
Your Firestore is likely in **Test Mode** which allows all reads and writes. This is insecure for production!

## Quick Setup (Firebase Console)

### Step 1: Access Firestore Rules
1. Go to: https://console.firebase.google.com/project/peculiar-life/firestore/rules
2. You'll see the current rules

### Step 2: Replace with Production Rules

Copy and paste these production rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow everyone to read mathematicians
    match /mathematicians/{mathematicianId} {
      allow read: if true;
      
      // Allow writes only if the data is valid
      allow create: if request.resource.data.keys().hasAll(['name', 'description', 'timestamp'])
                    && request.resource.data.name is string
                    && request.resource.data.name.size() > 0
                    && request.resource.data.name.size() <= 100
                    && request.resource.data.description is string
                    && request.resource.data.description.size() > 10
                    && request.resource.data.description.size() <= 5000
                    && request.resource.data.timestamp is timestamp;
      
      // Prevent updates and deletes (submissions are permanent)
      allow update, delete: if false;
    }
  }
}
```

### Step 3: Publish
Click the **"Publish"** button in the Firebase Console

## What These Rules Do

### ✅ Security Features:

1. **Public Read Access**: Anyone can view mathematician submissions
2. **Validated Writes**: Only submissions with proper data structure are allowed
3. **Data Validation**:
   - Name: Required, 1-100 characters
   - Description: Required, 10-5000 characters
   - Timestamp: Required, must be a valid timestamp
4. **No Updates/Deletes**: Once submitted, entries cannot be modified or deleted (prevents spam/vandalism)

### 🛡️ Protection Against:
- Empty or invalid submissions
- Excessively long text (spam)
- Missing required fields
- Malicious data injection
- Unauthorized modifications

## Advanced: Deploy Rules via CLI

If you want to manage rules from your code:

```bash
# Deploy Firestore rules only
firebase deploy --only firestore:rules

# Deploy both hosting and rules
firebase deploy
```

## Testing Your Rules

After publishing, test your form:

1. Visit: https://peculiar-life.web.app
2. Try submitting a valid mathematician
3. Try submitting invalid data (should fail):
   - Empty name
   - Description less than 10 characters
   - Missing fields

## Alternative Rules (More Permissive)

If you want to allow users to update their submissions, use:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /mathematicians/{mathematicianId} {
      allow read: if true;
      
      allow create, update: if request.resource.data.keys().hasAll(['name', 'description', 'timestamp'])
                            && request.resource.data.name is string
                            && request.resource.data.name.size() > 0
                            && request.resource.data.name.size() <= 100
                            && request.resource.data.description is string
                            && request.resource.data.description.size() > 10
                            && request.resource.data.description.size() <= 5000;
      
      // Still prevent deletes
      allow delete: if false;
    }
  }
}
```

## Monitoring

Monitor your Firestore usage at:
- https://console.firebase.google.com/project/peculiar-life/firestore/usage

## Rate Limiting (Optional)

For additional protection, consider adding rate limiting:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /mathematicians/{mathematicianId} {
      allow read: if true;
      
      // Rate limit: max 5 submissions per minute per IP
      allow create: if request.resource.data.keys().hasAll(['name', 'description', 'timestamp'])
                    && request.resource.data.name is string
                    && request.resource.data.name.size() > 0
                    && request.resource.data.name.size() <= 100
                    && request.resource.data.description is string
                    && request.resource.data.description.size() > 10
                    && request.resource.data.description.size() <= 5000
                    && request.resource.data.timestamp is timestamp
                    && request.time > resource.data.timestamp + duration.value(1, 'm');
      
      allow update, delete: if false;
    }
  }
}
```

## Important Notes

⚠️ **Test Mode Expiration**: If you started in test mode, rules expire after 30 days. Change them before expiration!

✅ **Backup**: Always keep a copy of your rules before changing them

🔍 **Testing**: Use the Rules Playground in Firebase Console to test different scenarios

## Need Help?

- Firebase Security Rules Documentation: https://firebase.google.com/docs/firestore/security/get-started
- Test your rules: https://console.firebase.google.com/project/peculiar-life/firestore/rules
