
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const Sitemap = () => {
  useEffect(() => {
    const redirectToSitemap = async () => {
      const { data, error } = await supabase.functions.invoke('sitemap', {
        method: 'GET'
      });
      
      if (error) {
        console.error('Error fetching sitemap:', error);
        return;
      }
      
      const response = await fetch(data.url, {
        headers: {
          'Authorization': `Bearer ${supabase.auth.session()?.access_token}`
        }
      });
      
      const xml = await response.text();
      document.open('text/xml');
      document.write(xml);
      document.close();
    };

    redirectToSitemap();
  }, []);

  return null;
};

export default Sitemap;
