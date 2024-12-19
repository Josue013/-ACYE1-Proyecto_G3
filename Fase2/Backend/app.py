from flask import Flask, jsonify, request
from flask_mysqldb import MySQL
from flask_cors import CORS
import config
import logging
from datetime import datetime

app = Flask(__name__)
CORS(app)

app.config['MYSQL_HOST'] = config.MYSQL_HOST
app.config['MYSQL_USER'] = config.MYSQL_USER
app.config['MYSQL_PASSWORD'] = config.MYSQL_PASSWORD
app.config['MYSQL_DB'] = config.MYSQL_DB

mysql = MySQL(app)
logging.basicConfig(level=logging.INFO)

@app.route('/api/data', methods=['GET'])
def get_data():
    try:
        cur = mysql.connection.cursor()
        cur.execute("SELECT * FROM sensor_data")
        rows = cur.fetchall()
        cur.close()

        data = []
        for row in rows:
            data.append({
                'timestamp': row[1],
                'indoorTemperature': row[2],
                'outdoorTemperature': row[3],
                'humidity': row[4],
            })

        return jsonify(data)
    except Exception as e:
        logging.error(f"Error al obtener datos: {e}")
        return jsonify({'error': 'Error al obtener datos'}), 500

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

# Rutas para obtener datos en un rango de fechas
@app.route('/api/data-range-sensor', methods=['POST'])
def get_data_range_sensor():
    try:
        data = request.json
        start_date = data.get("start_date")
        end_date = data.get("end_date")

        if not start_date or not end_date:
            return jsonify({"error": "Start y end son requeridos"}), 400
    # Se verifica que las fechas tengan el formato correcto
        try:
            start = datetime.fromisoformat(start_date.replace('Z', '+00:00'))
            end = datetime.fromisoformat(end_date.replace('Z', '+00:00'))
        except ValueError:
            return jsonify({"error": "Formato invalido. Use el formato (YYYY-MM-DDTHH:MM)."}), 400

        if start > end:
            return jsonify({"error": "start debe ir antes que end"}), 400

        cur = mysql.connection.cursor()
        cur.execute("""
            SELECT timestamp, indoorTemperature, outdoorTemperature, humidity, 
                   bombActivation, airActivation
            FROM sensor_data 
            WHERE timestamp BETWEEN %s AND %s
            ORDER BY timestamp
        """, (start, end))
        rows = cur.fetchall()
        cur.close()
        
        if not rows:
            return jsonify({"message": "No existen datos en ese rango. Intente nuevamente."}), 404
# Se crea un diccionario con los datos obtenidos
        data = []
        for row in rows:
            data.append({
                'timestamp': row[0].isoformat(),
                'indoorTemperature': row[1],
                'outdoorTemperature': row[2],
                'humidity': row[3],
                'bombActivation': row[4],
                'airActivation': row[5]
            })
# Se retorna el diccionario en formato JSON
        return jsonify(data)

    except Exception as e:
        logging.error(f"Error retrieving sensor data range: {e}")
        return jsonify({'error': 'Error processing request'}), 500

# Rutas para obtener datos en un rango de fechas
@app.route('/api/data-range-level', methods=['POST'])
def get_data_range_level():
    try:
        # Se obtienen los datos enviados en el request
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
    # Se realiza la consulta a la base de datos
        cur = mysql.connection.cursor()
        cur.execute("""
            SELECT timestamp, waterTankLevel 
            FROM level_data 
            WHERE timestamp BETWEEN %s AND %s
            ORDER BY timestamp
        """, (start, end))
        rows = cur.fetchall()
        cur.close()

        if not rows:
            return jsonify({"message": "No existen datos en ese rango. Intente nuevamente."}), 404
    #Se crea un diccionario con los datos obtenidos
        data = []
        for row in rows:
            data.append({
                'timestamp': row[0].isoformat(),
                'waterTankLevel': row[1]
            })
# Se retorna el diccionario en formato JSON
        return jsonify(data)

    except Exception as e:
        logging.error(f"Error retrieving level data range: {e}")
        return jsonify({'error': 'Error processing request'}), 500

if __name__ == '__main__':
    app.run(debug=True)