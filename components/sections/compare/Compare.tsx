const rowsCompare = [
  "Every ingredient clearly disclosed",
  "Produced in GMP-certified facilities",
  "Every batch is third-party tested",
  "Formulated for optimal bioavailability",
  "Free from unnecessary fillers and colors",
];

export function Compare() {
  return (
    <section className="pad compare" id="compare">
      <div className="compare-heading" data-reveal>
        <span className="compare-kicker">Comparison</span>
        <h2>Why Limitless Is <em>Different</em></h2>
        <p>A clear comparison so you can choose with confidence.</p>
      </div>
      <div className="compare-layout">
        <div className="compare-visual" aria-hidden="true">
          <img className="compare-flowers" src="/images/flowers-1.png" alt="" />
          <span className="compare-arrow" />
          <img className="compare-woman-bottle" src="/images/bottle-woman.png" alt="" />
        </div>
        <div className="compare-table-wrap">
          <div className="compare-table">
            <div className="compare-table-head">
              <div className="compare-feature-head"> </div>
              <div className="compare-brand ours-brand"><span className="compare-brand-icon">✧</span><strong>Limitless Woman</strong></div>
              <div className="compare-brand other-brand"><span className="compare-brand-icon">⚗</span><strong>Other Brands</strong></div>
            </div>
            {rowsCompare.map((text) => (
              <div className="compare-row" key={text}>
                <div className="compare-feature">{text}</div>
                <div className="compare-result ours-result"><i className="ok">✓</i></div>
                <div className="compare-result other-result"><i className="no">×</i></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
