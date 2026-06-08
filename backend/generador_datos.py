import csv
import random
from datetime import datetime, timedelta

def generar_csv_consumo():
    nombre_archivo = "consumo_pruebas.csv"
    # Empezamos el 1 de enero a las 00:00
    fecha_actual = datetime(2025, 1, 1, 0, 0)
    
    # 8760 horas son exactamente un año completo
    total_horas = 8760

    print(f"Generando {total_horas} filas de consumo energético...")

    with open(nombre_archivo, mode="w", newline="", encoding="utf-8") as archivo:
        escritor = csv.writer(archivo)
        
        # Escribimos la cabecera (las columnas de nuestro contrato de datos)
        escritor.writerow(["Fecha", "Hora", "Consumo_kWh"])
        
        for _ in range(total_horas):
            hora = fecha_actual.hour
            
            # Simulamos un comportamiento humano realista:
            if 0 <= hora <= 6:
                # Madrugada: consumo bajo constante (frigorífico, stand-by)
                consumo = round(random.uniform(0.10, 0.25), 3)
            elif 12 <= hora <= 15 or 19 <= hora <= 22:
                # Horas pico: cocinar, vitrocerámica, televisión, luces
                consumo = round(random.uniform(1.20, 2.80), 3)
            else:
                # Resto del día: consumo moderado
                consumo = round(random.uniform(0.40, 0.85), 3)
            
            # Escribimos la fila con el formato adecuado
            escritor.writerow([
                fecha_actual.strftime("%Y-%m-%d"), 
                f"{hora:02d}:00", 
                consumo
            ])
            
            # Avanzamos una hora para la siguiente fila
            fecha_actual += timedelta(hours=1)

    print(f"🎉 ¡Hecho! Archivo '{nombre_archivo}' creado correctamente con un año de datos.")

if __name__ == "__main__":
    generar_csv_consumo()