import { dynamicSearch } from "./dynamicSearch";
import { local_sorter } from "./local_sorter";

export const handleLocalSearch = (props) => {

    const {
        data,  // کل دیتای دریافتی
        searchValue, // مقدار سرچ شده 
        searchableKeys, // کلید هایی که میخواهیم سرچ روی ان انجام شود
        order_value, // مقدارهای سورت دیتا  { value: "last_access_ts", direction: "descending" }
        pageNumber,  // شماره صفحه 
        pageLimit,  // تعداد ردیف


        settotalValue, // استیت ذخیره مقدار دیتا 
        setdata_state, // ذخیره مقدار دیتا
    } = props;


    const filteredData = searchValue.trim().length > 0
        ?
        dynamicSearch({
            searchValue,
            dataList: data,
            searchableKeys
        })
        :
        data;

    settotalValue(filteredData.length);

    let result = local_sorter({
        data: filteredData,  // دیتای فیلتر شده 
        key: order_value.value,  // کلید سورت دیتا بر اساس آن
        direction: order_value.direction  // نوع سورت سعودی یا نزولی
    })

    const currentData = result.slice(
        (pageNumber - 1) * pageLimit,
        pageNumber * pageLimit
    );


    setdata_state(currentData);

    console.log(' ***call handleLocalSearch ***');
}