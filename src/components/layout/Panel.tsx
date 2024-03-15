interface PanelProps extends React.PropsWithChildren {
  header?: string;
}

export const Panel: React.FC<PanelProps> = ({ header, children }) => (
  <section className="my-4 w-full max-w-[900px] rounded-md border border-slate-300 bg-white px-6 py-2 shadow-xl">
    {header && (
      <div className="mb-2 border-b pb-2 text-center text-xl font-semibold">{header}</div>
    )}
    {children}
  </section>
);
