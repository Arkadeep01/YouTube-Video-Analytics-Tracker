import TopVideosPreview from "@/components/TopVideosPreview";
import YouTubeUrlForm from "@/components/YouTubeUrlForm";

export default function Home() {
  return (
    <main className="min-h-screen">
      <section className="mx-auto flex max-w-6xl flex-col items-center px-6 py-24 text-center">

        <div className="mb-6 rounded-full border border-border bg-card px-4 py-2 text-xs tracking-widest text-muted-foreground">
          REAL-TIME PLAYER ANALYTICS
        </div>

        <h1 className="max-w-4xl text-5xl font-extrabold leading-tight md:text-7xl">
          Track any YouTube
          <br />
          video in{" "}
          <span className="text-primary">
            real time
          </span>
        </h1>

        <p className="mt-6 max-w-3xl text-lg text-muted-foreground">
          Paste a URL. We&apos;ll watch the player, log every play,
          pause and seek, and aggregate live statistics across
          every viewer who opens the page.
        </p>

        <div className="mt-10 w-full max-w-3xl">
          <YouTubeUrlForm />
        </div>

        <div className="mt-20 grid w-full max-w-5xl gap-6 md:grid-cols-3">

          <div className="rounded-2xl border border-border bg-card p-6 text-left">
            <h3 className="mb-3 text-sm font-bold uppercase text-primary">
              Event Capture
            </h3>

            <p className="text-muted-foreground">
              play • pause • seek • ended • heartbeat
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 text-left">
            <h3 className="mb-3 text-sm font-bold uppercase text-primary">
              Aggregation
            </h3>

            <p className="text-muted-foreground">
              Time-bucketed analytics from your backend.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 text-left">
            <h3 className="mb-3 text-sm font-bold uppercase text-primary">
              Auto Refresh
            </h3>

            <p className="text-muted-foreground">
              Statistics update automatically as users watch.
            </p>
          </div>
        </div>
      </section>

      <TopVideosPreview />
    </main>
  );
}