import React from 'react';
import { Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, Grid, Paper, Divider } from '@mui/material';
import { Quote } from '@/types';

interface QuotePreviewProps {
  quote: Quote;
  bankaBilgileri: { banka: string; iban: string; email: string };
  notlar: string;
  roundToWhole?: boolean;
  showVergiNo?: boolean;
  showOdemeBilgileri?: boolean;
  showNotlar?: boolean;
  showCurrency?: boolean;
}

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
  showNotlar = true,
  showCurrency = true
}: QuotePreviewProps) {
  // Modern renk paleti
  const colors = {
    primary: '#2E5077',
    secondary: '#4D7C8A',
    accent: '#F1F7ED',
    light: '#F8F9FA',
    dark: '#1A1A1A',
    border: '#E0E0E0',
    success: '#2E7D32'
  };

  // Stil tanımlamaları
  const styles = {
    tableHeader: {
      background: colors.primary,
      color: 'white',
      fontWeight: 700,
      fontSize: 15,
      padding: '12px 16px',
      borderBottom: `1px solid ${colors.border}`,
      fontFamily: 'inherit'
    },
    tableCell: {
      padding: '12px 16px',
      borderBottom: `1px solid ${colors.border}`,
      fontFamily: 'inherit'
    },
    tableCellNumber: {
      padding: '12px 16px',
      fontFamily: 'inherit',
      fontWeight: 500,
      borderBottom: `1px solid ${colors.border}`
    },
    sectionTitle: {
      fontWeight: 600,
      fontSize: 16,
      color: colors.primary,
      marginBottom: 1
    },
    infoBox: {
      padding: 2.5,
      borderRadius: 2,
      background: colors.light,
      border: `1px solid ${colors.border}`,
      height: '100%'
    },
    totalBox: {
      padding: 2.5,
      borderRadius: 2,
      background: colors.primary,
      color: 'white',
      minWidth: 260,
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
    },
    clientName: {
      fontSize: 28,
      fontWeight: 700,
      color: colors.primary,
      borderBottom: `2px solid ${colors.secondary}`,
      paddingBottom: 1,
      marginBottom: 3,
      width: '100%'
    }
  };

  return (
    <Paper sx={{ 
      maxWidth: 1000, 
      mx: 'auto', 
      p: { xs: 2, md: 4 }, 
      borderRadius: 2, 
      boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header - Logo ve Şirket Bilgileri */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" fontWeight={700} color={colors.primary}>
            FİYAT TEKLİFİ
          </Typography>
          <Typography variant="body1" color={colors.primary} sx={{ fontWeight: 600 }}>
            Tarih: {new Date(quote.companyInfo.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </Typography>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
              {quote.companyInfo.logo ? (
                <img
                  src={quote.companyInfo.logo}
                  alt="Company Logo"
                  style={{ width: '100%', height: 'auto', maxHeight: '240px', objectFit: 'contain' }}
                />
              ) : (
                <Typography variant="h4" fontWeight={700} letterSpacing={1} color={colors.primary}>
                  COMPANY
                </Typography>
              )}
              <Box>
                <Typography variant="h6" fontWeight={600} color={colors.primary}>
                  {quote.companyInfo.name || '-'}
                </Typography>
                <Typography variant="body1" color={colors.primary}>
                  {quote.companyInfo.address || '-'}
                </Typography>
                <Typography variant="body1" color={colors.primary}>
                  {quote.companyInfo.phone || '-'}
                </Typography>
                {showVergiNo && (
                  <Typography variant="body1" color={colors.primary}>
                    Vergi No: <strong>12345-6781</strong>
                  </Typography>
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Divider sx={{ mb: 4, borderColor: colors.border }} />

      {/* Müşteri İsmi - Büyük Font */}
      <Typography sx={styles.clientName}>
        {quote.companyInfo.clientName || 'Müşteri İsmi'}
      </Typography>

      {/* Ürün Tablosu */}
      <Box sx={{ mb: 4, overflow: 'auto' }}>
        <Typography sx={{ ...styles.sectionTitle, mb: 2 }}></Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={styles.tableHeader} width="50px">Sıra</TableCell>
              <TableCell sx={styles.tableHeader}>Açıklama</TableCell>
              <TableCell sx={styles.tableHeader} width="80px">Miktar</TableCell>
              <TableCell sx={styles.tableHeader} width="80px">Birim</TableCell>
              <TableCell sx={styles.tableHeader} width="120px">Birim Fiyat</TableCell>
              <TableCell sx={styles.tableHeader} width="140px">Toplam Fiyat</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {quote.products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={styles.tableCell}>
                  Ürün eklenmedi
                </TableCell>
              </TableRow>
            ) : (
              quote.products.map((product, index) => (
                <TableRow key={product.id} sx={{ 
                  '&:nth-of-type(odd)': { backgroundColor: colors.light },
                  '&:last-child td': { borderBottom: 0 }
                }}>
                  <TableCell sx={styles.tableCell} align="center">{index + 1}</TableCell>
                  <TableCell sx={styles.tableCell}>{product.description}</TableCell>
                  <TableCell sx={styles.tableCell} align="center">{product.quantity}</TableCell>
                  <TableCell sx={styles.tableCell}>{product.unit.toUpperCase()}</TableCell>
                  <TableCell sx={styles.tableCellNumber} align="right">
                    {formatNumber(product.unitPrice, roundToWhole)}
                  </TableCell>
                  <TableCell sx={styles.tableCellNumber} align="right">
                    {formatNumber(product.totalPrice, roundToWhole)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Box>

      {/* KDV ve Toplam Hesaplamalar */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
        <Box sx={styles.totalBox}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body1" color="white">Ara Toplam:</Typography>
              <Typography variant="body1" color="white" sx={{ fontFamily: 'inherit', fontWeight: 500 }}>
                {formatNumber(quote.subtotal, roundToWhole)}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body1" color="white">KDV (%{quote.vatRate}):</Typography>
              <Typography variant="body1" color="white" sx={{ fontFamily: 'inherit', fontWeight: 500 }}>
                {formatNumber(quote.vatAmount, roundToWhole)}
              </Typography>
            </Box>
            
            <Divider sx={{ my: 1, borderColor: 'rgba(255,255,255,0.3)' }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 4 }}>
              <Typography variant="h6" color="white" fontWeight={700}>GENEL TOPLAM:</Typography>
              <Typography variant="h6" color="white" sx={{ fontFamily: 'inherit', fontWeight: 700 }}>
                {formatNumber(quote.subtotal + quote.vatAmount, roundToWhole)}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Alt Bilgi Alanları - Ödeme ve Notlar */}
      <Grid container spacing={3} sx={{ mt: 'auto' }}>
        {showOdemeBilgileri && (
          <Grid item xs={12} md={6}>
            <Box sx={styles.infoBox}>
              <Typography sx={styles.sectionTitle}>ÖDEME BİLGİLERİ</Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                <strong>Banka:</strong> {bankaBilgileri.banka}
              </Typography>
              <Typography variant="body2">
                <strong>IBAN:</strong> {bankaBilgileri.iban}
              </Typography>
              <Typography variant="body2">
                <strong>E-mail:</strong> {bankaBilgileri.email}
              </Typography>
            </Box>
          </Grid>
        )}
        
        {showNotlar && (
          <Grid item xs={12} md={6}>
            <Box sx={styles.infoBox}>
              <Typography sx={styles.sectionTitle}>NOTLAR</Typography>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-line', mt: 1 }}>
                {notlar || '-'}
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>
      
      {/* Footer */}
      <Box sx={{ mt: 4, textAlign: 'center', color: colors.secondary }}>
        <Typography variant="body2">
          
        </Typography>
      </Box>
    </Paper>
  );
}