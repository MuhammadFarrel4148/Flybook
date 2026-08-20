export default function Footer() {
  return (
    <>
      <p className="text-sm text-slate-500 text-center">
        Don&apos;t have an account?{" "}
        <a
          href="/register"
          className="text-blue-700 font-semibold hover:underline"
        >
          Sign Up
        </a>
      </p>
    </>
  );
}
