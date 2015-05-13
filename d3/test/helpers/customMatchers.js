var customMatchers = {
	toHaveSameAngles : function(util, customEqualityTesters) {
		return {
			compare : function(actual, expected) {
				var result = {
					pass : true
				};
				if (actual.length !== expected.length) {
					result.pass = false;
				} else {
					var precision = 8;
					var factor = Math.pow(10, precision);
					for (var i = 0; i < actual.length; i++) {
						var startActual = Math.round(actual[i].startAngle *
								factor) /
								factor;
						var startExpected = Math.round(expected[i].startAngle *
								factor) /
								factor;
						var endActual = Math.round(actual[i].endAngle * factor) /
								factor;
						var endExpected = Math.round(expected[i].endAngle *
								factor) /
								factor;
						if ((startActual !== startExpected) ||
								(endActual !== endExpected)) {
							result.pass = false;
						}
					}
				}
				return result;
			}
		};
	},
	toHaveSameCoordinates : function(util, customEqualityTesters) {
		return {
			compare : function(actual, expected) {
				var compare = function(a, b) {
					return (a < b) ? -1 : 1;
				};
				actual.sort(compare);
				expected.sort(compare);
				var result = {
					pass : true
				};
				if (actual.length !== expected.length) {
					result.pass = false;
					result.message = "arrays do not have the same number of objects";
				} else {
					var precision = 8;
					var factor = Math.pow(10, precision);
					for (var i = 0; i < actual.length; i++) {
						if (actual[i].linkID !== expected[i].linkID) {
							result.pass = false;
							result.message = "mismatch in linkID: " +
									actual[i].linkID + " vs " +
									expected[i].linkID;
						}
						var source0Actual = {
							x : Math.round(actual[i].source0.x * factor) /
									factor,
							y : Math.round(actual[i].source0.y * factor) /
									factor
						};
						var source0Expected = {
							x : Math.round(expected[i].source0.x * factor) /
									factor,
							y : Math.round(expected[i].source0.y * factor) /
									factor
						};
						if ((source0Actual.x !== source0Expected.x) ||
								(source0Actual.y !== source0Expected.y)) {
							result.pass = false;
							result.message = "mismatch in source0 of " +
									actual[i].linkID + ": (" + source0Actual.x +
									", " + source0Actual.y + ") vs (" +
									source0Expected.x + ", " +
									source0Expected.y + ")";
						}
						var target0Actual = {
							x : Math.round(actual[i].target0.x * factor) /
									factor,
							y : Math.round(actual[i].target0.y * factor) /
									factor
						};
						var target0Expected = {
							x : Math.round(expected[i].target0.x * factor) /
									factor,
							y : Math.round(expected[i].target0.y * factor) /
									factor
						};
						if ((target0Actual.x !== target0Expected.x) ||
								(target0Actual.y !== target0Expected.y)) {
							result.pass = false;
							result.message = "mismatch in target0 of " +
									actual[i].linkID + ": (" + target0Actual.x +
									", " + target0Actual.y + ") vs (" +
									target0Expected.x + ", " +
									target0Expected.y + ")";
						}
						var source1Actual = {
							x : Math.round(actual[i].source1.x * factor) /
									factor,
							y : Math.round(actual[i].source1.y * factor) /
									factor
						};
						var source1Expected = {
							x : Math.round(expected[i].source1.x * factor) /
									factor,
							y : Math.round(expected[i].source1.y * factor) /
									factor
						};
						if ((source1Actual.x !== source1Expected.x) ||
								(source1Actual.y !== source1Expected.y)) {
							result.pass = false;
							result.message = "mismatch in source1 of " +
									actual[i].linkID + ": (" + source1Actual.x +
									", " + source1Actual.y + ") vs (" +
									source1Expected.x + ", " +
									source1Expected.y + ")";
						}
						var target1Actual = {
							x : Math.round(actual[i].target1.x * factor) /
									factor,
							y : Math.round(actual[i].target1.y * factor) /
									factor
						};
						var target1Expected = {
							x : Math.round(expected[i].target1.x * factor) /
									factor,
							y : Math.round(expected[i].target1.y * factor) /
									factor
						};
						if ((target1Actual.x !== target1Expected.x) ||
								(target1Actual.y !== target1Expected.y)) {
							result.pass = false;
							result.message = "mismatch in target1 of " +
									actual[i].linkID + ": (" + target1Actual.x +
									", " + target1Actual.y + ") vs (" +
									target1Expected.x + ", " +
									target1Expected.y + ")";
						}
						if (actual[i].adjacent !== expected[i].adjacent) {
							result.pass = false;
							result.message = "wrong adjacency: " +
									actual[i].adjancy + " vs " +
									expected[i].adjacency;
						}
					}
				}
				return result;
			}
		};
	}
}