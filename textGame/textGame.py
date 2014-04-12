import numpy
import os,sys

capital=1000000


def printCapital():
	print capital
	
def checkCapital():
	if capital<0:
		print 'You have no money!'
		sys.exit();

def randomAsteroid():
	return {'distance':random.random()*100,
			'value':random.random()*10000000,
			'iron':random.random(),
			'water':random.random(),
			'platinum':random.random(),
			'mass':random.random()}

def getAsteroids():
	asteroids=[]
	for i in range(100):
		asteroids.append(randomAsteroid())
	return asteroids

def pickAction():
	