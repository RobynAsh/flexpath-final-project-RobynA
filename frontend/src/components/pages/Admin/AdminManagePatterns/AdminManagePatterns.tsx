import { faAdd, faRotateLeft, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  type Pattern,
  useGetAllPatterns,
} from '../../../../services/useGetAllPatterns'
import { useDeletePatterns } from '../../../../services/useDeletePatterns'
import { Button } from '../../../atoms/Button/Button'
import { DashBorder } from '../../../atoms/DashBorder/DashBorder'
import { FilterForm } from '../../../form/FilterForm/FilterForm'
import type { SelectOption } from '../../../form/Select/Select'
import { SortForm, type SortDirection } from '../../../form/SortForm/SortForm'
import { Modal } from '../../../molecules/Modal/Modal'
import { PatternCard } from '../../../molecules/PatternCard/PatternCard'

type SortField = 'name' | 'createdAt' | 'updatedAt'
type FilterField = Exclude<keyof Pattern, 'patternId'>

const filterFields: SelectOption[] = [
  { value: 'name', label: 'Name' },
  { value: 'username', label: 'Username' },
  { value: 'designer', label: 'Designer' },
  { value: 'category', label: 'Category' },
  { value: 'technique', label: 'Technique' },
  { value: 'difficulty', label: 'Difficulty' },
  { value: 'description', label: 'Description' },
  { value: 'link', label: 'Pattern URL' },
  { value: 'imageUrl', label: 'Image URL' },
  { value: 'createdAt', label: 'Created At' },
  { value: 'updatedAt', label: 'Updated At' },
]

const sortFields: SelectOption[] = [
  { value: 'name', label: 'Name' },
  { value: 'createdAt', label: 'Created At' },
  { value: 'updatedAt', label: 'Updated At' },
]

export const AdminManagePatterns = () => {
  const { data: patterns, isPending, isError } = useGetAllPatterns()

  // State for filter and sort options
  const [filterField, setFilterField] = useState<FilterField>('name')
  const [filterText, setFilterText] = useState('')
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortDirection, setSortDirection] = useState<SortDirection>('ascending')

  // State for selected patterns and delete modal
  const [selectedPatternIds, setSelectedPatternIds] = useState<Set<number>>(
    new Set(),
  )
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const deletePatterns = useDeletePatterns()

  const selectedPatterns = useMemo(
    () =>
      patterns?.filter(({ pattern }) =>
        selectedPatternIds.has(pattern.patternId),
      ) ?? [],
    [patterns, selectedPatternIds],
  )

  const setPatternSelected = (patternId: number, selected: boolean) => {
    setSelectedPatternIds((current) => {
      const updated = new Set(current)

      if (selected) {
        updated.add(patternId)
      } else {
        updated.delete(patternId)
      }

      return updated
    })
  }

  const confirmDelete = () => {
    deletePatterns.mutate([...selectedPatternIds], {
      onSuccess: () => {
        setSelectedPatternIds(new Set())
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

  const visiblePatterns = useMemo(() => {
    if (!patterns) {
      return []
    }

    const normalizedFilter = filterText.trim().toLocaleLowerCase()
    const filteredPatterns = normalizedFilter
      ? patterns.filter(({ pattern }) => {
          const fieldValue = pattern[filterField]
          const searchableValue =
            filterField === 'createdAt' || filterField === 'updatedAt'
              ? `${fieldValue} ${new Date(String(fieldValue)).toLocaleString()}`
              : String(fieldValue ?? '')

          return searchableValue.toLocaleLowerCase().includes(normalizedFilter)
        })
      : patterns

    return [...filteredPatterns].sort((first, second) => {
      const firstValue = first.pattern[sortField]
      const secondValue = second.pattern[sortField]
      const comparison =
        sortField === 'name'
          ? firstValue.localeCompare(secondValue, undefined, {
              sensitivity: 'base',
            })
          : new Date(firstValue).getTime() - new Date(secondValue).getTime()

      return sortDirection === 'ascending' ? comparison : -comparison
    })
  }, [filterField, filterText, patterns, sortDirection, sortField])

  return (
    <div className="flex w-full max-w-6xl flex-col gap-5 md:self-center">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-0">
        <div>
          <h1>Manage Patterns</h1>
          <h4>Add, Update or Delete Patterns</h4>
        </div>
        <div className="flex grow flex-col justify-end gap-2 md:flex-row">
          {selectedPatternIds.size > 0 && (
            <div>
              <Button
                variant="tertiary"
                onClick={() => setSelectedPatternIds(new Set())}
              >
                <FontAwesomeIcon icon={faRotateLeft} />
                Reset
              </Button>
            </div>
          )}
          <div>
            <Button
              variant="secondary"
              disabled={selectedPatternIds.size === 0}
              onClick={openDeleteModal}
            >
              <FontAwesomeIcon icon={faTrash} />
              {selectedPatternIds.size === 0
                ? 'Delete Patterns'
                : `Delete ${selectedPatternIds.size} Patterns`}
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

      {patterns && patterns.length > 0 && (
        <FilterForm
          filterFields={filterFields}
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
              selected={selectedPatternIds.has(details.pattern.patternId)}
              onSelectedChange={(selected) =>
                setPatternSelected(details.pattern.patternId, selected)
              }
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
            {selectedPatterns.map(({ pattern }) => (
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
