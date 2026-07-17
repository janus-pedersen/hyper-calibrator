# How to use Hyper Calibrator

Well, start of by opening up [the website](https://janus-pedersen.github.io/hyper-calibrator/)

## Connecting to you hyperion instance

The first step is connecting to connect your browser to your local hyperion instance. It supports all hyperion-like forks, as long as it has the same [JSON-API](https://api.hyperion-project.org).

You can use the test button to check if you browser can access the needed api's.

## Opening display popup

The app needs to know what color your display emits, so it uses a remote controlled popup to display any given color on your screen.

This popup needs to be opened on the display that has the ambient light setup, the actual video signal doesn't need to go through hyperion, as the ambient light color is controlled automatically.

## Starting camera feed

Press the "Start camera" button to be prompted for camera access, and select the appropriate webcam. It needs to be able to see both the display, and the ambient light at the same time. Try to have your camera about 20cm (~8") away from the display, positioned right at the adge of the display.

### Setting up the regions

Now two regions will be visible in the camera feed. One with a dashed border, and one with a solid border.

The **solid** region represents the dispaly region, and should cover a good portion of the display, with as few reflections as possible.

The other **dashed** region represents the ambient light, and should cover the emitted light on your wall. Play around with the size and shape of it and see what works best for your setup.

To test the coverage of the regions, press the "Resume" button in the bottom right to resume the live preview of the colors, keep in mind it can be quite resource intensive depending on the size of your regions, and the resolution of your camera.

## Configuring calibration

By default, it's setup to calibrate all the available colors, but you can remove ones you want to ignore, and re-add them if you change your mind.

Currently, there's only a single algorithm to choose from, that being the Proportional Oklab Feedback, so that's your only choice (for now).

The sample method determines how the colors are calculated from the configured regions. The "Dominant Color" methods seems to yield the best results as of now.

Now you can start the calibration and let the computer do it's thing.

## Using the results

As mentioned, the results are only stored in the live calibraiton parameters, and will be lost after a reboot. To mitegate this, you can navigate into your settings and manualy copy-paste them from the live calibration into your image processing color adjustments.

---

## Tips for best results

- Perform the calibration in a dark room...
- Tweak other image processing settings before doing this. Things such as brightness compensation, tone mapping (if relevant) and alike.
