'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Card,
  CardContent,
  Typography,
  MenuItem,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Stack,
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { useForm, useFieldArray } from 'react-hook-form';
import { FacturaDTO, DetalleFactura } from '@/lib/api';

interface FacturaFormProps {
  empresaId?: number;
  onSubmit: (data: FacturaDTO) => Promise<void>;
  isLoading?: boolean;
}

export default function FacturaForm({ empresaId, onSubmit, isLoading }: FacturaFormProps) {
  const { register, control, handleSubmit, watch, formState: { errors } } = useForm<FacturaDTO>({
    defaultValues: {
      empresaId: empresaId || 1,
      clienteId: 0,
      fechaEmision: new Date().toISOString().split('T')[0],
      moneda: 'PYG',
      condicionVenta: 'CONTADO',
      detalles: [
        {
          numeroLinea: 1,
          codigoProducto: '',
          descripcion: '',
          cantidad: 1,
          unidadMedida: 'UNI',
          precioUnitario: 0,
          descuento: 0,
          porcentajeIVA: 10,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'detalles',
  });

  const detalles = watch('detalles');

  const calcularSubtotal = (detalle: DetalleFactura) => {
    return detalle.cantidad * detalle.precioUnitario - detalle.descuento;
  };

  const calcularIVA = (detalle: DetalleFactura) => {
    const subtotal = calcularSubtotal(detalle);
    return (subtotal * detalle.porcentajeIVA) / 100;
  };

  const calcularTotal = () => {
    return detalles.reduce((sum, detalle) => {
      return sum + calcularSubtotal(detalle) + calcularIVA(detalle);
    }, 0);
  };

  const agregarLinea = () => {
    append({
      numeroLinea: fields.length + 1,
      codigoProducto: '',
      descripcion: '',
      cantidad: 1,
      unidadMedida: 'UNI',
      precioUnitario: 0,
      descuento: 0,
      porcentajeIVA: 10,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        {/* Datos del Cliente */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Datos del Cliente
            </Typography>
            <Stack spacing={2}>
              <Box display="flex" gap={2}>
                <TextField
                  fullWidth
                  label="RUC"
                  {...register('clienteRUC')}
                  placeholder="12345678-9"
                />
                <TextField
                  fullWidth
                  required
                  label="Razón Social"
                  {...register('clienteRazonSocial', { required: true })}
                  error={!!errors.clienteRazonSocial}
                />
              </Box>
              <TextField
                fullWidth
                label="Dirección"
                {...register('clienteDireccion')}
              />
              <Box display="flex" gap={2}>
                <TextField
                  fullWidth
                  label="Teléfono"
                  {...register('clienteTelefono')}
                />
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  {...register('clienteEmail')}
                />
              </Box>
            </Stack>
          </CardContent>
        </Card>

        {/* Datos de la Factura */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Datos de la Factura
            </Typography>
            <Stack spacing={2}>
              <Box display="flex" gap={2}>
                <TextField
                  fullWidth
                  required
                  type="date"
                  label="Fecha de Emisión"
                  {...register('fechaEmision', { required: true })}
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.fechaEmision}
                />
                <TextField
                  fullWidth
                  select
                  label="Moneda"
                  {...register('moneda')}
                  defaultValue="PYG"
                >
                  <MenuItem value="PYG">Guaraníes (PYG)</MenuItem>
                  <MenuItem value="USD">Dólares (USD)</MenuItem>
                </TextField>
                <TextField
                  fullWidth
                  select
                  label="Condición de Venta"
                  {...register('condicionVenta')}
                  defaultValue="CONTADO"
                >
                  <MenuItem value="CONTADO">Contado</MenuItem>
                  <MenuItem value="CREDITO">Crédito</MenuItem>
                </TextField>
              </Box>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Observaciones"
                {...register('observaciones')}
              />
            </Stack>
          </CardContent>
        </Card>

        {/* Detalles de la Factura */}
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">
                  Detalles de la Factura
                </Typography>
                <Button
                  startIcon={<Add />}
                  onClick={agregarLinea}
                  variant="outlined"
                >
                  Agregar Línea
                </Button>
              </Box>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>#</TableCell>
                      <TableCell>Código</TableCell>
                      <TableCell>Descripción</TableCell>
                      <TableCell>Cantidad</TableCell>
                      <TableCell>Unidad</TableCell>
                      <TableCell>Precio Unit.</TableCell>
                      <TableCell>Descuento</TableCell>
                      <TableCell>IVA %</TableCell>
                      <TableCell>Subtotal</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {fields.map((field, index) => (
                      <TableRow key={field.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          <TextField
                            size="small"
                            {...register(`detalles.${index}.codigoProducto`)}
                            sx={{ width: 100 }}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            size="small"
                            required
                            {...register(`detalles.${index}.descripcion`, { required: true })}
                            sx={{ width: 200 }}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            size="small"
                            type="number"
                            {...register(`detalles.${index}.cantidad`, { required: true, min: 1 })}
                            sx={{ width: 80 }}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            size="small"
                            select
                            {...register(`detalles.${index}.unidadMedida`)}
                            sx={{ width: 80 }}
                          >
                            <MenuItem value="UNI">UNI</MenuItem>
                            <MenuItem value="KG">KG</MenuItem>
                            <MenuItem value="LT">LT</MenuItem>
                            <MenuItem value="MT">MT</MenuItem>
                          </TextField>
                        </TableCell>
                        <TableCell>
                          <TextField
                            size="small"
                            type="number"
                            {...register(`detalles.${index}.precioUnitario`, { required: true, min: 0 })}
                            sx={{ width: 100 }}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            size="small"
                            type="number"
                            {...register(`detalles.${index}.descuento`)}
                            sx={{ width: 80 }}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            size="small"
                            select
                            {...register(`detalles.${index}.porcentajeIVA`)}
                            sx={{ width: 80 }}
                          >
                            <MenuItem value={0}>0%</MenuItem>
                            <MenuItem value={5}>5%</MenuItem>
                            <MenuItem value={10}>10%</MenuItem>
                          </TextField>
                        </TableCell>
                        <TableCell>
                          {calcularSubtotal(detalles[index]).toLocaleString('es-PY')}
                        </TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => remove(index)}
                            disabled={fields.length === 1}
                          >
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box mt={2} display="flex" justifyContent="flex-end">
                <Typography variant="h5">
                  Total: ₲ {calcularTotal().toLocaleString('es-PY')}
                </Typography>
              </Box>
            </CardContent>
          </Card>

        {/* Botones */}
          <Box display="flex" gap={2} justifyContent="flex-end">
            <Button variant="outlined" size="large">
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isLoading}
            >
              {isLoading ? 'Guardando...' : 'Crear Factura'}
            </Button>
          </Box>
      </Stack>
    </form>
  );
}
