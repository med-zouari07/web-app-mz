const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Supabase Client
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// CMI Configuration
const CMI_CONFIG = {
  merchantId: process.env.CMI_MERCHANT_ID || '00000000000000000000000000000',
  storeKey: process.env.CMI_STORE_KEY || '0000000000000000000000000000000000000000',
  clientId: process.env.CMI_CLIENT_ID || 'test-client-id',
  gatewayUrl: process.env.CMI_GATEWAY_URL || 'https://test.cmi.co.ma/fim/est3Dgate',
  successUrl: process.env.SUCCESS_URL || 'http://localhost:5173/payment/success',
  failureUrl: process.env.FAILURE_URL || 'http://localhost:5173/payment/failure',
  cancelUrl: process.env.CANCEL_URL || 'http://localhost:5173/payment/cancel',
};

// Utility Functions
function generateHash(data, storeKey) {
  const hash = crypto
    .createHmac('sha1', storeKey)
    .update(data)
    .digest('base64');
  return hash;
}

function generateRandomString(length = 16) {
  return crypto.randomBytes(length).toString('hex');
}

// Endpoints

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

// Create Payment Request
app.post('/api/payments/create', async (req, res) => {
  try {
    const { amount, donorName, donorEmail, donorPhone, campaign, message, language } = req.body;

    // Validate input
    if (!amount || !donorName || !donorEmail || !donorPhone) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (amount < 1 || amount > 999999) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    // Generate unique order ID
    const orderId = `ORD-${Date.now()}-${generateRandomString(8)}`;
    const rnd = generateRandomString();

    // Amount in cents (multiply by 100)
    const amountInCents = Math.floor(amount * 100);

    // Create CMI parameters
    const cmiParams = {
      clientid: CMI_CONFIG.clientId,
      amount: amountInCents.toString(),
      currency: '504', // Moroccan Dirham
      oid: orderId,
      okUrl: CMI_CONFIG.successUrl,
      failUrl: CMI_CONFIG.failureUrl,
      cancelUrl: CMI_CONFIG.cancelUrl,
      shopurl: process.env.FRONTEND_URL,
      trantype: 'Auth',
      lang: language || 'ar',
      rnd: rnd,
    };

    // Generate hash signature
    const hashData = `${cmiParams.clientid}${cmiParams.oid}${cmiParams.amount}${cmiParams.okUrl}${cmiParams.failUrl}${cmiParams.trantype}${cmiParams.rnd}${CMI_CONFIG.storeKey}`;
    const hash = generateHash(hashData, CMI_CONFIG.storeKey);
    cmiParams.hash = hash;

    // Store donation in database
    const { data, error } = await supabase
      .from('donations')
      .insert([
        {
          order_id: orderId,
          amount: amount,
          currency: 'MAD',
          donor_name: donorName,
          donor_email: donorEmail,
          donor_phone: donorPhone,
          campaign_id: campaign,
          message: message || null,
          status: 'pending',
          payment_method: 'cmi',
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to create donation record' });
    }

    res.json({
      success: true,
      orderId: orderId,
      cmiUrl: CMI_CONFIG.gatewayUrl,
      formData: cmiParams,
    });
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({ error: 'Failed to create payment request' });
  }
});

// Payment Success Callback
app.post('/api/payments/success', async (req, res) => {
  try {
    const { oid, TransId, Response, AuthCode } = req.body;

    if (!oid) {
      return res.status(400).json({ error: 'Missing order ID' });
    }

    // Update donation status
    const { data, error } = await supabase
      .from('donations')
      .update({
        status: 'completed',
        transaction_id: TransId || null,
        updated_at: new Date().toISOString(),
      })
      .eq('order_id', oid)
      .select();

    if (error) {
      console.error('Error updating donation:', error);
      return res.status(500).json({ error: 'Failed to update donation' });
    }

    res.json({
      success: true,
      message: 'Payment processed successfully',
      donation: data?.[0],
    });
  } catch (error) {
    console.error('Error processing payment success:', error);
    res.status(500).json({ error: 'Failed to process payment confirmation' });
  }
});

// Payment Failure Callback
app.post('/api/payments/failure', async (req, res) => {
  try {
    const { oid, Response, ErrorCode } = req.body;

    if (!oid) {
      return res.status(400).json({ error: 'Missing order ID' });
    }

    // Update donation status
    const { error } = await supabase
      .from('donations')
      .update({
        status: 'failed',
        updated_at: new Date().toISOString(),
      })
      .eq('order_id', oid)
      .select();

    if (error) {
      console.error('Error updating donation:', error);
    }

    res.json({
      success: true,
      message: 'Payment failure recorded',
      errorCode: ErrorCode,
    });
  } catch (error) {
    console.error('Error processing payment failure:', error);
    res.status(500).json({ error: 'Failed to process payment failure' });
  }
});

// Verify Payment Signature (for security)
app.post('/api/payments/verify', (req, res) => {
  try {
    const { clientid, oid, amount, okUrl, failUrl, trantype, rnd, hash } = req.body;

    const hashData = `${clientid}${oid}${amount}${okUrl}${failUrl}${trantype}${rnd}${CMI_CONFIG.storeKey}`;
    const calculatedHash = generateHash(hashData, CMI_CONFIG.storeKey);

    const isValid = hash === calculatedHash;

    res.json({
      valid: isValid,
      message: isValid ? 'Signature is valid' : 'Signature is invalid',
    });
  } catch (error) {
    console.error('Error verifying signature:', error);
    res.status(500).json({ error: 'Failed to verify signature' });
  }
});

// Get Donation Status
app.get('/api/donations/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;

    const { data, error } = await supabase
      .from('donations')
      .select('*')
      .eq('order_id', orderId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching donation:', error);
      return res.status(500).json({ error: 'Failed to fetch donation' });
    }

    if (!data) {
      return res.status(404).json({ error: 'Donation not found' });
    }

    res.json({
      success: true,
      donation: data,
    });
  } catch (error) {
    console.error('Error fetching donation:', error);
    res.status(500).json({ error: 'Failed to fetch donation' });
  }
});

// Get All Donations (Admin)
app.get('/api/admin/donations', async (req, res) => {
  try {
    const { status, campaign } = req.query;
    let query = supabase.from('donations').select('*');

    if (status) {
      query = query.eq('status', status);
    }
    if (campaign) {
      query = query.eq('campaign_id', campaign);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching donations:', error);
      return res.status(500).json({ error: 'Failed to fetch donations' });
    }

    res.json({
      success: true,
      donations: data || [],
      total: data?.length || 0,
    });
  } catch (error) {
    console.error('Error fetching donations:', error);
    res.status(500).json({ error: 'Failed to fetch donations' });
  }
});

// Test Endpoint
app.get('/api/test/cmi-config', (req, res) => {
  res.json({
    message: 'CMI Configuration (Test Mode)',
    merchantId: CMI_CONFIG.merchantId,
    clientId: CMI_CONFIG.clientId,
    gatewayUrl: CMI_CONFIG.gatewayUrl,
    successUrl: CMI_CONFIG.successUrl,
    failureUrl: CMI_CONFIG.failureUrl,
    note: 'This is test configuration. Use real credentials in production.',
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`CMI Gateway: ${CMI_CONFIG.gatewayUrl}`);
});
