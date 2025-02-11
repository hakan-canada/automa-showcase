
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Separator } from '@/components/ui/separator';

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
        <Card className="p-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
              <p className="text-muted-foreground mb-4">{product.description}</p>
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
              <p className="text-2xl font-bold">${product.price}</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-4">Specifications</h2>
              <div className="space-y-2">
                {product.specifications && Object.entries(product.specifications as Record<string, unknown>).map(([key, value]) => (
                  <div key={key}>
                    <span className="font-medium capitalize">{key.replace('_', ' ')}: </span>
                    <span className="text-muted-foreground">
                      {Array.isArray(value) ? value.join(', ') : String(value)}
                    </span>
                    <Separator className="my-2" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Product;
