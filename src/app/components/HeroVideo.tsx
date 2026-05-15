export default function HeroVideo() {
  return (
    <section aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="h-full w-full object-cover opacity-40"
        poster="/images/hero-poster.jpg"
      >
        <source src="https://cdn.example.com/hero-background.mp4" type="video/mp4" />
      </video>
    </section>
  );
}
