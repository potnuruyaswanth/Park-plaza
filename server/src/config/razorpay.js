import Razorpay from 'razorpay';

let razorpayInstance;

if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
} else {
  // Stub when keys not available (for development without Razorpay)
  razorpayInstance = {
    orders: {
      create: async () => {
        throw new Error('Razorpay not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env');
      },
    },
  };
}

export default razorpayInstance;
