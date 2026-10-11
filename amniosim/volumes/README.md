# Volúmenes del explorador (`?volumen`)

Aquí van los volúmenes **publicados** con la app y su manifiesto `cases.json`.

> **Pacientes reales:** publica solo volúmenes anonimizados y con permiso (consentimiento y, si son del
> HU, aprobación del comité de ética). Para practicar sin publicar nada, usa en la app
> **"Cargar carpeta de casos"**: lee la carpeta en tu navegador y no sube ningún archivo.

## Flujo para añadir un volumen
1. **Voluson** → SonoView → exportar a USB **sin comprimir** (*Anonymize* activado). Formato Kretz `.vol` o DICOM 3D.
2. **3D Slicer** + extensión **SlicerHeart** → abrir el archivo → *Save* → **NRRD** (`.nrrd`, un solo archivo).
3. Abre la app en `?volumen`, arrastra el `.nrrd` (o carga la carpeta). Si la imagen sale de lado,
   cambia **"Profundidad del archivo"** (eje X/Y/Z) o **invertir** hasta que la piel quede arriba.
4. Activa **Modo autor** y llena título, EG, diagnóstico y origen. Para cada plano estándar:
   coloca la sonda en el plano, **F** congela, mide (línea para DBP o LF, elipse para CC o CA),
   escribe el nombre y pulsa **Guardar plano**.
5. Pulsa **Descargar cases.json** y deja ese archivo junto a los `.nrrd`:
   - **Privado:** en tu carpeta (iCloud: `01 Proyectos/AmnioSim/volumenes/`) → "Cargar carpeta de casos".
   - **Publicado:** cópialos aquí (`public/volumes/`), `npm run build` y copia `dist/` al lab.

## Formato de `cases.json`
```json
{
  "version": 1,
  "cases": [{
    "id": "voluson-01", "title": "Cabeza fetal 20 sem", "ga": "20+3", "diagnosis": "Normal",
    "source": "Voluson E8, anonimizado",
    "file": "voluson-01.nrrd",          // o "frames": ["a.nrrd", "b.nrrd"], "fps": 4  (4D)
    "axis": "y", "flip": false,           // qué eje del archivo es la profundidad
    "targets": [{
      "id": "transtalamico", "name": "Plano transtalámico (DBP)",
      "measure": "line",                  // "line" | "ellipse" (perímetro) | "none"
      "expected": 47.5, "tolMm": 2,       // mm; tolerancia por defecto 10 %
      "point": [90, 112, 60], "normal": [0, 0, 1],   // mm en el volumen reorientado
      "pose": { "x": 90, "z": 60, "rot": 0, "tilt": 0, "rock": 0 },
      "tolDeg": 10, "tolOffset": 5, "hint": "Tálamos y cavum del septum pellucidum"
    }]
  }]
}
```
No hace falta escribirlo a mano: el **modo autor** lo genera. Enlace directo a un caso: `?volumen&caso=<id>`.
Los volúmenes muy grandes se reducen al cargar (máx. ~320 vóxeles por eje).
