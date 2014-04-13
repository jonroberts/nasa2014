var tech = {
	'arkydTelescope':{
		'name':'Arkyd Public Space Telescope',
		'description':"<p>Create the world's first crowdfunded asteroid hunting telescope. By placing this in space, the satellite can hunt asteroids 24/7, and so it sees almost twice the number of asteroids.</p>",
		'cost':1500000,
		'researched':false,
		'reqs':[]
	},
	'asteroidProbe':{
		'name':'CubeSat Probe',
		'description':"<p>To get the best estimate of an asteroids value, you need to go there. Small cheap probes can scout an asteroids composition and value</p>",
		'cost':1500000,
		'researched':true,
		'reqs':[]
	}
	'waterMining':{
		'name':'Water Miner',
		'description':'<p>Asteroids have many different compositions. Water asteroids are the easiest to mine.</p>',
		'cost':10000000;
		'researched':false,
		'reqs':[]
	},
	'platinumMining':{
		'name':'Platinum Group Miner',
		'description':'<p>Platinum group metals are much harder to mine, but the payoff can be huge.</p>',
		'cost':100000000;
		'researched':false,
		'reqs':['waterMining']
	},
	'ironMining':{
		'name':'Iron Miner',
		'description':'<p>Iron rich asteroids are hard to mine, but as we move to constructing in space rather than on earth, iron group metals will become a key resource.</p>',
		'cost':100000000;
		'researched':false,
		'reqs':['waterMining']
	},
	'ironProcessing':{
		'name':'Iron Processing In Space',
		'description':'<p>One the iron has been mined, it needs to be processed and stored.</p>',
		'cost':100000000;
		'researched':false,
		'reqs':['ironMining']
	},
	'spaceFactory':{
		'name':'Space Factory',
		'description':"<p>Building things on earth is easy, but it's expensive to get them to space. Why not build factories in space instead? Note, you'll need to get the raw materials to your factory!</p>",
		'cost':100000000;
		'researched':false,
		'reqs':['ironProcessing']
	},
	'liquidHydrogenRefining':{
		'name':'Liquid Hydrogen Refining',
		'description':"<p>Turn water into liquid hydrogen and oxygen, and you have rocket fuel in space.</p>",
		'cost':5000000;
		'researched':false,
		'reqs':['waterMining']
	},
	'spaceGasStation':{
		'name':'Orbiting Gas Station',
		'description':"<p>Once you have rocket fuel in space, new missions from earth only need to get to the gas station, refuel before venturing further into the cosmos. Required to build a space based hydrogen fuel station</p>",
		'cost':5000000;
		'researched':false,
		'reqs':['liquidHydrogenRefining']
	},
};


var ships={
	'probe':{
		'name':'Basic Asteroid Probe',
		'reqs':['asteroidProbe'],
		'component':'Probe',
		'cost':0
	},
	'waterMiner':{
		'name':'Water Miner',
		'reqs':['waterMining'],
		'component':'Ship',
		'cost':0
	},
	'ironMiner':{
		'name':'Iron Miner',
		'reqs':['ironMining'],
		'component':'Ship',
		'cost':0
	},
	'platinumMiner':{
		'name':'Platinum Miner',
		'reqs':['platinumMining'],
		'component':'Ship',
		'cost':0
	},
	'hydrogenRefinery':{
		'name':'Hydrogen Refinery',
		'reqs':['liquidHydrogenRefining'],
		'component':'Ship',
		'cost':0
	},
	'spaceGasStation':{
		'name':'Liquid Hydrogen Gas Station',
		'reqs':['spaceGasStation'],
		'component':'Ship',
		'cost':0
	},
	'ironRefinery':{
		'name':'Iron Refinery',
		'reqs':['ironProcessing'],
		'component':'Ship',
		'cost':0
	},
	'spaceFactory':{
		'name':'Space Factory',
		'reqs':['spaceFactory'],
		'component':'Ship',
		'cost':0
	}
}



