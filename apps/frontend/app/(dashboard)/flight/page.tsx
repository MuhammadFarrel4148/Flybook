import Header from "./components/Header";
import InputFlight from "./components/InputFlight";

export default function Page() {
  return (
    <div
      className="flex flex-col md:h-139 justify-center items-center gap-10 py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-cover bg-center"
      style={{
        backgroundImage:
          "linear-gradient(to bottom, rgba(15, 42, 74, 0.75), rgba(10, 25, 47, 0.85)), url('https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1920&auto=format&fit=crop')",
      }}
    >
      <div className="w-full max-w-5xl flex flex-col items-center gap-10">
        <Header />
        <InputFlight />
      </div>
    </div>
  );
}
