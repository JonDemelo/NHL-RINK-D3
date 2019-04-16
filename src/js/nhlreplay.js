(function() {
  var _class = function() {
    var self = this;

    self.selRink = d3.select('div#rink');
  };

  _class.prototype.start = function() {
    var self = this;

    var rinkDimsNHL = { // meters
      'type': 'NHL',
      'yearsActive': ['2018-2019'],
      'unitType': 'meters',
      'orientation': 'horizontal',

      'height': 61,
      'width': 26,

      'boardWidth': 0.1524,
      'cornerRadius': 8.5,
      'faceoffZoneCircleRadius': 4.572,

      'faceoffBoxSubSectionShortLength': 0.9144,
      'faceoffBoxSubSectionLongLength': 1.1684,
      'faceoffHashMarksLength': 0.6096,

      'disFaceoffBoxSubSectionLongFromFaceoffZoneCenter': (0.4572 + 0.2286),
      'disFaceoffBoxSubSectionShortFromFaceoffZoneCenter': 0.2286,
      'disFaceoffHashMarksFromZoneCenter': 0.8763,

      'disTrapazoidBoardLineToMiddleOfIce': 4.2672,
      'disTrapazoidGoalLineToMiddleOfIce': 3.3528,

      'netWidth': 1.8288,
      'creaseWidth': 2.4384,
      'creasePreCurveHeight': 1.3716,
      'creaseMaxHeight': 1.8288,

      'netDepth': 1.016,
      'netWidth': 1.889125,

      'blueLineWidth': 0.3048,
      'redLineWidth': 0.3048,
      'goalLineWidth': 0.0508,
      'generalFaceoffLineWidth': 0.0508,

      'centerDotRadius': 0.1524,
      'defensiveZoneDotRadius': 0.2286,
      'neutralZoneDotRadius': 0.3048,

      'disEndBoardToGoalLine': 3.4,
      'disEndBoardToBlueLine': 23.4,
      'disBlueLineToBlueLine': 15,
      'disEndBoardToRedLine': 30.5,
      'disEndBoardToNeutralZoneDot': (23.4 + 1.524),
      'disSideBoardToSideDot': 6.2484,
      'disEndBoardToDefensiveZoneDot': 9.4488
    };

    self.drawRink(400, 800, rinkDimsNHL)
  };

  _class.prototype.drawRink = function(viewHeight, viewWidth, rinkDims) { // TODO vertical support
    if (_.isUndefined(viewHeight) ||
      _.isUndefined(viewWidth) ||
      _.isUndefined(rinkDims)) {
      return;
    }

    var self = this;

    self.containerBuffer = 10;
    self.containerMaxViewHeight = viewHeight - self.containerBuffer * 2;
    self.containerMaxViewWidth = viewWidth - self.containerBuffer * 2;

    self.scaleMToPx = d3.scaleLinear()
      .domain([0, d3.max([rinkDims.height, rinkDims.width])])
      .range([0, d3.max([self.containerMaxViewHeight, self.containerMaxViewWidth])]);

    // Define the SVG space.
    self.svgRink = self.selRink.append('svg')
      .attr('id', 'rinkSVG')
      .attr('height', viewHeight + 'px')
      .attr('width', viewWidth + 'px');

    // Define G containers/holders.
    self.gContainer = self.svgRink.append('g')
      .attr('id', 'gContainer');

    // self.gBoards = self.gRink.append('g')
    //   .attr('id', 'gBoards');
    // self.gIce = self.gRink.append('g')
    //   .attr('id', 'gIce');
    // self.gNets = self.gIce.append('g')
    //   .attr('id', 'gNets');

    // Build D3 graphics for each G container.
    self.gContainer.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('height', viewHeight + 'px')
      .attr('width', viewWidth + 'px')
      .attr('fill', 'black');

    self.gRink = self.gContainer.append('g')
      .attr('id', 'gRink')
      .attr('transform', function() { // Center the rink in the provided container.
        var newX = 0;
        var newY = 0;

        if (self.scaleMToPx(rinkDims.height) < viewWidth) {
          newX = (viewWidth - self.scaleMToPx(rinkDims.height)) / 2;
        }
        if (self.scaleMToPx(rinkDims.width) < viewHeight) {
          newY = (viewHeight - self.scaleMToPx(rinkDims.width)) / 2;
        }

        return 'translate(' + newX + ' ' + newY + ')';
      });

    self.gRink.append('rect') // TODO Boards.
      .attr('id', 'ice')
      .attr("rx", self.scaleMToPx(rinkDims.cornerRadius))
      .attr("ry", self.scaleMToPx(rinkDims.cornerRadius))
      .attr('height', self.scaleMToPx(rinkDims.width) + 'px')
      .attr('width', self.scaleMToPx(rinkDims.height) + 'px')
      // .attr('stroke', 'orange')
      // .attr('stroke-alignment', 'outer')
      // .attr('stroke-width', self.scaleMToPx(rinkDims.boardWidth))
      .attr('fill', 'white');

    // DOTS
    self.gDots = self.gRink.append('g')
      .attr('id', 'gDots');

    // Center dot circle
    self.gDots.append('circle')
      .attr('cx', self.scaleMToPx(rinkDims.height / 2))
      .attr('cy', self.scaleMToPx(rinkDims.width / 2))
      .attr('r', self.scaleMToPx(rinkDims.faceoffZoneCircleRadius))
      .attr('stroke', 'red')
      .attr('stroke-width', self.scaleMToPx(rinkDims.generalFaceoffLineWidth))
      .attr('fill', 'white');

    var neutralZoneFaceoffAreas = [{
        'cx': self.scaleMToPx(rinkDims.disEndBoardToNeutralZoneDot),
        'cy': self.scaleMToPx(rinkDims.disSideBoardToSideDot)
      },
      {
        'cx': self.scaleMToPx(rinkDims.height - rinkDims.disEndBoardToNeutralZoneDot),
        'cy': self.scaleMToPx(rinkDims.disSideBoardToSideDot)
      },
      {
        'cx': self.scaleMToPx(rinkDims.disEndBoardToNeutralZoneDot),
        'cy': self.scaleMToPx(rinkDims.width - rinkDims.disSideBoardToSideDot)
      },
      {
        'cx': self.scaleMToPx(rinkDims.height - rinkDims.disEndBoardToNeutralZoneDot),
        'cy': self.scaleMToPx(rinkDims.width - rinkDims.disSideBoardToSideDot)
      }
    ];

    self.neutralZoneFaceoffAreas = self.gDots.selectAll('.gOffsideDot')
      .data(neutralZoneFaceoffAreas).enter()
      .append('g')
      .attr('class', 'gOffsideDot');

    self.neutralZoneFaceoffAreas.append('circle')
      .attr('class', 'offsideDot neutralZoneDot faceoffDot')
      .attr('cx', function(d) {
        return d.cx;
      })
      .attr('cy', function(d) {
        return d.cy;
      })
      .attr('r', self.scaleMToPx(rinkDims.neutralZoneDotRadius))
      .attr('fill', 'red');

    var defensiveZoneFaceoffAreas = [{
        'cx': self.scaleMToPx(rinkDims.disEndBoardToDefensiveZoneDot),
        'cy': self.scaleMToPx(rinkDims.disSideBoardToSideDot)
      },
      {
        'cx': self.scaleMToPx(rinkDims.height - rinkDims.disEndBoardToDefensiveZoneDot),
        'cy': self.scaleMToPx(rinkDims.disSideBoardToSideDot)
      },
      {
        'cx': self.scaleMToPx(rinkDims.disEndBoardToDefensiveZoneDot),
        'cy': self.scaleMToPx(rinkDims.width - rinkDims.disSideBoardToSideDot)
      },
      {
        'cx': self.scaleMToPx(rinkDims.height - rinkDims.disEndBoardToDefensiveZoneDot),
        'cy': self.scaleMToPx(rinkDims.width - rinkDims.disSideBoardToSideDot)
      }
    ];

    self.defensiveZoneFaceoffAreas = self.gDots.selectAll('.gDefensiveZoneDot')
      .data(defensiveZoneFaceoffAreas).enter()
      .append('g')
      .attr('transform', function(d) {
        return 'translate(' + d.cx + ' ' + d.cy + ')';
      })
      .attr('class', 'gDefensiveZoneDot');

    // Larger circle
    self.defensiveZoneFaceoffAreas.append('circle')
      .attr('r', self.scaleMToPx(rinkDims.faceoffZoneCircleRadius))
      .attr('stroke', 'red')
      .attr('stroke-width', self.scaleMToPx(rinkDims.generalFaceoffLineWidth))
      .attr('fill', 'white');

    // Faceoff dot.
    self.defensiveZoneFaceoffAreas.append('circle')
      .attr('class', 'defensiveZoneDot faceoffDot')
      .attr('r', self.scaleMToPx(rinkDims.defensiveZoneDotRadius))
      .attr('fill', 'red');

    var dirCharges = [{
      'x': -1,
      'y': -1
    }, {
      'x': 1,
      'y': -1
    }, {
      'x': -1,
      'y': 1
    }, {
      'x': 1,
      'y': 1
    }];

    // Top left partial square.
    self.gPartialSquaresAndHashs = self.defensiveZoneFaceoffAreas.selectAll('.gPartialSquare').data(dirCharges).enter()
      .append('g').attr('class', 'gPartialSquare');

    self.gPartialSquaresAndHashs.append('line')
      .attr('x1', function(d) {
        return d.x * self.scaleMToPx(rinkDims.disFaceoffBoxSubSectionLongFromFaceoffZoneCenter + rinkDims.faceoffBoxSubSectionShortLength);
      })
      .attr('y1', function(d) {
        return d.y * self.scaleMToPx(rinkDims.disFaceoffBoxSubSectionShortFromFaceoffZoneCenter);
      })
      .attr('x2', function(d) {
        return d.x * self.scaleMToPx(rinkDims.disFaceoffBoxSubSectionLongFromFaceoffZoneCenter);
      })
      .attr('y2', function(d) {
        return d.y * self.scaleMToPx(rinkDims.disFaceoffBoxSubSectionShortFromFaceoffZoneCenter);
      })
      .attr('stroke-width', self.scaleMToPx(rinkDims.generalFaceoffLineWidth))
      .attr('stroke', 'red');

    self.gPartialSquaresAndHashs.append('line')
      .attr('x1', function(d) {
        return d.x * self.scaleMToPx(rinkDims.disFaceoffBoxSubSectionLongFromFaceoffZoneCenter);
      })
      .attr('y1', function(d) {
        return d.y * self.scaleMToPx(rinkDims.disFaceoffBoxSubSectionShortFromFaceoffZoneCenter);
      })
      .attr('x2', function(d) {
        return d.x * self.scaleMToPx(rinkDims.disFaceoffBoxSubSectionLongFromFaceoffZoneCenter);
      })
      .attr('y2', function(d) {
        return d.y * self.scaleMToPx(rinkDims.disFaceoffBoxSubSectionShortFromFaceoffZoneCenter + rinkDims.faceoffBoxSubSectionShortLength);
      })
      .attr('stroke-width', self.scaleMToPx(rinkDims.generalFaceoffLineWidth))
      .attr('stroke', 'red');

    self.gPartialSquaresAndHashs.append('line')
      .attr('x1', function(d) {
        return d.x * self.scaleMToPx(rinkDims.disFaceoffHashMarksFromZoneCenter);
      })
      .attr('y1', function(d) {
        return d.y * self.scaleMToPx(rinkDims.faceoffZoneCircleRadius + rinkDims.faceoffHashMarksLength);
      })
      .attr('x2', function(d) {
        return d.x * self.scaleMToPx(rinkDims.disFaceoffHashMarksFromZoneCenter);
      })
      .attr('y2', function(d) {
        return d.y * self.scaleMToPx(rinkDims.faceoffZoneCircleRadius - 0.1);
      })
      .attr('stroke-width', self.scaleMToPx(rinkDims.generalFaceoffLineWidth))
      .attr('stroke', 'red');

    // NET RELATED STUFF
    self.gNetArea = self.gRink.append('g')
      .attr('id', 'gNetArea');

    // left top trap line
    self.gNetArea.append('line')
      .attr('class', 'trapLine')
      .attr('x1', self.scaleMToPx(0))
      .attr('y1', self.scaleMToPx(rinkDims.width / 2 + rinkDims.disTrapazoidBoardLineToMiddleOfIce))
      .attr('x2', self.scaleMToPx(rinkDims.disEndBoardToGoalLine))
      .attr('y2', self.scaleMToPx(rinkDims.width / 2 + rinkDims.disTrapazoidGoalLineToMiddleOfIce))
      .attr('stroke-width', self.scaleMToPx(rinkDims.goalLineWidth))
      .attr('stroke', 'red');

    // left bottom trap line
    self.gNetArea.append('line')
      .attr('class', 'trapLine')
      .attr('x1', self.scaleMToPx(0))
      .attr('y1', self.scaleMToPx(rinkDims.width / 2 - rinkDims.disTrapazoidBoardLineToMiddleOfIce))
      .attr('x2', self.scaleMToPx(rinkDims.disEndBoardToGoalLine))
      .attr('y2', self.scaleMToPx(rinkDims.width / 2 - rinkDims.disTrapazoidGoalLineToMiddleOfIce))
      .attr('stroke-width', self.scaleMToPx(rinkDims.goalLineWidth))
      .attr('stroke', 'red');

    // right top trap line
    self.gNetArea.append('line')
      .attr('class', 'trapLine')
      .attr('x1', self.scaleMToPx(rinkDims.height))
      .attr('y1', self.scaleMToPx(rinkDims.width / 2 + rinkDims.disTrapazoidBoardLineToMiddleOfIce))
      .attr('x2', self.scaleMToPx(rinkDims.height - rinkDims.disEndBoardToGoalLine))
      .attr('y2', self.scaleMToPx(rinkDims.width / 2 + rinkDims.disTrapazoidGoalLineToMiddleOfIce))
      .attr('stroke-width', self.scaleMToPx(rinkDims.goalLineWidth))
      .attr('stroke', 'red');

    // right bottom trap line
    self.gNetArea.append('line')
      .attr('class', 'trapLine')
      .attr('x1', self.scaleMToPx(rinkDims.height))
      .attr('y1', self.scaleMToPx(rinkDims.width / 2 - rinkDims.disTrapazoidBoardLineToMiddleOfIce))
      .attr('x2', self.scaleMToPx(rinkDims.height - rinkDims.disEndBoardToGoalLine))
      .attr('y2', self.scaleMToPx(rinkDims.width / 2 - rinkDims.disTrapazoidGoalLineToMiddleOfIce))
      .attr('stroke-width', self.scaleMToPx(rinkDims.goalLineWidth))
      .attr('stroke', 'red');

    self.gNetArea.append('path')
      .attr('d', 'M' + self.scaleMToPx(rinkDims.disEndBoardToGoalLine) + ' ' + self.scaleMToPx(rinkDims.width / 2 - rinkDims.creaseWidth / 2) +
        ' H' + self.scaleMToPx(rinkDims.disEndBoardToGoalLine + rinkDims.creasePreCurveHeight) +
        ' C ' + self.scaleMToPx(rinkDims.disEndBoardToGoalLine + rinkDims.creaseMaxHeight) + ' ' + self.scaleMToPx(rinkDims.width / 2 - rinkDims.creaseWidth / 2) +
        ', ' + self.scaleMToPx(rinkDims.disEndBoardToGoalLine + rinkDims.creaseMaxHeight) + ' ' + self.scaleMToPx(rinkDims.width / 2 + rinkDims.creaseWidth / 2) +
        ', ' + self.scaleMToPx(rinkDims.disEndBoardToGoalLine + rinkDims.creasePreCurveHeight) + ' ' + self.scaleMToPx(rinkDims.width / 2 + rinkDims.creaseWidth / 2) +
        ' H' + ((self.scaleMToPx(rinkDims.disEndBoardToGoalLine)))
      )
      .attr('stroke-width', self.scaleMToPx(rinkDims.goalLineWidth))
      .attr('stroke', 'red')
      .attr('fill', 'lightblue');

    self.gNetArea.append('path')
      .attr('d', 'M' + self.scaleMToPx(rinkDims.disEndBoardToGoalLine) + ' ' + self.scaleMToPx(rinkDims.width / 2 - rinkDims.netWidth / 2) +
        ' C ' + self.scaleMToPx(rinkDims.disEndBoardToGoalLine - rinkDims.netDepth) + ' ' + self.scaleMToPx(rinkDims.width / 2 - rinkDims.netWidth / 2) +
        ', ' + self.scaleMToPx(rinkDims.disEndBoardToGoalLine - rinkDims.netDepth) + ' ' + self.scaleMToPx(rinkDims.width / 2 + rinkDims.netWidth / 2) +
        ', ' + self.scaleMToPx(rinkDims.disEndBoardToGoalLine) + ' ' + self.scaleMToPx(rinkDims.width / 2 + rinkDims.netWidth / 2)
      )
      .attr('stroke-width', self.scaleMToPx(rinkDims.goalLineWidth))
      .attr('stroke', 'red')
      .attr('fill', 'white');

    self.gNetArea.append('path')
      .attr('d', 'M' + self.scaleMToPx(rinkDims.height - rinkDims.disEndBoardToGoalLine) + ' ' + self.scaleMToPx(rinkDims.width / 2 - rinkDims.creaseWidth / 2) +
        ' H' + self.scaleMToPx(rinkDims.height - rinkDims.disEndBoardToGoalLine - rinkDims.creasePreCurveHeight) +
        ' C ' + self.scaleMToPx(rinkDims.height - rinkDims.disEndBoardToGoalLine - rinkDims.creaseMaxHeight) + ' ' + self.scaleMToPx(rinkDims.width / 2 - rinkDims.creaseWidth / 2) +
        ', ' + self.scaleMToPx(rinkDims.height - rinkDims.disEndBoardToGoalLine - rinkDims.creaseMaxHeight) + ' ' + self.scaleMToPx(rinkDims.width / 2 + rinkDims.creaseWidth / 2) +
        ', ' + self.scaleMToPx(rinkDims.height - rinkDims.disEndBoardToGoalLine - rinkDims.creasePreCurveHeight) + ' ' + self.scaleMToPx(rinkDims.width / 2 + rinkDims.creaseWidth / 2) +
        ' H' + ((self.scaleMToPx(rinkDims.height - rinkDims.disEndBoardToGoalLine)))
      )
      .attr('stroke-width', self.scaleMToPx(rinkDims.goalLineWidth))
      .attr('stroke', 'red')
      .attr('fill', 'lightblue');

    self.gNetArea.append('path')
      .attr('d', 'M' + self.scaleMToPx(rinkDims.height - rinkDims.disEndBoardToGoalLine) + ' ' + self.scaleMToPx(rinkDims.width / 2 - rinkDims.netWidth / 2) +
        ' C ' + self.scaleMToPx(rinkDims.height - rinkDims.disEndBoardToGoalLine + rinkDims.netDepth) + ' ' + self.scaleMToPx(rinkDims.width / 2 - rinkDims.netWidth / 2) +
        ', ' + self.scaleMToPx(rinkDims.height - rinkDims.disEndBoardToGoalLine + rinkDims.netDepth) + ' ' + self.scaleMToPx(rinkDims.width / 2 + rinkDims.netWidth / 2) +
        ', ' + self.scaleMToPx(rinkDims.height - rinkDims.disEndBoardToGoalLine) + ' ' + self.scaleMToPx(rinkDims.width / 2 + rinkDims.netWidth / 2)
      )
      .attr('stroke-width', self.scaleMToPx(rinkDims.goalLineWidth))
      .attr('stroke', 'red')
      .attr('fill', 'white');

    // LINES
    self.gLines = self.gRink.append('g')
      .attr('id', 'gLines');

    // red line
    self.gLines.append('line')
      .attr('id', 'redLine')
      .attr('class', 'zoneLine')
      .attr('stroke-dasharray', self.scaleMToPx(0.6096) + ',' + self.scaleMToPx(0.3048))
      .attr('x1', self.scaleMToPx(rinkDims.disEndBoardToRedLine))
      .attr('y1', self.scaleMToPx(0))
      .attr('x2', self.scaleMToPx(rinkDims.disEndBoardToRedLine))
      .attr('y2', self.scaleMToPx(rinkDims.width))
      .attr('stroke-width', self.scaleMToPx(rinkDims.redLineWidth))
      .attr('stroke', 'red');

    // left blue line
    self.gLines.append('line')
      .attr('id', 'leftBlueLine')
      .attr('class', 'blueLine zoneLine')
      .attr('x1', self.scaleMToPx(rinkDims.disEndBoardToBlueLine))
      .attr('y1', self.scaleMToPx(0))
      .attr('x2', self.scaleMToPx(rinkDims.disEndBoardToBlueLine))
      .attr('y2', self.scaleMToPx(rinkDims.width))
      .attr('stroke-width', self.scaleMToPx(rinkDims.blueLineWidth))
      .attr('stroke', 'blue');

    // right blue line
    self.gLines.append('line')
      .attr('id', 'rightBlueLine')
      .attr('class', 'blueLine zoneLine')
      .attr('x1', self.scaleMToPx(rinkDims.height - rinkDims.disEndBoardToBlueLine))
      .attr('y1', self.scaleMToPx(0))
      .attr('x2', self.scaleMToPx(rinkDims.height - rinkDims.disEndBoardToBlueLine))
      .attr('y2', self.scaleMToPx(rinkDims.width))
      .attr('stroke-width', self.scaleMToPx(rinkDims.blueLineWidth))
      .attr('stroke', 'blue');

    var curveCutOffDistance = 1.7;

    // left goal line
    self.gLines.append('line')
      .attr('id', 'leftGoalLine')
      .attr('class', 'goalLine')
      .attr('x1', self.scaleMToPx(rinkDims.disEndBoardToGoalLine))
      .attr('y1', self.scaleMToPx(curveCutOffDistance))
      .attr('x2', self.scaleMToPx(rinkDims.disEndBoardToGoalLine))
      .attr('y2', self.scaleMToPx(rinkDims.width - curveCutOffDistance))
      .attr('stroke-width', self.scaleMToPx(rinkDims.goalLineWidth))
      .attr('stroke', 'red');

    // right goal line
    self.gLines.append('line')
      .attr('id', 'rightGoalLine')
      .attr('class', 'goalLine')
      .attr('x1', self.scaleMToPx(rinkDims.height - rinkDims.disEndBoardToGoalLine))
      .attr('y1', self.scaleMToPx(curveCutOffDistance))
      .attr('x2', self.scaleMToPx(rinkDims.height - rinkDims.disEndBoardToGoalLine))
      .attr('y2', self.scaleMToPx(rinkDims.width - curveCutOffDistance))
      .attr('stroke-width', self.scaleMToPx(rinkDims.goalLineWidth))
      .attr('stroke', 'red');

    self.gCenterDot = self.gRink.append('g')
      .attr('id', 'gCenterDot');

    self.gCenterDot.append('circle')
      .attr('id', 'centerDot')
      .attr('class', 'neutralZoneDot faceoffDot')
      .attr('cx', self.scaleMToPx(rinkDims.height / 2))
      .attr('cy', self.scaleMToPx(rinkDims.width / 2))
      .attr('r', self.scaleMToPx(rinkDims.centerDotRadius))
      .attr('fill', 'blue');
  };

  window.Main = _class;
})();
