export const fixMarkDown = (md: string) => {
   // Add blank lines before and after tables
  md = md.replace(/([^\n])(\n\|)/g, '$1\n\n$2'); // Before table
  md = md.replace(/(\|[^\n]*\|)(\n[^\|])/g, '$1\n\n$2'); // After table
  // Add blank lines before headings
  md = md.replace(/([^\n])(\n#+ )/g, '$1\n\n$2');
  return md;
}