export function OrionLogo() {
  return (
    <div className="flex items-center gap-2">
      <div className="relative w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-white"
        >
          <path d="M10 10C10 8.9 9.1 8 8 8C6.9 8 6 8.9 6 10C6 11.1 6.9 12 8 12C9.1 12 10 11.1 10 10Z" />
          <path d="M22 20V18C22 15.8 20.2 14 18 14H14C11.8 14 10 15.8 10 18V20" />
          <path d="M4 20V19C4 17.9 4.9 17 6 17H8.5" />
          <path d="M18 2C19.1 2 20 2.9 20 4C20 5.1 19.1 6 18 6C16.9 6 16 5.1 16 4C16 2.9 16.9 2 18 2Z" />
          <path d="M18 6V10" />
          <path d="M18 10C15.8 10 14 11.8 14 14" />
        </svg>
      </div>
      <div>
        <h1 className="text-lg font-semibold text-foreground">Orion</h1>
        <p className="text-xs text-muted-foreground">Your AI Copilot</p>
      </div>
    </div>
  );
}
