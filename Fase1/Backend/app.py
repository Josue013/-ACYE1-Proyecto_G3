from flask import Flask, jsonify
from flask_mysqldb import MySQL
from flask_cors import CORS
import config
import logging

app = Flask(__name__)
CORS(app)  # Habilitar CORS para todas las rutas

# Configuración de la base de datos
app.config['MYSQL_HOST'] = config.MYSQL_HOST
app.config['MYSQL_USER'] = config.MYSQL_USER
app.config['MYSQL_PASSWORD'] = config.MYSQL_PASSWORD
app.config['MYSQL_DB'] = config.MYSQL_DB

mysql = MySQL(app)

# Configuración de logging
logging.basicConfig(level=logging.INFO)

# Endpoint para obtener datos
@app.route('/api/data', methods=['GET'])
def get_data():
    try:
        cur = mysql.connection.cursor()
        cur.execute("SELECT * FROM sensor_data")
        rows = cur.fetchall()
        cur.close()

        logging.info(f"Datos obtenidos de la base de datos: {rows}")

        data = []
        for row in rows:
            data.append({
                'timestamp': row[1],
                'temperature': row[2],
                'humidityRelative': row[3],
                'humidityAbsolute': row[4],
                'windSpeed': row[5],
                'barometricPressure': row[6]
            })

        logging.info(f"Datos formateados: {data}")

        return jsonify(data)
    except Exception as e:
        logging.error(f"Error al obtener datos: {e}")
        return jsonify({'error': 'Error al obtener datos'}), 500

if __name__ == '__main__':
    app.run(debug=True)