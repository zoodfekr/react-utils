
interface localPaginateType<T> {
  data: T[],
  itemsPerPage: number,
  currentPage: number,
  searchKeys?: (keyof T)[]
  searchValue: string
}

interface returnType<T> {
  currentPage: number,
  itemsPerPage: number,
  totalItems: number,
  totalPages: number,
  data: T[],
  filteredData: T[]
}


export const localPaginate = <T,>({ data, itemsPerPage, currentPage, searchKeys = [], searchValue = '' }: localPaginateType<T>): returnType<T> => {


  data = Array.isArray(data) ? data : []

  // اگر مقدار جستجو یا کلیدهای جستجو تعیین نشده باشند، دادهها بدون فیلتر باقی میمانند
  const filteredData =
    searchValue && searchKeys.length > 0
      ? data.filter(item =>
        searchKeys.some(
          key =>
            item[key] &&
            item[key]
              .toString()
              .toLowerCase()
              .includes(searchValue.toLowerCase())
        )
      )
      : data;

  const totalItems = filteredData.length

  const totalPages = Math.ceil(totalItems / itemsPerPage)

  // بررسی اینکه currentPage معتبر است
  if (currentPage < 1) currentPage = 1;
  if (currentPage > totalPages) currentPage = totalPages;

  const startIndex = (currentPage - 1) * itemsPerPage
  let endIndex = startIndex + itemsPerPage

  // بررسی اینکه endIndex از کل داده ها بیشتر نباشد
  if (endIndex > totalItems) endIndex = totalItems

  const paginatedData = filteredData.slice(startIndex, endIndex)

  return {
    currentPage,
    itemsPerPage,
    totalItems,
    totalPages,
    data: paginatedData,
    filteredData
  }
}
