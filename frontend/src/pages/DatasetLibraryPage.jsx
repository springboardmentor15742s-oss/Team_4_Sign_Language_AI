import { useMemo, useState } from 'react'

const datasets = [
  {
    name: 'Sign Language MNIST',
    category: 'Alphabet',
    type: 'Static alphabet signs',
    size: '~1 MB',
    classes: '24 ASL letters',
    format: 'CSV, 28x28 grayscale pixels',
    use: 'Fast model prototyping and baseline alphabet recognition.',
    tags: ['A-Z', 'Static', 'MNIST'],
  },
  {
    name: 'ASL Alphabet',
    category: 'Alphabet',
    type: 'Static hand images',
    size: '~1 GB',
    classes: '29 classes',
    format: 'Folder-per-class RGB images',
    use: 'Primary image dataset for hand-shape and alphabet recognition.',
    tags: ['A-Z', 'Static', 'Images'],
  },
  {
    name: 'WLASL',
    category: 'Dynamic Words',
    type: 'Dynamic word-level signs',
    size: '~50 GB full corpus',
    classes: '100 to 2000 word vocabulary subsets',
    format: 'Videos with JSON metadata',
    use: 'Future dynamic gesture recognition for signs like HELLO and THANK YOU.',
    tags: ['Words', 'Dynamic', 'Video'],
  },
]

const filters = ['All', 'Alphabet', 'Dynamic Words']

export default function DatasetLibraryPage() {
  const [activeFilter, setActiveFilter] = useState('All')

  const visibleDatasets = useMemo(() => {
    if (activeFilter === 'All') return datasets
    return datasets.filter((dataset) => dataset.category === activeFilter)
  }, [activeFilter])

  return (
    <section className="dataset-page">
      <div className="page-heading">
        <p className="eyebrow">Dataset library</p>
        <h1>Explore sign language datasets</h1>
        <p className="lede">
          Browse the datasets used for alphabet recognition and future dynamic word recognition.
        </p>
      </div>

      <div className="filter-bar" aria-label="Dataset category filters">
        {filters.map((filter) => (
          <button
            className={`filter-chip ${activeFilter === filter ? 'active' : ''}`}
            key={filter}
            onClick={() => setActiveFilter(filter)}
            type="button"
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="dataset-grid">
        {visibleDatasets.map((dataset) => (
          <article className="dataset-card" key={dataset.name}>
            <div className="dataset-card-header">
              <span className="dataset-category">{dataset.category}</span>
              <span className="dataset-size">{dataset.size}</span>
            </div>
            <h2>{dataset.name}</h2>
            <p className="dataset-type">{dataset.type}</p>
            <dl className="dataset-details">
              <div>
                <dt>Classes</dt>
                <dd>{dataset.classes}</dd>
              </div>
              <div>
                <dt>Format</dt>
                <dd>{dataset.format}</dd>
              </div>
              <div>
                <dt>Project use</dt>
                <dd>{dataset.use}</dd>
              </div>
            </dl>
            <div className="tag-row">
              {dataset.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
