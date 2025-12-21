# CMI Payment Integration Guide

Complete guide for integrating CMI payment gateway with Bon Voisinage frontend.

## Overview

The payment system works in 3 components:

1. **Frontend** (React) - Donation form
2. **Backend** (Node.js/Express) - Payment processing
3. **CMI Gateway** - Credit card processing

## Quick Start

### 1. Start the Backend Server

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Server will run on `http://localhost:5000`

### 2. Update Frontend Environment

Add to `.env.local`:
```
VITE_BACKEND_URL=http://localhost:5000
```

### 3. Create Payment Form Handler

Update `src/components/DonationForm.tsx`:

```typescript
import { useState } from 'react';

export default function DonationForm({ language, translations }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    fullName: '',
    email: '',
    phone: '',
    campaign: '',
    message: '',
  });

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

      // Step 1: Create payment request
      const response = await fetch(`${backendUrl}/api/payments/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(formData.amount),
          donorName: formData.fullName,
          donorEmail: formData.email,
          donorPhone: formData.phone,
          campaign: formData.campaign,
          message: formData.message,
          language: language,
        }),
      });

      if (!response.ok) {
        throw new Error('Payment creation failed');
      }

      const { cmiUrl, formData: cmiFormData } = await response.json();

      // Step 2: Create and submit form to CMI
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = cmiUrl;
      form.style.display = 'none';

      Object.entries(cmiFormData).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value as string;
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();

    } catch (error) {
      console.error('Payment error:', error);
      alert('خطأ في معالجة الدفع - الرجاء المحاولة مرة أخرى');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handlePayment}>
      {/* Form fields */}
    </form>
  );
}
```

## Payment Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│                  Frontend (React)                        │
│  ┌──────────────────────────────────────────────────┐   │
│  │  1. User fills donation form                     │   │
│  │  2. Submits to backend /api/payments/create      │   │
│  └────────────────┬─────────────────────────────────┘   │
└────────────────────┼──────────────────────────────────────┘
                     │ POST /api/payments/create
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Backend (Node.js/Express)                   │
│  ┌──────────────────────────────────────────────────┐   │
│  │  1. Generate unique Order ID                     │   │
│  │  2. Create HMAC-SHA1 signature                   │   │
│  │  3. Save donation to Supabase                    │   │
│  │  4. Return CMI form data                         │   │
│  └────────────────┬─────────────────────────────────┘   │
│                   │                                      │
│  Returns: { cmiUrl, formData }                           │
└────────────────────┼──────────────────────────────────────┘
                     │ POST CMI Gateway
                     ▼
┌─────────────────────────────────────────────────────────┐
│            CMI Payment Gateway                           │
│  ┌──────────────────────────────────────────────────┐   │
│  │  1. Display payment form                         │   │
│  │  2. User enters card details                     │   │
│  │  3. Process payment                              │   │
│  │  4. Redirect back to backend                     │   │
│  └────────────────┬─────────────────────────────────┘   │
└────────────────────┼──────────────────────────────────────┘
                     │ POST /api/payments/success (or failure)
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Backend (Callback)                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │  1. Verify CMI signature                         │   │
│  │  2. Update donation status                       │   │
│  │  3. Store transaction ID                         │   │
│  │  4. Redirect to frontend success/failure page    │   │
│  └────────────────┬─────────────────────────────────┘   │
└────────────────────┼──────────────────────────────────────┘
                     │ Redirect to frontend
                     ▼
┌─────────────────────────────────────────────────────────┐
│           Frontend (Result Page)                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Display success/failure message                 │   │
│  │  Show donation confirmation                      │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## Test Credentials

### CMI Test Account
```
Merchant ID: 00000000000000000000000000000
Store Key: 0000000000000000000000000000000000000000
Client ID: test-client-id
Gateway URL: https://test.cmi.co.ma/fim/est3Dgate
```

### Test Card Numbers

| Card Type | Number | CVV | Expiry |
|-----------|--------|-----|--------|
| Visa | 4111111111111111 | 123 | 12/25 |
| MasterCard | 5555555555554444 | 456 | 12/25 |
| Decline | 4000000000000002 | Any | Future |

## API Endpoints Reference

### Create Payment
```http
POST /api/payments/create
Content-Type: application/json

{
  "amount": 100,
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
    "hash": "HMAC-SHA1-SIGNATURE",
    "rnd": "random-string"
  }
}
```

### Get Donation Status
```http
GET /api/donations/:orderId

Response:
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

### Admin: Get All Donations
```http
GET /api/admin/donations?status=completed&campaign=orphan-support

Response:
{
  "success": true,
  "donations": [...],
  "total": 15
}
```

## Frontend Pages Required

### 1. Payment Success Page
Create `src/pages/PaymentSuccess.tsx`:

```typescript
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('oid');
  const [donation, setDonation] = useState(null);

  useEffect(() => {
    if (orderId) {
      fetch(`http://localhost:5000/api/donations/${orderId}`)
        .then(r => r.json())
        .then(d => setDonation(d.donation));
    }
  }, [orderId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="text-center">
        <CheckCircle size={64} className="text-green-600 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-green-600 mb-2">
          شكراً على تبرعك
        </h1>
        {donation && (
          <div className="mt-4 bg-white p-6 rounded-lg shadow">
            <p>المبلغ: {donation.amount} درهم</p>
            <p>رقم المعاملة: {donation.order_id}</p>
          </div>
        )}
      </div>
    </div>
  );
}
```

### 2. Payment Failure Page
Create `src/pages/PaymentFailure.tsx`:

```typescript
import { useSearchParams } from 'react-router-dom';
import { XCircle } from 'lucide-react';

export default function PaymentFailure() {
  const [searchParams] = useSearchParams();
  const errorCode = searchParams.get('errorCode');

  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50">
      <div className="text-center">
        <XCircle size={64} className="text-red-600 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-red-600 mb-2">
          فشلت المعاملة
        </h1>
        <p className="text-gray-600">
          حدث خطأ أثناء معالجة دفعتك. الرجاء المحاولة مرة أخرى.
        </p>
        {errorCode && (
          <p className="text-sm text-gray-500 mt-4">
            رمز الخطأ: {errorCode}
          </p>
        )}
        <button
          onClick={() => window.history.back()}
          className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg"
        >
          العودة
        </button>
      </div>
    </div>
  );
}
```

## Testing Checklist

- [ ] Backend server starts without errors
- [ ] Database connection is established
- [ ] Health check endpoint responds
- [ ] Payment creation endpoint works
- [ ] Form submits to CMI gateway
- [ ] Success callback updates database
- [ ] Failure callback handles errors
- [ ] Donation status can be retrieved
- [ ] Admin can view all donations
- [ ] Signatures verify correctly

## Common Issues & Solutions

### Issue: "Failed to create payment request"
**Solution**:
- Check backend is running
- Verify Supabase credentials in `.env`
- Check network tab in browser DevTools

### Issue: "Invalid signature"
**Solution**:
- Verify Store Key matches CMI config
- Ensure all parameters in correct order
- Check that rnd hasn't been modified

### Issue: "Database connection failed"
**Solution**:
- Check Supabase URL and key
- Verify service role key has correct permissions
- Run DATABASE_SCHEMA.sql migration

### Issue: "Donations table not found"
**Solution**:
- Run `DATABASE_SCHEMA.sql` in Supabase SQL editor
- Check that migrations ran successfully
- Verify table exists in Supabase dashboard

## Security Best Practices

1. **Never expose Store Key**
   - Keep Store Key only on backend
   - Never commit to version control

2. **Validate all inputs**
   - Check amounts on backend
   - Validate email addresses
   - Sanitize phone numbers

3. **Verify signatures**
   - Always verify CMI responses
   - Check order amounts match
   - Verify order IDs exist

4. **Use HTTPS**
   - All production URLs must be HTTPS
   - Redirect HTTP to HTTPS

5. **Log everything**
   - Log all payment attempts
   - Keep transaction history
   - Monitor for fraud

## Deployment

### Deploy Backend to Heroku

```bash
cd backend
heroku create your-app-name
heroku config:set VITE_SUPABASE_URL=...
heroku config:set SUPABASE_SERVICE_ROLE_KEY=...
heroku config:set CMI_MERCHANT_ID=...
heroku config:set CMI_STORE_KEY=...
git push heroku main
```

### Deploy Frontend

```bash
npm run build
# Deploy dist folder to Vercel, Netlify, or GitHub Pages
```

## Production Checklist

- [ ] Get production CMI credentials from Attijariwafa Bank
- [ ] Update CMI_MERCHANT_ID and CMI_STORE_KEY
- [ ] Update CMI_GATEWAY_URL to production
- [ ] Update all URLs to use HTTPS
- [ ] Update FRONTEND_URL to production domain
- [ ] Set NODE_ENV=production
- [ ] Enable database backups
- [ ] Setup error monitoring
- [ ] Test with real test cards
- [ ] Review security settings
- [ ] Setup SSL certificate

## Support

For issues or questions:
1. Check the README.md in backend folder
2. Review CMI documentation
3. Contact Attijariwafa Bank for CMI support
4. Check server logs for detailed errors
