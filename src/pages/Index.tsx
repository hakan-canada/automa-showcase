
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import { ChevronRight } from 'lucide-react';

const FeaturedProduct = ({ name, description, category }: { 
  name: string; 
  description: string; 
  category: string; 
}) => (
  <Card className="p-6 hover:shadow-lg transition-shadow">
    <Badge className="mb-2">{category}</Badge>
    <h3 className="text-lg font-semibold mb-2">{name}</h3>
    <p className="text-muted-foreground text-sm">{description}</p>
  </Card>
);

const Index = () => {
  // This will be replaced with actual data from Supabase
  const featuredProducts = [
    {
      name: "Industrial PLC Controller",
      description: "High-performance programmable logic controller for industrial automation",
      category: "Controllers"
    },
    {
      name: "Servo Motor Drive",
      description: "Precision servo drive system for motion control applications",
      category: "Motors"
    },
    {
      name: "HMI Touch Panel",
      description: "10-inch touch screen interface for machine control",
      category: "Interface"
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
            <a href="/products" className="text-primary flex items-center hover:underline">
              View all <ChevronRight className="h-4 w-4 ml-1" />
            </a>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product, index) => (
              <FeaturedProduct key={index} {...product} />
            ))}
          </div>
        </section>

        <section className="grid md:grid-cols-2 gap-8 mb-16 animate-fade-up">
          <div className="bg-primary/5 rounded-lg p-8">
            <h2 className="text-2xl font-semibold mb-4">Request a Quote</h2>
            <p className="text-muted-foreground mb-4">
              Get personalized quotes for your automation needs
            </p>
            <a href="/quote" className="text-primary hover:underline flex items-center">
              Get started <ChevronRight className="h-4 w-4 ml-1" />
            </a>
          </div>
          <div className="bg-primary/5 rounded-lg p-8">
            <h2 className="text-2xl font-semibold mb-4">Browse Categories</h2>
            <p className="text-muted-foreground mb-4">
              Explore our comprehensive range of automation products
            </p>
            <a href="/categories" className="text-primary hover:underline flex items-center">
              View categories <ChevronRight className="h-4 w-4 ml-1" />
            </a>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
