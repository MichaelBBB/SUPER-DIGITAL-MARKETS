import PaymentPanel from "@/components/PaymentPanel";

export default function Home() {
  return (
    <main className="w-full">
      {/* This actually loads the payment panel */}
      <PaymentPanel />
    </main>
  );
}
