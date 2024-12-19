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

        #  Obteniendo datos de sensores
        cur = mysql.connection.cursor()
        cur.execute("""
            SELECT timestamp, indoorTemperature, outdoorTemperature, humidity 
            FROM sensor_data 
            WHERE timestamp BETWEEN %s AND %s
            ORDER BY timestamp
        """, (start, end))
        sensor_rows = cur.fetchall()

        # Obteniendo datos de nivel de agua
        cur.execute("""
            SELECT timestamp, waterTankLevel 
            FROM level_data 
            WHERE timestamp BETWEEN %s AND %s
            ORDER BY timestamp
        """, (start, end))
        level_rows = cur.fetchall()
        cur.close()

        if not sensor_rows and not level_rows:
            return jsonify({"message": "No existen datos en ese rango. Intente nuevamente."}), 404

        data = []
        timestamps = set()

        # Procesando datos de sensores, con el nivel de agua en null.
        for row in sensor_rows:
            timestamps.add(row[0])
            data.append({
                'timestamp': row[0].isoformat(),
                'indoorTemperature': row[1],
                'outdoorTemperature': row[2],
                'humidity': row[3],
                'waterTankLevel': None
            })

        # Procesando datos de nivel de agua
        for row in level_rows:
            timestamp = row[0]
            # Si el timestamp ya existe en los datos de sensores, se actualiza el nivel de agua.
            if timestamp in timestamps:
                for entry in data:
                    if entry['timestamp'] == timestamp.isoformat():
                        entry['waterTankLevel'] = row[1]
                        break
            # Si no existe, se agrega un nuevo registro con el nivel de agua con los demas valores en null.
            else:
                data.append({
                    'timestamp': timestamp.isoformat(),
                    'indoorTemperature': None,
                    'outdoorTemperature': None,
                    'humidity': None,
                    'waterTankLevel': row[1]
                })
        #logging.info(f"Data: {data}")
        return jsonify(sorted(data, key=lambda x: x['timestamp']))

    except Exception as e:
        logging.error(f"Error retrieving data range: {e}")
        return jsonify({'error': 'Error processing request'}), 500

if __name__ == '__main__':
    app.run(debug=True)