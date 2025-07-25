import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ReporteMigracion = () => {
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [formato, setFormato] = useState('pdf');
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState('');
  const [cargando, setCargando] = useState(false);
  const [progreso, setProgreso] = useState(0);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  // Animación de entrada
  useEffect(() => {
    setTimeout(() => setMostrarFormulario(true), 300);
  }, []);

  // Simular progreso durante la carga
  useEffect(() => {
    if (cargando) {
      const interval = setInterval(() => {
        setProgreso(prev => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 15;
        });
      }, 200);
      return () => clearInterval(interval);
    } else {
      setProgreso(0);
    }
  }, [cargando]);

  const obtenerFechaHoy = () => {
    return new Date().toISOString().split('T')[0];
  };

  const obtenerFechaHace30Dias = () => {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() - 30);
    return fecha.toISOString().split('T')[0];
  };

  const establecerRangoRapido = (dias) => {
    const hoy = new Date();
    const inicio = new Date();
    inicio.setDate(hoy.getDate() - dias);
    
    setFechaInicio(inicio.toISOString().split('T')[0]);
    setFechaFin(hoy.toISOString().split('T')[0]);
    setMensaje('');
  };

  const limpiarFormulario = () => {
    setFechaInicio('');
    setFechaFin('');
    setFormato('pdf');
    setMensaje('');
    setTipoMensaje('');
  };

  const generarReporte = async () => {
    if (!fechaInicio || !fechaFin) {
      setMensaje('Por favor, selecciona ambas fechas');
      setTipoMensaje('error');
      return;
    }

    if (new Date(fechaInicio) > new Date(fechaFin)) {
      setMensaje('La fecha de inicio no puede ser mayor que la fecha de fin');
      setTipoMensaje('error');
      return;
    }

    setCargando(true);
    setMensaje('');
    setProgreso(0);

    try {
      const response = await axios.post(
        'http://localhost:8000/api/reporte-migracion',
        {
          fecha_inicio: fechaInicio,
          fecha_fin: fechaFin,
          formato: formato
        },
        {
          responseType: 'blob'
        }
      );

      setProgreso(100);
      
      setTimeout(() => {
        const blob = new Blob([response.data]);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        
        const extension = formato === 'pdf' ? 'pdf' : 'xlsx';
        const fechaActual = new Date().toISOString().split('T')[0];
        link.download = `reporte-migracion-${fechaActual}.${extension}`;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        setMensaje('¡Reporte generado y descargado exitosamente!');
        setTipoMensaje('success');
      }, 500);

    } catch (error) {
      if (error.response && error.response.status === 404) {
        setMensaje('No se encontraron registros para el rango de fechas seleccionado');
      } else if (error.response && error.response.data) {
        setMensaje('Error al generar el reporte. Verifica los datos e intenta nuevamente.');
      } else {
        setMensaje('Error de conexión. Verifica que el servidor esté funcionando.');
      }
      setTipoMensaje('error');
    } finally {
      setCargando(false);
    }
  };

  const calcularDiasSeleccionados = () => {
    if (!fechaInicio || !fechaFin) return 0;
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    const diferencia = fin.getTime() - inicio.getTime();
    return Math.ceil(diferencia / (1000 * 3600 * 24)) + 1;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-100 rounded-full opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-4xl mx-auto relative">
        {/* Header animado */}
        <div className={`text-center mb-12 transform transition-all duration-1000 ${
          mostrarFormulario ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'
        }`}>
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Reporte de Migración
          </h1>
          <p className="text-gray-600 text-lg">
            Genera reportes detallados de huéspedes registrados
          </p>
        </div>

        {/* Tarjeta principal */}
        <div className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20 transform transition-all duration-1000 ${
          mostrarFormulario ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'
        }`}>
          
          {/* Rangos rápidos */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Rangos Rápidos
            </h3>
            <div className="flex flex-wrap gap-3">
              {[
                { label: 'Hoy', dias: 0 },
                { label: 'Última semana', dias: 7 },
                { label: 'Último mes', dias: 30 },
                { label: 'Últimos 3 meses', dias: 90 }
              ].map((rango) => (
                <button
                  key={rango.label}
                  onClick={() => establecerRangoRapido(rango.dias)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg text-sm font-medium"
                >
                  {rango.label}
                </button>
              ))}
            </div>
          </div>

          {/* Formulario */}
          <div className="space-y-8">
            {/* Fechas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="group">
                <label htmlFor="fechaInicio" className="block text-sm font-semibold text-gray-700 mb-3">
                  📅 Fecha de Inicio
                </label>
                <input
                  type="date"
                  id="fechaInicio"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  max={obtenerFechaHoy()}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 group-hover:border-gray-300"
                />
              </div>
              
              <div className="group">
                <label htmlFor="fechaFin" className="block text-sm font-semibold text-gray-700 mb-3">
                  📅 Fecha de Fin
                </label>
                <input
                  type="date"
                  id="fechaFin"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                  max={obtenerFechaHoy()}
                  min={fechaInicio}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 group-hover:border-gray-300"
                />
              </div>
            </div>

            {/* Información del rango */}
            {fechaInicio && fechaFin && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 animate-fadeIn">
                <div className="flex items-center text-blue-700">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium">
                    Rango seleccionado: {calcularDiasSeleccionados()} día{calcularDiasSeleccionados() !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            )}

            {/* Formato */}
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-700">
                📄 Formato del Archivo
              </label>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: 'pdf', label: 'PDF', icon: '📄', desc: 'Formato portable, ideal para imprimir' },
                  { value: 'excel', label: 'Excel', icon: '📊', desc: 'Formato editable, ideal para análisis' }
                ].map((opcion) => (
                  <label
                    key={opcion.value}
                    className={`relative flex flex-col p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg ${
                      formato === opcion.value
                        ? 'border-blue-500 bg-blue-50 shadow-md ring-4 ring-blue-500/20'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center mb-2">
                      <input
                        type="radio"
                        name="formato"
                        value={opcion.value}
                        checked={formato === opcion.value}
                        onChange={(e) => setFormato(e.target.value)}
                        className="sr-only"
                      />
                      <span className="text-2xl mr-3">{opcion.icon}</span>
                      <span className={`font-semibold ${formato === opcion.value ? 'text-blue-700' : 'text-gray-700'}`}>
                        {opcion.label}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">{opcion.desc}</span>
                    {formato === opcion.value && (
                      <div className="absolute top-2 right-2">
                        <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Botones */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                onClick={generarReporte}
                disabled={cargando}
                className={`flex-1 relative overflow-hidden py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 ${
                  cargando
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 shadow-lg hover:shadow-xl'
                }`}
              >
                {cargando ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                    <span>Generando Reporte...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Generar Reporte
                  </div>
                )}
              </button>
              
              <button
                onClick={limpiarFormulario}
                disabled={cargando}
                className="px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 transform hover:scale-105"
              >
                <div className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Limpiar
                </div>
              </button>
            </div>

            {/* Barra de progreso */}
            {cargando && (
              <div className="space-y-2 animate-fadeIn">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Procesando...</span>
                  <span>{Math.round(progreso)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${progreso}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Mensaje */}
            {mensaje && (
              <div className={`p-4 rounded-xl border-l-4 animate-slideDown ${
                tipoMensaje === 'success'
                  ? 'bg-green-50 border-green-400 text-green-800'
                  : 'bg-red-50 border-red-400 text-red-800'
              }`}>
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-3 mt-0.5">
                    {tipoMensaje === 'success' ? (
                      <svg className="h-6 w-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="h-6 w-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold">{mensaje}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer informativo */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>💡 Tip: Usa los rangos rápidos para seleccionar fechas comunes</p>
        </div>
      </div>
    </div>
  );
};

export default ReporteMigracion;