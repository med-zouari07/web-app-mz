# Backend Quick Start Guide

## What's Included

Complete Express.js backend server for CMI payment processing with test credentials ready to use immediately.

### Backend Files Created
- `backend/server.js` - Main Express server with all payment endpoints
- `backend/package.json` - Dependencies (Express, CORS, Supabase, crypto)
- `backend/.env.example` - Environment variables template
- `backend/cmi-utils.js` - CMI payment utilities and signature generation
- `backend/README.md` - Detailed backend documentation
- `backend/DATABASE_SCHEMA.sql` - SQL schema for donations table
- `PAYMENT_INTEGRATION_GUIDE.md` - Complete integration guide for frontend

## Installation (5 Minutes)

### Step 1: Navigate to Backend Directory
```bash
cd backend
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Create Environment File
```bash
cp .env.example .env
```

### Step 4: (Optional) Update Supabase Credentials
Edit `.env` and add your Supabase URL and keys:
```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Step 5: Start the Server
```bash
npm run dev
```

You'll see:
```
Backend server running on http://localhost:5000
Environment: development
CMI Gateway: https://test.cmi.co.ma/fim/est3Dgate
```

## Test the Backend

### Check Health
```bash
curl http://localhost:5000/api/health
```

Response:
```json
{
  "status": "ok",
  "message": "Backend is running"
}
```

### Test CMI Configuration
```bash
curl http://localhost:5000/api/test/cmi-config
```

Response shows test merchant credentials ready to use.

## CMI Test Credentials (Pre-configured)

```
Merchant ID: 00000000000000000000000000000
Store Key: 0000000000000000000000000000000000000000
Client ID: test-client-id
Gateway: https://test.cmi.co.ma/fim/est3Dgate
```

## Test Card Numbers (For Payments)

| Card | Number | CVV | Expiry | Result |
|------|--------|-----|--------|--------|
| Visa | 4111111111111111 | Any 3 digits | Any future | Success |
| MasterCard | 5555555555554444 | Any 3 digits | Any future | Success |
| Test Decline | 4000000000000002 | Any 3 digits | Any future | Decline |

## Database Setup

The donations table was automatically created via Supabase migration. To verify:

1. Go to Supabase Dashboard
2. Click "SQL Editor"
3. Run this query to check:
```sql
SELECT * FROM donations LIMIT 1;
```

## API Endpoints Available

### 1. Create Payment
```bash
curl -X POST http://localhost:5000/api/payments/create \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 100,
    "donorName": "أحمد محمد",
    "donorEmail": "ahmed@example.com",
    "donorPhone": "+212612345678",
    "campaign": "orphan-support",
    "message": "جزاكم الله خيرا",
    "language": "ar"
  }'
```

### 2. Check Donation Status
```bash
curl http://localhost:5000/api/donations/ORD-1234567890-abcd1234
```

### 3. Admin: Get All Donations
```bash
curl http://localhost:5000/api/admin/donations?status=pending
```

## Connect to Frontend

### In Frontend `.env.local`
```
VITE_BACKEND_URL=http://localhost:5000
```

### Update DonationForm.tsx
See `PAYMENT_INTEGRATION_GUIDE.md` for complete code example.

## Key Features

✓ **HMAC-SHA1 Signature Generation** - Secure CMI communication
✓ **Order Management** - Unique order IDs for tracking
✓ **Database Integration** - All donations stored in Supabase
✓ **Payment Status Tracking** - Pending/Completed/Failed states
✓ **Admin API** - View all donations with filtering
✓ **Error Handling** - Comprehensive error messages
✓ **CORS Enabled** - Works with frontend from any origin
✓ **Test Mode** - Full test environment included

## File Structure

```
backend/
├── server.js              # Main Express server
├── cmi-utils.js          # CMI utility functions
├── package.json          # Dependencies
├── .env.example          # Environment template
├── .env                  # Your configuration (create from example)
├── DATABASE_SCHEMA.sql   # Database setup script
├── README.md             # Full documentation
└── node_modules/         # Dependencies (after npm install)
```

## Development vs Production

### Development
- Test merchant ID: `00000000000000000000000000000`
- Test store key: `0000000000000000000000000000000000000000`
- Gateway: `https://test.cmi.co.ma/fim/est3Dgate`
- No real money charged

### Production (When Ready)
You'll need to:
1. Contact Attijariwafa Bank for production credentials
2. Update `.env` with production merchant ID and store key
3. Change gateway URL to production endpoint
4. Update all success/failure URLs to production domain
5. Set `NODE_ENV=production`

## Troubleshooting

### Port Already in Use
If port 5000 is already in use:
```bash
PORT=5001 npm run dev
```

### CORS Error in Frontend
Make sure `FRONTEND_URL` in `.env` matches your frontend URL:
```env
FRONTEND_URL=http://localhost:5173
```

### Database Connection Error
Check Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Payment Creation Fails
Check:
1. Backend is running (`npm run dev`)
2. Port 5000 is accessible
3. Supabase connection is working
4. Check browser console for detailed error

## Next Steps

1. **Test Payment Flow** (5 min)
   - Start backend
   - Create payment
   - Use test card 4111111111111111
   - Verify donation in database

2. **Integrate with Frontend** (15 min)
   - Update DonationForm.tsx (see guide)
   - Connect to backend URL
   - Test full donation flow

3. **Deploy Backend** (When ready)
   - Get production CMI credentials
   - Deploy to Heroku/Railway/DigitalOcean
   - Update frontend URLs

4. **Go Live** (Final step)
   - Request production credentials from bank
   - Update all configuration
   - Final testing with real cards
   - Monitor transactions

## Support Resources

- **Backend Details**: `backend/README.md`
- **Payment Integration**: `PAYMENT_INTEGRATION_GUIDE.md`
- **CMI Support**: support@cmi.co.ma
- **Attijariwafa Bank**: Your account manager

## Commands Reference

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start

# Check if backend is running
curl http://localhost:5000/api/health
```

## All Set!

Your backend is ready to handle CMI payments. The test credentials are pre-configured, so you can start testing immediately. When you're ready to go live, just update the credentials in `.env` with your production merchant ID and store key from Attijariwafa Bank.

Happy coding! 🚀
