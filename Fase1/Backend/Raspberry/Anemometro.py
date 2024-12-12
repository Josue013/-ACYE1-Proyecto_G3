import RPi.GPIO as GPIO
import time
import mysql.connector
import config

TRIG = 6
ECHO = 5

GPIO.setmode(GPIO.BCM)
GPIO.setup(TRIG, GPIO.OUT)
GPIO.setup(ECHO, GPIO.IN)

DISTANCIA_UMBRAL = 15  # cm
INTERVALO_CUENTA = 2    
RADIO_MOLINO = 14      

contador_pasadas = 0
ultimo_estado = False
tiempo_inicio = time.time()

pulso_inicio = 0
pulso_fin = 0
distancia = 0

# Configuracion de la base de datos MySQL
conn = mysql.connector.connect(
    host=config.MYSQL_HOST,
    user=config.MYSQL_USER,
    password=config.MYSQL_PASSWORD,
    database=config.MYSQL_DB
)
cursor = conn.cursor()

def medida_distancia():
    global pulso_inicio, pulso_fin, distancia, ultimo_estado, contador_pasadas
    GPIO.output(TRIG, GPIO.LOW)
    time.sleep(0.00001)  

    GPIO.output(TRIG, GPIO.HIGH)
    time.sleep(0.00001)  
    GPIO.output(TRIG, GPIO.LOW)

    while GPIO.input(ECHO) == GPIO.LOW:
        pulso_inicio = time.time()

    while GPIO.input(ECHO) == GPIO.HIGH:
        pulso_fin = time.time()

    duracion = pulso_fin - pulso_inicio
    distancia = (34300 * duracion) / 2  # cm

    if distancia <= DISTANCIA_UMBRAL and not ultimo_estado:
        contador_pasadas += 1
        ultimo_estado = True
    elif distancia > DISTANCIA_UMBRAL and ultimo_estado:
        ultimo_estado = False

def main():
    global contador_pasadas, tiempo_inicio

    try:
        while True:
            medida_distancia()

            tiempo_actual = time.time()
            if tiempo_actual - tiempo_inicio >= INTERVALO_CUENTA:
                rps = contador_pasadas / INTERVALO_CUENTA
                velocidad_lineal_cm_s = 2 * 3.1416 * RADIO_MOLINO * rps 
                velocidad_lineal_m_s = velocidad_lineal_cm_s / 100 

                print(f"Velocidad Lineal del Viento: {velocidad_lineal_m_s:.2f} m/s\n")

                timestamp = time.strftime("%Y-%m-%d %H:%M:%S")  # Formato de fecha y hora

                cursor.execute('''
                    INSERT INTO sensor_data (timestamp, windSpeed)
                    VALUES (%s, %s)
                ''', (timestamp, velocidad_lineal_m_s))
                conn.commit()  # Aplicar los cambios

                contador_pasadas = 0
                tiempo_inicio = tiempo_actual

            time.sleep(0.01)  

    except KeyboardInterrupt:
        print("Programa interrumpido por el usuario.")
    finally:
        GPIO.cleanup()
        cursor.close()
        conn.close()  # Cerrar la conexion a la base de datos

if __name__ == "__main__":
    main()