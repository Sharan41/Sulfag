# Product Images in Contentful (thumbnail + full view)

Product cards show **up to 2 images** when they exist in Contentful.
Click a thumbnail → full-screen lightbox → close with **×**, backdrop click, or **Esc**.

## 1. Add the field (one-time)

In Contentful → **Content model** → **product** → **Add field**:

| Setting | Value |
|---------|--------|
| Field name | Images |
| Field ID | `images` |
| Type | **Media** → **Many files** (Array of Assets) |
| Validations | Accept only **Image**; **Limit** size to **max 2** |
| Required | No |

Or run (needs Management API token):

```bash
CONTENTFUL_MANAGEMENT_TOKEN=CFPAT-xxx node scripts/add-product-images-field.js
```

## 2. Upload images on a product

1. Open a product entry (e.g. **KITE 44**)
2. In **Images**, add 1 or 2 files (JPG/PNG/WebP)
3. **Publish**

Suggested order: first image = family/pack shot (card thumbnail), second = single bottle close-up.

## 3. How the site uses them

- `src/contentful/client.js` maps `fields.images` → `product.images` (up to 2 HTTPS URLs)
- Cards without images look as before (text only)
- Cards with images show a thumbnail + mini strip (if 2) and open the lightbox on click

## Local demo

`src/data/products.json` includes sample images for **KITE 44** (`id: 37`):

- `/products/kite-44-family.png`
- `/products/kite-44-1l.png`

These load when the app falls back to local JSON (or when Contentful has no images yet for that product).
