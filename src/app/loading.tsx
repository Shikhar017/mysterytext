// app/loading.tsx
export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-500 text-gray-100">
      <div className="flex flex-col items-center space-y-6">
        {/* Animated spinner */}
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>

        {/* Thematic text */}
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-wide">
          Initializing Robot Interface...
        </h1>
        <p className="text-gray-400 text-sm md:text-base italic">
          "Mysteries unfold as circuits awaken"
        </p>
      </div>
    </div>
  );
}
