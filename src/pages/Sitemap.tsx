
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const Sitemap = () => {
  useEffect(() => {
    const getSitemap = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('sitemap', {
          method: 'GET'
        });
        
        if (error) {
          console.error('Error fetching sitemap:', error);
          return;
        }

        // Set the content type to XML
        const doc = document.implementation.createHTMLDocument('');
        doc.documentElement.innerHTML = data.sitemap;
        document.documentElement.innerHTML = doc.documentElement.innerHTML;
        document.querySelector('html')?.setAttribute('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9');
      } catch (err) {
        console.error('Error processing sitemap:', err);
      }
    };

    getSitemap();
  }, []);

  return null;
};

export default Sitemap;
