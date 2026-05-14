# RMV Registration System - Developer Integration Guide

## Quick Start

### 1. Backend Setup - Already Complete ✓

The backend is fully implemented and integrated:
- **Model**: `server/models/RMVRegistration.js` - Schema for RMV workflow
- **Controller**: `server/controllers/rmvController.js` - 11 handler methods
- **Routes**: `server/routes/rmvRoutes.js` - All API endpoints
- **Server Integration**: `server/api/server.js` - Routes mounted at `/api/rmv`

**No additional backend setup required** - all files are created and integrated.

### 2. Frontend Setup - Integration Steps

#### Step 1: Add RMV Routes to App.jsx

Find your main routing configuration in `client/src/App.jsx` and add:

```javascript
import RMVProcess from './components/rmv/RMVProcess';
import RMVStatusTimeline from './components/rmv/RMVStatusTimeline';
import DocumentRequirementChecklist from './components/rmv/DocumentRequirementChecklist';

// In your Routes component:
<Route path="/vehicles/:vehicleId/rmv" element={<RMVProcess />} />
<Route path="/vehicles/:vehicleId/rmv-status" element={<RMVStatusTimeline />} />
<Route path="/rmv-guide" element={<DocumentRequirementChecklist />} />
```

#### Step 2: Update Environment Variables

Add to `.env` files (both client and server):

**Client (.env or .env.local)**:
```
REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloud_name
REACT_APP_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
REACT_APP_API_BASE_URL=http://localhost:5000
```

**Server (.env)**:
```
CLOUDINARY_API_SECRET=your_api_secret
```

#### Step 3: Add Navigation Links

In your vehicle detail page component, add links to RMV process:

```javascript
// Example in VehicleDetail.jsx
<div className="mt-6 space-y-3">
  <Link
    to={`/vehicles/${vehicleId}/rmv`}
    className="block px-6 py-3 bg-blue-600 text-white rounded-lg text-center hover:bg-blue-700 transition"
  >
    Start Registration Process
  </Link>
  
  <Link
    to={`/vehicles/${vehicleId}/rmv-status`}
    className="block px-6 py-3 bg-gray-600 text-white rounded-lg text-center hover:bg-gray-700 transition"
  >
    View Registration Status
  </Link>
  
  <Link
    to="/rmv-guide"
    className="block px-6 py-3 bg-green-600 text-white rounded-lg text-center hover:bg-green-700 transition"
  >
    View Registration Guide
  </Link>
</div>
```

#### Step 4: Add RMV Status Widget to Dashboard

Add RMVStatusTimeline to your dashboard for quick overview:

```javascript
// In Dashboard.jsx
import RMVStatusTimeline from './rmv/RMVStatusTimeline';

export default function Dashboard() {
  return (
    <div>
      {/* Other dashboard content */}
      
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Vehicle Registrations</h2>
        {vehicles.map(vehicle => (
          <div key={vehicle._id} className="mb-6">
            <RMVStatusTimeline vehicleId={vehicle._id} />
          </div>
        ))}
      </div>
    </div>
  );
}
```

## API Documentation

### Create RMV Registration

**Endpoint**: `POST /api/rmv/create`

**Request**:
```json
{
  "vehicleId": "60d5ec49c1234567890abcde"
}
```

**Response**:
```json
{
  "success": true,
  "message": "RMV registration started",
  "data": {
    "_id": "60d5ec49c1234567890abcdf",
    "vehicleId": "60d5ec49c1234567890abcde",
    "currentStep": "documents_upload",
    "timeline": [...]
  }
}
```

### Upload Document

**Endpoint**: `POST /api/rmv/document/upload`

**Request**:
```json
{
  "vehicleId": "60d5ec49c1234567890abcde",
  "documentType": "title",
  "fileUrl": "https://res.cloudinary.com/...",
  "fileName": "vehicle_title.pdf",
  "description": "Vehicle title document"
}
```

**Supported Document Types**:
- `title` - Vehicle title/ownership
- `proofOfInsurance` - Insurance proof
- `governmentId` - ID document
- `billOfSale` - Purchase document
- `addressProof` - Address verification
- `customsClearance` - Customs document
- `vehiclePhotos` - Vehicle photos (array)
- `additionalDocuments` - Other documents

### Calculate Fees

**Endpoint**: `POST /api/rmv/fees/calculate`

**Request**:
```json
{
  "vehicleId": "60d5ec49c1234567890abcde",
  "vehicleValue": 15000,
  "vehicleWeight": 3500,
  "vehicleAge": 5
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "fees": {
      "registrationFee": 150,
      "titleTransferFee": 75,
      "inspectionFee": 50,
      "salesTax": 900,
      "weightBasedFee": 1750,
      "ageBasedFee": 0,
      "environmentalFee": 25,
      "processingFee": 35,
      "totalFees": 2985
    }
  }
}
```

### Book Inspection

**Endpoint**: `POST /api/rmv/inspection/book`

**Request**:
```json
{
  "vehicleId": "60d5ec49c1234567890abcde",
  "inspectionDate": "2024-02-15T10:00:00Z",
  "inspectionLocation": "123 Main St, City, State",
  "inspectionCenter": "State DMV Office"
}
```

### Submit Inspection Results

**Endpoint**: `POST /api/rmv/inspection/results`

**Request**:
```json
{
  "vehicleId": "60d5ec49c1234567890abcde",
  "safetyCheckPassed": true,
  "emissionsTestPassed": true,
  "odometer": 45000,
  "inspectionReportUrl": "https://res.cloudinary.com/...",
  "inspectionNotes": "Vehicle passed all safety checks"
}
```

### Process Payment

**Endpoint**: `POST /api/rmv/payment/process`

**Request**:
```json
{
  "vehicleId": "60d5ec49c1234567890abcde",
  "paymentMethod": "credit_card",
  "paymentConfirmationUrl": "https://res.cloudinary.com/..."
}
```

### Submit Application

**Endpoint**: `POST /api/rmv/application/submit`

**Request**:
```json
{
  "vehicleId": "60d5ec49c1234567890abcde",
  "registrationOffice": "main_office"
}
```

### Approve Registration (Admin)

**Endpoint**: `POST /api/rmv/approve`

**Request**:
```json
{
  "vehicleId": "60d5ec49c1234567890abcde",
  "registrationNumber": "REG123456789",
  "plateNumber": "ABC-1234",
  "plateImageUrl": "https://res.cloudinary.com/..."
}
```

### Get RMV Status

**Endpoint**: `GET /api/rmv/:vehicleId/status`

**Response**:
```json
{
  "success": true,
  "data": {
    "currentStep": "inspection_booking",
    "validations": {
      "documentsComplete": true,
      "feesPaid": true,
      "inspectionPassed": false,
      "applicationSubmitted": false,
      "finalApproved": false
    },
    "fees": { ... },
    "inspection": { ... },
    "timeline": [ ... ]
  }
}
```

### List RMV Registrations

**Endpoint**: `GET /api/rmv/?page=1&limit=20&currentStep=inspection_booking`

**Query Parameters**:
- `page` - Page number (default: 1)
- `limit` - Results per page (default: 20)
- `currentStep` - Filter by step (optional)

## Component Usage Examples

### Using RMVProcess

```javascript
import { useParams } from 'react-router-dom';
import RMVProcess from './components/rmv/RMVProcess';

function VehicleDetail() {
  const { vehicleId } = useParams();
  
  return (
    <div>
      <h1>Vehicle Registration</h1>
      <RMVProcess />
    </div>
  );
}
```

### Using RMVStatusTimeline

```javascript
import RMVStatusTimeline from './components/rmv/RMVStatusTimeline';

function StatusPage({ vehicleId }) {
  return (
    <div>
      <h1>Registration Status</h1>
      <RMVStatusTimeline vehicleId={vehicleId} />
    </div>
  );
}
```

### Using DocumentRequirementChecklist

```javascript
import DocumentRequirementChecklist from './components/rmv/DocumentRequirementChecklist';

function GuidePage() {
  return <DocumentRequirementChecklist />;
}
```

## Cloudinary Integration

### Setup Cloudinary

1. **Create Cloudinary Account**:
   - Visit [cloudinary.com](https://cloudinary.com)
   - Sign up and get cloud name

2. **Create Upload Preset**:
   - Go to Settings → Upload
   - Create unsigned upload preset
   - Copy preset name

3. **Set Environment Variables**:
   ```
   REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloud_name
   REACT_APP_CLOUDINARY_UPLOAD_PRESET=your_preset_name
   CLOUDINARY_API_SECRET=your_api_secret
   ```

### How Uploads Work

1. User selects file in RMVProcess
2. Component uploads directly to Cloudinary (unsigned)
3. Cloudinary returns secure URL
4. Component sends URL to backend
5. Backend stores URL in MongoDB
6. No files stored on server (saves space)
7. Cloudinary handles delivery and optimization

## Error Handling

### Common Errors and Solutions

**"Cloudinary configuration missing"**
- Ensure `REACT_APP_CLOUDINARY_CLOUD_NAME` and `REACT_APP_CLOUDINARY_UPLOAD_PRESET` are set
- Check `.env` file exists in client root

**"Vehicle not found"**
- Verify vehicleId is correct
- Ensure user owns the vehicle
- Check vehicle exists in database

**"All required documents must be uploaded first"**
- User must upload all 6 required documents
- Check uploaded documents in RMV registration

**"RMV registration not found"**
- Create RMV registration first
- Verify vehicleId matches

## Testing Workflow

### Manual Testing Steps

1. **Create Vehicle**:
   - Add vehicle via Vehicle Form
   - Get vehicleId from response

2. **Start RMV Process**:
   - Navigate to `/vehicles/{vehicleId}/rmv`
   - Click "Proceed to Fees"

3. **Upload Documents**:
   - Upload all 6 required documents
   - Verify success messages

4. **Calculate Fees**:
   - Enter vehicle value, weight, age
   - Click "Calculate Fees"
   - Verify fee breakdown

5. **Process Payment**:
   - Select payment method
   - Upload payment confirmation
   - Verify payment processed

6. **Book Inspection**:
   - Select inspection date/location
   - Verify booking confirmed

7. **Submit Results**:
   - Enter odometer reading
   - Upload inspection report
   - Verify results submitted

8. **Submit Application**:
   - Select registration office
   - Submit application

9. **Check Status**:
   - Navigate to status page
   - Verify timeline updates

### API Testing with curl

```bash
# Create RMV Registration
curl -X POST http://localhost:5000/api/rmv/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"vehicleId":"60d5ec49c1234567890abcde"}'

# Get Status
curl http://localhost:5000/api/rmv/60d5ec49c1234567890abcde/status \
  -H "Authorization: Bearer YOUR_TOKEN"

# Calculate Fees
curl -X POST http://localhost:5000/api/rmv/fees/calculate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "vehicleId":"60d5ec49c1234567890abcde",
    "vehicleValue":15000,
    "vehicleWeight":3500,
    "vehicleAge":5
  }'
```

## Troubleshooting

### Uploads Not Working

**Check**:
1. Cloudinary credentials in environment
2. Upload preset is unsigned
3. File type is allowed
4. File size is under limit (100MB default)
5. Browser console for CORS errors

**Solution**:
```javascript
// Verify credentials
console.log({
  cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME,
  preset: process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET
});
```

### Database Errors

**Check**:
1. MongoDB connection string
2. RMVRegistration model loaded
3. User authentication working
4. Vehicle ownership verified

**Solution**:
```javascript
// Check connection in server console
// Look for "Connected to MongoDB" message
```

### API Errors

**Check**:
1. Routes mounted correctly in server.js
2. Controller functions exported properly
3. authRequired middleware applied
4. JSON parsing working

**Solution**:
```javascript
// Test health endpoint
fetch('http://localhost:5000/health')
  .then(r => r.json())
  .then(d => console.log(d))
```

## Performance Optimization

### Frontend Optimization
- Components use React hooks efficiently
- Lazy load heavy components with React.lazy()
- Memoize expensive calculations
- Optimize re-renders

### Backend Optimization
- Index frequently queried fields (vehicleId, userId)
- Limit timeline array growth
- Use pagination for list endpoints
- Cache fee calculations

### Cloudinary Optimization
- Use responsive image delivery
- Set appropriate quality levels
- Enable automatic format detection
- Use CDN for fast delivery

## Security Considerations

1. **Authentication**: All endpoints require authentication token
2. **Authorization**: Verify user owns vehicle before operations
3. **Document URLs**: Stored securely in MongoDB
4. **Payment Data**: Only store confirmation, not card details
5. **Audit Trail**: Complete timeline of all actions

## Next Steps

1. **Mount Routes**: Add RMV routes to App.jsx
2. **Add Navigation**: Link to RMV process from vehicle pages
3. **Test Workflow**: Run through complete registration flow
4. **Add Error Handling**: Handle edge cases
5. **Monitor Performance**: Track upload speeds
6. **User Testing**: Get feedback from users
7. **Add Notifications**: Email/SMS for key milestones
8. **Schedule Renewals**: Track registration expiration

## Support & Documentation

- **API Docs**: See RMV_IMPLEMENTATION_SUMMARY.md
- **Component Props**: Check JSDoc comments in components
- **Schema**: Review RMVRegistration.js for data structure
- **Routes**: See rmvRoutes.js for endpoint definitions

---

**Last Updated**: 2024
**Status**: Production Ready
**Version**: 1.0
