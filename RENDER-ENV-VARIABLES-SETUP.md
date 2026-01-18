# 🚀 Render Environment Variables Setup

**Problem:** Changes in Contentful not showing on Render  
**Solution:** Add environment variables in Render dashboard

---

## ✅ Required Environment Variables

Add these **2 variables** in Render:

| Variable Name | Value |
|---------------|-------|
| `VITE_CONTENTFUL_SPACE_ID` | `kvec8c4ex2a6` |
| `VITE_CONTENTFUL_ACCESS_TOKEN` | `RPvP3c3p8PokHs6-kjLK-1TZL2C45gZX87dxwmIUG98` |

---

## 📋 Step-by-Step Instructions

### Step 1: Go to Render Dashboard
1. Visit: https://dashboard.render.com
2. Login to your account
3. Find your **Sulfag** service/website

### Step 2: Navigate to Environment
1. Click on your service
2. Click **"Environment"** tab (left sidebar)
3. Or go to: **Settings** → **Environment**

### Step 3: Add Environment Variables
1. Scroll to **"Environment Variables"** section
2. Click **"Add Environment Variable"** or **"Add Variable"**

**Add First Variable:**
- **Key:** `VITE_CONTENTFUL_SPACE_ID`
- **Value:** `kvec8c4ex2a6`
- Click **"Save"**

**Add Second Variable:**
- **Key:** `VITE_CONTENTFUL_ACCESS_TOKEN`
- **Value:** `RPvP3c3p8PokHs6-kjLK-1TZL2C45gZX87dxwmIUG98`
- Click **"Save"**

### Step 4: Redeploy
1. After adding variables, Render will **auto-redeploy**
2. Or click **"Manual Deploy"** → **"Deploy latest commit"**
3. Wait for deployment to complete (2-5 minutes)

### Step 5: Verify
1. Visit your Render website URL
2. Go to Products page
3. Products should now load from Contentful! ✅

---

## 🔍 How to Verify It's Working

### Check 1: Environment Variables Added
- Go to Render → Your Service → Environment
- You should see both variables listed

### Check 2: Deployment Logs
- Go to Render → Your Service → **"Logs"** tab
- Look for build logs
- Should show successful build

### Check 3: Website Behavior
- Visit your website
- Open browser console (F12)
- Check for any Contentful-related errors
- Products should load from Contentful (not JSON fallback)

---

## ⚠️ Common Issues

### Issue 1: Variables Not Showing
**Solution:**
- Make sure variable names are **exact** (case-sensitive)
- `VITE_CONTENTFUL_SPACE_ID` (not `VITE_CONTENTFUL_SPACE_ID_`)
- No extra spaces

### Issue 2: Still Showing Old Content
**Solution:**
- Hard refresh: `Ctrl+F5` (Windows) or `Cmd+Shift+R` (Mac)
- Clear browser cache
- Wait 1-2 minutes after deployment

### Issue 3: Build Failing
**Solution:**
- Check Render logs for errors
- Verify environment variables are set correctly
- Make sure values don't have extra quotes or spaces

---

## 📝 Quick Checklist

- [ ] Logged into Render dashboard
- [ ] Found your Sulfag service
- [ ] Went to Environment tab
- [ ] Added `VITE_CONTENTFUL_SPACE_ID` = `kvec8c4ex2a6`
- [ ] Added `VITE_CONTENTFUL_ACCESS_TOKEN` = `RPvP3c3p8PokHs6-kjLK-1TZL2C45gZX87dxwmIUG98`
- [ ] Saved both variables
- [ ] Redeployed (auto or manual)
- [ ] Waited for deployment to complete
- [ ] Tested website - products loading from Contentful

---

## 🎯 After Setup

Once environment variables are added:
- ✅ Website will fetch from Contentful
- ✅ Changes in Contentful appear automatically
- ✅ No redeploy needed for content changes
- ✅ Client can edit products freely

---

**That's it! Add the variables and redeploy once, then you're all set!** 🚀

