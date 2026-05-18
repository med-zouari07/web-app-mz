# Bon Voisinage Backend - Payment Processing Server

Complete Node.js/Express backend for handling CMI  payment gateway integration for donations.

## Features

- Express.js REST API
- CMI payment gateway integration
- Secure signature generation (HMAC-SHA1)
- Supabase database integration
- Donation record management
- Payment status tracking
- Test and production modes

## Prerequisites

- Node.js v16+ and npm
- Supabase account with project
- CMI merchant account (for production)

## Installation

1. Install dependencies:
```bash
cd backend
npm install
```

2. Create `.env` file from template:
```bash
cp .env.example .env
```

3. Configure environment variables in `.env`

## Environment Variables

```env
# Server
PORT=5000
NODE_ENV=development

# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# CMI (Test Credentials Provided)
CMI_MERCHANT_ID=00000000000000000000000000000
CMI_STORE_KEY=0000000000000000000000000000000000000000
CMI_CLIENT_ID=test-client-id
CMI_GATEWAY_URL=https://test.cmi.co.ma/fim/est3Dgate

# URLs
FRONTEND_URL=http://localhost:5173
SUCCESS_URL=http://localhost:5173/payment/success
FAILURE_URL=http://localhost:5173/payment/failure
CANCEL_URL=http://localhost:5173/payment/cancel
```

## Running the Server

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

Server will run on `http://localhost:5000`

## API Endpoints

### 1. Health Check
```
GET /api/health
```
Response:
```json
{
  "status": "ok",
  "message": "Backend is running"
}
```

### 2. Create Payment Request
```
POST /api/payments/create
```

Request Body:
```json
{
  "amount": 100.00,
  "donorName": "أحمد محمد",
  "donorEmail": "ahmed@example.com",
  "donorPhone": "+212612345678",
  "campaign": "orphan-support",
  "message": "جزاكم الله خيرا",
  "language": "ar"
}
```

Response:
```json
{
  "success": true,
  "orderId": "ORD-1703001234567-a1b2c3d4",
  "cmiUrl": "https://test.cmi.co.ma/fim/est3Dgate",
  "formData": {
    "clientid": "test-client-id",
    "amount": "10000",
    "currency": "504",
    "oid": "ORD-1703001234567-a1b2c3d4",
    "okUrl": "http://localhost:5173/payment/success",
    "failUrl": "http://localhost:5173/payment/failure",
    "hash": "..."
  }
}
```

### 3. Payment Success Callback
```
POST /api/payments/success
```

Automatically called by CMI when payment succeeds.

### 4. Payment Failure Callback
```
POST /api/payments/failure
```

Automatically called by CMI when payment fails.

### 5. Verify Payment Signature
```
POST /api/payments/verify
```

Request Body:
```json
{
  "clientid": "test-client-id",
  "oid": "ORD-1703001234567-a1b2c3d4",
  "amount": "10000",
  "okUrl": "http://localhost:5173/payment/success",
  "failUrl": "http://localhost:5173/payment/failure",
  "trantype": "Auth",
  "rnd": "random-string",
  "hash": "calculated-hash"
}
```

### 6. Get Donation Status
```
GET /api/donations/:orderId
```

Response:
```json
{
  "success": true,
  "donation": {
    "id": "uuid",
    "order_id": "ORD-...",
    "amount": 100.00,
    "status": "completed",
    "donor_name": "Ahmed",
    "donor_email": "ahmed@example.com",
    "campaign_id": "orphan-support",
    "transaction_id": "CMI-TXN-ID",
    "created_at": "2024-01-01T12:00:00Z"
  }
}
```

### 7. Admin: Get All Donations
```
GET /api/admin/donations?status=completed&campaign=orphan-support
```

Query Parameters:
- `status` - Filter by status (pending, completed, failed)
- `campaign` - Filter by campaign ID

### 8. Test CMI Configuration
```
GET /api/test/cmi-config
```

## Database Setup

1. Copy the SQL from `DATABASE_SCHEMA.sql`
2. Run in Supabase SQL editor:
   - Go to SQL Editor in Supabase Dashboard
   - Create new query
   - Paste the SQL content
   - Execute

Or use the migration tool:
```bash
npm run migrate
```

## Payment Flow

### Frontend → Backend → CMI → Backend → Frontend

1. **User submits donation form** (Frontend)
   ```
   POST /api/payments/create
   ```

2. **Backend creates order and generates signature** (Backend)
   - Generates unique order ID
   - Creates HMAC-SHA1 signature
   - Stores donation in database

3. **Backend returns CMI form data** (Backend → Frontend)
   - Frontend submits HTML form to CMI gateway

4. **User enters card details** (CMI Gateway)
   - Payment processing happens on CMI secure servers

5. **CMI redirects with result** (CMI → Backend)
   - Success: POST to `/api/payments/success`
   - Failure: POST to `/api/payments/failure`

6. **Backend updates donation status** (Backend)
   - Updates database with payment result
   - CMI transaction ID stored

7. **Frontend displays result** (Frontend)
   - Shows success/failure page

## CMI Test Credentials

### Test Merchant Account
- **Merchant ID**: `00000000000000000000000000000`
- **Store Key**: `0000000000000000000000000000000000000000`
- **Client ID**: `test-client-id`
- **Gateway**: `https://test.cmi.co.ma/fim/est3Dgate`

### Test Card Numbers

| Card Type | Card Number | CVV | Expiry | Result |
|-----------|-------------|-----|--------|--------|
| Visa | 4111111111111111 | Any 3 digits | Any future date | Success |
| MasterCard | 5555555555554444 | Any 3 digits | Any future date | Success |
| Test Decline | 4000000000000002 | Any 3 digits | Any future date | Declined |
| Test 3D Secure | 4532015112830366 | Any 3 digits | Any future date | 3D Secure |

**NOTE**: These are official CMI test cards. Use any future expiry date and any 3-digit CVV.

## Frontend Integration

Update `src/components/DonationForm.tsx`:

```typescript
const handlePayment = async (formData) => {
  const response = await fetch('http://localhost:5000/api/payments/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });

  const { cmiUrl, formData: cmiFormData } = await response.json();

  // Submit form to CMI
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = cmiUrl;

  Object.entries(cmiFormData).forEach(([key, value]) => {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = key;
    input.value = value;
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
};
```

## Security Considerations

1. **Never expose Store Key** in frontend - it stays on backend only
2. **Always validate signatures** - Verify CMI responses on backend
3. **Use HTTPS** in production - All transactions must be encrypted
4. **Store securely** - Keep credentials in environment variables
5. **Log transactions** - Maintain audit trail of all payments
6. **Validate amounts** - Check amounts on backend before processing

## Production Deployment

### Steps to Move to Production

1. **Get Production Credentials from Attijariwafa Bank**
   - Contact your bank representative
   - Request production CMI merchant account
   - Receive production Merchant ID and Store Key

2. **Update Environment Variables**
   ```env
   CMI_MERCHANT_ID=your-production-merchant-id
   CMI_STORE_KEY=your-production-store-key
   CMI_GATEWAY_URL=https://payment.cmi.co.ma/fim/est3Dgate
   NODE_ENV=production
   ```

3. **Update URLs**
   ```env
   FRONTEND_URL=https://www.bonvoisinage.org
   SUCCESS_URL=https://www.bonvoisinage.org/payment/success
   FAILURE_URL=https://www.bonvoisinage.org/payment/failure
   CANCEL_URL=https://www.bonvoisinage.org/payment/cancel
   ```

4. **Deploy Backend**
   - Use service like Heroku, Railway, or DigitalOcean
   - Ensure HTTPS is enabled
   - Set all environment variables on hosting platform

5. **Test Thoroughly**
   - Test with all card types
   - Test error scenarios
   - Test timeout handling

## Troubleshooting

### Payment Creation Fails
- Check Supabase connection
- Verify environment variables
- Check server logs

### CMI Signature Validation Fails
- Verify Store Key matches CMI configuration
- Check that all parameters are in correct order
- Ensure rnd value hasn't changed

### Donations Not Saving
- Check Supabase RLS policies
- Verify database schema created correctly
- Check for database connection errors

## Support & Contact

### CMI Support
- Email: support@cmi.co.ma
- Phone: [Check with your bank]
- Documentation: [CMI Portal]

### Attijariwafa Bank (Morocco)
- Payment Solutions: payment-solutions@attijariwafa.ma
- Technical Support: support@attijariwafa.ma

## Additional Resources

- [CMI Integration Documentation](https://www.cmi.co.ma/)
- [Supabase Documentation](https://supabase.com/docs)
- [Express.js Guide](https://expressjs.com/)

## License

Private - Bon Voisinage Association
