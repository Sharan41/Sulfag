# 🚀 Import Products to Contentful - Choose Your Method

You have **3 options** to import your 39 products. Choose what works best for you!

---

## Option 1: Direct Script Import (Fastest - Recommended) ⚡

**Requires:** Management API token

### Step 1: Get Management API Token
1. Go to: https://app.contentful.com/spaces/kvec8c4ex2a6/api/keys
2. Click **"Content management tokens"** tab
3. Click **"Generate personal token"**
4. Copy the token

### Step 2: Run Import Script
```bash
CONTENTFUL_MANAGEMENT_TOKEN="your_token_here" node scripts/import-to-contentful-direct.js
```

**Result:** All 39 products imported in ~30 seconds! ✅

---

## Option 2: Contentful CLI (If you prefer CLI)

### Step 1: Login (interactive)
```bash
npx contentful-cli login
```
This opens a browser - authorize the CLI.

### Step 2: Import
```bash
npx contentful-cli space import \
  --space-id kvec8c4ex2a6 \
  --content-file products-contentful-import.json
```

**Note:** The content type already exists, so it will skip that and import entries only.

---

## Option 3: Manual Entry via Web UI (Good for testing) 🖱️

### Quick Test (Add 1-2 products):
1. Go to: https://app.contentful.com/spaces/kvec8c4ex2a6/entries
2. Click **"Add entry"** → Select **"Product"**
3. Fill in:
   - **Product Name:** `ACEPHATE 75% SP`
   - **Brand:** `SULFAG`
   - **Packing:** `10X1 KG; 20X500 GM`
   - **Crops:** `Cotton Rice Sugarcane`
   - **Target Pests:** `Jassid Bollworm`
   - **Category:** Select `insecticides` (or type it)
   - **ID:** `4`
4. Click **"Publish"**
5. Test on your website!

### For All Products:
- Use the CSV file: `products-for-contentful.csv`
- Copy-paste rows into Contentful (one by one)
- Or use a Contentful marketplace app for CSV import

---

## ✅ After Import - Test

### 1. Create .env file (if not exists)
```bash
# In project root
echo 'VITE_CONTENTFUL_SPACE_ID=kvec8c4ex2a6
VITE_CONTENTFUL_ACCESS_TOKEN=RPvP3c3p8PokHs6-kjLK-1TZL2C45gZX87dxwmIUG98' > .env
```

### 2. Test Locally
```bash
npm run dev
```

### 3. Verify
- Open browser
- Go to Products page
- Products should load from Contentful!

---

## 🎯 Recommended: Option 1

**Fastest and easiest:** Get Management token → Run script → Done!

The script (`import-to-contentful-direct.js`) will:
- ✅ Connect to your Contentful space
- ✅ Import all 39 products
- ✅ Publish them automatically
- ✅ Show progress and errors

**Time:** ~2 minutes total (including getting token)

---

## 📋 Files Available

- ✅ `scripts/import-to-contentful-direct.js` - Direct import script
- ✅ `products-contentful-import.json` - CLI import file
- ✅ `products-for-contentful.csv` - CSV for manual entry

---

**Which method do you want to use?** Let me know and I can help! 🚀

