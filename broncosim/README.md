# BroncoSim

Simulador educativo de anatomía bronquial para ung lab. Estética compartida con los otros simuladores: fondo #05080c, Geist, Great Vibes, monocromo y botones de pastilla.

Mapa 3D y monitor endoscópico con 31 estaciones y 18 destinos segmentarios. La cámara avanza y retrocede siguiendo las líneas centrales de la anatomía con una transición continua de 1,8 segundos a velocidad normal (0,9–4,5 segundos según el control). Los mandos quedan bloqueados durante el recorrido. Rotación, flexión, etiquetas, resaltado por segmentos, vistas, zoom, ayuda y teclado 1–3/retroceso/R.

Anatomía de BodyParts3D/DBCLS, con datos de centro y volumen distribuidos por RespHub; adaptaciones bajo CC BY-SA 2.1 Japan. Ver `ANATOMY-LICENSE.md`. Interfaz y material procedural propios; código de RespHub no reutilizado. Textura de mucosa con pliegues, variación de color, vasos y brillo; proyección triplanar. Instrumento negro con punta metálica y cono de luz en el mapa. Modelo educativo sin validación para entrenamiento clínico.

Servir con un servidor estático, sin compilación ni servicios de aplicación externos. Three.js local bajo MIT en `vendor/THREE-LICENSE.txt`; Google Fonts es opcional con respaldo de sistema. Los binarios anatómicos están preparados para uso directo. `tools/build-airway.mjs` y `tools/airway-input.json` corresponden al prototipo esquemático anterior, ya sustituido en ejecución por la anatomía de `data/`.
