
import { useForm } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import { Phone, Mail, Clock } from "lucide-react";
import Footer from "@/components/Footer";
import { useState } from "react";
import { toast } from "sonner";

const Contact = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = (data: any) => {
    setIsSubmitting(true);
    // Let the form submit naturally to Netlify
    // We'll reset the form in componentDidMount
    console.log("Form submitted:", data);
    // We don't reset() here as we're letting Netlify handle the submission
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <section className="text-center mb-12 animate-fade-up">
            <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
            <p className="text-xl text-muted-foreground">
              Whether we have the part on our website or not, we can find the product you need. 
              Fill out the form below and we'll get back to you same day or next business day.
            </p>
          </section>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="p-6 text-center">
              <Mail className="w-6 h-6 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold mb-2">Email Us</h3>
              <p className="text-muted-foreground">quote@partssupplied.com</p>
            </Card>
            <Card className="p-6 text-center">
              <Clock className="w-6 h-6 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold mb-2">Business Hours</h3>
              <p className="text-muted-foreground">Mon-Fri: 9AM-6PM EST</p>
            </Card>
          </div>

          <Card className="p-8">
            {/* Hidden form fields for Netlify */}
            <div hidden>
              <form name="contact" data-netlify="true" netlify-honeypot="bot-field">
                <input type="text" name="name" />
                <input type="email" name="email" />
                <input type="text" name="company" />
                <textarea name="message"></textarea>
              </form>
            </div>

            <form 
              name="contact"
              method="POST"
              data-netlify="true"
              data-netlify-honeypot="bot-field"
              className="space-y-6"
              onSubmit={handleSubmit(onSubmit)}
              action="/thank-you"
            >
              <input type="hidden" name="form-name" value="contact" />
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
                    name="name"
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
                    name="email"
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

              <div className="space-y-2">
                <Label htmlFor="company">Company (Optional)</Label>
                <Input id="company" name="company" {...register("company")} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  {...register("message", { required: true })}
                  className={`min-h-[150px] ${errors.message ? "border-destructive" : ""}`}
                />
                {errors.message && (
                  <p className="text-sm text-destructive">Message is required</p>
                )}
              </div>

              <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
