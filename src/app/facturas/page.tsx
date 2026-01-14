'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Add,
  Send,
  Visibility,
  Cancel as CancelIcon,
  Refresh,
} from '@mui/icons-material';
import Layout from '@/components/Layout';
import { facturasApi, FacturaResponse } from '@/lib/api';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useRouter } from 'next/navigation';

export default function FacturasPage() {
  const [facturas, setFacturas] = useState<FacturaResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [openAnular, setOpenAnular] = useState(false);
  const [facturaSeleccionada, setFacturaSeleccionada] = useState<number | null>(null);
  const [motivoAnulacion, setMotivoAnulacion] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const router = useRouter();

  useEffect(() => {
    cargarFacturas();
  }, []);

  const cargarFacturas = async () => {
    try {
      setLoading(true);
      const response = await facturasApi.listar(1);
      setFacturas(response.data);
    } catch (error) {
      console.error('Error al cargar facturas:', error);
      mostrarMensaje('Error al cargar facturas', 'error');
    } finally {
      setLoading(false);
    }
  };

  const enviarFactura = async (id: number) => {
    try {
      await facturasApi.enviar(id);
      mostrarMensaje('Factura enviada exitosamente', 'success');
      cargarFacturas();
    } catch (error: any) {
      mostrarMensaje(error.response?.data?.error || 'Error al enviar factura', 'error');
    }
  };

  const consultarEstado = async (id: number) => {
    try {
      const response = await facturasApi.consultarEstado(id);
      mostrarMensaje(`Estado: ${response.data.estado}`, 'success');
      cargarFacturas();
    } catch (error: any) {
      mostrarMensaje(error.response?.data?.error || 'Error al consultar estado', 'error');
    }
  };

  const anularFactura = async () => {
    if (!facturaSeleccionada || !motivoAnulacion) return;

    try {
      await facturasApi.anular(facturaSeleccionada, motivoAnulacion);
      mostrarMensaje('Factura anulada exitosamente', 'success');
      setOpenAnular(false);
      setMotivoAnulacion('');
      cargarFacturas();
    } catch (error: any) {
      mostrarMensaje(error.response?.data?.error || 'Error al anular factura', 'error');
    }
  };

  const mostrarMensaje = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
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
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box>
            <Typography variant="h4" fontWeight="bold">
              Facturas Electrónicas
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Gestión de documentos electrónicos
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => router.push('/facturas/nueva')}
            size="large"
          >
            Nueva Factura
          </Button>
        </Box>

        <Card>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Lista de Facturas</Typography>
              <IconButton onClick={cargarFacturas} color="primary">
                <Refresh />
              </IconButton>
            </Box>
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Número</TableCell>
                    <TableCell>Cliente</TableCell>
                    <TableCell>Fecha</TableCell>
                    <TableCell align="right">Monto</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell>CDC</TableCell>
                    <TableCell align="center">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        Cargando...
                      </TableCell>
                    </TableRow>
                  ) : facturas.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        No hay facturas registradas
                      </TableCell>
                    </TableRow>
                  ) : (
                    facturas.map((factura) => (
                      <TableRow key={factura.id}>
                        <TableCell>{factura.id}</TableCell>
                        <TableCell>{factura.numeroDocumento}</TableCell>
                        <TableCell>{factura.clienteRazonSocial}</TableCell>
                        <TableCell>
                          {format(new Date(factura.fechaEmision), 'dd/MM/yyyy HH:mm', {
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
                        <TableCell align="center">
                          <Box display="flex" gap={1} justifyContent="center">
                            <IconButton
                              size="small"
                              color="primary"
                              title="Ver detalles"
                              onClick={() => router.push(`/facturas/${factura.id}`)}
                            >
                              <Visibility />
                            </IconButton>
                            {factura.estado === 'PENDIENTE' && (
                              <IconButton
                                size="small"
                                color="success"
                                title="Enviar a SET"
                                onClick={() => enviarFactura(factura.id)}
                              >
                                <Send />
                              </IconButton>
                            )}
                            {factura.estado === 'ENVIADO' && (
                              <IconButton
                                size="small"
                                color="info"
                                title="Consultar estado"
                                onClick={() => consultarEstado(factura.id)}
                              >
                                <Refresh />
                              </IconButton>
                            )}
                            {factura.estado === 'ACEPTADO' && (
                              <IconButton
                                size="small"
                                color="error"
                                title="Anular"
                                onClick={() => {
                                  setFacturaSeleccionada(factura.id);
                                  setOpenAnular(true);
                                }}
                              >
                                <CancelIcon />
                              </IconButton>
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Dialog de Anulación */}
        <Dialog open={openAnular} onClose={() => setOpenAnular(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Anular Factura</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Motivo de Anulación"
              fullWidth
              multiline
              rows={4}
              value={motivoAnulacion}
              onChange={(e) => setMotivoAnulacion(e.target.value)}
              placeholder="Ingrese el motivo de la anulación..."
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenAnular(false)}>Cancelar</Button>
            <Button
              onClick={anularFactura}
              variant="contained"
              color="error"
              disabled={!motivoAnulacion}
            >
              Anular Factura
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar para mensajes */}
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
