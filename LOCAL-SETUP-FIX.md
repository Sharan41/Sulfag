# 🔧 Fix: Changes Not Showing on Localhost

**Problem:** Edited product in Contentful but changes not visible on localhost  
**Solution:** Set up `.env` file with Contentful credentials

---

## ✅ Quick Fix

### Step 1: Create `.env` File

In your project root (`/Users/saisharan.v/Desktop/Sulfag`), create a file named `.env`:

```bash
cd /Users/saisharan.v/Desktop/Sulfag
```

Create `.env` file with this content:

```env
VITE_CONTENTFUL_SPACE_ID=kvec8c4ex2a6
VITE_CONTENTFUL_ACCESS_TOKEN=RPvP3c3p8PokHs6-kjLK-1TZL2C45gZX87dxwmIUG98
```

### Step 2: Restart Dev Server

**Important:** You MUST restart the dev server after creating/updating `.env` file!

1. **Stop** the current dev server (Ctrl+C or Cmd+C)
2. **Start** it again:
   ```bash
   npm run dev
   ```
   Or if using frontend folder:
   ```bash
   cd frontend && npm run dev
   ```

### Step 3: Hard Refresh Browser

1. Open your localhost URL (usually `http://localhost:5173` or similar)
2. **Hard refresh:** 
   - Windows: `Ctrl + F5`
   - Mac: `Cmd + Shift + R`
3. Check Products page - should now show Contentful data!

---

## 🔍 Verify It's Working

### Check 1: .env File Exists
```bash
ls -la .env
```
Should show the file exists.

### Check 2: Environment Variables Loaded
Open browser console (F12) and check:
- No errors about missing Contentful credentials
- Network tab should show requests to Contentful API

### Check 3: Products Loading from Contentful
- Products should match what's in Contentful
- Your "SAI SHARAN" product should appear
- Changes should reflect immediately

---

## ⚠️ Common Issues

### Issue 1: Still Showing Old Data
**Solution:**
- ✅ Restart dev server (MUST do this!)
- ✅ Hard refresh browser
- ✅ Clear browser cache
- ✅ Check `.env` file has correct values

### Issue 2: Dev Server Not Reading .env
**Solution:**
- Make sure `.env` is in project root (not in `frontend/` folder)
- Variable names must start with `VITE_`
- No spaces around `=` sign
- Restart dev server after creating `.env`

### Issue 3: Wrong Port or URL
**Solution:**
- Check terminal output for correct localhost URL
- Usually: `http://localhost:5173` or `http://localhost:3000`
- Make sure you're visiting the correct URL

---

## 📋 Quick Checklist

- [ ] Created `.env` file in project root
- [ ] Added `VITE_CONTENTFUL_SPACE_ID=kvec8c4ex2a6`
- [ ] Added `VITE_CONTENTFUL_ACCESS_TOKEN=RPvP3c3p8PokHs6-kjLK-1TZL2C45gZX87dxwmIUG98`
- [ ] Saved `.env` file
- [ ] Stopped dev server
- [ ] Started dev server again (`npm run dev`)
- [ ] Hard refreshed browser
- [ ] Checked Products page - Contentful data showing!

---

## 🎯 After Setup

Once `.env` is configured:
- ✅ Localhost will fetch from Contentful
- ✅ Changes in Contentful appear immediately
- ✅ No need to restart for every change (just the first time)
- ✅ Matches production behavior

---

## 💡 Why This Happens

**Without `.env`:**
- React app doesn't know Contentful credentials
- Falls back to `products.json` (static file)
- Shows old/static data

**With `.env`:**
- React app connects to Contentful API
- Fetches live data
- Shows real-time changes

---

**Create the `.env` file, restart dev server, and you're good to go!** 🚀

