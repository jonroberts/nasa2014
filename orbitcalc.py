import json
import math
from flask import Flask,request,jsonify
import gzip
##
#Globals
asteroids = []
app = Flask(__name__)

##
def AsteroidPositionVector(ast,jed):
    return KeplerToHeliocentric(jed,ast['i'],ast['om'],ast['w'],ast['ma'],ast['n'],ast['epoch'],ast['e'],ast['a'])
    
def KeplerToHeliocentric(jed,i,om,w,ma,n,epoch,e,a):
    """
    Given kepler dynamics and date, calculates the X, Y, and Z in Heliocentric coordinates, unit of AU.
    i: inclination
    om: longitude/right ascention of ascending node ("om" in json)
    w: perigee of ascending node
    ma: mean anomaly
    n: ???
    jed: Current julian day, float
    epoch: date of observation??
    e: eccentricity
    a: Semi-major axis
    """

    pi = math.pi
    
    i_rad = (i) * pi/180.0#
    o_rad = (om) * pi/180.0# // longitude of ascending node
    p_rad = (w) * pi/180.0# // LONGITUDE of perihelion
    ma_rad = ma * pi/180.0
    n_rad=0.0
#    if P > 0.:
#        n_rad = 2.0 * pi / P
#    else:
    n_rad = n * pi/180.0# // mean motion
    

    d = jed - epoch
    M = ma_rad + n_rad * d

    E0 = M
    E1 = M + e * math.sin(E0)
    lastdiff = abs(E1-E0)
    E0 = E1
    for ii in range(25):
        E1 = M + e * math.sin(E0)
        lastdiff = abs(E1-E0)
        E0 = E1
        if lastdiff > 0.0000001:
            break
            
    E = E0

    v = 2.0 * math.atan(math.sqrt((1.0+e)/(1.0-e)) * math.tan(E/2.0))

    #// radius vector, in AU
    r = a * (1.0 - e*e) / (1.0 + e * math.cos(v))

    #// heliocentric coords
    X = r * (math.cos(o_rad) * math.cos(v + p_rad - o_rad) - math.sin(o_rad) * math.sin(v + p_rad - o_rad) * math.cos(i_rad))
    Y = r * (math.sin(o_rad) * math.cos(v + p_rad - o_rad) + math.cos(o_rad) * math.sin(v + p_rad - o_rad) * math.cos(i_rad))
    Z = r * (math.sin(v + p_rad - o_rad) * math.sin(i_rad))
    return [X, Y, Z]
##

@app.route('/find_by_height')
def FindByHeight():
    min_height = float(request.args.get('min_height'))
    max_height = float(request.args.get('max_height'))
    start_day = float(request.args.get('start_day'))
    end_day = float(request.args.get('end_day'))
    steps = int(request.args.get('steps'))
    
    diff = end_day - start_day
    step_size = diff/steps
    
    found_ids = []
    found_asteroids = []
    for d in range(steps):
        cur_day = start_day + d*step_size
        for ast in asteroids:
            if ast['full_name'] in found_ids:
                continue
                
            p = AsteroidPositionVector(ast,cur_day)
            dist = math.sqrt( sum( [ i*i for i in p ] ) )
            dist = dist - 1.0
            if dist < max_height and dist > min_height:
                ast['earth_distance']=dist
                found_asteroids.append(ast)
                found_ids.append(ast['full_name'])
    
    
    return jsonify(results=found_asteroids)


files = ['asteroids1.json.gz','asteroids2.json.gz','asteroids3.json.gz']
#files=['asteroids.json.gz']
f = []
for name in files:
    f.append( gzip.open(name) )

asteroids = []
for fi in f:
    for line in fi:
        cur_json = json.loads(line)
        if 'e' in cur_json:
            asteroids.append(cur_json)


app.run(host="0.0.0.0",port=8100)
