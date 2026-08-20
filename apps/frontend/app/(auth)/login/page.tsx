import Header from "./components/Header";
import InputContent from "./components/InputContent";
import Footer from "./components/Footer";

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-10">
      <div className="w-full max-w-[440px] flex flex-col gap-6 p-8 bg-white rounded-xl border border-slate-200 shadow-lg shadow-slate-900/5">
        <Header />
        <InputContent />
        <Footer />
      </div>
    </div>
  );
}
