
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const ITEMS_PER_PAGE = 12;

const Category = () => {
  const { slug } = useParams();
  const [page, setPage] = useState(0);

  const { data: category } = useQuery({
    queryKey: ['category', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  const { data: productsData } = useQuery({
    queryKey: ['category-products', slug, page],
    queryFn: async () => {
      const from = page * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      const { data, error, count } = await supabase
        .from('products')
        .select('*, brands:brand_id(*)', { count: 'exact' })
        .eq('category_id', category?.id)
        .range(from, to);

      if (error) throw error;
      return {
        items: data,
        hasMore: count ? count > to + 1 : false,
      };
    },
    enabled: !!category?.id,
  });

  if (!category) {
    return <div>Category not found</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
        <p className="text-muted-foreground mb-8">{category.description}</p>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {productsData?.items.map((product) => (
            <Link key={product.id} to={`/product/${product.slug}`}>
              <Card className="p-4 hover:shadow-lg transition-shadow">
                <h3 className="font-semibold mb-2">{product.name}</h3>
                {product.brands && (
                  <p className="text-sm text-muted-foreground mb-2">{product.brands.name}</p>
                )}
                <p className="font-bold">${product.price}</p>
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
    </div>
  );
};

export default Category;
