export const dynamicSearch = ({
    searchValue,                             // مقدار سرچ شده
    dataList,                                // دیتای دریافتی
    searchableKeys = []                      // کلیدهایی که باید روی آن‌ها جستجو شود
}) => {
    const baseData = Array.isArray(dataList) ? [...dataList] : [];  // دیتای دریافتی

    if (!searchValue || !searchValue.trim().length) {
        // اگر مقدار جستجو خالی بود، کل داده‌ها برگشت داده می‌شود
        return baseData;
    }

    const searchTerm = searchValue.toLowerCase();

    const filteredData = baseData.filter(item =>
        searchableKeys.some(key => {
            const value = item[key];
            if (!value) return false;
            return value.toString().toLowerCase().includes(searchTerm);
        })
    );

    return filteredData;
};
