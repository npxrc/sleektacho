local M = {}

local DEFAULT_COLOR = "999999"

local function updateGFX(dt)
  local driveModeName = ""
  local driveModeColor = ""

  if controller.getController("driveModes") then
    -- For newer ESC systems
    local controller = controller.getController("driveModes")
    local key = controller.getCurrentDriveModeKey()
    local data = controller.getDriveModeData(key).settings
    driveModeColor = data.simpleControlButton.color
    driveModeName = v.data.driveModes.modes[key].name
  elseif controller.getController("esc") then
    -- For older ESC systems
    local escConfigData = controller.getController("esc").getCurrentConfigData()
    local escEnabled = escConfigData.escEnabled
    if escEnabled then
      driveModeColor = escConfigData.activeColor
    else 
      driveModeColor = DEFAULT_COLOR
    end
    driveModeName = escConfigData.name
  end

  if streams.willSend("driveModesInfo") then
    gui.send(
        "driveModesInfo",
        {
        currentDriveMode = {
            name = driveModeName,
            color = driveModeColor
        }
        }
    )
  end
end

M.updateGFX = updateGFX

return M