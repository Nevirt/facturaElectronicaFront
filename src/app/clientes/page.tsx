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
  MenuItem,
  Stack,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
} from '@mui/icons-material';
import Layout from '@/components/Layout';
import { clientesApi, empresasApi, Cliente, Empresa } from '@/lib/api';

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [clienteActual, setClienteActual] = useState<Partial<Cliente>>({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [clientesResponse, empresasResponse] = await Promise.all([
        clientesApi.listar(),
        empresasApi.listar(),
      ]);
      setClientes(clientesResponse.data);
      setEmpresas(empresasResponse.data);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      mostrarMensaje('Error al cargar datos. Verifique que el backend esté funcionando.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGuardar = async () => {
    try {
      if (clienteActual.id) {
        await clientesApi.actualizar(clienteActual.id, clienteActual);
        mostrarMensaje('Cliente actualizado exitosamente', 'success');
      } else {
        await clientesApi.crear(clienteActual as Omit<Cliente, 'id'>);
        mostrarMensaje('Cliente creado exitosamente', 'success');
      }
      setOpenDialog(false);
      cargarDatos();
    } catch (error: any) {
      mostrarMensaje(error.response?.data?.error || 'Error al guardar cliente', 'error');
    }
  };

  const handleEliminar = async (id: number) => {
    if (!confirm('¿Está seguro de eliminar este cliente?')) return;
    
    try {
      await clientesApi.eliminar(id);
      mostrarMensaje('Cliente eliminado exitosamente', 'success');
      cargarDatos();
    } catch (error: any) {
      mostrarMensaje(error.response?.data?.error || 'Error al eliminar cliente', 'error');
    }
  };

  const mostrarMensaje = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const abrirDialogNuevo = () => {
    setClienteActual({ activo: true, empresaId: empresas[0]?.id || 1 });
    setOpenDialog(true);
  };

  const abrirDialogEditar = (cliente: Cliente) => {
    setClienteActual(cliente);
    setOpenDialog(true);
  };

  const obtenerNombreEmpresa = (empresaId: number) => {
    const empresa = empresas.find((e) => e.id === empresaId);
    return empresa?.razonSocial || '-';
  };

  return (
    <Layout>
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box>
            <Typography variant="h4" fontWeight="bold">
              Clientes
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Gestión de clientes para facturación electrónica
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={abrirDialogNuevo}
            size="large"
          >
            Nuevo Cliente
          </Button>
        </Box>

        <Card>
          <CardContent>
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Empresa</TableCell>
                    <TableCell>RUC</TableCell>
                    <TableCell>Razón Social</TableCell>
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
                  ) : clientes.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        No hay clientes registrados
                      </TableCell>
                    </TableRow>
                  ) : (
                    clientes.map((cliente) => (
                      <TableRow key={cliente.id}>
                        <TableCell>{cliente.id}</TableCell>
                        <TableCell>{obtenerNombreEmpresa(cliente.empresaId)}</TableCell>
                        <TableCell>{cliente.ruc || '-'}</TableCell>
                        <TableCell>{cliente.razonSocial}</TableCell>
                        <TableCell>{cliente.email || '-'}</TableCell>
                        <TableCell>{cliente.telefono || '-'}</TableCell>
                        <TableCell>
                          <Chip
                            label={cliente.activo ? 'Activo' : 'Inactivo'}
                            color={cliente.activo ? 'success' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => abrirDialogEditar(cliente)}
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleEliminar(cliente.id)}
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

        {/* Dialog de Cliente */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            {clienteActual.id ? 'Editar Cliente' : 'Nuevo Cliente'}
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                fullWidth
                required
                select
                label="Empresa"
                value={clienteActual.empresaId || ''}
                onChange={(e) => setClienteActual({ ...clienteActual, empresaId: Number(e.target.value) })}
              >
                {empresas.map((empresa) => (
                  <MenuItem key={empresa.id} value={empresa.id}>
                    {empresa.razonSocial}
                  </MenuItem>
                ))}
              </TextField>
              <Box display="flex" gap={2}>
                <TextField
                  fullWidth
                  label="RUC"
                  value={clienteActual.ruc || ''}
                  onChange={(e) => setClienteActual({ ...clienteActual, ruc: e.target.value })}
                  placeholder="12345678-9"
                />
                <TextField
                  fullWidth
                  required
                  label="Razón Social"
                  value={clienteActual.razonSocial || ''}
                  onChange={(e) => setClienteActual({ ...clienteActual, razonSocial: e.target.value })}
                />
              </Box>
              <TextField
                fullWidth
                label="Nombre Comercial"
                value={clienteActual.nombreComercial || ''}
                onChange={(e) => setClienteActual({ ...clienteActual, nombreComercial: e.target.value })}
              />
              <TextField
                fullWidth
                label="Dirección"
                value={clienteActual.direccion || ''}
                onChange={(e) => setClienteActual({ ...clienteActual, direccion: e.target.value })}
              />
              <Box display="flex" gap={2}>
                <TextField
                  fullWidth
                  label="Teléfono"
                  value={clienteActual.telefono || ''}
                  onChange={(e) => setClienteActual({ ...clienteActual, telefono: e.target.value })}
                />
                <TextField
                  fullWidth
                  type="email"
                  label="Email"
                  value={clienteActual.email || ''}
                  onChange={(e) => setClienteActual({ ...clienteActual, email: e.target.value })}
                />
              </Box>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
            <Button
              onClick={handleGuardar}
              variant="contained"
              disabled={!clienteActual.razonSocial || !clienteActual.empresaId}
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
