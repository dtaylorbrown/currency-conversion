"use client";

export default function Error({ error }: { error: Error }) {
  return (
    <div>
      <main>
        <h2>Something went wrong!</h2>
        <p>{error.message}</p>
      </main>
    </div>
  );
}
