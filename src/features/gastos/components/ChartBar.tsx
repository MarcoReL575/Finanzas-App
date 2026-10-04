'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { SelectTransaction } from '../../transaction/types/types';
import { listaGastos } from '@/src/category';
import { formatCurrency } from '@/src/shared/helper/formatCurrency';
import { useState } from 'react';
import { MONTHS } from '@/src/months';

interface Props {
    transactionsLista: SelectTransaction[]
}

export default function ChartBar({ transactionsLista }: Props) {

    const currentMonth = new Date().getMonth() + 1; // 1 - 12
    const currentYear = new Date().getFullYear();

    const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth);
    const [selectedYear, setSelectedYear] = useState<number>(currentYear);

    // 1. Filtrar transacciones pertenecientes al mes y año elegidos (solo gastos)
    const filteredTransactions = transactionsLista.filter((t) => {
        const tDate = new Date(t.createdAt);
        const isExpense = t.tipo === 'gasto' || !t.tipo;
        return (
            isExpense &&
            tDate.getMonth() + 1 === selectedMonth &&
            tDate.getFullYear() === selectedYear
        );
    });

    // 2. Mapear y agrupar los gastos por cada categoría para ese mes
    const chartData = listaGastos
        .filter((cat) => cat.value !== 'all')
        .map((cat) => {
            const totalGasto = filteredTransactions
                .filter((tran) => tran.categoria === cat.value)
                .reduce((acc, curr) => {
                    const rawAmount = curr.monto ?? 0;
                    return acc + rawAmount
                }, 0);

            return {
                categoryValue: cat.value,
                name: cat.label,
                total: totalGasto
            }
        }
    ).filter((item) => item.total > 0);

    // Total acumulado gastado en el mes seleccionado
    const totalMonthExpense = chartData.reduce((acc, item) => acc + item.total, 0);
    
    return (
        <div className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 text-slate-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                    <h4 className="font-semibold text-base mb-4 text-slate-200">Gastos por Categoría</h4>
                    <p className="text-xs text-slate-400">
                        Total gastado en {MONTHS[selectedMonth - 1]}:{' '}
                        <strong className="text-emerald-400 font-semibold">{formatCurrency(totalMonthExpense)}</strong>
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(Number(e.target.value))}
                        className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                        {MONTHS.map((monthName, idx) => (
                            <option key={idx + 1} value={idx + 1}>
                                {monthName}
                            </option>
                        ))}
                    </select>

                    <input
                        type="number"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                        className="w-20 bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-2 py-2 text-center focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                </div>
            </div>

            {chartData.length === 0 
                ? (
                    <div className="w-full h-64 flex flex-col items-center justify-center text-slate-400 text-sm gap-1">
                        <p>No hay gastos registrados en {MONTHS[selectedMonth - 1]} de {selectedYear}.</p>
                        <span className="text-xs text-slate-500">Selecciona otro mes o registra una transacción.</span>
                    </div>
                ) : (
                    <div className="w-full h-87">
                        <ResponsiveContainer width="100%" height="100%" data-testid="responsive-container">
                            <BarChart
                                data={chartData}
                                margin={{ top: 10, right: 10, left: 10, bottom: 25 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />

                                <XAxis
                                    dataKey="name"
                                    stroke="#94a3b8"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    interval={0}
                                    angle={-35}
                                    textAnchor="end"
                                />

                                <YAxis
                                    stroke="#94a3b8"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `$${value}`}
                                />

                                <Tooltip
                                    cursor={{ fill: '#1e293b' }}
                                    contentStyle={{
                                        backgroundColor: '#0f172a',
                                        borderColor: '#334155',
                                        borderRadius: '0.5rem',
                                        color: '#f8fafc',
                                    }}
                                    formatter={(value: number) => [formatCurrency(value), 'Gastado']}
                                    labelStyle={{ color: '#94a3b8', fontWeight: 'bold' }}
                                />

                                <Bar
                                    dataKey="total"
                                    fill="#10b981" // Color Esmeralda
                                    radius={[6, 6, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )
            }
        </div>
    )
}
