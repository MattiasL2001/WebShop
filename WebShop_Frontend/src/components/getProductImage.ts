export const getProductImage = (imageName: string | null): string => {
    try {
      return require(`../images/products/${imageName}.png`);
    } catch {
      return require(`../images/products/1.png`);
    }
  };