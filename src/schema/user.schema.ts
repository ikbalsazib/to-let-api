import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';

export const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
    },
    username: {
      type: String,
      required: false,
      unique: false,
    },
    password: {
      type: String,
      required: false,
    },
    phoneNo: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: false,
    },
    image: {
      type: String,
      required: false,
    },

    gender: {
      type: String,
      required: false,
    },
    profileImg: {
      type: String,
    },
    registrationType: {
      type: String,
      required: false,
    },
    referId: {
      type: String,
      required: false,
      unique: false,
    },
    referFrom: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    referCount: {
      type: Number,
      required: false,
    },
    userPoints: {
      type: Number,
      required: false,
      default: 0,
    },

    hasAccess: {
      type: Boolean,
      required: true,
    },

    isNewUser: {
      type: Boolean,
      required: false,
    },
    carts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Cart',
      },
    ],
    addresses: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Address',
        required: false,
      },
    ],
    usedCoupons: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Coupon',
      },
    ],
    transactionId: {
      type: String,
      required: false,
    },
    amount: {
      type: Number,
      required: false,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);
