export const getProductImage = (imageName: string | null): string => {
  try {
    return new URL(`../images/products/${imageName}.png`, import.meta.url).href;
  } catch {
    return new URL(`../images/products/1.png`, import.meta.url).href;
  }
};
