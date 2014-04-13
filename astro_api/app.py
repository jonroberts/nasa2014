from flask import Flask,request,jsonify
import orbitcalc as oc

app = Flask(__name__)

@app.route('/get_asteroids')
def GetAsteroids():
    limit = int(request.args.get('limit'))
    day = float(request.args.get('day'))
    return jsonify(results=oc.GetClosestAsteroids(limit,day))


app.run(host="0.0.0.0",port=8100)
