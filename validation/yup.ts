import * as Yup from 'yup'

const reqText = 'این فیلد اجباری است'

const string_required = Yup.string().required(reqText)
const name = Yup.string().required(reqText)
const password = Yup.string()
    .min(8, 'رمز عبور باید حداقل 8 کاراکتر باشد')
    .matches(/[A-Z]/, 'رمز عبور باید حداقل شامل یک حرف بزرگ باشد')
    .matches(/[a-z]/, 'رمز عبور باید حداقل شامل یک حرف کوچک باشد')
    .matches(/[0-9]/, 'رمز عبور باید حداقل شامل یک عدد باشد')
    .matches(/[@$!%*?&#]/, 'رمز عبور باید حداقل شامل یک کاراکتر خاص باشد')
    .required(reqText)

const re_password = Yup.string()
    .oneOf([Yup.ref('password'), null], 'رمز عبور و تکرار آن باید یکسان باشند')
    .required(reqText)

const phone_number = Yup.string()
    .matches(/^\d{10}$/, 'شماره را بررسی کنید')
    .required(reqText)

const FILE_SIZE = 5 * 1024 * 1024 // حداکثر اندازه فایل 5 مگابایت
const SUPPORTED_FORMATS = ['audio/mpeg', 'audio/wav', 'audio/mp3']

/////////////////////////////////////////////////////////////

export const addCategorySchema = Yup.object({
    createdAt: Yup.string().required(reqText),
    description: Yup.string().required(reqText),
    icon: Yup.string().required(reqText),
    title: Yup.string().required(reqText),
    userId: Yup.string().required(reqText),
});

export type AddCategoryFormValues = Yup.InferType<typeof addCategorySchema>;




