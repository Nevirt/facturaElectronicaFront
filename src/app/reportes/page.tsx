'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  MenuItem,
  Button,
} from '@mui/material';
import {
  Receipt,
  CheckCircle,
  Cancel,
  TrendingUp,
  AttachMoney,
} from '@mui/icons-material';
import Layout from '@/components/Layout';
import StatsCard from '@/components/StatsCard';
import { facturasApi, empresasApi, FacturaResponse, Empresa } from '@/lib/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function ReportesPage() {
  const [facturas, setFacturas] = useState<FacturaResponse[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState<number>(1);
  const [fechaDesde, setFechaDesde] = useState<string>('');
  const [fechaHasta, setFechaHasta] = useState<string>('');

  useEffect(() => {
    cargarEmpresas();
  }, []);

  useEffect(() => {
    if (empresaSeleccionada) {
      cargarFacturas();
    }
  }, [empresaSeleccionada]);

  const cargarEmpresas = async () => {
    try {
      const response = await empresasApi.listar();
      setEmpresas(response.data);
      if (response.data.length > 0) {
        setEmpresaSeleccionada(response.data[0].id);
      }
    } catch (error) {
      console.error('Error al cargar empresas:', error);
    }
  };

  const cargarFacturas = async () => {
    try {
      const response = await facturasApi.listar(
        empresaSeleccionada,
        fechaDesde || undefined,
        fechaHasta || undefined
      );
      setFacturas(response.data);
    } catch (error) {
      console.error('Error al cargar facturas:', error);
    }
  };

  const estadisticas = {
    total: facturas.length,
    aceptadas: facturas.filter((f) => f.estado === 'ACEPTADO').length,
    pendientes: facturas.filter((f) => f.estado === 'PENDIENTE').length,
    rechazadas: facturas.filter((f) => f.estado === 'RECHAZADO').length,
    anuladas: facturas.filter((f) => f.estado === 'ANULADO').length,
    montoTotal: facturas.reduce((sum, f) => sum + f.total, 0),
    montoAceptadas: facturas.filter((f) => f.estado === 'ACEPTADO').reduce((sum, f) => sum + f.total, 0),
  };

  const datosEstados = [
    { name: 'Aceptadas', value: estadisticas.aceptadas },
    { name: 'Pendientes', value: estadisticas.pendientes },
    { name: 'Rechazadas', value: estadisticas.rechazadas },
    { name: 'Anuladas', value: estadisticas.anuladas },
  ];

  const COLORS = ['#2e7d32', '#ed6c02', '#d32f2f', '#757575'];

  const datosPorMes = () => {
    const meses: { [key: string]: number } = {};
    facturas.forEach((factura) => {
      const fecha = new Date(factura.fechaEmision);
      const mes = `${fecha.getMonth() + 1}/${fecha.getFullYear()}`;
      meses[mes] = (meses[mes] || 0) + factura.total;
    });

    return Object.entries(meses).map(([mes, total]) => ({
      mes,
      total,
    }));
  };

  return (
    <Layout>
      <Box>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Reportes y Estadísticas
        </Typography>
        <Typography variant="body1" color="textSecondary" gutterBottom mb={3}>
          Análisis de facturación electrónica
        </Typography>

        {/* Filtros */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '2fr 1.5fr 1.5fr 1fr' }} gap={2} alignItems="center">
              <TextField
                fullWidth
                select
                label="Empresa"
                value={empresaSeleccionada}
                onChange={(e) => setEmpresaSeleccionada(Number(e.target.value))}
              >
                {empresas.map((empresa) => (
                  <MenuItem key={empresa.id} value={empresa.id}>
                    {empresa.razonSocial}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                type="date"
                label="Fecha Desde"
                value={fechaDesde}
                onChange={(e) => setFechaDesde(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                type="date"
                label="Fecha Hasta"
                value={fechaHasta}
                onChange={(e) => setFechaHasta(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
              <Button
                fullWidth
                variant="contained"
                onClick={cargarFacturas}
                size="large"
              >
                Filtrar
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Estadísticas */}
        <Box
          display="grid"
          gridTemplateColumns={{
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(4, 1fr)',
          }}
          gap={3}
          sx={{ mb: 3 }}
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
            subtitle={`${((estadisticas.aceptadas / estadisticas.total) * 100 || 0).toFixed(1)}%`}
          />
          <StatsCard
            title="Pendientes"
            value={estadisticas.pendientes}
            icon={<Cancel fontSize="large" />}
            color="#ed6c02"
          />
          <StatsCard
            title="Monto Total"
            value={`₲ ${(estadisticas.montoTotal / 1000000).toFixed(1)}M`}
            icon={<AttachMoney fontSize="large" />}
            color="#9c27b0"
            subtitle={`Aceptadas: ₲ ${(estadisticas.montoAceptadas / 1000000).toFixed(1)}M`}
          />
        </Box>

        {/* Gráficos */}
        <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '2fr 1fr' }} gap={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Facturación por Mes
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={datosPorMes()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => `₲ ${Number(value || 0).toLocaleString('es-PY')}`}
                  />
                  <Legend />
                  <Bar dataKey="total" fill="#1976d2" name="Monto Total" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Distribución por Estado
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={datosEstados}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {datosEstados.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Layout>
  );
}
