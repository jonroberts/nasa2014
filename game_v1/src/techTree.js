var tech = {
	'asteroidProbe':{
		'name':'CubeSat Probe',
		'description':"To get the best estimate of an asteroids value, you need to go there. Small cheap probes can scout an asteroids composition and value",
		'cost':1500000,
		'researched':true,
		'reqs':[]
	},
	'arkydTelescope':{
		'name':'Arkyd Public Space Telescope',
		'description':'Create the world\'s first crowdfunded asteroid hunting telescope. By placing this in space, the satellite can hunt asteroids 24/7, and so it sees almost twice the number of asteroids.',
		'cost':1500000,
		'researched':false,
		'reqs':[]
	},
	'waterMining':{
		'name':'Water Miner',
		'description':'Asteroids have many different compositions. Water asteroids are the easiest to mine.',
		'cost':10000000,
		'researched':false,
		'reqs':[]
	},
	'platinumMining':{
		'name':'Platinum Group Miner',
		'description':'Platinum group metals are much harder to mine, but the payoff can be huge.',
		'cost':100000000,
		'researched':false,
		'reqs':['waterMining']
	},
	'ironMining':{
		'name':'Iron Miner',
		'description':'Iron rich asteroids are hard to mine, but as we move to constructing in space rather than on earth, iron group metals will become a key resource.',
		'cost':100000000,
		'researched':false,
		'reqs':['waterMining']
	},
	'ironProcessing':{
		'name':'Iron Processing In Space',
		'description':'One the iron has been mined, it needs to be processed and stored.',
		'cost':100000000,
		'researched':false,
		'reqs':['ironMining']
	},
	'spaceFactory':{
		'name':'Space Factory',
		'description':'Building things on earth is easy, but it\'s expensive to get them to space. Why not build factories in space instead? Note, you\'ll need to get the raw materials to your factory!',
		'cost':100000000,
		'researched':false,
		'reqs':['ironProcessing']
	},
	'liquidHydrogenRefining':{
		'name':'Liquid Hydrogen Refining',
		'description':'Turn water into liquid hydrogen and oxygen, and you have rocket fuel in space.',
		'cost':5000000,
		'researched':false,
		'reqs':['waterMining']
	},
	'spaceGasStation':{
		'name':'Orbiting Gas Station',
		'description':'Once you have rocket fuel in space, new missions from earth only need to get to the gas station, refuel before venturing further into the cosmos. Required to build a space based hydrogen fuel station.',
		'cost':5000000,
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

function showHideTechTree(){
	buildTechTree();
	$('#techTree').toggle();
}

function buildTechTree(){
	$('#techTree').empty();
	for(var key in tech){
		var theClass=(tech[key].researched)?'researched':'';
		if(theClass==''){
			for(var t in tech[key].reqs){
				var reqKey=tech[key].reqs[t];
				if(tech[reqKey].researched==false){
					theClass='invalid';
					break;
				}
			}
		}
		var theOnClick='';
		if(theClass==''){
			theOnClick="research('"+key+"')";
		}
		
		var text = '<div class="'+theClass+'" title="$'+(tech[key].cost/1000000.).toFixed(2)+'m. '+tech[key].description+'" id="'+key+'" onclick='+theOnClick+'>'+tech[key].name+'</div>'
		$('#techTree').append(text)
	}
}
function research(key){
	console.log(key);
	if(score.value<tech[key].cost){
		alert('Too little money to perform research!');
		return false;
	}
	updateScore(-tech[key].cost);
	tech[key].researched=true;
	buildTechTree();
}

