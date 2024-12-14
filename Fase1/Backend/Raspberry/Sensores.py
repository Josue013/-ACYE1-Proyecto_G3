import adafruit_dht
import board
import busio
import adafruit_bmp280
import time
import mysql.connector


# Configuracion del sensor DHT11
SENSOR = adafruit_dht.DHT11(board.D24)

# Configuracion del sensor BMP280
i2c = busio.I2C(board.SCL, board.SDA)
sensor_bmp280 = adafruit_bmp280.Adafruit_BMP280_I2C(i2c, address=0x76)
sensor_bmp280.sea_level_pressure = 1013.25 + (1.691 * 12)  # Ajuste basado en la altura del nivel del mar en metros

# Configuracion de la base de datos MySQL
conn = mysql.connector.connect(
    host= '34.86.159.88',
    user= 'root',
    password= '0`zm%i^xZp82{%0j',
    database= 'fase1'
)
cursor = conn.cursor()

# Crear tabla para los datos si no existe
cursor.execute('''
CREATE TABLE IF NOT EXISTS sensor_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    timestamp DATETIME NOT NULL,
    temperature FLOAT,
    humidityRelative FLOAT,
    humidityAbsolute FLOAT,
    windSpeed FLOAT,
    barometricPressure FLOAT
)
''')
conn.commit()  # Aplicar los cambios

def calcular_humedad_absoluta(humedad_relativa, temperatura):
    if humedad_relativa is not None and temperatura is not None:
        humedad_relativa /= 100  # Convertir a decimal
        presion_saturacion = 6.112 * (2.71828 ** ((17.67 * temperatura) / (temperatura + 243.5)))
        presion_vapor = (humedad_relativa / 100) * presion_saturacion
        humedad_absoluta = (presion_vapor * 100) / 461.5 * (temperatura + 273.15)
        return round(humedad_absoluta, 2)
    return None

try:
    while True:
        try:
            temperatura_dht11 = SENSOR.temperature
            humedad_dht11 = SENSOR.humidity
            
            if humedad_dht11 is not None and temperatura_dht11 is not None:
                humedad_absoluta = calcular_humedad_absoluta(humedad_dht11, temperatura_dht11)
                print(f"Temperatura DHT11: {temperatura_dht11:.1f} C")
                print(f"Humedad Relativa: {humedad_dht11:.1f}%")
                if humedad_absoluta is not None:
                    print(f"Humedad Absoluta: {humedad_absoluta} g/m3")
            else:
                print("Error al leer el sensor DHT11")
        except RuntimeError as e:
            print(f"Error en la lectura DHT11: {e}. Intentando de nuevo...")
            time.sleep(2)  # Esperar un poco antes de intentar nuevamente

        temperatura_bmp280 = round(sensor_bmp280.temperature, 2)
        presion_bmp280 = round(sensor_bmp280.pressure, 2)

        print(f"Temperatura BMP280: {temperatura_bmp280} C")
        print(f"Presion: {presion_bmp280} hPa")

        timestamp = time.strftime("%Y-%m-%d %H:%M:%S")  # Formato de fecha y hora

        cursor.execute('''
            INSERT INTO sensor_data (timestamp, temperature, humidityRelative, humidityAbsolute, windSpeed, barometricPressure)
            VALUES (%s, %s, %s, %s, %s, %s)
        ''', (timestamp, temperatura_dht11, humedad_dht11, humedad_absoluta, None, presion_bmp280))
        conn.commit()  # Aplicar los cambios

        time.sleep(10)  # Esperar 10 segundos antes de la siguiente lectura

except KeyboardInterrupt:
    print("Programa detenido por el usuario")
finally:
    SENSOR.exit()
    cursor.close()
    conn.close()  # Cerrar la conexion a la base de datos
