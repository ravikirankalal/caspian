# caspian

## Environment Variables

To keep your Firebase configuration secure and out of version control, create a `.env` or `.env.local` file in the root of your project with your Firebase configuration:

```
VITE_FIREBASE_API_KEY=your_actual_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_APP_ID=your_app_id
```

**Important:** 
- Never commit your `.env` files to version control
- Make sure `.env` and `.env.local` are listed in your `.gitignore` file
- The `VITE_` prefix is required for Vite to expose these variables to your client-side code
- Copy `.env.example` (if provided) to `.env.local` and fill in your actual values
