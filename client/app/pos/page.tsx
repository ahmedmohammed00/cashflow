'use client';

import * as React from 'react';
import { Cart } from '@/components/pos/cart';
import type { CartItem, Product } from '@/lib/types';
import { DataTable } from '@/components/pos/product-table/data-table';
import { columns } from '@/components/pos/product-table/columns';
import { Smartphone, Loader2, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';

function ProductTableSkeleton() {
  return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-1 items-center space-x-2">
            <Skeleton className="h-8 w-[150px] lg:w-[250px]" />
            <Skeleton className="h-8 w-[150px]" />
          </div>
          <Skeleton className="h-8 w-20" />
        </div>
        <div className="rounded-md border">
          <div className="p-4 space-y-3">
            {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-8 w-full" />
            ))}
          </div>
        </div>
      </div>
  );
}

export default function PosPage() {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [cartItems, setCartItems] = React.useState<CartItem[]>([]);
  const [authLoading, setAuthLoading] = React.useState(true);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const router = useRouter();

  // Check authentication
  React.useEffect(() => {
    async function checkAuth() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setIsAuthenticated(false);
          return;
        }

        const res = await fetch('http://localhost:5005/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setIsAuthenticated(res.ok);
      } catch {
        setIsAuthenticated(false);
      } finally {
        setAuthLoading(false);
      }
    }
    checkAuth();
  }, []);

  // Fetch products once authenticated
  React.useEffect(() => {
    if (!isAuthenticated) return;

    async function loadProducts() {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error("لا يوجد توكن. الرجاء تسجيل الدخول.");
          return;
        }

        const products = await fetchProductsLib(token);
        setProducts(products);
      } catch (error) {
        console.error(error);
        toast.error("فشل تحميل المنتجات");
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [isAuthenticated]);

  // Cart handlers
  const handleAddToCart = (product: Product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.product.id === product.id);

      if (existingItem) {
        if (existingItem.quantity < product.stock) {
          return prevItems.map((item) =>
              item.product.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
          );
        } else {
          toast.error('نفذ المخزون', {
            description: `لا يمكن إضافة المزيد من ${product.name}.`,
          });
          return prevItems;
        }
      } else {
        if (product.stock > 0) {
          return [...prevItems, { product, quantity: 1, discount: 0 }];
        } else {
          toast.error('نفذ المخزون', {
            description: `${product.name} غير متوفر في المخزون.`,
          });
          return prevItems;
        }
      }
    });
  };

  const handleUpdateCart = (updatedItems: CartItem[]) => setCartItems(updatedItems);
  const handleClearCart = () => setCartItems([]);

  if (authLoading || loading) {
    return (
        <div className="flex items-center justify-center h-[80vh]">
          <Loader2 className="h-8 w-8 animate-spin mr-2" />
          <p className="text-lg">جاري التحميل...</p>
        </div>
    );
  }

  if (!isAuthenticated) {
    return (
        <div className="flex flex-col items-center justify-center h-[80vh]">
          <ShieldAlert className="h-16 w-16 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2">تسجيل الدخول مطلوب</h2>
          <p className="text-gray-600 mb-4">
            يرجى تسجيل الدخول للوصول إلى نقطة البيع
          </p>
        </div>
    );
  }

  return (
      <div className="flex flex-col md:flex-row gap-4 p-4">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">نقطة البيع</h1>
            <div className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              <span className="text-sm font-medium">POS</span>
            </div>
          </div>

          {loading ? (
              <ProductTableSkeleton />
          ) : (
              <DataTable
                  columns={columns({ onAddToCart: handleAddToCart, cartItems })}
                  data={products}
              />
          )}
        </div>

        <div className="md:col-span-1 xl:col-span-1 border-l bg-card">
          <Cart
              cartItems={cartItems}
              onUpdateCart={handleUpdateCart}
              onClearCart={handleClearCart}
          />
        </div>

        <div className="md:hidden flex flex-col items-center justify-center h-[calc(100vh-4rem)] text-center p-4">
          <Smartphone className="h-16 w-16 mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">
            واجهة نقاط البيع غير متاحة على الهاتف المحمول
          </h2>
          <p className="text-muted-foreground">
            يرجى استخدام جهاز لوحي أو كمبيوتر مكتبي للوصول إلى هذه الصفحة.
          </p>
        </div>
      </div>
  );
}
