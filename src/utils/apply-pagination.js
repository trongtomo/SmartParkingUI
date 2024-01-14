export function applyPagination(documents, page, rowsPerPage) {
  return documents ? documents.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : [];
}