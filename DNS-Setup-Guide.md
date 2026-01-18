# DNS Configuration Guide: GoDaddy → Render

**Domain:** sulfag.com (or your custom domain)  
**Render Service:** sulfag-frontend.onrender.com  
**Date:** January 18, 2026

---

## 🎯 Quick Setup Guide

### Step 1: Add Custom Domain in Render

1. Go to **Render Dashboard** → Your Service (`sulfag-frontend`)
2. Navigate to **Settings** → **Custom Domains**
3. Click **"Add Custom Domain"**
4. Enter your domain:
   - For root domain: `sulfag.com`
   - For www subdomain: `www.sulfag.com`
5. Render will show you the DNS records needed

---

## 📋 DNS Records to Add in GoDaddy

### Option 1: CNAME Record (For www subdomain) ✅ Recommended

**In GoDaddy DNS Management:**

| Type | Name | Value | TTL |
|------|------|-------|-----|
| CNAME | `www` | `sulfag-frontend.onrender.com` | 600 |

**Steps:**
1. Log in to **GoDaddy** → **My Products**
2. Find your domain → Click **DNS** (or **Manage DNS**)
3. Scroll to **Records** section
4. Click **Add** → Select **CNAME**
5. Enter:
   - **Name:** `www`
   - **Value:** `sulfag-frontend.onrender.com`
   - **TTL:** 600 (or default)
6. Click **Save**

---

### Option 2: A Records (For root domain - sulfag.com)

**Note:** Render will provide IP addresses when you add the custom domain.

**In GoDaddy DNS Management:**

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | `@` | [IP Address 1 from Render] | 600 |
| A | `@` | [IP Address 2 from Render] | 600 |
| A | `@` | [IP Address 3 from Render] | 600 |
| A | `@` | [IP Address 4 from Render] | 600 |

**Steps:**
1. In **Render Dashboard** → Custom Domains → Your domain
2. Copy the **IP addresses** shown (usually 2-4 IPs)
3. In **GoDaddy DNS Management:**
   - Click **Add** → Select **A**
   - **Name:** `@` (or leave blank for root domain)
   - **Value:** [First IP address]
   - **TTL:** 600
   - Click **Save**
4. Repeat for each IP address Render provides

---

### Option 3: Use Render Nameservers (Simplest) ✅ Easiest

**Steps:**
1. In **Render Dashboard** → Custom Domains → Your domain
2. Copy the **nameservers** shown (usually 2-4 nameservers)
3. In **GoDaddy:**
   - Go to **Domain Settings** → **Nameservers**
   - Select **"Custom"** (instead of "GoDaddy Nameservers")
   - Enter the nameservers from Render:
     - `ns1.render.com`
     - `ns2.render.com`
     - (or whatever Render provides)
   - Click **Save**

**Note:** This method gives Render full control over DNS, which is simpler but means you manage DNS through Render, not GoDaddy.

---

## 🔍 Step-by-Step: GoDaddy DNS Management

### Method 1: Adding CNAME Record

1. **Log in to GoDaddy**
   - Go to [godaddy.com](https://godaddy.com)
   - Sign in to your account

2. **Access DNS Management**
   - Click **"My Products"** (top menu)
   - Find your domain (`sulfag.com` or your domain)
   - Click **"DNS"** button (or **"Manage DNS"**)

3. **Add CNAME Record**
   - Scroll to **"Records"** section
   - Click **"Add"** button
   - Select **"CNAME"** from dropdown
   - Fill in:
     ```
     Type: CNAME
     Name: www
     Value: sulfag-frontend.onrender.com
     TTL: 600 (or default)
     ```
   - Click **"Save"**

4. **Verify**
   - You should see the new CNAME record in the list
   - Wait 5-60 minutes for DNS propagation

---

### Method 2: Adding A Records

1. **Get IP Addresses from Render**
   - In Render Dashboard → Custom Domains
   - Copy the IP addresses shown

2. **Add A Records in GoDaddy**
   - Go to DNS Management (same as above)
   - Click **"Add"** → Select **"A"**
   - Fill in:
     ```
     Type: A
     Name: @ (or leave blank for root domain)
     Value: [IP Address from Render]
     TTL: 600
     ```
   - Click **"Save"**
   - Repeat for each IP address

---

## ⚠️ Important Notes

### About ANAME
- **ANAME is NOT a standard DNS record type**
- You likely mean:
  - **CNAME** for subdomains (www, blog, etc.)
  - **A record** for root domain
- Some DNS providers use "ANAME" as an alias, but GoDaddy uses standard DNS types

### Root Domain vs Subdomain
- **Root domain:** `sulfag.com` → Use **A records** (IP addresses)
- **Subdomain:** `www.sulfag.com` → Use **CNAME** (points to Render URL)

### DNS Propagation
- Changes take **5-60 minutes** to propagate
- Can take up to **24-48 hours** in rare cases
- Use [whatsmydns.net](https://www.whatsmydns.net) to check propagation

---

## ✅ Verification Steps

1. **Check DNS Propagation**
   - Visit [whatsmydns.net](https://www.whatsmydns.net)
   - Enter your domain
   - Check if CNAME/A records are showing correctly

2. **Check in Render Dashboard**
   - Go to Custom Domains
   - Status should show "Active" or "Provisioning"
   - SSL certificate will be automatically provisioned

3. **Test Your Domain**
   - Visit `https://yourdomain.com` (or `https://www.yourdomain.com`)
   - Should load your Render site
   - Should show HTTPS (SSL certificate)

---

## 🐛 Troubleshooting

### DNS Not Working?
1. **Wait longer** - DNS can take up to 48 hours
2. **Check record values** - Make sure they match Render exactly
3. **Clear DNS cache** - Use `ipconfig /flushdns` (Windows) or restart browser
4. **Check Render status** - Make sure service is running in Render

### SSL Certificate Not Provisioning?
1. **Wait** - SSL certificates take 5-10 minutes after DNS is active
2. **Check DNS** - Make sure DNS records are correct
3. **Contact Render Support** - If issues persist

### Common Mistakes
- ❌ Wrong CNAME value (should be `sulfag-frontend.onrender.com`)
- ❌ Wrong A record IPs (must use IPs from Render, not random IPs)
- ❌ Typo in domain name
- ❌ Forgetting to save changes in GoDaddy

---

## 📞 Quick Reference

**Render Service URL:** `sulfag-frontend.onrender.com`  
**Custom Domain:** `sulfag.com` (or your domain)  
**DNS Provider:** GoDaddy

**Records Needed:**
- **CNAME:** `www` → `sulfag-frontend.onrender.com`
- **A Records:** `@` → [IP addresses from Render]

**Render Dashboard:** [dashboard.render.com](https://dashboard.render.com)  
**GoDaddy DNS:** [dcc.godaddy.com](https://dcc.godaddy.com)

---

## 🎯 Recommended Setup

**For best results, use both:**

1. **CNAME for www:** `www.sulfag.com` → `sulfag-frontend.onrender.com`
2. **A Records for root:** `sulfag.com` → [IP addresses from Render]

This ensures both `sulfag.com` and `www.sulfag.com` work.

---

**Last Updated:** January 18, 2026

