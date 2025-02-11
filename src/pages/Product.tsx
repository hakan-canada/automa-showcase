
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { ShoppingCart, FileText } from 'lucide-react';

interface RelatedProduct {
  id: number;
  name: string;
  slug: string;
  price: number | null;
  description: string | null;
  categories: {
    name: string;
    slug: string;
  } | null;
  brands: {
    name: string;
    slug: string;
  } | null;
}

const RelatedProductCard = ({ product }: { product: RelatedProduct }) => (
  <Link to={`/product/${product.slug}`}>
    <Card className="h-full hover:shadow-lg transition-shadow">
      <div className="p-4">
        <div className="aspect-square bg-muted rounded-md mb-4 flex items-center justify-center">
          <img
            src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"
            alt={product.name}
            className="max-w-full h-auto rounded-md"
          />
        </div>
        <div>
          <h3 className="font-semibold mb-2 line-clamp-2">{product.name}</h3>
          <div className="flex gap-2 mb-2">
            {product.categories && (
              <Badge variant="secondary" className="truncate">
                {product.categories.name}
              </Badge>
            )}
            {product.brands && (
              <Badge className="truncate">{product.brands.name}</Badge>
            )}
          </div>
          <p className="text-primary font-bold">${product.price}</p>
        </div>
      </div>
    </Card>
  </Link>
);

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
              price,
              description,
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

        return data.map(item => item.products) as RelatedProduct[];
      } catch (error) {
        console.error('Error in related products query:', error);
        return [];
      }
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Card className="overflow-hidden mb-8">
          <div className="grid md:grid-cols-2 gap-8 p-6">
            <div className="flex items-center justify-center bg-muted rounded-lg p-4">
              <img
                src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"
                alt={product.name}
                className="max-w-full h-auto rounded-md"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex-grow">
                <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
                <div className="flex gap-2 mb-4">
                  {product.categories && (
                    <Link to={`/category/${product.categories.slug}`}>
                      <Badge variant="secondary">{product.categories.name}</Badge>
                    </Link>
                  )}
                  {product.brands && (
                    <Link to={`/brand/${product.brands.slug}`}>
                      <Badge>{product.brands.name}</Badge>
                    </Link>
                  )}
                </div>
                <p className="text-muted-foreground mb-6">{product.description}</p>
                <p className="text-2xl font-bold mb-6">${product.price}</p>
              </div>
              
              <div className="space-y-4">
                <Button 
                  className="w-full"
                  size="lg"
                  onClick={() => window.open('https://proax.ca/en/product/194654/phx2966171', '_blank')}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Buy Now
                </Button>
                <Link 
                  to={`/quote?product=${encodeURIComponent(product.name)}`}
                  className="w-full"
                >
                  <Button 
                    variant="outline" 
                    className="w-full"
                    size="lg"
                  >
                    <FileText className="mr-2 h-5 w-5" />
                    Request Quote
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Card>

        {relatedProducts && relatedProducts.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-semibold mb-6">Related Products</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <RelatedProductCard 
                  key={relatedProduct.id} 
                  product={relatedProduct}
                />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default Product;
