from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd

app = FastAPI(title="Auditor Energético API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# FUNCIÓN AUXILIAR: Clasifica cada hora en su tramo y le asigna un precio estimado
def calcular_tramo_y_precio(fila):
    # Extraemos la hora como un número entero (ej: "14:00" -> 14)
    hora = int(fila["Hora"].split(":")[0])
    
    # Para hacerlo perfecto, convertimos la fecha para saber el día de la semana
    # 5 y 6 significan Sábado y Domingo en Python
    dia_semana = pd.to_datetime(fila["Fecha"]).weekday()
    
    # Fines de semana enteros son siempre tramo VALLE
    if dia_semana >= 5:
        return "VALLE", 0.10  # 0.10€ el kWh en Valle
        
    # Lógica de días de diario (Lunes a Viernes)
    if 0 <= hora < 8:
        return "VALLE", 0.10
    elif (10 <= hora < 14) or (18 <= hora < 22):
        return "PUNTA", 0.28  # 0.28€ el kWh en Punta (¡caro!)
    else:
        return "LLANO", 0.18  # 0.18€ el kWh en Llano
        

@app.get("/")
def inicio():
    return {"mensaje": "El backend del Auditor Energético está funcionando correctamente"}


@app.post("/api/v1/auditar")
async def auditar_consumo(file: UploadFile = File(...)):
    df = pd.read_csv(file.file)
    
    # 1. Aplicamos la lógica de tramos hora por hora usando la magia de Pandas
    # Creamos dos columnas nuevas basadas en nuestra función auxiliar
    resultados_tramo = df.apply(calcular_tramo_y_precio, axis=1)
    df["Tramo"] = [r[0] for r in resultados_tramo]
    df["Precio_kWh"] = [r[1] for r in resultados_tramo]
    
    # 2. Calculamos el coste de cada hora (Consumo * Precio)
    df["Coste_Euros"] = df["Consumo_kWh"] * df["Precio_kWh"]
    
    # 3. MÉTRICAS GLOBALES
    consumo_total = float(df["Consumo_kWh"].sum())
    gasto_total = float(df["Coste_Euros"].sum())
    
    # 4. ANÁLISIS POR TRAMOS (Agrupamos los datos con Pandas)
    consumo_por_tramo = df.groupby("Tramo")["Consumo_kWh"].sum().to_dict()
    gasto_por_tramo = df.groupby("Tramo")["Coste_Euros"].sum().to_dict()
    
    # 5. RETORNAMOS EL JSON COMPLETO E INTELIGENTE
    return {
        "status": "Procesado correctamente",
        "archivo": file.filename,
        "totales": {
            "consumo_anual_kwh": round(consumo_total, 2),
            "gasto_anual_euros": round(gasto_total, 2),
            "precio_medio_kwh": round(gasto_total / consumo_total, 4) if consumo_total > 0 else 0
        },
        "distribucion_consumo_kwh": {tramo: round(val, 2) for tramo, val in consumo_por_tramo.items()},
        "distribucion_gasto_euros": {tramo: round(val, 2) for tramo, val in gasto_por_tramo.items()}
    }