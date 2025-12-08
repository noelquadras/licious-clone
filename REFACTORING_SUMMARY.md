# Backend Refactoring Summary

## ✅ Completed Changes

### 1. **Separate Collections for Each User Type**
- ✅ Created `Admin` model (separate collection)
- ✅ Updated `User` model (removed role field, now only for customers)
- ✅ Updated `Vendor` model (standalone with password, removed userId)
- ✅ Updated `DeliveryPartner` model (standalone with password, removed userId)

### 2. **Location Support (Geospatial)**
- ✅ Added location fields (latitude/longitude) to:
  - User model (for finding nearby vendors)
  - Vendor model (for location-based queries)
  - DeliveryPartner model (for dispatch)
- ✅ Added geospatial indexes (`2dsphere`) for efficient queries
- ✅ Created geospatial query function in `vendorProductController.js` to find vendors within 5km radius

### 3. **Product Structure Refactoring**
- ✅ Created `BaseProduct` model (admin-created catalog items)
- ✅ Created `VendorProduct` model (vendor's inventory items)
- ✅ Vendors can add base products to their inventory
- ✅ Products automatically track which vendor added/updated them (`addedBy`, `lastUpdatedBy`)

### 4. **Image Upload Support**
- ✅ Created `server/utils/upload.js` with multer configuration
- ✅ Supports single and multiple image uploads
- ✅ Image validation (jpeg, jpg, png, gif, webp)
- ✅ 5MB file size limit

### 5. **Authentication System**
- ✅ Created unified `authController.js` with separate login/register for:
  - Users
  - Vendors
  - Delivery Partners
  - Admins
- ✅ Updated `authMiddleware.js` to support multiple user types
- ✅ JWT tokens now include `userType` field

### 6. **Order Model Updates**
- ✅ Updated to use `VendorProduct` instead of `Product`
- ✅ Added `deliveryAddress` and `deliveryLocation` fields

---

## 🔄 Files Created/Modified

### New Files:
1. `server/models/adminModel.js` - Admin collection
2. `server/models/baseProductModel.js` - Base products (catalog)
3. `server/models/vendorProductModel.js` - Vendor inventory items
4. `server/utils/upload.js` - Image upload utilities
5. `server/controllers/authController.js` - Unified authentication
6. `server/controllers/baseProductController.js` - Base product management
7. `server/controllers/vendorProductController.js` - Vendor inventory management

### Modified Files:
1. `server/models/userModel.js` - Removed role, added location
2. `server/models/vendorModel.js` - Added password, location, removed userId
3. `server/models/deliveryPartnerModel.js` - Added password, email, location, removed userId
4. `server/models/orderModel.js` - Updated to use VendorProduct, added delivery location
5. `server/middlewares/authMiddleware.js` - Support for multiple user types

---

## ⚠️ Still Needs Implementation

### 1. **Update Existing Controllers**
The following controllers need to be updated to work with the new structure:
- `server/controllers/userController.js` - Update to use new User model
- `server/controllers/vendorController.js` - Update to use new Vendor model (remove User dependency)
- `server/controllers/deliveryPartnerController.js` - Update to use new DeliveryPartner model
- `server/controllers/cartController.js` - Update to use VendorProduct
- `server/controllers/orderController.js` - Update to use VendorProduct and new location fields
- `server/controllers/adminController.js` - Update to use Admin model

### 2. **Update Routes**
- Create new routes for authentication (`/api/auth/*`)
- Update product routes to use base products and vendor products
- Update all routes to use new authentication

### 3. **Create Uploads Directory**
- Create `server/uploads/` directory for storing images
- Add `.gitignore` entry for uploads folder

### 4. **Update Server.js**
- Add static file serving for uploads: `app.use('/uploads', express.static('uploads'))`
- Update route imports

### 5. **Cart Model Updates**
- Update cart to reference VendorProduct instead of Product

---

## 📋 API Endpoints Structure (New)

### Authentication Routes (`/api/auth`)
- `POST /api/auth/user/register` - Register user
- `POST /api/auth/user/login` - Login user
- `POST /api/auth/vendor/register` - Register vendor
- `POST /api/auth/vendor/login` - Login vendor
- `POST /api/auth/delivery/register` - Register delivery partner
- `POST /api/auth/delivery/login` - Login delivery partner
- `POST /api/auth/admin/register` - Register admin
- `POST /api/auth/admin/login` - Login admin

### Base Products (`/api/base-products`)
- `POST /api/base-products` - Admin creates base product (with images)
- `GET /api/base-products` - Get all base products
- `GET /api/base-products/:id` - Get base product by ID
- `PUT /api/base-products/:id` - Admin updates base product
- `DELETE /api/base-products/:id` - Admin deletes base product

### Vendor Products (`/api/vendor-products`)
- `POST /api/vendor-products/inventory` - Vendor adds base product to inventory
- `GET /api/vendor-products/inventory` - Get vendor's inventory
- `PUT /api/vendor-products/:id` - Vendor updates their product
- `GET /api/vendor-products/nearby` - Get products from vendors within 5km (requires lat/lng)
- `GET /api/vendor-products` - Get all vendor products (public)

### Location-Based Queries
- `GET /api/vendor-products/nearby?latitude=12.9716&longitude=77.5946&maxDistance=5000&category=Chicken`
  - Returns products from vendors within specified radius (default 5km)
  - Includes distance calculation for each vendor

---

## 🔧 Configuration Needed

### 1. Create Uploads Directory
```bash
mkdir server/uploads
```

### 2. Update server.js
Add static file serving:
```javascript
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
```

### 3. Environment Variables
No new environment variables needed (uses existing JWT_SECRET)

---

## 📝 Key Features Implemented

1. **Separate Collections**: Each user type has its own collection with authentication
2. **Location-Based Services**: Find vendors within 5km radius using geospatial queries
3. **Product Catalog System**: Admin creates base products, vendors add them to inventory
4. **Image Upload**: Support for product images with multer
5. **Automatic Tracking**: Products track which vendor added/updated them
6. **Geospatial Indexes**: Efficient location-based queries with MongoDB 2dsphere indexes

---

## 🚀 Next Steps

1. Update remaining controllers to use new models
2. Create/update routes for new endpoints
3. Test authentication flow for all user types
4. Test location-based product queries
5. Test image upload functionality
6. Update frontend to use new API structure

---

## ⚡ Important Notes

- **Location Format**: Uses GeoJSON format `[longitude, latitude]` (note: longitude first!)
- **Distance Calculation**: Uses Haversine formula for accurate distance calculation
- **Image Storage**: Images stored in `server/uploads/` directory
- **Token Structure**: JWT tokens now include `userType` field for proper authentication
- **Vendor Status**: Vendors must be "approved" before they can login
- **Delivery Partner Status**: Delivery partners must be "approved" before they can login

---

**This is a major refactoring. Test thoroughly before deploying!**

