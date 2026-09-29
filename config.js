/* ============================================================
   KAILIEFITNESS — CHECKOUT CONFIG
   ------------------------------------------------------------
   This is the ONLY file you need to edit to go live.

   STEP 1 — Set your UPI ID below. That's it. UPI needs no
            merchant account, no KYC and no monthly fee.
   STEP 2 — Put your PDFs somewhere reachable and send the
            download link when a buyer sends their reference.

   Everything else on the site reads from this file.
   ============================================================ */

window.KF_CONFIG = {
  // Where buyers reach you. Used by the help section and order receipts.
  supportEmail: 'pandilwarajgopal@gmail.com',

  // ---- PAYMENT METHOD --------------------------------------------
  // 'upi'  = UPI deep links + QR code only (recommended, zero cost)
  // 'both' = UPI primary, with a card gateway as fallback
  payment: {
    method: 'upi',

    // Your UPI ID. Find it in your bank or UPI app under your profile.
    // Examples: kailie@okhdfcbank, kailie@okaxis, yourname@oksbi
    upiId: 'rajgopal.pandilwar@fam',

    // Name shown in the payer's UPI app. Keep it short.
    payeeName: 'KailieFitness',

    // Optional: second UPI ID for buyers whose app rejects the first.
    // Leave empty to disable.
    fallbackVpa: '',

    // Optional: WhatsApp number for buyers who prefer to confirm by chat.
    // Country code + number, digits only. Empty = disabled.
    whatsapp: ''
  },

  // ---- PRICES -----------------------------------------------------
  // `price` is what the page shows AND what goes into the UPI payment
  // request, so it must match the card prices in index.html.
  //
  // A static page cannot verify that a payment landed — there is no
  // server. Delivery is manual: the buyer sends their UPI reference
  // number and you email the program. See README.md.

  programs: {
    'Fat Loss Blueprint':  { price: '₹2,499', was: '₹3,999' },
    'Muscle Building':     { price: '₹3,499', was: '₹5,499' },
    'At Home Training':    { price: '₹1,899', was: '₹2,999' },
    'Athlete Performance': { price: '₹2,899', was: '₹4,499' },
    'Complete Bundle':     { price: '₹5,999', was: '₹10,796' }
  },

  // ---- POST-PURCHASE DELIVERY -------------------------------------
  // Buyers get the download link by email once you verify their payment.
  // Point them here from that email.
  thankYouUrl: 'thank-you.html'
};
