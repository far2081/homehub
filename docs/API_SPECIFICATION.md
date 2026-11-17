# HomeHub Production API Specification

**Brand**: HomeHub (SHOP • STYLE • SMART)  
**Standard**: RESTful JSON API v1  
**Target Backend**: Node.js (Express / Fastify) or Python (FastAPI / Django REST Framework)  
**Authentication**: Bearer JWT tokens with HTTPS and HttpOnly secure cookies.

---

## 1. Authentication & Security Boundary

### Public Endpoints:
- Public endpoints provide read-only access to published products, magazine issues, categories, and video inspiration clips.
- Rate limiting: 100 requests / minute per client IP.

### Admin Endpoints:
- Protected with `Authorization: Bearer <admin_jwt_token>` header.
- Roles: `SUPER_ADMIN`, `STORE_MANAGER`, `EDITORIAL_DIRECTOR`.
- Audit logs generated on all write/delete operations.

---

## 2. API Endpoints

### 2.1 Products API

#### `GET /api/v1/products`
Fetch all active products with filtering, search, and sorting.
- **Query Parameters**:
  - `category` (optional, string): Filter by category slug (`furniture`, `decor`, `lighting`, `small-spaces`)
  - `q` (optional, string): Full-text search across name, material, shortDesc
  - `sort` (optional, string): `featured` | `price_asc` | `price_desc` | `name_asc`
  - `page` (optional, integer, default: 1)
  - `limit` (optional, integer, default: 24)
- **Response `200 OK`**:
```json
{
  "status": "success",
  "data": {
    "total": 14,
    "page": 1,
    "limit": 24,
    "items": [
      {
        "id": "HH-FUR-001",
        "sku": "HH-FUR-001",
        "name": "CloudCurve Sofa",
        "category": "furniture",
        "categoryLabel": "Furniture",
        "price": 345000,
        "currency": "PKR",
        "shortDesc": "Sculptural organic silhouette wrapped in tactile Italian boucle fabric.",
        "description": "The CloudCurve Sofa anchors living spaces with fluid, welcoming contours...",
        "material": "Textured Bouclé (90% Wool, 10% Linen blend), beechwood frame...",
        "dimensions": "Width: 240 cm • Depth: 105 cm • Height: 74 cm",
        "weight": "78 kg",
        "stock": 6,
        "isFeatured": true,
        "variants": [
          { "id": "ivory", "name": "Soft Ivory", "hex": "#F8F5EF", "isDefault": true },
          { "id": "warm-beige", "name": "Warm Beige", "hex": "#EADCCB" }
        ],
        "images": [
          {
            "url": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc",
            "caption": "Main Product View",
            "type": "main"
          }
        ],
        "relatedSkus": ["HH-FUR-002", "HH-FUR-003"]
      }
    ]
  }
}
```

#### `GET /api/v1/products/:sku`
Fetch a single product by SKU.
- **Response `200 OK`**: Product object.
- **Response `404 Not Found`**: When SKU is invalid.

#### `POST /api/v1/admin/products` *(Admin Only)*
Create a new product.
- **Headers**: `Authorization: Bearer <token>`
- **Payload**: Full product specification.
- **Response `201 Created`**.

#### `PUT /api/v1/admin/products/:sku` *(Admin Only)*
Update price, stock, variants, or descriptions.
- **Response `200 OK`**.

#### `DELETE /api/v1/admin/products/:sku` *(Admin Only)*
Soft delete product from active catalogue.
- **Response `204 No Content`**.

---

### 2.2 Magazines API

#### `GET /api/v1/magazines`
List all published digital books.
- Returns overview of:
  - `living-edit`: The Living Edit (Vol 1)
  - `objects-of-home`: Objects of Home (Vol 2)
  - `light-life`: Light / Life (Vol 3)
  - `small-spaces`: Small Spaces (Vol 4)

#### `GET /api/v1/magazines/:bookId`
Fetch full spread pages, editorial essays, quotes, and product hotspots for a specific book.

---

### 2.3 Checkout & Orders API

#### `POST /api/v1/orders/checkout-session`
Initialize a verified payment session.
- **Payload**:
```json
{
  "items": [
    { "sku": "HH-FUR-001", "quantity": 1, "variantId": "ivory" }
  ],
  "shippingAddress": {
    "name": "Ayesha Malik",
    "phone": "+92 300 1234567",
    "street": "14-C, 12th Commercial Street, Phase II",
    "city": "Karachi",
    "postalCode": "75500",
    "country": "Pakistan"
  },
  "paymentMethod": "payfast" // or "stripe", "bank_transfer", "cash_on_delivery"
}
```
- **Response `200 OK`**: Payment gateway redirect URL or transfer instruction token.

#### `POST /api/v1/webhooks/payment`
Receives cryptographically verified webhook signatures from payment providers (Stripe, PayFast, etc.) to transition order status from `PENDING` to `PAID`.
