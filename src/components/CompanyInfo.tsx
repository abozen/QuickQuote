import React, { useRef } from 'react';
import { Box, Typography, Grid, TextField, Button } from '@mui/material';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';

interface CompanyInfoProps {
  name: string;
  phone: string;
  address: string;
  logo?: string;
  onNameChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onAddressChange: (value: string) => void;
  onLogoChange: (value: string) => void;
}

export default function CompanyInfo({ 
  name, 
  phone, 
  address, 
  logo,
  onNameChange,
  onPhoneChange,
  onAddressChange,
  onLogoChange
}: CompanyInfoProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onLogoChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box sx={{ mb: 3, p: 2, background: '#f8fafd', borderRadius: 2 }}>
      <Typography variant="h4" fontWeight={700} letterSpacing={2} color="primary" sx={{ mb: 2 }}>LOGO</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography fontWeight={700} color="primary" mb={2}>Şirket Bilgileri</Typography>
          <TextField
            fullWidth
            label="Şirket Adı"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Telefon"
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Adres"
            value={address}
            onChange={(e) => onAddressChange(e.target.value)}
            multiline
            rows={2}
            sx={{ mb: 2 }}
          />
          <Box sx={{ mb: 2 }}>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              style={{ display: 'none' }}
              ref={fileInputRef}
            />
            <Button
              variant="outlined"
              startIcon={<CloudUploadIcon />}
              onClick={() => fileInputRef.current?.click()}
              sx={{ mr: 2 }}
            >
              Logo Yükle
            </Button>
            {logo && (
              <Button
                variant="outlined"
                color="error"
                onClick={() => onLogoChange('')}
              >
                Logoyu Kaldır
              </Button>
            )}
          </Box>
          {logo && (
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <img
                src={logo}
                alt="Company Logo"
                style={{ maxWidth: '200px', maxHeight: '100px', objectFit: 'contain' }}
              />
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
} 