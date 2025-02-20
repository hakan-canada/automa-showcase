import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { RelatedProductsTable } from '@/components/product/RelatedProductsTable';
import { ProductHeader } from '@/components/product/ProductHeader';
import { ProductActions } from '@/components/product/ProductActions';
import { SEO } from '@/components/SEO';

const Product = () => {
  const { slug } = useParams();

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories:category_id(*),
          brands:brand_id(*)
        `)
        .eq('slug', slug)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  const { data: relatedProducts } = useQuery({
    queryKey: ['related-products', product?.id],
    enabled: !!product?.id,
    queryFn: async () => {
      try {
        if (!product?.id) return [];

        const { data, error } = await supabase
          .from('related_products')
          .select(`
            products!related_products_related_product_id_fkey (
              id,
              name,
              slug,
              description,
              image,
              url,
              categories:category_id (
                name,
                slug
              ),
              brands:brand_id (
                name,
                slug
              )
            )
          `)
          .eq('product_id', product.id);

        if (error) {
          console.error('Error fetching related products:', error);
          return [];
        }

        return data.map(item => item.products);
      } catch (error) {
        console.error('Error in related products query:', error);
        return [];
      }
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="container mx-auto px-4 py-8 flex-grow">
          <div>Loading...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="container mx-auto px-4 py-8 flex-grow">
          <div>Product not found</div>
        </main>
        <Footer />
      </div>
    );
  }

  const productFullName = `${product.brands?.name} ${product.name}`;
  const productDescription = product.description || `Details about ${productFullName}`;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO
        title={`${productFullName} | Parts Supplied`}
        description={productDescription}
        canonicalUrl={`https://partssupplied.com/product/${slug}`}
        type="product"
        image={product.image || undefined}
      />
      <Navbar />
      <main className="container mx-auto px-4 py-8 flex-grow">
        <Card className="overflow-hidden mb-8">
          <div className="grid md:grid-cols-2 gap-8 p-6">
            <div className="flex items-center justify-center bg-muted rounded-lg p-4">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="max-w-full h-auto rounded-md"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex-grow">
                <ProductHeader 
                  name={`${product.brands?.name} ${product.name}`}
                  categories={product.categories}
                  brands={product.brands}
                />
                {product.alternative_name && (
                  <p className="text-sm text-muted-foreground mb-4">
                    Alternative Name: {product.alternative_name}
                  </p>
                )}
                <div className="space-y-4 mb-8">
                  <p className="text-muted-foreground">{product.description}</p>
                  {product.long_description && (
                    <div className="prose prose-sm max-w-none">
                      {product.long_description}
                    </div>
                  )}
                </div>
              </div>
              <ProductActions 
                productName={product.name}
                productUrl={product.url}
              />
            </div>
          </div>
        </Card>

        {relatedProducts && relatedProducts.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-semibold mb-6">Related Products</h2>
            <RelatedProductsTable products={relatedProducts} />
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Product;
