mergeInto(LibraryManager.library, {
  Fullscreen: function (fullscreen) {
    try {
      window.dispatchReactUnityEvent("Fullscreen");
    } catch (e) {
      console.warn("Failed to dispatch event");
    }
  },
});