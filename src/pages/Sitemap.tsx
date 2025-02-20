
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const Sitemap = () => {
  useEffect(() => {
    const redirectToSitemap = async () => {
      const { data: functionData, error } = await supabase.functions.invoke('sitemap', {
        method: 'GET'
      });
      
      if (error) {
        console.error('Error fetching sitemap:', error);
        return;
      }
      
      const session = await supabase.auth.getSession();
      const response = await fetch(functionData.url, {
        headers: {
          'apikey': supabase.supabaseKey
        }
      });
      
      const xml = await response.text();
      
      // Create a new document with the correct content type
      const xmlDoc = '<?xml version="1.0" encoding="UTF-8"?>\n' + xml;
      const blob = new Blob([xmlDoc], { type: 'application/xml' });
      const url = window.URL.createObjectURL(blob);
      window.location.href = url;
    };

    redirectToSitemap();
  }, []);

  return null;
};

export default Sitemap;
