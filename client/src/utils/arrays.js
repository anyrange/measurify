export const orderByDate = (array, key) => {
  return array.sort(
    (a, b) => new Date(b[key]).getTime() - new Date(a[key]).getTime()
  );
};
