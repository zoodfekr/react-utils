export function isRTL(text: string): Boolean {
    const rtlChars = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/; // محدوده یونیکد فارسی/عربی
    return rtlChars.test(text);
}