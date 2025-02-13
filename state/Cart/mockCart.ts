import { ProductInterface } from '../../interfaces';

export const mockCart = [
  {
    product: {
      _id: '1',
      name: 'Product 1',
      image: '/images/product1.jpg',
      description: 'Description for product 1',
      brand: 'Brand 1',
      category: 'Category 1',
      price: 100,
      countInStock: 10,
      rating: 4.5,
      numReviews: 12,
    } as ProductInterface,
    qty: 2,
  },
  {
    product: {
      _id: '2',
      name: 'Product 2',
      image: '/images/product2.jpg',
      description: 'Description for product 2',
      brand: 'Brand 2',
      category: 'Category 2',
      price: 200,
      countInStock: 5,
      rating: 4.0,
      numReviews: 8,
    } as ProductInterface,
    qty: 1,
  },
  // Add more mock cart items as needed
];