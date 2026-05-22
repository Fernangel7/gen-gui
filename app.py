import threading
import time
import customtkinter as ctk
import pyautogui
# Tiempo mínimo de intervalo en segundos
MIN_INTERVAL = 5.0

ctk.set_appearance_mode("System")
ctk.set_default_color_theme("blue")

class AppAutomatizacion(ctk.CTk):
    def __init__(self):
        super().__init__()

        self.title("Gen GUI - Automatización de Acciones")
        self.geometry("450x450")
        self.resizable(False, False)
        
        self.corriendo = False
        self.hilo = None
        
        self.lbl_titulo = ctk.CTkLabel(self, text="Configurador de Acciones", font=ctk.CTkFont(size=20, weight="bold"))
        self.lbl_titulo.pack(pady=15)

        self.lbl_intervalo = ctk.CTkLabel(self, text="Intervalo de ejecución (segundos):")
        self.lbl_intervalo.pack(pady=(5, 0))
        self.entry_intervalo = ctk.CTkEntry(self, width=200)
        self.entry_intervalo.insert(0, "5")
        self.entry_intervalo.pack(pady=5)

        self.lbl_texto = ctk.CTkLabel(self, text="Texto a teclear (opcional):")
        self.lbl_texto.pack(pady=(10, 0))
        self.entry_texto = ctk.CTkEntry(self, width=300)
        self.entry_texto.insert(0, "Ping!")
        self.entry_texto.pack(pady=5)

        self.chk_mouse_var = ctk.BooleanVar(value=True)
        self.chk_mouse = ctk.CTkCheckBox(self, text="Mover Mouse", variable=self.chk_mouse_var)
        self.chk_mouse.pack(pady=10)

        self.chk_teclado_var = ctk.BooleanVar(value=True)
        self.chk_teclado = ctk.CTkCheckBox(self, text="Teclear Texto", variable=self.chk_teclado_var)
        self.chk_teclado.pack(pady=5)

        self.lbl_estado = ctk.CTkLabel(self, text="Estado: Detenido", text_color="gray")
        self.lbl_estado.pack(pady=15)

        self.btn_iniciar = ctk.CTkButton(self, text="Iniciar", command=self.iniciar_proceso)
        self.btn_iniciar.pack(pady=5)

        self.btn_detener = ctk.CTkButton(self, text="Detener", fg_color="red", hover_color="#8B0000", command=self.detener_proceso)
        self.btn_detener.pack(pady=5)
        self.btn_detener.configure(state="disabled")

    def logica_automatizacion(self):
        try:
            intervalo = float(self.entry_intervalo.get())
            texto = self.entry_texto.get()
        except ValueError:
            self.lbl_estado.configure(text="Error: El intervalo debe ser un número", text_color="red")
            self.desbloquear_interfaz()
            return

        while self.corriendo:
            tiempo_pasado = 0
            while tiempo_pasado < intervalo:
                if not self.corriendo:
                    return
                time.sleep(0.1)
                tiempo_pasado += 0.1

            if self.chk_mouse_var.get() and self.corriendo:
                x, y = pyautogui.position()
                pyautogui.moveTo(x + 50, y + 50, duration=0.2)
                pyautogui.moveTo(x, y, duration=0.2)

            if self.chk_teclado_var.get() and texto and self.corriendo:
                pyautogui.write(texto, interval=0.05)

    def iniciar_proceso(self):
        try:
            intervalo = float(self.entry_intervalo.get())
        except ValueError:
            self.lbl_estado.configure(text="Error: El intervalo debe ser un número", text_color="red")
            return

        if intervalo < MIN_INTERVAL:
            intervalo = MIN_INTERVAL
            
            self.entry_intervalo.configure(state="normal")
            self.entry_intervalo.delete(0, "end")
            display_val = str(int(MIN_INTERVAL)) if MIN_INTERVAL == int(MIN_INTERVAL) else str(MIN_INTERVAL)
            self.entry_intervalo.insert(0, display_val)
            self.lbl_estado.configure(text=f"Intervalo ajustado a mínimo {display_val} s", text_color="orange")

        self.corriendo = True
        self.lbl_estado.configure(text="Estado: Ejecutando...", text_color="green")

        self.btn_iniciar.configure(state="disabled")
        self.btn_detener.configure(state="normal")
        self.entry_intervalo.configure(state="disabled")
        self.entry_texto.configure(state="disabled")

        self.hilo = threading.Thread(target=self.logica_automatizacion, daemon=True)
        self.hilo.start()

    def detener_proceso(self):
        self.corriendo = False
        self.lbl_estado.configure(text="Estado: Detenido", text_color="gray")
        self.desbloquear_interfaz()

    def desbloquear_interfaz(self):
        self.btn_iniciar.configure(state="normal")
        self.btn_detener.configure(state="disabled")
        self.entry_intervalo.configure(state="normal")
        self.entry_texto.configure(state="normal")

if __name__ == "__main__":
    pyautogui.FAILSAFE = True
    
    app = AppAutomatizacion()
    app.mainloop()