'use client';

import React, { useState } from 'react';
import { Box, Tabs, Tab, Button } from '@mui/material';
import CompanyInfo from '@/components/CompanyInfo';
import ClientInfo from '@/components/ClientInfo';
import TableSettings from '@/components/TableSettings';
import ProductTable from '@/components/ProductTable';
import QuotePreview from '@/components/QuotePreview';
import PDFUploader from '@/components/PDFUploader';
import { Quote, Product } from '@/types';
import html2pdf from 'html2pdf.js';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function Home() {
  const [tabValue, setTabValue] = useState(0);
  const [roundToWhole, setRoundToWhole] = useState(false);
  const [showVergiNo, setShowVergiNo] = useState(true);
  const [showOdemeBilgileri, setShowOdemeBilgileri] = useState(true);
  const [showNotlar, setShowNotlar] = useState(true);
  const [vatIncluded, setVatIncluded] = useState(true);
  const [vatRate, setVatRate] = useState(20);
  const [priceIncreaseRate, setPriceIncreaseRate] = useState(0);
  const [jsonData, setJsonData] = useState('');
  const [quote, setQuote] = useState<Quote>({
    companyInfo: {
      name: '',
      phone: '',
      address: '',
      date: new Date().toLocaleDateString('tr-TR'),
      clientName: '',
      logo: ''
    },
    products: [],
    subtotal: 0,
    vatAmount: 0,
    vatRate: 20
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleExportPDF = () => {
    const element = document.getElementById('teklif-pdf');
    if (element) {
      const opt = {
        margin: [5, 5, 5, 5], // Minimal margins (top, right, bottom, left) in mm
        filename: 'teklif.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2, // Higher scale for better quality
          useCORS: true,
          logging: false,
          letterRendering: true,
          allowTaint: true
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'landscape',
          compress: true,
          precision: 16,
          hotfixes: ["px_scaling"]
        },
        pagebreak: { mode: ['avoid-all'] } // Try to avoid breaking elements
      };
  
      // Create promise to handle PDF generation
      html2pdf().set(opt).from(element).save().catch(err => {
        console.error('PDF generation error:', err);
        alert('PDF oluşturulurken bir hata oluştu. Lütfen tekrar deneyiniz.');
      });
    }
  };

  const handleCompanyInfoChange = (field: keyof typeof quote.companyInfo, value: string) => {
    setQuote(prev => ({
      ...prev,
      companyInfo: {
        ...prev.companyInfo,
        [field]: value
      }
    }));
  };

  const handleProductsExtracted = (products: Product[]) => {
    const subtotal = products.reduce((sum, product) => sum + product.totalPrice, 0);
    const vatAmount = vatIncluded ? subtotal * (vatRate / 100) : 0;

    setQuote(prev => ({
      ...prev,
      products,
      subtotal,
      vatAmount,
      vatRate
    }));
  };

  const handleVatRateChange = (newRate: number) => {
    setVatRate(newRate);
    const subtotal = quote.products.reduce((sum, product) => sum + product.totalPrice, 0);
    const vatAmount = vatIncluded ? subtotal * (newRate / 100) : 0;

    setQuote(prev => ({
      ...prev,
      vatRate: newRate,
      vatAmount
    }));
  };

  const handleVatIncludedChange = (included: boolean) => {
    setVatIncluded(included);
    const subtotal = quote.products.reduce((sum, product) => sum + product.totalPrice, 0);
    const vatAmount = included ? subtotal * (vatRate / 100) : 0;

    setQuote(prev => ({
      ...prev,
      vatAmount
    }));
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto', p: 3 }}>
      <CompanyInfo
        name={quote.companyInfo.name}
        phone={quote.companyInfo.phone}
        address={quote.companyInfo.address}
        logo={quote.companyInfo.logo}
        onNameChange={(value) => handleCompanyInfoChange('name', value)}
        onPhoneChange={(value) => handleCompanyInfoChange('phone', value)}
        onAddressChange={(value) => handleCompanyInfoChange('address', value)}
        onLogoChange={(value) => handleCompanyInfoChange('logo', value)}
        onSettingsChange={(settings) => {
          setRoundToWhole(settings.roundToWhole);
          setShowVergiNo(settings.showVergiNo);
          setShowOdemeBilgileri(settings.showOdemeBilgileri);
          setShowNotlar(settings.showNotlar);
          setVatIncluded(settings.vatIncluded);
          // Set today's date
          handleCompanyInfoChange('date', new Date().toLocaleDateString('tr-TR'));
        }}
      />

      <ClientInfo 
        clientName={quote.companyInfo.clientName}
        onClientNameChange={(value) => handleCompanyInfoChange('clientName', value)}
      />

      <TableSettings
        roundToWhole={roundToWhole}
        showVergiNo={showVergiNo}
        showOdemeBilgileri={showOdemeBilgileri}
        showNotlar={showNotlar}
        vatIncluded={vatIncluded}
        vatRate={vatRate}
        priceIncreaseRate={priceIncreaseRate}
        date={quote.companyInfo.date}
        onRoundToWholeChange={setRoundToWhole}
        onShowVergiNoChange={setShowVergiNo}
        onShowOdemeBilgileriChange={setShowOdemeBilgileri}
        onShowNotlarChange={setShowNotlar}
        onVatIncludedChange={handleVatIncludedChange}
        onVatRateChange={handleVatRateChange}
        onPriceIncreaseRateChange={setPriceIncreaseRate}
        onDateChange={(value) => handleCompanyInfoChange('date', value)}
        jsonData={jsonData}
        onJsonDataChange={setJsonData}
        onProductsExtracted={handleProductsExtracted}
      />

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Ürün Yönetimi" />
          <Tab label="Önizleme" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <ProductTable
          products={quote.products}
          onChange={(products) => setQuote({ ...quote, products })}
          subtotal={quote.subtotal}
          vatAmount={quote.vatAmount}
          vatIncluded={vatIncluded}
          vatRate={vatRate}
        />
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Box sx={{ mb: 2, textAlign: 'right' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleExportPDF}
          >
            PDF Olarak İndir
          </Button>
        </Box>
        <QuotePreview
          quote={quote}
          bankaBilgileri={{
            banka: 'Örnek Bank',
            iban: 'TR00 0000 0000 0000 0000 0000 00',
            email: 'ornek@email.com'
          }}
          notlar="Örnek notlar buraya gelecek..."
          roundToWhole={roundToWhole}
          showVergiNo={showVergiNo}
          showOdemeBilgileri={showOdemeBilgileri}
          showNotlar={showNotlar}
        />
      </TabPanel>
    </Box>
  );
}
