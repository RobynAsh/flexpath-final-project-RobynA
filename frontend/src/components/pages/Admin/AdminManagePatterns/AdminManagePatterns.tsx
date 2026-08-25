import { faAdd, faRotateLeft, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  type FilterField,
  patternFilterFields,
  patternSortFields,
  type SortField,
} from '../../../../hooks/usePatternsFilterSort'
import {
  type PatternDetails,
  useAdminGetAllPatterns,
} from '../../../../services/patterns/admin/useAdminGetAllPatterns'
import { useAdminDeletePatterns } from '../../../../services/patterns/admin/useAdminDeletePatterns'
import { Button } from '../../../atoms/Button/Button'
import { DashBorder } from '../../../atoms/DashBorder/DashBorder'
import { FilterForm } from '../../../form/FilterForm/FilterForm'
import { SortForm, type SortDirection } from '../../../form/SortForm/SortForm'
import { Modal } from '../../../molecules/Modal/Modal'
import { PatternCard } from '../../../molecules/PatternCard/PatternCard'

let filterTimeout: number

export const AdminManagePatterns = () => {
  // State for filter and sort options
  const [filterField, setFilterField] = useState<FilterField>('name')
  const [filterText, setFilterText] = useState('')
  const [debouncedFilterText, setDebouncedFilterText] = useState('')
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortDirection, setSortDirection] = useState<SortDirection>('ascending')

  useEffect(() => {
    window.clearTimeout(filterTimeout)
    filterTimeout = window.setTimeout(
      () => setDebouncedFilterText(filterText),
      300,
    )

    return () => window.clearTimeout(filterTimeout)
  }, [filterText])

  const {
    data: patterns,
    isPending,
    isError,
  } = useAdminGetAllPatterns({
    filterField,
    filterText: debouncedFilterText,
    sortField,
    sortDirection,
  })
  const visiblePatterns = patterns ?? []
  const hasFilterText = filterText.trim().length > 0

  // State for selected patterns and delete modal
  const [selectedPatterns, setSelectedPatterns] = useState<
    Map<number, PatternDetails>
  >(new Map())
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const deletePatterns = useAdminDeletePatterns()

  const setPatternSelected = (details: PatternDetails, selected: boolean) => {
    setSelectedPatterns((current) => {
      const updated = new Map(current)
      const patternId = details.pattern.patternId

      if (selected) {
        updated.set(patternId, details)
      } else {
        updated.delete(patternId)
      }

      return updated
    })
  }

  const confirmDelete = () => {
    deletePatterns.mutate([...selectedPatterns.keys()], {
      onSuccess: () => {
        setSelectedPatterns(new Map())
        setIsDeleteModalOpen(false)
      },
    })
  }

  const openDeleteModal = () => {
    setIsDeleteModalOpen(true)
  }

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false)
  }

  return (
    <div className="flex w-full max-w-6xl flex-col gap-5 md:self-center">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-0">
        <div>
          <h1>Manage Patterns</h1>
          <h4>Add, Update or Delete Patterns</h4>
        </div>
        <div className="flex grow flex-col justify-end gap-2 md:flex-row">
          {selectedPatterns.size > 0 && (
            <div>
              <Button
                variant="tertiary"
                onClick={() => setSelectedPatterns(new Map())}
              >
                <FontAwesomeIcon icon={faRotateLeft} />
                Reset
              </Button>
            </div>
          )}
          <div>
            <Button
              variant="secondary"
              disabled={selectedPatterns.size === 0}
              onClick={openDeleteModal}
            >
              <FontAwesomeIcon icon={faTrash} />
              {selectedPatterns.size === 0
                ? 'Delete Patterns'
                : `Delete ${selectedPatterns.size} Patterns`}
            </Button>
          </div>
          <Link to="add">
            <Button variant="secondary">
              <FontAwesomeIcon icon={faAdd} />
              Add Pattern
            </Button>
          </Link>
        </div>
      </div>

      <FilterForm
        filterFields={patternFilterFields}
        filterField={filterField}
        filterText={filterText}
        onFilterFieldChange={(field) => setFilterField(field as FilterField)}
        onFilterTextChange={setFilterText}
        placeholder="Enter text to filter patterns"
      />

      <DashBorder>
        <span className="text-2xl font-bold">
          {visiblePatterns.length === 1 ? 'Pattern' : 'Patterns'}:{' '}
          {visiblePatterns.length}
        </span>
      </DashBorder>

      {!isPending && !isError && visiblePatterns.length > 0 && (
        <div>
          <SortForm
            sortFields={patternSortFields}
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

      {!isPending && !isError && patterns?.length === 0 && !hasFilterText && (
        <p>No patterns have been added yet.</p>
      )}

      {!isPending &&
        !isError &&
        patterns &&
        (patterns.length > 0 || hasFilterText) &&
        visiblePatterns.length === 0 && <p>No patterns match your search.</p>}

      {!isPending && !isError && visiblePatterns.length > 0 && (
        <div className="flex flex-col gap-4">
          {visiblePatterns.map((details) => (
            <PatternCard
              details={details}
              key={details.pattern.patternId}
              selected={selectedPatterns.has(details.pattern.patternId)}
              onSelectedChange={(selected) =>
                setPatternSelected(details, selected)
              }
              editPath={`/admin/patterns/edit/${details.pattern.patternId}`}
              showUsername={true}
            />
          ))}
        </div>
      )}

      {isDeleteModalOpen && (
        <Modal
          headerText="Delete Patterns?"
          closeModal={closeDeleteModal}
          closeDisabled={deletePatterns.isPending}
          firstButton={{
            label: 'Cancel',
            onClick: closeDeleteModal,
            disabled: deletePatterns.isPending,
          }}
          secondButton={{
            label: deletePatterns.isPending ? 'Deleting...' : 'Delete Patterns',
            onClick: confirmDelete,
            disabled: deletePatterns.isPending,
          }}
        >
          <p className="mt-2">
            Are you sure you want to delete the following patterns?
          </p>
          <ul className="my-4 list-disc space-y-1 pl-6">
            {[...selectedPatterns.values()].map(({ pattern }) => (
              <li key={pattern.patternId}>{pattern.name}</li>
            ))}
          </ul>

          {deletePatterns.isError && (
            <p role="alert" className="mb-4 text-rose-500">
              Unable to delete the selected patterns. Please try again.
            </p>
          )}
        </Modal>
      )}
    </div>
  )
}
