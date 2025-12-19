# CMI Payment Integration Guide

This guide explains how to integrate the CMI (Centre Monétique Interbancaire) payment gateway with Attijariwafa Bank for your charity donation platform.

## Overview

The current implementation collects donation information and displays a contact number. To enable actual online payments through CMI, you'll need to:

1. Contact Attijariwafa Bank to set up a CMI merchant account
2. Obtain your CMI credentials
3. Implement server-side payment processing
4. Configure the payment form to submit to CMI gateway

## Required Credentials from Attijariwafa Bank

Contact your Attijariwafa Bank representative to obtain:

- **Merchant ID** (OID)
- **Store Key** (Secret Key)
- **CMI Gateway URL** (Production and Test URLs)
- **Return URLs** (OK URL, Fail URL)

## Implementation Steps

### 1. Backend Server Setup

You need a backend server to:
- Generate secure payment signatures
- Store donation records
- Handle CMI callbacks
- Process payment confirmations

Recommended stack:
- Node.js/Express or Python/Flask
- Database to store donation records
- Supabase (already available in this project)

### 2. CMI Payment Flow

```
User fills form → Frontend sends to Backend → Backend creates CMI request
→ Backend signs request with Store Key → Redirect to CMI Gateway
→ User enters card details → CMI processes payment
→ CMI redirects back with result → Backend verifies response
→ Update donation status
```

### 3. Required CMI Parameters

When submitting to CMI gateway, you need:

```
- clientid: Your merchant ID
- amount: Amount in cents (e.g., 100.00 MAD = 10000)
- currency: 504 (Moroccan Dirham)
- oid: Unique order ID
- okUrl: Success return URL
- failUrl: Failure return URL
- shopurl: Your website URL
- trantype: "PreAuth" or "Auth"
- lang: "ar" | "fr" | "en"
- hash: HMAC-SHA1 signature
- rnd: Random string for security
```

### 4. Implementing Backend Payment Handler

Create a Supabase Edge Function:

```typescript
// supabase/functions/create-payment/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const { amount, donorInfo, campaign } = await req.json()

  // 1. Store donation in database
  // 2. Generate unique order ID
  // 3. Create CMI hash signature
  // 4. Return CMI form data

  return new Response(JSON.stringify({
    cmiUrl: "https://payment.cmi.co.ma/fim/est3Dgate",
    formData: {
      clientid: "YOUR_MERCHANT_ID",
      amount: amount * 100,
      currency: "504",
      oid: orderID,
      // ... other parameters
      hash: generatedHash
    }
  }))
})
```

### 5. Update Frontend Form

Modify `src/components/DonationForm.tsx`:

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // Call your backend to create payment
  const response = await fetch('/api/create-payment', {
    method: 'POST',
    body: JSON.stringify({ amount, donorInfo, campaign })
  });

  const { cmiUrl, formData } = await response.json();

  // Create and submit form to CMI
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = cmiUrl;

  Object.keys(formData).forEach(key => {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = key;
    input.value = formData[key];
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
};
```

### 6. Handle Payment Callbacks

Create callback handlers for:

**Success URL** (`/payment/success`):
- Verify CMI response signature
- Update donation status to "completed"
- Send confirmation email
- Display thank you page

**Failure URL** (`/payment/failure`):
- Log failed transaction
- Display error message
- Allow retry

## Security Considerations

1. **Never expose Store Key** in frontend code
2. **Always validate signatures** on backend
3. **Use HTTPS** for all transactions
4. **Store sensitive data** securely in environment variables
5. **Log all transactions** for audit trail

## Testing

CMI provides a test environment:
- Test Merchant ID and credentials
- Test card numbers for different scenarios
- No real money is charged

Test cards provided by CMI:
- Success: Check with your bank representative
- Failure: Check with your bank representative

## Database Schema

Add to your Supabase database:

```sql
CREATE TABLE donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id TEXT UNIQUE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'MAD',
  donor_name TEXT NOT NULL,
  donor_email TEXT NOT NULL,
  donor_phone TEXT NOT NULL,
  campaign_id TEXT,
  message TEXT,
  status TEXT DEFAULT 'pending',
  payment_method TEXT DEFAULT 'cmi',
  transaction_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_donations_order_id ON donations(order_id);
CREATE INDEX idx_donations_status ON donations(status);
```

## Next Steps

1. Contact Attijariwafa Bank at: [Your bank representative contact]
2. Request CMI merchant account setup
3. Obtain test credentials
4. Implement backend payment processing
5. Test with CMI test environment
6. Request production credentials
7. Deploy to production

## Support

For CMI technical integration support:
- CMI Support: support@cmi.co.ma
- Attijariwafa Bank: Your account manager

For this application:
- Developer: Check repository documentation
