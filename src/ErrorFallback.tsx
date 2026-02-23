import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorFallback extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[hsl(240,60%,12%)] text-[hsl(45,90%,92%)] flex flex-col items-center justify-center p-6 text-center font-sans">
          <h1 className="text-xl font-bold mb-2">Something went wrong</h1>
          <p className="text-sm opacity-90 mb-4 max-w-md">
            If you just deployed to Vercel, add your Supabase env vars and redeploy:
          </p>
          <ul className="text-left text-sm opacity-90 mb-6 list-disc list-inside max-w-md">
            <li>Vercel → Project → Settings → Environment Variables</li>
            <li>Add <code className="bg-white/10 px-1 rounded">VITE_SUPABASE_URL</code> and <code className="bg-white/10 px-1 rounded">VITE_SUPABASE_PUBLISHABLE_KEY</code></li>
            <li>Redeploy (Deployments → … → Redeploy)</li>
          </ul>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-4 py-2 rounded-lg bg-amber-500/90 text-gray-900 font-semibold text-sm"
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
