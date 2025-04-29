import React, { useState } from 'react';
import { Box, Typography, FormControlLabel, Checkbox, TextField, Button, Alert, Grid } from '@mui/material';
import { Product } from '@/types';
import PDFUploader from './PDFUploader';

interface TableSettingsProps {
  roundToWhole: boolean;
  showVergiNo: boolean;
  showOdemeBilgileri: boolean;
  showNotlar: boolean;
  vatIncluded: boolean;
  vatRate: number;
  priceIncreaseRate: number;
  date: string;
  showCurrency: boolean;
  onRoundToWholeChange: (checked: boolean) => void;
  onShowVergiNoChange: (checked: boolean) => void;
  onShowOdemeBilgileriChange: (checked: boolean) => void;
  onShowNotlarChange: (checked: boolean) => void;
  onVatIncludedChange: (checked: boolean) => void;
  onVatRateChange: (value: number) => void;
  onPriceIncreaseRateChange: (value: number) => void;
  onDateChange: (value: string) => void;
  onShowCurrencyChange: (checked: boolean) => void;
  jsonData: string;
  onJsonDataChange: (value: string) => void;
  onProductsExtracted: (products: Product[]) => void;
}

export default function TableSettings({
  roundToWhole,
  showVergiNo,
  showOdemeBilgileri,
  showNotlar,
  vatIncluded,
  vatRate,
  priceIncreaseRate,
  date,
  showCurrency,
  onRoundToWholeChange,
  onShowVergiNoChange,
  onShowOdemeBilgileriChange,
  onShowNotlarChange,
  onVatIncludedChange,
  onVatRateChange,
  onPriceIncreaseRateChange,
  onDateChange,
  onShowCurrencyChange,
  jsonData,
  onJsonDataChange,
  onProductsExtracted
}: TableSettingsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleParse = () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const parsed = JSON.parse(jsonData);

      if (!Array.isArray(parsed)) {
        throw new Error('Geçerli bir ürün listesi değil.');
      }

      const extractedProducts: Product[] = parsed.map((item) => {
        const increasedUnitPrice = item.unitPrice * (1 + priceIncreaseRate / 100);
        const totalPrice = increasedUnitPrice * item.quantity;

        return {
          id: Math.random().toString(36).substr(2, 9),
          description: item.description,
          brand: item.brand || '',
          unit: item.unit,
          quantity: item.quantity,
          unitPrice: increasedUnitPrice,
          totalPrice: totalPrice,
        };
      });

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
    <Box sx={{ mb: 3, p: 2, background: '#f8fafd', borderRadius: 2 }}>
      <Typography fontWeight={700} mb={2}>Tablo Ayarları</Typography>
      
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={6}>
          <Typography fontWeight={700} mb={1}>Görünüm Ayarları</Typography>
          <TextField
            fullWidth
            label="Teklif Tarihi"
            type="date"
            value={date}
            onChange={(e) => onDateChange(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={roundToWhole}
                onChange={(e) => onRoundToWholeChange(e.target.checked)}
                color="primary"
              />
            }
            label="Fiyatları tam sayıya yuvarla"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={showVergiNo}
                onChange={(e) => onShowVergiNoChange(e.target.checked)}
                color="primary"
              />
            }
            label="Vergi numarasını dahil et"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={showOdemeBilgileri}
                onChange={(e) => onShowOdemeBilgileriChange(e.target.checked)}
                color="primary"
              />
            }
            label="Ödeme bilgilerini dahil et"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={showNotlar}
                onChange={(e) => onShowNotlarChange(e.target.checked)}
                color="primary"
              />
            }
            label="Notları dahil et"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={showCurrency}
                onChange={(e) => onShowCurrencyChange(e.target.checked)}
                color="primary"
              />
            }
            label="Para birimini göster"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography fontWeight={700} mb={1}>Fiyat ve KDV Ayarları</Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={vatIncluded}
                onChange={(e) => onVatIncludedChange(e.target.checked)}
                color="primary"
              />
            }
            label="KDV dahil et"
          />
          <TextField
            fullWidth
            label="KDV Oranı (%)"
            type="number"
            value={vatRate}
            onChange={(e) => onVatRateChange(Number(e.target.value))}
            InputProps={{ inputProps: { min: 0, max: 100 } }}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Zam Oranı (%)"
            type="number"
            value={priceIncreaseRate}
            onChange={(e) => onPriceIncreaseRateChange(Number(e.target.value))}
            InputProps={{ inputProps: { min: 0 } }}
          />
        </Grid>
      </Grid>

      <Typography fontWeight={700} mb={1}>Ürün Verisi</Typography>
      <Grid container spacing={30}>
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <PDFUploader onProductsExtracted={onProductsExtracted} />
            {isLoading && (
              <Typography variant="body2" color="primary">
                PDF işleniyor...
              </Typography>
            )}
            {error && (
              <Alert severity="error">
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success">
                {success}
              </Alert>
            )}
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={jsonData}
            onChange={(e) => onJsonDataChange(e.target.value)}
            placeholder="JSON verisini buraya yapıştırın..."
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            onClick={handleParse}
            disabled={isLoading || !jsonData}
            sx={{ mb: 2 }}
          >
            Ürünleri Çıkar
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
} 