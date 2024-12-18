from flask import Flask, jsonify, request
from flask_mysqldb import MySQL
from flask_cors import CORS
import config
import logging
from datetime import datetime

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

        #logging.info(f"Datos obtenidos de la base de datos: {rows}")

        data = []
        for row in rows:
            data.append({
                'timestamp': row[1],
                'indoorTemperature': row[2],
                'outdoorTemperature': row[3],
                'humidity': row[4],
            })

        #logging.info(f"Datos formateados: {data}")

        return jsonify(data)
    except Exception as e:
        logging.error(f"Error al obtener datos: {e}")
        return jsonify({'error': 'Error al obtener datos'}), 500


# Endpoint para obtener datos del nivel del agua
@app.route('/api/level-data', methods=['GET'])
def get_level_data():
    try:
        cur = mysql.connection.cursor()
        cur.execute("SELECT * FROM level_data")
        rows = cur.fetchall()
        cur.close()

        data = []
        for row in rows:
            data.append({
                'timestamp': row[1],
                'waterTankLevel': row[2],
            })

        return jsonify(data)
    except Exception as e:
        logging.error(f"Error al obtener datos de level_data: {e}")
        return jsonify({'error': 'Error al obtener datos de level_data'}), 500


# Endpoint para obtener datos en un rango de fechas
@app.route('/api/data-range', methods=['POST'])
def get_data_range():
    try:
        data = request.json
        start_date = data.get("start_date")
        end_date = data.get("end_date")
        

        if not start_date or not end_date:
            return jsonify({"error": "Start y end son requeridos"}), 400
        

        try:
            start = datetime.fromisoformat(start_date.replace('Z', '+00:00'))
            end = datetime.fromisoformat(end_date.replace('Z', '+00:00'))
        except ValueError:
            return jsonify({"error": "Formato invalido. Use el formato (YYYY-MM-DDTHH:MM)."}), 400
        

        if start > end:
            return jsonify({"error": "start debe ir antes que end"}), 400
        
        cur = mysql.connection.cursor()
        cur.execute("""
            SELECT * FROM sensor_data 
            WHERE timestamp BETWEEN %s AND %s
            ORDER BY timestamp
        """, (start, end))
        rows = cur.fetchall()
        cur.close()
        
        #imprimiendo la fecha de inicio y fin
        logging.info(f"Fecha de inicio: {start} y fecha de fin: {end}\n")
        #imprimir los datos
        logging.info(f"Datos obtenidos de la base de datos de rows: {rows}\n")
        

        if not rows:
            return jsonify({"message": "No existen datos en ese rango. Intente nuevamente."}), 404
        
 
        data = []
        for row in rows:
            data.append({
                'id': row[0],
                'timestamp': row[1].isoformat(),
                'temperature': row[2],
                'humidityRelative': row[3],
                'humidityAbsolute': row[4],
                'windSpeed': row[5],
                'barometricPressure': row[6]
            })
        logging.info(f"Datos formateados en data: {data}")    
        return jsonify(data)
    
    except Exception as e:
        logging.error(f"Error retrieving data range: {e}")
        return jsonify({'error': 'Error processing request'}), 500
    
if __name__ == '__main__':
    app.run(debug=True)