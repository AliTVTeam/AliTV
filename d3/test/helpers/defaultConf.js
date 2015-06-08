var defaultConf =  {
		linear: {
			drawAllLinks: false,
			startLineColor: "#49006a",
			endLineColor: "#1d91c0",
		},
		circular: {
			tickSize: 5
		},
		graphicalParameters: {
			width: 1000,
			height: 1000,
			karyoHeight: 30,
			karyoDistance: 10,
			linkKaryoDistance: 10,
			tickDistance: 100, 
			treeWidth: 300,
			genomeLabelWidth: 150
		},
		minLinkIdentity: 40,
		maxLinkIdentity: 100,
		midLinkIdentity: 60,
		minLinkLength: 100,
		maxLinkLength: 5000,
		minLinkIdentityColor: "#D21414",
		maxLinkIdentityColor: "#1DAD0A",
		midLinkIdentityColor: "#FFEE05",
		layout: "linear",
		tree: {
			drawTree: false,
			orientation: "left"
		},
		features: {
			showAllFeatures: false,
			gen: {
				form: "rect",
				color: "#E2EDFF",
				height: 30,
				visible: false
			},
			invertedRepeat: {
				form: "arrow",
				color: "#e7d3e2",
				height: 30,
				visible: false
			}
		},
		labels: {
			showAllLabels: true,
			chromosome: {
				showChromosomeLabels: true
			},
			genome: {
				showGenomeLabels: true
			},
			features: {
				showFeatureLabels: true
			}
		}
};