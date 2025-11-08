import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

const PRODUCTS_STORAGE_KEY = '@sapa_umkm_products';

export type SubmittedProduct = {
  id: string;
  ownerId: string;
  ownerName: string;
  businessName: string;
  productName: string;
  category: string;
  priceRange: string;
  description: string;
  uniqueSellingPoint: string;
  productionCapacity: string;
  certifications: string;
  fulfillmentNotes: string;
  mediaLink?: string;
  imageBase64?: string;
  imageMimeType?: string;
  submittedAt: string;
  status: 'pending' | 'accepted' | 'rejected';
};

type ProductDraft = {
  ownerId: string;
  ownerName: string;
  businessName: string;
  productName: string;
  category: string;
  priceRange: string;
  description: string;
  uniqueSellingPoint: string;
  productionCapacity: string;
  certifications: string;
  fulfillmentNotes: string;
  mediaLink?: string;
  imageBase64?: string;
  imageMimeType?: string;
  status?: SubmittedProduct['status'];
};

type ProductsContextValue = {
  products: SubmittedProduct[];
  isLoading: boolean;
  addProduct: (draft: ProductDraft) => Promise<{ success: boolean; message: string }>;
  clearAll: () => Promise<void>;
};

const ProductsContext = createContext<ProductsContextValue | undefined>(undefined);

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<SubmittedProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const stored = await AsyncStorage.getItem(PRODUCTS_STORAGE_KEY);
        if (stored) {
          const parsed: SubmittedProduct[] = JSON.parse(stored);
          setProducts(parsed);
        }
      } catch (error) {
        console.warn('Failed to load submitted products', error);
      } finally {
        setIsLoading(false);
      }
    }

    void loadProducts();
  }, []);

  const addProduct = useCallback(async (draft: ProductDraft) => {
    const submittedAt = new Date().toISOString();
    const newProduct: SubmittedProduct = {
      id: generateId(),
      ownerId: draft.ownerId,
      ownerName: draft.ownerName,
      businessName: draft.businessName,
      productName: draft.productName,
      category: draft.category,
      priceRange: draft.priceRange,
      description: draft.description,
      uniqueSellingPoint: draft.uniqueSellingPoint,
      productionCapacity: draft.productionCapacity,
      certifications: draft.certifications,
      fulfillmentNotes: draft.fulfillmentNotes,
      mediaLink: draft.mediaLink,
      imageBase64: draft.imageBase64,
      imageMimeType: draft.imageMimeType,
      submittedAt,
      status: draft.status ?? 'pending',
    };

    setProducts((prev) => {
      const updated = [newProduct, ...prev];
      void AsyncStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });

    return {
      success: true,
      message: 'Pengajuan produk berhasil disimpan.',
    };
  }, []);

  const clearAll = useCallback(async () => {
    setProducts([]);
    await AsyncStorage.removeItem(PRODUCTS_STORAGE_KEY);
  }, []);

  const value = useMemo<ProductsContextValue>(
    () => ({ products, isLoading, addProduct, clearAll }),
    [products, isLoading, addProduct, clearAll]
  );

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts harus digunakan di dalam ProductsProvider');
  }
  return context;
}


