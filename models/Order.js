// models/Order.js
const orderSchema = new mongoose.Schema({
  orderRef: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    price: Number,
    quantity: Number,
    total: Number,
  }],
  totalAmount: { type: Number, required: true },
  deliveryFee: { type: Number, default: 2000 },
  paymentMethod: { type: String, default: 'bank-transfer' },
  status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
  customerInfo: {
    fullName: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    deliveryNotes: String,
  },
}, { timestamps: true });