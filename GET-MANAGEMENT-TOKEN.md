# Get Contentful Management API Token

To import products, you need a **Management API token** (different from the Content Delivery API token you already have).

## 🔑 Get Management API Token

### Step 1: Go to API Keys
1. Visit: https://app.contentful.com/spaces/kvec8c4ex2a6/api/keys
2. Or: Contentful Dashboard → Settings → API keys

### Step 2: Create Management Token
1. Click **"Content management tokens"** tab
2. Click **"Generate personal token"** or **"Create token"**
3. Name it: "Import Token" (or any name)
4. Copy the token (you'll only see it once!)

### Step 3: Use the Token
Run the import script with the token:

```bash
CONTENTFUL_MANAGEMENT_TOKEN="your_management_token_here" node scripts/import-to-contentful-direct.js
```

---

## 🎯 Alternative: Import via Web UI

If you prefer not to use CLI/scripts:

### Option 1: Manual Entry (Good for testing)
1. Go to https://app.contentful.com/spaces/kvec8c4ex2a6/entries
2. Click "Add entry" → Select "Product"
3. Fill in fields and publish
4. Repeat for each product

### Option 2: CSV Import (Easier for bulk)
1. I can create a CSV file from your products
2. Use Contentful's CSV import feature (if available)
3. Or use a Contentful app/marketplace extension

---

## 📋 Quick Test

After getting the Management token, test with one product:

```bash
# Set token
export CONTENTFUL_MANAGEMENT_TOKEN="your_token_here"

# Run import
node scripts/import-to-contentful-direct.js
```

This will import all 39 products!

---

**Need help?** Let me know once you have the Management API token and I can help run the import!

