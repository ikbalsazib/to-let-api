import * as mongoose from 'mongoose';

export const JobTypeSchema = new mongoose.Schema(
  {
    readOnly: {
      type: Boolean,
      required: false,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    nameBn: {
      type: String,
      required: false,
      trim: false,
    },
    nameIt: {
      type: String,
      required: false,
      trim: false,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);
