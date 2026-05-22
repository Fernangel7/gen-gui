# gen-gui

✨ gen-gui — Interfaz mínima para automatizar acciones

Gen GUI es una pequeña aplicación de escritorio para automatizar acciones simples (mover el mouse y teclear texto) mediante una interfaz gráfica amigable construida con CustomTkinter y PyAutoGUI.

## Características

- Interfaz ligera y fácil de usar con CustomTkinter
- Mueve el cursor y devuelve la posición original
- Teclea texto con intervalo configurable
- Intervalo mínimo forzado: 5 segundos
- Multiplataforma: Linux y Windows

## Requisitos

- Python 3.11+
- Paquetes Python: `customtkinter`, `pyautogui`

Instalar dependencias:

```bash
python3 -m venv venv
source venv/bin/activate  # Windows: venv\\Scripts\\activate
pip install customtkinter pyautogui
```

## Uso

```bash
python3 app.py
```

La ventana permite ajustar el intervalo (ahora con mínimo forzado a 5s), texto a teclear y activar/desactivar movimiento de mouse o tecleo.

## Descargas

- Linux (Mediafire): [Descargar para Linux](https://www.mediafire.com/folder/js19dl1id7pga/GenGUI)
- Windows (Google Drive): [Descargar para Windows](https://drive.google.com/file/d/1w2sHYCluJe5iSvbe5Fccvy5weLxgZzxC/view)

> Sustituye los enlaces anteriores por las URLs de tus archivos en Google Drive u otro servicio de "drives".

## Notas

- El modo gráfico requiere un entorno X/Wayland en Linux.   
- `pyautogui.FAILSAFE = True` está activado para evitar comportamientos no deseados.

## Contribuir

Pull requests y mejoras son bienvenidas.

## Licencia

Revisa el archivo `LICENSE` para más detalles.