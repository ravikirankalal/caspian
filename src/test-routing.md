# Routing and Authentication Edge Cases Test Plan

## Test Cases to Verify:

### 1. Unauthenticated user manually visiting `/home` should be redirected to `/`
**Steps:**
1. Open browser in incognito/private mode
2. Navigate directly to `http://localhost:5174/home`
3. **Expected:** Should automatically redirect to `http://localhost:5174/` (LoginPage)
4. **Expected:** Should show the login page with "Sign in with Google" button

### 2. After login they should land on `/home` with sidebar visible
**Steps:**
1. From the login page, click "Sign in with Google"
2. Complete Google authentication
3. **Expected:** Should redirect to `http://localhost:5174/home`
4. **Expected:** Should show HomePage with sidebar visible
5. **Expected:** Sidebar should contain:
   - User avatar and name
   - Navigation items (Home, Settings)
   - Sign Out button

### 3. Refresh on `/home` should keep them there if still signed in
**Steps:**
1. While authenticated and on `/home`, refresh the page (F5 or Ctrl+R)
2. **Expected:** Should remain on `http://localhost:5174/home`
3. **Expected:** Should still show HomePage with sidebar
4. **Expected:** User should still be authenticated (no redirect to login)

### 4. Logout should return to `/` and clear protected state
**Steps:**
1. While authenticated and on `/home`, click the "Sign Out" button in sidebar
2. **Expected:** Should redirect to `http://localhost:5174/` (LoginPage)
3. **Expected:** Should show login page
4. **Expected:** Attempting to navigate to `/home` should redirect back to `/`

## Additional Edge Cases to Test:

### 5. Direct navigation while authenticated
**Steps:**
1. While authenticated, manually type `http://localhost:5174/` in address bar
2. **Expected:** Should redirect to `/home` (handled by LoginPage useEffect)

### 6. Browser back/forward buttons
**Steps:**
1. Login and navigate to `/home`
2. Use browser back button
3. **Expected:** Should redirect back to `/home` if trying to go to login while authenticated
4. Use forward button
5. **Expected:** Should maintain proper authentication state

### 7. Loading states
**Steps:**
1. Check that loading spinner appears during authentication check
2. **Expected:** "Loading..." message should appear briefly while Firebase auth state loads

## Manual Testing Checklist:
- [ ] Test Case 1: Unauthenticated `/home` redirect
- [ ] Test Case 2: Login flow and sidebar visibility
- [ ] Test Case 3: Page refresh persistence
- [ ] Test Case 4: Logout flow and state clearing
- [ ] Test Case 5: Direct navigation while authenticated
- [ ] Test Case 6: Browser navigation buttons
- [ ] Test Case 7: Loading states
- [ ] Styles and transitions working properly
- [ ] Responsive design (mobile sidebar)

## Notes:
- All tests should be performed in a fresh incognito/private browser window
- Firebase authentication state should persist properly across page refreshes
- Transitions and animations should work smoothly
- The application should handle auth state changes gracefully
