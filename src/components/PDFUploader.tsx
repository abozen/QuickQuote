import { useState } from 'react';
import { Box, Button, Typography, Alert } from '@mui/material';
import { Product } from '@/types';

interface PDFUploaderProps {
  onProductsExtracted: (products: Product[]) => void;
}

export default function PDFUploader({ onProductsExtracted }: PDFUploaderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:8000/extract-products', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'PDF işlenirken bir hata oluştu');
      }

      const data = await response.json();
      console.log('PDF İşleme Sonucu:', data);

      if (data.products?.items && Array.isArray(data.products.items)) {
        const extractedProducts: Product[] = data.products.items.map((item: any) => {
          const unitPrice = parseFloat(item.net_fiyat || '0');
          const quantity = parseFloat(item.miktar || '0');
          // Eğer tutar null ise, birim fiyat * miktar olarak hesapla
          const totalPrice = item.tutar ? parseFloat(item.tutar) : unitPrice * quantity;

          return {
            id: Math.random().toString(36).substr(2, 9),
            description: item.aciklama || '',
            brand: item.marka || '',
            unit: item.birim || 'adet',
            quantity: quantity,
            unitPrice: unitPrice,
            totalPrice: totalPrice,
          };
        });

        if (extractedProducts.length > 0) {
          onProductsExtracted(extractedProducts);
          setSuccess(`${extractedProducts.length} ürün başarıyla yüklendi.`);
        } else {
          setError('PDF içinde ürün bulunamadı.');
        }
      } else {
        setError('Geçersiz veri formatı. Ürün listesi bulunamadı.');
      }

    } catch (err: any) {
      console.error('PDF işleme hatası:', err);
      setError(err.message || 'PDF işlenirken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ textAlign: 'center', mt: 4 }}>
      <input
        accept=".pdf"
        style={{ display: 'none' }}
        id="pdf-file-upload"
        type="file"
        onChange={handleFileUpload}
      />
      <label htmlFor="pdf-file-upload">
        <Button
          variant="contained"
          component="span"
          disabled={isLoading}
        >
          PDF Yükle
        </Button>
      </label>

      {isLoading && (
        <Typography variant="body2" sx={{ mt: 2 }}>
          PDF işleniyor...
        </Typography>
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mt: 2 }}>
          {success}
        </Alert>
      )}
    </Box>
  );
}
