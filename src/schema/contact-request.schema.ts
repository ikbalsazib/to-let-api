const mongoose = require('mongoose');
const Schema = mongoose.Schema;

export const ContactRequestSchema = new mongoose.Schema(
  {
    user: {
      _id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      name: {
        type: String,
      },
      profileImg: {
        type: String,
      },
      phoneNo: {
        type: String,
        required: false,
      },
      gender: {
        type: String,
        required: false,
      },
    },
    product: {
      _id: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
      },
      name: {
        type: String,
      },
      slug: {
        type: String,
      },
      bioDataType: {
        type: String,
      },

      guardianNumber: {
        type: String,
      },
      receiveBiodata: {
        type: String,
      },
      postType: {
        type: String,
        required: false,
      },
    },
    requestDate: {
      type: Date,
      required: false,
      default: Date.now(),
    },

    status: {
      type: Boolean,
      required: true,
    },
    guardianName: {
      type: String,
      required: false,
    },
    guardianPhoneNo: {
      type: String,
      required: false,
    },
    replyDate: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);
