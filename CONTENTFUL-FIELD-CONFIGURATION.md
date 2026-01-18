# 📋 Contentful Field Configuration Guide

## Current Category Field Setup

**Field Name:** Category  
**Field ID:** `category`  
**Current Type:** Array  
**Current Validation:** None (allows any text)

---

## ✅ Recommended: Change to Symbol with Validation

### Why Change?

- **Current:** Array field - allows any text, prone to errors
- **Recommended:** Symbol with "In" validation - dropdown with predefined values

### How to Change:

1. **Go to:** https://app.contentful.com/spaces/kvec8c4ex2a6/content_types/product
2. **Click "Category" field**
3. **Change field type** from "Array" to **"Short text" (Symbol)**
4. **Add validation:**
   - Click "Add validation"
   - Select "In"
   - Add values:
     ```
     insecticides
     fungicides
     herbicides
     specialty
     ```
5. **Save field**
6. **Save content type**

### Result:

- Dropdown menu instead of text input
- Only 4 valid options
- No spelling mistakes possible

---

## ⚠️ Important: Update Existing Products

After changing field type, you may need to update existing products:

1. **Go to:** https://app.contentful.com/spaces/kvec8c4ex2a6/entries
2. **Edit each product**
3. **Select correct category** from dropdown
4. **Save**

---

## 🔄 Alternative: Keep Array but Add Validation

If you want to keep Array type (for multiple categories):

1. **Keep field as Array**
2. **Add validation to array items:**
   - Click "Add validation" on array items
   - Select "In"
   - Add the 4 values
3. **Result:** Can select multiple categories, but only from predefined list

---

**Recommendation:** Use Symbol with "In" validation for single category selection (simpler and faster).

