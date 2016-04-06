function addLoadEvent(func) {
	var oldonload = nx.onload;
	if (typeof nx.onload != 'function') {
		nx.onload = func;
	} else {
		nx.onload = function() {
			if (oldonload) {
				oldonload();
			}
			func();
		}
	}
}

var patch = [];
var nxonload = [];

function addActivity1(patchUrl, pdPatchId, suffix) {
	var defaultFreq = 200;
	var defaultAmp = 0;

	nxonload[pdPatchId] = function() {
		var freqLeft = nx.widgets['freqLeft' + suffix];
		var ampLeft = nx.widgets['ampLeft' + suffix];
		var freqRight = nx.widgets['freqRight' + suffix];
		var ampRight = nx.widgets['ampRight' + suffix];

		freqLeft.on('value', function(data) {
			//console.log('freqLeft', data)
			Pd.send('freqLeft', [data])
		})
		ampLeft.on('value', function(data) {
			//console.log('ampLeft', data)
			Pd.send('ampLeft', [data])
		})
		freqRight.on('value', function(data) {
			//console.log('freqRight', data)
			Pd.send('freqRight', [data])
		})
		ampRight.on('value', function(data) {
			//console.log('ampRight', data)
			Pd.send('ampRight', [data])
		})

		freqLeft.set({
			value: defaultFreq
		})
		freqRight.set({
			value: defaultFreq
		})
		ampLeft.set({
			value: defaultAmp
		})
		ampRight.set({
			value: defaultAmp
		})

		$.get(patchUrl, function(mainStr) {
			// Loading the patch
			patch[patchUrl] = Pd.loadPatch(mainStr);
		})
	}
	addLoadEvent(nxonload[pdPatchId])
}

function addActivity(patchUrl, pdPatchId, suffix) {

	var defaultIntensity = 0.3;
	var defaultDuration = 100;
	var maxDuration = 2000;
	var defaultSOA = 250;

	nxonload[suffix] = function() {

		var intensity = nx.widgets['intensity' + suffix];
		var duration = nx.widgets['duration' + suffix];
		var soa = nx.widgets['soa' + suffix];
		var bang = nx.widgets['bang' + suffix];
		var envelopeLeft = nx.widgets['envelopeLeft' + suffix];
		var envelopeRight = nx.widgets['envelopeRight' + suffix];
		var svgToggle = nx.widgets['svgToggle' + suffix];

		if (intensity) {
			intensity.on('value', function(data) {
				//console.log('intensity', data)
				Pd.send('intensity', [data])
			})
		}
		if (duration) {
			duration.on('value', function(data) {
				//console.log('duration', data)
				Pd.send('duration', [data])
			})
		}
		if (soa) {
			soa.on('value', function(data) {
				//console.log('soa', data)
				Pd.send('soa', [data])
			})
		}
		if (bang) {
			bang.on('press', function(data) {
				console.log('bang', data)
				if (data == 0) {
					Pd.send('bang', [data])
				}
			})
		}
		if (envelopeLeft) {
			envelopeLeft.on('*', function(data) {
				//console.log('points',data.points)
				if ("points" in data) {
					data.points.forEach(function(p, i) {
						console.log('point', i, p.x, p.y)
					})
				}
			})
		}
		if (envelopeRight) {
			envelopeRight.on('*', function(data) {
				//console.log('points',data.points)
				if ("points" in data) {
					data.points.forEach(function(p, i) {
						console.log('point', i, p.x, p.y)
					})
				}
			})
		}

		if (svgToggle) {
			svgToggle.on('*', function(data) {
				if (data.value === 1) {
					$('#' + pdPatchId).fadeIn(100)
				} else if (data.value === 0) {
					$('#' + pdPatchId).fadeOut(100)
				}
			})
		}

		function line2env(args) {
			var commaIdx = -1;
			var ramp = [];
			var points = [];
			args.forEach(function(d, i) {
				if (d === ',') {
					commaIdx = i;
				} else {
					var m = i - commaIdx;
					switch (m) {
						case 1:
							{
								ramp.push({
									value: 0,
									interval: 0,
									delay: 0
								});
								ramp[ramp.length - 1].value = d;
							}
							break;
						case 2:
							ramp[ramp.length - 1].interval = d;
							break;
						case 3:
							ramp[ramp.length - 1].delay = d;
							break;
						default:
							return [];
					}
				}
			})
			ramp.forEach(function(d, i) {
				points.push({
					y: d.value,
					x: (d.delay + d.interval) / maxDuration
				});

			})
			return points;
		}

		Pd.receive('left', function(args) {
			var points = line2env(args);
			//console.log('received a message from "left" : ', points)
			envelopeLeft.set({
				points: points
			})
		})

		Pd.receive('right', function(args) {
			var points = line2env(args);
			//console.log('received a message from "right" : ', points)
			envelopeRight.set({
				points: points
			})
		})

		intensity.set({
			value: defaultIntensity
		})
		duration.set({
			value: defaultDuration
		})
		soa.set({
			value: defaultSOA
		})

		envelopeLeft.set({
			points: [{
				x: 0,
				y: 0
			}]
		})
		envelopeRight.set({
			points: [{
				x: 0,
				y: 0
			}]
		})
		if (svgToggle) {
			svgToggle.set({
				value: 1
			})
		}

		function patchLoaded(mainStr) {
			// Rendering the patch as SVG
			//var pp = $('#' + pdPatchId);
			//console.log('pp',pp)
			/*$('#' + pdPatchId).html(function() {
				//console.log('html',mainStr,pdPatchId)
				return pdfu.renderSvg(pdfu.parse(mainStr), {
					svgFile: false,
					ratio: 1.5
				})
			})*/

			Pd.send('duration', [defaultDuration]);
			Pd.send('soa', [defaultSOA]);
			Pd.send('intensity', [defaultIntensity]);
			//})
			/*if (svgToggle) {
				$('#' + pdPatchId).fadeOut(1000, function() {
					svgToggle.set({
						value: 0
					})
				})
			}*/
		}

		$.get(patchUrl, function(mainStr) {
			// Loading the patch
			patch[patchUrl] = Pd.loadPatch(mainStr);
			patchLoaded(mainStr);
			//console.log(nxonload)
		})
	}
	addLoadEvent(nxonload[suffix])
}
