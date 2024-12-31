import csv
from flask import Flask, jsonify, request
from flask_mysqldb import MySQL
from flask_cors import CORS
import config
import logging
from datetime import datetime
import os
from werkzeug.utils import secure_filename
import pandas as pd
from statistics import mode

app = Flask(__name__)
CORS(app)

# Configuración de la base de datos
app.config['MYSQL_HOST'] = config.MYSQL_HOST
app.config['MYSQL_USER'] = config.MYSQL_USER
app.config['MYSQL_PASSWORD'] = config.MYSQL_PASSWORD
app.config['MYSQL_DB'] = config.MYSQL_DB

mysql = MySQL(app)
logging.basicConfig(level=logging.INFO)

# Configuración de la carpeta de subida de archivos
UPLOAD_FOLDER = 'Fase3/Backend/uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Crear la carpeta de subida de archivos si no existe
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# función para cargar los datos del CSV
def load_data(file_path):
    """Carga los datos del CSV"""
    return pd.read_csv(file_path, parse_dates=['Fecha y Hora'])

# función para calcular las estadísticas
def calculate_statistics(df):
    """Calcula todas las estadísticas requeridas"""
    stats = {}
    
    # Calcular medias
    stats['promedios'] = {
        'temp_externa': df['Temperatura Externa'].mean(),
        'temp_interna': df['Temperatura Interna'].mean(),
        'humedad': df['Humedad Relativa'].mean(),
        'nivel_agua': df['Nivel de Agua en el Tanque'].mean()
    }
    
    # Calcular modas
    stats['modas'] = {
        'temp_externa': mode(df['Temperatura Externa']),
        'temp_interna': mode(df['Temperatura Interna']),
        'humedad': mode(df['Humedad Relativa']),
        'nivel_agua': mode(df['Nivel de Agua en el Tanque'])
    }
    
    # Calcular mínimos y máximos
    stats['min_max'] = {
        'temp_externa': (df['Temperatura Externa'].min(), df['Temperatura Externa'].max()),
        'temp_interna': (df['Temperatura Interna'].min(), df['Temperatura Interna'].max()),
        'humedad': (df['Humedad Relativa'].min(), df['Humedad Relativa'].max()),
        'nivel_agua': (df['Nivel de Agua en el Tanque'].min(), df['Nivel de Agua en el Tanque'].max())
    }
    
    # Calcular rangos de temperatura
    stats['rangos'] = {
        'diferencia_minimas': df['Temperatura Interna'].min() - df['Temperatura Externa'].min(),
        'diferencia_maximas': df['Temperatura Interna'].max() - df['Temperatura Externa'].max()
    }
    
    return stats

# función para parsear el archivo TXT
def parse_txt(file_path):
    """Parses the TXT file and returns the statistics"""
    stats = {}
    with open(file_path, 'r') as file:
        for line in file:
            key, value = line.strip().split(':')
            stats[key] = float(value)
    return stats

# Endpoint para cargar un archivo TXT
@app.route('/api/analyze-txt', methods=['POST'])
def analyze_txt():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file part'}), 400
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400
        if file:
            filename = secure_filename(file.filename)
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(file_path)
            
            # Cargar y analizar el archivo TXT
            stats = parse_txt(file_path)
            
            return jsonify(stats), 200
    except Exception as e:
        logging.error(f"Error analyzing TXT: {e}")
        return jsonify({'error': 'Error analyzing TXT'}), 500

# Endpoint para cargar un archivo CSV
@app.route('/api/analyze-csv', methods=['POST'])
def analyze_csv():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file part'}), 400
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400
        if file:
            filename = secure_filename(file.filename)
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(file_path)
            
            # Cargar y analizar el archivo CSV
            df = load_data(file_path)
            stats = calculate_statistics(df)
            
            return jsonify(stats), 200
    except Exception as e:
        logging.error(f"Error analyzing CSV: {e}")
        return jsonify({'error': 'Error analyzing CSV'}), 500

@app.route('/api/data', methods=['GET'])
def get_data():
    try:
        cur = mysql.connection.cursor()
        
        # Obtener todos los registros de cada columna, asegurándose de que no sean nulos
        cur.execute("SELECT timestamp, indoorTemperature FROM sensor_data WHERE indoorTemperature IS NOT NULL ORDER BY timestamp")
        indoor_temp_data = cur.fetchall()

        cur.execute("SELECT timestamp, outdoorTemperature FROM sensor_data WHERE outdoorTemperature IS NOT NULL ORDER BY timestamp")
        outdoor_temp_data = cur.fetchall()

        cur.execute("SELECT timestamp, humidity FROM sensor_data WHERE humidity IS NOT NULL ORDER BY timestamp")
        humidity_data = cur.fetchall()

        cur.close()

        # Combinar los datos
        data = []
        for i in range(max(len(indoor_temp_data), len(outdoor_temp_data), len(humidity_data))):
            row = {}
            if i < len(indoor_temp_data):
                row['timestamp'] = indoor_temp_data[i][0].strftime('%Y-%m-%d %H:%M:%S')
                row['indoorTemperature'] = indoor_temp_data[i][1]
            if i < len(outdoor_temp_data):
                row['timestamp'] = outdoor_temp_data[i][0].strftime('%Y-%m-%d %H:%M:%S')
                row['outdoorTemperature'] = outdoor_temp_data[i][1]
            if i < len(humidity_data):
                row['timestamp'] = humidity_data[i][0].strftime('%Y-%m-%d %H:%M:%S')
                row['humidity'] = humidity_data[i][1]
            data.append(row)

        return jsonify(data)
    except Exception as e:
        logging.error(f"Error al obtener datos: {e}")
        return jsonify({'error': 'Error al obtener datos'}), 500

@app.route('/api/level-data', methods=['GET'])
def get_level_data():
    try:
        cur = mysql.connection.cursor()
        
        # Obtener todos los registros de la columna waterTankLevel, asegurándose de que no sean nulos
        cur.execute("SELECT timestamp, waterTankLevel FROM level_data WHERE waterTankLevel IS NOT NULL ORDER BY timestamp")
        water_level_data = cur.fetchall()

        cur.close()

        # Combinar los datos
        data = []
        for row in water_level_data:
            data.append({
                'timestamp': row[0].strftime('%Y-%m-%d %H:%M:%S'),
                'waterTankLevel': row[1],
            })

        return jsonify(data)
    except Exception as e:
        logging.error(f"Error al obtener datos de level_data: {e}")
        return jsonify({'error': 'Error al obtener datos de level_data'}), 500


# Generar CSV
@app.route('/api/generate-csv', methods=['GET'])
def generate_csv():
    try:
        cur = mysql.connection.cursor()

        # Obtener los últimos 5 registros de cada columna, asegurándose de que no sean nulos
        cur.execute("SELECT timestamp, indoorTemperature FROM sensor_data WHERE indoorTemperature IS NOT NULL ORDER BY timestamp DESC LIMIT 5")
        indoor_temp_data = cur.fetchall()

        cur.execute("SELECT timestamp, outdoorTemperature FROM sensor_data WHERE outdoorTemperature IS NOT NULL ORDER BY timestamp DESC LIMIT 5")
        outdoor_temp_data = cur.fetchall()

        cur.execute("SELECT timestamp, humidity FROM sensor_data WHERE humidity IS NOT NULL ORDER BY timestamp DESC LIMIT 5")
        humidity_data = cur.fetchall()

        cur.execute("SELECT timestamp, waterTankLevel FROM level_data WHERE waterTankLevel IS NOT NULL ORDER BY timestamp DESC LIMIT 5")
        water_level_data = cur.fetchall()

        cur.close()

        # Combinar los datos
        combined_data = []
        for i in range(max(len(indoor_temp_data), len(outdoor_temp_data), len(humidity_data), len(water_level_data))):
            row = {}
            if i < len(indoor_temp_data):
                row['timestamp'] = indoor_temp_data[i][0].strftime('%Y-%m-%d %H:%M:%S')
                row['indoorTemperature'] = indoor_temp_data[i][1]
            if i < len(outdoor_temp_data):
                row['timestamp'] = outdoor_temp_data[i][0].strftime('%Y-%m-%d %H:%M:%S')
                row['outdoorTemperature'] = outdoor_temp_data[i][1]
            if i < len(humidity_data):
                row['timestamp'] = humidity_data[i][0].strftime('%Y-%m-%d %H:%M:%S')
                row['humidity'] = humidity_data[i][1]
            if i < len(water_level_data):
                row['timestamp'] = water_level_data[i][0].strftime('%Y-%m-%d %H:%M:%S')
                row['waterTankLevel'] = water_level_data[i][1]
            combined_data.append(row)

        # Crear el archivo CSV en la misma carpeta que app.py
        file_path = os.path.join(os.path.dirname(__file__), 'data.csv')
        with open(file_path, mode='w', newline='', encoding='utf-8') as file:
            writer = csv.DictWriter(file, fieldnames=['Fecha y Hora', 'Temperatura Externa', 'Temperatura Interna', 'Humedad Relativa', 'Nivel de Agua en el Tanque'], delimiter=',')
            writer.writeheader()
            for row in combined_data:
                writer.writerow({
                    'Fecha y Hora': row.get('timestamp', ''),
                    'Temperatura Externa': row.get('outdoorTemperature', ''),
                    'Temperatura Interna': row.get('indoorTemperature', ''),
                    'Humedad Relativa': row.get('humidity', ''),
                    'Nivel de Agua en el Tanque': row.get('waterTankLevel', '')
                })

        return jsonify({'message': 'CSV generado exitosamente en la carpeta Backend'}), 200

    except Exception as e:
        logging.error(f"Error generating CSV: {e}")
        return jsonify({'error': 'Error generating CSV'}), 500


#
@app.route('/api/data-range-sensor', methods=['POST'])
def get_data_range_sensor():
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
            return jsonify({"error": "Formato inválido. Use el formato (YYYY-MM-DDTHH:MM)."}), 400

        if start > end:
            return jsonify({"error": "start debe ir antes que end"}), 400

        cur = mysql.connection.cursor()
        cur.execute("""
            SELECT timestamp, indoorTemperature, outdoorTemperature, humidity, 
                   airActivation
            FROM sensor_data 
            WHERE timestamp BETWEEN %s AND %s
            ORDER BY timestamp
        """, (start, end))
        rows = cur.fetchall()
        cur.close()
        
        if not rows:
            return jsonify({"message": "No existen datos en ese rango. Intente nuevamente."}), 404

        data = []
        for row in rows:
            data.append({
                'timestamp': row[0].isoformat(),
                'indoorTemperature': row[1],
                'outdoorTemperature': row[2],
                'humidity': row[3],
                'airActivation': row[4]
            })

        return jsonify(data)

    except Exception as e:
        logging.error(f"Error retrieving sensor data range: {e}")
        return jsonify({'error': 'Error processing request'}), 500

@app.route('/api/data-range-bomb', methods=['POST'])
def get_data_range_bomb():
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
            return jsonify({"error": "Formato inválido. Use el formato (YYYY-MM-DDTHH:MM)."}), 400

        if start > end:
            return jsonify({"error": "start debe ir antes que end"}), 400

        cur = mysql.connection.cursor()
        cur.execute("""
            SELECT timestamp, bomb 
            FROM bombActivation 
            WHERE timestamp BETWEEN %s AND %s
            ORDER BY timestamp
        """, (start, end))
        rows = cur.fetchall()
        cur.close()

        if not rows:
            return jsonify({"message": "No existen datos en ese rango. Intente nuevamente."}), 404

        data = []
        for row in rows:
            data.append({
                'timestamp': row[0].isoformat(),
                'bombActivation': row[1]
            })

        return jsonify(data)

    except Exception as e:
        logging.error(f"Error retrieving bomb activation data range: {e}")
        return jsonify({'error': 'Error processing request'}), 500

@app.route('/api/data-range-level', methods=['POST'])
def get_data_range_level():
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
            return jsonify({"error": "Formato inválido. Use el formato (YYYY-MM-DDTHH:MM)."}), 400

        if start > end:
            return jsonify({"error": "start debe ir antes que end"}), 400

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

        data = []
        for row in rows:
            data.append({
                'timestamp': row[0].isoformat(),
                'waterTankLevel': row[1]
            })

        return jsonify(data)

    except Exception as e:
        logging.error(f"Error retrieving level data range: {e}")
        return jsonify({'error': 'Error processing request'}), 500

if __name__ == '__main__':
    app.run(debug=True)