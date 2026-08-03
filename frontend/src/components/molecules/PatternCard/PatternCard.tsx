import { PatternDetails } from '../../../services/useGetAllPatterns'
import { Chip } from '../../atoms/Chip/Chip'

const displayValue = (value: string | number | null) =>
  value === null || value === '' ? 'Not provided' : value

const formatDateTime = (value: string) => new Date(value).toLocaleString()

export const PatternCard = ({ details }: { details: PatternDetails }) => {
  const { pattern, tags, yarn, tools, materials } = details

  return (
    <article className="bg-surface shadow-card border-border overflow-hidden rounded-xl border">
      <div className="flex flex-col gap-2 bg-olive-50 px-4 py-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3>{pattern.name}</h3>
          <p className="text-muted">Owned by {pattern.username}</p>
        </div>
        <div className="text-sm sm:text-right">
          <p>
            <strong>Created:</strong> {formatDateTime(pattern.createdAt)}
          </p>
          <p>
            <strong>Updated:</strong> {formatDateTime(pattern.updatedAt)}
          </p>
        </div>
      </div>

      <div className="grid gap-5 p-4 lg:grid-cols-2">
        <section className="space-y-2">
          <h5 className="text-olive-600">Pattern information</h5>
          <div className="grid grid-cols-[max-content_1fr] gap-x-3 gap-y-1">
            <p className="font-bold">Designer</p>
            <p>{displayValue(pattern.designer)}</p>
            <p className="font-bold">Category</p>
            <p>{displayValue(pattern.category)}</p>
            <p className="font-bold">Technique</p>
            <p>{displayValue(pattern.technique)}</p>
            <p className="font-bold">Difficulty</p>
            <p>{displayValue(pattern.difficulty)}</p>
            <p className="font-bold">Description</p>
            <p className="min-w-0">{displayValue(pattern.description)}</p>
            <p className="font-bold">Pattern URL</p>
            <p className="min-w-0 break-all">
              {pattern.link ? (
                <a
                  className="text-olive-600 underline hover:text-olive-400"
                  href={pattern.link}
                  target="_blank"
                  rel="noreferrer"
                >
                  {pattern.link}
                </a>
              ) : (
                'Not provided'
              )}
            </p>
            <p className="font-bold">Image URL</p>
            <p className="min-w-0 break-all">
              {pattern.imageUrl ? (
                <a
                  className="text-olive-600 underline hover:text-olive-400"
                  href={pattern.imageUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  {pattern.imageUrl}
                </a>
              ) : (
                'Not provided'
              )}
            </p>
          </div>
        </section>

        <section className="space-y-2">
          <h5 className="text-olive-600">Tags</h5>
          {tags.length ? (
            <ul className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <li key={tag.tagId}>
                  <Chip label={`${tag.name}`} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted">No tags</p>
          )}
        </section>

        <section className="space-y-2">
          <h5 className="text-olive-600">Yarn requirements</h5>
          {yarn.length ? (
            <ul className="space-y-2">
              {yarn.map((item) => (
                <li
                  className="border-thread-200 bg-thread-50 rounded-lg border p-3"
                  key={item.patternYarnId}
                >
                  <strong>{displayValue(item.description)}</strong>

                  <p>
                    Weight {item.weight} · {item.yardage} yards · {item.grams}{' '}
                    grams
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted">No yarn requirements</p>
          )}
        </section>

        <section className="space-y-2">
          <h5 className="text-olive-600">Tool requirements</h5>
          {tools.length ? (
            <ul className="space-y-2">
              {tools.map((tool) => (
                <li
                  className="border-thread-200 bg-thread-50 rounded-lg border p-3"
                  key={tool.patternToolId}
                >
                  <strong>{tool.toolType}</strong>
                  <p>{tool.sizeMm} mm</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted">No tool requirements</p>
          )}
        </section>

        <section className="space-y-2 lg:col-span-2">
          <h5 className="text-olive-600">Material requirements</h5>
          {materials.length ? (
            <ul className="grid gap-2 md:grid-cols-2">
              {materials.map((material) => (
                <li
                  className="border-thread-200 bg-thread-50 rounded-lg border p-3"
                  key={material.patternMaterialId}
                >
                  <strong>{material.name}</strong>
                  <p>
                    {material.patternId} · Quantity {material.quantity}
                  </p>
                  <p>{displayValue(material.description)}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted">No material requirements</p>
          )}
        </section>
      </div>
    </article>
  )
}
