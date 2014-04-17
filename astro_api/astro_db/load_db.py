from pymongo import MongoClient
import pandas as pd
import sqlite3
from pandas.io import sql
import json

"""
    Loads the asterank database from mongo into an sqlite db and json.
"""


client = MongoClient()
db = client.asterank
coll = db.asteroids

keys = [u'sigma_tp', u'diameter', u'epoch_mjd', u'ad', u'producer', u'rms',
    u'H_sigma', u'closeness', u'K2', u'K1', u'M1', u'two_body', u'full_name',
    u'M2', u'sigma_per', u'equinox', u'DT', u'diameter_sigma', u'saved',
    u'albedo', u'moid_ld', u'pha', u'neo', u'sigma_ad', u'PC', u'profit',
    u'spkid', u'sigma_w', u'sigma_i', u'per', u'id', u'A1', u'data_arc', u'A3',
    u'score', u'per_y', u'sigma_n', u'epoch_cal', u'orbit_id', u'sigma_a',
    u'sigma_om', u'A2', u'sigma_e', u'condition_code', u'rot_per', u'prov_des',
    u'G', u'last_obs', u'H', u'price', u'IR', u'spec_T', u'epoch',
    u'n_obs_used', u'moid', u'extent', u'spec_B', u'e', u'GM', u'tp_cal',
    u'pdes', u'class', u'UB', u'a', u't_jup', u'om', u'n_del_obs_used', u'ma',
    u'name', u'i', u'tp', u'prefix', u'BV', u'spec', u'q', u'w', u'n',
    u'sigma_ma', u'first_obs', u'_id', u'sigma_q', u'n_dop_obs_used']

keys_to_keep = [u'diameter', u'epoch_mjd', u'full_name', u'pha', u'neo', u'profit',
    u'id', u'score', u'per_y', u'sigma_n', u'epoch_cal', u'orbit_id',
    u'condition_code', u'rot_per', u'last_obs', u'price', u'spec_T', u'epoch',
    u'n_obs_used', u'moid', u'spec_B', u'e', u'GM', u'class', u'a', u'om',
    u'ma', u'name', u'i', u'prefix', u'spec', u'w', u'n', u'first_obs']

keys_to_drop = [ key for key in keys if key not in keys_to_keep ]

asteroids = pd.DataFrame(list( coll.find( { '$and': [ {'spec': { '$ne': '?' }}, {'spec': { '$ne': 'comet'}}] } ) ))

asteroids = asteroids.drop(keys_to_drop, axis=1)


sqldb = sqlite3.connect('asteroids.db')
sql.write_frame(asteroids,'asteroids',sqldb)


asteroids = list( coll.find( { '$and': [ {'spec': { '$ne': '?' }}, {'spec': { '$ne': 'comet'}}] } ) )
asteroids_json = []
for a in asteroids:
    cur_a = {}
    for key in keys_to_keep:
        cur_a[key]=a[key]
    asteroids_json.append(cur_a)
    
f = open('asteroids.json','w')
json.dump(asteroids_json,f)
f.close()

print "Found",len(asteroids),"asteroids."



"""
##
import jlib as jl
import pylab as pl

#print asteroids.groupby('spec')['spec'].count()
asteroids['diameter_float'] = asteroids.apply(lambda r: r['diameter'] if type(r['diameter']) == float else 0.0 ,axis=1)
asteroids['GM_float'] = asteroids.apply(lambda r: r['GM'] if type(r['GM']) == float else 0.0 ,axis=1)

#jl.PlotScatter([asteroids],['diameter_float'],['a'],ylim=[0,10])
jl.PlotHistograms([asteroids],['price'],100)
pl.show()
##
def myfunc(a,f):
    return a['diameter'] * f
    
asteroids['d2']=asteroids.apply(lambda x: myfunc(x,10), axis=1)

##

print asteroids['d2'].head()
"""