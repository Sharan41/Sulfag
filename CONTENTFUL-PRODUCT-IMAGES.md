# Product Images in Contentful (thumbnail + full view)

Product cards show **any number of images** when they exist in Contentful.
Click a thumbnail → full-screen lightbox with prev/next arrows → close with **x**, backdrop click, or **Esc**.

## 1. Add the field (one-time)

In Contentful → **Content model** → **product** → **Add field**:

| Setting | Value |
|---------|--------|
| Field name | Images |
| Field ID | `images` |
| Type | **Media** → **Many files** (Array of Assets) |
| Validations | Accept only **Image** (no limit on count) |
| Required | No |

Or run (needs Management API token):

```bash
CONTENTFUL_MANAGEMENT_TOKEN=CFPAT-xxx node scripts/add-product-images-field.js
```

## 2. Upload images on a product

1. Open a product entry (e.g. **KITE 44**)
2. In **Images**, add as many files as needed (JPG/PNG/WebP)
3. **Publish**

Suggested order: first image = family/pack shot (card thumbnail), then close-ups or alternate views.

## 3. How the site uses them

- `src/contentful/client.js` maps `fields.images` → `product.images` (array of HTTPS URLs, no cap)
- Cards without images look as before (text only)
- Cards with images show a main thumbnail + a mini strip (if 2+) and open the lightbox on click

## Local demo

`src/data/products.json` includes sample images for **KITE 44** (`id: 37`):

- `/products/kite-44-family.png`
- `/products/kite-44-1l.png`

These load when the app falls back to local JSON (or when Contentful has no images yet for that product).
