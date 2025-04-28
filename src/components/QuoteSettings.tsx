import { Box, TextField, Grid } from '@mui/material';
import { QuoteSettings as QuoteSettingsType } from '@/types';

interface QuoteSettingsProps {
  settings: QuoteSettingsType;
  onChange: (settings: QuoteSettingsType) => void;
}

export default function QuoteSettings({ settings, onChange }: QuoteSettingsProps) {
  const handleChange = (field: keyof QuoteSettingsType) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseFloat(event.target.value) || 0;
    onChange({
      ...settings,
      [field]: value,
    });
  };

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="KDV Oranı (%)"
            type="number"
            value={settings.vatRate}
            onChange={handleChange('vatRate')}
            margin="normal"
            InputProps={{
              inputProps: { min: 0, max: 100, step: 1 }
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Fiyat Artış Oranı (%)"
            type="number"
            value={settings.priceIncreaseRate}
            onChange={handleChange('priceIncreaseRate')}
            margin="normal"
            InputProps={{
              inputProps: { min: 0, step: 0.1 }
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
} 