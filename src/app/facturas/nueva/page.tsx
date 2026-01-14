'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Alert,
  Snackbar,
} from '@mui/material';
import Layout from '@/components/Layout';
import FacturaForm from '@/components/FacturaForm';
import { facturasApi, FacturaDTO } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function NuevaFacturaPage() {
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const router = useRouter();

  const handleSubmit = async (data: FacturaDTO) => {
    try {
      setLoading(true);
      const response = await facturasApi.crear(data);
      setSnackbar({
        open: true,
        message: `Factura creada exitosamente: ${response.data.numeroDocumento}`,
        severity: 'success',
      });
      
      // Redirigir después de 2 segundos
      setTimeout(() => {
        router.push('/facturas');
      }, 2000);
    } catch (error: any) {
      console.error('Error al crear factura:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.error || 'Error al crear la factura',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Box>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Nueva Factura Electrónica
        </Typography>
        <Typography variant="body1" color="textSecondary" gutterBottom mb={3}>
          Complete los datos para crear una nueva factura electrónica
        </Typography>

        <FacturaForm
          empresaId={1}
          onSubmit={handleSubmit}
          isLoading={loading}
        />

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Layout>
  );
}
