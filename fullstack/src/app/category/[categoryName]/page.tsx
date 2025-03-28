'use client';

import React from 'react'
import { LoadingSpinner } from '@/components/ui/spinner';
import { getProducts, Product } from '@/lib/firebase/products';
import { useRouter } from 'nextjs-toploader/app';
import { ProductCard } from '@/components/ProductCard/product-card';

const CategoryPage = () => {
  const [loading, setLoading] = React.useState(true);
  const [products, setProducts] = React.useState<Product[]>();
  const router = useRouter();

    React.useEffect(() => {
        // Get products from Firestore
        getProducts()
          .then(products => setProducts(products))
          .catch(error => { console.error(error) })
          .finally(() => { setLoading(false) });
      }, []);

    if (loading) {
        return (
            <LoadingSpinner className='w-full block mx-auto'/>
        );
    }

  return (
     <div className="p-[2rem] grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-10 place-items-center">
            {products &&
              products?.map((product) => {
                return (
                  <div
                    key={product.id}
                    onClick={() =>
                      router.push(`/productPage/${product.collectionName}/${product.id}`)
                    }
                    style={{ cursor: "pointer" }}
                  >
                    <ProductCard
                      name={product.name}
                      price={product.price}
                      imageSrc={product.imageSrc}
                    />
                  </div>
                );
              })
            }
          </div>
  )
}

export default CategoryPage
