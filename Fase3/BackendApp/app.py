from flask import Flask, request, jsonify
import logging
import time
import board
import busio
import adafruit_dht
import adafruit_bmp280
import RPi.GPIO as GPIO
import mysql.connector

# Configuraciones iniciales
SENSOR = adafruit_dht.DHT11(board.D22)
i2c = busio.I2C(board.SCL, board.SDA)
sensor_bmp280 = adafruit_bmp280.Adafruit_BMP280_I2C(i2c, address=0x76)
sensor_bmp280.sea_level_pressure = 1013.25 + (1.691 * 12)

# Configuración de pines
TRIG = 23
ECHO = 24
bomba_pin = 5
FAN_PIN = 17

# Configuración GPIO
GPIO.setmode(GPIO.BCM)
GPIO.setup(TRIG, GPIO.OUT)
GPIO.setup(ECHO, GPIO.IN)
GPIO.setup(bomba_pin, GPIO.OUT)
GPIO.setup(FAN_PIN, GPIO.OUT)

# Configuración MySQL
conn = mysql.connector.connect(
    host='34.86.159.88',
    user='root',
    password='0`zm%i^xZp82{%0j',
    database='fase1'
)
cursor = conn.cursor()

# Variables globales
TURN_ON_THRESHOLD = 35
TURN_OFF_THRESHOLD = 25
ALTURA_RECIPIENTE = 15.0
DISTANCIA_SENSOR = 3.0
fan_on = False
bomb_status = 0
fan_status = 0

# Configuración Flask
app = Flask(__name__)
logging.basicConfig(level=logging.DEBUG)

# Funcion para medir la distancia
def medida_distancia():
    GPIO.output(TRIG, GPIO.LOW)
    time.sleep(0.001)
    GPIO.output(TRIG, GPIO.HIGH)
    time.sleep(0.001)
    GPIO.output(TRIG, GPIO.LOW)

    while GPIO.input(ECHO) == GPIO.LOW:
        pulso_inicio = time.time()
    while GPIO.input(ECHO) == GPIO.HIGH:
        pulso_fin = time.time()

    duracion = pulso_fin - pulso_inicio
    distancia = (34300 * duracion) / 2
    return distancia

# Funcion para calcular el porcentaje de agua
def calcular_porcentaje(distancia_agua):
    altura_agua = ALTURA_RECIPIENTE - (distancia_agua - DISTANCIA_SENSOR)
    if altura_agua < 0:
        altura_agua = 0
    porcentaje = (altura_agua / ALTURA_RECIPIENTE) * 100
    return min(porcentaje, 100)

# Sistema de riego
@app.route('/sis-riego-on-off', methods=['POST'])
def sis_riego_on_off():
    global bomb_status
    data = request.form.get("data")
    logging.info(data)
    respuesta = ""
    if data == "on":
        GPIO.output(bomba_pin, GPIO.HIGH)
        bomb_status = 1
        respuesta = "Encendido"
    elif data == "off":
        GPIO.output(bomba_pin, GPIO.LOW)
        bomb_status = 0
        respuesta = "Apagado"
    else:
        respuesta = "Error"
    logging.info(respuesta)
    timestamp = time.strftime("%Y-%m-%d %H:%M:%S")
    cursor.execute('''
        INSERT INTO bombActivation (timestamp, bomb)
        VALUES (%s, %s)
    ''', (timestamp, bomb_status))
    conn.commit()
    return jsonify({"respuesta": respuesta})

# Tiempo de riego
@app.route('/tiempo-riego', methods=['POST'])
def tiempo_riego():
    data = request.form.get("data")
    logging.info(data)
    respuesta = ""
    try:
        tiempo = int(data)
        if tiempo in [5, 10, 15, 20]:
            respuesta = f"{tiempo} segundos"
            GPIO.output(bomba_pin, GPIO.HIGH)
            time.sleep(tiempo)
            GPIO.output(bomba_pin, GPIO.LOW)
        else:
            respuesta = "Error"
    except ValueError:
        respuesta = "Error"
    logging.info(respuesta)
    return jsonify({"respuesta": respuesta})

# Humedad de la tierra
@app.route('/humedad-tierra', methods=['GET'])
def humedad_tierra():
    try:
        humedad = SENSOR.humidity
        if humedad is not None:
            logging.info(humedad)
            return jsonify({"humidity": round(humedad, 1)})
        else:
            return jsonify({"error": "Error al leer el sensor DHT11"}), 500
    except RuntimeError as e:
        return jsonify({"error": f"Error de lectura del sensor: {str(e)}"}), 500
    except Exception as e:
        return jsonify({"error": f"Error inesperado: {str(e)}"}), 500

# Aire acondicionado
@app.route('/aire-acondicionado-on-off', methods=['POST'])
def aire_acondicionado_on_off():
    global fan_status
    data = request.form.get("data")
    logging.info(data)
    respuesta = ""
    if data == "on":
        GPIO.output(FAN_PIN, GPIO.HIGH)
        fan_status = 1
        respuesta = "Encendido"
    elif data == "off":
        GPIO.output(FAN_PIN, GPIO.LOW)
        fan_status = 0
        respuesta = "Apagado"
    else:
        respuesta = "Error"
    logging.info(respuesta)
    timestamp = time.strftime("%Y-%m-%d %H:%M:%S")
    cursor.execute('''
        INSERT INTO sensor_data (timestamp, airActivation)
        VALUES (%s, %s)
    ''', (timestamp, fan_status))
    conn.commit()
    return jsonify({"respuesta": respuesta})

# Nivel de agua del tanque en %
@app.route('/nivel-agua-tanque', methods=['GET'])
def nivel_agua_tanque():
    try:
        distancia_agua = medida_distancia()
        porcentaje_agua = calcular_porcentaje(distancia_agua)
        logging.info(porcentaje_agua)
        return jsonify({"waterTankLevel": round(porcentaje_agua, 1)})
    except Exception as e:
        return jsonify({"error": f"Error inesperado: {str(e)}"}), 500


if __name__ == '__main__':
    try:
        app.run(host='0.0.0.0', port=5000)
    except KeyboardInterrupt:
        print("Servidor detenido")
    finally:
        GPIO.cleanup()
        cursor.close()
        conn.close()