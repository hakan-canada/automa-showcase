
import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Contact from "./pages/Contact";
import Quote from "./pages/Quote";
import NotFound from "./pages/NotFound";
import Product from "./pages/Product";
import Category from "./pages/Category";
import Brand from "./pages/Brand";
import Categories from "./pages/Categories";
import Search from "./pages/Search";

export const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/quote" element={<Quote />} />
      <Route path="/product/:slug" element={<Product />} />
      <Route path="/category/:slug" element={<Category />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/brand/:slug" element={<Brand />} />
      <Route path="/search" element={<Search />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
