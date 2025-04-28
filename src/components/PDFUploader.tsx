import { useState } from 'react';
import { Box, Button, TextField, Typography, Alert } from '@mui/material';
import { Product } from '@/types';

interface TextUploaderProps {
  onProductsExtracted: (products: Product[]) => void;
}

export default function TextUploader({ onProductsExtracted }: TextUploaderProps) {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleParse = () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Kullanıcının yapıştırdığı metni parse et
      const parsed = JSON.parse(text);

      if (!Array.isArray(parsed)) {
        throw new Error('Geçerli bir ürün listesi değil.');
      }

      const extractedProducts: Product[] = parsed.map((item) => ({
        id: Math.random().toString(36).substr(2, 9),
        description: item.description,
        brand: item.brand || '',
        unit: item.unit,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
      }));

      if (extractedProducts.length > 0) {
        onProductsExtracted(extractedProducts);
        setSuccess(`${extractedProducts.length} ürün başarıyla yüklendi.`);
      } else {
        setError('JSON içinde ürün bulunamadı.');
      }
    } catch (err: any) {
      console.error('JSON parse hatası:', err);
      setError('Geçersiz JSON formatı. Lütfen doğru formatta JSON yapıştırın.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ textAlign: 'center' }}>
      <TextField
        label="Ürün JSON Verisi Yapıştırın"
        multiline
        rows={20}
        fullWidth
        value={text}
        onChange={(e) => setText(e.target.value)}
        variant="outlined"
        sx={{ mt: 2 }}
      />

      <Button
        variant="contained"
        sx={{ mt: 2 }}
        onClick={handleParse}
        disabled={isLoading || !text}
      >
        Ürünleri Çıkar
      </Button>

      {isLoading && (
        <Typography variant="body2" sx={{ mt: 2 }}>
          Ürünler çıkarılıyor...
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
