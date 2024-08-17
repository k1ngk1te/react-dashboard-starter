export function contains(value: string | number, search: string) {
  const normalize = (str: string) => str.toLowerCase().split(' ').sort().join(' ');

  const normalized1 = normalize(String(value).toLowerCase());
  const normalized2 = normalize(String(search).toLowerCase());

  return normalized2.split(' ').every((word) => normalized1.includes(word));
}
