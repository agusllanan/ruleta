'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RotateCcw } from 'lucide-react';

const desafiosMatematica = Array.from(
  { length: 20 },
  (_, i) => `Desafío ${i + 1} Matemática`,
);
const desafiosInformatica = Array.from(
  { length: 20 },
  (_, i) => `Desafío ${i + 1} Informática`,
);
const desafiosIniciales = [...desafiosMatematica, ...desafiosInformatica];

export default function RuletaDesafios() {
  const [desafios, setDesafios] = useState([...desafiosIniciales]);
  const [selected, setSelected] = useState<string | null>(null);
  const [angle, setAngle] = useState(0);
  const [equipos, setEquipos] = useState<string[]>([]);
  const [puntajes, setPuntajes] = useState<Record<string, number>>({});
  const [equipoActual, setEquipoActual] = useState<string | null>(null);

  const agregarEquipo = (nombre: string) => {
    if (equipos.length < 5) {
      setEquipos([...equipos, nombre]);
      setPuntajes({ ...puntajes, [nombre]: 0 });
    }
  };

  const incrementarPuntaje = (equipo: string) => {
    setPuntajes({ ...puntajes, [equipo]: puntajes[equipo] + 1 });
  };

  const girarRuleta = () => {
    if (desafios.length === 0) return;
    const newAngle = angle + 1800 + Math.floor(Math.random() * 360);
    setAngle(newAngle);
    setTimeout(() => {
      const index = Math.floor(Math.random() * desafios.length);
      setSelected(desafios[index]);
      setDesafios(desafios.filter((_, i) => i !== index));
    }, 3000);
  };

  const determinarGanador = () => {
    const maxPuntaje = Math.max(...Object.values(puntajes));
    const ganadores = Object.keys(puntajes).filter(
      (equipo) => puntajes[equipo] === maxPuntaje,
    );
    return ganadores.length > 1
      ? `Empate entre: ${ganadores.join(', ')}`
      : `Ganó: ${ganadores[0]}`;
  };

  return (
    <div className='flex flex-col items-center justify-center h-screen p-4 bg-blue-100'>
      <h1 className='text-2xl font-bold mb-4'>Ruleta de Desafíos</h1>
      <motion.div
        animate={{ rotate: angle }}
        transition={{ duration: 3, ease: 'easeOut' }}
        className='w-40 h-40 rounded-full bg-red-500 flex items-center justify-center text-white font-bold text-xl shadow-lg'
      >
        🎡
      </motion.div>
      <Button
        className='mt-6'
        onClick={girarRuleta}
        disabled={desafios.length === 0}
      >
        {desafios.length > 0 ? 'Girar Ruleta' : 'No hay más desafíos'}
      </Button>
      {selected && (
        <Card className='mt-4 w-64 text-center'>
          <CardContent className='p-4 font-semibold'>{selected}</CardContent>
          {equipoActual && (
            <Button
              onClick={() => incrementarPuntaje(equipoActual)}
              className='m-2'
            >
              Sumar punto a {equipoActual}
            </Button>
          )}
          <Button
            onClick={() => setSelected(null)}
            className='m-2'
            variant='outline'
          >
            <RotateCcw size={16} className='mr-2' /> Reiniciar
          </Button>
        </Card>
      )}
      <div className='mt-4'>
        <h2 className='text-lg font-semibold'>Equipos</h2>
        {equipos.map((equipo) => (
          <div key={equipo} className='flex items-center gap-2'>
            <Button onClick={() => setEquipoActual(equipo)}>{equipo}</Button>
            <span className='font-bold'>Puntos: {puntajes[equipo]}</span>
          </div>
        ))}
        {equipos.length < 5 && (
          <Button
            className='mt-2'
            onClick={() => agregarEquipo(`Equipo ${equipos.length + 1}`)}
          >
            Agregar Equipo
          </Button>
        )}
      </div>
      {desafios.length === 0 && (
        <h2 className='text-xl font-bold mt-4'>{determinarGanador()}</h2>
      )}
    </div>
  );
}
