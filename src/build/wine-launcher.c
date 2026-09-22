#define WIN32_LEAN_AND_MEAN

typedef void *HANDLE;
typedef void *HMODULE;
typedef void *FARPROC;
typedef unsigned short WCHAR;
typedef const WCHAR *LPCWSTR;
typedef WCHAR *LPWSTR;
typedef const char *LPCSTR;
typedef unsigned long DWORD;
typedef unsigned short WORD;
typedef unsigned char BYTE;
typedef int BOOL;

typedef struct {
  DWORD cb;
  LPWSTR lpReserved;
  LPWSTR lpDesktop;
  LPWSTR lpTitle;
  DWORD dwX;
  DWORD dwY;
  DWORD dwXSize;
  DWORD dwYSize;
  DWORD dwXCountChars;
  DWORD dwYCountChars;
  DWORD dwFillAttribute;
  DWORD dwFlags;
  WORD wShowWindow;
  WORD cbReserved2;
  BYTE *lpReserved2;
  HANDLE hStdInput;
  HANDLE hStdOutput;
  HANDLE hStdError;
} STARTUPINFOW;

typedef struct {
  HANDLE hProcess;
  HANDLE hThread;
  DWORD dwProcessId;
  DWORD dwThreadId;
} PROCESS_INFORMATION;

__declspec(dllimport) DWORD __stdcall GetModuleFileNameW(HMODULE, LPWSTR, DWORD);
__declspec(dllimport) HMODULE __stdcall GetModuleHandleW(LPCWSTR);
__declspec(dllimport) FARPROC __stdcall GetProcAddress(HMODULE, LPCSTR);
__declspec(dllimport) LPCWSTR __stdcall GetCommandLineW(void);
__declspec(dllimport) BOOL __stdcall SetEnvironmentVariableW(LPCWSTR, LPCWSTR);
__declspec(dllimport) BOOL __stdcall CreateProcessW(LPCWSTR, LPWSTR, void *, void *, BOOL, DWORD, void *, LPCWSTR, STARTUPINFOW *, PROCESS_INFORMATION *);
__declspec(dllimport) BOOL __stdcall CloseHandle(HANDLE);
__declspec(dllimport) void __stdcall ExitProcess(unsigned int);
__declspec(dllimport) int __stdcall MessageBoxW(void *, LPCWSTR, LPCWSTR, unsigned int);

static WCHAR executable_path[32768];
static WCHAR command_line[32768];

static void zero_memory(void *target, unsigned long long size) {
  BYTE *bytes = (BYTE *)target;
  while (size--) *bytes++ = 0;
}

static unsigned long long text_length(LPCWSTR text) {
  unsigned long long length = 0;
  while (text[length]) length++;
  return length;
}

static LPCWSTR skip_first_argument(LPCWSTR command) {
  if (*command == L'"') {
    command++;
    while (*command && *command != L'"') command++;
    if (*command == L'"') command++;
  } else {
    while (*command && *command != L' ' && *command != L'\t') command++;
  }
  while (*command == L' ' || *command == L'\t') command++;
  return command;
}

static BOOL build_core_path(void) {
  DWORD length = GetModuleFileNameW((HMODULE)0, executable_path, 32768);
  if (!length || length >= 32768) return 0;

  while (length && executable_path[length - 1] != L'\\' && executable_path[length - 1] != L'/') length--;
  if (!length) return 0;

  LPCWSTR core_name = L"Nitrix-core.exe";
  unsigned long long core_length = text_length(core_name);
  if ((unsigned long long)length + core_length >= 32768) return 0;
  for (unsigned long long index = 0; index <= core_length; index++) {
    executable_path[length + index] = core_name[index];
  }
  return 1;
}

static BOOL build_command_line(void) {
  LPCWSTR remaining = skip_first_argument(GetCommandLineW());
  unsigned long long path_length = text_length(executable_path);
  unsigned long long args_length = text_length(remaining);
  unsigned long long required = path_length + args_length + 4;
  if (required >= 32768) return 0;

  unsigned long long output = 0;
  command_line[output++] = L'"';
  for (unsigned long long index = 0; index < path_length; index++) command_line[output++] = executable_path[index];
  command_line[output++] = L'"';
  if (args_length) {
    command_line[output++] = L' ';
    for (unsigned long long index = 0; index < args_length; index++) command_line[output++] = remaining[index];
  }
  command_line[output] = 0;
  return 1;
}

void wWinMainCRTStartup(void) {
  HMODULE ntdll = GetModuleHandleW(L"ntdll.dll");
  if (ntdll && GetProcAddress(ntdll, "wine_get_version")) {
    SetEnvironmentVariableW(L"FORCE_COLOR", L"0");
  }

  if (!build_core_path() || !build_command_line()) {
    MessageBoxW((void *)0, L"Nie można przygotować uruchomienia Nitrix.", L"Nitrix", 0x10);
    ExitProcess(1);
  }

  STARTUPINFOW startup;
  PROCESS_INFORMATION process;
  zero_memory(&startup, sizeof(startup));
  zero_memory(&process, sizeof(process));
  startup.cb = sizeof(startup);

  if (!CreateProcessW(executable_path, command_line, (void *)0, (void *)0, 0, 0, (void *)0, (LPCWSTR)0, &startup, &process)) {
    MessageBoxW((void *)0, L"Nie można uruchomić Nitrix-core.exe.", L"Nitrix", 0x10);
    ExitProcess(2);
  }

  CloseHandle(process.hThread);
  CloseHandle(process.hProcess);
  ExitProcess(0);
}
