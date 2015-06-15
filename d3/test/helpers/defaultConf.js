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
			linkKaryoDistance: 20,
			tickLabelFrequency: 10,
			tickDistance: 100,
			treeWidth: 300,
			genomeLabelWidth: 150
		},
		minLinkIdentity: 40,
		maxLinkIdentity: 100,
		midLinkIdentity: 60,
		minLinkIdentityColor: "#D21414",
		maxLinkIdentityColor: "#1DAD0A",
		midLinkIdentityColor: "#FFEE05",
		minLinkLength: 100,
		maxLinkLength: 5000,
		layout: "linear",
		tree: {
			drawTree: false,
			orientation: "left"
		},
		features: {
			showAllFeatures: false,
			supportedFeatures: {
				gen: {
					form: "rect",
					color: "#E2EDFF",
					height: 30,
					visible: false,
					labeling: false
				},
				invertedRepeat: {
					form: "rect",
					color: "#e7d3e2",
					height: 30,
					visible: false,
					pattern: "woven",
					labeling: false
				},
				nStretch: {
					form: "rect",
					color: "#000000",
					height: 30,
					visible: false,
					pattern: "lines",
					labeling: false
				},
				repeat: {
					form: "rect",
					color: "#56cd0f",
					height: 30,
					visible: false,
					pattern: "woven",
					labeling: false
				}
			},
			fallbackStyle: {
				form: "rect",
				color: "#787878",
				height: 30,
				visible: false,
				labeling: false
			}
		},
		labels: {
			showAllLabels: false,
			ticks: {
				showTicks: true,
				showTickLabels: true
			},
			chromosome: {
				showChromosomeLabels: true
			},
			genome: {
				showGenomeLabels: true
			},
			features: {
				showFeatureLabels: false
			}
		}
	};