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

  // Stil tanımlamaları - daha küçük fontlar ve daha kompakt tasarım
  const styles = {
    tableHeader: {
      background: colors.primary,
      color: 'white',
      fontWeight: 600,
      fontSize: 11,
      padding: '4px 6px',
      borderBottom: `1px solid ${colors.border}`,
      fontFamily: 'inherit',
      whiteSpace: 'nowrap'
    },
    tableCell: {
      padding: '3px 6px',
      borderBottom: `1px solid ${colors.border}`,
      fontFamily: 'inherit',
      fontSize: 11,
      whiteSpace: 'nowrap',
      textAlign: 'center' // Hücre içeriğini ortala
    },
    tableCellNumber: {
      padding: '3px 6px',
      fontFamily: 'inherit',
      fontWeight: 500,
      borderBottom: `1px solid ${colors.border}`,
      fontSize: 11,
      whiteSpace: 'nowrap',
      textAlign: 'right'
    },
    sectionTitle: {
      fontWeight: 600,
      fontSize: 12,
      color: colors.primary,
      marginBottom: 0.5
    },
    infoBox: {
      padding: 1,
      borderRadius: 1,
      background: colors.light,
      border: `1px solid ${colors.border}`,
      height: '100%'
    },
    totalBox: {
      padding: 1,
      borderRadius: 1,
      background: colors.primary,
      color: 'white',
      minWidth: 150,
      boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
    },
    clientName: {
      fontSize: 16,
      fontWeight: 700,
      color: colors.primary,
      textAlign: 'center',
      width: '100%',
      marginBottom: 1
    }
  };

  return (
    <Paper id="teklif-pdf" sx={{ 
      width: '100%', 
      mx: 'auto', 
      p: 1.5, 
      borderRadius: 1, 
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      minHeight: '100%',
      display: 'flex',
      flexDirection: 'column',
      // Landscape orientation settings
      pageBreakInside: 'avoid',
      '@media print': {
        width: '297mm', // A4 width (landscape)
        height: '210mm', // A4 height (landscape)
        minHeight: 'auto',
        padding: '8mm',
        margin: 0
      }
    }}>
      {/* Top Header - Company Info & Title */}
      <Grid container spacing={1} sx={{ mb: 1 }}>
        {/* Company Info & Logo - ENLARGED */}
        <Grid item xs={8}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {quote.companyInfo.logo ? (
              <img
                src={quote.companyInfo.logo}
                alt="Company Logo"
                style={{ maxWidth: '100px', height: 'auto', maxHeight: '60px', objectFit: 'contain' }}
              />
            ) : (
              <Typography variant="h5" fontWeight={700} color={colors.primary}>
                COMPANY
              </Typography>
            )}
            <Box>
              <Typography variant="body1" fontWeight={600} fontSize={14} color={colors.primary}>
                {quote.companyInfo.name || '-'}
              </Typography>
              <Typography variant="body2" fontSize={12} color={colors.primary}>
                {quote.companyInfo.address || '-'}
              </Typography>
              <Typography variant="body2" fontSize={12} color={colors.primary}>
                {quote.companyInfo.phone || '-'}
                {showVergiNo && (' • Vergi No: 12345-6781')}
              </Typography>
            </Box>
          </Box>
        </Grid>
        
        {/* Title and Date */}
        <Grid item xs={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center', alignItems: 'flex-end' }}>
            <Typography variant="h6" fontWeight={700} color={colors.primary} textAlign="right">
              
            </Typography>
            <Typography variant="body2" fontSize={12} color={colors.primary} sx={{ mt: 1 }}>
              Tarih: {new Date(quote.companyInfo.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Divider sx={{ mb: 1, borderColor: colors.border }} />
      
      {/* Client Name - Centered above table */}
      <Typography sx={styles.clientName}>
        {quote.companyInfo.clientName || 'Müşteri İsmi'}
      </Typography>

      {/* Product Table - Ultra compact */}
      <Box sx={{ mb: 1, overflow: 'auto' }}>
        <Table size="small" sx={{ tableLayout: 'fixed' }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ ...styles.tableHeader, width: '4%', textAlign: 'center' }}>SIRA</TableCell>
              <TableCell sx={{ ...styles.tableHeader, width: '38%', textAlign: 'center' }}>AÇIKLAMA</TableCell>
              <TableCell sx={{ ...styles.tableHeader, width: '15%', textAlign: 'center' }}>MARKA</TableCell>
              <TableCell sx={{ ...styles.tableHeader, width: '7%', textAlign: 'center' }}>MİKTAR</TableCell>
              <TableCell sx={{ ...styles.tableHeader, width: '7%', textAlign: 'center' }}>BİRİM</TableCell>
              <TableCell sx={{ ...styles.tableHeader, width: '14%', textAlign: 'center' }}>BİRİM FİYAT</TableCell>
              <TableCell sx={{ ...styles.tableHeader, width: '15%', textAlign: 'center' }}>TOPLAM FİYAT</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {quote.products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={styles.tableCell}>
                  Ürün eklenmedi
                </TableCell>
              </TableRow>
            ) : (
              quote.products.map((product, index) => (
                <TableRow key={product.id} sx={{ 
                  '&:nth-of-type(odd)': { backgroundColor: colors.light },
                  '&:last-child td': { borderBottom: 0 },
                  height: '18px' // Force shorter rows
                }}>
                  <TableCell sx={styles.tableCell} align="center">{index + 1}</TableCell>
                  <TableCell sx={{ ...styles.tableCell, textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.description}</TableCell>
                  <TableCell sx={{ ...styles.tableCell, textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.brand || '-'}</TableCell>
                  <TableCell sx={styles.tableCell} align="center">{product.quantity}</TableCell>
                  <TableCell sx={styles.tableCell} align="center">{product.unit.toUpperCase()}</TableCell>
                  <TableCell sx={styles.tableCellNumber}>
                    {formatNumber(product.unitPrice, roundToWhole)}
                  </TableCell>
                  <TableCell sx={styles.tableCellNumber}>
                    {formatNumber(product.totalPrice, roundToWhole)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Box>

      {/* Bottom Info - Super compact horizontal layout */}
      <Grid container spacing={1} sx={{ mt: 'auto' }}>
        <Grid item xs={4}>
          {showOdemeBilgileri && (
            <Box sx={styles.infoBox}>
              <Typography sx={styles.sectionTitle}>ÖDEME BİLGİLERİ</Typography>
              <Typography variant="body2" fontSize={10}>
                <strong>Banka:</strong> {bankaBilgileri.banka} • <strong>IBAN:</strong> {bankaBilgileri.iban}
              </Typography>
              <Typography variant="body2" fontSize={10}>
                <strong>E-mail:</strong> {bankaBilgileri.email}
              </Typography>
            </Box>
          )}
        </Grid>
        
        <Grid item xs={4}>
          {showNotlar && (
            <Box sx={styles.infoBox}>
              <Typography sx={styles.sectionTitle}>NOTLAR</Typography>
              <Typography variant="body2" fontSize={10} sx={{ whiteSpace: 'pre-line' }}>
                {notlar || '-'}
              </Typography>
            </Box>
          )}
        </Grid>
        
        <Grid item xs={4}>
          <Box sx={styles.totalBox}>
            <Grid container spacing={0.5}>
              <Grid item xs={7}>
                <Typography variant="body2" fontSize={10} color="white">Ara Toplam:</Typography>
              </Grid>
              <Grid item xs={5}>
                <Typography variant="body2" fontSize={10} fontWeight={500} color="white" textAlign="right">
                  {formatNumber(quote.subtotal, roundToWhole)}
                </Typography>
              </Grid>
              
              <Grid item xs={7}>
                <Typography variant="body2" fontSize={10} color="white">KDV (%{quote.vatRate}):</Typography>
              </Grid>
              <Grid item xs={5}>
                <Typography variant="body2" fontSize={10} fontWeight={500} color="white" textAlign="right">
                  {formatNumber(quote.vatAmount, roundToWhole)}
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Divider sx={{ my: 0.5, borderColor: 'rgba(255,255,255,0.3)' }} />
              </Grid>
              
              <Grid item xs={7}>
                <Typography variant="body1" fontSize={12} fontWeight={700} color="white">GENEL TOPLAM:</Typography>
              </Grid>
              <Grid item xs={5}>
                <Typography variant="body1" fontSize={12} fontWeight={700} color="white" textAlign="right">
                  {formatNumber(quote.subtotal + quote.vatAmount, roundToWhole)}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}