import type { Product } from '../Types'; 

export const categories = [
  { id: 'JM', name: 'Juegos de Mesa' },
  { id: 'AC', name: 'Accesorios' },
  { id: 'CO', name: 'Consolas' },
  { id: 'CG', name: 'Computadores Gamers' },
  { id: 'SG', name: 'Sillas Gamers' },
  { id: 'MS', name: 'Mouse' },
  { id: 'MP', name: 'Mousepad' },
  { id: 'PP', name: 'Poleras Personalizadas' }
];


export const products: Product[] = [
  { code: 'JM001', category: 'JM', name: 'Catan', price: 29990, img: 'img/catan.png', desc: 'Juego de estrategia', details: ['Jugadores: 3-4', 'Edad: 10+', 'Duración: 60-120 min', 'Juego de comercio y construcción'] },
  { code: 'JM002', category: 'JM', name: 'Carcassonne', price: 24990, img: 'img/carcasone.png', desc: 'Colocación de losetas', details: ['Jugadores: 2-5', 'Edad: 8+', 'Duración: 35-45 min', 'Juego de colocación de losetas'] },
  { code: 'AC001', category: 'AC', name: 'Control Xbox Series', price: 59990, img: 'img/xbosseries.png', desc: 'Inalámbrico', details: ['Conexión: Inalámbrica', 'Compatibilidad: Xbox y PC', 'Batería: Recargable'] },
  { code: 'AC002', category: 'AC', name: 'HyperX Cloud II', price: 79990, img: 'img/hyperxcloud.png', desc: 'Sonido envolvente', details: ['Conexión: 3.5mm y USB', 'Micrófono: Desmontable', 'Compatibilidad: PC y Consolas'] },
  { code: 'CO001', category: 'CO', name: 'PlayStation 5', price: 549990, img: 'img/pley5.png', desc: 'Nueva generación', details: ['Almacenamiento: 825GB SSD', 'Resolución: Hasta 4K', 'Color: Blanco', 'Compatibilidad con juegos PS4'] },
  { code: 'CG001', category: 'CG', name: 'PC Gamer ROG Strix', price: 1299990, img: 'img/pcgamer.png', desc: 'Alto rendimiento', details: ['CPU: Intel i7', 'RAM: 16GB', 'GPU: RTX 3070', 'Almacenamiento: 1TB SSD'] },
  { code: 'SG001', category: 'SG', name: 'Silla Secretlab Titan', price: 349990, img: 'img/sillagamer.png', desc: 'Ergonómica', details: ['Altura ajustable', 'Reposabrazos 4D', 'Reclinable hasta 165°', 'Material: Cuero PU premium'] },
  { code: 'MS001', category: 'MS', name: 'Logitech G502 HERO', price: 49990, img: 'img/logitchg502.png', desc: 'Sensor preciso', details: ['DPI: 100-16000', 'Botones programables: 11', 'Peso ajustable', 'Iluminación RGB'] },
  { code: 'MP001', category: 'MP', name: 'Razer Goliathus Ext.', price: 29990, img: 'img/mousepadrazer.png', desc: 'RGB', details: ['Tamaño: XL', 'Base antideslizante', 'Superficie de microtextura', 'Iluminación Chroma RGB'] },
  { code: 'PP001', category: 'PP', name: "Polera 'Level‑Up'", price: 14990, img: 'img/polera-negra.png', desc: 'Personalizable', details: ['Material: Algodón 100%', 'Tallas: S, M, L, XL', 'Personalizable con tu nombre', 'Color: Negro'] }
];