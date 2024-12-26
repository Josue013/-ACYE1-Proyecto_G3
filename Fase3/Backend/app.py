from flask import Flask, request, jsonify
import logging
import random


app = Flask(__name__)
logging.basicConfig(level=logging.DEBUG)
#Sistema de riego
#encender o apagar el sistema de riego
@app.route('/sis-riego-on-off', methods=['POST'])
def sis_riego_on_off():
    #data = request.get_json()
    data = request.form.get("data")
    logging.info(data)
    respuesta = ""
    if data == "on":
        respuesta = "Encendido"
    elif data == "off":
        respuesta = "Apagado"
    else:
        respuesta = "Error"
    logging.info(respuesta)
    return jsonify({"respuesta": respuesta})
#Tiempo de riego
@app.route('/tiempo-riego', methods=['POST'])
def tiempo_riego():
    data = request.form.get("data")
    logging.info(data)
    respuesta = ""
    if data == "5":
        respuesta = "5 segundos"
    elif data == "10":
        respuesta = "10 segundos"
    elif data == "15":
        respuesta = "15 segundos"
    elif data == "20":
        respuesta = "20 segundos"
    else:
        respuesta = "Error"
    logging.info(respuesta)
    return jsonify({"respuesta": respuesta})
        
        
#humedad de la tierra
@app.route('/humedad-tierra', methods=['GET'])
def humedad_tierra():
    humedad = random.randint(0, 100)
    logging.info(humedad)
    return jsonify({"humidity": humedad})    

#Aire acondicionado
#encender o apagar el aire acondicionado
@app.route('/aire-acondicionado-on-off', methods=['POST'])
def aire_acondicionado_on_off():
    data = request.form.get("data")
    logging.info(data)
    respuesta = ""
    if data == "on":
        respuesta = "Encendido"
    elif data == "off":
        respuesta = "Apagado"
    else:
        respuesta = "Error"
    logging.info(respuesta)
    return jsonify({"respuesta": respuesta})

#nivel de agua del tanque en %
@app.route('/nivel-agua-tanque', methods=['GET'])
def nivel_agua_tanque():
    nivel = random.randint(0, 100)
    logging.info(nivel)
    nivel = str(nivel) + "%"
    return jsonify({"waterTankLevel": nivel})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)