import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Badge } from '@/components/ui/badge';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const { data: products, isLoading } = useQuery({
    queryKey: ['search', query],
    queryFn: async () => {
      if (!query) return [];

      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          brands:brand_id(*),
          categories:category_id(*)
        `)
        .textSearch('name', query)
        .limit(50);

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">
          Search Results for "{query}"
        </h1>

        {isLoading ? (
          <div>Loading...</div>
        ) : products?.length === 0 ? (
          <div className="flex flex-col items-center justify-center">
            <p className="text-lg text-muted-foreground mb-4">
              We may not have it in our system, but that doesn't mean we can't quote you.
            </p>
            <Link to="/quote">
              <Button variant="outline" className="flex items-center">
                <FileText className="mr-2 h-4 w-4" />
                Request a Quote
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products?.map((product) => (
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
    </div>
  );
};

export default Search;
