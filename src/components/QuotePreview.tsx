import React from 'react';
import { Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, Grid, FormControlLabel, Checkbox } from '@mui/material';
import { Quote } from '@/types';

interface QuotePreviewProps {
  quote: Quote;
  bankaBilgileri: { banka: string; iban: string; email: string };
  notlar: string;
  roundToWhole?: boolean;
  showVergiNo?: boolean;
  showOdemeBilgileri?: boolean;
  showNotlar?: boolean;
}

const tableHeaderStyle = {
  background: 'linear-gradient(90deg, #1565c0 60%, #1976d2 100%)',
  color: 'white',
  fontWeight: 700,
  fontSize: 16,
};

// Format number to financial style (e.g., 10.000,50)
const formatNumber = (num: number, roundToWhole: boolean = false): string => {
  const value = roundToWhole ? Math.round(num) : num;
  return value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&.').replace('.', ',');
};

export default function QuotePreview({ 
  quote, 
  bankaBilgileri, 
  notlar, 
  roundToWhole = false,
  showVergiNo = true,
  showOdemeBilgileri = true,
  showNotlar = true
}: QuotePreviewProps) {
  return (
    <Box id="teklif-pdf" sx={{ 
      p: { xs: 1, md: 4 }, 
      background: '#fff', 
      borderRadius: 3, 
      maxWidth: 900, 
      mx: 'auto', 
      boxShadow: 3,
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Üst Logo ve Vergi No */}
      <Grid container alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Grid item>
          {quote.companyInfo.logo ? (
            <img
              src={quote.companyInfo.logo}
              alt="Company Logo"
              style={{ maxWidth: '200px', maxHeight: '100px', objectFit: 'contain' }}
            />
          ) : (
            <Typography variant="h4" fontWeight={700} letterSpacing={2} color="primary">LOGO</Typography>
          )}
        </Grid>
        {showVergiNo && (
          <Grid item>
            <Typography variant="h6" fontWeight={600} sx={{ textAlign: 'right' }}>
              Vergi Numarası: <span style={{ fontWeight: 900 }}>12345-6781</span>
            </Typography>
          </Grid>
        )}
      </Grid>

      {/* Bilgi Alanları */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={6}>
          <Typography fontWeight={700} color="primary">Şirket İsmi</Typography>
          <Typography>{quote.companyInfo.name || '-'}</Typography>
          <Typography>{quote.companyInfo.phone || '-'}</Typography>
          <Typography>{quote.companyInfo.address || '-'}</Typography>
          <Typography>Tarih: {quote.companyInfo.date}</Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography fontWeight={700} color="primary">Bilgi:</Typography>
          <Typography>{quote.companyInfo.clientName || '-'}</Typography>
        </Grid>
      </Grid>

      {/* Ürün Tablosu */}
      <Table sx={{ mb: 2 }}>
        <TableHead>
          <TableRow>
            <TableCell sx={tableHeaderStyle}>Sıra</TableCell>
            <TableCell sx={tableHeaderStyle}>Açıklama</TableCell>
            <TableCell sx={tableHeaderStyle}>Miktar</TableCell>
            <TableCell sx={tableHeaderStyle}>Birim</TableCell>
            <TableCell sx={tableHeaderStyle}>Birim Fiyat</TableCell>
            <TableCell sx={tableHeaderStyle}>Toplam Fiyat</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {quote.products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center">Ürün eklenmedi</TableCell>
            </TableRow>
          ) : (
            quote.products.map((product, index) => (
              <TableRow key={product.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{product.description}</TableCell>
                <TableCell>{product.quantity}</TableCell>
                <TableCell>{product.unit}</TableCell>
                <TableCell>{formatNumber(product.unitPrice, roundToWhole)}</TableCell>
                <TableCell>{formatNumber(product.totalPrice, roundToWhole)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* KDV ve Toplam */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Box sx={{ background: 'linear-gradient(90deg, #1565c0 60%, #1976d2 100%)', color: 'white', borderRadius: 2, p: 2, minWidth: 220, textAlign: 'right', boxShadow: 2 }}>
          <Typography fontWeight={700} sx={{ fontFamily: 'monospace' }}>Ara Toplam: {formatNumber(quote.subtotal, roundToWhole)}</Typography>
          <Typography fontWeight={700} sx={{ fontFamily: 'monospace' }}>KDV (%{quote.vatRate}): {formatNumber(quote.vatAmount, roundToWhole)}</Typography>
          <Typography fontWeight={700} fontSize={20} sx={{ fontFamily: 'monospace' }}>
            Genel Toplam: {formatNumber(quote.subtotal + quote.vatAmount, roundToWhole)}
          </Typography>
        </Box>
      </Box>

      {/* Alt Bilgi Alanları */}
      <Grid container spacing={2} sx={{ mt: 'auto' }}>
        {showOdemeBilgileri && (
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 2, borderRadius: 2, background: '#f8fafd', mb: 2 }}>
              <Typography fontWeight={700} mb={1}>Ödeme Bilgileri:</Typography>
              <Typography><b>Banka:</b> {bankaBilgileri.banka}</Typography>
              <Typography><b>IBAN:</b> {bankaBilgileri.iban}</Typography>
              <Typography><b>E-mail:</b> {bankaBilgileri.email}</Typography>
            </Box>
          </Grid>
        )}
        {showNotlar && (
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 2, borderRadius: 2, background: '#f8fafd', mb: 2 }}>
              <Typography fontWeight={700} mb={1}>Notlar:</Typography>
              <Typography sx={{ whiteSpace: 'pre-line' }}>{notlar || '-'}</Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
} 