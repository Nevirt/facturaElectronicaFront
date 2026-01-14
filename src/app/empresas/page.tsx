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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Alert,
  Snackbar,
  Stack,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Business as BusinessIcon,
} from '@mui/icons-material';
import Layout from '@/components/Layout';
import { empresasApi, Empresa } from '@/lib/api';

export default function EmpresasPage() {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [empresaActual, setEmpresaActual] = useState<Partial<Empresa>>({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  useEffect(() => {
    cargarEmpresas();
  }, []);

  const cargarEmpresas = async () => {
    try {
      setLoading(true);
      const response = await empresasApi.listar();
      setEmpresas(response.data);
    } catch (error) {
      console.error('Error al cargar empresas:', error);
      mostrarMensaje('Error al cargar empresas. Verifique que el backend esté funcionando.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGuardar = async () => {
    try {
      if (empresaActual.id) {
        await empresasApi.actualizar(empresaActual.id, empresaActual);
        mostrarMensaje('Empresa actualizada exitosamente', 'success');
      } else {
        await empresasApi.crear(empresaActual as Omit<Empresa, 'id'>);
        mostrarMensaje('Empresa creada exitosamente', 'success');
      }
      setOpenDialog(false);
      cargarEmpresas();
    } catch (error: any) {
      mostrarMensaje(error.response?.data?.error || 'Error al guardar empresa', 'error');
    }
  };

  const handleEliminar = async (id: number) => {
    if (!confirm('¿Está seguro de eliminar esta empresa?')) return;
    
    try {
      await empresasApi.eliminar(id);
      mostrarMensaje('Empresa eliminada exitosamente', 'success');
      cargarEmpresas();
    } catch (error: any) {
      mostrarMensaje(error.response?.data?.error || 'Error al eliminar empresa', 'error');
    }
  };

  const mostrarMensaje = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const abrirDialogNueva = () => {
    setEmpresaActual({ activo: true });
    setOpenDialog(true);
  };

  const abrirDialogEditar = (empresa: Empresa) => {
    setEmpresaActual(empresa);
    setOpenDialog(true);
  };

  return (
    <Layout>
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box>
            <Typography variant="h4" fontWeight="bold">
              Empresas
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Gestión de empresas emisoras de documentos electrónicos
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={abrirDialogNueva}
            size="large"
          >
            Nueva Empresa
          </Button>
        </Box>

        <Card>
          <CardContent>
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>RUC</TableCell>
                    <TableCell>Razón Social</TableCell>
                    <TableCell>Nombre Comercial</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Teléfono</TableCell>
                    <TableCell>Estado</TableCell>
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
                  ) : empresas.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        No hay empresas registradas
                      </TableCell>
                    </TableRow>
                  ) : (
                    empresas.map((empresa) => (
                      <TableRow key={empresa.id}>
                        <TableCell>{empresa.id}</TableCell>
                        <TableCell>{empresa.ruc}</TableCell>
                        <TableCell>{empresa.razonSocial}</TableCell>
                        <TableCell>{empresa.nombreComercial || '-'}</TableCell>
                        <TableCell>{empresa.email || '-'}</TableCell>
                        <TableCell>{empresa.telefono || '-'}</TableCell>
                        <TableCell>
                          <Chip
                            label={empresa.activo ? 'Activo' : 'Inactivo'}
                            color={empresa.activo ? 'success' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => abrirDialogEditar(empresa)}
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleEliminar(empresa.id)}
                          >
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Dialog de Empresa */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            {empresaActual.id ? 'Editar Empresa' : 'Nueva Empresa'}
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <Box display="flex" gap={2}>
                <TextField
                  fullWidth
                  required
                  label="RUC"
                  value={empresaActual.ruc || ''}
                  onChange={(e) => setEmpresaActual({ ...empresaActual, ruc: e.target.value })}
                  placeholder="12345678-9"
                />
                <TextField
                  fullWidth
                  required
                  label="Razón Social"
                  value={empresaActual.razonSocial || ''}
                  onChange={(e) => setEmpresaActual({ ...empresaActual, razonSocial: e.target.value })}
                />
              </Box>
              <TextField
                fullWidth
                label="Nombre Comercial"
                value={empresaActual.nombreComercial || ''}
                onChange={(e) => setEmpresaActual({ ...empresaActual, nombreComercial: e.target.value })}
              />
              <TextField
                fullWidth
                label="Dirección"
                value={empresaActual.direccion || ''}
                onChange={(e) => setEmpresaActual({ ...empresaActual, direccion: e.target.value })}
              />
              <Box display="flex" gap={2}>
                <TextField
                  fullWidth
                  label="Teléfono"
                  value={empresaActual.telefono || ''}
                  onChange={(e) => setEmpresaActual({ ...empresaActual, telefono: e.target.value })}
                />
                <TextField
                  fullWidth
                  type="email"
                  label="Email"
                  value={empresaActual.email || ''}
                  onChange={(e) => setEmpresaActual({ ...empresaActual, email: e.target.value })}
                />
              </Box>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
            <Button
              onClick={handleGuardar}
              variant="contained"
              disabled={!empresaActual.ruc || !empresaActual.razonSocial}
            >
              Guardar
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
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
