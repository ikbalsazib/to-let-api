import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';

export const ProductSchema = new mongoose.Schema(
  {
    postType: {
      type: String,
      required: false,
    },
    name: {
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
    shortDescription: {
      type: String,
      required: false,
    },
    chakriSami: {
      type: String,
      required: false,
    },
    porasonaSami: {
      type: String,
      required: false,
    },
    montobboSami: {
      type: String,
      required: false,
    },
    sontanSami: {
      type: String,
      required: false,
    },
    obhibabokSami: {
      type: String,
      required: false,
    },
    pottshaSami: {
      type: String,
      required: false,
    },
    snakottoBisoi: {
      type: String,
      required: false,
    },
    snakonttoPassingYear: {
      type: String,
      required: false,
    },
    snatokPassingYear: {
      type: String,
      required: false,
    },
    snatokInstitute: {
      type: String,
      required: false,
    },
    snatokBisoi: {
      type: String,
      required: false,
    },
    doctoretPassingYear: {
      type: String,
      required: false,
    },
    doctoretInstitute: {
      type: String,
      required: false,
    },
    doctoretBisoi: {
      type: String,
      required: false,
    },
    ebadahoEducation: {
      type: String,
      required: false,
    },
    ebadahoFolafol: {
      type: String,
      required: false,
    },
    ebadahoPassingYear: {
      type: String,
      required: false,
    },
    taksuPassingYear: {
      type: String,
      required: false,
    },
    taksuEducation: {
      type: String,
      required: false,
    },
    taksuFolafol: {
      type: String,
      required: false,
    },
    taksuInstitution: {
      type: String,
      required: false,
    },
    takmilPassingYear: {
      type: String,
      required: false,
    },
    takmilFolafol: {
      type: String,
      required: false,
    },
    takmilEducation: {
      type: String,
      required: false,
    },
    fojilotPassingYear: {
      type: String,
      required: false,
    },
    fojilotFolafol: {
      type: String,
      required: false,
    },
    fojilotEducation: {
      type: String,
      required: false,
    },
    saniPassingYear: {
      type: String,
      required: false,
    },
    saniFolafol: {
      type: String,
      required: false,
    },
    saniEducation: {
      type: String,
      required: false,
    },
    muftiPassingYear: {
      type: String,
      required: false,
    },
    muftiFolafol: {
      type: String,
      required: false,
    },
    muftiEducation: {
      type: String,
      required: false,
    },
    snakottoBosor: {
      type: String,
      required: false,
    },
    snakottoInstiute: {
      type: String,
      required: false,
    },
    costPrice: {
      type: Number,
      required: false,
      default: 0,
    },
    salePrice: {
      type: Number,
      required: false,
      default: 0,
    },
    discountType: {
      type: Number,
      required: false,
    },
    discountAmount: {
      type: Number,
      required: false,
    },
    images: {
      type: [String],
      required: false,
    },
    quantity: {
      type: Number,
      required: false,
      default: 0,
    },
    viewCount: {
      type: Number,
      required: false,
      default: 0,
    },
    seoTitle: {
      type: String,
      required: false,
    },
    seoDescription: {
      type: String,
      required: false,
    },
    seoKeyword: {
      type: String,
      required: false,
    },
    user: {
      _id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false,
      },
      name: {
        type: String,
      },
      profileImg: {
        type: String,
      },
    },
    category: {
      _id: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: false,
      },
      name: {
        type: String,
        required: false,
      },
      slug: {
        type: String,
        required: false,
      },
    },
    subCategory: {
      _id: {
        type: Schema.Types.ObjectId,
        ref: 'SubCategory',
        required: false,
      },
      name: {
        type: String,
        required: false,
      },
      slug: {
        type: String,
        required: false,
      },
    },
    tags: [
      {
        _id: {
          type: Schema.Types.ObjectId,
          ref: 'Tags',
          required: false,
        },
        name: {
          type: String,
          required: false,
        },
      },
    ],
    status: {
      type: String,
      required: true,
    },
    videoUrl: {
      type: String,
      required: false,
    },

    // Job Data
    deadline: {
      type: Date,
      required: false,
    },

    jobRole: {
      type: String,
      required: false,
    },
    jobType: {
      type: String,
      required: false,
    },
    salaryTo: {
      type: Number,
      required: false,
    },
    salaryFrom: {
      type: Number,
      required: false,
    },
    requiredEducation: {
      type: String,
      required: false,
    },
    experience: {
      type: String,
      required: false,
    },
    companyName: {
      type: String,
      required: false,
    },
    jobPostBy: {
      type: String,
      required: false,
    },
    vacancy: {
      type: String,
      required: false,
    },
    address: {
      type: String,
      required: false,
    },

    // To Let
    measurement: {
      type: String,
      required: false,
    },
    waterSystem: {
      type: Boolean,
      required: false,
    },
    meterType: {
      type: String,
      required: false,
    },
    nearestMarketDistance: {
      type: String,
      required: false,
    },
    nearestMosqueDistance: {
      type: String,
      required: false,
    },
    floorsInHouse: {
      type: String,
      required: false,
    },
    whichFloorRented: {
      type: String,
      required: false,
    },
    howManyCorridors: {
      type: String,
      required: false,
    },
    productType: {
      type: String,
      required: false,
    },
    howLongUsed: {
      type: String,
      required: false,
    },

    balcony: {
      type: String,
      required: false,
    },

    bedroom: {
      type: String,
      required: false,
    },

    washroom: {
      type: String,
      required: false,
    },

    availableFrom: {
      type: String,
      required: false,
    },

    floorNo: {
      type: String,
      required: false,
    },

    flatCategory: {
      type: String,
      required: false,
    },

    flatType: {
      type: String,
      required: false,
    },

    division: {
      _id: {
        type: Schema.Types.ObjectId,
        ref: 'Division',
        required: false,
      },
      name: {
        type: String,
        required: false,
      },
    },
    area: {
      _id: {
        type: Schema.Types.ObjectId,
        ref: 'Area',
        required: false,
      },
      name: {
        type: String,
        required: false,
      },
    },
    zone: {
      _id: {
        type: Schema.Types.ObjectId,
        ref: 'Zone',
        required: false,
      },
      name: {
        type: String,
        required: false,
      },
    },
    rentPrice: {
      type: Number,
      required: false,
    },
    // Matrimonial
    bioDataType: {
      type: String,
      required: false,
    },
    maritalStatus: {
      type: String,
      required: false,
    },
    birthDay: {
      type: String,
      required: false,
    },
    height: {
      type: String,
      required: false,
    },
    complexion: {
      type: String,
      required: false,
    },
    descriptionOfProfession: {
      type: String,
      required: false,
    },
    weight: {
      type: String,
      required: false,
    },
    whichFiqhDoYouFollow: {
      type: String,
      required: false,
    },
    bloodGroup: {
      type: String,
      required: false,
    },
    nationality: {
      type: String,
      required: false,
    },
    permanentAddress: {
      type: String,
      required: false,
    },
    permanentAddressArea: {
      type: String,
      required: false,
    },
    presentAddress: {
      type: String,
      required: false,
    },
    presentAddressArea: {
      type: String,
      required: false,
    },
    whereDidYouGrowUp: {
      type: String,
      required: false,
    },
    yourEducationMethod: {
      type: String,
      required: false,
    },
    highestEducation: {
      type: String,
      required: false,
    },
    konYearDiploma: {
      type: String,
      required: false,
    },
    sscPassingYear: {
      type: String,
      required: false,
    },
    sscGroup: {
      type: String,
      required: false,
    },
    sscResult: {
      type: String,
      required: false,
    },
    passingYearHSC: {
      type: String,
      required: false,
    },
    groupHSC: {
      type: String,
      required: false,
    },
    resultHSC: {
      type: String,
      required: false,
    },
    descriptionOfFathersProfession: {
      type: String,
      required: false,
    },
    descriptionOfFinancialCondition: {
      type: String,
      required: false,
    },
    descriptionOfMothersProfession: {
      type: String,
      required: false,
    },
    howIsYourFamilysReligiousCondition: {
      type: String,
      required: false,
    },
    howManyBrothersDoYouHave: {
      type: String,
      required: false,
    },
    writeTheNamesOfAtLeast3IslamicScholarsOfYourChoice: {
      type: String,
      required: false,
    },
    diplomaSubject: {
      type: String,
      required: false,
    },
    diplomaInstitution: {
      type: String,
      required: false,
    },
    diplomaPassingYear: {
      type: String,
      required: false,
    },
    otherEducationalQualifications: {
      type: String,
      required: false,
    },
    islamicEducationalTitles: {
      type: [String],
      required: false,
    },
    fathersName: {
      type: String,
      required: false,
    },
    isYourFatherAlive: {
      type: String,
      required: false,
    },
    howManyGrooms: {
      type: String,
      required: false,
    },
    howManyBrides: {
      type: String,
      required: false,
    },
    specificReasonsDivorce: {
      type: String,
      required: false,
    },
    descriptionFathersProfession: {
      type: String,
      required: false,
    },
    mothersName: {
      type: String,
      required: false,
    },
    isYourMotherAlive: {
      type: String,
      required: false,
    },
    descriptionMothersProfession: {
      type: String,
      required: false,
    },
    howManyBrothers: {
      type: String,
      required: false,
    },
    brothersInformation: {
      type: String,
      required: false,
    },
    howManySisters: {
      type: String,
      required: false,
    },
    sistersInformation: {
      type: String,
      required: false,
    },
    professionsOfUncles: {
      type: String,
      required: false,
    },
    familyFinancialStatus: {
      type: String,
      required: false,
    },
    descriptionFinancialCondition: {
      type: String,
      required: false,
    },
    familysReligiousCondition: {
      type: String,
      required: false,
    },
    usuallyWearOutsideHouse: {
      type: String,
      required: false,
    },
    accordingToSunnahSinceWhen: {
      type: String,
      required: false,
    },
    wearClothesAboveTheAnkles: {
      type: String,
      required: false,
    },
    prayFiveTimesDaySinceWhen: {
      type: String,
      required: false,
    },
    prayersMissedQaza: {
      type: String,
      required: false,
    },
    mahram: {
      type: String,
      required: false,
    },
    quranCorrectly: {
      type: String,
      required: false,
    },
    whichFiqh: {
      type: String,
      required: false,
    },
    watchDramas: {
      type: String,
      required: false,
    },
    physicalDiseases: {
      type: String,
      required: false,
    },
    workDeen: {
      type: String,
      required: false,
    },
    shrineMazar: {
      type: String,
      required: false,
    },
    readingBooks: {
      type: String,
      required: false,
    },
    islamicScholars: {
      type: String,
      required: false,
    },
    categoryApplicable: {
      type: [String],
      required: false,
    },
    conversionIslam: {
      type: String,
      required: false,
    },
    hobbies: {
      type: String,
      required: false,
    },
    mobileNumber: {
      type: String,
      required: false,
    },
    GroomPhoto: {
      type: String,
      required: false,
    },
    occupation: {
      type: String,
      required: false,
    },
    professionDescription: {
      type: String,
      required: false,
    },
    monthlyIncome: {
      type: String,
      required: false,
    },
    agreeMarriage: {
      type: String,
      required: false,
    },
    keepMarriage: {
      type: String,
      required: false,
    },
    allowStudyMarriage: {
      type: String,
      required: false,
    },
    allowJobMarriage: {
      type: String,
      required: false,
    },
    liveWifeMarriage: {
      type: String,
      required: false,
    },
    giftBrideFamily: {
      type: String,
      required: false,
    },
    gettingMarriage: {
      type: String,
      required: false,
    },
    partnerAge: {
      type: String,
      required: false,
    },
    partnerComplexion: {
      type: String,
      required: false,
    },
    partnerheight: {
      type: String,
      required: false,
    },
    partnerEduQualification: {
      type: String,
      required: false,
    },
    partnerDistrict: {
      type: String,
      required: false,
    },
    partnerMaritalStatus: {
      type: String,
      required: false,
    },
    partnerProfession: {
      type: String,
      required: false,
    },
    partnerFinancial: {
      type: String,
      required: false,
    },
    partnerQualities: {
      type: String,
      required: false,
    },
    submitBiodataWeb: {
      type: String,
      required: false,
    },
    infoTrue: {
      type: String,
      required: false,
    },
    agree: {
      type: String,
      required: false,
    },
    fullName: {
      type: String,
      required: false,
    },
    guardianNumber: {
      type: String,
      required: false,
    },
    relationshipGuardian: {
      type: String,
      required: false,
    },
    receiveBiodata: {
      type: String,
      required: false,
    },
    girlJobAfterMarriage: {
      type: String,
      required: false,
    },
    girlsStudiesAfterMarriage: {
      type: String,
      required: false,
    },
    partnerHeight: {
      type: String,
      required: false,
    },
    partnerWeight: {
      type: String,
      required: false,
    },

    partnerArea: {
      type: String,
      required: false,
    },

    partnerMajhab: {
      type: String,
      required: false,
    },
    partnerDin: {
      type: String,
      required: false,
    },
    partnerGun: {
      type: String,
      required: false,
    },
    partnerOccupation: {
      type: String,
      required: false,
    },
    song: {
      type: String,
      required: false,
    },
    facebook: {
      type: String,
      required: false,
    },
    salat: {
      type: String,
      required: false,
    },
    pordha: {
      type: String,
      required: false,
    },
    readQuranSuddho: {
      type: String,
      required: false,
    },
    readQuranDaily: {
      type: String,
      required: false,
    },
    gunaho: {
      type: String,
      required: false,
    },
    motamot: {
      type: String,
      required: false,
    },
    sarNoSami: {
      type: String,
      required: false,
    },
    sarSami: {
      type: String,
      required: false,
    },

    bisoiSar: {
      type: String,
      required: false,
    },
    compromise: {
      type: String,
      required: false,
    },
    chakri: {
      type: String,
      required: false,
    },
    porasonaMaya: {
      type: String,
      required: false,
    },
    pordaMaya: {
      type: String,
      required: false,
    },
    sontanMaya: {
      type: String,
      required: false,
    },
    rajiMaya: {
      type: String,
      required: false,
    },
    sundorjo: {
      type: String,
      required: false,
    },

    girlContinueJobAfterMarriage: {
      type: String,
      required: false,
    },
    // pledge schema
  },
  {
    versionKey: false,
    timestamps: true,
  },
);
