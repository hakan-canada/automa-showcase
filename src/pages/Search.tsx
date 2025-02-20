import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Badge } from '@/components/ui/badge';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SEARCH_LIMIT = 12;

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const { data: products, isLoading } = useQuery({
    queryKey: ['search', query],
    queryFn: async () => {
      if (!query) return { items: [], total: 0 };

      const [productResults, brandResults] = await Promise.all([
        // Search in products
        supabase
          .from('products')
          .select(`
            *,
            brands:brand_id(*),
            categories:category_id(*)
          `)
          .or(`name.ilike.%${query}%, alternative_name.ilike.%${query}%`)
          .limit(SEARCH_LIMIT),
        
        // Get products by brand name
        supabase
          .from('products')
          .select(`
            *,
            brands:brand_id!inner(*),
            categories:category_id(*)
          `)
          .ilike('brands.name', `%${query}%`)
          .limit(SEARCH_LIMIT)
      ]);

      if (productResults.error) throw productResults.error;
      if (brandResults.error) throw brandResults.error;

      // Combine and deduplicate results
      const allProducts = [...productResults.data, ...brandResults.data];
      const uniqueProducts = Array.from(new Map(allProducts.map(item => [item.id, item])).values());

      return {
        items: uniqueProducts.slice(0, SEARCH_LIMIT),
        total: uniqueProducts.length
      };
    },
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-3xl font-bold mb-4">
          Search Results for "{query}"
        </h1>
        {products?.total > SEARCH_LIMIT && (
          <p className="text-muted-foreground mb-8">
            Showing top {SEARCH_LIMIT} results of {products.total} matches
          </p>
        )}

        {isLoading ? (
          <div>Loading...</div>
        ) : products?.items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-lg text-muted-foreground mb-4">
              We couldn't find what you're looking for in our system, but that doesn't mean we can't help you get it.
            </p>
            <Link to={`/quote?query=${encodeURIComponent(query)}`}>
              <Button variant="outline" className="flex items-center">
                <FileText className="mr-2 h-4 w-4" />
                Request a Quote
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products?.items.map((product) => (
              <Link key={product.id} to={`/product/${product.slug}`}>
                <Card className="p-4 hover:shadow-lg transition-shadow">
                  <div className="w-full h-48 bg-muted rounded-md flex items-center justify-center mb-4">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="max-w-full max-h-full object-contain rounded-md"
                    />
                  </div>
                  <h3 className="font-semibold mb-2">
                    {product.brands?.name} {product.name}
                  </h3>
                  {product.brands && (
                    <Badge variant="secondary" className="mb-2">
                      {product.brands.name}
                    </Badge>
                  )}
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Search;
