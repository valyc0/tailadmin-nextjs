interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
}

interface ApiError extends Error {
  status?: number;
  code?: string;
}

const BASE_URL = '/api';

const getAuthHeaders = () => {
  const token = sessionStorage.getItem('token');
  if (!token) {
    // Instead of directly navigating, throw an error that will be handled by the component
    throw new Error('No authentication token found');
  }
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

const handleApiError = (error: Error | ApiError) => {
  console.error('API Error:', error);
  // Let the component handle navigation based on error type
  if (error.message === 'No authentication token found' ||
      (error as ApiError).status === 403) {
    throw new Error('Authentication required');
  }
  throw error;
};

export const productService = {
  getAllProducts: async (): Promise<Product[]> => {
    try {
      const headers = getAuthHeaders();
      const response = await fetch(`${BASE_URL}/products`, {
        method: 'GET',
        headers,
        credentials: 'include'
      });
      
      if (!response.ok) {
        const error: ApiError = new Error('Failed to fetch products');
        error.status = response.status;
        throw error;
      }
      
      return response.json();
    } catch (error) {
      if (error instanceof Error) {
        handleApiError(error);
      }
      throw error;
    }
  },

  getProduct: async (id: number): Promise<Product> => {
    try {
      const headers = getAuthHeaders();
      const response = await fetch(`${BASE_URL}/products/${id}`, {
        method: 'GET',
        headers,
        credentials: 'include'
      });
      
      if (!response.ok) {
        const error: ApiError = new Error('Failed to fetch product');
        error.status = response.status;
        throw error;
      }
      
      return response.json();
    } catch (error) {
      if (error instanceof Error) {
        handleApiError(error);
      }
      throw error;
    }
  },

  createProduct: async (product: Omit<Product, 'id'>): Promise<Product> => {
    try {
      const headers = getAuthHeaders();
      const response = await fetch(`${BASE_URL}/products/create`, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({
          ...product,
          stockQuantity: product.quantity,
          active: true
        }),
      });
      
      if (!response.ok) {
        const error: ApiError = new Error('Failed to create product');
        error.status = response.status;
        throw error;
      }
      
      return response.json();
    } catch (error) {
      if (error instanceof Error) {
        handleApiError(error);
      }
      throw error;
    }
  },

  updateProduct: async (id: number, updates: Partial<Product>): Promise<Product> => {
    try {
      const headers = getAuthHeaders();
      const response = await fetch(`${BASE_URL}/products/${id}/update`, {
        method: 'PUT',
        headers,
        credentials: 'include',
        body: JSON.stringify({
          ...updates,
          stockQuantity: updates.quantity,
          active: true
        }),
      });
      
      if (!response.ok) {
        const error: ApiError = new Error('Failed to update product');
        error.status = response.status;
        throw error;
      }
      
      return response.json();
    } catch (error) {
      if (error instanceof Error) {
        handleApiError(error);
      }
      throw error;
    }
  },

  deleteProduct: async (id: number): Promise<void> => {
    try {
      const headers = getAuthHeaders();
      const response = await fetch(`${BASE_URL}/products/${id}/delete`, {
        method: 'DELETE',
        headers,
        credentials: 'include'
      });
      
      if (!response.ok) {
        const error: ApiError = new Error('Failed to delete product');
        error.status = response.status;
        if (response.status !== 403) {
          const errorData = await response.json().catch(() => null);
          error.message = errorData?.message ||
            `Failed to delete product (Status: ${response.status})`;
        }
        throw error;
      }
    } catch (error) {
      if (error instanceof Error) {
        handleApiError(error);
      }
      throw error;
    }
  },
};