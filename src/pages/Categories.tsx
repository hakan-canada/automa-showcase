
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';

const Categories = () => {
  const { data: categories } = useQuery({
    queryKey: ['all-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">All Categories</h1>
        
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
      </main>
    </div>
  );
};

export default Categories;
