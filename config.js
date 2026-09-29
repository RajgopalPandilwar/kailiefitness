/* ============================================================
   KAILIEFITNESS — CHECKOUT CONFIG
   ------------------------------------------------------------
   This is the ONLY file you need to edit to go live.

   1. Create a free Razorpay account: https://razorpay.com
   2. In Razorpay:  Payments  ->  Payment Links  ->  Create Link
   3. Paste each link URL into the matching `link` field below.
   4. Set READY to true.

   Everything else on the site reads from this file.
   ============================================================ */

window.KF_CONFIG = {
  // Flip to true once every link below is filled in.
  // While false, Buy Now buttons show a "not configured" notice
  // instead of silently doing nothing.
  READY: false,

  // Where buyers go if they email you (used by the help section link).
  supportEmail: 'hello@kailiefitness.com',

  // ---- PAYMENT LINKS ------------------------------------------------
  // Razorpay payment links are hosted checkout pages: no server, no
  // monthly fee, 2% per transaction. UPI, cards and netbanking all work.

  programs: {
    'Fat Loss Blueprint': {
      link: '',              // <- paste Razorpay link
      price: '₹2,499',
      was: '₹3,999',
    },
    'Muscle Building': {
      link: '',              // <- paste Razorpay link
      price: '₹3,499',
      was: '₹5,499',
    },
    'At Home Training': {
      link: '',              // <- paste Razorpay link
      price: '₹1,899',
      was: '₹2,999',
    },
    'Athlete Performance': {
      link: '',              // <- paste Razorpay link
      price: '₹2,899',
      was: '₹4,499',
    },
    'Complete Bundle': {
      link: '',              // <- paste Razorpay link
      price: '₹5,999',
      was: '₹10,796',
    },
  },

  // ---- POST-PURCHASE DELIVERY ---------------------------------------
  // Where a buyer lands after a successful payment.
  // Point this at your delivery page (thank-you.html by default).
  thankYouUrl: 'thank-you.html',
};
