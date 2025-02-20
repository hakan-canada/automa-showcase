
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

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

const Categories = () => {
  const { data: categoriesData } = useQuery({
    queryKey: ['categories-with-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select(`
          *,
          products(
            id,
            name,
            slug,
            description,
            image,
            brands:brand_id(*)
          )
        `)
        .order('name');

      if (error) throw error;
      
      return data?.map(category => ({
        ...category,
        thumbnail: category.products?.[0]?.image || "/placeholder.svg",
        products: category.products || []
      }));
    },
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="container mx-auto px-4 py-8 flex-grow">
        {categoriesData?.map((category) => (
          <section key={category.id} className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">{category.name}</h2>
              <Link 
                to={`/category/${category.slug}`}
                className="text-primary hover:underline"
              >
                View all products
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {category.products.slice(0, 4).map((product) => (
                <ProductCard
                  key={product.id}
                  name={product.name}
                  description={product.description}
                  brand={product.brands}
                  image={product.image}
                  slug={product.slug}
                />
              ))}
            </div>
          </section>
        ))}
      </main>
      <Footer />
    </div>
  );
};

export default Categories;
