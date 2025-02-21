import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import { FileText, Clock } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

const Quote = () => {
  const [searchParams] = useSearchParams();
  const productName = searchParams.get('product');
  const [productValue, setProductValue] = useState("");

  useEffect(() => {
    if (productName) {
      setProductValue(productName);
    }
  }, [productName]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <section className="text-center mb-12 animate-fade-up">
            <h1 className="text-4xl font-bold mb-4">Request a Quote</h1>
            <p className="text-xl text-muted-foreground">
              Need pricing for specific automation products? Fill out the form below 
              and we'll provide you with a detailed quote within one business day.
            </p>
          </section>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="p-6">
              <FileText className="w-6 h-6 mb-4 text-primary" />
              <h3 className="font-semibold mb-2">Detailed Quotes</h3>
              <p className="text-muted-foreground">
                Provide as much detail as possible about the products you need for an accurate quote.
              </p>
            </Card>
            <Card className="p-6">
              <Clock className="w-6 h-6 mb-4 text-primary" />
              <h3 className="font-semibold mb-2">Fast Response</h3>
              <p className="text-muted-foreground">
                Our team will process your request and get back to you within 24 business hours.
              </p>
            </Card>
          </div>

          <Card className="p-8">
            <form
              name="quote"
              method="POST"
              netlify="true"
              netlify-honeypot="bot-field"
              className="space-y-6"
            >
              <input type="hidden" name="form-name" value="quote" />
              <p className="hidden">
                <label>Don't fill this out if you're human: <input name="bot-field" /></label>
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    name="company"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone (Optional)</Label>
                  <Input id="phone" name="phone" type="tel" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="products">Products Needed</Label>
                <Textarea
                  id="products"
                  name="products"
                  placeholder="Please list the products you need quotes for, including quantities and any specific requirements."
                  className="min-h-[150px]"
                  value={productValue}
                  onChange={(e) => setProductValue(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeline">Timeline (Optional)</Label>
                <Input
                  id="timeline"
                  name="timeline"
                  placeholder="When do you need these products?"
                />
              </div>

              <Button type="submit" className="w-full md:w-auto">
                Request Quote
              </Button>
            </form>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Quote;
