export default (context, inject) => {
  inject('optionsToParams', options => {
    const {sortBy, sortDesc, page, itemsPerPage} = options
    return {
      sortBy: sortBy ? (Array.isArray(sortBy) && sortBy.length > 0 ? sortBy[0] : sortBy) : 'created_at',
      sortDesc: sortDesc ? (Array.isArray(sortDesc) && sortDesc.length > 0 ? sortDesc[0] : sortDesc) : true,
      page, itemsPerPage
    }
  })
}
