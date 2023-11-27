/**
 * Resolve Connecting Issue
 * Use mongodb://127.0.0.1:27017/db-name instead of mongodb://localhost:27017/db-name
 */

export default () => ({
  productionBuild: process.env.PRODUCTION_BUILD === 'true',
  hostname: `http://localhost:${process.env.PORT || 3000}`,
  port: parseInt(process.env.PORT, 10) || 3000,
  mongoCluster:
    process.env.PRODUCTION_BUILD === 'true'
      ? `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@127.0.0.1:${process.env.DB_PORT}/${process.env.DB_NAME}?authSource=${process.env.AUTH_SOURCE}`
      : `mongodb+srv://aahifab:gul123!@cluster0.1hrgjzl.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
  // : `mongodb+srv://softlabit:M5LiBL43wpMtrEy9@test-softlab.ptacstn.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
  // mongoCluster: `mongodb://localhost:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  // mongoCluster: `mongodb+srv://softlabit:M5LiBL43wpMtrEy9@test-softlab.ptacstn.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
  userJwtSecret: process.env.JWT_PRIVATE_KEY_USER,
  adminJwtSecret: process.env.JWT_PRIVATE_KEY_ADMIN,
  userTokenExpiredTime: 604800,
  adminTokenExpiredTime: 604800,
  promoOfferSchedule: 'Promo_Offer_Schedule',
  promoOfferScheduleOnStart: 'Promo_Offer_Schedule_On_Start',
  promoOfferScheduleOnEnd: 'Promo_Offer_Schedule_On_End',
  // smsSenderUsername: '01781310241',
  // smsSenderPassword: 'YV6H7B8N',
  // smsSenderId: 'Anisul',
  smsSenderUsername: '01781310241',
  smsSenderPassword: 'YV6H7B8N',
  smsSenderId: 'Anisul',

  dbAdminUsername: 'ikbalsazib11',
  dbAdminPassword: 'IKBALsazib11',
  backupDB: process.env.DB_NAME,
  backupPath: './backup/db',
  restorePath: `./restore/${process.env.DB_NAME}`,
  STRIPE_REDIRECT_URL:
    process.env.PRODUCTION_BUILD === 'true'
      ? 'https://meekago.com'
      : `http://localhost:4200`,
  STRIPE_SECRET_KEY:
    process.env.PRODUCTION_BUILD === 'true'
      ? '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'
      : `sk_test_51LXis9EdSP1amkCQPqmmUdiVj9DjxwWUnzI4l0Ju3yQj3jrqCxkJbu0ZguAPSV0ACpSxGg45PzIecfbRKvmVDmTb00KqwU8Tsy`,
});
