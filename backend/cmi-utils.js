const crypto = require('crypto');

/**
 * CMI Payment Utilities
 * Helper functions for CMI payment gateway integration
 */

class CMIPaymentHandler {
  constructor(merchantId, storeKey, clientId) {
    this.merchantId = merchantId;
    this.storeKey = storeKey;
    this.clientId = clientId;
  }

  /**
   * Generate HMAC-SHA1 signature for CMI payment request
   * @param {Object} params - Payment parameters
   * @returns {string} Base64 encoded signature
   */
  generateSignature(params) {
    const {
      clientid,
      oid,
      amount,
      okUrl,
      failUrl,
      trantype,
      rnd,
    } = params;

    // CMI requires parameters in specific order
    const data = `${clientid}${oid}${amount}${okUrl}${failUrl}${trantype}${rnd}${this.storeKey}`;

    return crypto
      .createHmac('sha1', this.storeKey)
      .update(data)
      .digest('base64');
  }

  /**
   * Verify response signature from CMI
   * @param {Object} response - Response from CMI
   * @param {string} expectedHash - Expected hash value
   * @returns {boolean} True if signature is valid
   */
  verifySignature(response, expectedHash) {
    const {
      clientid,
      oid,
      amount,
      okUrl,
      failUrl,
      trantype,
      rnd,
    } = response;

    const calculatedHash = this.generateSignature({
      clientid,
      oid,
      amount,
      okUrl,
      failUrl,
      trantype,
      rnd,
    });

    return expectedHash === calculatedHash;
  }

  /**
   * Format amount to CMI format (multiply by 100)
   * @param {number} amount - Amount in MAD
   * @returns {number} Amount in cents
   */
  formatAmount(amount) {
    return Math.floor(amount * 100);
  }

  /**
   * Parse CMI amount (divide by 100)
   * @param {number} cmiAmount - Amount in CMI format (cents)
   * @returns {number} Amount in MAD
   */
  parseAmount(cmiAmount) {
    return cmiAmount / 100;
  }

  /**
   * Generate random string for CMI rnd parameter
   * @param {number} length - Length of random string
   * @returns {string} Random hex string
   */
  generateRnd(length = 16) {
    return crypto.randomBytes(length).toString('hex');
  }

  /**
   * Generate unique order ID
   * @returns {string} Unique order identifier
   */
  generateOrderId() {
    return `ORD-${Date.now()}-${this.generateRnd(8)}`;
  }

  /**
   * Create CMI payment form data
   * @param {Object} donation - Donation object
   * @param {Object} urls - Success/Failure URLs
   * @returns {Object} CMI form parameters
   */
  createPaymentFormData(donation, urls) {
    const orderId = donation.order_id;
    const amount = this.formatAmount(donation.amount);
    const rnd = this.generateRnd();

    const params = {
      clientid: this.clientId,
      amount: amount.toString(),
      currency: '504', // MAD
      oid: orderId,
      okUrl: urls.success,
      failUrl: urls.failure,
      cancelUrl: urls.cancel || urls.failure,
      shopurl: urls.shop,
      trantype: 'Auth',
      lang: donation.language || 'ar',
      rnd: rnd,
    };

    params.hash = this.generateSignature(params);

    return params;
  }

  /**
   * Validate CMI response
   * @param {Object} response - CMI callback response
   * @returns {Object} Validation result
   */
  validateCMIResponse(response) {
    const { oid, hash } = response;

    if (!oid || !hash) {
      return {
        valid: false,
        error: 'Missing required parameters',
      };
    }

    const isValidSignature = this.verifySignature(response, hash);

    return {
      valid: isValidSignature,
      error: isValidSignature ? null : 'Invalid signature',
    };
  }

  /**
   * Extract transaction info from CMI response
   * @param {Object} response - CMI callback response
   * @returns {Object} Transaction info
   */
  extractTransactionInfo(response) {
    return {
      orderId: response.oid,
      transactionId: response.TransId,
      responseCode: response.Response,
      authCode: response.AuthCode,
      amount: response.amount ? this.parseAmount(parseInt(response.amount)) : null,
      currency: response.currency || '504',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Check if CMI response indicates success
   * @param {Object} response - CMI callback response
   * @returns {boolean} True if payment was successful
   */
  isSuccessResponse(response) {
    // CMI typically returns "Approved" or "0" for success
    return (
      response.Response === 'Approved' ||
      response.Response === '0' ||
      response.AuthCode
    );
  }

  /**
   * Get readable error message from CMI response code
   * @param {string} responseCode - CMI response code
   * @returns {string} Human-readable error message
   */
  getErrorMessage(responseCode) {
    const errorMessages = {
      'Declined': 'البطاقة مرفوضة - الرجاء التحقق من بيانات البطاقة',
      'Timeout': 'انتهت مهلة الوقت - الرجاء المحاولة مرة أخرى',
      'Cancelled': 'تم إلغاء المعاملة من قبل المستخدم',
      '02': 'البطاقة مرفوضة',
      '03': 'بطاقة غير صالحة',
      '14': 'رقم البطاقة غير صحيح',
      '41': 'بطاقة مفقودة',
      '43': 'بطاقة مسروقة',
      '51': 'رصيد غير كافي',
      '54': 'البطاقة منتهية الصلاحية',
      '55': 'رقم التعريف الشخصي (PIN) غير صحيح',
      '61': 'تجاوز حد الأنسحاب اليومي',
      '62': 'البطاقة مقيدة',
      '65': 'عدد محاولات البطاقة المفقودة قد تم تجاوزها',
      '75': 'عدد محاولات إدخال رقم التعريف الشخصي (PIN) قد تم تجاوزه',
      '76': 'رقم التعريف الشخصي (PIN) غير صحيح - حاول مرة أخرى',
      '77': 'تم طلب المصادقة - قد لا يتم الموافقة على المعاملة',
    };

    return errorMessages[responseCode] || 'حدث خطأ في المعاملة - الرجاء المحاولة مرة أخرى';
  }
}

module.exports = CMIPaymentHandler;
