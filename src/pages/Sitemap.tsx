
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
          'apikey': supabase.supabaseKey,
        }
      });
      
      const xml = await response.text();
      const blob = new Blob([xml], { type: 'application/xml' });
      const url = window.URL.createObjectURL(blob);
      
      // Create an invisible link and click it to trigger the download
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    };

    redirectToSitemap();
  }, []);

  return null;
};

export default Sitemap;
