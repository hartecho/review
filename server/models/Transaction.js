import mongoose from 'mongoose';

const AddressSchema = new mongoose.Schema({
  streetAddress: { type: String, required: true },
  secondaryAddress: String,
  city: { type: String, required: true },
  state: { type: String, required: true },
  ZIPCode: { type: String, required: true },
  ZIPPlus4: String,
  urbanization: String,
  firstName: String,
  lastName: String,
  firm: String,
  phone: String,
  email: String,
  ignoreBadAddress: Boolean
});

const transactionSchema = new mongoose.Schema({
    invoiceNumber: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    totalCost: {
        type: Number,
        required: true
    },
    itemizedList: {
        type: Array,
        required: true
    },
    salesTax: {
        type: Number,
        required: true
    },
    salesTaxRate: {
        type: Number,
        required: true
    },
    buyersBillingAddress: {
        type: AddressSchema,
        required: true
    },
    buyersShippingAddress: {
        type: AddressSchema,
        required: true
    },
    sellersBusinessInformation: {
        businessName: {
            type: String,
            required: true
        },
        address: {
            type: AddressSchema,
            required: true
        },
        taxIDNum: {
            type: String,
            required: true
        }
    },
    paymentMethod: {
        type: String,
        required: true
    }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
