// src/components/TestTailwind.jsx
const TestTailwind = () => {
  return (
    <div className="p-8 max-w-md mx-auto bg-white rounded-xl shadow-lg space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">¡Tailwind funciona!</h1>
      <p className="text-gray-600">Si ves estos estilos, todo está configurado correctamente.</p>
      <button className="btn-primary">Botón de prueba</button>
    </div>
  );
};

export default TestTailwind;