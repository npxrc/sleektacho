'use strict'

angular.module('beamng.apps')
.directive('tabbyzTachoWTemp', [function () {
  return {
    template:
    '<object style="width:100%; height:100%; box-sizing:border-box;" type="image/svg+xml" data="/ui/modules/apps/tabbyzTachoWTemp/tacho.svg"></object>',
    replace: true,
    restrict: 'EA',
    link: function (scope, element, attrs) {
        let streams = ['driveModesInfo', 'electrics', 'engineInfo']
        StreamsManager.add(streams)

        scope.$on('$destroy', function () {
            StreamsManager.remove(streams)
        })

        element.on('load', function () {
            let svgDoc = element[0].contentDocument
            let svgElement = element[0]
            svgDoc.switchToNextDriveMode = switchToNextDriveMode
            
            svgElement.style.opacity = 0

            scope.$on('streamsUpdate', function (event, streams) {
                let streamIsValid = false
                if (streams.electrics && streams.engineInfo && streams.engineInfo[1]) {
                    streamIsValid = true
                }

                if (!streamIsValid) {
                    svgElement.style.opacity = 0
                } else {
                    svgElement.style.opacity = 1
                    svgDoc.onUpdate(streams, UiUnits, bngApi)
                }
            })
    
            scope.$on('VehicleFocusChanged', function (event, data) {
                svgDoc.onVehicleFocusChanged()
            })
        })
    }
  }
}])

function switchToNextDriveMode() {
    bngApi.activeObjectLua("if controller.getController('driveModes') then controller.getController('driveModes').nextDriveMode() else controller.getControllerSafe('esc').toggleESCMode() end")
}