import adafruit_dht
import board
import busio
import adafruit_bmp280
import time

# Configuracion del sensor DHT11
SENSOR = adafruit_dht.DHT11(board.D24)

# Configuracion del sensor BMP280
i2c = busio.I2C(board.SCL, board.SDA)
sensor_bmp280 = adafruit_bmp280.Adafruit_BMP280_I2C(i2c, address=0x76)
sensor_bmp280.sea_level_pressure = 1013.25 + (1.691 * 12)  # Ajuste basado en la altura del nivel del mar en metros

def calcular_humedad_absoluta(humedad_relativa, temperatura):
    # Formula para calcular la humedad absoluta
    if humedad_relativa is not None and temperatura is not None:
        humedad_relativa /= 100  # Convertir a decimal
        presion_saturacion = 6.112 * (2.71828 ** ((17.67 * temperatura) / (temperatura + 243.5)))
        presion_vapor = (humedad_relativa / 100) * presion_saturacion
        humedad_absoluta = (presion_vapor * 100) / 461.5 * (temperatura + 273.15)
        return round(humedad_absoluta, 2)
    return None

try:
    while True:
        # Intentar leer los datos del sensor DHT11 con reintentos
        try:
            temperatura_dht11 = SENSOR.temperature
            humedad_dht11 = SENSOR.humidity

            # Verificar lectura y calcular humedad absoluta
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

        # Leer los datos del sensor BMP280
        temperatura_bmp280 = round(sensor_bmp280.temperature, 2)
        presion_bmp280 = round(sensor_bmp280.pressure, 2)

        print(f"Temperatura BMP280: {temperatura_bmp280} C")
        print(f"Presion: {presion_bmp280} hPa")
        
        # Esperar 10 segundos antes de la siguiente lectura
        time.sleep(10)
except KeyboardInterrupt:
    print("Programa detenido por el usuario")
finally:
    SENSOR.exit()