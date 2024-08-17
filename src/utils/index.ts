export { default as classNames } from './classnames';

export function downloadItem(url: string, fileName: string) {
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  setTimeout(() => {
    document.body.removeChild(link);
  }, 1000);
}

export { default as formatPrice } from './format-price';
export * as filters from './filters';
