# 🚀 Quick Import Guide

The Contentful CLI import requires authentication. You have **2 options**:

---

## Option 1: Get Management Token & Run Direct Script (Recommended) ⚡

### Step 1: Get Management API Token
1. Go to: **https://app.contentful.com/spaces/kvec8c4ex2a6/api/keys**
2. Click **"Content management tokens"** tab (NOT "Content delivery / preview tokens")
3. Click **"Generate personal token"** or **"Create token"**
4. Name it: "Import Token"
5. **Copy the token** (you'll only see it once!)

### Step 2: Run Import Script
```bash
cd /Users/saisharan.v/Desktop/Sulfag
CONTENTFUL_MANAGEMENT_TOKEN="paste_your_token_here" node scripts/import-to-contentful-direct.js
```

**This will import all 39 products automatically!** ✅

---

## Option 2: Use Contentful CLI with Management Token

If you have the management token:

```bash
cd /Users/saisharan.v/Desktop/Sulfag
npx contentful-cli space import \
  --space-id kvec8c4ex2a6 \
  --management-token "your_management_token_here" \
  --content-file products-contentful-import.json
```

---

## Option 3: Manual Entry (For Testing)

1. Go to: **https://app.contentful.com/spaces/kvec8c4ex2a6/entries**
2. Click **"Add entry"** → Select **"Product"**
3. Fill in fields and click **"Publish"**
4. Repeat for each product

**CSV file available:** `products-for-contentful.csv` (for copy-paste)

---

## 🎯 Recommended: Option 1

**Fastest way:** Get management token → Run direct script → Done in 30 seconds!

The direct script (`import-to-contentful-direct.js`) will:
- ✅ Connect to your space
- ✅ Import all 39 products
- ✅ Publish them automatically
- ✅ Show progress

---

## 📝 Note

**Management API Token** ≠ **Content Delivery API Token**

- **Content Delivery API Token** (you already have): `RPvP3c3p8PokHs6-kjLK-1TZL2C45gZX87dxwmIUG98`
  - Used for reading content (what your website uses)
  
- **Management API Token** (you need this): Get from Contentful dashboard
  - Used for writing/importing content

---

**Once you have the Management API token, paste it here and I'll help you run the import!** 🚀

