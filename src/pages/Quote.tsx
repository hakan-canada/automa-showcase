import { useForm } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import { FileText, Clock } from "lucide-react";
import { useSearchParams } from "react-router-dom";

const Quote = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [searchParams] = useSearchParams();
  const productName = searchParams.get('product');

  const onSubmit = (data: any) => {
    // Form will be handled by Netlify
    reset();
  };

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
              onSubmit={handleSubmit(onSubmit)}
              name="quote"
              method="POST"
              data-netlify="true"
              data-netlify-honeypot="bot-field"
              className="space-y-6"
            >
              <input type="hidden" name="form-name" value="quote" />
              <p className="hidden">
                <label>
                  Don't fill this out if you're human: <input name="bot-field" />
                </label>
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    {...register("name", { required: true })}
                    className={errors.name ? "border-destructive" : ""}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">Name is required</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email", { 
                      required: true,
                      pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
                    })}
                    className={errors.email ? "border-destructive" : ""}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">Valid email is required</p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    {...register("company", { required: true })}
                    className={errors.company ? "border-destructive" : ""}
                  />
                  {errors.company && (
                    <p className="text-sm text-destructive">Company is required</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone (Optional)</Label>
                  <Input id="phone" type="tel" {...register("phone")} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="products">Products Needed</Label>
                <Textarea
                  id="products"
                  {...register("products", { required: true })}
                  placeholder="Please list the products you need quotes for, including quantities and any specific requirements."
                  className={`min-h-[150px] ${errors.products ? "border-destructive" : ""}`}
                  defaultValue={productName ? productName : ""}
                />
                {errors.products && (
                  <p className="text-sm text-destructive">Product details are required</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeline">Timeline (Optional)</Label>
                <Input
                  id="timeline"
                  placeholder="When do you need these products?"
                  {...register("timeline")}
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
