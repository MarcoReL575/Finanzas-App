// import React from 'react'

// export default function GraficosPage() {
//   return (
//     <div>GraficosPage</div>
//   )
// }


// app/home/page.tsx
'use client'

import { useState } from 'react'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Plus, 
  Filter, 
  AlertCircle 
} from 'lucide-react'

export default function GraficosPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-6 space-y-8 max-w-7xl mx-auto">
      
      {/* 1. HEADER & ACCIONES RÁPIDAS */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Panel Financiero</h1>
          <p className="text-sm text-slate-500">Resumen de ingresos, gastos y presupuestos del mes</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-all shadow-sm">
            <Plus className="w-4 h-4" /> Agregar Gasto
          </button>
          <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-all shadow-sm">
            <Plus className="w-4 h-4" /> Agregar Ingreso
          </button>
        </div>
      </header>

      {/* 2. BARRA DE FILTROS */}
      <section className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-slate-700 font-medium text-sm">
          <Filter className="w-4 h-4 text-slate-500" />
          <span>Filtros:</span>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Categórica */}
          <select className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-slate-400">
            <option value="">Todas las categorías</option>
            <option value="comida">Comida</option>
            <option value="transporte">Transporte</option>
            <option value="servicios">Servicios</option>
          </select>

          {/* Rango / Mes */}
          <select className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-slate-400">
            <option value="current">Este Mes</option>
            <option value="last_month">Mes Anterior</option>
            <option value="year">Todo el Año</option>
          </select>

          {/* Tipo */}
          <select className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-slate-400">
            <option value="all">Todos los movimientos</option>
            <option value="gasto">Solo Gastos</option>
            <option value="ingreso">Solo Ingresos</option>
          </select>
        </div>
      </section>

      {/* 3. CARDS DE ESTADÍSTICAS (STATS) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Balance Total */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Balance Total</p>
            <h3 className="text-3xl font-extrabold text-slate-900 mt-2">$12,450.00</h3>
            <span className="text-xs text-emerald-600 font-medium mt-1 inline-block">↑ 8% vs mes anterior</span>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Wallet className="w-6 h-6" />
          </div>
        </div>

        {/* Ingresos Totales */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Total Ingresos</p>
            <h3 className="text-3xl font-extrabold text-emerald-600 mt-2">$20,000.00</h3>
            <span className="text-xs text-slate-400 mt-1 inline-block">3 registros este mes</span>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* Gastos Totales */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Total Gastos</p>
            <h3 className="text-3xl font-extrabold text-red-600 mt-2">$7,550.00</h3>
            <span className="text-xs text-slate-400 mt-1 inline-block">14 transacciones</span>
          </div>
          <div className="p-3 bg-red-50 text-red-600 rounded-xl">
            <TrendingDown className="w-6 h-6" />
          </div>
        </div>
      </section>

      {/* 4. SECCIÓN DE GRÁFICAS Y LÍMITES / PRESUPUESTOS */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Gráfica de Distribución de Gastos (2 Cols) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-slate-500" />
              Gastos por Categoría
            </h2>
            <span className="text-xs text-slate-400">Actualizado hoy</span>
          </div>

          {/* Placeholder visual de la gráfica (Recharts) */}
          <div className="h-64 bg-slate-50 rounded-xl border border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
            <BarChart3 className="w-10 h-10 mb-2 stroke-1" />
            <p className="text-sm">Aquí se renderiza el componente de gráfica (ej. Recharts / Chart.js)</p>
          </div>
        </div>

        {/* Límites y Presupuestos (1 Col) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-800">Límites del Mes</h2>
            <button className="text-xs font-semibold text-blue-600 hover:underline">+ Crear Límite</button>
          </div>

          <div className="space-y-4">
            {/* Límite 1 */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-slate-700">Comida / Restaurantes</span>
                <span className="text-slate-500">$3,200 / <span className="font-bold text-slate-800">$4,000</span></span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: '80%' }}></div>
              </div>
              <p className="text-[11px] text-amber-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> Has consumido el 80% del presupuesto.
              </p>
            </div>

            {/* Límite 2 */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-slate-700">Transporte</span>
                <span className="text-slate-500">$1,200 / <span className="font-bold text-slate-800">$1,500</span></span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '50%' }}></div>
              </div>
            </div>

            {/* Límite 3 */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-slate-700">Entretenimiento</span>
                <span className="text-slate-500">$2,100 / <span className="font-bold text-slate-800">$2,000</span></span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-red-500 h-full rounded-full" style={{ width: '100%' }}></div>
              </div>
              <p className="text-[11px] text-red-600 font-semibold">¡Límite excedido por $100.00!</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SECCIÓN DE TABLA DE TRANSACCIONES / RECIENTES */}
      <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-slate-800">Transacciones Recientes</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
              <tr>
                <th className="p-3">Categoría</th>
                <th className="p-3">Descripción</th>
                <th className="p-3">Fecha</th>
                <th className="p-3">Tipo</th>
                <th className="p-3 text-right">Monto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="p-3 font-medium text-slate-800">Transporte</td>
                <td className="p-3 text-slate-600">Gasolina</td>
                <td className="p-3 text-slate-400">14 Sep 2026</td>
                <td className="p-3"><span className="px-2 py-1 bg-red-50 text-red-600 rounded-md text-xs font-semibold">Gasto</span></td>
                <td className="p-3 text-right font-bold text-red-600">-$800.00</td>
              </tr>
              <tr>
                <td className="p-3 font-medium text-slate-800">Nómina</td>
                <td className="p-3 text-slate-600">Pago de Quincena</td>
                <td className="p-3 text-slate-400">15 Sep 2026</td>
                <td className="p-3"><span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-md text-xs font-semibold">Ingreso</span></td>
                <td className="p-3 text-right font-bold text-emerald-600">+$15,000.00</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

    </div>
  )
}