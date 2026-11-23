export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        width: "100%",
        margin: 0,
        padding: 0,
        background: "#020617",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "1600px",
          lineHeight: 0,
        }}
      >
        <img
          src="/home-hero.JPG"
          alt="The Worlds Top 30 Digital Products Delivered Instantly. Browse products or complete your purchase."
          style={{
            display: "block",
            width: "100%",
            height: "auto",
          }}
        />

        <a
          href="/products"
          aria-label="Browse Products"
          title="Browse Products"
          style={{
            position: "absolute",
            left: "21.2%",
            top: "74.2%",
            width: "26.2%",
            height: "11.5%",
            display: "block",
            borderRadius: "999px",
            cursor: "pointer",
          }}
        />

        <a
          href="/checkout"
          aria-label="Complete Your Purchase"
          title="Complete Your Purchase"
          style={{
            position: "absolute",
            left: "48.8%",
            top: "74.2%",
            width: "30.5%",
            height: "11.5%",
            display: "block",
            borderRadius: "999px",
            cursor: "pointer",
          }}
        />
      </div>
    </main>
  );
}
