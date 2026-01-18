/**
 * Import Products to Contentful
 * 
 * This script converts products.json to Contentful entries format
 * and provides instructions for importing to Contentful
 * 
 * Usage:
 * 1. Set up Contentful account and get credentials
 * 2. Install contentful-cli: npm install -g contentful-cli
 * 3. Run: node scripts/import-products-to-contentful.js
 * 4. Follow instructions to import to Contentful
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Read products.json
const productsPath = path.join(__dirname, '../src/data/products.json')
const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf8'))

// Convert to Contentful entries format
const entries = []

// Process insecticides
productsData.insecticides.forEach(product => {
  entries.push({
    "sys": {
      "contentType": {
        "sys": {
          "id": "product"
        }
      }
    },
    "fields": {
      "productName": {
        "en-US": product.product
      },
      "brand": {
        "en-US": product.brand
      },
      "packing": {
        "en-US": product.packing
      },
      "crops": {
        "en-US": product.crops
      },
      "targetPests": {
        "en-US": product.pests
      },
      "category": {
        "en-US": "insecticides"
      },
      "id": {
        "en-US": product.id
      }
    }
  })
})

// Process fungicides
productsData.fungicides.forEach(product => {
  entries.push({
    "sys": {
      "contentType": {
        "sys": {
          "id": "product"
        }
      }
    },
    "fields": {
      "productName": {
        "en-US": product.product
      },
      "brand": {
        "en-US": product.brand
      },
      "packing": {
        "en-US": product.packing
      },
      "crops": {
        "en-US": product.crops
      },
      "targetPests": {
        "en-US": product.pests
      },
      "category": {
        "en-US": "fungicides"
      },
      "id": {
        "en-US": product.id
      }
    }
  })
})

// Process herbicides
productsData.herbicides.forEach(product => {
  entries.push({
    "sys": {
      "contentType": {
        "sys": {
          "id": "product"
        }
      }
    },
    "fields": {
      "productName": {
        "en-US": product.product
      },
      "brand": {
        "en-US": product.brand
      },
      "packing": {
        "en-US": product.packing
      },
      "crops": {
        "en-US": product.crops
      },
      "targetPests": {
        "en-US": product.pests
      },
      "category": {
        "en-US": "herbicides"
      },
      "id": {
        "en-US": product.id
      }
    }
  })
})

// Process specialty (if any)
if (productsData.specialty && productsData.specialty.length > 0) {
  productsData.specialty.forEach(product => {
    entries.push({
      "sys": {
        "contentType": {
          "sys": {
            "id": "product"
          }
        }
      },
      "fields": {
        "productName": {
          "en-US": product.product
        },
        "brand": {
          "en-US": product.brand
        },
        "packing": {
          "en-US": product.packing
        },
        "crops": {
          "en-US": product.crops
        },
        "targetPests": {
          "en-US": product.pests
        },
        "category": {
          "en-US": "specialty"
        },
        "productId": {
          "en-US": product.id
        }
      }
    })
  })
}

// Create import file
const importData = {
  "contentTypes": [
    {
      "sys": {
        "id": "product"
      },
      "name": "Product",
      "description": "Agricultural product information",
      "displayField": "productName",
      "fields": [
        {
          "id": "productName",
          "name": "Product Name",
          "type": "Symbol",
          "required": true,
          "localized": false
        },
        {
          "id": "brand",
          "name": "Brand",
          "type": "Symbol",
          "required": true,
          "localized": false
        },
        {
          "id": "packing",
          "name": "Packing",
          "type": "Text",
          "required": true,
          "localized": false
        },
        {
          "id": "crops",
          "name": "Crops",
          "type": "Text",
          "required": true,
          "localized": false
        },
        {
          "id": "targetPests",
          "name": "Target Pests",
          "type": "Text",
          "required": true,
          "localized": false
        },
        {
          "id": "category",
          "name": "Category",
          "type": "Symbol",
          "required": true,
          "localized": false,
          "validations": [
            {
              "in": ["insecticides", "fungicides", "herbicides", "specialty"]
            }
          ]
        },
        {
          "id": "id",
          "name": "ID",
          "type": "Integer",
          "required": true,
          "localized": false
        }
      ]
    }
  ],
  "entries": entries
}

// Write to file
const outputPath = path.join(__dirname, '../products-contentful-import.json')
fs.writeFileSync(outputPath, JSON.stringify(importData, null, 2))

console.log('✅ Contentful import file created!')
console.log(`📁 File: ${outputPath}`)
console.log(`📊 Total products: ${entries.length}`)
console.log('\n📋 Next steps:')
console.log('1. Set up Contentful account (see CONTENTFUL-SETUP-STEPS.md)')
console.log('2. Create Product content type in Contentful')
console.log('3. Install Contentful CLI: npm install -g contentful-cli')
console.log('4. Login: contentful login')
console.log('5. Import: contentful space import --space-id YOUR_SPACE_ID --content-file products-contentful-import.json')

