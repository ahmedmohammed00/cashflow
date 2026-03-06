
import type { Product } from '@/lib/types';
import {UnauthenticatedMessage , MobileUnsupportedMessage} from '../features/pos/components/unauthorized'
import {requireUser} from "@/lib/authHelper";
import {getProducts} from '@/app/features/products/services'
import {PosClient} from "@/app/features/pos/components/posClient";

export default async function PosPage() {


  const user = requireUser();

  if (!user) return <UnauthenticatedMessage/>;

  let products: Product[] = [];
  try {
    products = await getProducts();
  } catch (err) {
    console.error('Failed to load products:', err);
  }

  return (

      <>
        <MobileUnsupportedMessage/>
        <div className="hidden md:flex flex-row gap-4 p-4">
          <PosClient products={products}/>
        </div>
      </>
  );
}