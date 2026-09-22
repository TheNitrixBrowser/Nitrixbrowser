/* Requests KWin blur for this Nitrix process's own X11/XWayland window. */
#include <X11/Xlib.h>
#include <X11/Xatom.h>
#include <errno.h>
#include <limits.h>
#include <stdlib.h>
#include <unistd.h>

static int x_error;
static int on_error(Display *display, XErrorEvent *event) {
  (void)display; (void)event; x_error = 1; return 0;
}
static int number(const char *text, unsigned long *value) {
  char *end;
  errno = 0;
  if (!text || !*text || *text == '-') return 0;
  *value = strtoul(text, &end, 10);
  return !errno && !*end && *value <= UINT_MAX;
}
int main(int argc, char **argv) {
  unsigned long window, pid, region[12];
  if (argc < 3 || argc > 15 || (argc - 3) % 4 || !number(argv[1], &window)
      || !number(argv[2], &pid) || pid != (unsigned long)getppid() || !window) return 2;
  for (int i = 3; i < argc; i++) {
    if (!number(argv[i], &region[i-3]) || region[i-3] > 65535) return 2;
    if (((i-3)%4 >= 2) && region[i-3] == 0) return 2;
  }
  Display *display = XOpenDisplay(NULL);
  if (!display) return 3;
  XSetErrorHandler(on_error);
  Atom actual; int format; unsigned long count, remaining; unsigned char *data = NULL;
  Atom pid_atom = XInternAtom(display, "_NET_WM_PID", False);
  int status = XGetWindowProperty(display, window, pid_atom, 0, 1, False,
    XA_CARDINAL, &actual, &format, &count, &remaining, &data);
  int own_window = status == Success && !x_error && actual == XA_CARDINAL
    && format == 32 && count == 1 && data && *(unsigned long *)data == pid;
  if (data) XFree(data);
  if (!own_window) { XCloseDisplay(display); return 4; }
  Atom blur = XInternAtom(display, "_KDE_NET_WM_BLUR_BEHIND_REGION", False);
  if (argc == 3) XDeleteProperty(display, window, blur);
  else XChangeProperty(display, window, blur, XA_CARDINAL, 32, PropModeReplace,
    (unsigned char *)region, argc - 3);
  XSync(display, False);
  XCloseDisplay(display);
  return x_error ? 5 : 0;
}
