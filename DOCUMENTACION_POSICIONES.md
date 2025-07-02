# 📍 Documentación de Posicionamiento de Botones - KOKOK FLY

## 🎯 Descripción General
Este documento explica cómo están posicionados todos los elementos de la interfaz del juego KOKOK FLY y cómo modificarlos manualmente.

## 📐 Sistema de Medidas Universales
- **Viewport Height (vh)**: 1vh = 1% de la altura de la pantalla
- **Viewport Width (vw)**: 1vw = 1% del ancho de la pantalla
- **minWidth**: Ancho mínimo en píxeles para pantallas pequeñas

---

## 🔑 PANTALLA DE LOGIN (`components/login-screen.tsx`)

### 1. Título "KOKOK FLY"
```javascript
style={{
  top: "25vh",        // 25% desde arriba
  left: "50%",        // Centro horizontal
  transform: "translateX(-50%)",
  width: "40vw",      // 40% del ancho de pantalla
}}
```

### 2. Campo de Entrada de Nombre
```javascript
style={{
  top: "50vh",        // 50% desde arriba
  left: "50%",        // Centro horizontal
  transform: "translateX(-50%)",
  width: "30vw",      // 30% del ancho de pantalla
  minWidth: "350px",  // Mínimo 350px en pantallas pequeñas
}}
```

### 3. Botón "START ADVENTURE"
```javascript
style={{
  top: "68vh",        // 68% desde arriba
  left: "50%",        // Centro horizontal
  transform: "translateX(-50%)",
  width: "30vw",      // 30% del ancho de pantalla
  minWidth: "350px",  // Mínimo 350px en pantallas pequeñas
}}
```

---

## 🎮 MENÚ PRINCIPAL (`components/main-menu.tsx`)

### 1. Título "KOKOK FLY"
```javascript
style={{
  top: "5vh",         // 5% desde arriba
  left: "50%",        // Centro horizontal
  transform: "translateX(-50%)",
}}
```

### 2. Mensaje de Bienvenida
```javascript
style={{
  top: "18vh",        // 18% desde arriba
  left: "50%",        // Centro horizontal
  transform: "translateX(-50%)",
}}
```

### 3. Botón "PLAY" (Cuadro Rojo)
```javascript
style={{
  top: "28vh",        // 28% desde arriba
  left: "6vw",        // 6% desde la izquierda
  width: "22vw",      // 22% del ancho de pantalla
  minWidth: "280px",  // Mínimo 280px
}}
```

### 4. Botón "CUSTOMIZE" (Cuadro Morado)
```javascript
style={{
  top: "42vh",        // 42% desde arriba
  left: "6vw",        // 6% desde la izquierda
  width: "22vw",      // 22% del ancho de pantalla
  minWidth: "280px",  // Mínimo 280px
}}
```

### 5. Botón "INSTRUCTIONS" (Cuadro Azul)
```javascript
style={{
  top: "56vh",        // 56% desde arriba
  left: "6vw",        // 6% desde la izquierda
  width: "22vw",      // 22% del ancho de pantalla
  minWidth: "280px",  // Mínimo 280px
}}
```

### 6. Panel "HIGH SCORES" (Cuadro Amarillo)
```javascript
style={{
  top: "28vh",        // 28% desde arriba
  right: "6vw",       // 6% desde la derecha
  width: "24vw",      // 24% del ancho de pantalla
  minWidth: "300px",  // Mínimo 300px
}}
```

### 7. Panel "Unlocked Vehicles" (Cuadro Azul Derecha)
```javascript
style={{
  top: "52vh",        // 52% desde arriba
  right: "6vw",       // 6% desde la derecha
  width: "24vw",      // 24% del ancho de pantalla
  minWidth: "300px",  // Mínimo 300px
}}
```

---

## 🔧 Cómo Modificar Posiciones Manualmente

### Para mover un elemento VERTICALMENTE:
- **Más arriba**: Reduce el valor de `top` (ej: de "28vh" a "25vh")
- **Más abajo**: Aumenta el valor de `top` (ej: de "28vh" a "32vh")

### Para mover un elemento HORIZONTALMENTE:
- **Más a la izquierda**: Reduce `left` o aumenta `right`
- **Más a la derecha**: Aumenta `left` o reduce `right`

### Para cambiar el TAMAÑO:
- **Más ancho**: Aumenta `width` (ej: de "22vw" a "25vw")
- **Más angosto**: Reduce `width` (ej: de "22vw" a "18vw")
- **Altura de botones**: Modifica la clase `h-16` en el botón

### Ejemplo de Modificación:
```javascript
// ANTES: Botón en posición original
style={{
  top: "28vh",
  left: "6vw",
  width: "22vw",
  minWidth: "280px",
}}

// DESPUÉS: Botón más arriba, más a la derecha y más ancho
style={{
  top: "25vh",        // 3vh más arriba
  left: "10vw",       // 4vw más a la derecha
  width: "25vw",      // 3vw más ancho
  minWidth: "300px",  // Mínimo más grande
}}
```

---

## 🎨 Personalización de Estilos

### Colores de Bordes:
- **Verde**: `border-green-400` (Botón PLAY)
- **Morado**: `border-purple-400` (Botón CUSTOMIZE)
- **Azul**: `border-blue-400` (Botón INSTRUCTIONS)
- **Amarillo**: `border-yellow-400` (Panel HIGH SCORES)
- **Cian**: `border-cyan-400` (Panel Vehicles)

### Tamaños de Botón:
- **Altura**: `h-16` (64px), `h-14` (56px), `h-12` (48px)
- **Padding**: `py-4` (16px arriba/abajo), `py-3` (12px), `py-2` (8px)
- **Texto**: `text-xl` (20px), `text-lg` (18px), `text-base` (16px)

### Bordes:
- **Grosor**: `border-4` (4px), `border-3` (3px), `border-2` (2px)
- **Redondez**: `rounded-2xl` (muy redondo), `rounded-xl` (redondo), `rounded-lg` (poco redondo)

---

## 📱 Responsividad

El sistema está diseñado para funcionar en diferentes tamaños de pantalla:
- **Desktop**: Usa valores en `vw` y `vh` para escalar proporcionalmente
- **Tablets**: Los valores `minWidth` garantizan un tamaño mínimo legible
- **Móviles**: Los elementos se mantienen proporcionales y legibles

### Breakpoints Recomendados:
- **Pantallas grandes** (>1200px): Los valores actuales funcionan perfectamente
- **Pantallas medianas** (768px-1200px): Considera reducir `minWidth` en 20-30px
- **Pantallas pequeñas** (<768px): Puede ser necesario ajustar posiciones a layout vertical

---

## 🚀 Comandos para Probar Cambios

1. **Instalar dependencias** (si no están instaladas):
   ```bash
   pnpm install
   ```

2. **Ejecutar en modo desarrollo**:
   ```bash
   pnpm run dev
   ```

3. **Abrir en navegador**:
   ```
   http://localhost:3000
   ```

---

## 💡 Tips Adicionales

1. **Cambios en vivo**: Al modificar archivos, los cambios se ven inmediatamente en el navegador
2. **Herramientas de desarrollo**: Usa F12 en el navegador para experimentar con posiciones antes de modificar el código
3. **Backup**: Siempre mantén una copia del código funcionando antes de hacer cambios mayores
4. **Medidas consistentes**: Usa incrementos de 2vh o 4vh para mantener espaciado uniforme

---

*Documento creado para el proyecto KOKOK FLY - Posicionamiento Universal de Elementos* 