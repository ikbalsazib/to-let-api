import * as mongoose from 'mongoose';
import { PRODUCT_DISCOUNT_OPTIONS } from './sub-schema.schema';

export const PromoOfferSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    titleBn: {
      type: String,
      required: true,
      trim: true,
    },
    titleIt: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: false,
    },
    descriptionBn: {
      type: String,
      required: false,
    },
    descriptionIt: {
      type: String,
      required: false,
    },
    bannerImage: {
      type: String,
      required: false,
    },
    startDateTime: {
      type: Date,
      required: true,
    },
    endDateTime: {
      type: Date,
      required: true,
    },
    products: [PRODUCT_DISCOUNT_OPTIONS],
  },
  {
    versionKey: false,
    timestamps: true,
  },
);
