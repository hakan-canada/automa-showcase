import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import { ChevronRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';

const FeaturedProduct = ({ 
  name, 
  description, 
  brand,
  image,
  slug 
}: { 
  name: string;
  description: string | null;
  brand: { name: string; slug: string };
  image: string | null;
  slug: string;
}) => (
  <Link to={`/product/${slug}`}>
    <Card className="p-6 hover:shadow-lg transition-shadow h-full">
      <div className="w-full h-48 bg-muted rounded-md flex items-center justify-center mb-4">
        <img
          src={image || "/placeholder.svg"}
          alt={name}
          className="max-w-full max-h-full object-contain rounded-md"
        />
      </div>
      {brand && (
        <Badge variant="outline" className="mb-2">{brand.name}</Badge>
      )}
      <h3 className="text-lg font-semibold mb-2">{name}</h3>
      <p className="text-muted-foreground text-sm line-clamp-2">{description}</p>
    </Card>
  </Link>
);

const Index = () => {
  const { data: featuredProducts } = useQuery({
    queryKey: ['featured-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories:category_id(*),
          brands:brand_id(*)
        `)
        .limit(3);

      if (error) throw error;
      return data;
    },
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .limit(12);

      if (error) throw error;
      return data;
    },
  });

  const { data: brands } = useQuery({
    queryKey: ['brands'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('brands')
        .select('*');

      if (error) throw error;
      return data;
    },
  });

  const topBrandLogos = [
    { 
      name: 'Rittal',
      logo: 'https://ykcgooinlzlhtonueasz.supabase.co/storage/v1/object/public/images//rittal-logo.png',
      slug: 'rittal'
    },
    {
      name: 'Phoenix Contact',
      logo: 'https://ykcgooinlzlhtonueasz.supabase.co/storage/v1/object/public/images//Phoenix_Contact.png',
      slug: 'phoenix-contact'
    },
    {
      name: 'ABB',
      logo: 'https://ykcgooinlzlhtonueasz.supabase.co/storage/v1/object/public/images//ABB_logo.png',
      slug: 'abb'
    },
    {
      name: 'SMC',
      logo: 'https://ykcgooinlzlhtonueasz.supabase.co/storage/v1/object/public/images//SMC-Canada-Elite-distributor.png',
      slug: 'smc'
    },
    {
      name: 'Omron',
      logo: 'https://ykcgooinlzlhtonueasz.supabase.co/storage/v1/object/public/images//OMRON_Logo.png',
      slug: 'omron'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <section className="text-center mb-16 animate-fade-up">
          <h1 className="text-4xl font-bold mb-4">
            Industrial Automation Solutions
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover premium automation products from leading manufacturers
          </p>
        </section>

        <section className="mb-16 animate-fade-up">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-semibold">Featured Products</h2>
            <Link to="/categories" className="text-primary flex items-center hover:underline">
              View all <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts?.map((product) => (
              <FeaturedProduct
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

        <section className="mb-16 animate-fade-up">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-semibold">Top Brands</h2>
            <Link to="/brands" className="text-primary flex items-center hover:underline">
              View all <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {topBrandLogos.map((brand) => (
              <Link
                key={brand.name}
                to={`/brand/${brand.slug}`}
                className="group"
              >
                <Card className="p-6 hover:shadow-lg transition-shadow flex items-center justify-center h-32">
                  <img
                    src={brand.logo}
                    alt={`${brand.name} logo`}
                    className="max-w-full max-h-full object-contain filter grayscale hover:grayscale-0 transition-all"
                  />
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-16 animate-fade-up">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-semibold">Browse by Category</h2>
            <Link to="/categories" className="text-primary flex items-center hover:underline">
              View all <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories?.map((category) => (
              <Link
                key={category.id}
                to={`/category/${category.slug}`}
                className="group"
              >
                <Card className="p-6 hover:shadow-lg transition-shadow group-hover:border-primary">
                  <h3 className="font-semibold group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <section className="bg-primary/5 rounded-lg p-8 animate-fade-up">
          <h2 className="text-2xl font-semibold mb-4">Request a Quote</h2>
          <p className="text-muted-foreground mb-4">
            Get personalized quotes for your automation needs
          </p>
          <Link to="/quote" className="text-primary hover:underline flex items-center">
            Get started <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </section>
      </main>
    </div>
  );
};

export default Index;
