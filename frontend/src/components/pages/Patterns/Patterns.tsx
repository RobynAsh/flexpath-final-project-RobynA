import { faAdd } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  type FilterField,
  type SortField,
  usePatternsFilterSort,
} from '../../../hooks/usePatternsFilterSort'
import { useGetPatterns } from '../../../services/useGetPatterns'
import { Button } from '../../atoms/Button/Button'
import { DashBorder } from '../../atoms/DashBorder/DashBorder'
import { FilterForm } from '../../form/FilterForm/FilterForm'
import { SortForm, type SortDirection } from '../../form/SortForm/SortForm'
import { PatternCard } from '../../molecules/PatternCard/PatternCard'

export const Patterns = () => {
  const { data: patterns, isPending, isError } = useGetPatterns()

  const [filterField, setFilterField] = useState<FilterField>('name')
  const [filterText, setFilterText] = useState('')
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortDirection, setSortDirection] = useState<SortDirection>('ascending')

  const { filterFields, sortFields, visiblePatterns } = usePatternsFilterSort({
    patterns,
    filterField,
    filterText,
    sortField,
    sortDirection,
  })
  const userFilterFields = filterFields.filter(
    ({ value }) => value !== 'username',
  )

  return (
    <div className="flex w-full max-w-6xl flex-col gap-5 md:self-center">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-0">
        <div>
          <h1>Patterns</h1>
          <h4>Add, Update or Delete Patterns</h4>
        </div>
        <div className="flex grow flex-col justify-end gap-2 md:flex-row">
          <Link to="/patterns/add">
            <Button variant="secondary">
              <FontAwesomeIcon icon={faAdd} />
              Add Pattern
            </Button>
          </Link>
        </div>
      </div>

      {patterns && patterns.length > 0 && (
        <FilterForm
          filterFields={userFilterFields}
          filterField={filterField}
          filterText={filterText}
          onFilterFieldChange={(field) => setFilterField(field as FilterField)}
          onFilterTextChange={setFilterText}
          placeholder="Enter text to filter patterns"
        />
      )}

      <DashBorder>
        <span className="text-2xl font-bold">
          {visiblePatterns.length === 1 ? 'Pattern' : 'Patterns'}:{' '}
          {visiblePatterns.length}
        </span>
      </DashBorder>

      {!isPending && !isError && visiblePatterns.length > 0 && (
        <div>
          <SortForm
            sortFields={sortFields}
            sortField={sortField}
            sortDirection={sortDirection}
            onSortFieldChange={(field) => setSortField(field as SortField)}
            onSortDirectionChange={setSortDirection}
          />
        </div>
      )}

      {isPending && <p role="status">Loading patterns...</p>}

      {isError && (
        <p role="alert" className="text-rose-500">
          Unable to load patterns. Please try again.
        </p>
      )}

      {!isPending && !isError && patterns?.length === 0 && (
        <p>No patterns have been added yet.</p>
      )}

      {!isPending &&
        !isError &&
        patterns &&
        patterns.length > 0 &&
        visiblePatterns.length === 0 && <p>No patterns match your search.</p>}

      {!isPending && !isError && visiblePatterns.length > 0 && (
        <div className="flex flex-col gap-4">
          {visiblePatterns.map((details) => (
            <PatternCard
              details={details}
              key={details.pattern.patternId}
              editPath={`/patterns/${details.pattern.patternId}/update`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
