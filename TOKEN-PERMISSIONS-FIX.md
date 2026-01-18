# 🔐 Token Permissions Issue

The Management API token you provided doesn't have access to the space. Here's how to fix it:

## ✅ Solution: Create Token with Correct Permissions

### Step 1: Go to API Keys
1. Visit: **https://app.contentful.com/spaces/kvec8c4ex2a6/api/keys**
2. Or: Contentful Dashboard → Settings → API keys

### Step 2: Create Management Token
1. Click **"Content management tokens"** tab
2. Click **"Generate personal token"** or **"Create token"**
3. **Important:** Make sure it has these permissions:
   - ✅ **Content management** (full access)
   - ✅ **Read and write** access to the space
   - ✅ **Organization access** (if required)

### Step 3: Alternative - Use Personal Access Token
If "Content management tokens" doesn't work, try:
1. Go to: **https://app.contentful.com/account/profile/api_tokens**
2. Click **"Create personal access token"**
3. Name it: "Import Token"
4. Select **"Content management"** scope
5. Copy the token

---

## 🎯 Quick Test: Manual Entry

While fixing the token, you can test by adding products manually:

1. Go to: **https://app.contentful.com/spaces/kvec8c4ex2a6/entries**
2. Click **"Add entry"** → Select **"Product"**
3. Fill in one product:
   - **Product Name:** `ACEPHATE 75% SP`
   - **Brand:** `SULFAG`
   - **Packing:** `10X1 KG; 20X500 GM`
   - **Crops:** `Cotton Rice Sugarcane`
   - **Target Pests:** `Jassid Bollworm`
   - **Category:** Type `insecticides` (or select from dropdown if it's a dropdown)
   - **ID:** `4`
4. Click **"Publish"**
5. Test on your website!

---

## 📋 Common Issues

### Issue 1: Token doesn't have space access
**Fix:** Make sure the token is created for the correct space/organization

### Issue 2: Token expired
**Fix:** Generate a new token

### Issue 3: Wrong token type
**Fix:** Use "Content management tokens" not "Content delivery / preview tokens"

---

## 🔄 Once You Have the Correct Token

Run the import again:
```bash
cd /Users/saisharan.v/Desktop/Sulfag
CONTENTFUL_MANAGEMENT_TOKEN="new_token_here" node scripts/import-to-contentful-direct.js
```

Or with CLI:
```bash
npx contentful-cli space import \
  --space-id kvec8c4ex2a6 \
  --management-token "new_token_here" \
  --content-file products-contentful-import.json
```

---

**Try creating a new token with full content management permissions and share it!** 🚀

