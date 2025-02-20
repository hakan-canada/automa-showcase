import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { SEO } from '@/components/SEO';

const ITEMS_PER_PAGE = 12;

const ProductCard = ({ 
  name, 
  description,
  brand,
  image,
  slug 
}: { 
  name: string;
  description: string | null;
  brand: { name: string; slug: string } | null;
  image: string | null;
  slug: string;
}) => (
  <Link to={`/product/${slug}`}>
    <Card className="p-6 hover:shadow-lg transition-shadow h-full">
      <div className="relative">
        <div className="w-full h-48 bg-muted rounded-md flex items-center justify-center mb-4">
          <img
            src={image || "/placeholder.svg"}
            alt={name}
            className="max-w-full max-h-full object-contain rounded-md"
          />
        </div>
        <Badge variant="secondary" className="absolute top-2 right-2 bg-green-500 text-white">In Stock</Badge>
      </div>
      {brand && (
        <Badge variant="outline" className="mb-2">{brand.name}</Badge>
      )}
      <h3 className="text-lg font-semibold mb-2">{name}</h3>
      <p className="text-muted-foreground text-sm line-clamp-2">{description}</p>
    </Card>
  </Link>
);

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
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="container mx-auto px-4 py-8 flex-grow">
          <div>Category not found</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO
        title={`Shop ${category.name} | Parts Supplied`}
        description={`Browse our selection of ${category.name} products. We offer in stock items from top manufacturers with competitive pricing and fast shipping.`}
        canonicalUrl={`https://partssupplied.com/category/${slug}`}
      />
      <Navbar />
      <main className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-3xl font-bold mb-8">{category.name}</h1>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {productsData?.items.map((product) => (
            <ProductCard
              key={product.id}
              name={`${product.brands?.name} ${product.name}`}
              description={product.description}
              brand={product.brands}
              image={product.image}
              slug={product.slug}
            />
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

export default Category;
