mergeInto(LibraryManager.library, {
  Screenshot: function (screenshot) {
    try {
      window.dispatchReactUnityEvent("Screenshot", UTF8ToString(screenshot));
    } catch (e) {
      console.warn("Failed to dispatch event");
    }
  },
});