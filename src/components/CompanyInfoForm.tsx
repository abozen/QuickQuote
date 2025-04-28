import { Box, TextField, Grid } from '@mui/material';
import { CompanyInfo } from '@/types';

interface CompanyInfoFormProps {
  companyInfo: CompanyInfo;
  onChange: (info: CompanyInfo) => void;
}

export default function CompanyInfoForm({ companyInfo, onChange }: CompanyInfoFormProps) {
  const handleChange = (field: keyof CompanyInfo) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    onChange({
      ...companyInfo,
      [field]: event.target.value,
    });
  };

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Firma Adı"
            value={companyInfo.name}
            onChange={handleChange('name')}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Adres"
            value={companyInfo.address}
            onChange={handleChange('address')}
            margin="normal"
            multiline
            rows={2}
          />
          <TextField
            fullWidth
            label="Telefon"
            value={companyInfo.phone}
            onChange={handleChange('phone')}
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Teklif Tarihi"
            type="date"
            value={companyInfo.date}
            onChange={handleChange('date')}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            label="Müşteri Adı"
            value={companyInfo.clientName}
            onChange={handleChange('clientName')}
            margin="normal"
          />
        </Grid>
      </Grid>
    </Box>
  );
} 