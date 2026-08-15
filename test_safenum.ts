function safeNum(val: any, fallback: number): number {
  const num = Number(val);
  return isNaN(num) ? fallback : num;
}
console.log(safeNum(undefined, 11.1));
console.log(safeNum(null, 11.1));
console.log(safeNum(NaN, 11.1));
console.log(safeNum({}, 11.1));
console.log(safeNum([], 11.1));
