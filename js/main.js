/* Developed By 3D-Web-Dev */
function MediaPlayer() {
  this.duration = 0;
  this.current_progress = 0;
  this.progressWidth = 4;
  this.paused = true;
  this.bar = document.getElementById("progress-bar");
  this.track = document.getElementById("progress-bar-track");
  this.fill = document.getElementById("progress-bar-fill");
  this.video = document.getElementById("my_video");
  this.screen = document.getElementById("video-screen");
  this.back = document.getElementById("control-back");
  this.play = document.getElementById("control-play");
  this.vol = document.getElementById("control-volume");

  this.setProgress = function (progress) {
    var new_progress = this.progressWidth * progress;
    this._setProgressWidth(new_progress);
    var progress_coord = this._getProgressCoord();
    if (progress_coord != undefined) {
      progress_coord.x = -(this.progressWidth - new_progress) / 2;
      this._setProgressCoord(progress_coord);
    }
  };
  this._getProgressCoord = function () {
    return AFRAME.utils.coordinates.parse(this.fill.getAttribute("position"));
  };
  this._getProgressWidth = function () {
    return parseFloat(this.fill.getAttribute("width"));
  };
  this._setProgressCoord = function (coord) {
    this.fill.setAttribute("position", coord);
  };
  this._setProgressWidth = function (width) {
    this.fill.setAttribute("width", width);
  };

  this._addPlayerEvents = function () {
    var that = this;
    this.video.pause();
    this.video.onplay = function () {
      that.duration = this.duration;
    };
    this.video.ontimeupdate = function () {
      if (that.duration > 0) {
        that.current_progress = this.currentTime / that.duration;
      }
      that.setProgress(that.current_progress);
    };
  };

  this._addControlsEvent = function () {
    var that = this;

    this.play.addEventListener("click", function () {
      if (that.video.paused) {
        this.setAttribute("src", "#pause");
        that.video.play();
        that.paused = false;
        that.track.setAttribute("visible", true);
        that.fill.setAttribute("visible", true);
        that.screen.setAttribute("visible", "true");
      } else {
        this.setAttribute("src", "#play");
        that.video.pause();
        that.paused = true;
      }
    });

    this.vol.addEventListener("click", function () {
      if (that.video.muted) {
        that.video.muted = false;
        this.setAttribute("src", "#volume-normal");
      } else {
        that.video.muted = true;
        this.setAttribute("src", "#volume-mute");
      }
    });

    this.back.addEventListener("click", function () {
      that.video.currentTime = 0;
    });
  };

  this._mobile = function () {
    if (AFRAME.utils.device.isMobile()) {
      var that = this;
      let video_permission = document.getElementById("video-permission");
      let video_permission_button = document.getElementById(
        "video-permission-button"
      );

      video_permission.style.display = "block";
      video_permission_button.addEventListener(
        "click",
        function () {
          video_permission.style.display = "none";
          that.elVideo.play();
          that.elVideo.pause();
        },
        false
      );
    }
  };

  this._addProgressEvent = function () {
    var that = this;
    this.bar.addEventListener("click", function (e) {
      if (
        e.detail == undefined ||
        e.detail.intersection == undefined ||
        that.duration === 0
      ) {
        return;
      }
      let seekedPosition =
        (e.detail.intersection.point.x + that.progressWidth / 2) /
        that.progressWidth;
      try {
        let seekedTime = seekedPosition * that.duration;
        that.video.currentTime = seekedTime;
      } catch (e) {}
    });
  };

  this.setProgress(this.current_progress);
  this._addPlayerEvents();
  this._addControlsEvent();
  this._addProgressEvent();
  this._mobile();
}
