// tsx only uses geteuid() to derive a private temporary-directory suffix.
// Windows does not expose geteuid(), and some Node/Windows combinations can
// fail inside os.userInfo() before a test file starts. The suite is sequential,
// so a deterministic process-local suffix is safe and avoids that OS failure.
if (process.platform === "win32" && typeof process.geteuid !== "function") {
  Object.defineProperty(process, "geteuid", {
    configurable: true,
    value: () => 0,
  });
}
