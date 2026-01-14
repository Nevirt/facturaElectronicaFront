'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from '@mui/material';
import {
  Receipt,
  CheckCircle,
  Pending,
  Cancel,
  TrendingUp,
} from '@mui/icons-material';
import Layout from '@/components/Layout';
import StatsCard from '@/components/StatsCard';
import { facturasApi, FacturaResponse } from '@/lib/api';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function DashboardPage() {
  const [facturas, setFacturas] = useState<FacturaResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarFacturas();
  }, []);

  // Manejar errores de red silenciosamente
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      if (event.message?.includes('Network Error')) {
        console.warn('Backend no disponible. Asegúrate de que esté corriendo en http://localhost:5000');
      }
    };
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  const cargarFacturas = async () => {
    try {
      // Por ahora, cargar facturas de empresa 1
      const response = await facturasApi.listar(1);
      setFacturas(response.data);
    } catch (error: any) {
      console.error('Error al cargar facturas:', error);
      // Si el backend no está disponible, simplemente dejar la lista vacía
      setFacturas([]);
    } finally {
      setLoading(false);
    }
  };

  const estadisticas = {
    total: facturas.length,
    pendientes: facturas.filter((f) => f.estado === 'PENDIENTE').length,
    aceptadas: facturas.filter((f) => f.estado === 'ACEPTADO').length,
    rechazadas: facturas.filter((f) => f.estado === 'RECHAZADO').length,
    montoTotal: facturas.reduce((sum, f) => sum + f.total, 0),
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'ACEPTADO':
        return 'success';
      case 'PENDIENTE':
        return 'warning';
      case 'RECHAZADO':
        return 'error';
      case 'ANULADO':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <Layout>
      <Box>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Dashboard
        </Typography>
        <Typography variant="body1" color="textSecondary" gutterBottom>
          Resumen de facturación electrónica
        </Typography>

        <Box
          display="grid"
          gridTemplateColumns={{
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(4, 1fr)',
          }}
          gap={3}
          sx={{ mt: 2 }}
        >
          <StatsCard
            title="Total Facturas"
            value={estadisticas.total}
            icon={<Receipt fontSize="large" />}
            color="#1976d2"
          />
          <StatsCard
            title="Aceptadas"
            value={estadisticas.aceptadas}
            icon={<CheckCircle fontSize="large" />}
            color="#2e7d32"
          />
          <StatsCard
            title="Pendientes"
            value={estadisticas.pendientes}
            icon={<Pending fontSize="large" />}
            color="#ed6c02"
          />
          <StatsCard
            title="Rechazadas"
            value={estadisticas.rechazadas}
            icon={<Cancel fontSize="large" />}
            color="#d32f2f"
          />
        </Box>
        <Box sx={{ mt: 3 }}>
          <StatsCard
            title="Monto Total Facturado"
            value={`₲ ${estadisticas.montoTotal.toLocaleString('es-PY')}`}
            icon={<TrendingUp fontSize="large" />}
            color="#9c27b0"
            subtitle="Total acumulado de facturas"
          />
        </Box>

        <Box mt={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Facturas Recientes
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Número</TableCell>
                      <TableCell>Cliente</TableCell>
                      <TableCell>Fecha</TableCell>
                      <TableCell align="right">Monto</TableCell>
                      <TableCell>Estado</TableCell>
                      <TableCell>CDC</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          Cargando...
                        </TableCell>
                      </TableRow>
                    ) : facturas.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          No hay facturas registradas
                        </TableCell>
                      </TableRow>
                    ) : (
                      facturas.slice(0, 10).map((factura) => (
                        <TableRow key={factura.id}>
                          <TableCell>{factura.numeroDocumento}</TableCell>
                          <TableCell>{factura.clienteRazonSocial}</TableCell>
                          <TableCell>
                            {format(new Date(factura.fechaEmision), 'dd/MM/yyyy', {
                              locale: es,
                            })}
                          </TableCell>
                          <TableCell align="right">
                            ₲ {factura.total.toLocaleString('es-PY')}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={factura.estado}
                              color={getEstadoColor(factura.estado)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            {factura.codigoAutorizacion || '-'}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Layout>
  );
}
