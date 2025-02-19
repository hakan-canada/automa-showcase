
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { useState } from 'react';

const ITEMS_PER_PAGE = 12;

const Brand = () => {
  const { slug } = useParams();
  const [page, setPage] = useState(0);

  const { data: brand } = useQuery({
    queryKey: ['brand', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  const { data: productsData } = useQuery({
    queryKey: ['brand-products', slug, page],
    queryFn: async () => {
      const from = page * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      const { data, error, count } = await supabase
        .from('products')
        .select('*, categories:category_id(*)', { count: 'exact' })
        .eq('brand_id', brand?.id)
        .range(from, to);

      if (error) throw error;
      return {
        items: data,
        hasMore: count ? count > to + 1 : false,
      };
    },
    enabled: !!brand?.id,
  });

  if (!brand) {
    return <div>Brand not found</div>;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">{brand.name}</h1>
            <p className="text-muted-foreground">{brand.description}</p>
          </div>
          {brand.website_url && (
            <a
              href={brand.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-primary hover:underline"
            >
              Visit Website
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {productsData?.items.map((product) => (
            <Link key={product.id} to={`/product/${product.slug}`}>
              <Card className="p-4 hover:shadow-lg transition-shadow">
                <div className="w-full h-48 bg-muted rounded-md flex items-center justify-center mb-4">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="max-w-full max-h-full object-contain rounded-md"
                  />
                </div>
                <h3 className="font-semibold mb-2">{product.name}</h3>
                {product.categories && (
                  <p className="text-sm text-muted-foreground mb-2">{product.categories.name}</p>
                )}
              </Card>
            </Link>
          ))}
        </div>

        {productsData?.hasMore && (
          <div className="mt-8 text-center">
            <Button 
              variant="outline"
              onClick={() => setPage(p => p + 1)}
            >
              Load More
            </Button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Brand;
