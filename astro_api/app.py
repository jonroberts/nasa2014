import orbitcalc as oc
from datetime import timedelta  
from flask import Flask, make_response, request, current_app, jsonify
from functools import update_wrapper

def crossdomain(origin=None, methods=None, headers=None, max_age=21600, attach_to_all=True, automatic_options=True):  
    if methods is not None:
        methods = ', '.join(sorted(x.upper() for x in methods))
    if headers is not None and not isinstance(headers, basestring):
        headers = ', '.join(x.upper() for x in headers)
    if not isinstance(origin, basestring):
        origin = ', '.join(origin)
    if isinstance(max_age, timedelta):
        max_age = max_age.total_seconds()

    def get_methods():
        if methods is not None:
            return methods

        options_resp = current_app.make_default_options_response()
        return options_resp.headers['allow']

    def decorator(f):
        def wrapped_function(*args, **kwargs):
            if automatic_options and request.method == 'OPTIONS':
                resp = current_app.make_default_options_response()
            else:
                resp = make_response(f(*args, **kwargs))
            if not attach_to_all and request.method != 'OPTIONS':
                return resp

            h = resp.headers

            h['Access-Control-Allow-Origin'] = origin
            h['Access-Control-Allow-Methods'] = get_methods()
            h['Access-Control-Max-Age'] = str(max_age)
            if headers is not None:
                h['Access-Control-Allow-Headers'] = headers
            return resp

        f.provide_automatic_options = False
        return update_wrapper(wrapped_function, f)
    return decorator



app = Flask(__name__)

@app.route('/get_asteroids')
@crossdomain(origin='*')
def GetAsteroids():
    limit = int(request.args.get('limit'))
    day = float(request.args.get('day'))
    
    return jsonify(results=oc.GetClosestAsteroids(limit,day))


@app.route('/get_random_asteroids')
@crossdomain(origin='*')
def GetRandomAsteroids():
    limit = int(request.args.get('limit'))
    day = float(request.args.get('day'))
    min_dist = float(request.args.get('min_dist'))
    max_dist = float(request.args.get('max_dist'))
    noval_accept_prob = float(request.args.get('noval_accept_prob'))
    
    return jsonify(results=oc.GetRandomAsteroids(limit,day,min_dist=min_dist,max_dist=max_dist,noval_keep_frac=noval_accept_prob))



@app.route('/get_asteroids_by_type')
@crossdomain(origin='*')
def GetAsteroidsByType():
    limit = int(request.args.get('limit'))
    day = float(request.args.get('day'))
    min_dist = float(request.args.get('min_dist'))
    max_dist = float(request.args.get('max_dist'))
    n_p = float(request.args.get('none'))
    w_p = float(request.args.get('water'))
    m_p = float(request.args.get('metals'))
    h_p = float(request.args.get('hydrogen'))
    p_p = float(request.args.get('platinum'))
    
    return jsonify(results=oc.GetAsteroidsByType(limit, day, min_dist=min_dist, max_dist=max_dist, none_frac=n_p, water_frac=w_p, metals_frac=m_p, platinum_frac=p_p, hydrogen_frac=h_p))
    
    
app.run(host="0.0.0.0",port=8100)