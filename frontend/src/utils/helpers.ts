export function checkIfFileIsCsv(file: any): boolean {
  return file.type.includes('csv');
}
