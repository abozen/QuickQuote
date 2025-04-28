import React from 'react';
import { Box, Typography, Grid, TextField } from '@mui/material';

interface ClientInfoProps {
  clientName: string;
  onClientNameChange: (value: string) => void;
}

export default function ClientInfo({ clientName, onClientNameChange }: ClientInfoProps) {
  return (
    <Box sx={{ mb: 3, p: 2, background: '#f8fafd', borderRadius: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography fontWeight={700} color="primary" mb={2}>Müşteri Bilgileri</Typography>
          <TextField
            fullWidth
            label="Müşteri Adı"
            value={clientName}
            onChange={(e) => onClientNameChange(e.target.value)}
          />
        </Grid>
      </Grid>
    </Box>
  );
} 