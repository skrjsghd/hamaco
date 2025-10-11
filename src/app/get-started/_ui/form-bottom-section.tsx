export function FormBottomSection({ children }: { children: React.ReactNode }) {
  return (
    <section className="fixed bottom-0 left-0 right-0 p-6 pb-12 bg-gradient-to-t from-background to-transparent via-90% via-background">
      <div className="max-w-lg mx-auto">{children}</div>
    </section>
  );
}
