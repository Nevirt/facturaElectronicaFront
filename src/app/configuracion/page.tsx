'use client';

import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Alert,
  Stack,
} from '@mui/material';
import { Settings, Business, VpnKey, CloudUpload } from '@mui/icons-material';
import Layout from '@/components/Layout';

export default function ConfiguracionPage() {
  return (
    <Layout>
      <Box>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Configuración
        </Typography>
        <Typography variant="body1" color="textSecondary" gutterBottom mb={3}>
          Configuración del sistema de facturación electrónica
        </Typography>

        <Alert severity="info" sx={{ mb: 3 }}>
          La configuración de SET (certificados, credenciales, URLs) se gestiona desde el backend
          por razones de seguridad. Esta sección estará disponible próximamente.
        </Alert>

        <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }} gap={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Business sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Datos de Empresa</Typography>
              </Box>
              <Typography variant="body2" color="textSecondary">
                Configure los datos de su empresa emisora, incluyendo RUC, razón social,
                dirección y datos de contacto. Esta información se incluye en todos los
                documentos electrónicos.
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <VpnKey sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Credenciales SET</Typography>
              </Box>
              <Typography variant="body2" color="textSecondary">
                Configure las credenciales para acceder a la plataforma e-Kuatia de la SET.
                Incluye usuario, contraseña y selección de ambiente (homologación o producción).
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <CloudUpload sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Certificado Digital</Typography>
              </Box>
              <Typography variant="body2" color="textSecondary">
                Suba y gestione el certificado digital para la firma de documentos electrónicos.
                El certificado debe ser emitido por una autoridad certificadora reconocida por la SET.
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Settings sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Configuración General</Typography>
              </Box>
              <Typography variant="body2" color="textSecondary">
                Configure opciones generales del sistema como formato de números de documento,
                serie por defecto, tiempo de timeout para conexiones con SET, entre otros.
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Información del Sistema
            </Typography>
            <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }} gap={2}>
              <Typography variant="body2" color="textSecondary">
                <strong>Versión del Sistema:</strong> 1.0.0
              </Typography>
              <Typography variant="body2" color="textSecondary">
                <strong>API Backend:</strong> {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                <strong>Versión SET:</strong> e-Kuatia v150
              </Typography>
              <Typography variant="body2" color="textSecondary">
                <strong>Ambiente:</strong> Desarrollo
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Layout>
  );
}
